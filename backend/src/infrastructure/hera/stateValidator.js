// import test from 'node:test';
// import assert from 'node:assert/strict';

// import { validateHeraState } from '../../src/infrastructure/hera/stateValidator.js';

// const validState = {
//   schema_version: 1,

//   project: {
//     name: 'hera',
//     root_path: '/tmp/hera',
//     tasks_file: '/tmp/hera/TASKS.md',
//     is_open: true,
//   },

//   repository: {
//     branch: 'main',
//     head_commit: 'abc123',
//     remote: 'https://github.com/example/hera.git',
//     is_clean: true,
//   },

//   activity: {
//     input_state: 'ACTIVE',
//     classification: 'PRODUCTIVE',
//     work_eligible: true,
//     project_relevance: 'DIRECT',
//     window_class: 'foot',
//     window_title: 'hera',
//     timestamp: 1234567890,
//   },

//   session: {
//     state: 'ACTIVE',
//     started_at_epoch: 1234567890,
//     active_duration_seconds: 100,
//   },

//   current_task: null,

//   tasks: [],

//   today: {
//     development_seconds: 100,
//     distraction_seconds: 10,
//     sessions_count: 1,
//     commits_count: 2,
//     changed_files_count: 3,
//   },
// };

// test('accepts valid Hera state', () => {
//   assert.deepEqual(validateHeraState(validState), validState);
// });

// test('rejects unsupported schema version', () => {
//   assert.throws(
//     () =>
//       validateHeraState({
//         ...validState,
//         schema_version: 2,
//       }),
//     /Unsupported Hera state schema version/
//   );
// });

// test('rejects missing project', () => {
//   const state = { ...validState };
//   delete state.project;

//   assert.throws(
//     () => validateHeraState(state),
//     /missing project information/
//   );
// });

// test('rejects missing repository', () => {
//   const state = { ...validState };
//   delete state.repository;

//   assert.throws(
//     () => validateHeraState(state),
//     /missing repository information/
//   );
// });

// test('rejects missing activity', () => {
//   const state = { ...validState };
//   delete state.activity;

//   assert.throws(
//     () => validateHeraState(state),
//     /missing activity information/
//   );
// });

// test('rejects missing session', () => {
//   const state = { ...validState };
//   delete state.session;

//   assert.throws(
//     () => validateHeraState(state),
//     /missing session information/
//   );
// });

// test('rejects missing today summary', () => {
//   const state = { ...validState };
//   delete state.today;

//   assert.throws(
//     () => validateHeraState(state),
//     /missing summary information/
//   );
// });

export function validateHeraState(state) {
  if (!state || typeof state !== 'object') {
    throw new TypeError('Hera state must be an object');
  }

  if (state.schema_version !== 1) {
    throw new Error(
      `Unsupported Hera state schema version: ${state.schema_version}`
    );
  }

  if (!state.project || typeof state.project !== 'object') {
    throw new Error('Hera state is missing project information');
  }

  if (!state.repository || typeof state.repository !== 'object') {
    throw new Error('Hera state is missing repository information');
  }

  if (!state.activity || typeof state.activity !== 'object') {
    throw new Error('Hera state is missing activity information');
  }

  if (!state.session || typeof state.session !== 'object') {
    throw new Error('Hera state is missing session information');
  }

  if (!state.today || typeof state.today !== 'object') {
    throw new Error('Hera state is missing summary information');
  }

  return state;
}