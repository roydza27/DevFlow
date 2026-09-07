import path from 'node:path';
import { mkdir, readdir } from 'node:fs/promises';
import chokidar from 'chokidar';

import { getHeraStateDir } from './paths.js';
import { readHeraStateFromPath } from './stateReader.js';
import { HeraStateNotFoundError } from './errors.js';

export class HeraStateWatcher {
  #stateDir;
  #cache;
  #watcher = null;
  #readState;
  #logger;

  constructor({
    stateDir = getHeraStateDir(),
    cache,
    readState = readHeraStateFromPath,
    logger = console,
  } = {}) {
    if (!cache) {
      throw new TypeError('HeraStateWatcher requires a cache');
    }

    this.#stateDir = stateDir;
    this.#cache = cache;
    this.#readState = readState;
    this.#logger = logger;
  }

  async start() {
    if (this.#watcher) {
      return;
    }

    await mkdir(this.#stateDir, {
      recursive: true,
    });

    // Deterministically load all existing state files first.
    const entries = await readdir(this.#stateDir, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.json')) {
        continue;
      }

      await this.#loadState(
        path.join(this.#stateDir, entry.name)
      );
    }

    // Watch the directory itself so atomic rename/add operations
    // performed by Hera are visible.
    const watcher = chokidar.watch(this.#stateDir, {
      persistent: true,
      ignoreInitial: true,
      ignored: (filePath) => {
        if (filePath === this.#stateDir) {
          return false;
        }

        return path.extname(filePath) !== '.json';
      },
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 20,
      },
    });

    this.#watcher = watcher;

    watcher.on('add', (filePath) => {
      void this.#loadState(filePath);
    });

    watcher.on('change', (filePath) => {
      void this.#loadState(filePath);
    });

    watcher.on('unlink', (filePath) => {
      this.#removeState(filePath);
    });

    watcher.on('error', (error) => {
      this.#logger.error(
        '[HeraStateWatcher] watcher error',
        error
      );
    });

    await new Promise((resolve, reject) => {
      const onReady = () => {
        cleanup();
        resolve();
      };

      const onError = (error) => {
        cleanup();
        reject(error);
      };

      const cleanup = () => {
        watcher.off('ready', onReady);
        watcher.off('error', onError);
      };

      watcher.once('ready', onReady);
      watcher.once('error', onError);
    });
  }

  async stop() {
    if (!this.#watcher) {
      return;
    }

    const watcher = this.#watcher;
    this.#watcher = null;

    await watcher.close();
  }

  get stateDir() {
    return this.#stateDir;
  }

  get running() {
    return this.#watcher !== null;
  }

  async #loadState(filePath) {
    const projectKey = this.#projectKeyFromPath(filePath);

    if (!projectKey) {
      return;
    }

    try {
      const state = await this.#readState(filePath);

      this.#cache.set(projectKey, state);
    } catch (error) {
      // State may have been removed between the event and read.
      if (error instanceof HeraStateNotFoundError) {
        return;
      }

      this.#logger.error(
        `[HeraStateWatcher] Failed to load state: ${filePath}`,
        error
      );
    }
  }

  #removeState(filePath) {
    const projectKey = this.#projectKeyFromPath(filePath);

    if (!projectKey) {
      return;
    }

    this.#cache.delete(projectKey);
  }

  #projectKeyFromPath(filePath) {
    if (path.extname(filePath) !== '.json') {
      return null;
    }

    return path.basename(filePath, '.json');
  }
}