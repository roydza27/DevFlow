import path from 'path';
import os from 'os';

export const PORT = process.env.PORT || 3001;

export function getDataDir() {
  return process.env.DEVFLOW_DATA_DIR || path.join(os.homedir(), '.config', 'devflow');
}

export function getDbPath() {
  return path.join(getDataDir(), 'devflow.db');
}

export const WATCHER_CONFIG = {
  ignored: /(^|[\/\\])\../, // ignore dotfiles/dotfolders
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 300,
    pollInterval: 100
  }
};
