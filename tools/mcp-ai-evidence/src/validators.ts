export async function validateTalkV1(prBody: string) {
  const must = ["PID", "Intent", "Evidence", "Status"];
  const missing = must.filter(k => !prBody.includes(k));
  return { ok: missing.length === 0, missing };
}

export async function checkAiCompliance() {
  const missing: string[] = [];
  try { 
    await import("node:fs/promises").then(m => m.access(".ai/check.md")); 
  } catch { 
    missing.push(".ai/check.md"); 
  }
  return { ok: missing.length === 0, missing };
}
