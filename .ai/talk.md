# TALK v1

## GPT Reply Template

PID: <HF-ID>-<StepName>
policy_version: 2025-08-23
manifest_commit: <hash|INIT>
role: GPT
handoff_id: <HF-ID>
changeset_limit: ≤5

## HISTORY

<1–3 vety o poslednom stave>

## INTENT

<1 veta čo ide GPT dosiahnuť>

## IMPACT_MAP

<max 5 presných relative paths>

## ACCEPTANCE

<merateľné kontroly: build/evidence/journal/state/compliance>

## RISKS_FALLBACK

<riziká + plán B (fázovanie)>

## NEXT_PROMPT_REQUEST

<čo presne očakáva GPT od Cursor/Architekt>

GPT Prepinam

---

## Cursor Reply Template

PID: <HF-ID>-<StepName>
policy_version: 2025-08-23
manifest_commit: <hash|INIT>
role: CURSOR
handoff_id: <HF-ID>
changeset_limit: ≤5

## HISTORY

<1–3 vety o poslednom stave>

## INTENT

<1 veta čo ide Cursor dosiahnuť>

## IMPACT_MAP

<max 5 presných relative paths>

## ACCEPTANCE

<merateľné kontroly: build/evidence/journal/state/compliance>

## RISKS_FALLBACK

<riziká + plán B (fázovanie)>

## NEXT_PROMPT_REQUEST

<čo presne očakáva Cursor od GPT/Architekt>

## Cursor Prepinam

## Generic Template (Deprecated)

PID: <id>
policy_version: 2025-08-23
manifest_commit: <hash|INIT>
role: CURSOR|GPT
handoff_id: HF-XXXX
changeset_limit: 5

## HISTORY

<1–3 vety>

## INTENT

<1 veta>

## IMPACT_MAP

<max 5 súborov>

## ACCEPTANCE

<3–5 merateľných bodov>

## RISKS_FALLBACK

<1–2 riziká + plán B>

## NEXT_PROMPT_REQUEST

<ďalší krok>

Approve plan?
<ROLE> Prepinam
