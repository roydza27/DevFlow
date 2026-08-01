import Database from 'better-sqlite3';
import fs from 'fs';
import { DATA_DIR, DB_PATH } from './env.js';

let db = null;

export function getDB() {
  if (db) return db;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  // Initialize Schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      linkedFolderName TEXT,
      lastAccessed INTEGER,
      createdAt INTEGER
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      projectId TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('todo', 'doing', 'blocked', 'done', 'archived')),
      totalTime INTEGER DEFAULT 0,
      startedAt INTEGER DEFAULT NULL,
      isRunning INTEGER DEFAULT 0,
      createdAt INTEGER,
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      projectId TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      relativePath TEXT,
      updatedAt INTEGER,
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS commands (
      id TEXT PRIMARY KEY,
      projectId TEXT NOT NULL,
      label TEXT NOT NULL,
      command TEXT NOT NULL,
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY,
      projectId TEXT NOT NULL,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      type TEXT DEFAULT 'reference',
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      projectId TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      timestamp TEXT NOT NULL,
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS timers (
      projectId TEXT PRIMARY KEY,
      startedAt INTEGER,
      accumulated INTEGER DEFAULT 0,
      activeTaskId TEXT,
      FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  // Column migrations
  try { db.exec('ALTER TABLE tasks ADD COLUMN totalTime INTEGER DEFAULT 0;'); } catch {}
  try { db.exec('ALTER TABLE tasks ADD COLUMN startedAt INTEGER DEFAULT NULL;'); } catch {}
  try { db.exec('ALTER TABLE tasks ADD COLUMN isRunning INTEGER DEFAULT 0;'); } catch {}

  console.log(`SQLite DB initialized at: ${DB_PATH}`);
  return db;
}

export function closeDB() {
  if (db) {
    db.close();
    db = null;
    console.log('SQLite DB connection closed.');
  }
}
