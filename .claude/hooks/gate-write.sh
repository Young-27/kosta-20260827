#!/usr/bin/env bash
# 바꾸는 도구만 막는다. 무엇을 막았는지 함께 적는다.
INPUT=$(cat)
TOOL=$(printf '%s' "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_name',''))" 2>/dev/null)
echo "승인 게이트: [$TOOL] 은 사람 확인이 필요하다. 무엇을 왜 바꾸는지 적으할 것." >&2
exit 2
