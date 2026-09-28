import assert from 'node:assert/strict';
import { createProjectNode, validateProjectHierarchy, getProjectChildren } from '../../src/domains/construction/project-model.js';

const nodes = [
  createProjectNode({ id:'p1', name:'پروژه اصلی', type:'project' }, { now:'2026-09-28T07:00:00.000Z' }),
  createProjectNode({ id:'b1', name:'ساختمان A', type:'building', parent_id:'p1' }),
  createProjectNode({ id:'ph1', name:'فاز سازه', type:'phase', parent_id:'b1', sort_order:2 }),
  createProjectNode({ id:'ph2', name:'فاز معماری', type:'phase', parent_id:'b1', sort_order:1 }),
  createProjectNode({ id:'f1', name:'طبقه ۱', type:'floor', parent_id:'ph1' }),
  createProjectNode({ id:'u1', name:'واحد ۱', type:'unit', parent_id:'f1' }),
];
assert.equal(nodes[0].status, 'planned');
assert.equal(nodes[0].created_at, '2026-09-28T07:00:00.000Z');
assert.deepEqual(validateProjectHierarchy(nodes), { valid:true, roots:['p1'] });
assert.deepEqual(getProjectChildren(nodes, 'b1').map(x=>x.id), ['ph2','ph1']);
assert.equal(validateProjectHierarchy([...nodes, { id:'bad', name:'bad', type:'unit', parent_id:'missing' }]).error, 'missing_parent');
assert.equal(validateProjectHierarchy([{ id:'p1', type:'project' }, { id:'p1', type:'project' }]).error, 'duplicate_node_id');
assert.equal(validateProjectHierarchy([{ id:'p1', type:'project', parent_id:'u1' }, { id:'u1', type:'unit', parent_id:'p1' }]).error, 'invalid_parent_type');
console.log('phase04 project model tests: PASS');