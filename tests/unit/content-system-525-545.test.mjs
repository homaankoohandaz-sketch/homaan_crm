import test from 'node:test';
import assert from 'node:assert/strict';
import {buildBrandSystem, buildLaunchCalendar, createLeadCaptureEvent, buildContentBrief} from '../../src/marketing/content-system.js';

test('525-528 brand system exposes canonical identity primitives',()=>{
  const b=buildBrandSystem();
  assert.equal(b.name,'BuildWise AI');
  assert.ok(b.logo);
  assert.ok(b.visual);
  assert.ok(b.guidelines);
});

test('529-540 content system covers channel formats',()=>{
  const b=buildContentBrief({topic:'کنترل پروژه',format:'reel',channel:'instagram'});
  assert.equal(b.brand,'BuildWise AI');
  assert.equal(b.channel,'instagram');
  assert.equal(b.format,'reel');
  assert.ok(b.hook);
  assert.ok(b.cta);
});

test('541-542 launch calendar returns ordered campaign slots',()=>{
  const c=buildLaunchCalendar([{date:'2026-10-04',title:'A'},{date:'2026-10-02',title:'B'}]);
  assert.deepEqual(c.map(x=>x.title),['B','A']);
});

test('543-545 lead capture event normalizes landing-to-CRM attribution',()=>{
  const e=createLeadCaptureEvent({source:'landing',campaign:'launch-01',requestId:'r1'});
  assert.equal(e.destination,'crm');
  assert.equal(e.source,'landing');
  assert.equal(e.campaign,'launch-01');
  assert.equal(e.requestId,'r1');
});
