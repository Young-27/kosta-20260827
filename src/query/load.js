/** 색인 파일을 읽어 온다. */

import { readFile } from 'node:fs/promises';
import { indexPath } from '../shared/paths.js';
import { QueryError } from '../shared/errors.js';

/**
 * 색인 파일을 읽는다.
 *
 * @param {string} root
 * @returns {Promise<import('../indexer/build.js').IndexEntry[]>}
 */
export async function loadIndex(root) {
  let raw;
  try {
    raw = await readFile(indexPath(root), 'utf8');
  } catch (cause) {
    throw new QueryError('색인이 없습니다. 먼저 index 를 실행하십시오.', { cause });
  }
  return JSON.parse(raw);
}
