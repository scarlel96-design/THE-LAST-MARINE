param([Parameter(Mandatory=$true)][string]$Target)
& python -X utf8 (Join-Path $PSScriptRoot 'restore-copy.py') $Target
exit $LASTEXITCODE
