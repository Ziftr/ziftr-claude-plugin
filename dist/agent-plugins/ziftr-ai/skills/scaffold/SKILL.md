---
name: scaffold
description: Scaffold a new Ziftr storefront from the official starter template
metadata:
  arguments: "path"
---

# Scaffold a Ziftr Storefront

Create a new storefront project from the Ziftr storefront starter (Next.js +
@ziftr.ai/sdk + @ziftr.ai/blocks). This runs locally using your own shell and
file tools -- it does not need the MCP server.

## Arguments

- `path` (optional): target directory for the new project. Defaults to
  `./ziftr-storefront`.

## Steps

### 1. Clone the starter

The storefront starter is in early access: the repository URL comes with the
user's Ziftr onboarding. Ask for it if you don't have it, then:

```bash
git clone <starter-repo-url> <path>
rm -rf <path>/.git
```

(If the user doesn't have access yet, direct them to https://docs.ziftr.ai or
support@ziftr.ai.)

### 2. Drop the starter's project .mcp.json if it collides

Check `<path>/.mcp.json`. If it declares a `"ziftr"` server, delete it --
the plugin already provides that server for this session, and the two would
collide:

```bash
rm -f <path>/.mcp.json
```

(The starter ships this file so a standalone clone, without the plugin
installed, still gets Ziftr MCP tools. Leave it in place if it declares
anything other than `"ziftr"`, or doesn't exist.)

### 3. Initialize git and install

```bash
cd <path>
git init
npm install
```

During early access, installing `@ziftr.ai/*` packages requires an npm access
token provided with the user's Ziftr onboarding: set `NPM_TOKEN` in the
environment. The starter ships an `.npmrc` with the `@ziftr.ai` registry
mapping; if install fails with a 401, point the user to their onboarding
materials or support@ziftr.ai.

### 4. Configure environment

Copy `.env.example` to `.env.local` and fill it in:

```bash
cp .env.example .env.local
```

Required values (the rest can stay default for local dev):

- `NEXT_PUBLIC_CORE_API_URL` - the Core API URL (e.g. the dev environment URL)
- `NEXT_PUBLIC_STORE_ID` - the store's id
- `ZIFTR_API_KEY` - a server-only API key. Create it in the admin under
  Settings > API Keys with the "Storefront (Default)" role.

Use `search_knowledge` (MCP) to find the current API URL and the API-key guide
if the user is unsure. If `search_knowledge` is unavailable, use
https://docs.ziftr.ai.

### 5. Verify

```bash
npm run dev    # starts on http://localhost:3010
npx tsc --noEmit
```

Confirm the homepage renders. Then point the user at the `setup` skill to
configure store data, or the `products` skill to add products.
