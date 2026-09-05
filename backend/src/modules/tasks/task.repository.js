import { getDB } from '../../infrastructure/database/sqlite.js';

export function getTasksByProjectId(projectId) {
  const db = getDB();
  return db.prepare('SELECT * FROM tasks WHERE projectId = ?').all(String(projectId));
}

export function addTask(projectId, task) {
  const db = getDB();
  db.prepare(`
    INSERT INTO tasks (id, projectId, title, status, totalTime, startedAt, isRunning, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    String(task.id),
    String(projectId),
    task.title,
    task.status || 'todo',
    task.totalTime || 0,
    task.startedAt || null,
    task.isRunning ? 1 : 0,
    Date.now()
  );
}

export function updateTask(taskId, data) {
  const db = getDB();
  const fields = [];
  const params = [];
  if (data.title !== undefined) { fields.push('title = ?'); params.push(data.title); }
  if (data.status !== undefined) { fields.push('status = ?'); params.push(data.status); }
  if (data.totalTime !== undefined) { fields.push('totalTime = ?'); params.push(data.totalTime); }
  if (data.startedAt !== undefined) { fields.push('startedAt = ?'); params.push(data.startedAt); }
  if (data.isRunning !== undefined) { fields.push('isRunning = ?'); params.push(data.isRunning ? 1 : 0); }
  if (fields.length > 0) {
    params.push(String(taskId));
    db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`).run(...params);
  }
}

export function deleteTask(taskId) {
  const db = getDB();
  db.prepare('DELETE FROM tasks WHERE id = ?').run(String(taskId));
}

export function clearDoneTasks(projectId) {
  const db = getDB();
  db.prepare("UPDATE tasks SET status = 'archived' WHERE projectId = ? AND status = 'done'").run(String(projectId));
}

export function countTasks() {
  const db = getDB();
  return db.prepare('SELECT COUNT(*) as cnt FROM tasks').get().cnt;
}
