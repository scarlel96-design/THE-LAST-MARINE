param(
    [ValidateSet('lifecycle','menu-roundtrip','ui02-diagnostic','ui02-consumption','native-card')]
    [string]$Scenario='lifecycle',
    [switch]$LocalOffline,
    [switch]$LaunchGame
)
$ErrorActionPreference='Stop'
if (-not $LocalOffline) { throw 'Confirm the local single-player test with -LocalOffline.' }
$launcher=Join-Path $PSScriptRoot '../WO-UI-02/LAUNCH_PERMISSION_FIX/START_TLM.ps1'
$launchArgs=@{}
if (-not $LaunchGame) { $launchArgs.InspectOnly=$true }
$state=(& $launcher @launchArgs | ConvertFrom-Json)
if (@($state.pids).Count -ne 1) { throw 'Expected one game process. Use -LaunchGame to start it.' }
$gameId=[int]@($state.pids)[0]
$deadline=(Get-Date).AddSeconds(20)
do {
    $game=Get-Process -Id $gameId -ErrorAction Stop
    if ($game.MainWindowHandle -ne 0) { break }
    if ((Get-Date) -gt $deadline) { throw 'Game window did not appear.' }
    Start-Sleep -Milliseconds 200
} while ($true)
$runName=(Get-Date).ToUniversalTime().ToString('yyyyMMdd-HHmmss')+'-'+$Scenario
$destination=Join-Path $PSScriptRoot ('runs/'+$runName)
& python -X utf8 (Join-Path $PSScriptRoot 'runner.py') (Join-Path $PSScriptRoot "scenarios/$Scenario.json") --pid $gameId --out $destination --local-offline
exit $LASTEXITCODE
