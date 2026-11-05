#!/usr/bin/env bash
set -euo pipefail
package="$(cd -- "$(dirname -- "$0")" && pwd)"
exec python "$package/restore-copy.py" "$@"
