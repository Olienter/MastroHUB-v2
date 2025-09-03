import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";

// Global error handler
process.on('uncaughtException', (error) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Health monitoring
let isHealthy = true;
let lastHealthCheck = Date.now();
let activityCount = 0;
let lastActivity = Date.now();

// Health check interval
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
const ACTIVITY_TIMEOUT = 60000; // 1 minute

setInterval(() => {
  const now = Date.now();
  const timeSinceLastActivity = now - lastActivity;
  
  if (timeSinceLastActivity > ACTIVITY_TIMEOUT) {
    if (isHealthy) {
      console.log("⚠️ Server marked as unhealthy - no recent activity");
      isHealthy = false;
    }
  } else {
    if (!isHealthy) {
      console.log("✅ Server marked as healthy - activity detected");
      isHealthy = true;
    }
  }
  
  lastHealthCheck = now;
}, HEALTH_CHECK_INTERVAL);

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
  try {
    // Update health status and activity
    isHealthy = true;
    lastHealthCheck = Date.now();
    lastActivity = Date.now();
    activityCount++;
    
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
      } catch (error) {
      isHealthy = false;
      // eslint-disable-next-line no-console
      console.error('Error in ListToolsRequestSchema:', error);
      throw error;
    }
});

// helpers
async function ensureDir(p: string) {
  try {
    await fs.mkdir(p, { recursive: true });
        } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error creating directory:', error);
        throw error;
      }
}

// 2) tools/call
server.setRequestHandler(
  CallToolRequestSchema,
  async (request: CallToolRequest) => {
    try {
      // Update health status and activity
      isHealthy = true;
      lastHealthCheck = Date.now();
      lastActivity = Date.now();
      activityCount++;
      
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
        // Enhanced health check with server status
        const uptime = Date.now() - lastHealthCheck;
        const memoryUsage = process.memoryUsage();
        
        const payload = {
          ok: isHealthy,
          cwd: process.cwd(),
          pid: process.pid,
          uptime: uptime,
          memory: {
            rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
          },
          sdk: "1.17.4",
          timestamp: new Date().toISOString(),
        };
        
        return { content: [{ type: "text", text: JSON.stringify(payload) }] };
      }

      return {
        isError: true,
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
      };
    } catch (error) {
      isHealthy = false;
      // eslint-disable-next-line no-console
      console.error('Error in CallToolRequestSchema:', error);
      return {
        isError: true,
        content: [{ type: "text", text: `Server error: ${error instanceof Error ? error.message : String(error)}` }],
      };
    }
  }
);

// Graceful shutdown
process.on('SIGINT', async () => {
  // eslint-disable-next-line no-console
  console.log('Shutting down MCP server gracefully...');
  try {
    await server.close();
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  // eslint-disable-next-line no-console
  console.log('Received SIGTERM, shutting down MCP server...');
  try {
    await server.close();
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start server with error handling
async function startServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // eslint-disable-next-line no-console
    console.log("MCP server ready (stdio).");
    // eslint-disable-next-line no-console
    console.log(`Server PID: ${process.pid}`);
    // eslint-disable-next-line no-console
    console.log(`Working directory: ${process.cwd()}`);
    
    // Periodic health check
    setInterval(() => {
      const timeSinceLastCheck = Date.now() - lastHealthCheck;
      if (timeSinceLastCheck > 30000) { // 30 seconds
        isHealthy = false;
        // eslint-disable-next-line no-console
        console.warn('Server marked as unhealthy - no recent activity');
      }
    }, 10000); // Check every 10 seconds
    
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Critical error starting server:', error);
  process.exit(1);
});
