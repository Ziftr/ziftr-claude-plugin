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

The plugin connects to the production hosted MCP gateway at
`https://mcp.ziftr.ai/mcp`.

## Internal / preview gateway

Public installs always use production. The preview gateway at
`https://mcp-dev.ziftr.ai/mcp` remains available for internal engineering.

To point Claude Code at the preview host instead of production, add an HTTP
MCP server in your project or user Claude Code settings (this overrides or
supplements the plugin pointer depending on how you name the server):

```json
{
  "mcpServers": {
    "ziftr-dev": {
      "type": "http",
      "url": "https://mcp-dev.ziftr.ai/mcp"
    }
  }
}
```

Use a distinct server name such as `ziftr-dev` if you still need the production
`ziftr` server from the plugin. Alternatively, clone this marketplace locally,
set `ziftr-ai/.mcp.json` to the preview URL, and `claude plugin marketplace add`
the local path for a private install. There is no separate public marketplace
entry for the preview host.

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
