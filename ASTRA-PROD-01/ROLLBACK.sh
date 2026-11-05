#!/usr/bin/env sh
set -eu
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
exec node "$HERE/../tools/rollback-astra.mjs" "$HERE/rollback-check/main.ts"
