import test from 'node:test';
import assert from 'node:assert/strict';
import { createMediaAssetModel } from '../../src/domains/portal/media-assets.js';

test('media asset model validates showroom asset types', () => {
 const m=createMediaAssetModel();
 const x=m.create({name:'hero',type:'3d',url:'https://example.invalid/a.glb',projectId:'p1'});
 assert.equal(x.type,'3d'); assert.equal(x.projectId,'p1'); assert.equal(x.url,'https://example.invalid/a.glb');
});

test('media asset model rejects unknown types', () => {
 const m=createMediaAssetModel(); assert.throws(()=>m.create({name:'x',type:'unknown'}),/invalid asset type/);
});
