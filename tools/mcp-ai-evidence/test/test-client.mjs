import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, ".."); // tools/mcp-ai-evidence
const repoRoot = path.resolve(pkgRoot, "..", ".."); // repo root

async function writeEvidence(payload) {
  const checksDir = path.join(repoRoot, ".ai", "checks");
  await fs.mkdir(checksDir, { recursive: true });
  const file = path.join(checksDir, "HF-OPS-ANALYSIS-0007E-MCP-RUNTIME.json");
  await fs.writeFile(file, JSON.stringify(payload, null, 2), "utf8");
  return file;
}

async function appendJournal(line) {
  const chronoDir = path.join(repoRoot, ".ai", "chronicle");
  await fs.mkdir(chronoDir, { recursive: true });
  const file = path.join(chronoDir, "journal.md");
  await fs.appendFile(file, `${line}\n`, "utf8");
}

async function main() {
  const ts = new Date().toISOString();
  let build = false, runtime = false, listOk = false, callsOk = false;
  let buildError = null, runtimeError = null, e2eError = null;
  let headSha = null;

  try {
    headSha = (await fs.readFile(path.join(repoRoot, ".git", "HEAD"), "utf8")).trim().slice(0, 7);
  } catch {}

  try {
    // 1) over build artefakt
    const dist = path.join(pkgRoot, "dist", "server.js");
    build = await fs.access(dist).then(() => true).catch(() => false);

    if (!build) throw new Error("Missing dist/server.js – build not found");

    // 2) spusti server (stdio)
    const child = spawn("node", ["dist/server.js"], {
      cwd: pkgRoot,
      stdio: ["pipe", "pipe", "pipe"]
    });

    let stderrBuf = "";
    child.stderr.on("data", (d) => { stderrBuf += d.toString(); });

    // kratučká pauza, nech server nabootuje
    await delay(200);

    // 3) pripoj MCP klienta
    const client = new Client({ name: "mcp-e2e", version: "0.1.0" }, { capabilities: {} });
    const transport = new StdioClientTransport(child.stdout, child.stdin);
    await client.connect(transport);
    runtime = true;

    // 4) tools/list
    const list = await client.request(ListToolsRequestSchema, {});
    const names = (list.tools ?? []).map(t => t.name);
    listOk = names.includes("create_evidence") && names.includes("add_journal_entry");

    // 5) tools/call → create_evidence
    const pid = "MCP-PROBE";
    const evRes = await client.request(CallToolRequestSchema, {
      name: "create_evidence",
      arguments: { pid, data: { ok: true, ts } }
    });

    // 6) tools/call → add_journal_entry
    const jRes = await client.request(CallToolRequestSchema, {
      name: "add_journal_entry",
      arguments: { message: "MCP e2e OK" }
    });

    // minimálna validácia odpovedí
    callsOk = Array.isArray(evRes.content) && Array.isArray(jRes.content);

    // upratovanie
    try { await client.close?.(); } catch {}
    try { child.kill("SIGINT"); } catch {}

  } catch (err) {
    const msg = String(err?.stack || err?.message || err);
    if (!build) buildError = msg.split("\n").slice(-80).join("\n");
    else if (!runtime) runtimeError = msg.split("\n").slice(-80).join("\n");
    else e2eError = msg.split("\n").slice(-80).join("\n");
  }

  const payload = {
    pid: "HF-OPS-ANALYSIS-0007E-MCP-RUNTIME",
    timestamp: ts,
    meta: { headSha },
    findings: { build, runtime, listOk, callsOk },
    errors: { buildError, runtimeError, e2eError }
  };

  const evidencePath = await writeEvidence(payload);
  await appendJournal(`- ${ts}, MCP e2e (build=${build}, runtime=${runtime}, list=${listOk}, calls=${callsOk})`);
  console.log(`MCP E2E DONE → ${evidencePath}`);
  if (!(build && runtime && listOk && callsOk)) process.exitCode = 2;
}

main();
