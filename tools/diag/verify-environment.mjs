#!/usr/bin/env node

// ESM environment diagnostic runner — Windows/macOS/Linux safe (no deps)
// Cross-platform environment verification with graceful error handling
import { spawnSync } from "node:child_process";
import { execSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";

// Utility functions
function execSyncSafe(cmd, options = {}) {
  try {
    const stdout = execSync(cmd, { encoding: "utf8", ...options });
    return { ok: true, stdout: stdout.trim(), stderr: "" };
  } catch (error) {
    return {
      ok: false,
      stdout: "",
      stderr: error.stderr?.toString() || error.message || "Unknown error",
    };
  }
}

function which(cmd) {
  const isWin = process.platform === "win32";

  // First try process.env.PATH
  const pathDirs = process.env.PATH?.split(isWin ? ";" : ":") || [];

  for (const dir of pathDirs) {
    const fullPath = path.join(dir, isWin ? `${cmd}.exe` : cmd);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  // Fallback to system commands
  try {
    if (isWin) {
      const result = execSyncSafe(`where ${cmd}`);
      if (result.ok && result.stdout) {
        return result.stdout.split("\n")[0].trim();
      }
    } else {
      const result = execSyncSafe(`which ${cmd}`);
      if (result.ok && result.stdout) {
        return result.stdout.trim();
      }
    }
  } catch {}

  return null;
}

// Main diagnostic function
function runDiagnostics() {
  const isWin = process.platform === "win32";

  // OS information
  const osInfo = {
    platform: os.platform(),
    release: os.release(),
    cpus: os.cpus()?.[0]?.model || "unknown",
  };

  // Node.js information
  const nodeInfo = {
    version: process.version,
    path: process.execPath,
    status: "OK",
  };

  // NPM information
  let npmInfo = { version: "unknown", path: "unknown", status: "MISSING" };
  try {
    const npmPath = which("npm");
    if (npmPath) {
      const result = execSyncSafe("npm --version");
      npmInfo = {
        version: result.ok ? result.stdout : "unknown",
        path: npmPath,
        status: result.ok ? "OK" : "FAIL",
      };
    }
  } catch {}

  // PNPM information
  let pnpmInfo = { version: "unknown", path: "unknown", status: "MISSING" };
  try {
    const pnpmPath = which(isWin ? "pnpm.cmd" : "pnpm");
    if (pnpmPath) {
      const result = execSyncSafe(`${isWin ? "pnpm.cmd" : "pnpm"} --version`);
      pnpmInfo = {
        version: result.ok ? result.stdout : "unknown",
        path: pnpmPath,
        status: result.ok ? "OK" : "FAIL",
      };
    }
  } catch {}

  // Git information
  let gitInfo = { version: "unknown", path: "unknown", status: "MISSING" };
  try {
    const gitPath = which("git");
    if (gitPath) {
      const result = execSyncSafe("git --version");
      gitInfo = {
        version: result.ok ? result.stdout : "unknown",
        path: gitPath,
        status: result.ok ? "OK" : "FAIL",
      };
    }
  } catch {}

  // System PATH
  const systemPath = process.env.PATH?.split(isWin ? ";" : ":") || [];

  // PATH linting function
  function lintPathEntries(entries) {
    const norm = (p) => (p || "").trim();
    const cleaned = entries.map(norm).filter(Boolean);

    const isFilePath = (p) => {
      const lower = p.toLowerCase();
      return (
        lower.endsWith(".exe") ||
        lower.endsWith(".cmd") ||
        lower.endsWith(".bat") ||
        lower.endsWith(".ps1")
      );
    };

    const seen = new Map();
    const duplicates = [];
    for (const p of cleaned) {
      const key = os.platform() === "win32" ? p.toLowerCase() : p; // case-insensitive on Windows
      if (seen.has(key)) duplicates.push(p);
      else seen.set(key, true);
    }

    const fileEntries = cleaned.filter(isFilePath);
    const total = cleaned.length;
    const unique = seen.size;
    const overlong = total > 64; // heuristika

    const recommendations = [];
    if (fileEntries.length)
      recommendations.push(
        "Remove file paths from PATH (keep folders only): *.exe, *.cmd, *.bat, *.ps1"
      );
    if (duplicates.length)
      recommendations.push(
        "Remove duplicate PATH entries to reduce lookup ambiguity"
      );
    if (overlong)
      recommendations.push("Trim PATH length (target ≤ 64 entries)");
    recommendations.push("Prefer Corepack-managed pnpm over global shims");

    const status =
      fileEntries.length || duplicates.length || overlong ? "WARN" : "OK";

    return {
      totalEntries: total,
      uniqueEntries: unique,
      duplicates,
      fileEntries,
      overlong,
      status,
      recommendations,
    };
  }

  // Spawn test (TSC from node_modules)
  function resolveLocalTSC() {
    const binDir = path.join(process.cwd(), "node_modules", ".bin");
    const candidates =
      os.platform() === "win32"
        ? ["tsc.CMD", "tsc.cmd", "tsc.ps1", "tsc"] // Windows shimy
        : ["tsc"]; // Unix
    for (const name of candidates) {
      const p = path.join(binDir, name);
      if (fs.existsSync(p)) return p;
    }
    return null;
  }

  function runTSCVersion() {
    const local = resolveLocalTSC();
    let res;
    if (local) {
      // Na Windows spúšťaj .CMD priamo bez shell:true; ak zlyhá, skús shell:true
      res = spawnSync(local, ["--version"], { encoding: "utf8" });
      if (res.error || res.status !== 0) {
        res = spawnSync(local, ["--version"], {
          encoding: "utf8",
          shell: os.platform() === "win32",
        });
      }
    } else {
      // Fallback A: pnpm exec
      res = spawnSync("pnpm", ["exec", "tsc", "--version"], {
        encoding: "utf8",
        shell: os.platform() === "win32",
      });
      // Fallback B: npx s lokálnym TS (bez sieťového fetchu ak je v node_modules)
      if (res.status !== 0) {
        res = spawnSync(
          "npx",
          ["--yes", "-p", "typescript", "tsc", "--version"],
          { encoding: "utf8", shell: true }
        );
      }
    }
    const ok = res && res.status === 0;
    return {
      command: local ?? "pnpm exec tsc --version",
      exitCode: res?.status ?? -1,
      output: (res?.stdout || res?.stderr || "").trim(),
      status: ok ? "OK" : "FAIL",
    };
  }

  const spawnTest = runTSCVersion();

  // Environment variables
  const environmentVariables = {
    NODE_ENV: process.env.NODE_ENV || "undefined",
    PATH: process.env.PATH ? "defined" : "undefined",
    HOME: process.env.HOME || process.env.USERPROFILE || "undefined",
  };

  // Compile report
  const report = {
    os: osInfo,
    node: nodeInfo,
    npm: npmInfo,
    pnpm: pnpmInfo,
    git: gitInfo,
    systemPath: systemPath,
    pathLint: lintPathEntries(systemPath),
    spawnTest: spawnTest,
    environmentVariables: environmentVariables,
  };

  return report;
}

// Execute and output
const report = runDiagnostics();
console.log(JSON.stringify(report, null, 2));
