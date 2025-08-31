#!/usr/bin/env node

/**
 * TALK v1 Format Validator
 * Automatically validates and enforces TALK v1 compliance
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

class TALKv1Validator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      overall_score: 0,
      compliance: {},
      violations: [],
      recommendations: [],
    };
  }

  async validateAll() {
    console.log("🔍 TALK v1 Format Validation...\n");

    // Validate TALK v1 format compliance
    await this.validateFormatCompliance();

    // Validate evidence system
    await this.validateEvidenceSystem();

    // Validate decision tracking
    await this.validateDecisionTracking();

    // Validate automation readiness
    await this.validateAutomationReadiness();

    // Generate compliance report
    await this.generateComplianceReport();

    return this.results;
  }

  async validateFormatCompliance() {
    console.log("📝 Validating TALK v1 Format...");

    try {
      // Check if main page has TALK v1 format
      const mainPage = readFileSync("app/(public)/page.tsx", "utf8");
      
      // Check for TALK v1 indicators
      const hasTalkV1 = mainPage.includes("TALK v1") || 
                        mainPage.includes("## 🎯 CIEĽ") ||
                        mainPage.includes("## IMPACT_MAP");

      if (hasTalkV1) {
        this.results.compliance.format = { status: "pass", score: 10 };
        console.log("✅ TALK v1 Format: PASS");
      } else {
        this.results.compliance.format = { status: "fail", score: 0 };
        console.log("❌ TALK v1 Format: FAIL");
        this.results.violations.push("Main page missing TALK v1 format");
        this.results.recommendations.push("Add TALK v1 format to main page");
      }
    } catch (error) {
      this.results.compliance.format = { status: "error", score: 0, error: error.message };
      console.log("❌ TALK v1 Format: ERROR");
    }
  }

  async validateEvidenceSystem() {
    console.log("\n📋 Validating Evidence System...");

    try {
      const checksDir = ".ai/checks";
      const requiredFiles = [
        "HF-VERIF-FIX-001.txt",
        "HF-TALK-V1-IMPLEMENTATION-001.txt"
      ];

      let existingFiles = 0;
      for (const file of requiredFiles) {
        if (existsSync(join(checksDir, file))) {
          existingFiles++;
        }
      }

      const score = Math.round((existingFiles / requiredFiles.length) * 10);
      
      if (score >= 8) {
        this.results.compliance.evidence = { status: "pass", score };
        console.log(`✅ Evidence System: PASS (${score}/10)`);
      } else if (score >= 5) {
        this.results.compliance.evidence = { status: "partial", score };
        console.log(`⚠️ Evidence System: PARTIAL (${score}/10)`);
        this.results.recommendations.push("Complete missing evidence files");
      } else {
        this.results.compliance.evidence = { status: "fail", score };
        console.log(`❌ Evidence System: FAIL (${score}/10)`);
        this.results.violations.push("Incomplete evidence system");
        this.results.recommendations.push("Create all required evidence files");
      }
    } catch (error) {
      this.results.compliance.evidence = { status: "error", score: 0, error: error.message };
      console.log("❌ Evidence System: ERROR");
    }
  }

  async validateDecisionTracking() {
    console.log("\n📊 Validating Decision Tracking...");

    try {
      const decisionsFile = ".ai/decisions/current-decisions.json";
      
      if (existsSync(decisionsFile)) {
        const decisions = JSON.parse(readFileSync(decisionsFile, "utf8"));
        
        if (decisions.decisions && decisions.decisions.length > 0) {
          this.results.compliance.decisions = { status: "pass", score: 10 };
          console.log("✅ Decision Tracking: PASS");
        } else {
          this.results.compliance.decisions = { status: "partial", score: 5 };
          console.log("⚠️ Decision Tracking: PARTIAL");
          this.results.recommendations.push("Add more decision entries");
        }
      } else {
        this.results.compliance.decisions = { status: "fail", score: 0 };
        console.log("❌ Decision Tracking: FAIL");
        this.results.violations.push("Decision tracking file missing");
        this.results.recommendations.push("Create decision tracking file");
      }
    } catch (error) {
      this.results.compliance.decisions = { status: "error", score: 0, error: error.message };
      console.log("❌ Decision Tracking: ERROR");
    }
  }

  async validateAutomationReadiness() {
    console.log("\n🤖 Validating Automation Readiness...");

    try {
      // Check if all required scripts exist
      const requiredScripts = [
        "scripts/ai-consistency-check.mjs",
        "scripts/quality-gate.mjs",
        "scripts/talk-v1-validator.mjs"
      ];

      let existingScripts = 0;
      for (const script of requiredScripts) {
        if (existsSync(script)) {
          existingScripts++;
        }
      }

      const score = Math.round((existingScripts / requiredScripts.length) * 10);
      
      if (score >= 8) {
        this.results.compliance.automation = { status: "pass", score };
        console.log(`✅ Automation Readiness: PASS (${score}/10)`);
      } else if (score >= 5) {
        this.results.compliance.automation = { status: "partial", score };
        console.log(`⚠️ Automation Readiness: PARTIAL (${score}/10)`);
        this.results.recommendations.push("Complete automation scripts");
      } else {
        this.results.compliance.automation = { status: "fail", score };
        console.log(`❌ Automation Readiness: FAIL (${score}/10)`);
        this.results.violations.push("Incomplete automation setup");
        this.results.recommendations.push("Create all required automation scripts");
      }
    } catch (error) {
      this.results.compliance.automation = { status: "error", score: 0, error: error.message };
      console.log("❌ Automation Readiness: ERROR");
    }
  }

  async generateComplianceReport() {
    console.log("\n📊 Generating Compliance Report...");

    // Calculate overall score
    const scores = Object.values(this.results.compliance).map(c => c.score || 0);
    this.results.overall_score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    // Save report
    const reportPath = ".ai/talk-v1-compliance-report.json";
    writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    console.log(`\n============================================================`);
    console.log(`TALK V1 COMPLIANCE REPORT`);
    console.log(`============================================================`);
    console.log(`Overall Score: ${this.results.overall_score}%`);
    console.log(`Timestamp: ${this.results.timestamp}`);
    console.log(`============================================================`);

    Object.entries(this.results.compliance).forEach(([key, value]) => {
      const status = value.status.toUpperCase();
      const score = value.score || 0;
      console.log(`${key.toUpperCase()}: ${status} (${score}/10)`);
    });

    if (this.results.violations.length > 0) {
      console.log(`\n🚨 VIOLATIONS:`);
      this.results.violations.forEach(violation => {
        console.log(`- ${violation}`);
      });
    }

    if (this.results.recommendations.length > 0) {
      console.log(`\n🔧 RECOMMENDATIONS:`);
      this.results.recommendations.forEach(rec => {
        console.log(`- ${rec}`);
      });
    }

    console.log(`\n📄 Report saved to: ${reportPath}`);
  }
}

// Run validation if called directly
if (process.argv[1] && process.argv[1].includes('talk-v1-validator.mjs')) {
  const validator = new TALKv1Validator();
  validator.validateAll().catch(console.error);
}

export default TALKv1Validator;
