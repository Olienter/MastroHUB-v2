# MCP AI Evidence (MVP)

## Tools:
- `create_evidence(pid, data, format='txt'|'json')`
- `add_journal_entry(message)`
- `validate_talk_v1(content)`
- `check_ai_compliance()`

## Run locally (Cursor MCP):
- Dev: `pnpm --dir tools/mcp-ai-evidence dev`
- Build: `pnpm --dir tools/mcp-ai-evidence build && node tools/mcp-ai-evidence/dist/server.js`

## Security:
- file-first, atomic writes, no network calls
- Sandboxed to .ai/ directory only
- Path validation prevents directory traversal
