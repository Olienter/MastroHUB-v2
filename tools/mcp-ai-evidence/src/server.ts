import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { evidencePath, ensureAiDirs, atomicWrite, appendJournal } from "./fs-io.js";
import { checkAiCompliance, validateTalkV1 } from "./validators.js";

const server = new Server(
  { name: "ai-evidence-tool", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.tool("create_evidence", {
  description: "Create new evidence entry in .ai/checks",
  inputSchema: {
    type: "object",
    properties: {
      pid: { type: "string" },
      data: { type: "object" },
      format: { type: "string", enum: ["txt","json"], default: "txt" }
    },
    required: ["pid","data"]
  }
}, async (args) => {
  const { pid, data, format = "txt" } = args as any;
  await ensureAiDirs();
  const file = evidencePath(pid, format);
  const content = format === "json"
    ? JSON.stringify({ ...data, timestamp: new Date().toISOString() }, null, 2)
    : `# ${pid}\n\n${JSON.stringify(data, null, 2)}\n`;
  await atomicWrite(file, content);
  return { ok: true, path: file };
});

server.tool("add_journal_entry", {
  description: "Append a line into .ai/chronicle/journal.md",
  inputSchema: { 
    type: "object", 
    properties: { message: { type: "string" } }, 
    required: ["message"] 
  }
}, async (args) => {
  await ensureAiDirs();
  const line = `- ${new Date().toISOString()}, ${args.message}`;
  await appendJournal(line);
  return { ok: true, line };
});

server.tool("validate_talk_v1", {
  description: "Validate TALK v1 block in PR body text",
  inputSchema: { 
    type: "object", 
    properties: { content: { type: "string" } }, 
    required: ["content"] 
  }
}, async (args) => {
  return await validateTalkV1((args as any).content);
});

server.tool("check_ai_compliance", {
  description: "Check presence of required .ai files (e.g., .ai/check.md)",
  inputSchema: { 
    type: "object", 
    properties: {} 
  }
}, async () => {
  return await checkAiCompliance();
});

await server.connect(new StdioServerTransport());
