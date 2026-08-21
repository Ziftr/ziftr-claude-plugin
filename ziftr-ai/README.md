# ziftr-ai

Agent plugin for building e-commerce stores **and** Ziftr apps/connectors.
This directory is the source of truth; the Agent Plugins 1.0 (Cursor, Codex,
VS Code/Copilot, Kiro) and Grok Build packagings are generated from it into
`dist/` (see the repository README for per-client install).

On install this plugin connects the agent client to the hosted Ziftr MCP
server (`https://mcp.ziftr.ai/mcp`, a remote Streamable-HTTP server). The
first time a tool is used, the client runs the OAuth flow in your browser
(in Claude Code, run `/mcp` if it does not prompt automatically); tokens are
stored and refreshed automatically. Knowledge tools work without
authentication where the deployment enables them.

## MCP tools

- Always-on identity: `whoami` (connection, **environment**, **docs host**,
  scopes, memberships / tenant resolution). Call this first when you need to
  know whether you are on dev, staging, or prod.
- Working scope: `set_scope` pins tenant + store for subsequent `use_sdk`
  calls. Prefer the `set-scope` skill for an interactive org then store pick.
- Knowledge: `search_knowledge` (canonical), `search_docs` (deprecated alias),
  `get_sdk_method`, `get_type_definition`, `get_setup_checklist`,
  `introspect_api`. `search_knowledge` may be deploy-flag-gated; when offline,
  fall back to the **Docs host from `whoami`** (dev -> docs-dev, staging ->
  docs-staging, prod -> docs) -- never assume production docs from a
  dev-connected session.
- Live store operations: `use_sdk` when enabled (runs any SDK method; reads are
  open, writes prompt for confirmation). Confirm-gated bulk catalog deletes
  use `catalog_bulk_delete`. On knowledge-only deployments both are unavailable.
- Optional project defaults: set `ZIFTR_TENANT` (UUID or slug) and
  `ZIFTR_STORE` (UUID only) as environment variables for the MCP connection
  (in Claude Code: the project's `.claude/settings.json` `env` block; `.env`
  files are not auto-read). These map to `X-Ziftr-Tenant` / `X-Ziftr-Store`
  request headers. Or pass `tenant` / `store` on each `use_sdk` call.
  Precedence: tool arg > header > default membership. Call `whoami` first
  when membership is ambiguous.
  **Leave `X-Ziftr-Store` / `ZIFTR_STORE` unset** if you want mid-session
  `set_scope` store pins (or the `set-scope` skill) to apply; a store header
  wins over the pin.
- Optional endpoint override: set `ZIFTR_MCP_URL` the same way to point the
  plugin at a specific gateway (default `https://mcp.ziftr.ai/mcp`; dev
  gateway `https://mcp-dev.ziftr.ai/mcp`). Useful for pinning a project to
  the dev environment regardless of where the production hostname points.
  Env expansion applies to the Claude Code packaging's `.mcp.json`; other
  packagings pin the production URL (override in your client's MCP settings).

## Skills

In Claude Code these are invoked as `/ziftr-ai:<name>`; other clients use
their own skill invocation (or the agent picks them up from the request).

### Storefront track

- `setup` (`/ziftr-ai:setup`) - set up a new store step by step
- `set-scope` (`/ziftr-ai:set-scope`) - interactively pick organization then store (or all stores)
- `scaffold` (`/ziftr-ai:scaffold`) - scaffold a storefront from the starter template
- `products` (`/ziftr-ai:products`) - bulk-create products
- `integrate-sdk` (`/ziftr-ai:integrate-sdk`) - add @ziftr.ai/sdk to an existing project
- `launch-checklist` (`/ziftr-ai:launch-checklist`) - validate launch readiness
- `search` (`/ziftr-ai:search`) - search Ziftr docs and SDK reference

### App developer track

- `build-app` (`/ziftr-ai:build-app`) - app manifest, distribution tiers, install lifecycle
- `connector-dev` (`/ziftr-ai:connector-dev`) - activity-only connectors and ERP sync contracts
- `webhooks-events` (`/ziftr-ai:webhooks-events`) - event subscriptions, webhooks, triggers

## Agents

Included in the Claude Code and Grok packagings (Agent Plugins 1.0 does not
carry agents):

- `ziftr-integration-reviewer` - reviews @ziftr.ai/sdk and @ziftr.ai/blocks
  usage in storefront code
- `ziftr-launch-auditor` - audits store readiness to go live via live reads
- `app-integration-reviewer` - reviews app/connector designs against platform
  constraints (ERP sync surface, activity-only workers, conflicts, triggers)
