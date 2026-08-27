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

test('점수가 높을수록 먼저 정렬한다', () => {
  const ranked = rank([
    { path: '낮은점수.md', score: 0.2 },
    { path: '높은점수.md', score: 1.5 },
    { path: '중간점수.md', score: 0.8 },
  ]);

  assert.deepEqual(ranked.map((result) => result.path), [
    '높은점수.md',
    '중간점수.md',
    '낮은점수.md',
  ]);
});

test('빈 검색어의 점수는 0점이다', () => {
  assert.equal(score(entry, []), 0);
});

test('검색어가 한 글자이고 문서 길이가 1이면 등장 횟수만큼 점수를 낸다', () => {
  const singleTokenEntry = { path: 'one.md', length: 1, terms: { x: 1 } };

  assert.equal(score(singleTokenEntry, ['x']), 1);
});

test('빈 결과를 정렬하면 빈 배열을 반환한다', () => {
  assert.deepEqual(rank([]), []);
});

test('정렬해도 원본 결과 배열은 바꾸지 않는다', () => {
  const results = [
    { path: 'b.md', score: 1 },
    { path: 'a.md', score: 2 },
  ];

  const ranked = rank(results);

  assert.deepEqual(results.map((result) => result.path), ['b.md', 'a.md']);
  assert.notEqual(ranked, results);
});

test('terms가 없으면 점수를 계산할 수 없어 오류가 난다', () => {
  assert.throws(
    () => score({ path: 'broken.md', length: 1 }, ['검색어']),
    TypeError,
  );
});
