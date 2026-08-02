Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = (& git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) {
    throw 'Run this script inside the portfolio Git repository.'
}

Push-Location $repoRoot
try {
    $branch = (& git branch --show-current).Trim()
    if ($branch -ne 'agent/portfolio-skill-experiment') {
        Write-Warning "Current branch is '$branch'. The intended experiment branch is 'agent/portfolio-skill-experiment'."
        throw 'Switch to the experiment branch before installing repository-scoped skills.'
    }

    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        throw 'Node.js is required for the interactive skills installer.'
    }

    if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
        throw 'npx is required for the interactive skills installer.'
    }

    Write-Host 'The installer is interactive.' -ForegroundColor Cyan
    Write-Host 'Select ONLY:' -ForegroundColor Cyan
    Write-Host '  - frontend-design'
    Write-Host '  - design-review'
    Write-Host 'Target agent: Codex'
    Write-Host 'Scope: project/repository (not global)'
    Write-Host ''

    & npx skills add julianoczkowski/designer-skills
    if ($LASTEXITCODE -ne 0) {
        throw "The skills installer exited with code $LASTEXITCODE."
    }

    Write-Host ''
    & powershell -ExecutionPolicy Bypass -File (Join-Path $repoRoot 'scripts\verify-portfolio-design-skills.ps1')
    if ($LASTEXITCODE -ne 0) {
        throw 'Installation completed, but repository-scoped skill verification failed.'
    }

    Write-Host ''
    Write-Host 'Installation verified.' -ForegroundColor Green
    Write-Host 'Open a fresh Codex session at the repository root and run /skills.'
}
finally {
    Pop-Location
}