# doc-search-cli — 코딩 규약

사내 문서를 색인하고 검색하는 CLI 도구다. **의존성을 늘리지 않는다** — 표준 라이브러리만
쓴다. 테스트는 Node 내장 `node:test` 를 쓴다.

## 디렉터리

| 경로 | 책임 |
|---|---|
| `src/indexer/` | 파일을 훑어 색인을 만든다. 검색은 모른다 |
| `src/query/` | 색인을 읽어 검색한다. 파일 시스템은 모른다 |
| `src/shared/` | 양쪽이 함께 쓰는 것. **여기에 무언가를 더할 때는 양쪽을 다 본다** |
| `tests/` | `node --test` 로 돈다. 파일명은 `<모듈>.test.js` |
| `fixtures/` | 테스트용 문서. 실제 사내 문서를 넣지 않는다 |

## 필수 규칙

1. **ESM만 쓴다.** `require` 를 쓰지 않는다. 확장자 `.js` 를 import 경로에 붙인다
2. **함수는 하나를 한다.** 20줄을 넘으면 쪼갠다
3. **던지는 오류는 `Error` 하위 클래스로 만든다.** `src/shared/errors.js` 에 모은다
4. **비동기는 `async/await` 로 통일한다.** 콜백이나 `.then()` 체인을 새로 만들지 않는다
5. **공개 함수에는 JSDoc 을 붙인다.** 타입은 JSDoc 으로만 적는다 (TypeScript 를 안 쓴다)
6. **테스트는 기능과 같은 커밋에 넣는다**

## 실행

```bash
npm test                      # 전체 테스트
node src/cli.js index ./docs  # 색인
node src/cli.js find "검색어" # 검색
```

## 미구현 항목

- 색인 갱신 시 삭제된 파일이 색인에 남는다
- 큰 파일에서 느리다 (`src/indexer/read.js`)
- 한국어 토큰화가 공백 기준이라 조사가 붙어 있다
