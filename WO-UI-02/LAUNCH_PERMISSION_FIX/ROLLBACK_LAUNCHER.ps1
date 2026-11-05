param([Parameter(Mandatory=$true)][string]$TargetDirectory)
$ErrorActionPreference = 'Stop'
$targetPath = [IO.Path]::GetFullPath($TargetDirectory).TrimEnd('\')
$workspacePath = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../../..')).TrimEnd('\')
$workPrefix = (Join-Path $workspacePath 'work') + '\'
if ($targetPath -ne $PSScriptRoot -and -not $targetPath.StartsWith($workPrefix,[StringComparison]::OrdinalIgnoreCase)) {
    throw 'Rollback target must be this launcher directory or a workspace work copy.'
}
$expected = @{
    'START_TLM.ps1' = 'e83d05b4c5612a50a5263f4eb5500935b0a6e7de742efc72114575ee4555fdb9'
    'START_TLM.cmd' = '0234f75106a8efc672c110be8cbe699f7b69d4252f04fc18b48b708992f53a5e'
}
foreach ($name in $expected.Keys) {
    $path = Join-Path $targetPath $name
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) { throw "Missing launcher: $name" }
    $text = [IO.File]::ReadAllText($path).Replace("`r`n","`n")
    $digest = [Security.Cryptography.SHA256]::Create()
    try { $hash = [BitConverter]::ToString($digest.ComputeHash([Text.Encoding]::UTF8.GetBytes($text))).Replace('-','').ToLowerInvariant() }
    finally { $digest.Dispose() }
    if ($hash -ne $expected[$name]) { throw "Launcher changed: $name" }
}
foreach ($name in $expected.Keys) {
    Remove-Item -LiteralPath (Join-Path $targetPath $name) -ErrorAction Stop
}
'ROLLBACK: launcher copies removed; game and Windows settings unchanged'
