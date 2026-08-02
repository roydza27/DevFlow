import path from 'path';
import os from 'os';

export const PORT = process.env.PORT || 3001;

export const DATA_DIR = process.env.DEVFLOW_DATA_DIR || path.join(os.homedir(), '.config', 'devflow');

export const DB_PATH = path.join(DATA_DIR, 'devflow.db');

export const WATCHER_CONFIG = {
  ignored: /(^|[\/\\])\../, // ignore dotfiles/dotfolders
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 300,
    pollInterval: 100
  }
};
