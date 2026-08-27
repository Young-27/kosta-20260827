/** 검색 결과의 점수를 매긴다. */

/**
 * 문서 하나의 점수. 일치한 토큰의 등장 횟수를 문서 길이로 나눠 더한다.
 * 짧은 문서가 유리한 단순한 방식이다.
 *
 * @param {import('../indexer/build.js').IndexEntry} entry
 * @param {string[]} terms
 * @returns {number}
 */
export function score(entry, terms) {
  let total = 0;
  for (const term of terms) {
    const hits = entry.terms[term];
    if (hits) total += hits / entry.length;
  }
  return total;
}

/**
 * 점수 내림차순으로 정렬한다. 같으면 경로 순.
 *
 * @param {{path: string, score: number}[]} results
 * @returns {{path: string, score: number}[]}
 */
export function rank(results) {
  return [...results].sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));
}
