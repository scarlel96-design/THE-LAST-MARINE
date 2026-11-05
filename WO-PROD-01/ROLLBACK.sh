#!/usr/bin/env bash
set -euo pipefail
package="$(cd -- "$(dirname -- "$0")" && pwd)"
if [[ $# != 1 ]]; then
  printf '%s\n' 'Usage: ROLLBACK.sh DISPOSABLE_COPY_IN_REPORTS' >&2
  exit 2
fi
exec powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$package/ROLLBACK.ps1" -Target "$1"
