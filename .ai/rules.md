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

### Approval Requirements

**Agents MUST wait for explicit approval before execution:**

- **Required:** `APPROVED: <handoff_id>` (standalone, uppercase line)
- **Allowed Pre-Approved:**
  - /SYNC operations
  - Read `.ai/*` files
  - Planning and evidence preparation
  - Non-applicable diff-previews
- **Forbidden Pre-Approved:**
  - Committable diffs/PRs
  - Shell commands that mutate state
  - "Final patch" attachments
  - Any state-changing operations

### Komunikačné podpisy (ping‑pong)

- Každá správa GPT končí "GPT Prepinam".
- Každá správa Cursor končí "Cursor Prepinam".
- Toto je komunikačný podpis, nie merge sign‑off.

### Lanes in Practice

- **Architekt ↔ GPT:** voľný štýl; GPT zabezpečí transformáciu do TALK v1, len ak je to určené pre Cursor.
- **GPT ↔ Cursor:** striktne TALK v1 + komunikačný podpis na konci každej správy.
- **Merge sign‑off:** výhradne Cursor po implementácii a evidence.

### Compliance Echo (povinné)

Každá správa v Lane B začína krátkym potvrdením:

- policy_version overená,
- IMPACT_MAP ≤5,
- ACCEPTANCE + evidence definované,
- Memory Spine: pripomenutie journal/evidence.

### STOP guard (hard rule)

- Ak IMPACT_MAP >5 alebo chýba ACCEPTANCE/evidence plán → okamžité **STOP & REPORT** (žiadne ďalšie ping‑pong správy).

## 4. Normalized Error Logging

- Každý error musí byť v tvare:

```
[TS2503] Cannot find namespace 'React' — file: app/layout.tsx:1:1
  Probable cause: Missing @types/react or next-env.d.ts not included.
  Suggested fix: pnpm add -D @types/react @types/react-dom
```

## 5. Adaptive Enforcement Model

### Enforcement Levels

| Level             | Threshold | Action            | Examples                                        |
| ----------------- | --------- | ----------------- | ----------------------------------------------- |
| **Hard Fail**     | 0 errors  | Block deploy      | Build, typecheck, security, auth                |
| **Warning**       | ≤3 issues | Report + continue | Lighthouse <90, a11y issues, test coverage <80% |
| **Manual Review** | N/A       | Human decision    | Content pipeline, CTA flows, UX decisions       |

### Escalation Logic

- **Tests**: coverage <60% = Warning; <50% = Hard Fail; **delta** −5 p.b. vs `main` = Hard Fail
- **Performance (Lighthouse mobile)**: score <90 = Warning; <80 = Hard Fail; **delta** −10 bodov = Hard Fail; bundle >250 kB gzip = Warning; >300 kB = Hard Fail
- **A11y (axe/pa11y)**: 1–4 serious/critical = Warning; ≥5 = Hard Fail; **delta** +3 = Hard Fail
- **SEO**: chýbajúci title/description alebo sitemap/robots = Warning; strata OG/Twitter vs `main` = Hard Fail
- **Security/Auth**: hardcoded secrets, chýbajúce CSP/HSTS, demo účty → vždy Hard Fail
- **Eskalácia**: 3× rovnaký Warning po sebe na tej istej vetve = Hard Fail; kumulovaný Warning score ≥10 = Hard Fail

### CI Quality Gates

Implementovať `.github/workflows/ci.yml` s jobmi:

- **hard-fail**: build + typecheck + lint + security/auth check
- **warnings**: Lighthouse perf, a11y scan, test coverage, SEO meta
- **watchdog**: preview crawl cez Playwright (console, a11y, SEO, perf)
- **nightly-full**: kompletný Lighthouse + a11y crawl + bundle analyzer

### Watchdog Checks

Automatický preview crawl cez Playwright na každom PR:

- **Hydration Errors**: console errors, React SSR/CSR problémy
- **SEO Meta**: title, description, Open Graph, Twitter Cards
- **Accessibility**: alt text, headings, landmarks, ARIA labels
- **Performance**: Core Web Vitals, bundle size, loading times
- **Network**: failed requests, 4xx/5xx errors
- **Console**: JavaScript errors, warnings, deprecations

#### Watchdog Thresholds

- **Console Errors**: 0 = PASS, ≥1 = Warning, ≥5 = Hard Fail
- **A11y Violations**: 0-2 = PASS, 3-5 = Warning, ≥6 = Hard Fail
- **SEO Missing**: 0 = PASS, 1-2 = Warning, ≥3 = Hard Fail
- **Performance Delta**: -5% = PASS, -5% to -10% = Warning, >-10% = Hard Fail

## 6. Journal & State Discipline

- Každá karta musí pridať riadok do `.ai/chronicle/journal.md`.
- `.ai/state.json.manifest_commit` = HEAD short SHA.

### Manifest Sync Discipline (MANDATORY)

**Každá implementačná karta MUSÍ:**

- Aktualizovať `.ai/state.json.manifest_commit` na aktuálny HEAD SHA
- Aktualizovať `.ai/manifest.json.manifest_commit` na aktuálny HEAD SHA
- Toto sa vykonáva PRED evidence a journal update

**Dôvod:** Zabrániť manifest_commit mismatch ktorý spôsobuje STOP condition.
**Dôsledok:** Ak sa manifest_commit nezhoduje s HEAD SHA → CI build zlyhá.

### Git Pager Fix (MANDATORY)

**Pri získavaní HEAD SHA vždy používať:**

- `git --no-pager rev-parse --short HEAD` (namiesto `git rev-parse --short HEAD`)
- `git --no-pager log --oneline -1 | cut -d' ' -f1` (alternatíva)

**Dôvod:** Git automaticky spúšťa pager (less/more) na Windows, čo spôsobuje zaseknutie terminalu.
**Dôsledok:** Bez `--no-pager` sa terminal zasekne a SHA validácia zlyhá.

## 7. Fallback Strategy

- Ak sa nedá ≤5 súborov → splitni HF-XXX-A/B.
- Ak typové chyby zahlcujú → zvlášť "types-fix" karta.
- Nikdy žiadny WRITE bez "Approved".

## 8. Auto-write Policy

- Počas `/SYNC` sa nesmú robiť žiadne WRITE operácie.
- Ak je potrebné zapisovať (napr. git init, commit), musí sa to oddeliť do samostatnej karty (napr. HF-0000-GIT).
