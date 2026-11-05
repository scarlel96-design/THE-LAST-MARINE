#!/usr/bin/env bash
set -euo pipefail
root="$(cd -- "$(dirname -- "$0")" && pwd)"
if [[ $# -ne 1 ]]; then
  printf '%s\n' 'Usage: ROLLBACK_LAUNCHER.sh TARGET_DIRECTORY' >&2
  exit 2
fi
exec powershell.exe -NoProfile -File "$(cygpath -w "$root/ROLLBACK_LAUNCHER.ps1")" -TargetDirectory "$(cygpath -w "$1")"
