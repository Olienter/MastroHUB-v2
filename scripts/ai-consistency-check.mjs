#!/usr/bin/env node

/**
 * AI Consistency Check Script
 * Validates TALK v1 format compliance and AI decision tracking
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

class AIConsistencyChecker {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      overall_score: 0,
      checks: {},
      violations: [],
      recommendations: [],
    };
  }

  async runAllChecks() {
    console.log("🤖 Starting AI Consistency Checks...\n");

    // Check TALK v1 format compliance
    await this.checkTalkV1Format();

    // Check AI decision tracking
    await this.checkDecisionTracking();

    // Check manifest consistency
    await this.checkManifestConsistency();

    // Check framework implementation
    await this.checkFrameworkImplementation();

    // Generate report
    await this.generateReport();

    return this.results;
  }

  async checkTalkV1Format() {
    console.log("📝 Checking TALK v1 Format Compliance...");

    try {
      // Check main page for TALK v1 format
      const mainPage = readFileSync("app/(public)/page.tsx", "utf8");

      if (mainPage.includes("TALK v1") || mainPage.includes("## 🎯 CIEĽ")) {
        this.results.checks.talk_v1_format = { status: "pass", score: 10 };
        console.log("✅ TALK v1 Format: PASS");
      } else {
        this.results.checks.talk_v1_format = { status: "fail", score: 0 };
        console.log("❌ TALK v1 Format: FAIL");
        this.results.violations.push("Main page missing TALK v1 format");
        this.results.recommendations.push(
          "Ensure all AI interactions follow TALK v1 format"
        );
      }
    } catch (error) {
      this.results.checks.talk_v1_format = {
        status: "error",
        score: 0,
        errors: error.message,
      };
      console.log("❌ TALK v1 Format: ERROR");
    }
  }

  async checkDecisionTracking() {
    console.log("\n📊 Checking AI Decision Tracking...");

    try {
      const decisionsDir = ".ai/decisions";

      if (existsSync(decisionsDir)) {
        const decisionFiles = readdirSync(decisionsDir).filter((file) =>
          file.endsWith(".json")
        );

        if (decisionFiles.length > 0) {
          // Check latest decision file
          const latestDecision = readdirSync(decisionsDir)
            .filter((file) => file.endsWith(".json"))
            .sort()
            .pop();

          if (latestDecision) {
            const decisionContent = readFileSync(
              join(decisionsDir, latestDecision),
              "utf8"
            );
            const decision = JSON.parse(decisionContent);

            if (decision.decisions && decision.decisions.length > 0) {
              this.results.checks.decision_tracking = {
                status: "pass",
                score: 10,
              };
              console.log("✅ Decision Tracking: PASS");
              console.log(
                `   Latest decision: ${
                  decision.decisions[decision.decisions.length - 1].decision
                }`
              );
            } else {
              this.results.checks.decision_tracking = {
                status: "partial",
                score: 5,
              };
              console.log("⚠️ Decision Tracking: PARTIAL");
              this.results.recommendations.push(
                "Enhance decision tracking with more detailed information"
              );
            }
          }
        } else {
          this.results.checks.decision_tracking = { status: "fail", score: 0 };
          console.log("❌ Decision Tracking: FAIL");
          this.results.violations.push("No decision files found");
          this.results.recommendations.push(
            "Create decision tracking files for all AI interactions"
          );
        }
      } else {
        this.results.checks.decision_tracking = { status: "fail", score: 0 };
        console.log("❌ Decision Tracking: FAIL");
        this.results.violations.push("Decisions directory not found");
        this.results.recommendations.push(
          "Create .ai/decisions directory structure"
        );
      }
    } catch (error) {
      this.results.checks.decision_tracking = {
        status: "error",
        score: 0,
        errors: error.message,
      };
      console.log("❌ Decision Tracking: ERROR");
    }
  }

  async checkManifestConsistency() {
    console.log("\n📋 Checking Manifest Consistency...");

    try {
      const manifestPath = ".ai/manifest.json";

      if (existsSync(manifestPath)) {
        const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

        if (manifest.quality_gates && manifest.improvement_areas) {
          this.results.checks.manifest_consistency = {
            status: "pass",
            score: 10,
          };
          console.log("✅ Manifest Consistency: PASS");
        } else {
          this.results.checks.manifest_consistency = {
            status: "partial",
            score: 5,
          };
          console.log("⚠️ Manifest Consistency: PARTIAL");
          this.results.recommendations.push(
            "Enhance manifest with quality gates and improvement areas"
          );
        }
      } else {
        this.results.checks.manifest_consistency = { status: "fail", score: 0 };
        console.log("❌ Manifest Consistency: FAIL");
        this.results.violations.push("Manifest file not found");
        this.results.recommendations.push(
          "Create comprehensive AI manifest file"
        );
      }
    } catch (error) {
      this.results.checks.manifest_consistency = {
        status: "error",
        score: 0,
        errors: error.message,
      };
      console.log("❌ Manifest Consistency: ERROR");
    }
  }

  async checkFrameworkImplementation() {
    console.log("\n🔧 Checking Framework Implementation...");

    try {
      const frameworkPath = ".ai/framework/assistant-consistency.md";

      if (existsSync(frameworkPath)) {
        const framework = readFileSync(frameworkPath, "utf8");

        if (
          framework.includes("TALK v1 Format") &&
          framework.includes("Tool Call Protocol")
        ) {
          this.results.checks.framework_implementation = {
            status: "pass",
            score: 10,
          };
          console.log("✅ Framework Implementation: PASS");
        } else {
          this.results.checks.framework_implementation = {
            status: "partial",
            score: 5,
          };
          console.log("⚠️ Framework Implementation: PARTIAL");
          this.results.recommendations.push(
            "Enhance framework with complete implementation guidelines"
          );
        }
      } else {
        this.results.checks.framework_implementation = {
          status: "fail",
          score: 0,
        };
        console.log("❌ Framework Implementation: FAIL");
        this.results.violations.push("Framework file not found");
        this.results.recommendations.push(
          "Create comprehensive AI consistency framework"
        );
      }
    } catch (error) {
      this.results.checks.framework_implementation = {
        status: "error",
        score: 0,
        errors: error.message,
      };
      console.log("❌ Framework Implementation: ERROR");
    }
  }

  async generateReport() {
    console.log("\n📊 Generating AI Consistency Report...\n");

    // Calculate overall score
    const totalScore = Object.values(this.results.checks).reduce(
      (sum, check) => sum + check.score,
      0
    );
    const maxScore = Object.keys(this.results.checks).length * 10;
    this.results.overall_score = Math.round((totalScore / maxScore) * 100);

    // Display results
    console.log("=".repeat(60));
    console.log("AI CONSISTENCY CHECK RESULTS");
    console.log("=".repeat(60));
    console.log(`Overall Score: ${this.results.overall_score}%`);
    console.log(`Timestamp: ${this.results.timestamp}`);
    console.log("=".repeat(60));

    Object.entries(this.results.checks).forEach(([check, result]) => {
      const status = result.status.toUpperCase();
      const score = result.score;
      console.log(
        `${check.replace(/_/g, " ").toUpperCase()}: ${status} (${score}/10)`
      );
    });

    if (this.results.violations.length > 0) {
      console.log("\n🚨 VIOLATIONS:");
      this.results.violations.forEach((violation, index) => {
        console.log(`${index + 1}. ${violation}`);
      });
    }

    if (this.results.recommendations.length > 0) {
      console.log("\n🔧 RECOMMENDATIONS:");
      this.results.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }

    // Save results to file
    const reportPath = join(process.cwd(), ".ai", "ai-consistency-report.json");
    const fs = await import("fs");
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Report saved to: ${reportPath}`);

    // Update manifest
    await this.updateManifest();
  }

  async updateManifest() {
    try {
      const manifestPath = ".ai/manifest.json";
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

      manifest.ai_consistency = {
        last_check: this.results.timestamp,
        overall_score: this.results.overall_score,
        violations_count: this.results.violations.length,
        recommendations_count: this.results.recommendations.length,
      };

      const fs = await import("fs");
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log("✅ Manifest updated with AI consistency results");
    } catch (error) {
      console.log("⚠️ Could not update manifest:", error.message);
    }
  }
}

// Run consistency check if called directly
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  const checker = new AIConsistencyChecker();
  checker.runAllChecks().catch((error) => {
    console.error(`❌ AI consistency check failed: ${error.message}`);
    process.exit(1);
  });
}

export default AIConsistencyChecker;
