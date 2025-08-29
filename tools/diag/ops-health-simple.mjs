#!/usr/bin/env node

import { spawn } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

// Helper functions
function fileExists(p) {
  return existsSync(p);
}

function readJsonSafe(p) {
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

// Simple direct execution helpers - NO COMPLEX LOGIC!
const runPnpm = async (args, opts) => {
  const pnpmPath = "C:\\Program Files\\nodejs\\pnpm.CMD";
  return execCmd(pnpmPath, args, { ...opts, shell: true });
};

const runNpm = async (args, opts) => {
  const npmPath = "C:\\Program Files\\nodejs\\npm.CMD";
  return execCmd(npmPath, args, { ...opts, shell: true });
};

function readPackageJson() {
  const pkgPath = join(process.cwd(), "package.json");
  return readJsonSafe(pkgPath);
}

function hasScript(name) {
  const pkg = readPackageJson();
  return pkg?.scripts?.[name] ? true : false;
}

function hasDep(name) {
  const pkg = readPackageJson();
  return pkg?.dependencies?.[name] || pkg?.devDependencies?.[name]
    ? true
    : false;
}

function hasEslintConfig() {
  return (
    fileExists(".eslintrc") ||
    fileExists(".eslintrc.js") ||
    fileExists(".eslintrc.json") ||
    fileExists(".eslintrc.yaml") ||
    fileExists(".eslintrc.yml") ||
    readPackageJson()?.eslintConfig
  );
}

function execCmd(
  cmd,
  args = [],
  { cwd, env, timeoutMs = 300000, tailLines = 50, shell = false } = {}
) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let cmdline = `${cmd} ${args.join(" ")}`.trim();

    const child = spawn(cmd, args, {
      cwd: cwd || process.cwd(),
      env: { ...process.env, ...env },
      stdio: ["ignore", "pipe", "pipe"],
      shell: shell,
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, timeoutMs);

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (exitCode) => {
      clearTimeout(timeout);
      const durationMs = Date.now() - startTime;

      if (timedOut) {
        resolve({
          cmdline,
          exitCode: -1,
          durationMs,
          stdout: "",
          stderr: "TIMEOUT",
          tail: "TIMEOUT",
          status: "TIMEOUT",
        });
        return;
      }

      const combined = stdout + "\n" + stderr;
      const lines = combined.split("\n").filter((line) => line.trim());
      const tail = lines.slice(-tailLines).join("\n");

      resolve({
        cmdline,
        exitCode,
        durationMs,
        stdout,
        stderr,
        tail,
        status: exitCode === 0 ? "OK" : "FAIL",
      });
    });

    child.on("error", (error) => {
      clearTimeout(timeout);
      const durationMs = Date.now() - startTime;
      resolve({
        cmdline,
        exitCode: -1,
        durationMs,
        stdout: "",
        stderr: error.message,
        tail: error.message,
        status: "ERROR",
      });
    });
  });
}

async function main() {
  const report = {
    meta: {},
    env: {},
    nodeTools: {},
    typecheck: {},
    eslint: {},
    build: {},
    mcp: {},
    envVars: {},
    summary: {},
  };

  // 1. Meta
  try {
    const gitResult = await execCmd("git", ["rev-parse", "--short", "HEAD"], {
      timeoutMs: 10000,
    });
    report.meta = {
      timestamp: new Date().toISOString(),
      head: gitResult.status === "OK" ? gitResult.stdout.trim() : "N/A",
    };
  } catch {
    report.meta = {
      timestamp: new Date().toISOString(),
      head: "N/A",
    };
  }

  // 2. Environment
  if (fileExists("tools/diag/verify-environment.mjs")) {
    try {
      const envResult = await execCmd(
        "node",
        ["tools/diag/verify-environment.mjs"],
        { timeoutMs: 60000 }
      );
      report.env = {
        status: envResult.status,
        exitCode: envResult.exitCode,
        durationMs: envResult.durationMs,
        output: envResult.stdout,
        error: envResult.stderr,
        tail: envResult.tail,
      };
    } catch {
      report.env = {
        status: "ERROR",
        exitCode: -1,
        durationMs: 0,
        output: "",
        error: "Execution failed",
        tail: "",
      };
    }
  } else {
    report.env = {
      status: "MISSING",
      exitCode: -1,
      durationMs: 0,
      output: "",
      error: "File not found",
      tail: "",
    };
  }

  // 3. Node Tools
  const nodeTools = {};

  // Node and Git (direct execution)
  try {
    const nodeResult = await execCmd("node", ["-v"], { timeoutMs: 10000 });
    nodeTools.node = {
      version: nodeResult.stdout.trim(),
      path: nodeResult.status === "OK" ? "OK" : "FAIL",
      status: nodeResult.status,
    };
  } catch {
    nodeTools.node = { version: "N/A", path: "FAIL", status: "ERROR" };
  }

  try {
    const gitResult = await execCmd("git", ["--version"], { timeoutMs: 10000 });
    nodeTools.git = {
      version: gitResult.stdout.trim(),
      path: gitResult.status === "OK" ? "OK" : "FAIL",
      status: gitResult.status,
    };
  } catch {
    nodeTools.git = { version: "N/A", path: "FAIL", status: "ERROR" };
  }

  // pnpm and npm (using simple helpers)
  const pnpmResult = await runPnpm(["-v"], { timeoutMs: 10000 });
  nodeTools.pnpm = {
    version: pnpmResult.stdout.trim() || "N/A",
    path: pnpmResult.status === "OK" ? "OK" : "FAIL",
    status: pnpmResult.status,
  };

  const npmResult = await runNpm(["-v"], { timeoutMs: 10000 });
  nodeTools.npm = {
    version: npmResult.stdout.trim() || "N/A",
    path: npmResult.status === "OK" ? "OK" : "FAIL",
    status: npmResult.status,
  };

  report.nodeTools = nodeTools;

  // 4. Typecheck
  if (hasScript("typecheck")) {
    try {
      const result = await runPnpm(["run", "typecheck"], {
        timeoutMs: 120000,
      });
      report.typecheck = {
        status: result.status,
        exitCode: result.exitCode,
        durationMs: result.durationMs,
        tail: result.tail,
      };
    } catch {
      report.typecheck = {
        status: "ERROR",
        exitCode: -1,
        durationMs: 0,
        tail: "Execution failed",
      };
    }
  } else {
    report.typecheck = {
      status: "MISSING",
      exitCode: -1,
      durationMs: 0,
      tail: "Script not found",
    };
  }

  // 5. ESLint
  if (hasDep("eslint") || hasEslintConfig()) {
    try {
      const result = await runPnpm(
        ["exec", "eslint", ".", "--max-warnings=0", "-f", "unix"],
        { timeoutMs: 120000 }
      );
      const warningsCount =
        (result.stdout + result.stderr).toLowerCase().split("warning").length -
        1;
      report.eslint = {
        status: result.status,
        exitCode: result.exitCode,
        durationMs: result.durationMs,
        warningsCount: Math.max(0, warningsCount),
        tail: result.tail,
      };
    } catch {
      report.eslint = {
        status: "ERROR",
        exitCode: -1,
        durationMs: 0,
        warningsCount: 0,
        tail: "Execution failed",
      };
    }
  } else {
    report.eslint = {
      status: "SKIPPED",
      exitCode: -1,
      durationMs: 0,
      warningsCount: 0,
      tail: "Not configured",
    };
  }

  // 6. Build
  if (hasDep("next")) {
    try {
      const result = await runPnpm(["exec", "next", "build"], {
        env: { NEXT_TELEMETRY_DISABLED: "1" },
        timeoutMs: 300000,
      });
      const warningsCount =
        (result.stdout + result.stderr).split("Warning:").length - 1;
      report.build = {
        status: result.status,
        exitCode: result.exitCode,
        durationMs: result.durationMs,
        warningsCount: Math.max(0, warningsCount),
        tail: result.tail,
      };
    } catch {
      report.build = {
        status: "ERROR",
        exitCode: -1,
        durationMs: 0,
        warningsCount: 0,
        tail: "Execution failed",
      };
    }
  } else {
    report.build = {
      status: "SKIPPED",
      exitCode: -1,
      durationMs: 0,
      warningsCount: 0,
      tail: "Next.js not found",
    };
  }

  // 7. MCP
  if (hasScript("diag:mcp")) {
    try {
      const result = await runPnpm(["run", "diag:mcp"], {
        timeoutMs: 120000,
      });
      try {
        const mcpData = JSON.parse(result.stdout);
        report.mcp = {
          status: mcpData.summary?.status || "OK",
          exitCode: result.exitCode,
          durationMs: result.durationMs,
          data: mcpData,
          tail: result.tail,
        };
      } catch {
        report.mcp = {
          status: "UNKNOWN_FORMAT",
          exitCode: result.exitCode,
          durationMs: result.durationMs,
          rawTail: result.tail,
        };
      }
    } catch {
      report.mcp = {
        status: "ERROR",
        exitCode: -1,
        durationMs: 0,
        rawTail: "Execution failed",
      };
    }
  } else {
    report.mcp = {
      status: "MISSING",
      exitCode: -1,
      durationMs: 0,
      rawTail: "Script not found",
    };
  }

  // 8. Environment Variables
  const envFiles = [".env", ".env.local", ".env.production"];
  const envVars = {};

  for (const envFile of envFiles) {
    if (fileExists(envFile)) {
      try {
        const content = readFileSync(envFile, "utf8");
        const keys = content
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line && !line.startsWith("#"))
          .map((line) => line.split("=")[0])
          .filter((key) => key && /^[A-Z0-9_]+$/.test(key));

        envVars[envFile] = keys;

        // Check for important keys
        if (keys.includes("NEXT_PUBLIC_SITE_URL")) {
          envVars.hasNextPublicSiteUrl = true;
        }
        if (content.includes("DATABASE_URL")) {
          envVars.hasDatabaseUrl = true;
        }
      } catch {
        envVars[envFile] = ["ERROR_READING_FILE"];
      }
    }
  }
  report.envVars = envVars;

  // 9. Summary
  let summaryStatus = "OK";

  if (report.typecheck.status === "FAIL" || report.build.status === "FAIL") {
    summaryStatus = "FAIL";
  } else if (
    (report.build.status === "OK" && report.build.warningsCount > 0) ||
    (report.eslint.status === "OK" && report.eslint.warningsCount > 0) ||
    (report.mcp.status !== "OK" && report.mcp.status !== "MISSING")
  ) {
    summaryStatus = "WARN";
  }

  report.summary = {
    status: summaryStatus,
    timestamp: new Date().toISOString(),
    totalDurationMs: Object.values(report)
      .filter((item) => item.durationMs && typeof item.durationMs === "number")
      .reduce((sum, item) => sum + item.durationMs, 0),
  };

  // Output JSON
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error("Ops health check failed:", error);
  process.exit(1);
});
