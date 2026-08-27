/**
 * 색인과 검색이 **함께** 쓰는 토큰화.
 *
 * 여기를 고치면 색인과 검색이 같이 바뀐다. 한쪽만 보고 고치면
 * 이미 만든 색인과 새 검색어가 안 맞는다 — 규약의 src/shared/ 항목.
 */

/** 토큰으로 치지 않는 낱말. */
const STOP_WORDS = new Set(['그리고', '또는', '하지만', 'the', 'and', 'or']);

/**
 * 문장을 토큰 배열로 나눈다.
 * 한국어는 공백 기준이라 조사가 붙어 나온다 — CLAUDE.md 「아직 안 된 것」.
 *
 * @param {string} text
 * @returns {string[]}
 */
export function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length > 1)
    .filter((t) => !STOP_WORDS.has(t));
}

/**
 * 토큰마다 등장 횟수를 센다.
 *
 * @param {string[]} tokens
 * @returns {Map<string, number>}
 */
export function countTokens(tokens) {
  const counts = new Map();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return counts;
}
