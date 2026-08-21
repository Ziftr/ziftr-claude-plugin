---
description: Bulk product creation workflow
---

# Bulk Product Creation

Create multiple products in batch on a Ziftr store via the MCP `use_sdk` tool.

## Authentication

The Ziftr MCP server authenticates over OAuth on first use; the agent client
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

`use_sdk` may be unavailable on some deployments. If it is offline, stop and
tell the user writes are not available through MCP; point them at the admin
UI and https://docs.ziftr.ai rather than inventing another write path.

## Steps

### 1. Gather products

Ask the user for their product list. For each product collect:

- **Name** (required)
- **SKU** (required, unique)
- **Price** in minor units (required, e.g. 1999 = $19.99)
- **Type**: physical or digital (default: physical)
- **Description** (optional)

Accept products as a list, table, CSV, or one at a time. If you are unsure of
the exact field names, call `get_sdk_method products.create` or
`get_type_definition CreateProductDto` first.

### 2. Validate

Before creating, verify:

- All required fields present (name, SKU, price)
- SKUs unique within the batch
- Prices are positive integers (minor units)
- No duplicate names

Present a summary for confirmation.

### 3. Create

For each product, call `use_sdk` with method `products.create` and the product
fields. `use_sdk` writes require confirmation -- confirm per product or explain
the batch up front. Report progress:

- Created: name (SKU)
- Failed: name -- reason

### 4. Summary

After processing, show total created vs failed, then call `use_sdk` with
`products.list` to confirm they appear in the store.
