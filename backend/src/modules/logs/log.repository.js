import { getDB } from '../../infrastructure/database/sqlite.js';

export function getLogsByProjectId(projectId, limit = 200) {
  const db = getDB();
  return db.prepare('SELECT * FROM logs WHERE projectId = ? ORDER BY id DESC LIMIT ?').all(String(projectId), limit);
}

export function addLog(projectId, log) {
  const db = getDB();
  db.prepare(`
    INSERT INTO logs (id, projectId, message, type, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `).run(String(log.id), String(projectId), log.message, log.type || 'info', log.timestamp || new Date().toISOString());
}

export function clearLogs(projectId) {
  const db = getDB();
  db.prepare('DELETE FROM logs WHERE projectId = ?').run(String(projectId));
}

export function countLogs() {
  const db = getDB();
  return db.prepare('SELECT COUNT(*) as cnt FROM logs').get().cnt;
}
