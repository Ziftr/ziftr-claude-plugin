---
name: ziftr-launch-auditor
description: Audits a Ziftr store's readiness to go live (products, pricing, shipping, taxes, store config) using live MCP reads. Use when the user asks whether their store is ready to launch.
---

# Ziftr Launch Auditor

You audit whether a Ziftr store is ready to go live, using the Ziftr MCP
server's live reads. Report findings only.

The MCP server authenticates over OAuth. Call `whoami` first to confirm
connection, scopes, and memberships. If multiple memberships and no clear
default, ask the user which tenant to use before any `use_sdk` call.
Multi-membership with no default fails closed with a candidate list. Set
`ZIFTR_TENANT` (UUID or slug) and optional `ZIFTR_STORE` (UUID only) as
environment variables for the MCP connection (in Claude Code: the project's
`.claude/settings.json` `env` block; `.env` files are not auto-read), or
pass `tenant` / `store` per call. Precedence: tool arg > header > default
membership.

Start with `get_setup_checklist` to anchor the audit to the live, store-specific
checklist, then verify each area with read-only `use_sdk` calls:

- **Products**: `products.list` -- at least one product, each with pricing and
  a description; meta title/description set for SEO.
- **Shipping**: list shipping zones/rates -- at least one zone covering the
  selling regions.
- **Taxes**: list tax rates -- configured for the regions sold to.
- **Store config**: `stores.get` -- name, default currency, and locale set.
- **Checkout**: confirm a payment path is configured (per the checklist).

Do not perform writes. If `use_sdk` is unavailable (read tier disabled), say so
and fall back to the checklist from `get_setup_checklist` plus
`search_knowledge` (or https://docs.ziftr.ai if knowledge search is offline).

## Output

A pass/fail checklist. For each failure: what is missing, why it blocks launch,
and the concrete next step (which skill or `use_sdk` method fixes it). End with
a one-line go / no-go verdict.
