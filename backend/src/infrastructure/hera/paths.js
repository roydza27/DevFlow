import os from 'node:os';
import path from 'node:path';

export function getHeraDataDir() {
  const dataHome = process.env.XDG_DATA_HOME;

  return dataHome
    ? path.join(dataHome, 'hera')
    : path.join(os.homedir(), '.local', 'share', 'hera');
}

export function getHeraStateDir() {
  return path.join(getHeraDataDir(), 'state');
}

export function getHeraStatePath(projectName) {
  if (!projectName || typeof projectName !== 'string') {
    throw new TypeError('projectName must be a non-empty string');
  }

  if (projectName !== path.basename(projectName)) {
    throw new TypeError('Invalid Hera project name');
  }

  return path.join(getHeraStateDir(), `${projectName}.json`);
}