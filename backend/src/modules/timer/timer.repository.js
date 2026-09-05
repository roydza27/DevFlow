import { getDB } from '../../infrastructure/database/sqlite.js';

export function getTimerByProjectId(projectId) {
  const db = getDB();
  return db.prepare('SELECT * FROM timers WHERE projectId = ?').get(String(projectId));
}

export function initTimer(projectId) {
  const db = getDB();
  db.prepare(`
    INSERT INTO timers (projectId, startedAt, accumulated, activeTaskId)
    VALUES (?, NULL, 0, NULL)
  `).run(String(projectId));
}

export function updateTimer(projectId, timer) {
  const db = getDB();
  db.prepare(`
    INSERT INTO timers (projectId, startedAt, accumulated, activeTaskId)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(projectId) DO UPDATE SET
      startedAt = excluded.startedAt,
      accumulated = excluded.accumulated,
      activeTaskId = excluded.activeTaskId
  `).run(String(projectId), timer.startedAt || null, timer.accumulated || 0, timer.activeTaskId || null);
}
