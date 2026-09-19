$ErrorActionPreference = "Stop"

Write-Host "Homaan CRM - Codex environment bootstrap"

if (Get-Command git -ErrorAction SilentlyContinue) {
  git --version
} else {
  Write-Warning "Git is not available on PATH."
}

if (Get-Command node -ErrorAction SilentlyContinue) {
  node --version
} else {
  Write-Warning "Node.js is not available on PATH."
}

if (Test-Path ".agent-control/STATE.md") {
  Write-Host "Control plane detected."
} else {
  throw "Run this script from the repository root."
}

Write-Host "Bootstrap checks complete."
