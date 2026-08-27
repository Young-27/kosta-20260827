/** 색인 파일 위치를 정한다. */

import { join } from 'node:path';

export const INDEX_FILENAME = '.index.json';

/**
 * 색인 파일의 경로.
 * @param {string} root
 * @returns {string}
 */
export function indexPath(root) {
  return join(root, INDEX_FILENAME);
}
