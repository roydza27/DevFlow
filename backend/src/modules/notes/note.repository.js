import { getDB } from '../../infrastructure/database/sqlite.js';

export function getNotesByProjectId(projectId) {
  const db = getDB();
  return db.prepare('SELECT * FROM notes WHERE projectId = ?').all(String(projectId));
}

export function addNote(projectId, note) {
  const db = getDB();
  db.prepare(`
    INSERT INTO notes (id, projectId, title, content, relativePath, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(String(note.id), String(projectId), note.title, note.content || '', note.relativePath || null, Date.now());
}

export function updateNote(noteId, data) {
  const db = getDB();
  const fields = [];
  const params = [];
  if (data.title !== undefined) { fields.push('title = ?'); params.push(data.title); }
  if (data.content !== undefined) { fields.push('content = ?'); params.push(data.content); }
  fields.push('updatedAt = ?'); params.push(Date.now());
  params.push(String(noteId));
  db.prepare(`UPDATE notes SET ${fields.join(', ')} WHERE id = ?`).run(...params);
}

export function deleteNote(noteId) {
  const db = getDB();
  db.prepare('DELETE FROM notes WHERE id = ?').run(String(noteId));
}

export function countNotes() {
  const db = getDB();
  return db.prepare('SELECT COUNT(*) as cnt FROM notes').get().cnt;
}
