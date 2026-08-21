# Ziftr Agent Plugin

Official Ziftr plugin (`ziftr-ai`) for AI coding agents. One skills source
ships to every supported client:

- Claude Code (plugin marketplace in this repo)
- Agent Plugins 1.0 clients: Cursor, Codex CLI, VS Code / GitHub Copilot,
  Kiro (`dist/agent-plugins/ziftr-ai`)
- Grok Build (`dist/grok/ziftr-ai`, marketplace manifest in this repo)

The plugin gives the agent everything it needs to build and operate a Ziftr
e-commerce store **and** to design apps and connectors on the Ziftr app
platform:

- The hosted Ziftr MCP server (connected automatically over HTTPS):
  `whoami`, knowledge search (`search_knowledge`), SDK method lookup, API
  introspection, and live store operations (`use_sdk` when enabled)
- Storefront skills: `setup`, `set-scope`, `scaffold`, `products`,
  `integrate-sdk`, `launch-checklist`, `search`
- App developer skills: `build-app`, `connector-dev`, `webhooks-events`
- Agents (Claude Code and Grok packagings only; Agent Plugins 1.0 does not
  carry agents): `ziftr-integration-reviewer`, `ziftr-launch-auditor`,
  `app-integration-reviewer`

## Install

### Claude Code

```bash
claude plugin marketplace add Ziftr/ziftr-claude-plugin
claude plugin install ziftr-ai@ziftr
```

### Codex CLI (0.147.0+)

Add this repository as a plugin marketplace and install from the `/plugins`
browser, or:

```bash
codex plugin marketplace add Ziftr/ziftr-claude-plugin
```

The Agent Plugins package lives at `dist/agent-plugins/ziftr-ai`; if your
Codex version asks for a path within the repository, use that directory.

### Cursor

Add the repository through the Customize panel (Plugins), or add it to your
team marketplace. The Agent Plugins 1.0 package is at
`dist/agent-plugins/ziftr-ai` (root `plugin.json`).

### VS Code / GitHub Copilot

Run the "Chat: Install Plugin From Source" command with this repository's
URL, or add the repository under the `chat.plugins.marketplaces` setting.
The package path is `dist/agent-plugins/ziftr-ai`.

### Kiro

Copy the skill directories from `dist/agent-plugins/ziftr-ai/skills/` into
`.kiro/skills/` (project) or `~/.kiro/skills/` (user), and add the MCP
server from `dist/agent-plugins/ziftr-ai/mcp.json` to your Kiro MCP config.

### Grok Build

This repository is also a Grok plugin marketplace
(`.grok-plugin/marketplace.json`). Add it as a marketplace source in Grok
(Grok also reads Claude Code marketplaces directly), then:

```
grok plugin install ziftr-ai --trust
```

### Authentication (all clients)

The first time a Ziftr MCP tool is used, your client opens the browser for
OAuth (in Claude Code, run `/mcp` if it does not prompt). Tokens are stored
and refreshed automatically. Knowledge tools work without authentication
when the deployment enables them.

Requirements:

- A Ziftr account for auth and live store operations
- For the `scaffold` and `integrate-sdk` skills only: an npm access token
  from your Ziftr onboarding (early access); `scaffold` also uses the
  starter repository URL provided there

## Status

All packagings connect to the production hosted MCP gateway at
`https://mcp.ziftr.ai/mcp`.

## Internal / preview gateway

Public installs always use production. The preview gateway at
`https://mcp-dev.ziftr.ai/mcp` remains available for internal engineering.

To point a client at the preview host instead of production, add an HTTP
MCP server in your client's own MCP settings (this overrides or supplements
the plugin pointer depending on how you name the server):

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

Use a distinct server name such as `ziftr-dev` if you still need the
production `ziftr` server from the plugin. Alternatively, clone this
repository locally, set the packaging's MCP config to the preview URL, and
install from the local path. There is no separate public marketplace entry
for the preview host.

## Docs and support

- Documentation: https://docs.ziftr.ai
- Support: support@ziftr.ai
- Internal dogfood script (contributors): [docs/dogfood-test.md](docs/dogfood-test.md)

## What's in this repo

```
.claude-plugin/marketplace.json   -- Claude Code marketplace manifest (name: ziftr)
.grok-plugin/marketplace.json     -- Grok marketplace manifest (generated)
ziftr-ai/                         -- SOURCE OF TRUTH for all packagings
  .claude-plugin/plugin.json      -- plugin manifest
  .mcp.json                       -- remote pointer to the hosted MCP server
  skills/                         -- guided skills (storefront + app developer)
  agents/                         -- review and audit agents
scripts/build-packagings.mjs      -- generates dist/ + .grok-plugin/ from ziftr-ai/
dist/agent-plugins/ziftr-ai/      -- GENERATED Agent Plugins 1.0 package
dist/grok/ziftr-ai/               -- GENERATED Grok Build package
docs/                             -- contributor dogfood checklist
```

Edit skills and agents only under `ziftr-ai/`, then run
`node scripts/build-packagings.mjs` and commit the regenerated outputs. CI
fails if the generated packagings are stale.

There is no local runtime to install -- every packaging points at the hosted
Ziftr MCP server over HTTPS and the client handles OAuth.

This repository is a read-only distribution mirror; issues are disabled.
Questions and bug reports: support@ziftr.ai.
