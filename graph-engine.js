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
