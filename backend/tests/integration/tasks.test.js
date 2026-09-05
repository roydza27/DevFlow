import test, { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { setupTestDb, cleanupTestDb } from '../helpers/testDb.js';

let app;

describe('Tasks API Integration Tests', () => {
  const projectId = 'test-proj-tasks';
  const taskId1 = 'task-1';
  const taskId2 = 'task-2';

  before(async () => {
    setupTestDb();
    const appModule = await import('../../src/app/app.js');
    app = appModule.default;

    await request(app).post('/api/projects').send({ id: projectId, name: 'Task Project' });
  });

  after(() => {
    cleanupTestDb();
  });

  it('POST /api/projects/:id/tasks - should add a new task', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .send({ id: taskId1, title: 'Write unit tests', status: 'todo' });

    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'Task added');

    const res2 = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .send({ id: taskId2, title: 'Document tests', status: 'done' });

    assert.equal(res2.status, 201);
  });

  it('PATCH /api/tasks/:taskId - should update task details', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId1}`)
      .send({ status: 'doing', totalTime: 300, isRunning: true });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Task updated');

    const check = await request(app).get('/api/projects');
    const project = check.body.find(p => p.id === projectId);
    const task = project.tasks.find(t => t.id === taskId1);
    assert.equal(task.status, 'doing');
    assert.equal(task.totalTime, 300);
    assert.equal(task.isRunning, 1);
  });

  it('DELETE /api/projects/:id/tasks/completed - should archive done tasks', async () => {
    const res = await request(app).delete(`/api/projects/${projectId}/tasks/completed`);
    assert.equal(res.status, 204);

    const check = await request(app).get('/api/projects');
    const project = check.body.find(p => p.id === projectId);
    const task2 = project.tasks.find(t => t.id === taskId2);
    assert.equal(task2.status, 'archived');
  });

  it('DELETE /api/tasks/:taskId - should delete a specific task', async () => {
    const res = await request(app).delete(`/api/tasks/${taskId1}`);
    assert.equal(res.status, 204);

    const check = await request(app).get('/api/projects');
    const project = check.body.find(p => p.id === projectId);
    const task1 = project.tasks.find(t => t.id === taskId1);
    assert.equal(task1, undefined);
  });
});
