# 📐 MastroHUB v2 — Project Rules
policy_version: 2025-08-23
rules_version: 1.0.0

## 1. Changeset Limits
- Max 5 súborov mimo `.ai/checks/` na jednu kartu.
- Lockfile (`pnpm-lock.yaml`) sa **nepočíta** do limitu.
- Ak je nutné viac → splitni (HF-XXX-A/B).

## 2. Evidence-First Principle
Každá karta musí mať evidence v `.ai/checks/<handoff-id>.txt`:
- NODE, PNPM verzie
- Posledných ~20 riadkov `pnpm build`
- RESULT (OK/FAIL)
- DATE
- HEAD short SHA

## 3. TALK v1 Format
- Každá odpoveď: PID, policy_version, manifest_commit, role, handoff_id, changeset_limit
- Sekcie: HISTORY, INTENT, IMPACT_MAP, ACCEPTANCE, RISKS_FALLBACK, NEXT_PROMPT_REQUEST
- Končiť: "<ROLE> Prepinam"

## 4. Normalized Error Logging
- Každý error musí byť v tvare:

```
[TS2503] Cannot find namespace 'React' — file: app/layout.tsx:1:1
  Probable cause: Missing @types/react or next-env.d.ts not included.
  Suggested fix: pnpm add -D @types/react @types/react-dom
```

## 5. CI Quality Gates (odporúčanie)
Implementovať `.github/workflows/ci.yml` s jobmi:
- **file-count-guard**: fail PR ak >5 files (mimo `.ai/checks/`).
- **typed-build**: run `pnpm build` + typecheck.
- **evidence-present**: fail PR ak chýba `.ai/checks/<handoff>.txt`.

## 6. Journal & State Discipline
- Každá karta musí pridať riadok do `.ai/chronicle/journal.md`.
- `.ai/state.json.manifest_commit` = HEAD short SHA.

## 7. Fallback Strategy
- Ak sa nedá ≤5 súborov → splitni HF-XXX-A/B.
- Ak typové chyby zahlcujú → zvlášť "types-fix" karta.
- Nikdy žiadny WRITE bez "Approved".

## 8. Auto-write Policy
- Počas `/SYNC` sa nesmú robiť žiadne WRITE operácie.
- Ak je potrebné zapisovať (napr. git init, commit), musí sa to oddeliť do samostatnej karty (napr. HF-0000-GIT).
