param([switch]$InspectOnly)

$ErrorActionPreference = 'Stop'
$targetExe = 'C:\Program Files (x86)\StarCraft\x86_64\StarCraft.exe'
$targetDirectory = Split-Path -Parent $targetExe

# Reject an elevated caller. Keep the launch at standard-user privilege.
$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]::new($identity)
if ($principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw 'Start this launcher as a standard user. Administrator execution is not supported.'
}
if (-not (Test-Path -LiteralPath $targetExe -PathType Leaf)) {
    throw 'The verified StarCraft installation path is missing.'
}
if ($env:__COMPAT_LAYER -match '(?i)RUNASADMIN') {
    throw 'The caller requests RUNASADMIN. No game was started.'
}

# Check both registry views. Do not modify compatibility or security settings.
foreach ($hive in @([Microsoft.Win32.RegistryHive]::CurrentUser, [Microsoft.Win32.RegistryHive]::LocalMachine)) {
    foreach ($view in @([Microsoft.Win32.RegistryView]::Registry32, [Microsoft.Win32.RegistryView]::Registry64)) {
        $baseKey = [Microsoft.Win32.RegistryKey]::OpenBaseKey($hive, $view)
        $layerKey = $null
        try {
            $layerKey = $baseKey.OpenSubKey('Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers')
            $flags = if ($layerKey) { [string]$layerKey.GetValue($targetExe, '') } else { '' }
            if ($flags -match '(?i)RUNASADMIN') {
                throw "RUNASADMIN remains in $hive/$view. No game was started."
            }
        } finally {
            if ($layerKey) { $layerKey.Dispose() }
            $baseKey.Dispose()
        }
    }
}

$matchingGames = @()
foreach ($runningGame in @(Get-Process -Name StarCraft -ErrorAction SilentlyContinue)) {
    $observedPath = $runningGame.Path
    if (-not $observedPath) {
        throw 'A StarCraft process has an unreadable path. No duplicate was started.'
    }
    if ([string]::Equals($observedPath, $targetExe, [StringComparison]::OrdinalIgnoreCase)) {
        $matchingGames += $runningGame
    }
}

$status = if ($matchingGames.Count) { 'ALREADY_RUNNING' } else { 'READY' }
$gameIds = @($matchingGames | ForEach-Object { $_.Id })
if (-not $InspectOnly -and -not $matchingGames.Count) {
    $launchInfo = [Diagnostics.ProcessStartInfo]::new()
    $launchInfo.FileName = $targetExe
    $launchInfo.WorkingDirectory = $targetDirectory
    $launchInfo.Arguments = '-launch'
    $launchInfo.UseShellExecute = $false
    $startedGame = [Diagnostics.Process]::Start($launchInfo)
    $gameIds = @($startedGame.Id)
    $status = 'STARTED'
}

[pscustomobject]@{
    status = $status
    pids = $gameIds
    executable = $targetExe
    arguments = '-launch'
    useShellExecute = $false
    elevationVerb = $null
    uiValidation = 'NOT RUN'
} | ConvertTo-Json -Depth 3
