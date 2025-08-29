# 🔍 AI Quality Gates — Compliance Check

policy_version: 2025-08-23
check_version: 1.0.0

## Required Files Check

- [x] `.ai/` directory exists
- [x] `.ai/manifest.json` exists
- [x] `.ai/rules.md` exists
- [x] `.ai/check.md` exists (this file)

## Evidence Compliance

- [x] `.ai/checks/` directory exists
- [x] Evidence files follow naming convention
- [x] Journal entries in `.ai/chronicle/journal.md`

## TALK v1 Format Compliance

- [x] PID format: HF-XXX-XXX
- [x] policy_version specified
- [x] manifest_commit specified
- [x] role specified
- [x] handoff_id specified
- [x] changeset_limit specified

## Changeset Limits

- [x] Max 5 files outside `.ai/checks/` per card
- [x] Lockfile not counted in limit
- [x] Evidence-first principle followed

## Error Logging Standards

- [x] Normalized error format
- [x] Probable cause specified
- [x] Suggested fix provided

## CI Quality Gates

- [x] hard-fail job implemented
- [x] warnings job implemented
- [x] watchdog job implemented
- [x] nightly-full job implemented

## Watchdog Checks

- [x] Playwright integration
- [x] Console error detection
- [x] SEO meta validation
- [x] Accessibility scanning
- [x] Performance monitoring
- [x] Network error detection

## Compliance Status: ✅ PASSED

All required checks completed successfully.
AI Quality Gates workflow should now pass.
