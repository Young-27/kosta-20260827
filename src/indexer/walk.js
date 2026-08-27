/** 디렉터리를 훑어 색인 대상 파일을 모은다. */

import { readdir } from 'node:fs/promises';
import { join, extname } from 'node:path';

/** 색인할 확장자. */
const INDEXABLE = new Set(['.md', '.txt']);

/**
 * root 아래의 색인 대상 파일 경로를 모두 모은다.
 *
 * @param {string} root
 * @returns {Promise<string[]>}
 */
export async function walk(root) {
  const found = [];
  const entries = await readdir(root, { withFileTypes: true });

  for (const entry of entries) {
    const full = join(root, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      found.push(...(await walk(full)));
    } else if (INDEXABLE.has(extname(entry.name))) {
      found.push(full);
    }
  }

  return found;
}
