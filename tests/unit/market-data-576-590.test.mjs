import test from 'node:test';
import assert from 'node:assert/strict';
import {registerSource,createMarketSnapshot,selectFallbackSnapshot} from '../../src/market/market-data.js';

test('576-585 source registry records timestamp and reliability',()=>{
  const s=registerSource({name:'gold',url:'provider://gold',reliability:0.9,observedAt:'2026-10-02T06:00:00Z'});
  assert.equal(s.name,'gold'); assert.equal(s.reliability,0.9); assert.equal(s.observedAt,'2026-10-02T06:00:00Z');
});

test('586-589 market snapshots are immutable normalized records',()=>{
  const s=createMarketSnapshot({source:'crm',asset:'property',value:12000000000,currency:'IRR',observedAt:'2026-10-02T06:00:00Z'});
  assert.equal(s.asset,'property'); assert.equal(s.value,12000000000); assert.equal(s.currency,'IRR'); assert.ok(s.id);
});

test('590 external failure falls back to the latest valid snapshot',()=>{
  const out=selectFallbackSnapshot([{value:10,valid:true,observedAt:'2026-10-01'},{value:12,valid:false,observedAt:'2026-10-02'},{value:11,valid:true,observedAt:'2026-10-02'}]);
  assert.equal(out.value,11);
});
