## TALK v1

**PID:** [HF-ID]  
**policy_version:** 2025-08-23  
**manifest_commit:** [git HEAD short SHA]  
**role:** [Cursor/GPT]  
**handoff_id:** [HF-ID]  
**lane:** [A/B]  
**changeset_limit:** [≤5 súborov]  

---

## INTENT

[Krátky popis čo sa mení a prečo]

## IMPACT_MAP

| Súbor | Zmena | Dôvod |
|-------|-------|--------|
| [cesta] | [create/modify/delete] | [dôvod] |

**Total:** [X] súborov ✅ ≤5 limit

## ACCEPTANCE

**Evidence:** `.ai/checks/[HF-ID].json`  
**Validation:** [čo sa overuje]  
**Status:** [PASS/FAIL]  

## RISKS_FALLBACK

**Risk:** [možný problém]  
**Fallback:** [riešenie ak zlyhá]  

---

## Evidence Link

**Evidence:** `.ai/checks/[HF-ID].json`

## Checklist

- [ ] TALK v1 blok v PR description
- [ ] Evidence link na `.ai/checks/[HF-ID].json`
- [ ] Changeset ≤5 súborov (lane B)
- [ ] Whitelisted paths (lane B)
- [ ] No `console.log` v MCP serveri
- [ ] SDK verzia pinned (bez `^`/`~`)
- [ ] CI checks passing
- [ ] Evidence file created
- [ ] Journal updated
