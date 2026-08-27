/** 색인을 만든다. */

import { writeFile } from 'node:fs/promises';
import { relative } from 'node:path';
import { tokenize, countTokens } from '../shared/tokenize.js';
import { indexPath } from '../shared/paths.js';
import { walk } from './walk.js';
import { readDocument } from './read.js';

/**
 * @typedef {object} IndexEntry
 * @property {string} path       root 기준 상대 경로
 * @property {number} length     토큰 수
 * @property {Record<string, number>} terms  토큰별 등장 횟수
 * @property {string} preview    원문 첫 줄 미리보기
 */

/**
 * 문서 원문에서 첫 줄을 추출한다.
 * @param {string} text
 * @returns {string}
 */
function extractPreview(text) {
  return text.split(/\r\n|\r|\n/, 1)[0];
}

/**
 * root 아래를 색인해 파일로 저장한다.
 *
 * @param {string} root
 * @returns {Promise<IndexEntry[]>}
 */
export async function buildIndex(root) {
  const files = await walk(root);
  const entries = [];

  for (const file of files) {
    const text = await readDocument(file);
    const tokens = tokenize(text);
    entries.push({
      path: relative(root, file),
      length: tokens.length,
      terms: Object.fromEntries(countTokens(tokens)),
      preview: extractPreview(text),
    });
  }

  await writeFile(indexPath(root), JSON.stringify(entries, null, 2), 'utf8');
  return entries;
}
