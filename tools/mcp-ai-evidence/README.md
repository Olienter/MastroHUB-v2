# MCP AI Evidence (MVP)

## Tools:
- `create_evidence(pid, data, format='txt'|'json')`
- `add_journal_entry(message)`
- `validate_talk_v1(content)`
- `check_ai_compliance()`

## Run locally (Cursor MCP):
- Dev: `pnpm --dir tools/mcp-ai-evidence dev`
- Build: `pnpm --dir tools/mcp-ai-evidence build && node tools/mcp-ai-evidence/dist/server.js`

## Cursor Integration:
- **Configuration:** `.cursor/mcp.json` points to this server
- **Server Name:** `mastro-evidence`
- **Working Directory:** `tools/mcp-ai-evidence/`
- **Command:** `node dist/server.js`
- **Script:** `pnpm run cursor:mcp`
- **Restart Required:** Cursor must be restarted after config changes

## Security:
- file-first, atomic writes, no network calls
- Sandboxed to .ai/ directory only
- Path validation prevents directory traversal
