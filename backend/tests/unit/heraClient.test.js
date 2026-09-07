import test from 'node:test';
import assert from 'node:assert/strict';

import { HeraClient } from '../../src/infrastructure/hera/client.js';

function createState(name) {
  return {
    schema_version: 1,
    project: {
      name,
      root_path: `/tmp/${name}`,
      tasks_file: `/tmp/${name}/TASKS.md`,
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
      window_title: name,
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
  };
}

class FakeWatcher {
  constructor({ cache }) {
    this.cache = cache;
    this.stateDir = '/tmp/hera/state';
    this.running = false;
  }

  async start() {
    this.cache.set('hera', createState('hera'));
    this.cache.set('devflow', createState('devflow'));
    this.running = true;
  }

  async stop() {
    this.running = false;
  }
}

function createClient() {
  return new HeraClient({
    watcherFactory: (options) => new FakeWatcher(options),
  });
}

test('starts and stops the Hera watcher', async () => {
  const client = createClient();

  assert.equal(client.getStatus().running, false);

  await client.start();

  assert.equal(client.getStatus().running, true);

  await client.stop();

  assert.equal(client.getStatus().running, false);
});

test('returns a project state', async () => {
  const client = createClient();

  await client.start();

  const state = client.getProjectState('hera');

  assert.ok(state);
  assert.equal(state.project.name, 'hera');
});

test('returns null for unknown project', async () => {
  const client = createClient();

  await client.start();

  assert.equal(client.getProjectState('missing'), null);
});

test('returns all project states', async () => {
  const client = createClient();

  await client.start();

  const states = client.getAllProjectStates();

  assert.equal(states.length, 2);

  assert.deepEqual(
    states.map((item) => item.projectKey).sort(),
    ['devflow', 'hera']
  );
});

test('reports whether a project state exists', async () => {
  const client = createClient();

  await client.start();

  assert.equal(client.hasProjectState('hera'), true);
  assert.equal(client.hasProjectState('missing'), false);
});

test('returns cache metadata through project entry', async () => {
  const client = createClient();

  await client.start();

  const entry = client.getProjectStateEntry('hera');

  assert.ok(entry);
  assert.deepEqual(entry.state.project.name, 'hera');
  assert.equal(typeof entry.cachedAt, 'number');
});

test('reports client status', async () => {
  const client = createClient();

  await client.start();

  const status = client.getStatus();

  assert.equal(status.running, true);
  assert.equal(status.stateDir, '/tmp/hera/state');
  assert.equal(status.projectCount, 2);
});

test('finds project state by matching root path', async () => {
  const client = createClient();

  await client.start();

  const state = client.getProjectStateByRootPath('/tmp/hera');

  assert.ok(state);
  assert.equal(state.project.name, 'hera');
  assert.equal(state.project.root_path, '/tmp/hera');
});

test('returns null when root path does not match', async () => {
  const client = createClient();

  await client.start();

  assert.equal(
    client.getProjectStateByRootPath('/tmp/unknown'),
    null
  );
});

test('returns null when root path is missing', async () => {
  const client = createClient();

  await client.start();

  assert.equal(
    client.getProjectStateByRootPath(null),
    null
  );
});