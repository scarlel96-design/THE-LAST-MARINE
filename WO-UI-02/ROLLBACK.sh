#!/usr/bin/env bash
set -euo pipefail
root="$(cd -- "$(dirname -- "$0")" && pwd)"
if [[ $# -lt 1 || $# -gt 2 ]]; then
  printf '%s\n' 'Usage: ROLLBACK.sh TARGET_COPY [pre-pause|resource-ui]' >&2
  exit 2
fi
case "${2:-pre-pause}" in
  pre-pause) original="$root/../baseline/WO-UI-02/pre-pause-native-main.ts" ;;
  resource-ui) original="$root/../baseline/WO-UI-02/main.ts" ;;
  *) printf '%s\n' 'Unknown rollback state' >&2; exit 2 ;;
esac
expected="$(sha256sum -- "$original" | cut -d ' ' -f 1)"
case "${2:-pre-pause}:$expected" in
  pre-pause:7e6c15b3de23d6efa68bcfee03bc87c61c9ce0cceefde5140c0ee2a79bfb381b) ;;
  resource-ui:93f98bc452e2fed63afee5bb3be79aaf648b4add176fea71d89a8d94aae76795) ;;
  *) printf '%s\n' 'Rollback snapshot hash differs' >&2; exit 3 ;;
esac
cp -- "$original" "$1"
cmp -- "$original" "$1"
printf 'ROLLBACK: %s source bytes restored\n' "${2:-pre-pause}"
