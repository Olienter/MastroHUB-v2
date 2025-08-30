#!/usr/bin/env node

/**
 * TALK v1 Core System for MastroHUB v2
 * Enterprise-grade evidence tracking and AI decision system
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

class TALKv1Core {
  constructor() {
    this.evidence = new Map();
    this.journal = [];
    this.qualityGates = new Map();
    this.config = {
      evidencePath: ".ai/checks",
      journalPath: ".ai/chronicle/journal.md",
      statePath: ".ai/state.json"
    };
  }

  /**
   * Track evidence with unique PID
   */
  async trackEvidence(pid, data) {
    try {
      const evidenceFile = join(this.config.evidencePath, `${pid}.json`);
      const evidenceData = {
        pid,
        timestamp: new Date().toISOString(),
        data,
        status: "tracked"
      };

      writeFileSync(evidenceFile, JSON.stringify(evidenceData, null, 2));
      this.evidence.set(pid, evidenceData);

      console.log(`📊 Evidence tracked: ${pid}`);
      return evidenceData;
    } catch (error) {
      console.error(`❌ Evidence tracking failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update journal with new entry
   */
  async updateJournal(message) {
    try {
      const timestamp = new Date().toISOString();
      const journalEntry = `\n- ${timestamp}: ${message}`;

      if (existsSync(this.config.journalPath)) {
        const currentJournal = readFileSync(this.config.journalPath, 'utf8');
        writeFileSync(this.config.journalPath, currentJournal + journalEntry);
      } else {
        writeFileSync(this.config.journalPath, `# MastroHUB Development Chronicle\n\n${journalEntry}`);
      }

      this.journal.push({ timestamp, message });
      console.log(`📝 Journal updated: ${message}`);
      return true;
    } catch (error) {
      console.error(`❌ Journal update failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Run quality gate with automated checks
   */
  async runQualityGate(gateId, checks = []) {
    try {
      console.log(`🚀 Running Quality Gate: ${gateId}`);
      
      const results = {
        gateId,
        timestamp: new Date().toISOString(),
        status: "running",
        checks: {},
        overallScore: 0,
        passed: 0,
        failed: 0
      };

      // Run automated checks
      for (const check of checks) {
        try {
          const checkResult = await this.runCheck(check);
          results.checks[check.name] = checkResult;
          
          if (checkResult.status === "pass") {
            results.passed++;
            results.overallScore += checkResult.score || 10;
          } else {
            results.failed++;
          }
        } catch (error) {
          results.checks[check.name] = {
            status: "error",
            error: error.message,
            score: 0
          };
          results.failed++;
        }
      }

      // Calculate final status
      results.status = results.failed === 0 ? "passed" : "failed";
      results.overallScore = Math.round(results.overallScore / checks.length);

      // Store results
      this.qualityGates.set(gateId, results);
      
      // Update journal
      await this.updateJournal(`Quality Gate ${gateId}: ${results.status} (Score: ${results.overallScore}/100)`);

      console.log(`✅ Quality Gate ${gateId}: ${results.status} (${results.overallScore}/100)`);
      return results;
    } catch (error) {
      console.error(`❌ Quality Gate ${gateId} failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Run individual check
   */
  async runCheck(check) {
    switch (check.type) {
      case "eslint":
        return await this.runESLintCheck();
      case "typescript":
        return await this.runTypeScriptCheck();
      case "build":
        return await this.runBuildCheck();
      case "test":
        return await this.runTestCheck();
      case "performance":
        return await this.runPerformanceCheck();
      default:
        throw new Error(`Unknown check type: ${check.type}`);
    }
  }

  /**
   * ESLint check
   */
  async runESLintCheck() {
    try {
      execSync("pnpm run lint", { stdio: "pipe" });
      return { status: "pass", score: 10, message: "ESLint passed" };
    } catch (error) {
      return { status: "fail", score: 0, message: "ESLint failed", error: error.message };
    }
  }

  /**
   * TypeScript check
   */
  async runTypeScriptCheck() {
    try {
      execSync("pnpm run typecheck", { stdio: "pipe" });
      return { status: "pass", score: 10, message: "TypeScript passed" };
    } catch (error) {
      return { status: "fail", score: 0, message: "TypeScript failed", error: error.message };
    }
  }

  /**
   * Build check
   */
  async runBuildCheck() {
    try {
      execSync("pnpm run build", { stdio: "pipe" });
      return { status: "pass", score: 10, message: "Build passed" };
    } catch (error) {
      return { status: "fail", score: 0, message: "Build failed", error: error.message };
    }
  }

  /**
   * Test check
   */
  async runTestCheck() {
    try {
      execSync("pnpm run test:ui:ci", { stdio: "pipe" });
      return { status: "pass", score: 10, message: "Tests passed" };
    } catch (error) {
      return { status: "fail", score: 0, message: "Tests failed", error: error.message };
    }
  }

  /**
   * Performance check
   */
  async runPerformanceCheck() {
    try {
      // Run Lighthouse or performance check
      execSync("pnpm run lighthouse", { stdio: "pipe" });
      return { status: "pass", score: 10, message: "Performance check passed" };
    } catch (error) {
      return { status: "fail", score: 0, message: "Performance check failed", error: error.message };
    }
  }

  /**
   * Get system status
   */
  getSystemStatus() {
    return {
      evidenceCount: this.evidence.size,
      journalEntries: this.journal.length,
      qualityGates: this.qualityGates.size,
      status: "operational"
    };
  }

  /**
   * Export evidence data
   */
  exportEvidence() {
    return Array.from(this.evidence.values());
  }

  /**
   * Export journal
   */
  exportJournal() {
    return this.journal;
  }
}

// Export for use in other modules
export default TALKv1Core;

// CLI interface
if (process.argv[1].endsWith('talk-v1-core.mjs')) {
  const core = new TALKv1Core();
  
  const command = process.argv[2];
  const args = process.argv.slice(3);

  switch (command) {
    case "status":
      console.log("📊 TALK v1 Core Status:", core.getSystemStatus());
      break;
    case "evidence":
      console.log("📊 Evidence:", core.exportEvidence());
      break;
    case "journal":
      console.log("📝 Journal:", core.exportJournal());
      break;
    case "gate":
      if (args.length >= 2) {
        const [gateId, ...checks] = args;
        core.runQualityGate(gateId, checks.map(c => ({ type: c, name: c })));
      } else {
        console.log("Usage: node talk-v1-core.mjs gate <gateId> <check1> <check2>...");
      }
      break;
    default:
      console.log(`
TALK v1 Core System - Usage:
  node talk-v1-core.mjs status                    - Show system status
  node talk-v1-core.mjs evidence                  - Export evidence data
  node talk-v1-core.mjs journal                   - Export journal
  node talk-v1-core.mjs gate <gateId> <checks...> - Run quality gate
      `);
  }
}
