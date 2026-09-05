import test, { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { setupTestDb, cleanupTestDb } from '../helpers/testDb.js';

let app;

describe('GET /api/stats Integration Tests', () => {
  before(async () => {
    setupTestDb();
    const appModule = await import('../../src/app/app.js');
    app = appModule.default;
  });

  after(() => {
    cleanupTestDb();
  });

  it('should return storage metrics and table counts', async () => {
    const res = await request(app).get('/api/stats');
    assert.equal(res.status, 200);
    assert.ok('dbSizeBytes' in res.body);
    assert.ok('dbSizeFormatted' in res.body);
    assert.ok('counts' in res.body);
    assert.equal(typeof res.body.counts.projects, 'number');
    assert.equal(typeof res.body.counts.tasks, 'number');
    assert.equal(typeof res.body.counts.notes, 'number');
    assert.equal(typeof res.body.counts.logs, 'number');
  });
});
