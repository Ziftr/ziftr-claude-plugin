# Ziftr Claude Code Plugin

Official Ziftr plugin marketplace for Claude Code. The `ziftr-ai` plugin gives
Claude everything it needs to build and operate a Ziftr e-commerce store:

- The hosted Ziftr MCP server (connected automatically over HTTPS): docs
  search, SDK method lookup, API introspection, and live store operations
  (`use_sdk`)
- Guided skills: `/ziftr-ai:setup`, `/ziftr-ai:scaffold`, `/ziftr-ai:products`,
  `/ziftr-ai:integrate-sdk`, `/ziftr-ai:launch-checklist`, `/ziftr-ai:search`
- Agents: `ziftr-integration-reviewer`, `ziftr-launch-auditor`

## Install

```bash
claude plugin marketplace add Ziftr/ziftr-claude-plugin
claude plugin install ziftr-ai@ziftr
```

The first time a Ziftr tool is used, Claude Code opens the browser for OAuth
(run `/mcp` if it does not prompt). Tokens are stored and refreshed
automatically. Knowledge tools work without authentication.

Requirements:

- A Ziftr account for auth and live store operations
- For `/ziftr-ai:scaffold` and `/ziftr-ai:integrate-sdk` only: an npm access
  token from your Ziftr onboarding (early access); `/ziftr-ai:scaffold` also
  uses the starter repository URL provided there

## Status

Ziftr is in early access. The plugin currently connects to the preview
environment (`mcp-dev.ziftr.ai`); the production endpoint will replace it at
general availability via a plugin update.

## Docs and support

- Documentation: https://docs.ziftr.ai
- Support: support@ziftr.ai

## What's in this repo

```
.claude-plugin/marketplace.json   -- marketplace manifest (name: ziftr)
ziftr-ai/                         -- the plugin
  .claude-plugin/plugin.json      -- plugin manifest
  .mcp.json                       -- remote pointer to the hosted MCP server
  skills/                         -- 6 guided skills
  agents/                         -- 2 building/review agents
```

There is no local runtime to install -- `ziftr-ai/.mcp.json` connects to the
hosted Ziftr MCP server over HTTPS and Claude Code handles OAuth.

This repository is a read-only distribution mirror; issues are disabled.
Questions and bug reports: support@ziftr.ai.
