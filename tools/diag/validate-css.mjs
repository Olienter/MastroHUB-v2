#!/usr/bin/env node
/* CSS Integration Validator (HF-UI-FOUNDATION-0002-A-VALIDATION)
 * Validates: CSS imports, Tailwind config, build output, runtime CSS loading
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import net from "node:net";

const EVIDENCE_PATH = ".ai/checks/HF-UI-FOUNDATION-0002-A-VALIDATION.txt";

function run(cmd, opts = {}) {
  try {
    const out = execSync(cmd, {
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
      ...opts,
    });
    return { ok: true, out };
  } catch (e) {
    return {
      ok: false,
      out: (e.stdout || "") + (e.stderr || ""),
      code: e.status ?? 1,
    };
  }
}

function checkPort(host = "127.0.0.1", port = 3000, timeoutMs = 1000) {
  return new Promise((resolve) => {
    const sock = new net.Socket();
    let resolved = false;
    const done = (result) => {
      if (!resolved) {
        resolved = true;
        try {
          sock.destroy();
        } catch {}
        resolve(result);
      }
    };
    sock.setTimeout(timeoutMs);
    sock.once("connect", () => done({ busy: true }));
    sock.once("timeout", () => done({ busy: false }));
    sock.once("error", () => done({ busy: false }));
    sock.connect(port, host);
  });
}

function validateCSSFiles() {
  const requiredFiles = [
    "app/styles/tokens.css",
    "app/styles/typography.css",
    "app/globals.css",
  ];

  const results = {};
  for (const file of requiredFiles) {
    results[file] = fs.existsSync(file);
  }

  return results;
}

function validateCSSImports() {
  const globalsContent = fs.readFileSync("app/globals.css", "utf8");

  const requiredImports = ["./styles/tokens.css", "./styles/typography.css"];

  const results = {};
  for (const importPath of requiredImports) {
    results[importPath] = globalsContent.includes(importPath);
  }

  return results;
}

function validateTailwindConfig() {
  const configContent = fs.readFileSync("tailwind.config.ts", "utf8");

  const requiredPaths = [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ];

  const results = {};
  for (const path of requiredPaths) {
    results[path] = configContent.includes(path);
  }

  return results;
}

(async () => {
  const now = new Date().toISOString();

  console.log("🔍 CSS Integration Validation Starting...");

  // 1. File Existence Check
  console.log("📁 Checking CSS file existence...");
  const fileValidation = validateCSSFiles();

  // 2. Import Validation
  console.log("🔗 Checking CSS import paths...");
  const importValidation = validateCSSImports();

  // 3. Tailwind Config Validation
  console.log("⚙️ Checking Tailwind configuration...");
  const tailwindValidation = validateTailwindConfig();

  // 4. Build Test
  console.log("🔨 Testing build process...");
  const build = run("pnpm run build");

  // 5. Port Availability Check
  console.log("🌐 Checking port availability...");
  const port = await checkPort("127.0.0.1", 3000, 1000);

  // 6. Results Analysis
  let result = "OK";
  let notes = [];

  // File validation
  const missingFiles = Object.entries(fileValidation).filter(
    ([, exists]) => !exists
  );
  if (missingFiles.length > 0) {
    result = "FAIL";
    notes.push(
      `Missing CSS files: ${missingFiles.map(([file]) => file).join(", ")}`
    );
  }

  // Import validation
  const missingImports = Object.entries(importValidation).filter(
    ([, exists]) => !exists
  );
  if (missingImports.length > 0) {
    result = "FAIL";
    notes.push(
      `Missing CSS imports: ${missingImports.map(([imp]) => imp).join(", ")}`
    );
  }

  // Tailwind validation
  const missingPaths = Object.entries(tailwindValidation).filter(
    ([, exists]) => !exists
  );
  if (missingPaths.length > 0) {
    result = "FAIL";
    notes.push(
      `Missing Tailwind paths: ${missingPaths.map(([path]) => path).join(", ")}`
    );
  }

  // Build validation
  if (!build.ok) {
    result = "FAIL";
    notes.push("Build failed");
  }

  // Port validation
  if (port.busy) {
    result = "FAIL";
    notes.push("Port 3000 is BUSY");
  }

  // 7. Generate Evidence
  const ev = `HF-UI-FOUNDATION-0002-A-VALIDATION EVIDENCE
DATE_UTC: ${now}
NODE: ${run("node -v").out.trim()}
PNPM: ${run("pnpm -v").out.trim()}
HEAD: ${run("git rev-parse --short HEAD").out.trim()}

RESULT: ${result}
NOTES:
${notes.length ? notes.map((n) => "- " + n).join(os.EOL) : "- None"}

--- CSS FILE VALIDATION ---
${Object.entries(fileValidation)
  .map(([file, exists]) => `${exists ? "✅" : "❌"} ${file}`)
  .join(os.EOL)}

--- CSS IMPORT VALIDATION ---
${Object.entries(importValidation)
  .map(([imp, exists]) => `${exists ? "✅" : "❌"} ${imp}`)
  .join(os.EOL)}

--- TAILWIND CONFIG VALIDATION ---
${Object.entries(tailwindValidation)
  .map(([path, exists]) => `${exists ? "✅" : "❌"} ${path}`)
  .join(os.EOL)}

--- BUILD OUTPUT ---
${build.ok ? "✅ Build successful" : "❌ Build failed"}
${
  build.out
    ? `\nLast 20 lines:\n${build.out
        .trim()
        .split(os.EOL)
        .slice(-20)
        .join(os.EOL)}`
    : ""
}

--- PORT STATUS ---
Port 3000: ${port.busy ? "BUSY" : "AVAILABLE"}

--- RECOMMENDATIONS ---
${
  result === "OK"
    ? "✅ CSS integration appears correct. Test in browser to confirm."
    : "❌ Fix issues above before proceeding with UI development."
}
`;

  // 8. Write Evidence
  fs.mkdirSync(".ai/checks", { recursive: true });
  fs.writeFileSync(EVIDENCE_PATH, ev, "utf8");

  console.log(`\n🎯 CSS Integration Validation Complete!`);
  console.log(`📊 RESULT: ${result}`);
  console.log(`📁 Evidence: ${EVIDENCE_PATH}`);

  if (result !== "OK") {
    console.log(`\n❌ Issues found. Please fix before proceeding.`);
    process.exit(1);
  } else {
    console.log(`\n✅ CSS integration validated. Ready for browser testing.`);
  }
})();
