import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import request from 'supertest';
import { errorHandler } from '../../src/shared/middleware/errorHandler.js';

describe('Error Handler Middleware Unit Tests', () => {
  it('should handle standard errors with 500 status', async () => {
    const app = express();
    app.get('/test-error', (req, res, next) => {
      next(new Error('Test failure'));
    });
    app.use(errorHandler);

    const res = await request(app).get('/test-error');
    assert.equal(res.status, 500);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'INTERNAL_ERROR');
    assert.equal(res.body.error.message, 'Test failure');
  });

  it('should handle SQLite constraint errors with 400 status', async () => {
    const app = express();
    app.get('/test-sqlite-error', (req, res, next) => {
      const err = new Error('UNIQUE constraint failed: projects.id');
      err.code = 'SQLITE_CONSTRAINT_PRIMARYKEY';
      next(err);
    });
    app.use(errorHandler);

    const res = await request(app).get('/test-sqlite-error');
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error.code, 'SQLITE_CONSTRAINT_PRIMARYKEY');
    assert.equal(res.body.error.message, 'UNIQUE constraint failed: projects.id');
  });
});
