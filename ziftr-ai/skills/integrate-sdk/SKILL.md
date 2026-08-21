---
description: Guide for adding @ziftr.ai/sdk to an existing Next.js project
arguments: path
---

# Integrate Ziftr SDK

Add the Ziftr SDK to an existing Next.js project. For a new project, use
the `scaffold` skill (`/ziftr-ai:scaffold`) instead.

## MCP tenant context (when looking up methods live)

If you use MCP tools (`get_sdk_method`, `get_type_definition`, or `use_sdk`)
during integration, call `whoami` first. Multiple memberships with no default
fail closed -- ask the user which tenant to use, then set `ZIFTR_TENANT`
(UUID or slug) and optional `ZIFTR_STORE` (UUID only) as environment
variables for the MCP connection (in Claude Code: the project's
`.claude/settings.json` `env` block; `.env` files are not auto-read), or
pass `tenant` / `store` on each `use_sdk` call. Precedence: tool arg >
header > default membership.
These MCP env vars are separate from the storefront `ZIFTR_API_KEY` below.

## Arguments

- `path` (optional): path to the Next.js project. Defaults to current directory.

## Steps

### 1. Install SDK

```bash
npm install @ziftr.ai/sdk
```

(During early access this requires an npm access token from the user's Ziftr
onboarding: set `NPM_TOKEN` and add an `@ziftr.ai` registry mapping to
`.npmrc`.)

### 2. Configure the server client

Create `lib/sdk.ts`:

```typescript
import { ZiftrSDK } from '@ziftr.ai/sdk';

export const sdk = new ZiftrSDK({
  apiKey: process.env.ZIFTR_API_KEY,
  coreApiUrl: process.env.NEXT_PUBLIC_CORE_API_URL,
  storeId: process.env.NEXT_PUBLIC_STORE_ID,
});
```

For customer-authenticated client operations (cart, checkout) use the browser
entry `@ziftr.ai/sdk/browser` with customer auth instead of the API key.

### 3. Environment variables

```
NEXT_PUBLIC_CORE_API_URL=<core-api-url>
NEXT_PUBLIC_STORE_ID=<store-id>
ZIFTR_API_KEY=<server-only-storefront-api-key>
```

### 4. First API call

```typescript
const products = await sdk.products.list({ limit: 10 });
```

Use the `get_sdk_method` and `get_type_definition` MCP tools to look up any SDK
method or type signature as you build.

## Verification

- `npx tsc --noEmit` to check types
- Test a call in a server component or route handler
