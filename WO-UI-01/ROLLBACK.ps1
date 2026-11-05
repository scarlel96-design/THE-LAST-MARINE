param([string]$Target = (Join-Path $PSScriptRoot '../src/resource-ui/main.ts'))
$ErrorActionPreference = 'Stop'
$baseline = Join-Path $PSScriptRoot '../baseline/WO-UI-01/main.ts'
Copy-Item -LiteralPath $baseline -Destination $Target -Force
if ((Get-FileHash -LiteralPath $baseline).Hash -ne (Get-FileHash -LiteralPath $Target).Hash) { throw 'Rollback hash mismatch' }
Write-Output 'ROLLBACK: legacy Q/W source bytes restored'
