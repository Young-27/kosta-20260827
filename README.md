# doc-search-cli

사내 문서(마크다운·텍스트)를 색인해 빠르게 찾는 CLI. 의존성 없음, Node 20 이상.

```bash
npm install          # 의존성이 없어 바로 끝난다
npm test
node src/cli.js index ./fixtures
node src/cli.js find "배포"
```

규약은 `CLAUDE.md` 를 확인.
