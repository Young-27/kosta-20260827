#!/usr/bin/env node
/** doc-search-cli 진입점. */

import { buildIndex } from './indexer/build.js';
import { search } from './query/search.js';
import { DocSearchError } from './shared/errors.js';

const USAGE = `사용법:
  docsearch index <디렉터리>
  docsearch find  <검색어> [디렉터리]
`;

async function main(argv) {
  const [command, ...rest] = argv;

  if (command === 'index') {
    const root = rest[0] ?? '.';
    const entries = await buildIndex(root);
    console.log(`색인 완료 — 문서 ${entries.length}개`);
    return 0;
  }

  if (command === 'find') {
    const [query, root = '.'] = rest;
    const results = await search(root, query ?? '');
    if (results.length === 0) {
      console.log('결과 없음');
      return 1;
    }
    for (const { path, score } of results) {
      console.log(`${score.toFixed(4)}  ${path}`);
    }
    return 0;
  }

  console.log(USAGE);
  return command ? 1 : 0;
}

try {
  process.exitCode = await main(process.argv.slice(2));
} catch (error) {
  if (error instanceof DocSearchError) {
    console.error(`오류: ${error.message}`);
    process.exitCode = 1;
  } else {
    throw error;
  }
}
