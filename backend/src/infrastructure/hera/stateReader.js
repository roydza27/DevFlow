import { readFile } from 'node:fs/promises';

import { getHeraStatePath } from './paths.js';
import {
  HeraStateNotFoundError,
  HeraStateParseError,
} from './errors.js';
import { validateHeraState } from './stateValidator.js';

export async function readHeraStateFromPath(statePath) {
  let raw;

  try {
    raw = await readFile(statePath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new HeraStateNotFoundError(statePath);
    }

    throw error;
  }

  let state;

  try {
    state = JSON.parse(raw);
  } catch (error) {
    throw new HeraStateParseError(statePath, error);
  }

  return validateHeraState(state);
}

export async function readHeraState(projectName) {
  return readHeraStateFromPath(getHeraStatePath(projectName));
}