export class HeraStateCache {
  #states = new Map();

  set(projectKey, state) {
    this.#states.set(projectKey, {
      state,
      cachedAt: Date.now(),
    });
  }

  get(projectKey) {
    return this.#states.get(projectKey) ?? null;
  }

  has(projectKey) {
    return this.#states.has(projectKey);
  }

  delete(projectKey) {
    return this.#states.delete(projectKey);
  }

  clear() {
    this.#states.clear();
  }

  values() {
    return [...this.#states.values()];
  }

  entries() {
    return [...this.#states.entries()];
  }

  get size() {
    return this.#states.size;
  }
}