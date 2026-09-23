/* BuildWise AI — persistence adapter for the Real Estate Intelligence Graph. */
(function(global){
 'use strict';
 async function upsertNode(node){
  if(!global.db) throw new Error('database_unavailable');
  const r=await global.db.from('reos_graph_nodes').upsert({node_type:node.type,entity_id:String(node.id),label:node.data?.name||node.data?.title||node.data?.full_name||null,properties:node.data||{}},{onConflict:'node_type,entity_id'}).select('id,node_type,entity_id').single();
  if(r.error) throw r.error; return r.data;
 }
 async function linkNodes(from,to,relation,metadata={}){
  const [a,b]=await Promise.all([upsertNode(from),upsertNode(to)]);
  const r=await global.db.from('reos_graph_edges').upsert({from_node_id:a.id,to_node_id:b.id,relation,metadata},{onConflict:'from_node_id,to_node_id,relation'}).select('*').single();
  if(r.error) throw r.error; return r.data;
 }
 async function syncProperty(property){
  const p=await upsertNode({type:'property',id:property.id,data:property});
  if(property.owner_id!=null) await linkNodes({type:'property',id:property.id,data:property},{type:'owner',id:property.owner_id,data:{name:property.owner_name}},'owned_by');
  return p;
 }
 async function getNeighborhood(nodeType,nodeId){
  const n=await global.db.from('reos_graph_nodes').select('id').eq('node_type',nodeType).eq('entity_id',String(nodeId)).maybeSingle();
  if(n.error) throw n.error; if(!n.data)return [];
  const r=await global.db.from('reos_graph_edges').select('relation,from_node_id,to_node_id').or('from_node_id.eq.'+n.data.id+',to_node_id.eq.'+n.data.id);
  if(r.error)throw r.error;
  const ids=[...new Set((r.data||[]).flatMap(e=>[e.from_node_id,e.to_node_id]).filter(x=>x!==n.data.id))];
  if(!ids.length)return [];
  const q=await global.db.from('reos_graph_nodes').select('id,node_type,entity_id,label,properties').in('id',ids); if(q.error)throw q.error;
  return q.data||[];
 }
 global.BuildWiseGraphStore={upsertNode,linkNodes,syncProperty,getNeighborhood};
})(window);
