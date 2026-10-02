import test from 'node:test';
import assert from 'node:assert/strict';
import {buildProductionJob,buildLandVisualizationSpec,buildExportProfile} from '../../src/marketing/content-bot.js';

test('546-553 production bot normalizes prompt outputs',()=>{
  const j=buildProductionJob({prompt:'معرفی یک زمین',outputs:['video','image','caption','hashtags','thumbnail','voiceover']});
  assert.equal(j.brand,'BuildWise AI');
  assert.deepEqual(j.outputs,['video','image','caption','hashtags','thumbnail','voiceover']);
  assert.ok(j.safeBrief);
});

test('555-564 land visualization preserves geometry inputs',()=>{
  const s=buildLandVisualizationSpec({landLength:30,landWidth:12,streetWidth:10,aerialImage:'aerial.jpg'});
  assert.equal(s.length,30); assert.equal(s.width,12); assert.equal(s.streetWidth,10);
  assert.equal(s.dimensionLines,true); assert.equal(s.massing,true);
});

test('565-575 exports are channel-ready and brand-consistent',()=>{
  assert.deepEqual(buildExportProfile('instagram'),{channel:'instagram',format:'reel',aspect:'9:16',brand:'BuildWise AI'});
  assert.deepEqual(buildExportProfile('youtube'),{channel:'youtube',format:'video',aspect:'16:9',brand:'BuildWise AI'});
});
