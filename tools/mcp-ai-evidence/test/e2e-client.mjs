import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, ".."); // tools/mcp-ai-evidence
const repoRoot = path.resolve(pkgRoot, "..", ".."); // repo root

// MCP JSON-RPC 2.0 client
class MCPClient {
  constructor(child) {
    this.child = child;
    this.requestId = 1;
    this.pendingRequests = new Map();
  }

  async sendRequest(method, params = {}) {
    const id = this.requestId++;
    const request = {
      jsonrpc: "2.0",
      id,
      method,
      params,
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });

      // Send request to server
      this.child.stdin.write(JSON.stringify(request) + "\n");

      // Timeout after 5 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`Request ${id} (${method}) timed out`));
        }
      }, 5000);
    });
  }

  handleResponse(response) {
    try {
      const data = JSON.parse(response);

      if (data.id && this.pendingRequests.has(data.id)) {
        const { resolve, reject } = this.pendingRequests.get(data.id);
        this.pendingRequests.delete(data.id);

        if (data.error) {
          reject(new Error(data.error.message || "MCP request failed"));
        } else {
          resolve(data.result);
        }
      }
    } catch (err) {
      // Ignore malformed JSON responses
    }
  }
}

async function writeEvidence(payload) {
  const checksDir = path.join(repoRoot, ".ai", "checks");
  await fs.mkdir(checksDir, { recursive: true });
  const file = path.join(checksDir, "HF-OPS-ANALYSIS-0008E-PR3.json");
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
  let headSha = null;
  let status = "failure";
  let toolsList = [];
  let toolCall = { name: "create_evidence", ok: false, error: null };
  let stderrTail = "";

  try {
    // Get HEAD SHA
    try {
      headSha = (await fs.readFile(path.join(repoRoot, ".git", "HEAD"), "utf8"))
        .trim()
        .slice(0, 7);
    } catch {}

    // 1) Spawn MCP server
    const child = spawn("node", ["dist/server.js"], {
      cwd: pkgRoot,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdoutBuf = "";
    let stderrBuf = "";

    child.stdout.on("data", (d) => {
      stdoutBuf += d.toString();
    });
    child.stderr.on("data", (d) => {
      stderrBuf += d.toString();
    });

    // 2) Create MCP client
    const client = new MCPClient(child);

    // 3) MCP Handshake
    console.log("🔌 MCP Handshake...");
    const initResult = await client.sendRequest("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
    });
    console.log("✅ Initialize:", initResult);

    // 4) tools/list
    console.log("📋 tools/list...");
    const listResult = await client.sendRequest("tools/list", {});
    toolsList = listResult.tools?.map((t) => t.name) || [];
    console.log("✅ Tools:", toolsList);

    if (!toolsList.includes("create_evidence")) {
      throw new Error("create_evidence tool not found in tools/list");
    }

    // 5) tools/call create_evidence
    console.log("🛠️ tools/call create_evidence...");
    const callResult = await client.sendRequest("tools/call", {
      name: "create_evidence",
      arguments: {
        pid: "HF-OPS-ANALYSIS-0008E-PR3",
        probe: "e2e",
        ok: true,
      },
    });
    console.log("✅ create_evidence result:", callResult);
    toolCall.ok = true;

    // 6) Shutdown
    console.log("🔄 Shutdown...");
    await client.sendRequest("shutdown", {});

    // Wait for server to exit
    await delay(1000);

    status = "success";
  } catch (err) {
    console.error("❌ E2E test failed:", err.message);
    toolCall.error = err.message;
    status = "failure";
  } finally {
    // Get stderr tail (last 80 lines)
    stderrTail = stderrBuf.split("\n").slice(-80).join("\n");

    // Cleanup
    try {
      child?.kill("SIGINT");
    } catch {}
  }

  // 7) Write evidence
  const payload = {
    pid: "HF-OPS-ANALYSIS-0008E-PR3",
    status,
    toolsList,
    toolCall,
    stderrTail,
    timestamp: ts,
    headSha,
  };

  const evidencePath = await writeEvidence(payload);
  await appendJournal(
    `- ${ts}, HF-OPS-ANALYSIS-0008E-PR3: MCP E2E (tools/list + create_evidence) STATUS=${status}`
  );

  console.log(`🎯 MCP E2E DONE → ${evidencePath}`);
  console.log(`📊 Status: ${status}`);
  console.log(`🔧 Tools: ${toolsList.length}`);
  console.log(`✅ Tool call: ${toolCall.ok ? "SUCCESS" : "FAILED"}`);

  if (status === "failure") {
    process.exitCode = 1;
  }
}

main();
