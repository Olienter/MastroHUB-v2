# 🔄 MastroHUB v2 — Workflow Process

policy_version: 2025-08-23

## Overview

Presný postup spolupráce medzi GPT (Reviewer/Coordinator), Cursor (Builder) a Architekt (User) pre každý Handoff.

## Process Flow

### 1. SYNC Phase

**Purpose:** GPT vykonáva `/SYNC` podľa Strict Read Order z `.ai/instructions.md`

**GPT Checklist:**

- [ ] Číta všetkých 10 súborov v presnom poradí
- [ ] Overuje `policy_version` konzistenciu
- [ ] Detekuje `manifest_commit` nezhody
- [ ] Identifikuje chýbajúce súbory
- [ ] Zhromažďuje aktuálny stav projektu
- [ ] **ROLE GATE:** Validuje `role:` + sign-off v poslednej odpovedi (ak existuje)

**Output:** Status report s identifikovanými problémami

**ROLE GATE:** Pri nesúlade vráti "Invalid role header/sign-off — resend as Cursor/GPT" (bez ďalšieho postupu)

---

### 2. PLAN Phase

**Purpose:** GPT pripravuje TALK v1 plán s explicitnými ACCEPTANCE bodmi

**GPT Checklist:**

- [ ] Validácia podľa `.ai/instructions.md` a `.ai/rules.md`
- [ ] IMPACT_MAP ≤5 súborov (mimo `.ai/checks/`)
- [ ] Explicitné ACCEPTANCE body (merateľné kontroly)
- [ ] RISKS_FALLBACK definované
- [ ] NEXT_PROMPT_REQUEST jasne formulovaný
- [ ] **Žiadny WRITE** - len plánovanie

**Output:** TALK v1 s diff-preview a compliance tabuľkou

---

### 3. APPROVAL Phase

**Purpose:** Architekt hodnotí plán a udeľuje "Approved" alebo vracia na úpravu

**Architekt Checklist:**

- [ ] Overuje IMPACT_MAP ≤5 súborov
- [ ] Kontroluje ACCEPTANCE body (overiteľné)
- [ ] Posudzuje RISKS_FALLBACK
- [ ] Udeľuje "Approved" alebo "Revise"
- [ ] Definuje nové HF-ID ak potrebné

**Output:** "Approved" alebo feedback pre úpravu

---

### 4. BUILD Phase

**Purpose:** Cursor implementuje presne to, čo je v IMPACT_MAP

**Cursor Checklist:**

- [ ] Implementuje presne IMPACT_MAP (≤5 dotykov)
- [ ] Ukladá evidence v `.ai/checks/<handoff-id>.txt`
- [ ] Pridáva riadok do `.ai/chronicle/journal.md`
- [ ] Aktualizuje `.ai/handoff/index.json`
- [ ] Aktualizuje `.ai/state.json` ak potrebné

**Output:** Implementované zmeny + Evidence Pack

---

### 5. EVIDENCE Phase

**Purpose:** Cursor dodáva Evidence Pack podľa špecifikácie

**Cursor Checklist:**

- [ ] PR meta (title, description, labels)
- [ ] Snapshoty upravených súborov (diff summary)
- [ ] Evidence log s NODE/PNPM verziami
- [ ] Build log ~20 riadkov
- [ ] RESULT (PASS/FAIL)
- [ ] DATE (UTC)
- [ ] HEAD SHA
- [ ] Poznámka k a11y (ak relevantné)

**Output:** Evidence Pack v `.ai/checks/<handoff-id>.txt`

---

### 6. CLOSE Phase

**Purpose:** GPT vykonáva QA a compliance kontrolu

**GPT Checklist:**

- [ ] Overuje evidence v `.ai/checks/`
- [ ] Skontroluje journal aktualizácie
- [ ] Kontroluje index aktualizácie
- [ ] Overuje state compliance
- [ ] Potvrdzuje compliance s policy_version
- [ ] Vracia compliance tabuľku (true/false)

**Output:** Compliance tabuľka + "GPT Prepinam"

## Role Responsibilities Matrix

| Fáza     | GPT        | Cursor       | Architekt    |
| -------- | ---------- | ------------ | ------------ |
| SYNC     | ✅ Execute | ❌ Read-only | ❌ Read-only |
| PLAN     | ✅ Create  | ❌ Read-only | ❌ Read-only |
| APPROVAL | ❌ Wait    | ❌ Wait      | ✅ Decide    |
| BUILD    | ❌ Wait    | ✅ Execute   | ❌ Wait      |
| EVIDENCE | ❌ Wait    | ✅ Deliver   | ❌ Wait      |
| CLOSE    | ✅ QA      | ❌ Wait      | ❌ Wait      |

## Quality Gates

### GPT Quality Gates

- IMPACT_MAP ≤5 súborov
- ACCEPTANCE body overiteľné
- Žiadny WRITE bez Approved
- TALK v1 format compliance

### Cursor Quality Gates

- Presne IMPACT_MAP implementácia
- Evidence Pack completeness
- Memory Spine aktualizácia
- ≤5 dotykov dodržané

### Architekt Quality Gates

- Jasné "Approved" alebo feedback
- IMPACT_MAP scope validation
- ACCEPTANCE clarity check

## Error Handling

### IMPACT_MAP >5

**Action:** Rozfázovať na HF-XXX-A/B
**Example:** HF-OPS-0006-A (workflow), HF-OPS-0006-B (checklists)

### Unclear ACCEPTANCE

**Action:** Spýtať sa Architekta, nedomýšľať
**Example:** "Potrebujem objasnenie bodu 3 v ACCEPTANCE"

### Evidence Missing

**Action:** STOP & report, požiadať Cursor o doplnenie
**Example:** "Evidence v .ai/checks/ chýba, potrebujem Cursor doplniť"

## Success Metrics

- **Cycle Time:** SYNC → CLOSE < 24h
- **Quality:** 100% ACCEPTANCE compliance
- **Efficiency:** ≤5 dotykov na Handoff
- **Documentation:** 100% evidence coverage
- **Memory:** Memory Spine vždy aktuálny

## Continuous Improvement

### Weekly Review

- Architekt hodnotí workflow efficiency
- GPT navrhuje process improvements
- Cursor feedback na tooling/automation

### Monthly Retrospective

- Policy version updates
- Workflow optimization
- Tool integration improvements
