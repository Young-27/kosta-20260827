# 순차 오케스트레이션

관련 커맨드: [`/pipeline`](../../.claude/commands/pipeline.md)

## 흐름

```text
requirements-analyst → implementer → tester → reviewer
```

각 단계는 앞 단계가 끝난 뒤 시작하며, 앞 단계의 산출물을 다음 단계의 입력으로 그대로 사용한다.

1. `requirements-analyst`: 요구사항을 사용자 스토리와 API 명세로 분석하고 모호한 점을 기록한다.
2. `implementer`: 분석 결과를 읽고 구현한 뒤 기존 테스트를 실행한다. 구현 코드는 `.claude/agents/implementer.md`의 규칙을 따른다.
3. `tester`: 분석 및 구현 결과를 읽고 정상·예외·경계값 테스트를 `tests/`에 작성한 뒤 `npm test`를 실행한다.
4. `reviewer`: 앞 단계 결과와 코드를 읽고 규약 위반·보안·성능·유지보수성을 검토한다.

## 산출물

단계별 결과는 `.pipeline/`에 저장한다.

- [`01-analysis.md`](../../.pipeline/01-analysis.md): 요구사항 분석
- [`02-impl.md`](../../.pipeline/02-impl.md): 구현 내용과 검증
- [`03-test.md`](../../.pipeline/03-test.md): 테스트 내용과 실행 결과
- [`04-review.md`](../../.pipeline/04-review.md): 최종 리뷰

## 실패 처리

한 단계가 실패하면 같은 단계를 최대 3회까지 다시 시도한다. 그 이후에는 파이프라인을 멈추고 사람의 판단을 요청한다. 각 단계가 끝난 뒤 다음 단계로 넘어가기 전에 한 줄로 진행 상황을 보고한다.

## 사용 시점

요구사항 분석, 구현, 테스트, 리뷰를 모두 연결해야 하는 새 기능이나 동작 변경에 적합하다. 단일 리뷰나 독립 작업에는 [동시](./concurrent.md) 또는 [동적 위임](./dynamic-delegation.md)을 사용한다.
