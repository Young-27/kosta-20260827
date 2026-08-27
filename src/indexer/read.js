/** 파일을 읽어 본문을 낸다. */

import { readFile } from 'node:fs/promises';
import { IndexError } from '../shared/errors.js';

/**
 * 파일 하나를 읽는다. 통째로 메모리에 올린다 —
 * 큰 파일에서 느리다(CLAUDE.md 「아직 안 된 것」).
 *
 * @param {string} path
 * @returns {Promise<string>}
 */
export async function readDocument(path) {
  try {
    return await readFile(path, 'utf8');
  } catch (cause) {
    throw new IndexError(`문서를 읽지 못했습니다: ${path}`, { cause });
  }
}
