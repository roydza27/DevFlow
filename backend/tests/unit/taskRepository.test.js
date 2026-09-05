import test, { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { setupTestDb, cleanupTestDb } from '../helpers/testDb.js';
import * as taskRepo from '../../src/modules/tasks/task.repository.js';
import * as projectRepo from '../../src/modules/projects/project.repository.js';

describe('Task Repository Unit Tests', () => {
  const projectId = 'repo-test-proj-' + Date.now();
  const taskId = 'repo-task-1';

  before(() => {
    setupTestDb();
    projectRepo.createProject(projectId, 'Repo Project', null, Date.now());
  });

  after(() => {
    cleanupTestDb();
  });

  it('should insert and retrieve a task by project id', () => {
    taskRepo.addTask(projectId, {
      id: taskId,
      title: 'Repository Level Task',
      status: 'todo',
      totalTime: 0,
      isRunning: false
    });

    const tasks = taskRepo.getTasksByProjectId(projectId);
    assert.equal(tasks.length, 1);
    assert.equal(tasks[0].id, taskId);
    assert.equal(tasks[0].title, 'Repository Level Task');
    assert.equal(tasks[0].status, 'todo');
  });

  it('should update task status and totalTime', () => {
    taskRepo.updateTask(taskId, {
      status: 'doing',
      totalTime: 450,
      isRunning: true
    });

    const tasks = taskRepo.getTasksByProjectId(projectId);
    assert.equal(tasks[0].status, 'doing');
    assert.equal(tasks[0].totalTime, 450);
    assert.equal(tasks[0].isRunning, 1);
  });

  it('should clear done tasks by setting status to archived', () => {
    taskRepo.updateTask(taskId, { status: 'done' });
    taskRepo.clearDoneTasks(projectId);

    const tasks = taskRepo.getTasksByProjectId(projectId);
    assert.equal(tasks[0].status, 'archived');
  });

  it('should delete task by id', () => {
    taskRepo.deleteTask(taskId);
    const tasks = taskRepo.getTasksByProjectId(projectId);
    assert.equal(tasks.length, 0);
  });
});
