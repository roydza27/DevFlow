import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { HeraStateCache } from '../../src/infrastructure/hera/stateCache.js';
import { HeraStateWatcher } from '../../src/infrastructure/hera/stateWatcher.js';

async function createTempStateDir() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'devflow-hera-test-'));
}

function createState(projectName, overrides = {}) {
  return {
    schema_version: 1,

    project: {
      name: projectName,
      root_path: `/tmp/${projectName}`,
      tasks_file: `/tmp/${projectName}/TASKS.md`,
      is_open: true,
    },

    repository: {
      branch: 'main',
      head_commit: 'abc123',
      remote: null,
      is_clean: true,
    },

    activity: {
      input_state: 'ACTIVE',
      classification: 'PRODUCTIVE',
      work_eligible: true,
      project_relevance: 'DIRECT',
      window_class: 'foot',
      window_title: projectName,
      timestamp: 1234567890,
    },

    session: {
      state: 'ACTIVE',
      started_at_epoch: 1234567890,
      active_duration_seconds: 100,
    },

    current_task: null,

    tasks: [],

    today: {
      development_seconds: 100,
      distraction_seconds: 10,
      sessions_count: 1,
      commits_count: 2,
      changed_files_count: 3,
    },

    ...overrides,
  };
}

async function waitFor(predicate, timeout = 1000) {
  const started = Date.now();

  while (Date.now() - started < timeout) {
    if (predicate()) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 20));
  }

  throw new Error('Timed out waiting for watcher condition');
}

test('loads existing Hera state files on startup', async () => {
  const stateDir = await createTempStateDir();
  const cache = new HeraStateCache();

  const state = createState('hera');

  await fs.writeFile(
    path.join(stateDir, 'hera.json'),
    JSON.stringify(state)
  );

  const watcher = new HeraStateWatcher({
    stateDir,
    cache,
    logger: {
      error() {},
    },
  });

  try {
    await watcher.start();

    await waitFor(() => cache.has('hera'));

    assert.deepEqual(cache.get('hera').state, state);
  } finally {
    await watcher.stop();
    await fs.rm(stateDir, { recursive: true, force: true });
  }
});

test('loads newly created state files', async () => {
  const stateDir = await createTempStateDir();
  const cache = new HeraStateCache();

  const watcher = new HeraStateWatcher({
    stateDir,
    cache,
    logger: {
      error() {},
    },
  });

  try {
    await watcher.start();

    const state = createState('hera');

    await fs.writeFile(
      path.join(stateDir, 'hera.json'),
      JSON.stringify(state)
    );

    await waitFor(() => cache.has('hera'));

    assert.deepEqual(cache.get('hera').state, state);
  } finally {
    await watcher.stop();
    await fs.rm(stateDir, { recursive: true, force: true });
  }
});

test('updates cached state when a file changes', async () => {
  const stateDir = await createTempStateDir();
  const cache = new HeraStateCache();

  const watcher = new HeraStateWatcher({
    stateDir,
    cache,
    logger: {
      error() {},
    },
  });

  try {
    await watcher.start();

    const firstState = createState('hera', {
      repository: {
        branch: 'main',
        head_commit: 'abc123',
        remote: null,
        is_clean: true,
      },
    });

    const statePath = path.join(stateDir, 'hera.json');

    await fs.writeFile(statePath, JSON.stringify(firstState));

    await waitFor(
      () => cache.get('hera')?.state?.repository?.head_commit === 'abc123'
    );

    const secondState = createState('hera', {
      repository: {
        branch: 'feature/test',
        head_commit: 'def456',
        remote: null,
        is_clean: false,
      },
    });

    await fs.writeFile(statePath, JSON.stringify(secondState));

    await waitFor(
      () => cache.get('hera')?.state?.repository?.head_commit === 'def456'
    );

    assert.equal(
      cache.get('hera').state.repository.branch,
      'feature/test'
    );
  } finally {
    await watcher.stop();
    await fs.rm(stateDir, { recursive: true, force: true });
  }
});

test('removes cached state when a project file is deleted', async () => {
  const stateDir = await createTempStateDir();
  const cache = new HeraStateCache();

  const state = createState('hera');
  const statePath = path.join(stateDir, 'hera.json');

  await fs.writeFile(statePath, JSON.stringify(state));

  const watcher = new HeraStateWatcher({
    stateDir,
    cache,
    logger: {
      error() {},
    },
  });

  try {
    await watcher.start();

    await waitFor(() => cache.has('hera'));

    await fs.unlink(statePath);

    await waitFor(() => !cache.has('hera'));

    assert.equal(cache.get('hera'), null);
  } finally {
    await watcher.stop();
    await fs.rm(stateDir, { recursive: true, force: true });
  }
});

test('ignores unrelated files', async () => {
  const stateDir = await createTempStateDir();
  const cache = new HeraStateCache();

  const watcher = new HeraStateWatcher({
    stateDir,
    cache,
    logger: {
      error() {},
    },
  });

  try {
    await watcher.start();

    await fs.writeFile(
      path.join(stateDir, 'README.txt'),
      'not Hera state'
    );

    await fs.writeFile(
      path.join(stateDir, 'notes.json'),
      JSON.stringify({ hello: 'world' })
    );

    await new Promise((resolve) => setTimeout(resolve, 100));

    assert.equal(cache.size, 0);
  } finally {
    await watcher.stop();
    await fs.rm(stateDir, { recursive: true, force: true });
  }
});

test('keeps last valid state when an update is malformed', async () => {
  const stateDir = await createTempStateDir();
  const cache = new HeraStateCache();

  const validState = createState('hera');
  const statePath = path.join(stateDir, 'hera.json');

  await fs.writeFile(statePath, JSON.stringify(validState));

  const watcher = new HeraStateWatcher({
    stateDir,
    cache,
    logger: {
      error() {},
    },
  });

  try {
    await watcher.start();

    await waitFor(() => cache.has('hera'));

    await fs.writeFile(statePath, '{invalid json');

    await new Promise((resolve) => setTimeout(resolve, 150));

    assert.deepEqual(cache.get('hera').state, validState);
  } finally {
    await watcher.stop();
    await fs.rm(stateDir, { recursive: true, force: true });
  }
});

test('reports running state and stops cleanly', async () => {
  const stateDir = await createTempStateDir();
  const cache = new HeraStateCache();

  const watcher = new HeraStateWatcher({
    stateDir,
    cache,
  });

  try {
    assert.equal(watcher.running, false);

    await watcher.start();

    assert.equal(watcher.running, true);

    await watcher.stop();

    assert.equal(watcher.running, false);
  } finally {
    await watcher.stop();
    await fs.rm(stateDir, { recursive: true, force: true });
  }
});