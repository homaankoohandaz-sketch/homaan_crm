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
