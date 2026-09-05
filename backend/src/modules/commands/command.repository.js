import { getDB } from '../../infrastructure/database/sqlite.js';

export function getCommandsByProjectId(projectId) {
  const db = getDB();
  return db.prepare('SELECT * FROM commands WHERE projectId = ?').all(String(projectId));
}

export function addCommand(projectId, cmd) {
  const db = getDB();
  db.prepare(`
    INSERT INTO commands (id, projectId, label, command)
    VALUES (?, ?, ?, ?)
  `).run(String(cmd.id), String(projectId), cmd.label, cmd.command);
}

export function deleteCommand(commandId) {
  const db = getDB();
  db.prepare('DELETE FROM commands WHERE id = ?').run(String(commandId));
}
