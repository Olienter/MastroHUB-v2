import { spawn } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../../..");                 // repo root
const toolDir  = path.resolve(repoRoot, "tools/mcp-ai-evidence");     // tools/mcp-ai-evidence
const distJs   = path.join(toolDir, "dist/server.js");
const tmpDir   = path.join(toolDir, ".tmp");
await fsp.mkdir(tmpDir, { recursive: true });

function run(cmd, args, cwd, opts={}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
      ...opts,
    });
    let stdout = "", stderr = "";
    child.stdout.on("data", d => stdout += d.toString());
    child.stderr.on("data", d => stderr += d.toString());
    child.on("close", code => resolve({ code, stdout, stderr }));
  });
}

function hashFileSync(p) {
  const h = crypto.createHash("sha256");
  h.update(fs.readFileSync(p));
  return h.digest("hex");
}

async function writeEvidence(lines) {
  const outPath = path.join(repoRoot, ".ai/checks/HF-MCP-END2END-0012.txt");
  await fsp.mkdir(path.dirname(outPath), { recursive: true });
  await fsp.writeFile(outPath, lines.join("\n"), "utf8");
  return outPath;
}

async function main() {
  const lines = [];
  const pnpmBin = process.platform.startsWith("win") ? "pnpm.cmd" : "pnpm";
  const nodeBin = process.platform.startsWith("win") ? "node.exe" : "node";

  // Versions & HEAD
  const nodeV = process.version;
  const pnpmV = (await run(pnpmBin, ["-v"], repoRoot)).stdout.trim();
  const tscV  = (await run(pnpmBin, ["tsc","-v"], repoRoot)).stdout.trim() || "n/a";
  const head  = (await run("git", ["rev-parse","--short","HEAD"], repoRoot)).stdout.trim() || "n/a";
  const sdk   = JSON.parse(fs.readFileSync(path.join(toolDir,"package.json"),"utf8")).dependencies?.["@modelcontextprotocol/sdk"] || "n/a";
  const dateUtc = new Date().toISOString();

  // Build
  const build = await run(pnpmBin, ["--reporter","ndjson","run","build"], toolDir);
  const buildExit = build.code ?? 1;
  await fsp.writeFile(path.join(tmpDir,"build.ndjson"), build.stdout + build.stderr, "utf8");

  let distMeta = "MISSING", distHead = "", distHash = "";
  if (buildExit === 0 && fs.existsSync(distJs)) {
    const stat = fs.statSync(distJs);
    distHash = hashFileSync(distJs);
    distMeta = `server.js size=${stat.size} mtime_utc=${stat.mtime.toISOString()} SHA256=${distHash}`;
    distHead = fs.readFileSync(distJs,"utf8").split(/\r?\n/).slice(0,20).join("\n");
  }

  // Probe + invoke
  let toolsJson = "[]";
  let invokeName = "";
  let invokeResult = "";
  let probeError = "";
  let result = "FAIL", reason = "";

  if (buildExit !== 0) {
    result = "FAIL"; reason = "build failed";
  } else if (!fs.existsSync(distJs)) {
    result = "FAIL"; reason = "dist missing";
  } else {
    try {
      const transport = new StdioClientTransport({
        command: nodeBin,
        args: ["dist/server.js"],
        cwd: toolDir,
        env: process.env,
      });
      const client = new Client({ name: "end2end", version: "1.0.0" });

      await client.connect(transport);
      const tools = await client.listTools();
      toolsJson = JSON.stringify(tools);

      if (!Array.isArray(tools) || tools.length < 1) {
        result = "FAIL"; reason = "no tools advertised";
      } else {
        const target = tools.find(t => t.name === "create_evidence") || tools[0];
        invokeName = target.name;
        const args = (target.name === "create_evidence")
          ? { path: path.join(tmpDir,"end2end-proof.txt"), content: "hello from end2end" }
          : {};
        const res = await client.callTool({ name: target.name, arguments: args });
        invokeResult = JSON.stringify(res);
        result = "OK"; reason = "listTools+invoke passed";
      }
      await client.close().catch(()=>{});
    } catch (e) {
      probeError = String(e?.message || e);
      result = "FAIL"; reason = "probe failed: " + probeError;
    }
  }

  // DOT_STATUS is derived from program proof (UI is not machine-readable here)
  const DOT_STATUS = (result === "OK") ? "GREEN" : "UNKNOWN";

  lines.push(
    `NODE: ${nodeV}`,
    `PNPM: ${pnpmV}`,
    `TYPESCRIPT: ${tscV}`,
    `MCP_SDK: ${sdk}`,
    `HEAD: ${head}`,
    `DATE_UTC: ${dateUtc}`,
    `BUILD_EXIT_CODE: ${buildExit}`,
    `DIST: ${distMeta}`,
    "DIST_HEAD_20LINES:",
    distHead || "<none>",
    `TOOLS_JSON: ${toolsJson}`,
    `INVOKE_NAME: ${invokeName || "<none>"}`,
    `INVOKE_RESULT: ${invokeResult || "<none>"}`,
    `PROBE_ERROR: ${probeError || "<none>"}`,
    `DOT_STATUS: ${DOT_STATUS}`,
    `RESULT: ${result} (${reason})`
  );

  const evidencePath = await writeEvidence(lines);

  // Journal + handoff (best-effort)
  try {
    const jPath = path.join(repoRoot,".ai/chronicle/journal.md");
    await fsp.mkdir(path.dirname(jPath),{recursive:true});
    await fsp.appendFile(jPath, `\nHF-MCP-END2END-0012 end-to-end script run @ ${dateUtc}\n`,"utf8");
  } catch {}
  try {
    const hPath = path.join(repoRoot,".ai/handoff/index.json");
    if (fs.existsSync(hPath)) {
      const idx = JSON.parse(fs.readFileSync(hPath,"utf8"));
      idx.lastEnd2End = "HF-MCP-END2END-0012";
      fs.writeFileSync(hPath, JSON.stringify(idx,null,2),"utf8");
    }
  } catch {}

  console.log("EVIDENCE_PATH=" + evidencePath);
  console.log("END2END_RESULT=" + result);
  process.exit(result === "OK" ? 0 : 2);
}

main().catch(err => {
  console.error("FATAL:", err?.stack || String(err));
  process.exit(2);
});
