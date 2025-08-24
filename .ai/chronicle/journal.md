# Project Chronicle (journal)

Formát pri každom merge (1–3 vety):

- YYYY-MM-DD, PR #, HF-ID: čo sa zmenilo + prečo (odkaz na .ai/checks/).

## Entries

- 2025-08-23, PR #, HF-0000 Phase2: Implemented Memory Spine with state.json, handoff/index.json, chronicle/journal.md, ADR-0000, and policy-digest.txt for long-term project memory and state tracking.
- 2025-08-23, PR #123, HF-0002: Integration dress rehearsal - evidence uploaded (.ai/checks/\*).
- 2025-08-23, PR #, HF-0003A: Phase 3A - Automation Pack implemented with GitHub Actions workflow, CODEOWNERS, PR template, and CI evidence tracking for automated quality gates enforcement.
- 2025-08-23, PR #127, HF-0003B: Types/next-env fix; TS errors resolved.
- 2025-08-23, PR #128, HF-RULES-PATCH: Guardrails vylepšené.
- 2025-08-23, PR #129, HF-0003C: Tailwind baseline added.
- 2025-08-23, PR #130, HF-CI-PATCH: CI Quality Gates workflow added.
- 2025-08-23, PR #132, HF-CI-CACHE-FIX: CI cache simplified using built-in pnpm caching.
- 2025-08-23, PR #133, HF-ENV-PIN: Node/pnpm versions pinned.
- 2025-08-23, PR #134, HF-CI-TYPECHECK-PATCH: TypeScript typecheck placeholder replaced with real validation.
- 2025-08-23, PR #125, HF-0001 Phase3A: Canary CI check passed with file-count=1, manifest validation OK, TALK sign-off OK, gitleaks and lychee OK.
- 2025-08-23, PR #130, HF-CI-PATCH: CI Quality Gates workflow added.
- 2025-08-23, PR #605e33a, HF-CI-FIX: CI workflow syntax and update Memory Spine.
- 2025-08-23, PR #719c168, HF-CI-CACHE-FIX: CI cache simplified using built-in pnpm caching.
- 2025-08-23, PR #0c7f2d3, HF-ENV-PIN: Node/pnpm versions pinned.
- 2025-08-23, PR #da4bb4b, HF-CI-TYPECHECK-PATCH: TypeScript typecheck placeholder replaced with real validation.
- 2025-08-23, PR #b77a4a5, HF-MEM-FIX: Memory Spine updated and TypeScript cache added to .gitignore.
- 2025-08-23, PR #734b8d8, HF-MEM-FIX: TypeScript cache files added to .gitignore.
- 2025-08-23, PR #136, HF-GITIGNORE-PATCH: TypeScript build cache rules added to .gitignore.
- 2025-08-23, PR #TODO, HF-MEM-SYNC: Memory Spine synchronized with current HEAD (3ba573c).
- 2025-08-23, HF-OPS-0003: Manifest/state commit synced to 3ba573c.
- 2025-08-23, HF-OPS-0008: Manifest/state commit refreshed to 466fbe6.
- 2025-08-24, HF-OPS-CONVO-0004A: Ping‑Pong podpisy pridané; CLOSE Phase upravená (QA bez GPT sign‑off).
- 2025-08-24, HF-OPS-CONVO-0004B: Retry – Ping-Pong podpisy a CLOSE Phase fix prepísané.
- 2025-08-24, HF-OPS-CONVO-0008: Added Communication Lanes + Compliance Echo + STOP guard (LANE A=free, LANE B=TALK v1).
- 2025-08-24, HF-OPS-PNPM-0001B: packageManager aligned to 10.14.0 + engines; build logs clean (no pnpm mismatch).
- 2025-08-24, HF-OPS-MANIFEST-0002C: manifest files synced to SoT minimal set.
- 2025-08-24, HF-OPS-STATE-0003: state.json verified; last_verified_at/by set; active_handoff=null (if present).
- 2025-08-24, HF-OPS-EVIDENCE-0005: Added Evidence Naming Standard (doc-only).
- 2025-08-24, HF-OPS-CI-0006: added only-allow pnpm + manifest existence check script.
- 2025-08-24, HF-OPS-MANIFEST-0002D: manifest files restored to SoT set; CI check PASS.
- 2025-08-24, HF-OPS-MANIFEST-0002D: removed stray .ai/check.md; added to .gitignore; CI check PASS.
- 2025-08-24, HF-OPS-REPAIR-001A: Re-applied Communication Lanes & CLOSE Phase; rules blocks restored.
- 2025-08-24, HF-OPS-STATE-0004: state.json verified; last_verified_at/by set.
- 2025-08-24, HF-OPS-PNPM-0002: packageManager aligned to 10.14.0; logs clean.
- 2025-08-24, HF-OPS-ESLINT-0001: ESLint config added; lint script working.
- 2025-08-24, HF-OPS-EVIDENCE-0006: standardized evidence filenames; mapping captured in \_legacy_renames.json.
- 2025-08-24, HF-OPS-EVIDENCE-0007: removed suffixes from evidence names; hygiene PASS with LEGACY allowance.
- 2025-08-24, HF-FE-SKEL-0001: Minimal Next.js shell & dashboard tiles added.
- 2025-08-24, HF-FE-NAV-0002: Added Topbar to layout (title + placeholders).
- 2025-08-24, HF-FE-DEPLOY-0003: Added Dockerfile + .dockerignore + start script; docker run on :3000.
- 2025-08-24, HF-FE-DEPLOY-0004: Added /api/health and Docker HEALTHCHECK; Node 20 LTS runtime.
- 2025-08-24, HF-FE-SMOKE-0001: Added smoke.mjs; verified / and /api/health on localhost.
- 2025-08-24, HF-FE-AUTH-0001: Added Lite auth (middleware redirect, login/logout, /login form).
- 2025-08-24, HF-FE-AUTH-0002: Middleware matcher simplified; diagnostic header added; auth protection confirmed.
- 2025-08-24, HF-FE-AUTH-0003-Review: Independent middleware deep-dive; root-cause hypothesis + fix/fallback recommendation.
- 2025-08-24, HF-FE-AUTH-0004: Middleware header gated by env; Topbar shows Login/Logout; auth flow verified.
- 2025-08-24, HF-CI-SMOKE-0002: Added GHA smoke (node) + docker-e2e workflow; artifacts uploaded.
- 2025-08-24, HF-SEC-NEXT-0001: Next 14.x security audit; patched to latest 14.x (if available); post-audit verdict recorded.
- 2025-08-24, HF-OPS-ANALYSIS-0004B-A: Implemented Adaptive Enforcement Model with 3-stage CI pipeline, enforcement rules, PR template, and CODEOWNERS; all checks PASS.
- 2025-08-24, HF-OPS-ANALYSIS-0004E: Implemented Watchdog Plan with Playwright preview crawl, automated testing for hydration/a11y/SEO/performance issues, CI integration with path filtering.
- 2025-08-24, HF-OPS-ANALYSIS-0004E-REDTEAM: Red-team test implemented with 6 seeded errors (console, a11y, SEO, performance, hydration, 404), evidence collected, ready for CI validation and revert testing.
- 2025-08-24, HF-OPS-ANALYSIS-0004E-REDTEAM-RUN: Red-team test executed with controlled errors in 3 files, build successful, ESLint warnings confirmed, ready for PR creation and CI watchdog testing.
- 2025-08-24, HF-OPS-ANALYSIS-0004E-REALRUN: Red-team test executed with controlled errors, CI workflow updated with official path filter and Playwright setup, build successful, ready for GitHub Actions testing.
