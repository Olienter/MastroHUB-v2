// tools/mcp-ai-evidence/src/server.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import fs from 'node:fs/promises';
import path from 'node:path';

const EVIDENCE_DIR = path.join(process.cwd(), '.ai', 'checks');
const JOURNAL_FILE = path.join(process.cwd(), '.ai', 'chronicle', 'journal.md');

async function ensureDirs() {
  await fs.mkdir(EVIDENCE_DIR, { recursive: true });
  await fs.mkdir(path.dirname(JOURNAL_FILE), { recursive: true });
}

// --- Static JSON Schemas (no runtime converters) ---
const schemas = {
  create_evidence: {
    type: 'object',
    properties: {
      pid: { type: 'string' },
      data: { type: 'object' },
      format: { type: 'string', enum: ['json', 'txt'] }
    },
    required: ['pid', 'data']
  },
  add_journal_entry: {
    type: 'object',
    properties: { message: { type: 'string' }, date: { type: 'string' } },
    required: ['message']
  },
  validate_talk_v1: {
    type: 'object',
    properties: { content: { type: 'string' } },
    required: ['content']
  }
} as const;

// --- Tool registry (handlers use `any` to avoid type friction) ---
const tools: Record<string, { description: string; schema: any; handler: (args: any) => Promise<any> }> = {
  create_evidence: {
    description: 'Create/update .ai/checks/<pid> evidence file.',
    schema: schemas.create_evidence,
    handler: async (args: any) => {
      await ensureDirs();
      const pid = String(args?.pid ?? '');
      const data = (args?.data ?? {}) as Record<string, unknown>;
      const format = (args?.format === 'txt' ? 'txt' : 'json') as 'json' | 'txt';
      if (!pid) throw new Error('pid is required');
      const ts = new Date().toISOString();
      const base = path.join(EVIDENCE_DIR, pid);
      const file = format === 'json' ? `${base}.json` : `${base}.txt`;
      if (format === 'json') {
        const payload = { pid, timestamp: ts, ...data };
        await fs.writeFile(file, JSON.stringify(payload, null, 2), 'utf8');
      } else {
        await fs.writeFile(file, `# ${pid}\n\ntimestamp: ${ts}\n\n${String(data)}`, 'utf8');
      }
      return { content: [{ type: 'text', text: `evidence written: ${path.relative(process.cwd(), file)}` }] };
    }
  },
  add_journal_entry: {
    description: 'Append a line to .ai/chronicle/journal.md',
    schema: schemas.add_journal_entry,
    handler: async (args: any) => {
      await ensureDirs();
      const message = String(args?.message ?? '');
      if (!message) throw new Error('message is required');
      const when = args?.date ? String(args.date) : new Date().toISOString();
      const line = `- ${when}, ${message}\n`;
      await fs.appendFile(JOURNAL_FILE, line, 'utf8');
      return { content: [{ type: 'text', text: `journal appended: ${line.trim()}` }] };
    }
  },
  validate_talk_v1: {
    description: 'Validate TALK v1 basic keys',
    schema: schemas.validate_talk_v1,
    handler: async (args: any) => {
      const content = String(args?.content ?? '');
      const ok =
        /\bPID\b/i.test(content) &&
        /\bIntent\b/i.test(content) &&
        /\bEvidence\b/i.test(content) &&
        /\bStatus\b/i.test(content);
      return { content: [{ type: 'text', text: ok ? 'TALK v1: OK' : 'TALK v1: FAIL (missing keys)' }] };
    }
  }
};

// --- Server bootstrap with generic handlers ---
const server = new Server({ name: 'ai-evidence-mcp', version: '0.1.0' }, { capabilities: { tools: {} } });

server.setRequestHandler('tools/list' as any, async () => {
  return {
    tools: Object.entries(tools).map(([name, t]) => ({
      name,
      description: t.description,
      inputSchema: t.schema
    }))
  };
});

server.setRequestHandler('tools/call' as any, async (req: any) => {
  const name = req?.name as string;
  const args = req?.arguments ?? {};
  const tool = tools[name];
  if (!tool) throw new Error(`unknown tool: ${name}`);
  return await tool.handler(args);
});

const transport = new StdioServerTransport();
await server.connect(transport);
