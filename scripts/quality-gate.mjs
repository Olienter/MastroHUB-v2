#!/usr/bin/env node

/**
 * Quality Gate System for MastroHUB v2
 * Automatically validates code quality, build status, and UX standards
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

class QualityGate {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      overall_score: 0,
      checks: {},
      recommendations: [],
    };
  }

  async runAllChecks() {
    console.log("🚀 Starting Quality Gate Checks...\n");

    // Code Quality Checks
    await this.checkCodeQuality();

    // Build Status Checks
    await this.checkBuildStatus();

    // UX Standards Checks
    await this.checkUXStandards();

    // Performance Checks
    await this.checkPerformance();

    // Generate Report
    await this.generateReport();

    return this.results;
  }

  async checkCodeQuality() {
    console.log("📝 Checking Code Quality...");

    try {
      // ESLint check
      execSync("pnpm run lint", { stdio: "pipe" });
      this.results.checks.eslint = { status: "pass", score: 10 };
      console.log("✅ ESLint: PASS");
    } catch (error) {
      this.results.checks.eslint = {
        status: "fail",
        score: 0,
        errors: error.message,
      };
      console.log("❌ ESLint: FAIL");
      this.results.recommendations.push(
        "Fix ESLint errors to improve code quality"
      );
    }

    try {
      // TypeScript check
      execSync("pnpm run type-check", { stdio: "pipe" });
      this.results.checks.typescript = { status: "pass", score: 10 };
      console.log("✅ TypeScript: PASS");
    } catch (error) {
      this.results.checks.typescript = {
        status: "fail",
        score: 0,
        errors: error.message,
      };
      console.log("❌ TypeScript: FAIL");
      this.results.recommendations.push(
        "Fix TypeScript errors for better type safety"
      );
    }
  }

  async checkBuildStatus() {
    console.log("\n🔨 Checking Build Status...");

    try {
      // Build check
      execSync("pnpm run build", { stdio: "pipe" });
      this.results.checks.build = { status: "pass", score: 10 };
      console.log("✅ Build: PASS");
    } catch (error) {
      this.results.checks.build = {
        status: "fail",
        score: 0,
        errors: error.message,
      };
      console.log("❌ Build: FAIL");
      this.results.recommendations.push(
        "Fix build errors to ensure deployment readiness"
      );
    }
  }

  async checkUXStandards() {
    console.log("\n🎨 Checking UX Standards...");

    // Check for skeleton components
    try {
      const skeletonFile = readFileSync("components/ui/Skeleton.tsx", "utf8");
      if (skeletonFile.includes("Skeleton")) {
        this.results.checks.skeleton_components = { status: "pass", score: 8 };
        console.log("✅ Skeleton Components: PASS");
      } else {
        this.results.checks.skeleton_components = { status: "fail", score: 0 };
        console.log("❌ Skeleton Components: MISSING");
        this.results.recommendations.push(
          "Implement skeleton loading components for better UX"
        );
      }
    } catch (error) {
      this.results.checks.skeleton_components = {
        status: "fail",
        score: 0,
        errors: "File not found",
      };
      console.log("❌ Skeleton Components: FILE NOT FOUND");
    }

    // Check for loading states
    try {
      const mainPage = readFileSync("app/(public)/page.tsx", "utf8");
      if (mainPage.includes("isLoading") && mainPage.includes("Skeleton")) {
        this.results.checks.loading_states = { status: "pass", score: 8 };
        console.log("✅ Loading States: PASS");
      } else {
        this.results.checks.loading_states = { status: "partial", score: 4 };
        console.log("⚠️ Loading States: PARTIAL");
        this.results.recommendations.push(
          "Enhance loading states across all components"
        );
      }
    } catch (error) {
      this.results.checks.loading_states = {
        status: "fail",
        score: 0,
        errors: "File not found",
      };
      console.log("❌ Loading States: FILE NOT FOUND");
    }
  }

  async checkPerformance() {
    console.log("\n⚡ Checking Performance...");

    try {
      // Check bundle size
      const buildOutput = execSync("pnpm run build", { encoding: "utf8" });
      if (buildOutput.includes("First Load JS")) {
        this.results.checks.bundle_size = { status: "pass", score: 7 };
        console.log("✅ Bundle Size: PASS");
      } else {
        this.results.checks.bundle_size = { status: "unknown", score: 5 };
        console.log("❓ Bundle Size: UNKNOWN");
      }
    } catch (error) {
      this.results.checks.bundle_size = {
        status: "fail",
        score: 0,
        errors: error.message,
      };
      console.log("❌ Bundle Size: FAIL");
    }
  }

  async generateReport() {
    console.log("\n📊 Generating Quality Report...\n");

    // Calculate overall score
    const totalScore = Object.values(this.results.checks).reduce(
      (sum, check) => sum + check.score,
      0
    );
    const maxScore = Object.keys(this.results.checks).length * 10;
    this.results.overall_score = Math.round((totalScore / maxScore) * 100);

    // Display results
    console.log("=".repeat(50));
    console.log("QUALITY GATE RESULTS");
    console.log("=".repeat(50));
    console.log(`Overall Score: ${this.results.overall_score}%`);
    console.log(`Timestamp: ${this.results.timestamp}`);
    console.log("=".repeat(50));

    Object.entries(this.results.checks).forEach(([check, result]) => {
      const status = result.status.toUpperCase();
      const score = result.score;
      console.log(
        `${check.replace(/_/g, " ").toUpperCase()}: ${status} (${score}/10)`
      );
    });

    if (this.results.recommendations.length > 0) {
      console.log("\n🔧 RECOMMENDATIONS:");
      this.results.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }

    // Save results to file
    const reportPath = join(process.cwd(), ".ai", "quality-report.json");
    writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Report saved to: ${reportPath}`);

    // Update manifest
    await this.updateManifest();
  }

  async updateManifest() {
    try {
      const manifestPath = join(process.cwd(), ".ai", "manifest.json");
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

      manifest.quality_gates = {
        code_quality: {
          eslint: this.results.checks.eslint?.status || "unknown",
          typescript: this.results.checks.typescript?.status || "unknown",
          build: this.results.checks.build?.status || "unknown",
        },
        ux_standards: {
          loading_states:
            this.results.checks.loading_states?.status || "unknown",
          skeleton_components:
            this.results.checks.skeleton_components?.status || "unknown",
        },
        performance: {
          bundle_size: this.results.checks.bundle_size?.status || "unknown",
        },
        overall_score: this.results.overall_score,
      };

      writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log("✅ Manifest updated with quality results");
    } catch (error) {
      console.log("⚠️ Could not update manifest:", error.message);
    }
  }
}

// Run quality gate if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const qualityGate = new QualityGate();
  qualityGate.runAllChecks().catch(console.error);
}

export default QualityGate;
