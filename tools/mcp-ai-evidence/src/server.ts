import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import fs from 'node:fs/promises';
import path from 'node:path';

const EVIDENCE_DIR = path.join(process.cwd(), '.ai', 'checks');
const JOURNAL_FILE = path.join(process.cwd(), '.ai', 'chronicle', 'journal.md');

async function ensureDirs() {
  await fs.mkdir(EVIDENCE_DIR, { recursive: true });
  await fs.mkdir(path.dirname(JOURNAL_FILE), { recursive: true });
}

const server = new Server(
  { name: 'ai-evidence-mcp', version: '0.1.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params as any;
  
  if (name === 'create_evidence') {
    await ensureDirs();
    const { pid, data, format = 'json' } = args as any;
    const timestamp = new Date().toISOString();
    const base = path.join(EVIDENCE_DIR, pid);
    const file = format === 'json' ? `${base}.json` : `${base}.txt`;

    if (format === 'json') {
      const payload = { pid, timestamp, ...data };
      await fs.writeFile(file, JSON.stringify(payload, null, 2), 'utf8');
    } else {
      await fs.writeFile(file, `# ${pid}\n\ntimestamp: ${timestamp}\n\n${String(data)}`, 'utf8');
    }

    return { content: [{ type: 'text', text: `evidence written: ${path.relative(process.cwd(), file)}` }] };
  }
  
  if (name === 'add_journal_entry') {
    await ensureDirs();
    const { message, date } = args as any;
    const when = date ?? new Date().toISOString();
    const line = `- ${when}, ${message}\n`;
    await fs.appendFile(JOURNAL_FILE, line, 'utf8');
    return { content: [{ type: 'text', text: `journal appended: ${line.trim()}` }] };
  }
  
  if (name === 'validate_talk_v1') {
    const { content } = args as any;
    const ok =
      /\bPID\b/i.test(content) &&
      /\bIntent\b/i.test(content) &&
      /\bEvidence\b/i.test(content) &&
      /\bStatus\b/i.test(content);
    return {
      content: [
        { type: 'text', text: ok ? 'TALK v1: OK (basic keys present)' : 'TALK v1: FAIL (missing required keys)' }
      ]
    };
  }
  
  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
