#!/usr/bin/env bash
set -euo pipefail
root="$(cd -- "$(dirname -- "$0")" && pwd)"
target="${1:-$root/docs/WORK_ORDER.md}"
cp -- "$root/baseline/WORK_ORDER.md" "$target"
cmp -- "$root/baseline/WORK_ORDER.md" "$target"
printf '%s\n' 'ROLLBACK: original bytes restored'
