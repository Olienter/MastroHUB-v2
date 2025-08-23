# Pull Request Template

## 🤖 AI System Compliance

**Handoff ID:** `HF-XXXX`
**Manifest Commit:** `<hash|INIT>`
**Policy Version:** `2025-08-23`

### Evidence Requirements

- [ ] Evidence uploaded to `.ai/checks/` directory
- [ ] File count ≤5 (excluding evidence files)
- [ ] Memory Spine updated (state.json, journal.md)
- [ ] Handoff card created/updated

## 📋 Change Summary

**What does this PR do?**

<!-- Brief description of changes -->

**Why now?**

<!-- Business/technical justification -->

**Files changed:**

<!-- List of modified files (max 5) -->

## ✅ Acceptance Criteria

- [ ] All acceptance criteria met
- [ ] Evidence provided in `.ai/checks/`
- [ ] No breaking changes
- [ ] Tests passing (if applicable)

## 🔍 Evidence

**Evidence files:**

```
.ai/checks/
├── [evidence-file-1]
├── [evidence-file-2]
└── [evidence-file-3]
```

**Performance metrics:**

- LCP: `≤2.5s` ✅
- CLS: `<0.1` ✅
- A11y: `No serious issues` ✅

## 🚨 Risks & Fallback

**Potential risks:**

<!-- List any risks -->

**Fallback plan:**

<!-- What if this fails? -->

## 📝 Additional Notes

<!-- Any other relevant information -->

---

**Remember:** This PR must follow AI workflow: TALK → PR → evidence → Memory Spine → merge
