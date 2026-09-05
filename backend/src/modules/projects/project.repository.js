import { getDB } from '../../infrastructure/database/sqlite.js';

export function getAllProjectRows() {
  const db = getDB();
  return db.prepare('SELECT * FROM projects ORDER BY lastAccessed DESC').all();
}

export function createProject(id, name, linkedFolderName, createdAt) {
  const db = getDB();
  const insertProj = db.prepare(`
    INSERT INTO projects (id, name, linkedFolderName, lastAccessed, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertProj.run(String(id), name, linkedFolderName || null, createdAt, createdAt);
}

export function updateProject(id, data) {
  const db = getDB();
  if (data.name !== undefined) {
    db.prepare('UPDATE projects SET name = ? WHERE id = ?').run(data.name, String(id));
  }
  if (data.linkedFolderName !== undefined) {
    db.prepare('UPDATE projects SET linkedFolderName = ? WHERE id = ?').run(data.linkedFolderName, String(id));
  }
  if (data.lastAccessed !== undefined) {
    db.prepare('UPDATE projects SET lastAccessed = ? WHERE id = ?').run(data.lastAccessed, String(id));
  }
}

export function deleteProject(id) {
  const db = getDB();
  db.prepare('DELETE FROM projects WHERE id = ?').run(String(id));
}

export function countProjects() {
  const db = getDB();
  return db.prepare('SELECT COUNT(*) as cnt FROM projects').get().cnt;
}
