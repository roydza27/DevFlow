import test, { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { setupTestDb, cleanupTestDb } from '../helpers/testDb.js';

let app;

describe('Timer API Integration Tests', () => {
  const projectId = 'test-proj-timer';

  before(async () => {
    setupTestDb();
    const appModule = await import('../../src/app/app.js');
    app = appModule.default;

    await request(app).post('/api/projects').send({ id: projectId, name: 'Timer Project' });
  });

  after(() => {
    cleanupTestDb();
  });

  it('PUT /api/projects/:id/timer - should update timer session state', async () => {
    const startTime = Date.now();
    const res = await request(app)
      .put(`/api/projects/${projectId}/timer`)
      .send({ startedAt: startTime, accumulated: 500, activeTaskId: 'active-task-123' });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Timer updated');

    const check = await request(app).get('/api/projects');
    const project = check.body.find(p => p.id === projectId);
    assert.ok(project.timer);
    assert.equal(project.timer.accumulated, 500);
    assert.equal(project.timer.activeTaskId, 'active-task-123');
    assert.equal(project.timer.startedAt, startTime);
  });
});
