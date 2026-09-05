import test, { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { setupTestDb, cleanupTestDb } from '../helpers/testDb.js';

let app;

describe('Logs API Integration Tests', () => {
  const projectId = 'test-proj-logs';
  const logId = 'log-1';

  before(async () => {
    setupTestDb();
    const appModule = await import('../../src/app/app.js');
    app = appModule.default;

    await request(app).post('/api/projects').send({ id: projectId, name: 'Logs Project' });
  });

  after(() => {
    cleanupTestDb();
  });

  it('POST /api/projects/:id/logs - should add an activity log', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/logs`)
      .send({ id: logId, message: 'Refactored backend architecture', type: 'info' });

    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'Log added');

    const check = await request(app).get('/api/projects');
    const project = check.body.find(p => p.id === projectId);
    const log = project.logs.find(l => l.id === logId);
    assert.ok(log);
    assert.equal(log.message, 'Refactored backend architecture');
  });

  it('DELETE /api/projects/:id/logs - should clear logs for project', async () => {
    const res = await request(app).delete(`/api/projects/${projectId}/logs`);
    assert.equal(res.status, 204);

    const check = await request(app).get('/api/projects');
    const project = check.body.find(p => p.id === projectId);
    assert.equal(project.logs.length, 0);
  });
});
