#!/usr/bin/env node

/**
 * Safe CI Pipeline Wrapper for MastroHUB v2
 * Prevents hanging and provides robust error handling
 */

import { spawn } from "child_process";
import { writeFileSync } from "fs";
import { join } from "path";

class SafeCIPipeline {
  constructor() {
    this.timeout = 300000; // 5 minutes
    this.results = {
      timestamp: new Date().toISOString(),
      status: "running",
      output: "",
      error: null,
      exitCode: null,
    };
  }

  async runPipeline() {
    console.log("🚀 Starting Safe CI Pipeline...");

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.log("⏰ Pipeline timeout - killing process");
        this.results.status = "timeout";
        this.results.error = "Pipeline exceeded 5 minute timeout";
        this.saveResults();
        reject(new Error("Pipeline timeout"));
      }, this.timeout);

      const pipeline = spawn("node", ["scripts/ci-pipeline.mjs"], {
        stdio: ["pipe", "pipe", "pipe"],
        cwd: process.cwd(),
      });

      let output = "";
      let errorOutput = "";

      pipeline.stdout.on("data", (data) => {
        const text = data.toString();
        output += text;
        console.log(text.trim());
      });

      pipeline.stderr.on("data", (data) => {
        const text = data.toString();
        errorOutput += text;
        console.error(text.trim());
      });

      pipeline.on("close", (code) => {
        clearTimeout(timeout);

        this.results.status = code === 0 ? "completed" : "failed";
        this.results.exitCode = code;
        this.results.output = output;
        this.results.error = errorOutput || null;

        console.log(
          `\n🎯 Pipeline ${this.results.status} with exit code: ${code}`
        );

        this.saveResults();
        resolve(this.results);
      });

      pipeline.on("error", (err) => {
        clearTimeout(timeout);
        this.results.status = "error";
        this.results.error = err.message;
        this.saveResults();
        reject(err);
      });
    });
  }

  saveResults() {
    try {
      const reportPath = join(".ai", "safe-ci-pipeline-report.json");
      writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
      console.log(`📄 Safe CI Report saved to: ${reportPath}`);
    } catch (error) {
      console.error("❌ Failed to save report:", error.message);
    }
  }
}

// CLI interface
if (process.argv[1].endsWith("ci-pipeline-safe.mjs")) {
  const safePipeline = new SafeCIPipeline();
  safePipeline
    .runPipeline()
    .then(() => console.log("✅ Safe CI Pipeline completed"))
    .catch((error) =>
      console.error("❌ Safe CI Pipeline failed:", error.message)
    );
}

export default SafeCIPipeline;
