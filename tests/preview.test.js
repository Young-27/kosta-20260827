import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { buildIndex } from '../src/indexer/build.js';
import { search } from '../src/query/search.js';
import { indexPath } from '../src/shared/paths.js';

const roots = [];

async function temporaryRoot() {
  const root = await mkdtemp(join(tmpdir(), 'doc-search-preview-'));
  roots.push(root);
  return root;
}

function runCli(args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ['src/cli.js', ...args], {
      cwd: new URL('..', import.meta.url),
      windowsHide: true,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

test('색인 생성 시 Markdown·텍스트 문서의 첫 줄 미리보기를 저장한다', async () => {
  const root = await temporaryRoot();
  await writeFile(join(root, 'guide.md'), '# 배포 안내\n본문 배포', 'utf8');
  await writeFile(join(root, 'notes.txt'), '메모 롤백\r\n다음 줄', 'utf8');

  const entries = await buildIndex(root);
  assert.deepEqual(entries.map(({ path, preview }) => ({ path, preview })), [
    { path: 'guide.md', preview: '# 배포 안내' },
    { path: 'notes.txt', preview: '메모 롤백' },
  ]);
  const saved = JSON.parse(await readFile(indexPath(root), 'utf8'));
  assert.equal(saved[0].preview, '# 배포 안내');
  assert.equal(saved[1].preview, '메모 롤백');
});

test('LF·CRLF·CR의 첫 줄 경계와 빈 문서를 처리한다', async () => {
  const root = await temporaryRoot();
  await writeFile(join(root, 'lf.txt'), 'LF 첫 줄\n두 번째 줄 배포', 'utf8');
  await writeFile(join(root, 'crlf.txt'), 'CRLF 첫 줄\r\n두 번째 줄 배포', 'utf8');
  await writeFile(join(root, 'cr.txt'), 'CR 첫 줄\r두 번째 줄 배포', 'utf8');
  await writeFile(join(root, 'empty.txt'), '', 'utf8');
  await writeFile(join(root, 'blank.md'), '\n배포 본문', 'utf8');

  const entries = await buildIndex(root);
  const previews = Object.fromEntries(entries.map((entry) => [entry.path, entry.preview]));
  assert.deepEqual(previews, {
    'blank.md': '',
    'cr.txt': 'CR 첫 줄',
    'crlf.txt': 'CRLF 첫 줄',
    'empty.txt': '',
    'lf.txt': 'LF 첫 줄',
  });
});

test('검색 결과가 색인 미리보기를 전달하고 원문을 다시 읽지 않는다', async () => {
  const root = await temporaryRoot();
  await writeFile(indexPath(root), JSON.stringify([
    { path: 'deploy.md', length: 2, terms: { 배포: 1 }, preview: '원본 첫 줄' },
  ]), 'utf8');

  const results = await search(root, '배포');
  assert.deepEqual(results, [{ path: 'deploy.md', score: 0.5, preview: '원본 첫 줄' }]);
});

test('preview가 없는 기존 색인도 빈 미리보기로 검색한다', async () => {
  const root = await temporaryRoot();
  await writeFile(indexPath(root), JSON.stringify([
    { path: 'old.txt', length: 1, terms: { 배포: 1 } },
  ]), 'utf8');

  const results = await search(root, '배포');
  assert.deepEqual(results, [{ path: 'old.txt', score: 1, preview: '' }]);
});

test('검색어가 비어 있으면 기존 예외를 유지한다', async () => {
  const root = await temporaryRoot();
  await assert.rejects(() => search(root, '   '), /검색어가 비어 있습니다/);
});

test('CLI가 점수·경로·첫 줄 미리보기를 한 줄에 출력한다', async () => {
  const root = await temporaryRoot();
  await writeFile(join(root, 'guide.md'), '배포 가이드\n본문은 출력하지 않음', 'utf8');
  await buildIndex(root);

  const result = await runCli(['find', '배포', root]);
  assert.equal(result.code, 0);
  assert.equal(result.stderr, '');
  assert.equal(result.stdout, '0.2000  guide.md  배포 가이드\n');
  assert.equal(result.stdout.includes('본문은 출력하지 않음'), false);
});

test('CLI는 검색 결과가 없을 때 기존 메시지와 종료 코드를 유지한다', async () => {
  const root = await temporaryRoot();
  await writeFile(join(root, 'guide.md'), '배포 가이드', 'utf8');
  await buildIndex(root);

  const result = await runCli(['find', '없는어휘', root]);
  assert.equal(result.code, 1);
  assert.equal(result.stdout, '결과 없음\n');
});
