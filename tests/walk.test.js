import { test } from 'node:test';
import assert from 'node:assert/strict';
import { walk } from '../src/indexer/walk.js';

test('fixtures 의 md·txt 를 모두 찾는다', async () => {
  const found = await walk('fixtures');
  assert.equal(found.length, 3);
  assert.ok(found.every((p) => p.endsWith('.md') || p.endsWith('.txt')));
});
