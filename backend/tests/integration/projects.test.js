import test, { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { setupTestDb, cleanupTestDb } from '../helpers/testDb.js';

let app;

describe('Projects API Integration Tests', () => {
  before(async () => {
    setupTestDb();
    const appModule = await import('../../src/app/app.js');
    app = appModule.default;
  });

  after(() => {
    cleanupTestDb();
  });

  const testProjId = 'test-proj-integration-1';

  it('POST /api/projects - should create a project with initial note and timer', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({ id: testProjId, name: 'Integration Project' });

    assert.equal(res.status, 201);
    assert.equal(res.body.id, testProjId);
    assert.equal(res.body.message, 'Project created');
  });

  it('GET /api/projects - should retrieve composite project structure', async () => {
    const res = await request(app).get('/api/projects');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    const project = res.body.find(p => p.id === testProjId);
    assert.ok(project);
    assert.equal(project.name, 'Integration Project');
    assert.ok(Array.isArray(project.tasks));
    assert.ok(Array.isArray(project.notes));
    assert.ok(project.notes.length >= 1); // default initial note
    assert.ok(Array.isArray(project.commands));
    assert.ok(Array.isArray(project.resources));
    assert.ok(Array.isArray(project.logs));
    assert.ok(project.timer);
  });

  it('PATCH /api/projects/:id - should update project metadata', async () => {
    const res = await request(app)
      .patch(`/api/projects/${testProjId}`)
      .send({ name: 'Updated Integration Project' });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Project updated');

    const check = await request(app).get('/api/projects');
    const project = check.body.find(p => p.id === testProjId);
    assert.equal(project.name, 'Updated Integration Project');
  });

  it('DELETE /api/projects/:id - should delete project and cascade', async () => {
    const res = await request(app).delete(`/api/projects/${testProjId}`);
    assert.equal(res.status, 204);

    const check = await request(app).get('/api/projects');
    const project = check.body.find(p => p.id === testProjId);
    assert.equal(project, undefined);
  });
});
