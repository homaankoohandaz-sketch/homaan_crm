#!/usr/bin/env bash
set -euo pipefail

echo "Homaan CRM - Codex environment bootstrap"

command -v git >/dev/null && git --version || echo "WARN: git not found"
command -v node >/dev/null && node --version || echo "WARN: node not found"

test -f ".agent-control/STATE.md" || {
  echo "Run this script from the repository root." >&2
  exit 1
}

echo "Control plane detected."
echo "Bootstrap checks complete."
