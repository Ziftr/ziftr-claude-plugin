---
description: Validate store readiness before going live - checks products, shipping, taxes, and configuration
---

# Ziftr Launch Readiness Checklist

You are helping the user verify their Ziftr store is ready to launch. Work
through the checklist using the MCP `use_sdk` tool for live reads and
`get_setup_checklist` / `search_knowledge` for guidance.

## Authentication

The MCP server authenticates over OAuth on first use; the agent client
prompts in the browser (in Claude Code, run `/mcp` if not prompted).

Call `whoami` first to confirm connection, scopes, and memberships. If
`whoami` lists multiple memberships and there is no clear default, ask the
user which tenant to work in before any `use_sdk` call. Multi-membership
with no default fails closed with a candidate list (it does not silently
pick the System tenant).

Set a project default with `ZIFTR_TENANT` (UUID or slug) and optional
`ZIFTR_STORE` (UUID only) as environment variables for the MCP connection
(in Claude Code: the project's `.claude/settings.json` `env` block; `.env`
files are not auto-read). Or pass `tenant` / `store` on each `use_sdk`
call. Precedence: tool arg > header > default membership. Empty header
values are treated as unset.

## Process

1. **Anchor the checklist**
   - Call `get_setup_checklist` to pull the live, store-specific checklist.

2. **Inspect the store** (read-only `use_sdk` calls when available)
   - Products: `products.list` -- are there products, each with pricing?
   - Shipping: list shipping zones/rates -- at least one zone configured?
   - Taxes: list tax rates -- configured for the selling regions?
   - Store config: `stores.get` -- name, currency, locale set?
   - If `use_sdk` is unavailable, say so and walk the checklist from
     `get_setup_checklist` plus `search_knowledge` (or docs.ziftr.ai).

3. **Report**
   - Present results as a clear pass/fail checklist.
   - For each failure, explain what is missing and offer to fix it.

4. **Fix gaps**
   - No products -> the `products` skill or
     `use_sdk products.create` (pricing in minor units, e.g. $19.99 = 1999)
   - No shipping -> guide zone setup, create via `use_sdk` when available
   - No taxes -> explain options, create rates via `use_sdk` when available

5. **Final steps**
   - When all checks pass, recommend a test order.
   - Use `search_knowledge` with a deployment query for go-live guides, or
     open https://docs.ziftr.ai if the knowledge tool is offline.

## Tips

- Remind users about SEO: product meta titles and descriptions.
- For a deeper automated pass, delegate to the `ziftr-launch-auditor` agent.
