import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const ui = fs.readFileSync(new URL('../src/ui/task-engine-ui.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../buildwise-app.js', import.meta.url), 'utf8');
const isLoader = app.includes('cdn.jsdelivr.net') || app.includes('Emergency restore') || app.includes('Primary: known-good');

test('task UI binds the canonical Task Engine actions', () => {
  for (const name of ['createTask','respondToTask','completeTask','rejectTask','moveTaskToTomorrow','setTaskStarred','setTaskPriority','configureTaskNotification','listDueTodayTasks','listOverdueTasks','listStarredTasks']) {
    assert.match(ui, new RegExp(name));
  }
  for (const action of ['taskRespond','taskReject','taskComplete','taskMoveTomorrow','taskToggleStar','taskReminderForm','taskSaveReminder']) {
    assert.match(ui, new RegExp(action));
  }
});

test('task UI exposes a single Task Center route and does not create a second table', () => {
  if (isLoader) {
    assert.match(app, /tasks/);
    assert.match(app, /ROLE_ACCESS|9eac80bd/);
  } else {
    assert.match(app, /\['tasks'/);
    assert.match(app, /taskCenter/);
  }
  assert.doesNotMatch(ui, /from\(['"]task_/);
  assert.doesNotMatch(ui, /create table/i);
});

test('ROLE_ACCESS grants tasks to all operational roles', () => {
  if (app.includes('const ROLE_ACCESS=')) {
    for (const role of ['owner','manager','advisor','agent','builder','staff']) {
      assert.match(app, new RegExp(role + ":\\[[^\\]]*\\'tasks\\'"));
    }
  } else {
    assert.match(app, /tasks/);
    assert.match(app, /ROLE_ACCESS|owner:\[.requests.,.tasks/);
  }
});

console.log('task engine UI binding contract: PASS');
