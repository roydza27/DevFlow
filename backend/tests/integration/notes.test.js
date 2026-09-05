import test, { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { setupTestDb, cleanupTestDb } from '../helpers/testDb.js';

let app;

describe('Notes API Integration Tests', () => {
  const projectId = 'test-proj-notes';
  const noteId = 'note-custom-1';

  before(async () => {
    setupTestDb();
    const appModule = await import('../../src/app/app.js');
    app = appModule.default;

    await request(app).post('/api/projects').send({ id: projectId, name: 'Notes Project' });
  });

  after(() => {
    cleanupTestDb();
  });

  it('POST /api/projects/:id/notes - should add a new note', async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/notes`)
      .send({ id: noteId, title: 'Architecture Notes', content: 'Detailed design here' });

    assert.equal(res.status, 201);
    assert.equal(res.body.message, 'Note added');
  });

  it('PATCH /api/notes/:noteId - should update note title and content', async () => {
    const res = await request(app)
      .patch(`/api/notes/${noteId}`)
      .send({ title: 'Updated Architecture Notes', content: 'Revised content' });

    assert.equal(res.status, 200);
    assert.equal(res.body.message, 'Note updated');

    const check = await request(app).get('/api/projects');
    const project = check.body.find(p => p.id === projectId);
    const note = project.notes.find(n => n.id === noteId);
    assert.equal(note.title, 'Updated Architecture Notes');
    assert.equal(note.content, 'Revised content');
  });

  it('DELETE /api/notes/:noteId - should delete note', async () => {
    const res = await request(app).delete(`/api/notes/${noteId}`);
    assert.equal(res.status, 204);

    const check = await request(app).get('/api/projects');
    const project = check.body.find(p => p.id === projectId);
    const note = project.notes.find(n => n.id === noteId);
    assert.equal(note, undefined);
  });
});
