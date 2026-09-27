# BuildWise Worker Skills — canonical adapters

## Grok Build
Source: official xAI Grok Build.
Install:
curl -fsSL https://x.ai/cli/install.sh | bash
CI authentication: XAI_API_KEY
Headless execution: grok -p "<task>"
Purpose: primary repository implementation worker.
Reference: https://docs.x.ai/build/overview

## Claude Code
Source: official Anthropic Claude Code.
CI authentication: ANTHROPIC_API_KEY
Headless execution: claude -p "<task>" --max-turns 3
Purpose: independent review, integration, repair and QA.
Reference: https://docs.anthropic.com/en/docs/claude-code/github-actions

## Operating rule
Do not install community "Grok CLI" variants when the official xAI Grok Build is available.
Do not paste third-party skill implementations into the product when an official maintained integration exists.
Use the smallest stable adapter that gives the worker repository read/write/test capability.

## Worker order
1. ChatGPT — architecture, decomposition, routing and evidence reconciliation.
2. Grok Build — implementation.
3. Claude Code — independent review and repair.
4. CI/tests — verification.
5. Control Plane — checkpoint and next-task selection.

## Required evidence
A worker is operational only after:
runtime available + authentication available + repository access + bounded task + successful non-production execution + tests + evidence.
