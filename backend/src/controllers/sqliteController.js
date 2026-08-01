import fs from 'fs';
import { getDB } from '../config/sqlite.js';

export function getAllProjects() {
  const db = getDB();
  const projects = db.prepare('SELECT * FROM projects ORDER BY lastAccessed DESC').all();

  return projects.map(p => {
    const tasks = db.prepare('SELECT * FROM tasks WHERE projectId = ?').all(p.id);
    const notes = db.prepare('SELECT * FROM notes WHERE projectId = ?').all(p.id);
    const commands = db.prepare('SELECT * FROM commands WHERE projectId = ?').all(p.id);
    const resources = db.prepare('SELECT * FROM resources WHERE projectId = ?').all(p.id);
    const logs = db.prepare('SELECT * FROM logs WHERE projectId = ? ORDER BY id DESC LIMIT 200').all(p.id);
    const timerRow = db.prepare('SELECT * FROM timers WHERE projectId = ?').get(p.id);

    return {
      ...p,
      tasks,
      notes,
      commands,
      resources,
      logs,
      timer: timerRow || { startedAt: null, accumulated: 0, activeTaskId: null }
    };
  });
}

export function createProjectData(data) {
  const db = getDB();
  const id = String(data.id || Date.now());
  const now = Date.now();

  const insertProj = db.prepare(`
    INSERT INTO projects (id, name, linkedFolderName, lastAccessed, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertProj.run(id, data.name, data.linkedFolderName || null, now, now);

  // Initialize timer row
  db.prepare(`
    INSERT INTO timers (projectId, startedAt, accumulated, activeTaskId)
    VALUES (?, NULL, 0, NULL)
  `).run(id);

  // Default initial note
  db.prepare(`
    INSERT INTO notes (id, projectId, title, content, updatedAt)
    VALUES (?, ?, ?, ?, ?)
  `).run(`${id}-1`, id, 'Project Notes', '', now);

  return id;
}

export function updateProjectData(id, data) {
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

export function deleteProjectData(id) {
  const db = getDB();
  db.prepare('DELETE FROM projects WHERE id = ?').run(String(id));
}

// ─── Task Actions ─────────────────────────────────────────────────────────────
export function addTaskData(projectId, task) {
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

export function updateTaskData(taskId, data) {
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

export function deleteTaskData(taskId) {
  const db = getDB();
  db.prepare('DELETE FROM tasks WHERE id = ?').run(String(taskId));
}

export function clearDoneTasksData(projectId) {
  const db = getDB();
  db.prepare("UPDATE tasks SET status = 'archived' WHERE projectId = ? AND status = 'done'").run(String(projectId));
}

// ─── Note Actions ─────────────────────────────────────────────────────────────
export function addNoteData(projectId, note) {
  const db = getDB();
  db.prepare(`
    INSERT INTO notes (id, projectId, title, content, relativePath, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(String(note.id), String(projectId), note.title, note.content || '', note.relativePath || null, Date.now());
}

export function updateNoteData(noteId, data) {
  const db = getDB();
  const fields = [];
  const params = [];
  if (data.title !== undefined) { fields.push('title = ?'); params.push(data.title); }
  if (data.content !== undefined) { fields.push('content = ?'); params.push(data.content); }
  fields.push('updatedAt = ?'); params.push(Date.now());
  params.push(String(noteId));
  db.prepare(`UPDATE notes SET ${fields.join(', ')} WHERE id = ?`).run(...params);
}

export function deleteNoteData(noteId) {
  const db = getDB();
  db.prepare('DELETE FROM notes WHERE id = ?').run(String(noteId));
}

// ─── Command Actions ──────────────────────────────────────────────────────────
export function addCommandData(projectId, cmd) {
  const db = getDB();
  db.prepare(`
    INSERT INTO commands (id, projectId, label, command)
    VALUES (?, ?, ?, ?)
  `).run(String(cmd.id), String(projectId), cmd.label, cmd.command);
}

export function deleteCommandData(cmdId) {
  const db = getDB();
  db.prepare('DELETE FROM commands WHERE id = ?').run(String(cmdId));
}

// ─── Resource Actions ─────────────────────────────────────────────────────────
export function addResourceData(projectId, res) {
  const db = getDB();
  db.prepare(`
    INSERT INTO resources (id, projectId, title, url, type)
    VALUES (?, ?, ?, ?, ?)
  `).run(String(res.id), String(projectId), res.title, res.url, res.type || 'reference');
}

export function deleteResourceData(resId) {
  const db = getDB();
  db.prepare('DELETE FROM resources WHERE id = ?').run(String(resId));
}

// ─── Log Actions ──────────────────────────────────────────────────────────────
export function addLogData(projectId, log) {
  const db = getDB();
  db.prepare(`
    INSERT INTO logs (id, projectId, message, type, timestamp)
    VALUES (?, ?, ?, ?, ?)
  `).run(String(log.id), String(projectId), log.message, log.type || 'info', log.timestamp || new Date().toISOString());
}

export function clearLogsData(projectId) {
  const db = getDB();
  db.prepare('DELETE FROM logs WHERE projectId = ?').run(String(projectId));
}

// ─── Timer Actions ────────────────────────────────────────────────────────────
export function updateTimerData(projectId, timer) {
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

export function getStorageStats() {
  const db = getDB();
  const dbPath = db.name;
  let bytes = 0;
  try {
    if (fs.existsSync(dbPath)) bytes += fs.statSync(dbPath).size;
    if (fs.existsSync(`${dbPath}-wal`)) bytes += fs.statSync(`${dbPath}-wal`).size;
  } catch {}

  const counts = {
    projects: db.prepare('SELECT COUNT(*) as cnt FROM projects').get().cnt,
    tasks: db.prepare('SELECT COUNT(*) as cnt FROM tasks').get().cnt,
    notes: db.prepare('SELECT COUNT(*) as cnt FROM notes').get().cnt,
    logs: db.prepare('SELECT COUNT(*) as cnt FROM logs').get().cnt,
  };

  return {
    dbSizeBytes: bytes,
    dbSizeFormatted: (bytes / 1024).toFixed(1) + ' KB',
    counts
  };
}
