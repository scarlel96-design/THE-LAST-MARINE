param([string]$Target)
$ErrorActionPreference = 'Stop'
if (-not $Target) { $Target = Join-Path $PSScriptRoot 'docs\WORK_ORDER.md' }
$Original = Join-Path $PSScriptRoot 'baseline\WORK_ORDER.md'
Copy-Item -LiteralPath $Original -Destination $Target -Force
if ((Get-FileHash -LiteralPath $Original).Hash -ne (Get-FileHash -LiteralPath $Target).Hash) {
    throw 'Rollback hash mismatch'
}
Write-Output 'ROLLBACK: original bytes restored'
