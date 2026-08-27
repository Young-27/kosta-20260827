# 오케스트레이션 안내

이 프로젝트의 작업 위임 규칙은 Claude Code 커맨드와 서브에이전트 정의로 관리한다. 작업 성격에 따라 아래 방식을 선택한다.

| 방식 | 커맨드 | 적합한 상황 | 실행 구조 |
|---|---|---|---|
| [순차](./sequential.md) | `/pipeline` | 요구사항부터 리뷰까지 전체 흐름 | 분석 → 구현 → 테스트 → 리뷰 |
| [동시](./concurrent.md) | `/parallel-check` | 독립적인 테스트와 리뷰 | tester ∥ reviewer → 통합 |
| [동적 위임](./dynamic-delegation.md) | `/dispatch` | 담당자 하나를 자동 선택 | 판정 → 선택된 담당자 1명 |
| [핸드오프](./handoff.md) | `/handoff` | 구현 품질을 리뷰 기준까지 반복 | 구현 → 리뷰 ↺ |

## 선택 기준

- 전체 개발 흐름이 필요하면 `/pipeline`을 사용한다.
- 테스트와 리뷰처럼 서로 결과를 기다리지 않는 작업은 `/parallel-check`를 사용한다.
- 요청의 성격에 맞는 담당자 하나만 필요하면 `/dispatch`를 사용한다.
- 구현 후 심각한 리뷰 지적을 해결해야 하면 `/handoff`를 사용한다.

## 원본 정의

문서의 기준은 다음 실제 설정 파일이다.

- 커맨드: [`pipeline`](../../.claude/commands/pipeline.md), [`parallel-check`](../../.claude/commands/parallel-check.md), [`dispatch`](../../.claude/commands/dispatch.md), [`handoff`](../../.claude/commands/handoff.md)
- 담당 판정: [`dispatcher`](../../.claude/commands/dispatcher.md)
- 에이전트: [`requirements-analyst`](../../.claude/agents/requirements-analyst.md), [`implementer`](../../.claude/agents/implementer.md), [`tester`](../../.claude/agents/tester.md), [`reviewer`](../../.claude/agents/reviewer.md)
- 순차 산출물 예시: [`.pipeline/`](../../.pipeline/)

> 이 문서는 사용 안내용 요약이다. 커맨드의 동작을 바꿀 때는 해당 원본 정의와 이 문서를 함께 검토한다.
