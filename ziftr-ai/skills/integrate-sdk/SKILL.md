---
description: Guide for adding @ziftr.ai/sdk to an existing Next.js project
arguments: path
---

# Integrate Ziftr SDK

Add the Ziftr SDK to an existing Next.js project. For a new project, use
`/ziftr-ai:scaffold` instead.

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
