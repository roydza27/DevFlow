import test, { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { setupTestDb, cleanupTestDb } from '../helpers/testDb.js';

let app;

describe('Resources API Integration Tests', () => {
  const projectId = 'test-proj-resources';
  const resourceId = 'res-1';

  before(async () => {
    setupTestDb();
    const appModule = await import('../../src/app/app.js');
    app = appModule.default;

    await request(app).post('/api/projects').send({ id: projectId, name: 'Resource Project' });
  });

  after(() => {
    cleanupTestDb();
  });

  it('POST /api/projects/:id/resources - should add a resource', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/resources`)
      .send({ id: resourceId, title: 'Figma UI', url: 'https://figma.com/file/123', type: 'figma' });

    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'Resource added');
  });

  it('DELETE /api/resources/:resourceId - should delete resource', async () => {
    const res = await request(app).delete(`/api/resources/${resourceId}`);
    assert.equal(res.status, 204);

    const check = await request(app).get('/api/projects');
    const project = check.body.find(p => p.id === projectId);
    const resource = project.resources.find(r => r.id === resourceId);
    assert.equal(resource, undefined);
  });
});
