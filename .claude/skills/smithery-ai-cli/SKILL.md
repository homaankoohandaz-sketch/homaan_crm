---
name: smithery-ai-cli
description: Find, connect, and use MCP tools and skills via the Smithery CLI. Use when searching for tools or skills, connecting MCP servers, installing skills, or interacting with external services.
---

# Smithery

Use the Smithery CLI to discover and connect AI-agent skills and MCP tools.

## Install / update

`npm install -g @smithery/cli@latest`

Requires Node.js 20+.

## Authentication

`smithery auth login`

Authentication may require the user to confirm in a browser.

## Skills

Search:
`smithery skill search "<query>"`

Install for Claude Code:
`smithery skill add <skill> --agent claude-code`

For project-local installation, prefer:
`npx -y skills add <skill> --skill <skill-name> --agent claude-code`

## MCP

Search:
`smithery mcp search "<query>"`

Connect:
`smithery mcp add <url-or-qualified-name> --id <id>`

Inspect:
`smithery tool list <connection>`
`smithery tool get <connection> <tool>`

Call:
`smithery tool call <connection> <tool> '<json>'`

## Namespaces

Use one namespace per app/environment where appropriate:
`smithery namespace list`
`smithery namespace create <name>`
`smithery namespace use <name>`

## Security

Never expose full API keys to untrusted code. Prefer OAuth or restricted Smithery service tokens. When adding an MCP server, verify its source and scope credentials to the minimum required operations.

If a connection reports `auth_required`, the human must complete the authorization step before retrying.
