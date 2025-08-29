// ESM diagnostic runner — Windows/macOS/Linux safe (no &&).
// Build → dist sanity → MCP probe (listTools + callTool) → evidence.
import { spawn } from "node:child_process";
console.log("--- SCRIPT START ---");

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../../..");
const toolRoot = path.resolve(repoRoot, "tools/mcp-ai-evidence");
const distServer = path.resolve(toolRoot, "dist/server.js");
const evidencePath = path.resolve(repoRoot, ".ai/checks/HF-MCP-DIAG-RUN.txt");
const isWin = process.platform.startsWith("win");

function sh(command, args, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
      shell: isWin,
      ...opts,
    });
    const out = [];
    const err = [];
    child.stdout.on("data", (d) => out.push(d.toString()));
    child.stderr.on("data", (d) => err.push(d.toString()));
    child.on("close", (code) =>
      resolve({ code, stdout: out.join(""), stderr: err.join("") })
    );
  });
}

async function hashFile(p) {
  const data = await fs.readFile(p);
  return crypto.createHash("sha256").update(data).digest("hex");
}

async function ensureDirs() {
  await fs.mkdir(path.dirname(evidencePath), { recursive: true });
}

async function runBuild() {
  console.log("--- BUILD: Starting runBuild function ---"); // <--- NOVÝ DETAILNÝ VÝPIS
  // Prefer tsc directly to avoid package manager quirks; fallback to pnpm run build.
  const tscCmd = isWin
    ? path.resolve(toolRoot, "node_modules/.bin/tsc.cmd")
    : path.resolve(toolRoot, "node_modules/.bin/tsc");

  console.log(`--- BUILD: Attempting to run: ${tscCmd} -p . ---`); // <--- NOVÝ DETAILNÝ VÝPIS
  let build = await sh(tscCmd, ["-p", "."], { cwd: toolRoot });
  console.log(`--- BUILD: tsc command finished with code: ${build.code} ---`); // <--- NOVÝ DETAILNÝ VÝPIS

  // Fallback if tsc binary is not available
  if (
    build.code !== 0 &&
    /ENOENT|not recognized|No such file/.test(build.stderr)
  ) {
    console.log("--- BUILD: tsc failed, attempting fallback with pnpm ---"); // <--- NOVÝ DETAILNÝ VÝPIS
    build = await sh(isWin ? "pnpm.cmd" : "pnpm", ["run", "build"], {
      cwd: toolRoot,
    });
    console.log(
      `--- BUILD: pnpm fallback finished with code: ${build.code} ---`
    ); // <--- NOVÝ DETAILNÝ VÝPIS
  }

  console.log("--- BUILD: Finished runBuild function ---"); // <--- NOVÝ DETAILNÝ VÝPIS
  return build;
}

async function probeMCP() {
  // Transport via stdio using direct node execution (not pnpm).
  const nodeCmd = isWin ? "node.exe" : "node";
  const transport = new StdioClientTransport({
    command: nodeCmd,
    args: [distServer],
    cwd: toolRoot,
    env: process.env,
  });
  const client = new Client({ name: "diag-runner", version: "1.0.0" });

  const timeoutMs = 15000;
  const to = setTimeout(() => {
    try {
      client.close();
    } catch {}
    throw new Error(`MCP probe timeout after ${timeoutMs}ms`);
  }, timeoutMs);

  try {
    await client.connect(transport);
    const toolsResponse = await client.listTools();
    const tools = toolsResponse.tools || toolsResponse; // Handle both formats
    let invokeResult = null;
    const hc = Array.isArray(tools)
      ? tools.find((t) => t.name === "health_check")
      : null;
    const ce = Array.isArray(tools)
      ? tools.find((t) => t.name === "create_evidence")
      : null;
    if (hc) {
      invokeResult = await client.callTool({
        name: "health_check",
        arguments: {},
      });
    } else if (ce) {
      // write a tiny probe file as side-effect evidence
      const probeFile = path.relative(
        repoRoot,
        path.resolve(repoRoot, ".ai/checks/HF-MCP-DIAG-RUN.probe.txt")
      );
      invokeResult = await client.callTool({
        name: "create_evidence",
        arguments: { path: probeFile, content: "OK" },
      });
    }
    await client.close();
    clearTimeout(to);
    return { tools, invokeResult, error: null };
  } catch (e) {
    clearTimeout(to);
    return { tools: [], invokeResult: null, error: String(e?.stack || e) };
  }
}

async function main() {
  console.log("--- MAIN FUNCTION START ---");
  const startedAt = new Date().toISOString();
  await ensureDirs();

  console.log("--- STEP 1: Getting versions ---");
  // Versions (best-effort, without blocking)
  const nodeV = process.version;
  let pnpmV = "unknown";
  try {
    pnpmV = (await sh(isWin ? "pnpm.cmd" : "pnpm", ["-v"])).stdout.trim();
  } catch {}

  console.log("--- STEP 2: Running build ---");
  // Build
  const build = await runBuild();
  const buildLog = (build.stdout + "\n" + build.stderr).split("\n").slice(-25); // ~ last 25 lines

  console.log("--- STEP 3: Dist sanity check ---");
  // Dist sanity
  let distOk = false,
    distSize = 0,
    distHash = "n/a",
    distMtime = "n/a";
  try {
    const stat = await fs.stat(distServer);
    distOk = stat.isFile();
    distSize = stat.size;
    distMtime = new Date(stat.mtimeMs).toISOString();
    distHash = await hashFile(distServer);
  } catch {}

  // MCP probe
  const probe = distOk
    ? await probeMCP()
    : { tools: [], invokeResult: null, error: "dist/server.js missing" };

  // Read SDK version (best-effort)
  let sdkVersion = "unknown";
  try {
    const pkgRaw = await fs.readFile(
      path.resolve(toolRoot, "package.json"),
      "utf8"
    );
    const pkg = JSON.parse(pkgRaw);
    sdkVersion =
      pkg?.dependencies?.["@modelcontextprotocol/sdk"] ||
      pkg?.devDependencies?.["@modelcontextprotocol/sdk"] ||
      "unknown";
  } catch {}

  // Evidence object
  const head =
    (
      await sh("git", ["rev-parse", "--short", "HEAD"], { cwd: repoRoot })
    ).stdout.trim() || "unknown";
  const evidence = {
    pid: "HF-MCP-DIAG-RUN-001",
    timestamp_utc: startedAt,
    environment: {
      os_platform: process.platform,
      os_release: os.release(),
      node_version: nodeV,
      pnpm_version: pnpmV,
      sdk_version: sdkVersion,
      repo_root: repoRoot.replaceAll("\\", "/"),
      tool_root: toolRoot.replaceAll("\\", "/"),
    },
    build: {
      exit_code: build.code,
      last_log_lines: buildLog,
      dist_exists: distOk,
      dist_size: distSize,
      dist_hash_sha256: distHash,
      dist_mtime_utc: distMtime,
    },
    probe: {
      tools_count: probe.tools.length,
      tools_json: probe.tools,
      invoke_result: probe.invokeResult,
      error: probe.error,
    },
    terminal_interaction: "AUTO", // this runner is non-interactive by design
    git_head_short: head,
    result:
      build.code === 0 && distOk && probe.tools.length > 0 && !probe.error
        ? "OK"
        : "FAIL",
  };

  await fs.writeFile(evidencePath, JSON.stringify(evidence, null, 2), "utf8");
  // Journal + handoff (best-effort append)
  try {
    const j = path.resolve(repoRoot, ".ai/chronicle/journal.md");
    await fs.mkdir(path.dirname(j), { recursive: true });
    await fs.appendFile(
      j,
      `\n- ${new Date().toISOString()} HF-MCP-DIAG-RUN-001: result=${
        evidence.result
      }\n`,
      "utf8"
    );
  } catch {}
  try {
    const h = path.resolve(repoRoot, ".ai/handoff/index.json");
    await fs.mkdir(path.dirname(h), { recursive: true });
    let idx = {};
    try {
      idx = JSON.parse(await fs.readFile(h, "utf8"));
    } catch {}
    idx.lastDiagnostic = {
      id: "HF-MCP-DIAG-RUN-001",
      at: new Date().toISOString(),
      result: evidence.result,
    };
    await fs.writeFile(h, JSON.stringify(idx, null, 2), "utf8");
  } catch {}

  console.log(
    `EVIDENCE -> ${path.relative(repoRoot, evidencePath).replaceAll("\\", "/")}`
  );
}

main().catch(async (e) => {
  await fs
    .mkdir(path.dirname(evidencePath), { recursive: true })
    .catch(() => {});
  const fail = {
    pid: "HF-MCP-DIAG-RUN-001",
    timestamp_utc: new Date().toISOString(),
    error: String(e?.stack || e),
    result: "FAIL",
  };
  await fs
    .writeFile(evidencePath, JSON.stringify(fail, null, 2), "utf8")
    .catch(() => {});
  process.exit(1);
});
