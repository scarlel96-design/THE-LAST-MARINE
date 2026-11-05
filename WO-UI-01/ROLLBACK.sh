#!/usr/bin/env bash
set -euo pipefail
root="$(cd -- "$(dirname -- "$0")" && pwd)"
target="${1:-$root/../src/resource-ui/main.ts}"
cp -- "$root/../baseline/WO-UI-01/main.ts" "$target"
cmp -- "$root/../baseline/WO-UI-01/main.ts" "$target"
printf '%s\n' 'ROLLBACK: legacy Q/W source bytes restored'
