import { test } from 'node:test';
import assert from 'node:assert/strict';
import { score, rank } from '../src/query/rank.js';

const entry = { path: 'a.md', length: 10, terms: { 배포: 2, 롤백: 1 } };

test('일치한 토큰이 없으면 0점', () => {
  assert.equal(score(entry, ['없는말']), 0);
});

test('등장 횟수를 문서 길이로 나눈다', () => {
  assert.equal(score(entry, ['배포']), 0.2);
});

test('여러 토큰의 점수를 더한다', () => {
  // 부동소수점이라 정확 일치로 비교하지 않는다 — 0.2 + 0.1 은 0.30000000000000004
  assert.ok(Math.abs(score(entry, ['배포', '롤백']) - 0.3) < 1e-9);
});

test('점수가 같으면 경로 순으로 정렬한다', () => {
  const ranked = rank([
    { path: 'b.md', score: 1 },
    { path: 'a.md', score: 1 },
  ]);
  assert.deepEqual(ranked.map((r) => r.path), ['a.md', 'b.md']);
});
