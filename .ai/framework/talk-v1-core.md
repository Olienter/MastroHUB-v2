# TALK v1 Core Framework

## Overview
TALK v1 je automatizovaný systém pre AI interakcie a rozhodovanie v MastroHUB v2.

## Core Components

### 1. TALK v1 Format
Každá AI interakcia musí obsahovať:
- **PID**: Unique identifier
- **policy_version**: Aktuálna verzia
- **manifest_commit**: Git commit hash
- **role**: GPT/CURSOR/ARCHITECT
- **handoff_id**: Handoff identifier
- **changeset_limit**: Maximálny počet zmien

### 2. Evidence System
- Všetky AI rozhodnutia musia byť dokumentované v `.ai/checks/`
- Každý handoff má vlastný evidence súbor
- Evidence obsahuje merateľné metriky a compliance status

### 3. Automation Workflow
1. **AI Request** → TALK v1 format
2. **Processing** → Automated validation
3. **Evidence** → Compliance tracking
4. **Handoff** → Next step execution

## Compliance Rules
- Všetky AI interakcie musia používať TALK v1 format
- Evidence súbory musia existovať pre každý handoff
- Build a testy musia prejsť pred handoff
- Automatizácia sa spúšťa len pri 100% compliance

## Integration Points
- Pre-commit hooks
- CI/CD pipeline
- Quality gates
- Performance monitoring
- Decision tracking
