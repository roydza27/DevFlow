import fs from 'fs';
import path from 'path';
import os from 'os';
import { getDB, closeDB } from '../../src/infrastructure/database/sqlite.js';

let testDir = null;

export function setupTestDb() {
  closeDB();

  // Create unique isolated temp directory per suite
  testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'devflow-test-'));
  process.env.DEVFLOW_DATA_DIR = testDir;

  // Initialize fresh schema in isolated temp directory
  const db = getDB();

  return { db, testDir };
}

export function cleanupTestDb() {
  closeDB();
  if (testDir && fs.existsSync(testDir)) {
    try {
      fs.rmSync(testDir, { recursive: true, force: true });
    } catch {}
    testDir = null;
  }
}
