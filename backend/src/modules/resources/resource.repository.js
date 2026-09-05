import { getDB } from '../../infrastructure/database/sqlite.js';

export function getResourcesByProjectId(projectId) {
  const db = getDB();
  return db.prepare('SELECT * FROM resources WHERE projectId = ?').all(String(projectId));
}

export function addResource(projectId, res) {
  const db = getDB();
  db.prepare(`
    INSERT INTO resources (id, projectId, title, url, type)
    VALUES (?, ?, ?, ?, ?)
  `).run(String(res.id), String(projectId), res.title, res.url, res.type || 'reference');
}

export function deleteResource(resourceId) {
  const db = getDB();
  db.prepare('DELETE FROM resources WHERE id = ?').run(String(resourceId));
}
