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

---

## UX Analysis Prompt

PID: HF-UX-001-UserExperienceAnalysis
policy_version: 2025-08-23
manifest_commit: cfcbd8d
role: CURSOR
handoff_id: HF-UX-001
changeset_limit: ≤5

## HISTORY

Dokončená hĺbková technická analýza hlavnej stránky MastroHUB po refaktoringu. Identifikované technické problémy a odporúčania. Teraz potrebujeme analýzu z pohľadu skutočného používateľa.

## INTENT

Vykonať hĺbkovú UX analýzu hlavnej stránky MastroHUB z pohľadu skutočného používateľa, identifikovať pain points a príležitosti na vylepšenie používateľského zážitku.

## IMPACT_MAP

- .ai/checks/HF-UX-ANALYSIS-001.txt
- components/layout/Header.tsx
- components/sections/HeroSection.tsx
- components/cards/ArticleCard.tsx
- app/(public)/page.tsx

## ACCEPTANCE

- Vytvorený evidence report HF-UX-ANALYSIS-001.txt s UX analýzou
- Identifikované kritické UX problémy s prioritami
- Mapované používateľské cesty a pain points
- Navrhnuté konkrétne vylepšenia implementovateľné v reálnom čase
- Hodnotenie UX skóre pre každú dimenziu (1-10)

## RISKS_FALLBACK

- Subjektívnosť UX analýzy → použiť štandardné UX heuristiky
- Chýbajúce user testing data → založiť na best practices
- Komplexnosť analýzy → fázovať podľa priorit

## NEXT_PROMPT_REQUEST

Cursor, vykonaj hĺbkovú UX analýzu hlavnej stránky MastroHUB z pohľadu skutočného používateľa. Analyzuj:

1. **First Impression** (0-3s) - prvý dojem, visual hierarchy, brand recognition
2. **Navigation Experience** - header usability, menu structure, search functionality
3. **Content Discovery** - hero section effectiveness, content organization, article cards
4. **Mobile Experience** - responsive design, touch targets, loading speed
5. **Accessibility** - color contrast, keyboard navigation, screen reader compatibility
6. **User Engagement** - CTAs, social elements, personalization opportunities

Identifikuj kritické UX problémy, pain points v používateľských cestách a navrhni konkrétne vylepšenia. Vytvor evidence report s UX scoring matrix a improvement roadmap.

## Cursor Prepinam

---

## Deep UX Analysis Prompt

PID: HF-UX-002-DeepUserExperienceAnalysis
policy_version: 2025-08-23
manifest_commit: cfcbd8d
role: CURSOR
handoff_id: HF-UX-002
changeset_limit: ≤5

## HISTORY

Dokončená technická analýza MastroHUB s výbornými výsledkami (8.5/10 code quality). Teraz potrebujeme hĺbkovú UX analýzu z pohľadu skutočného používateľa na identifikáciu slábich stránok a príležitostí.

## INTENT

Vykonať hĺbkovú UX analýzu hlavnej stránky MastroHUB z pohľadu skutočného používateľa, identifikovať slabe stránky, pain points a príležitosti na vylepšenie používateľského zážitku.

## IMPACT_MAP

- .ai/checks/HF-UX-ANALYSIS-002.txt
- components/layout/Header.tsx
- components/sections/HeroSection.tsx
- components/sections/LiveNewsSidebar.tsx
- app/(public)/page.tsx

## ACCEPTANCE

- Vytvorený evidence report HF-UX-ANALYSIS-002.txt s hĺbkovou UX analýzou
- Identifikované slabe stránky s konkrétnymi príkladmi
- Mapované pain points v používateľských cestách
- Navrhnuté konkrétne vylepšenia s prioritami
- UX scoring matrix pre všetky dimenzie (1-10)
- A/B testing návrhy pre validáciu

## RISKS_FALLBACK

- Subjektívnosť UX analýzy → použiť Nielsen's heuristiky a best practices
- Chýbajúce user testing data → založiť na UX research metodológii
- Komplexnosť analýzy → fázovať podľa impact a effort

## NEXT_PROMPT_REQUEST

Cursor, vykonaj hĺbkovú UX analýzu hlavnej stránky MastroHUB z pohľadu skutočného používateľa. Analyzuj všetky UX dimenzie:

**USER JOURNEY ANALYSIS:**

- First Impression (0-3s) - visual hierarchy, brand trust, CTA visibility
- Navigation Experience - header usability, menu structure, search functionality
- Content Discovery - hero effectiveness, content organization, article cards
- Engagement Factors - content relevance, visual appeal, interactive elements

**SPECIFIC UX ISSUES TO IDENTIFY:**

- Critical: Confusing navigation, poor content discovery, slow performance, mobile issues, accessibility barriers
- Moderate: Weak visual hierarchy, inconsistent design, poor information architecture
- Minor: Typography issues, color problems, spacing issues, micro-interactions

**USER PERSONAS:**

- Gastronomy Enthusiast, Industry Professional, Casual Reader, Mobile User
- Accessibility User, International User, Returning User, New User

**TESTING SCENARIOS:**

- First-time visitor experience
- Content discovery process
- Mobile experience evaluation
- Accessibility compliance

Identifikuj slabe stránky, pain points v používateľských cestách a navrhni konkrétne vylepšenia s A/B testing návrhmi. Vytvor evidence report s UX scoring matrix a improvement roadmap.

## Cursor Prepinam
