import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import { getDB } from '../config/sqlite.js';

const activeWatchers = new Map();

/**
 * Ensures `.devflow/` directory exists within a workspace folder
 * and initializes default workspace config file.
 */
export function initWorkspaceFolder(folderPath, projectData) {
  if (!folderPath || !fs.existsSync(folderPath)) return null;

  const devflowDir = path.join(folderPath, '.devflow');
  if (!fs.existsSync(devflowDir)) {
    fs.mkdirSync(devflowDir, { recursive: true });
  }

  const workspaceJsonPath = path.join(devflowDir, 'workspace.json');
  const payload = {
    id: projectData.id,
    name: projectData.name,
    linkedFolderName: path.basename(folderPath),
    updatedAt: Date.now()
  };

  fs.writeFileSync(workspaceJsonPath, JSON.stringify(payload, null, 2), 'utf-8');

  // Ensure notes directory exists inside linked folder
  const notesDir = path.join(folderPath, 'notes');
  if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir, { recursive: true });
  }

  return devflowDir;
}

/**
 * Setup filesystem watcher on project's linked folder
 */
export function watchWorkspaceFolder(projectId, folderPath) {
  if (!folderPath || !fs.existsSync(folderPath)) return;

  if (activeWatchers.has(projectId)) {
    activeWatchers.get(projectId).close();
  }

  const db = getDB();

  const watcher = chokidar.watch(folderPath, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles/dotfolders EXCEPT explicitly handled
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100
    }
  });

  watcher.on('add', (filePath) => handleFileChange(projectId, filePath, db));
  watcher.on('change', (filePath) => handleFileChange(projectId, filePath, db));
  watcher.on('unlink', (filePath) => handleFileDelete(projectId, filePath, db));

  activeWatchers.set(projectId, watcher);
}

/**
 * Stop and close all active file watchers
 */
export function stopAllWatchers() {
  for (const [projectId, watcher] of activeWatchers.entries()) {
    watcher.close();
  }
  activeWatchers.clear();
  console.log('All workspace watchers stopped.');
}

function handleFileChange(projectId, filePath, db) {
  if (!filePath.endsWith('.md')) return;

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const title = path.basename(filePath, '.md');
    const noteId = `note-${projectId}-${title}`;

    const stmt = db.prepare(`
      INSERT INTO notes (id, projectId, title, content, relativePath, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        content = excluded.content,
        updatedAt = excluded.updatedAt
    `);

    stmt.run(noteId, String(projectId), title, content, filePath, Date.now());
  } catch (err) {
    console.error(`[Watcher Error] Failed reading ${filePath}:`, err.message);
  }
}

function handleFileDelete(projectId, filePath, db) {
  if (!filePath.endsWith('.md')) return;

  try {
    const title = path.basename(filePath, '.md');
    const noteId = `note-${projectId}-${title}`;

    const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
    stmt.run(noteId);
  } catch (err) {
    console.error(`[Watcher Error] Failed deleting note for ${filePath}:`, err.message);
  }
}
