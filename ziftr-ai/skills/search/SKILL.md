---
description: Search Ziftr documentation, SDK reference, and API docs
arguments: query
---

# Ziftr Documentation Search

Search the Ziftr documentation and SDK reference for: "$ARGUMENTS"

## Process

1. **Search knowledge**
   - Use the `search_knowledge` MCP tool with the user's query
   - Results are citation-carrying search blocks from hybrid retrieval
   - If `search_knowledge` is unavailable on this deployment, fall back to
     https://docs.ziftr.ai and tell the user the knowledge tool is offline

2. **Present Results**
   - Show the most relevant documentation pages
   - Include SDK methods if applicable
   - Include type definitions if relevant

3. **Provide Context**
   - Summarize the key information from the results
   - If searching for an SDK method, use `get_sdk_method` for details
   - If searching for a type, use `get_type_definition` for the full definition

4. **Offer Next Steps**
   - Suggest related topics to explore
   - Offer to help implement what they're looking for

## Available Search Tools

- `search_knowledge` - Search documentation, SDK reference, and API docs
  (may be disabled on knowledge-only deploys; fall back to docs.ziftr.ai)
- `get_sdk_method` - Get detailed info for a specific SDK method (e.g., "products.create")
- `get_type_definition` - Get TypeScript type definition (e.g., "Product", "CreateProductDto")
- `introspect_api` - Explore API endpoints for a domain (e.g., "products", "orders")
- `whoami` - Confirm auth, scopes, and tenant resolution when results look empty

## Common Topics

- Products API: creating, updating, listing products
- Orders: order management and fulfillment
- Checkout: cart and checkout flow
- Shipping: zones, rates, carriers
- Taxes: tax rates and calculation
- Apps and connectors: manifests, install sessions, ERP sync
- Deployment: Vercel, Netlify, Cloudflare guides
