import test from 'node:test';
import assert from 'node:assert/strict';
import { createContentBriefModel } from '../../src/domains/marketing/content-brief.js';

test('content brief normalizes channel objective and facts', () => {
 const model=createContentBriefModel();
 const result=model.create({title:'project',channel:'instagram',objective:'lead',facts:{area:1200,region:1},cta:'call'});
 assert.equal(result.channel,'instagram'); assert.equal(result.objective,'lead'); assert.equal(result.facts.area,1200); assert.equal(result.cta,'call');
});

test('content brief rejects unsupported channels', () => {
 const model=createContentBriefModel();
 assert.throws(() => model.create({title:'x',channel:'unknown',objective:'lead'}), /invalid channel/);
});
