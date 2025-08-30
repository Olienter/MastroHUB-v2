#!/usr/bin/env node

/**
 * CI/CD Pipeline for MastroHUB v2
 * Automates testing, quality checks, and deployment preparation
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

class CIPipeline {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      stage: "initialized",
      status: "running",
      checks: {},
      errors: [],
      warnings: [],
    };
  }

  async runPipeline() {
    try {
      console.log("🚀 Starting CI/CD Pipeline...\n");

      // Stage 1: Code Quality
      await this.runCodeQualityChecks();

      // Stage 2: Testing
      await this.runTests();

      // Stage 3: Build
      await this.runBuild();

      // Stage 4: Quality Gates
      await this.runQualityGates();

      // Stage 5: AI Consistency
      await this.runAIConsistency();

      // Stage 6: Generate Report
      await this.generateReport();

      this.results.status = "completed";
      console.log("\n🎉 CI/CD Pipeline completed successfully!");
      return this.results;
    } catch (error) {
      this.results.status = "failed";
      this.results.errors.push(error.message);
      console.error(`❌ CI/CD Pipeline failed: ${error.message}`);
      process.exit(1);
    }
  }

  async runCodeQualityChecks() {
    console.log("📝 Stage 1: Code Quality Checks...");
    this.results.stage = "code_quality";

    try {
      // ESLint
      execSync("pnpm run lint", { stdio: "pipe" });
      this.results.checks.eslint = {
        status: "pass",
        timestamp: new Date().toISOString(),
      };
      console.log("✅ ESLint: PASS");
    } catch (error) {
      this.results.checks.eslint = { status: "fail", error: error.message };
      this.results.errors.push(`ESLint failed: ${error.message}`);
      console.log("❌ ESLint: FAIL");
    }

    try {
      // TypeScript
      execSync("pnpm run typecheck", { stdio: "pipe" });
      this.results.checks.typescript = {
        status: "pass",
        timestamp: new Date().toISOString(),
      };
      console.log("✅ TypeScript: PASS");
    } catch (error) {
      this.results.checks.typescript = { status: "fail", error: error.message };
      this.results.errors.push(`TypeScript failed: ${error.message}`);
      console.log("❌ TypeScript: FAIL");
    }
  }

  async runTests() {
    console.log("\n🧪 Stage 2: Running Tests...");
    this.results.stage = "testing";

    try {
      // Unit tests
      execSync("pnpm run test:unit", { stdio: "pipe" });
      this.results.checks.unit_tests = {
        status: "pass",
        timestamp: new Date().toISOString(),
      };
      console.log("✅ Unit Tests: PASS");
    } catch (error) {
      this.results.checks.unit_tests = { status: "fail", error: error.message };
      this.results.warnings.push(`Unit tests failed: ${error.message}`);
      console.log("⚠️ Unit Tests: FAIL");
    }

    try {
      // UI tests
      execSync("pnpm run test:ui:ci", { stdio: "pipe" });
      this.results.checks.ui_tests = {
        status: "pass",
        timestamp: new Date().toISOString(),
      };
      console.log("✅ UI Tests: PASS");
    } catch (error) {
      this.results.checks.ui_tests = { status: "fail", error: error.message };
      this.results.warnings.push(`UI tests failed: ${error.message}`);
      console.log("⚠️ UI Tests: FAIL");
    }
  }

  async runBuild() {
    console.log("\n🔨 Stage 3: Building Project...");
    this.results.stage = "building";

    try {
      execSync("pnpm run build", { stdio: "pipe" });
      this.results.checks.build = {
        status: "pass",
        timestamp: new Date().toISOString(),
      };
      console.log("✅ Build: PASS");
    } catch (error) {
      this.results.checks.build = { status: "fail", error: error.message };
      this.results.errors.push(`Build failed: ${error.message}`);
      console.log("❌ Build: FAIL");
      throw error; // Stop pipeline if build fails
    }
  }

  async runQualityGates() {
    console.log("\n🚪 Stage 4: Quality Gates...");
    this.results.stage = "quality_gates";

    try {
      execSync("pnpm run quality:gate", { stdio: "pipe" });
      this.results.checks.quality_gates = {
        status: "pass",
        timestamp: new Date().toISOString(),
      };
      console.log("✅ Quality Gates: PASS");
    } catch (error) {
      this.results.checks.quality_gates = {
        status: "fail",
        error: error.message,
      };
      this.results.warnings.push(`Quality gates failed: ${error.message}`);
      console.log("⚠️ Quality Gates: FAIL");
    }
  }

  async runAIConsistency() {
    console.log("\n🤖 Stage 5: AI Consistency...");
    this.results.stage = "ai_consistency";

    try {
      execSync("pnpm run ai:consistency", { stdio: "pipe" });
      this.results.checks.ai_consistency = {
        status: "pass",
        timestamp: new Date().toISOString(),
      };
      console.log("✅ AI Consistency: PASS");
    } catch (error) {
      this.results.checks.ai_consistency = {
        status: "fail",
        error: error.message,
      };
      this.results.warnings.push(`AI consistency failed: ${error.message}`);
      console.log("⚠️ AI Consistency: FAIL");
    }
  }

  async generateReport() {
    console.log("\n📊 Stage 6: Generating CI/CD Report...");
    this.results.stage = "reporting";

    // Calculate overall status
    const errorCount = this.results.errors.length;
    const warningCount = this.results.warnings.length;

    if (errorCount > 0) {
      this.results.status = "failed";
    } else if (warningCount > 0) {
      this.results.status = "warning";
    } else {
      this.results.status = "success";
    }

    // Save report
    const reportPath = join(process.cwd(), ".ai", "ci-pipeline-report.json");
    writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`📄 CI/CD Report saved to: ${reportPath}`);

    // Update manifest
    await this.updateManifest();
  }

  async updateManifest() {
    try {
      const manifestPath = ".ai/manifest.json";
      if (existsSync(manifestPath)) {
        const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

        manifest.ci_cd = {
          last_run: this.results.timestamp,
          status: this.results.status,
          stage: this.results.stage,
          errors_count: this.results.errors.length,
          warnings_count: this.results.warnings.length,
        };

        writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        console.log("✅ Manifest updated with CI/CD results");
      }
    } catch (error) {
      console.log("⚠️ Could not update manifest:", error.message);
    }
  }
}

// Run pipeline if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const pipeline = new CIPipeline();
  pipeline.runPipeline().catch((error) => {
    console.error(`❌ CI/CD Pipeline failed: ${error.message}`);
    process.exit(1);
  });
}

export default CIPipeline;
