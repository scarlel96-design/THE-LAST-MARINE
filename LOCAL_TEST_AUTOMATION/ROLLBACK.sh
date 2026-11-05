#!/usr/bin/env bash
set -euo pipefail
if [ "$#" -ne 1 ]; then
  echo 'Usage: ROLLBACK.sh WORK_COPY_DIRECTORY' >&2
  exit 2
fi
script_dir="$(cd -- "$(dirname -- "$0")" && pwd)"
python -X utf8 "$script_dir/rollback.py" "$1"
