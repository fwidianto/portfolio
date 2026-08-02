Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = (& git rev-parse --show-toplevel 2>$null)
if (-not $repoRoot) {
    throw 'Run this script inside the portfolio Git repository.'
}

$expected = @(
    @{
        Name = 'frontend-design'
        Path = Join-Path $repoRoot '.agents\skills\frontend-design\SKILL.md'
    },
    @{
        Name = 'design-review'
        Path = Join-Path $repoRoot '.agents\skills\design-review\SKILL.md'
    }
)

$failures = New-Object System.Collections.Generic.List[string]

foreach ($skill in $expected) {
    $path = $skill.Path
    $name = $skill.Name

    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) {
        $failures.Add("Missing: $path")
        continue
    }

    $content = Get-Content -LiteralPath $path -Raw

    if ($content -notmatch '(?ms)^---\s*.*?^name:\s*' + [regex]::Escape($name) + '\s*$.*?^---\s*$') {
        $failures.Add("Invalid or mismatched YAML frontmatter in: $path")
        continue
    }

    if ($content -notmatch '(?m)^description:\s*\S+') {
        $failures.Add("Missing skill description in: $path")
        continue
    }

    Write-Host "PASS  $name" -ForegroundColor Green
    Write-Host "      $path"
}

if ($failures.Count -gt 0) {
    Write-Host ''
    foreach ($failure in $failures) {
        Write-Host "FAIL  $failure" -ForegroundColor Red
    }
    exit 1
}

Write-Host ''
Write-Host 'Both selected repository-scoped skills are installed correctly.' -ForegroundColor Green
Write-Host 'Open a fresh Codex session at the repository root and use /skills to confirm discovery.'