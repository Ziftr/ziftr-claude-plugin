---
description: Guide through setting up a new Ziftr e-commerce store step by step
---

# Ziftr Store Setup Wizard

You are helping the user set up a new Ziftr e-commerce store. Guide them
through the setup using the Ziftr MCP tools.

## Authentication

The Ziftr MCP server is a hosted, OAuth-protected service. On first use Claude
Code will prompt the user to authenticate in the browser (run `/mcp` if it does
not prompt automatically). The connection determines the user's tenant/store
context -- there is no separate login step inside the tools.

Start with `whoami` if the user is unsure whether they are connected or which
tenant is resolved.

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
- For bulk entry, hand off to the `/ziftr-ai:products` skill

### 3. Shipping (physical products)
- Explain shipping zones, then create them via `use_sdk` when available

### 4. Taxes
- Explain tax options, then create rates via `use_sdk` when available

### 5. Storefront + next steps
- Recommend scaffolding a storefront with `/ziftr-ai:scaffold`
- Use `/ziftr-ai:launch-checklist` to verify readiness before going live
- Use `search_knowledge` (or docs.ziftr.ai) for deployment guides
