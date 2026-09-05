import test, { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { setupTestDb, cleanupTestDb } from '../helpers/testDb.js';

let app;

describe('Commands API Integration Tests', () => {
  const projectId = 'test-proj-commands';
  const commandId = 'cmd-1';

  before(async () => {
    setupTestDb();
    const appModule = await import('../../src/app/app.js');
    app = appModule.default;

    await request(app).post('/api/projects').send({ id: projectId, name: 'Command Project' });
  });

  after(() => {
    cleanupTestDb();
  });

  it('POST /api/projects/:id/commands - should add a project command', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/commands`)
      .send({ id: commandId, label: 'Run Dev Server', command: 'npm run dev' });

    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'Command added');
  });

  it('DELETE /api/commands/:commandId - should delete command', async () => {
    const res = await request(app).delete(`/api/commands/${commandId}`);
    assert.equal(res.status, 204);

    const check = await request(app).get('/api/projects');
    const project = check.body.find(p => p.id === projectId);
    const cmd = project.commands.find(c => c.id === commandId);
    assert.equal(cmd, undefined);
  });
});
