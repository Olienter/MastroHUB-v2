#!/usr/bin/env node

/**
 * TALK v1 System Test for MastroHUB v2
 * Comprehensive testing of evidence tracking, journal, and quality gates
 */

import TALKv1Core from "./talk-v1-core.mjs";

class TALKv1Test {
  constructor() {
    this.core = new TALKv1Core();
    this.testResults = [];
  }

  async runAllTests() {
    console.log("🧪 Starting TALK v1 System Tests...\n");

    try {
      // Test 1: Evidence Tracking
      await this.testEvidenceTracking();

      // Test 2: Journal Updates
      await this.testJournalUpdates();

      // Test 3: Quality Gates
      await this.testQualityGates();

      // Test 4: System Status
      await this.testSystemStatus();

      this.printTestResults();
    } catch (error) {
      console.error("❌ Test suite failed:", error.message);
    }
  }

  async testEvidenceTracking() {
    console.log("📊 Test 1: Evidence Tracking");

    try {
      const testData = { test: "evidence_tracking", value: 42 };
      const evidence = await this.core.trackEvidence(
        "TEST-EVIDENCE-001",
        testData
      );

      if (evidence && evidence.pid === "TEST-EVIDENCE-001") {
        this.testResults.push({ test: "Evidence Tracking", status: "PASS" });
        console.log("✅ Evidence tracking: PASS");
      } else {
        this.testResults.push({ test: "Evidence Tracking", status: "FAIL" });
        console.log("❌ Evidence tracking: FAIL");
      }
    } catch (error) {
      this.testResults.push({
        test: "Evidence Tracking",
        status: "ERROR",
        error: error.message,
      });
      console.log("❌ Evidence tracking: ERROR");
    }
  }

  async testJournalUpdates() {
    console.log("\n📝 Test 2: Journal Updates");

    try {
      const result = await this.core.updateJournal(
        "Test journal entry from TALK v1 test suite"
      );

      if (result === true) {
        this.testResults.push({ test: "Journal Updates", status: "PASS" });
        console.log("✅ Journal updates: PASS");
      } else {
        this.testResults.push({ test: "Journal Updates", status: "FAIL" });
        console.log("❌ Journal updates: FAIL");
      }
    } catch (error) {
      this.testResults.push({
        test: "Journal Updates",
        status: "ERROR",
        error: error.message,
      });
      console.log("❌ Journal updates: ERROR");
    }
  }

  async testQualityGates() {
    console.log("\n🚪 Test 3: Quality Gates");

    try {
      const result = await this.core.runQualityGate("TEST-GATE-002", [
        { type: "eslint", name: "eslint" },
        { type: "typescript", name: "typescript" },
      ]);

      if (result && result.gateId === "TEST-GATE-002") {
        this.testResults.push({ test: "Quality Gates", status: "PASS" });
        console.log("✅ Quality gates: PASS");
      } else {
        this.testResults.push({ test: "Quality Gates", status: "FAIL" });
        console.log("❌ Quality gates: FAIL");
      }
    } catch (error) {
      this.testResults.push({
        test: "Quality Gates",
        status: "ERROR",
        error: error.message,
      });
      console.log("❌ Quality gates: ERROR");
    }
  }

  async testSystemStatus() {
    console.log("\n📊 Test 4: System Status");

    try {
      const status = this.core.getSystemStatus();

      if (status && status.status === "operational") {
        this.testResults.push({ test: "System Status", status: "PASS" });
        console.log("✅ System status: PASS");
      } else {
        this.testResults.push({ test: "System Status", status: "FAIL" });
        console.log("❌ System status: FAIL");
      }
    } catch (error) {
      this.testResults.push({
        test: "System Status",
        status: "ERROR",
        error: error.message,
      });
      console.log("❌ System status: ERROR");
    }
  }

  printTestResults() {
    console.log("\n" + "=".repeat(50));
    console.log("🧪 TALK v1 System Test Results");
    console.log("=".repeat(50));

    const passed = this.testResults.filter((r) => r.status === "PASS").length;
    const failed = this.testResults.filter((r) => r.status === "FAIL").length;
    const errors = this.testResults.filter((r) => r.status === "ERROR").length;

    this.testResults.forEach((result) => {
      const icon =
        result.status === "PASS"
          ? "✅"
          : result.status === "FAIL"
          ? "❌"
          : "⚠️";
      console.log(`${icon} ${result.test}: ${result.status}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    console.log("\n📊 Summary:");
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️ Errors: ${errors}`);

    const successRate = Math.round((passed / this.testResults.length) * 100);
    console.log(`📈 Success Rate: ${successRate}%`);
  }
}

// CLI interface
if (process.argv[1].endsWith("talk-v1-test.mjs")) {
  const testSuite = new TALKv1Test();
  testSuite.runAllTests();
}

export default TALKv1Test;
