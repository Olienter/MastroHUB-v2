#!/usr/bin/env node
/* CORE Verification Runner (HF-COMM-PROTOCOLS-0001-P1)
 * Steps: Git → Typecheck/Lint/Build → Runtime port check → Evidence write
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import net from "node:net";

const EVIDENCE_PATH = ".ai/checks/HF-COMM-PROTOCOLS-0001-P1.txt";

function run(cmd, opts = {}) {
  try {
    const out = execSync(cmd, { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8", ...opts });
    return { ok: true, out };
  } catch (e) {
    return { ok: false, out: (e.stdout || "") + (e.stderr || ""), code: e.status ?? 1 };
  }
}

function lastLines(text, n = 20) {
  const lines = text.trim().split(/\r?\n/);
  return lines.slice(-n).join(os.EOL);
}

function checkPort(host = "127.0.0.1", port = 3000, timeoutMs = 1000) {
  return new Promise((resolve) => {
    const sock = new net.Socket();
    let resolved = false;
    const done = (result) => { if (!resolved) { resolved = true; try { sock.destroy(); } catch {} resolve(result); } };
    sock.setTimeout(timeoutMs);
    sock.once("connect", () => done({ busy: true }));
    sock.once("timeout", () => done({ busy: false }));
    sock.once("error", () => done({ busy: false }));
    sock.connect(port, host);
  });
}

(async () => {
  const now = new Date().toISOString();

  const nodeV = run("node -v").out.trim();
  const pnpmV = run("pnpm -v").out.trim();
  const head = run("git rev-parse --short HEAD").out.trim();
  const remote = run("git remote -v").out.trim();
  const status = run("git status --porcelain").out.trim();

  let result = "OK";
  let notes = [];

  if (status.length > 0) {
    result = "FAIL";
    notes.push("Git working directory is not clean.");
  }

  const typecheck = run("pnpm run -s typecheck");
  if (!typecheck.ok) {
    result = "FAIL";
    notes.push("Typecheck failed.");
  }

  const lint = run("pnpm run -s lint");
  if (!lint.ok) {
    result = "FAIL";
    notes.push("Lint failed.");
  }

  const build = run("pnpm run -s build");
  if (!build.ok) {
    result = "FAIL";
    notes.push("Build failed.");
  }

  const port = await checkPort("127.0.0.1", 3000, 1000);
  if (port.busy) {
    result = "FAIL";
    notes.push("Port 3000 is BUSY.");
  }

  const ev =
`HF-COMM-PROTOCOLS-0001-P1 EVIDENCE
DATE_UTC: ${now}
NODE: ${nodeV}
PNPM: ${pnpmV}
HEAD: ${head}
REMOTE:
${remote}

RESULT: ${result}
NOTES:
${notes.length ? notes.map(n => "- " + n).join(os.EOL) : "- None"}

--- TYPECHECK (tail) ---
${lastLines(typecheck.out, 20)}

--- LINT (tail) ---
${lastLines(lint.out, 20)}

--- BUILD (tail) ---
${lastLines(build.out, 20)}
`;

  fs.mkdirSync(".ai/checks", { recursive: true });
  fs.writeFileSync(EVIDENCE_PATH, ev, "utf8");

  console.log(`[verify-core] RESULT=${result}`);
  if (result !== "OK") process.exit(1);
})();
