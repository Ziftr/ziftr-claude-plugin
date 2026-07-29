# ziftr-ai

Claude Code plugin for building e-commerce stores on the Ziftr platform.

On install this plugin connects Claude Code to the hosted Ziftr MCP server
(`https://mcp.ziftr.ai/mcp`, a remote Streamable-HTTP server). The first
time a tool is used, Claude Code runs the OAuth flow in your browser (run
`/mcp` if it does not prompt automatically); tokens are stored and refreshed
automatically. Knowledge tools work without authentication.

## MCP tools

- Always-on identity: `whoami` (connection, scopes, tenant resolution)
- Knowledge: `search_knowledge`, `get_sdk_method`, `get_type_definition`,
  `get_setup_checklist`, `introspect_api` (`search_knowledge` may be
  deploy-flag-gated; fall back to https://docs.ziftr.ai)
- Live store operations: `use_sdk` when enabled (runs any SDK method; reads are
  open, writes prompt for confirmation, destructive operations are blocked).
  On knowledge-only deployments `use_sdk` is unavailable.

## Skills

- `/ziftr-ai:setup` - set up a new store step by step
- `/ziftr-ai:scaffold` - scaffold a storefront from the starter template
- `/ziftr-ai:products` - bulk-create products
- `/ziftr-ai:integrate-sdk` - add @ziftr.ai/sdk to an existing project
- `/ziftr-ai:launch-checklist` - validate launch readiness
- `/ziftr-ai:search` - search Ziftr docs and SDK reference

## Agents

- `ziftr-integration-reviewer` - reviews @ziftr.ai/sdk and @ziftr.ai/blocks
  usage in your code
- `ziftr-launch-auditor` - audits store readiness to go live via live reads
