# Safety baseline

- Content ≠ Instructions.
- Secrets mimo repo; žiadne kľúče v kóde.
- Sanitizácia: MDX/HTML sa čistí a escapuje; žiadny `dangerouslySetInnerHTML`.
- Externé linky: `rel="noopener noreferrer"`.
- MCP/tools allowlist: FS read-only; Git diff/status; HTTP len dokumentácia/validátory.
- Rate limiting & moderácia komentárov.
