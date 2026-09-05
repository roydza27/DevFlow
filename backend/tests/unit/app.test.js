import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../../src/app/app.js';

describe('App Composition & Middleware Unit Tests', () => {
  it('should respond with 404 for non-existent non-API routes', async () => {
    const res = await request(app).get('/unknown-endpoint');
    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { message: 'API route not found' });
  });

  it('should respond with 404 for non-existent /api subroutes', async () => {
    const res = await request(app).get('/api/does-not-exist');
    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { message: 'API route not found' });
  });
});
