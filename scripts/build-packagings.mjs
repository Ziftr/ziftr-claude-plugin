#!/usr/bin/env node
// Generates the Agent Plugins 1.0 and Grok Build packagings of the ziftr-ai
// plugin from the single source of truth in ziftr-ai/.
//
//   node scripts/build-packagings.mjs          regenerate dist/ + .grok-plugin/
//   node scripts/build-packagings.mjs --check  exit 1 if outputs are stale
//
// Outputs (committed to the repo so git-based installs work from main):
//   dist/agent-plugins/ziftr-ai/   Agent Plugins 1.0 (Cursor, Codex, VS Code,
//                                  Copilot, Kiro): plugin.json, mcp.json,
//                                  skills/ only -- agents are not in the spec
//   dist/grok/ziftr-ai/            Grok Build: .grok-plugin/plugin.json,
//                                  .mcp.json, skills/, agents/
//   .grok-plugin/marketplace.json  makes this repo a Grok marketplace

import { readFileSync, readdirSync, rmSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC = join(ROOT, "ziftr-ai");

// Agent Skills spec: unknown top-level frontmatter keys are nonconforming and
// cause clients to skip the skill, so anything else is folded into metadata.
const AGENT_SKILLS_KEYS = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
]);

const fail = (msg) => {
  console.error(`build-packagings: ${msg}`);
  process.exit(1);
};

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const writeJson = (path, obj) => write(path, JSON.stringify(obj, null, 2) + "\n");
const write = (path, content) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
};

const plugin = readJson(join(SRC, ".claude-plugin", "plugin.json"));

// Derive the production URL from the source .mcp.json so the packagings can
// never drift from it. Claude Code expands ${ZIFTR_MCP_URL:-<default>}; the
// other packagings pin the default (their specs define no env expansion, and
// the ${VAR}-templated headers are likewise Claude-only, so they are dropped).
const srcMcp = readJson(join(SRC, ".mcp.json"));
const rawUrl = srcMcp.mcpServers.ziftr.url;
const MCP_URL = rawUrl.replace(/^\$\{ZIFTR_MCP_URL:-(.+)\}$/, "$1");
if (!/^https:\/\/[\w.-]+\/mcp$/.test(MCP_URL)) {
  fail(`unexpected MCP url in ziftr-ai/.mcp.json: ${rawUrl}`);
}
const marketplace = readJson(join(ROOT, ".claude-plugin", "marketplace.json"));
if (marketplace.plugins[0].version !== plugin.version) {
  fail(
    `version mismatch: marketplace.json has ${marketplace.plugins[0].version}, ` +
      `plugin.json has ${plugin.version} -- bump both together`,
  );
}

// --- frontmatter handling -------------------------------------------------

// Splits a SKILL.md into frontmatter entries and body. Entries keep their raw
// lines (including folded/indented continuations) so output stays verbatim.
function parseSkill(path) {
  const text = readFileSync(path, "utf8");
  const lines = text.split("\n");
  if (lines[0] !== "---") fail(`${path}: missing frontmatter`);
  const end = lines.indexOf("---", 1);
  if (end === -1) fail(`${path}: unterminated frontmatter`);
  const entries = [];
  for (const line of lines.slice(1, end)) {
    const m = line.match(/^([A-Za-z][\w-]*):(.*)$/);
    if (m) entries.push({ key: m[1], lines: [line] });
    else if (entries.length) entries[entries.length - 1].lines.push(line);
    else fail(`${path}: frontmatter does not start with a key`);
  }
  return { entries, body: lines.slice(end + 1).join("\n") };
}

const renderSkill = (entries, body) =>
  ["---", ...entries.flatMap((e) => e.lines), "---", body].join("\n");

// Conforms frontmatter to the Agent Skills spec for the Agent Plugins output.
function toAgentSkillsFrontmatter(entries, skillName, path) {
  const out = [];
  const extras = [];
  if (!entries.some((e) => e.key === "name")) {
    out.push({ key: "name", lines: [`name: ${skillName}`] });
  }
  for (const e of entries) {
    if (AGENT_SKILLS_KEYS.has(e.key)) out.push(e);
    else extras.push(e);
  }
  if (extras.length) {
    let metadata = out.find((e) => e.key === "metadata");
    if (metadata && metadata.lines[0].trim() !== "metadata:") {
      fail(`${path}: inline metadata flow not supported by this generator`);
    }
    if (!metadata) {
      metadata = { key: "metadata", lines: ["metadata:"] };
      out.push(metadata);
    }
    for (const e of extras) {
      const value = e.lines
        .map((l, i) => (i === 0 ? l.slice(e.key.length + 1) : l).trim())
        .filter(Boolean)
        .join(" ");
      metadata.lines.push(`  ${e.key}: ${JSON.stringify(value)}`);
    }
  }
  const name = out.find((e) => e.key === "name").lines[0].slice(5).trim();
  if (name !== skillName) fail(`${path}: frontmatter name ${name} != dir ${skillName}`);
  if (!out.some((e) => e.key === "description")) fail(`${path}: missing description`);
  return out;
}

// --- build ----------------------------------------------------------------

const DIST = join(ROOT, "dist");
rmSync(DIST, { recursive: true, force: true });

const skillDirs = readdirSync(join(SRC, "skills"), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();
const agentFiles = readdirSync(join(SRC, "agents")).filter((f) => f.endsWith(".md")).sort();

const generatedNote = (edit) =>
  `<!-- GENERATED by scripts/build-packagings.mjs -- do not edit. Edit ${edit} and regenerate. -->\n`;

// Agent Plugins 1.0 package
const AP = join(DIST, "agent-plugins", "ziftr-ai");
writeJson(join(AP, "plugin.json"), {
  $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  name: plugin.name,
  version: plugin.version,
  description: plugin.description,
  author: plugin.author,
  homepage: plugin.homepage,
  repository: plugin.repository,
  license: plugin.license,
  keywords: plugin.keywords,
});
writeJson(join(AP, "mcp.json"), {
  $schema: "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  mcpServers: { ziftr: { type: "streamable-http", url: MCP_URL } },
});
for (const skill of skillDirs) {
  const path = join(SRC, "skills", skill, "SKILL.md");
  const { entries, body } = parseSkill(path);
  write(
    join(AP, "skills", skill, "SKILL.md"),
    renderSkill(toAgentSkillsFrontmatter(entries, skill, path), body),
  );
}

// Grok Build package (Claude-compatible layout under .grok-plugin/)
const GROK = join(DIST, "grok", "ziftr-ai");
const { $schema: _schema, ...grokManifest } = plugin;
writeJson(join(GROK, ".grok-plugin", "plugin.json"), grokManifest);
writeJson(join(GROK, ".mcp.json"), {
  mcpServers: { ziftr: { type: "http", url: MCP_URL } },
});
for (const skill of skillDirs) {
  const path = join(SRC, "skills", skill, "SKILL.md");
  const { entries, body } = parseSkill(path);
  write(join(GROK, "skills", skill, "SKILL.md"), renderSkill(entries, body));
}
for (const agent of agentFiles) {
  write(join(GROK, "agents", agent), readFileSync(join(SRC, "agents", agent), "utf8"));
}

for (const dir of [AP, GROK]) {
  write(
    join(dir, "README.md"),
    generatedNote("ziftr-ai/") +
      "\n# ziftr-ai (generated packaging)\n\n" +
      "Generated from the `ziftr-ai/` source in\n" +
      "https://github.com/Ziftr/ziftr-claude-plugin. See the repository README\n" +
      "for per-client install instructions.\n\n" +
      "## Tenant / store scope\n\n" +
      `This packaging pins the hosted MCP server (${MCP_URL})\n` +
      "with no header defaults. To scope `use_sdk` calls, use the `set_scope`\n" +
      "tool (or the `set-scope` skill) mid-session, or pass `tenant` /\n" +
      "`store` on each call.\n\n" +
      "If your client's MCP settings support custom headers, you can\n" +
      "additionally set `X-Ziftr-Tenant` (UUID or slug) and `X-Ziftr-Store`\n" +
      "(UUID) as project defaults; a store header wins over a `set_scope`\n" +
      "pin, so leave it unset if you want mid-session store switching.\n",
  );
}

// Grok marketplace manifest at the repo root
writeJson(join(ROOT, ".grok-plugin", "marketplace.json"), {
  name: marketplace.name,
  description: marketplace.metadata.description.replace("Claude Code", "Grok"),
  owner: marketplace.owner,
  plugins: [
    {
      name: plugin.name,
      description: marketplace.plugins[0].description,
      category: marketplace.plugins[0].category,
      homepage: plugin.homepage,
      keywords: plugin.keywords,
      source: { type: "local", path: "./dist/grok/ziftr-ai" },
    },
  ],
});

// --check: fail if the committed outputs differ from what was just generated
if (process.argv.includes("--check")) {
  const diff = execFileSync(
    "git",
    ["status", "--porcelain", "--", "dist", ".grok-plugin"],
    { cwd: ROOT, encoding: "utf8" },
  ).trim();
  if (diff) {
    console.error("build-packagings: generated outputs are stale:\n" + diff);
    console.error("Run `node scripts/build-packagings.mjs` and commit the result.");
    process.exit(1);
  }
}

console.log(
  `built ${skillDirs.length} skills (${agentFiles.length} agents for Grok) at version ${plugin.version}`,
);
