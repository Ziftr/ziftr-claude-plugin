# ziftr-ai

Claude Code plugin for building e-commerce stores **and** Ziftr apps/connectors.

On install this plugin connects Claude Code to the hosted Ziftr MCP server
(`https://mcp.ziftr.ai/mcp`, a remote Streamable-HTTP server). The first
time a tool is used, Claude Code runs the OAuth flow in your browser (run
`/mcp` if it does not prompt automatically); tokens are stored and refreshed
automatically. Knowledge tools work without authentication where the
deployment enables them.

## MCP tools

- Always-on identity: `whoami` (connection, scopes, tenant resolution)
- Knowledge: `search_knowledge`, `get_sdk_method`, `get_type_definition`,
  `get_setup_checklist`, `introspect_api` (`search_knowledge` may be
  deploy-flag-gated; fall back to https://docs.ziftr.ai)
- Live store operations: `use_sdk` when enabled (runs any SDK method; reads are
  open, writes prompt for confirmation, destructive operations are blocked).
  On knowledge-only deployments `use_sdk` is unavailable.

## Skills

### Storefront track

- `/ziftr-ai:setup` - set up a new store step by step
- `/ziftr-ai:scaffold` - scaffold a storefront from the starter template
- `/ziftr-ai:products` - bulk-create products
- `/ziftr-ai:integrate-sdk` - add @ziftr.ai/sdk to an existing project
- `/ziftr-ai:launch-checklist` - validate launch readiness
- `/ziftr-ai:search` - search Ziftr docs and SDK reference

### App developer track

- `/ziftr-ai:build-app` - app manifest, distribution tiers, install lifecycle
- `/ziftr-ai:connector-dev` - activity-only connectors and ERP sync contracts
- `/ziftr-ai:webhooks-events` - event subscriptions, webhooks, triggers

## Agents

- `ziftr-integration-reviewer` - reviews @ziftr.ai/sdk and @ziftr.ai/blocks
  usage in storefront code
- `ziftr-launch-auditor` - audits store readiness to go live via live reads
- `app-integration-reviewer` - reviews app/connector designs against platform
  constraints (ERP sync surface, activity-only workers, conflicts, triggers)
