#!/usr/bin/env bash
echo "훅이 돌았다 $(date +%H:%M:%S)" >> /tmp/hook-trace.log
exit 0
