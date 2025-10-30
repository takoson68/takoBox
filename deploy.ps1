Param(
  [string]$TemplatePath = "core/templates/static-site",
  [switch]$NoBase
)

$ErrorActionPreference = 'Stop'

function Write-Step($msg) { Write-Host "[+] $msg" -ForegroundColor Cyan }
function Write-Warn($msg) { Write-Host "[!] $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "[x] $msg" -ForegroundColor Red }

try {
  $repoRoot = $PSScriptRoot
  if (-not $repoRoot) { $repoRoot = (Get-Location).Path }

  $fullTemplatePath = Join-Path $repoRoot $TemplatePath
  if (-not (Test-Path $fullTemplatePath)) {
    throw "Template path not found: $fullTemplatePath"
  }

  # Check npm
  if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "npm not found. Please install Node.js/npm first."
  }

  Write-Step "Using template: $TemplatePath"

  Push-Location $fullTemplatePath
  try {
    Write-Step "Installing dependencies (npm ci)"
    npm ci | Write-Output

    $baseArg = $null
    if (-not $NoBase) { $baseArg = "--base=./" }

    if ($baseArg) {
      Write-Step "Building with relative base (npm run build -- $baseArg)"
      npm run build -- --base=./ | Write-Output
    } else {
      Write-Step "Building (npm run build)"
      npm run build | Write-Output
    }
  } finally {
    Pop-Location
  }

  $distPath = Join-Path $fullTemplatePath 'dist'
  if (-not (Test-Path $distPath)) {
    throw "Build output not found: $distPath"
  }

  # Backup existing root index.html (if any)
  $rootIndex = Join-Path $repoRoot 'index.html'
  if (Test-Path $rootIndex) {
    $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $backupPath = Join-Path $repoRoot ("index.backup.$timestamp.html")
    Write-Step "Backing up existing index.html -> $(Split-Path -Leaf $backupPath)"
    Copy-Item $rootIndex $backupPath -Force
  }

  # Ensure .nojekyll to avoid Jekyll processing on GitHub Pages
  $noJekyll = Join-Path $repoRoot '.nojekyll'
  if (-not (Test-Path $noJekyll)) {
    Write-Step "Creating .nojekyll at repo root"
    New-Item -ItemType File -Path $noJekyll -Force | Out-Null
  }

  # Copy dist content to repo root
  Write-Step "Copying build output to repo root"
  Get-ChildItem -Path $distPath -Force | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $repoRoot -Recurse -Force
  }

  Write-Step "Done. Commit and push to deploy Pages (root)."
  Write-Host "    git add -A" -ForegroundColor DarkGray
  Write-Host "    git commit -m 'Deploy static site to root'" -ForegroundColor DarkGray
  Write-Host "    git push" -ForegroundColor DarkGray
  Write-Warn "Make sure GitHub Pages is set to deploy from the 'main' branch, folder: /(root)."
}
catch {
  Write-Err $_
  exit 1
}

