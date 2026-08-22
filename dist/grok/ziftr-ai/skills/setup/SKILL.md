---
description: Guide through setting up a new Ziftr e-commerce store step by step
---

# Ziftr Store Setup Wizard

You are helping the user set up a new Ziftr e-commerce store. Guide them
through the setup using the Ziftr MCP tools.

## Authentication

The Ziftr MCP server is a hosted, OAuth-protected service. On first use the
agent client will prompt the user to authenticate in the browser (in Claude
Code, run `/mcp` if it does not prompt automatically). There is no separate
login step inside the tools.

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

## Tools you will use

- `whoami` - confirm connection, scopes, and tenant
- `search_knowledge`, `get_setup_checklist` - guidance and the live checklist
  (`search_knowledge` may be offline; fall back to https://docs.ziftr.ai)
- `get_sdk_method`, `get_type_definition`, `introspect_api` - inspect contracts
- `use_sdk` - run any SDK method (read/write store data, e.g. `stores.update`,
  `products.create`, `shippingZones.create`, `taxRates.create`). Writes prompt
  for confirmation. If `use_sdk` is unavailable, guide the user through the
  admin UI and docs instead of inventing a write path.

Start by calling `get_setup_checklist` to anchor the steps to the live store.

## Setup Steps

### 1. Store configuration
- Store name, branding, default currency, default locale
- Apply via `use_sdk` with the relevant `stores.*` method when available

### 2. Products
- Create initial products via `use_sdk` (`products.create`) when available
- Explain product types (physical, digital), SKUs, pricing (minor units),
  descriptions
- For bulk entry, hand off to the `products` skill

### 3. Shipping (physical products)
- Explain shipping zones, then create them via `use_sdk` when available

### 4. Taxes
- Explain tax options, then create rates via `use_sdk` when available

### 5. Storefront + next steps
- Recommend scaffolding a storefront with the `scaffold` skill
- Use the `launch-checklist` skill to verify
  readiness before going live
- Use `search_knowledge` (or docs.ziftr.ai) for deployment guides
