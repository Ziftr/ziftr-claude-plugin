---
description: Validate store readiness before going live - checks products, shipping, taxes, and configuration
---

# Ziftr Launch Readiness Checklist

You are helping the user verify their Ziftr store is ready to launch. Work
through the checklist using the MCP `use_sdk` tool for live reads and
`get_setup_checklist` / `search_docs` for guidance.

## Authentication

The MCP server authenticates over OAuth on first use (run `/mcp` if not
prompted); the connection carries the tenant/store context.

## Process

1. **Anchor the checklist**
   - Call `get_setup_checklist` to pull the live, store-specific checklist.

2. **Inspect the store** (read-only `use_sdk` calls)
   - Products: `products.list` -- are there products, each with pricing?
   - Shipping: list shipping zones/rates -- at least one zone configured?
   - Taxes: list tax rates -- configured for the selling regions?
   - Store config: `stores.get` -- name, currency, locale set?

3. **Report**
   - Present results as a clear pass/fail checklist.
   - For each failure, explain what is missing and offer to fix it.

4. **Fix gaps**
   - No products -> `/ziftr-ai:products` or `use_sdk products.create`
     (pricing in minor units, e.g. $19.99 = 1999)
   - No shipping -> guide zone setup, create via `use_sdk`
   - No taxes -> explain options, create rates via `use_sdk`

5. **Final steps**
   - When all checks pass, recommend a test order.
   - Use `search_docs deployment` for go-live guides.

## Tips

- Remind users about SEO: product meta titles and descriptions.
- For a deeper automated pass, delegate to the `ziftr-launch-auditor` agent.
