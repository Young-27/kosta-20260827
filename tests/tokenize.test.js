import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tokenize, countTokens } from '../src/shared/tokenize.js';

test('한 글자 토큰은 버린다', () => {
  assert.deepEqual(tokenize('a bb ccc'), ['bb', 'ccc']);
});

test('불용어를 버린다', () => {
  assert.deepEqual(tokenize('배포 그리고 롤백'), ['배포', '롤백']);
});

test('대소문자를 낮춘다', () => {
  assert.deepEqual(tokenize('Deploy ROLLBACK'), ['deploy', 'rollback']);
});

test('등장 횟수를 센다', () => {
  const counts = countTokens(['배포', '배포', '롤백']);
  assert.equal(counts.get('배포'), 2);
  assert.equal(counts.get('롤백'), 1);
});
