/** 색인에서 검색한다. */

import { tokenize } from '../shared/tokenize.js';
import { QueryError } from '../shared/errors.js';
import { loadIndex } from './load.js';
import { score, rank } from './rank.js';

/**
 * @typedef {object} SearchResult
 * @property {string} path
 * @property {number} score
 */

/**
 * root 의 색인에서 query 를 찾는다.
 *
 * @param {string} root
 * @param {string} query
 * @param {number} [limit]
 * @returns {Promise<SearchResult[]>}
 */
export async function search(root, query, limit = 10) {
  const terms = tokenize(query);
  if (terms.length === 0) {
    throw new QueryError('검색어가 비어 있습니다.');
  }

  const index = await loadIndex(root);
  const hits = [];

  for (const entry of index) {
    const value = score(entry, terms);
    if (value > 0) hits.push({ path: entry.path, score: value });
  }

  return rank(hits).slice(0, limit);
}
