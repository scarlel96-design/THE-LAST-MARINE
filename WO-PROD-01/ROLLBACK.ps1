param([Parameter(Mandatory=$true)][string]$Target)
$ErrorActionPreference = 'Stop'
$package = $PSScriptRoot
$root = [System.IO.Path]::GetFullPath((Join-Path $package '..'))
$destination = [System.IO.Path]::GetFullPath($Target)
$allowed = [System.IO.Path]::GetFullPath((Join-Path $package 'reports')) + [System.IO.Path]::DirectorySeparatorChar
if (-not $destination.StartsWith($allowed,[System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'Use a disposable copy inside WO-PROD-01/reports.'
}
$baseline = Join-Path $root 'baseline/WO-PROD-01/main.ts'
$expected = '93f98bc452e2fed63afee5bb3be79aaf648b4add176fea71d89a8d94aae76795'
function Digest([string]$Path) {
    $algorithm = [System.Security.Cryptography.SHA256]::Create()
    try { return [System.BitConverter]::ToString($algorithm.ComputeHash([System.IO.File]::ReadAllBytes($Path))).Replace('-','').ToLowerInvariant() }
    finally { $algorithm.Dispose() }
}
if ((Digest $baseline) -ne $expected) { throw 'Baseline digest mismatch.' }
[System.IO.File]::Copy($baseline,$destination,$true)
if ((Digest $destination) -ne $expected) { throw 'Restore digest mismatch.' }
Write-Output 'ROLLBACK: original bytes restored; production source retained'
