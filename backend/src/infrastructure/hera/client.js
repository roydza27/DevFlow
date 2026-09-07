import { HeraStateCache } from './stateCache.js';
import { HeraStateWatcher } from './stateWatcher.js';
import path from 'node:path';

export class HeraClient {
  #cache;
  #watcher;
  #started = false;

  constructor({
    stateDir,
    logger = console,
    watcherFactory = (options) => new HeraStateWatcher(options),
  } = {}) {
    this.#cache = new HeraStateCache();

    this.#watcher = watcherFactory({
      stateDir,
      cache: this.#cache,
      logger,
    });
  }

  async start() {
    if (this.#started) {
      return;
    }

    await this.#watcher.start();
    this.#started = true;
  }

  async stop() {
    if (!this.#started) {
      return;
    }

    await this.#watcher.stop();
    this.#started = false;
  }

  getProjectStateByRootPath(rootPath) {
    if (!rootPath) {
      return null;
    }

    const normalizedRoot = path.resolve(rootPath);

    for (const { state } of this.#cache.values()) {
      const heraRoot = state?.project?.root_path;

      if (!heraRoot) {
        continue;
      }

      if (path.resolve(heraRoot) === normalizedRoot) {
        return state;
      }
    }

    return null;
  }

  getProjectState(projectKey) {
    const entry = this.#cache.get(projectKey);

    return entry?.state ?? null;
  }

  getProjectStateEntry(projectKey) {
    return this.#cache.get(projectKey);
  }

  getAllProjectStates() {
    return this.#cache
      .entries()
      .map(([projectKey, entry]) => ({
        projectKey,
        ...entry,
      }));
  }

  hasProjectState(projectKey) {
    return this.#cache.has(projectKey);
  }

  getStatus() {
    return {
      running: this.#started && this.#watcher.running,
      stateDir: this.#watcher.stateDir,
      projectCount: this.#cache.size,
    };
  }
}