/**
 * 이 도구가 던지는 오류를 한곳에 모은다.
 * 규약 3 — 던지는 오류는 Error 하위 클래스로 만든다.
 */

export class DocSearchError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = new.target.name;
  }
}

/** 색인을 만들 수 없을 때. */
export class IndexError extends DocSearchError {}

/** 검색어나 색인이 잘못됐을 때. */
export class QueryError extends DocSearchError {}
