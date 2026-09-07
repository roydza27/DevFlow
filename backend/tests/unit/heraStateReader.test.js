import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  HeraStateNotFoundError,
  HeraStateParseError,
} from '../../src/infrastructure/hera/index.js';

import { readHeraState } from '../../src/infrastructure/hera/stateReader.js';

let tempDir;

const validState = {
  schema_version: 1,

  project: {
    name: 'hera',
    root_path: '/tmp/hera',
    tasks_file: '/tmp/hera/TASKS.md',
    is_open: true,
  },

  repository: {
    branch: 'main',
    head_commit: '406b197',
    remote: 'https://github.com/example/hera.git',
    is_clean: true,
  },

  activity: {
    input_state: 'ACTIVE',
    classification: 'PRODUCTIVE',
    work_eligible: true,
    project_relevance: 'DIRECT',
    window_class: 'foot',
    window_title: 'hera',
    timestamp: 1788772972,
  },

  session: {
    state: 'ACTIVE',
    started_at_epoch: 1788772972,
    active_duration_seconds: 1057,
  },

  current_task: null,

  tasks: [
    {
      id: 'HERA-001',
      title: 'Test task',
      status: 'COMPLETED',
      confidence_score: null,
      confidence_level: null,
      matching_commits: [],
    },
  ],

  today: {
    development_seconds: 100,
    distraction_seconds: 10,
    sessions_count: 1,
    commits_count: 2,
    changed_files_count: 3,
  },
};

beforeEach(() => {
  tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'devflow-hera-reader-test-')
  );

  process.env.XDG_DATA_HOME = tempDir;

  fs.mkdirSync(path.join(tempDir, 'hera', 'state'), {
    recursive: true,
  });
});

afterEach(() => {
  delete process.env.XDG_DATA_HOME;

  if (tempDir && fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, {
      recursive: true,
      force: true,
    });
  }

  tempDir = null;
});

test('reads and validates a valid Hera state file', async () => {
  const statePath = path.join(
    tempDir,
    'hera',
    'state',
    'hera.json'
  );

  fs.writeFileSync(
    statePath,
    JSON.stringify(validState),
    'utf8'
  );

  const state = await readHeraState('hera');

  assert.deepEqual(state, validState);
});

test('throws HeraStateNotFoundError when state file does not exist', async () => {
  await assert.rejects(
    () => readHeraState('hera'),
    (error) => {
      assert.ok(error instanceof HeraStateNotFoundError);
      assert.equal(error.code, 'HERA_STATE_NOT_FOUND');
      return true;
    }
  );
});

test('throws HeraStateParseError when state file contains invalid JSON', async () => {
  const statePath = path.join(
    tempDir,
    'hera',
    'state',
    'hera.json'
  );

  fs.writeFileSync(
    statePath,
    '{ invalid json }',
    'utf8'
  );

  await assert.rejects(
    () => readHeraState('hera'),
    (error) => {
      assert.ok(error instanceof HeraStateParseError);
      assert.equal(error.code, 'HERA_STATE_INVALID');
      return true;
    }
  );
});

test('rejects an unsupported Hera schema version', async () => {
  const statePath = path.join(
    tempDir,
    'hera',
    'state',
    'hera.json'
  );

  const invalidState = {
    ...validState,
    schema_version: 2,
  };

  fs.writeFileSync(
    statePath,
    JSON.stringify(invalidState),
    'utf8'
  );

  await assert.rejects(
    () => readHeraState('hera'),
    /Unsupported Hera state schema version/
  );
});

test('rejects state missing project information', async () => {
  const statePath = path.join(
    tempDir,
    'hera',
    'state',
    'hera.json'
  );

  const invalidState = {
    ...validState,
  };

  delete invalidState.project;

  fs.writeFileSync(
    statePath,
    JSON.stringify(invalidState),
    'utf8'
  );

  await assert.rejects(
    () => readHeraState('hera'),
    /Hera state is missing project information/
  );
});

test('rejects state missing repository information', async () => {
  const statePath = path.join(
    tempDir,
    'hera',
    'state',
    'hera.json'
  );

  const invalidState = {
    ...validState,
  };

  delete invalidState.repository;

  fs.writeFileSync(
    statePath,
    JSON.stringify(invalidState),
    'utf8'
  );

  await assert.rejects(
    () => readHeraState('hera'),
    /Hera state is missing repository information/
  );
});

test('rejects state missing activity information', async () => {
  const statePath = path.join(
    tempDir,
    'hera',
    'state',
    'hera.json'
  );

  const invalidState = {
    ...validState,
  };

  delete invalidState.activity;

  fs.writeFileSync(
    statePath,
    JSON.stringify(invalidState),
    'utf8'
  );

  await assert.rejects(
    () => readHeraState('hera'),
    /Hera state is missing activity information/
  );
});

test('rejects state missing session information', async () => {
  const statePath = path.join(
    tempDir,
    'hera',
    'state',
    'hera.json'
  );

  const invalidState = {
    ...validState,
  };

  delete invalidState.session;

  fs.writeFileSync(
    statePath,
    JSON.stringify(invalidState),
    'utf8'
  );

  await assert.rejects(
    () => readHeraState('hera'),
    /Hera state is missing session information/
  );
});

test('rejects state missing today summary', async () => {
  const statePath = path.join(
    tempDir,
    'hera',
    'state',
    'hera.json'
  );

  const invalidState = {
    ...validState,
  };

  delete invalidState.today;

  fs.writeFileSync(
    statePath,
    JSON.stringify(invalidState),
    'utf8'
  );

  await assert.rejects(
    () => readHeraState('hera'),
    /Hera state is missing summary information/
  );
});