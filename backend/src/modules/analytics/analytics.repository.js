import fs from 'fs';
import { getDB } from '../../infrastructure/database/sqlite.js';

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
