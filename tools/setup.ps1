$ErrorActionPreference = 'Stop'
$Workspace = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..\..'))
$Repositories = @(
    @('scm-js', 'https://github.com/scm-js/scm-js.git', 'f4fe24e7519096c2cdd9c1af887f9340317d7af7'),
    @('plugin-trigscript', 'https://github.com/scm-js/plugin-trigscript.git', '40243398aeb04fcf2893aabb420a3cba92f0d3ac')
)
foreach ($Repository in $Repositories) {
    $Destination = Join-Path $Workspace ('work\' + $Repository[0])
    if (-not (Test-Path -LiteralPath $Destination)) {
        New-Item -ItemType Directory -Path $Destination -Force | Out-Null
        git -C $Destination init
        if ($LASTEXITCODE) { throw 'Repository initialization failed' }
        git -C $Destination remote add origin $Repository[1]
        if ($LASTEXITCODE) { throw 'Remote configuration failed' }
        git -C $Destination fetch --depth 1 origin $Repository[2]
        if ($LASTEXITCODE) { throw 'Pinned source fetch failed' }
        git -C $Destination checkout --detach FETCH_HEAD
        if ($LASTEXITCODE) { throw 'Pinned source checkout failed' }
    }
    $Actual = git -C $Destination rev-parse HEAD
    if ($Actual -ne $Repository[2]) { throw 'Pinned source mismatch' }
    Push-Location -LiteralPath $Destination
    try {
        npm ci --ignore-scripts --no-audit --no-fund
        if ($LASTEXITCODE) { throw 'Dependency installation failed' }
    } finally { Pop-Location }
}
