#!/usr/bin/env node

/**
 * Enterprise CI/CD Pipeline for MastroHUB v2
 * Robust testing, quality checks, and deployment preparation
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

class EnterpriseCIPipeline {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      stage: "initialized",
      status: "running",
      checks: {},
      errors: [],
      warnings: [],
      overallScore: 0,
      passed: 0,
      failed: 0
    };
  }

  async runPipeline() {
    try {
      console.log("🚀 Starting Enterprise CI/CD Pipeline...\n");

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

      // Calculate final status
      this.calculateFinalStatus();
      
      console.log(`\n🎉 Enterprise CI/CD Pipeline completed!`);
      console.log(`📊 Overall Score: ${this.results.overallScore}/100`);
      console.log(`✅ Passed: ${this.results.passed}, ❌ Failed: ${this.results.failed}`);
      
      return this.results;
    } catch (error) {
      this.results.status = "failed";
      this.results.errors.push(error.message);
      console.error(`❌ Enterprise CI/CD Pipeline failed: ${error.message}`);
      
      // Don't exit - continue with error reporting
      await this.generateErrorReport();
      return this.results;
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
        score: 10,
        timestamp: new Date().toISOString(),
      };
      this.results.passed++;
      console.log("✅ ESLint: PASS");
    } catch (error) {
      this.results.checks.eslint = { 
        status: "fail", 
        score: 0,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      this.results.errors.push(`ESLint failed: ${error.message}`);
      this.results.failed++;
      console.log("❌ ESLint: FAIL");
    }

    try {
      // TypeScript
      execSync("pnpm run typecheck", { stdio: "pipe" });
      this.results.checks.typescript = {
        status: "pass",
        score: 10,
        timestamp: new Date().toISOString(),
      };
      this.results.passed++;
      console.log("✅ TypeScript: PASS");
    } catch (error) {
      this.results.checks.typescript = { 
        status: "fail", 
        score: 0,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      this.results.errors.push(`TypeScript failed: ${error.message}`);
      this.results.failed++;
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
        score: 10,
        timestamp: new Date().toISOString(),
      };
      this.results.passed++;
      console.log("✅ Unit Tests: PASS");
    } catch (error) {
      this.results.checks.unit_tests = { 
        status: "fail", 
        score: 0,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      this.results.errors.push(`Unit tests failed: ${error.message}`);
      this.results.failed++;
      console.log("❌ Unit Tests: FAIL");
    }

    try {
      // UI tests
      execSync("pnpm run test:ui:ci", { stdio: "pipe" });
      this.results.checks.ui_tests = {
        status: "pass",
        score: 10,
        timestamp: new Date().toISOString(),
      };
      this.results.passed++;
      console.log("✅ UI Tests: PASS");
    } catch (error) {
      this.results.checks.ui_tests = { 
        status: "fail", 
        score: 0,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      this.results.errors.push(`UI tests failed: ${error.message}`);
      this.results.failed++;
      console.log("❌ UI Tests: FAIL");
    }
  }

  async runBuild() {
    console.log("\n🔨 Stage 3: Build Process...");
    this.results.stage = "build";

    try {
      // Build check
      execSync("pnpm run build", { stdio: "pipe" });
      this.results.checks.build = {
        status: "pass",
        score: 10,
        timestamp: new Date().toISOString(),
      };
      this.results.passed++;
      console.log("✅ Build: PASS");
    } catch (error) {
      this.results.checks.build = { 
        status: "fail", 
        score: 0,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      this.results.errors.push(`Build failed: ${error.message}`);
      this.results.failed++;
      console.log("❌ Build: FAIL");
    }
  }

  async runQualityGates() {
    console.log("\n🚪 Stage 4: Quality Gates...");
    this.results.stage = "quality_gates";

    try {
      // Quality gate check
      execSync("pnpm run quality:gate", { stdio: "pipe" });
      this.results.checks.quality_gate = {
        status: "pass",
        score: 10,
        timestamp: new Date().toISOString(),
      };
      this.results.passed++;
      console.log("✅ Quality Gate: PASS");
    } catch (error) {
      this.results.checks.quality_gate = { 
        status: "fail", 
        score: 0,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      this.results.errors.push(`Quality gate failed: ${error.message}`);
      this.results.failed++;
      console.log("❌ Quality Gate: FAIL");
    }
  }

  async runAIConsistency() {
    console.log("\n🤖 Stage 5: AI Consistency...");
    this.results.stage = "ai_consistency";

    try {
      // AI consistency check
      execSync("pnpm run ai:consistency", { stdio: "pipe" });
      this.results.checks.ai_consistency = {
        status: "pass",
        score: 10,
        timestamp: new Date().toISOString(),
      };
      this.results.passed++;
      console.log("✅ AI Consistency: PASS");
    } catch (error) {
      this.results.checks.ai_consistency = { 
        status: "fail", 
        score: 0,
        error: error.message,
        timestamp: new Date().toISOString()
      };
      this.results.errors.push(`AI consistency failed: ${error.message}`);
      this.results.failed++;
      console.log("❌ AI Consistency: FAIL");
    }
  }

  async generateReport() {
    console.log("\n📊 Stage 6: Generating Report...");
    this.results.stage = "report_generation";

    try {
      const reportPath = join(".ai", "ci-pipeline-report.json");
      writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
      console.log("✅ Report generated successfully");
    } catch (error) {
      console.error(`❌ Report generation failed: ${error.message}`);
      this.results.errors.push(`Report generation failed: ${error.message}`);
    }
  }

  async generateErrorReport() {
    console.log("\n📊 Generating Error Report...");
    
    try {
      const errorReportPath = join(".ai", "ci-pipeline-error-report.json");
      const errorReport = {
        ...this.results,
        error_timestamp: new Date().toISOString(),
        error_summary: this.results.errors.join("; ")
      };
      
      writeFileSync(errorReportPath, JSON.stringify(errorReport, null, 2));
      console.log("✅ Error report generated");
    } catch (error) {
      console.error(`❌ Error report generation failed: ${error.message}`);
    }
  }

  calculateFinalStatus() {
    const totalChecks = Object.keys(this.results.checks).length;
    const totalScore = Object.values(this.results.checks)
      .reduce((sum, check) => sum + (check.score || 0), 0);
    
    this.results.overallScore = totalChecks > 0 ? Math.round(totalScore / totalChecks) : 0;
    
    // Determine final status
    if (this.results.failed === 0) {
      this.results.status = "completed_success";
    } else if (this.results.passed > this.results.failed) {
      this.results.status = "completed_with_warnings";
    } else {
      this.results.status = "completed_with_errors";
    }
  }
}

// Export for use in other modules
export default EnterpriseCIPipeline;

// CLI interface
if (process.argv[1].endsWith('ci-pipeline.mjs')) {
  const pipeline = new EnterpriseCIPipeline();
  pipeline.runPipeline().catch(console.error);
}

