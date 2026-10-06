import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ui = fs.readFileSync(new URL('../src/ui/task-engine-ui.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../buildwise-app.js', import.meta.url), 'utf8');

test('task UI binds the canonical Task Engine actions', () => {
  for (const name of ['createTask','respondToTask','completeTask','rejectTask','moveTaskToTomorrow','setTaskStarred','setTaskPriority','configureTaskNotification','listDueTodayTasks','listOverdueTasks','listStarredTasks']) {
    assert.match(ui, new RegExp(name));
  }
  for (const action of ['taskRespond','taskComplete','taskMoveTomorrow','taskToggleStar']) assert.match(ui, new RegExp(action));
});

test('task UI exposes a single Task Center route and does not create a second table', () => {
  assert.match(app, /\['tasks','پیگیری‌ها'/);
  assert.match(app, /taskCenter/);
  assert.doesNotMatch(ui, /from\(['"]task_/);
  assert.doesNotMatch(ui, /create table/i);
});

console.log('task engine UI binding contract: PASS');
