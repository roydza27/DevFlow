import test from 'node:test';
import assert from 'node:assert/strict';

import { HeraStateCache } from '../../src/infrastructure/hera/stateCache.js';

function createState(name) {
  return {
    schema_version: 1,
    project: {
      name,
      root_path: `/tmp/${name}`,
    },
  };
}

test('starts empty', () => {
  const cache = new HeraStateCache();

  assert.equal(cache.size, 0);
  assert.equal(cache.get('hera'), null);
  assert.equal(cache.has('hera'), false);
});

test('stores and retrieves state', () => {
  const cache = new HeraStateCache();
  const state = createState('hera');

  cache.set('hera', state);

  const entry = cache.get('hera');

  assert.ok(entry);
  assert.deepEqual(entry.state, state);
  assert.equal(typeof entry.cachedAt, 'number');
});

test('replaces existing state for the same project', () => {
  const cache = new HeraStateCache();

  const firstState = createState('hera-v1');
  const secondState = createState('hera-v2');

  cache.set('hera', firstState);
  cache.set('hera', secondState);

  const entry = cache.get('hera');

  assert.deepEqual(entry.state, secondState);
  assert.equal(cache.size, 1);
});

test('supports multiple projects', () => {
  const cache = new HeraStateCache();

  cache.set('hera', createState('hera'));
  cache.set('devflow', createState('devflow'));

  assert.equal(cache.size, 2);
  assert.equal(cache.has('hera'), true);
  assert.equal(cache.has('devflow'), true);
});

test('deletes a project', () => {
  const cache = new HeraStateCache();

  cache.set('hera', createState('hera'));

  assert.equal(cache.delete('hera'), true);
  assert.equal(cache.has('hera'), false);
  assert.equal(cache.get('hera'), null);
  assert.equal(cache.size, 0);

  assert.equal(cache.delete('missing'), false);
});

test('clears all cached projects', () => {
  const cache = new HeraStateCache();

  cache.set('hera', createState('hera'));
  cache.set('devflow', createState('devflow'));

  cache.clear();

  assert.equal(cache.size, 0);
  assert.deepEqual(cache.values(), []);
  assert.deepEqual(cache.entries(), []);
});

test('returns all cached entries', () => {
  const cache = new HeraStateCache();

  const heraState = createState('hera');
  const devflowState = createState('devflow');

  cache.set('hera', heraState);
  cache.set('devflow', devflowState);

  const entries = cache.entries();

  assert.equal(entries.length, 2);

  assert.deepEqual(entries[0], ['hera', cache.get('hera')]);
  assert.deepEqual(entries[1], ['devflow', cache.get('devflow')]);
});