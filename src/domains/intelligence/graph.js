/* BuildWise AI — canonical Real Estate Intelligence Graph: graph + persistence + sync. */

/* BuildWise AI — Real Estate Intelligence Graph primitives. Dependency-free and browser safe. */
(function(global){
  'use strict';
  const key=v=>String(v??'').trim();
  const nodeKey=(type,id)=>type+':'+key(id);
  function node(type,id,data={}){return {key:nodeKey(type,id),type,id,data};}
  function edge(fromType,fromId,relation,toType,toId,meta={}){
    return {from:nodeKey(fromType,fromId),relation,to:nodeKey(toType,toId),meta};
  }
  function buildGraph(records={}){
    const nodes=[],edges=[];
    const add=(type,items)=> (items||[]).forEach(x=>{
      const id=x.id??x.uuid??x.phone??x.code;
      if(id!==undefined&&id!==null) nodes.push(node(type,id,x));
    });
    Object.entries(records).forEach(([type,items])=>add(type,items));
    const link=(a,b,rel,meta={})=>{if(a&&b)edges.push(edge(a.type,a.id,rel,b.type,b.id,meta));};
    (records.relationships||[]).forEach(r=>link({type:r.from_type,id:r.from_id},{type:r.to_type,id:r.to_id},r.relation,r.metadata));
    return {nodes,edges};
  }
  function neighbors(graph,type,id,relation){
    const k=nodeKey(type,id);
    return graph.edges.filter(e=>(e.from===k||e.to===k)&&(!relation||e.relation===relation));
  }
  function pathExists(graph,a,b,maxDepth=4){
    const target=nodeKey(b.type,b.id), start=nodeKey(a.type,a.id), q=[[start,0]], seen=new Set([start]);
    while(q.length){const [cur,d]=q.shift();if(cur===target)return true;if(d>=maxDepth)continue;
      for(const e of graph.edges){const next=e.from===cur?e.to:e.to===cur?e.from:null;if(next&&!seen.has(next)){seen.add(next);q.push([next,d+1]);}}
    } return false;
  }
  global.BuildWiseGraph={node,edge,buildGraph,neighbors,pathExists,nodeKey};
})(window);


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


/* BuildWise AI — manager-triggered graph synchronization. */
(function(global){
 'use strict';
 async function syncProperties(limit=5000){
   if(!global.db) throw new Error('database_unavailable');
   const {data,error}=await global.db.rpc('reos_sync_property_graph',{p_limit:limit});
   if(error) throw error;
   return data;
 }
 async function refreshProperty(property){
   if(!global.BuildWiseGraphStore) throw new Error('graph_store_unavailable');
   return global.BuildWiseGraphStore.syncProperty(property);
 }
 global.BuildWiseGraphSync={syncProperties,refreshProperty};
})(window);

