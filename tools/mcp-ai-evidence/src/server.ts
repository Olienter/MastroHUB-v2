import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const server = new Server(
  { name: "mastro-mcp-ai-evidence", version: "0.1.0" },
  {
    capabilities: {
      tools: {},
    },
  }
);

// --- HEALTH CHECK TOOL -------------------------------------------------------
// Tool definition and implementation for basic server health diagnostics

// 1) tools/list
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_evidence",
        description:
          "Create or update .ai/checks/<pid>.json with provided data.",
        inputSchema: {
          type: "object",
          properties: {
            pid: { type: "string" },
            data: { type: "object" },
          },
          required: ["pid", "data"],
          additionalProperties: true,
        },
      },
      {
        name: "add_journal_entry",
        description: "Append a line to .ai/chronicle/journal.md",
        inputSchema: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
          required: ["message"],
          additionalProperties: false,
        },
      },
      {
        name: "health_check",
        description: "Returns basic server health info for diagnostics.",
        inputSchema: {
          type: "object",
          additionalProperties: false,
          properties: {},
        },
      },
    ],
  };
});

// helpers
async function ensureDir(p: string) {
  await fs.mkdir(p, { recursive: true });
}

// 2) tools/call
server.setRequestHandler(
  CallToolRequestSchema,
  async (request: CallToolRequest) => {
    const name = request.params.name;
    const args = (request.params.arguments ?? {}) as Record<string, unknown>;

    if (name === "create_evidence") {
      const pid = String(args["pid"] ?? "");
      const data = (args["data"] ?? {}) as Record<string, unknown>;

      if (!pid) {
        return {
          isError: true,
          content: [{ type: "text", text: "Missing required argument: pid" }],
        };
      }

      const checksDir = path.join(process.cwd(), ".ai", "checks");
      await ensureDir(checksDir);

      const filePath = path.join(checksDir, `${pid}.json`);
      const payload = JSON.stringify({ pid, ...data }, null, 2);
      await fs.writeFile(filePath, payload, "utf8");

      return {
        content: [{ type: "text", text: `evidence written: ${filePath}` }],
      };
    }

    if (name === "add_journal_entry") {
      const msg = String(args["message"] ?? "");
      if (!msg) {
        return {
          isError: true,
          content: [
            { type: "text", text: "Missing required argument: message" },
          ],
        };
      }

      const chronicleDir = path.join(process.cwd(), ".ai", "chronicle");
      await ensureDir(chronicleDir);
      const filePath = path.join(chronicleDir, "journal.md");
      const line = `- ${new Date().toISOString()}, ${msg}\n`;
      await fs.appendFile(filePath, line, "utf8");

      return { content: [{ type: "text", text: "journal updated" }] };
    }

    if (name === "health_check") {
      // SDK version best-effort (non-fatal if unreadable)
      let sdkVersion = "unknown";
      try {
        // Best-effort: read SDK version from package.json (non-fatal if fails)
        const p = await import("node:fs/promises");
        const path = await import("node:path");
        const pkg = JSON.parse(await p.readFile(path.join(process.cwd(), "package.json"), "utf8"));
        sdkVersion = pkg?.dependencies?.["@modelcontextprotocol/sdk"] ?? "unknown";
      } catch {}
      const payload = {
        ok: true,
        cwd: process.cwd(),
        pid: process.pid,
        sdk: sdkVersion,
      };
      return { content: [{ type: "text", text: JSON.stringify(payload) }] };
    }

    return {
      isError: true,
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
    };
  }
);

// stdio transport - FIXED ORDER
const transport = new StdioServerTransport();
await server.connect(transport);
console.log("MCP server ready (stdio).");
