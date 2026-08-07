---
name: set-scope
description: >
  Interactively set working scope (organization + store) for use_sdk via
  set_scope. Use when the user runs /set-scope, /ziftr-ai:set-scope, wants to
  pick a tenant/store, switch stores mid-session, or pin scope by friendly name.
---

# Set working scope (interactive)

Pin the MCP working scope so every `use_sdk` call is labeled and scoped without
passing tenant/store on each call.

## Prerequisites

- Ziftr MCP connected (OAuth). Run `/mcp` if tools are missing.
- Prefer project header `X-Ziftr-Tenant` (or `ZIFTR_TENANT`) for a default org.
  **Leave `X-Ziftr-Store` / `ZIFTR_STORE` unset** so mid-session store pins from
  this skill apply. A store header overrides the pin.

## Flow (always wait for the user between steps)

1. Call `set_scope` with **no arguments** (use `whoami` first only if auth is unclear).
2. **Organization**
   - If multiple organizations are listed: present a numbered multi-choice list
     (name + slug/id). Wait for the user to pick one.
   - If only one organization: use it without asking.
3. **Store**
   - Use the stores listed under the chosen org from `set_scope` output
     (name, code, UUID).
   - If multiple stores: present them **plus "All stores"** and wait for a pick.
   - If only one store: select it (brief confirm optional).
   - If enumeration was **denied** (not empty): say so clearly; do not claim
     the user has zero stores. Ask for an explicit UUID only if needed.
   - If truly empty: say none enumerated; still allow explicit UUID if the user has one.
4. Call `set_scope` with:
   - `tenant`: chosen org id or slug
   - `store`: chosen store UUID, unique code/name, or `"all"`
5. Echo the returned scope one-liner (e.g. `scope: SoClean Dev / SoClean Dev Store`).
   Soft notes about tenant headers are expected; do **not** tell the user the
   pin failed when only the tenant header is set.

## Rules

- Never invent store UUIDs.
- Never call `stores.list` for scope setup (org-level `stores:read` gate).
  If enumeration is denied or empty, ask the user for an explicit store UUID
  or fix membership enumeration.
- To clear: `set_scope` with `clear: true`.
- To switch later: run this skill again or call `set_scope` with new tenant/store.

## Tools

- `set_scope` -- inspect candidates, pin, clear
- `whoami` -- connection / memberships if needed
- `use_sdk` -- after pin, scoped reads/writes use the pin automatically
