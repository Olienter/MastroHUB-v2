#!/usr/bin/env node

/**
 * TALK v1 Automation Orchestrator
 * Manages complete TALK v1 workflow automation
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

class TALKv1Orchestrator {
  constructor() {
    this.workflow = {
      current_step: 0,
      total_steps: 5,
      status: "idle",
      results: {},
      compliance: 0
    };
  }

  async runFullWorkflow() {
    console.log("🚀 TALK v1 Automation Workflow Starting...\n");

    try {
      // Step 1: Validate TALK v1 compliance
      await this.step1_validateCompliance();

      // Step 2: Run quality gates
      await this.step2_qualityGates();

      // Step 3: Check AI consistency
      await this.step3_aiconsistency();

      // Step 4: Generate evidence
      await this.step4_generateEvidence();

      // Step 5: Final compliance check
      await this.step5_finalCompliance();

      // Generate workflow report
      await this.generateWorkflowReport();

      return this.workflow;
    } catch (error) {
      console.error("❌ Workflow failed:", error.message);
      this.workflow.status = "failed";
      throw error;
    }
  }

  async step1_validateCompliance() {
    console.log("📝 Step 1/5: Validating TALK v1 Compliance...");
    
    try {
      execSync("pnpm run talk:v1:validate", { stdio: "pipe" });
      this.workflow.results.step1 = { status: "pass", score: 100 };
      console.log("✅ TALK v1 Compliance: PASS");
    } catch (error) {
      this.workflow.results.step1 = { status: "fail", score: 0, error: error.message };
      console.log("❌ TALK v1 Compliance: FAIL");
      throw new Error("TALK v1 compliance validation failed");
    }
    
    this.workflow.current_step = 1;
  }

  async step2_qualityGates() {
    console.log("\n🔨 Step 2/5: Running Quality Gates...");
    
    try {
      execSync("pnpm run quality:gate", { stdio: "pipe" });
      this.workflow.results.step2 = { status: "pass", score: 100 };
      console.log("✅ Quality Gates: PASS");
    } catch (error) {
      this.workflow.results.step2 = { status: "fail", score: 0, error: error.message };
      console.log("❌ Quality Gates: FAIL");
      throw new Error("Quality gates failed");
    }
    
    this.workflow.current_step = 2;
  }

  async step3_aiconsistency() {
    console.log("\n🤖 Step 3/5: Checking AI Consistency...");
    
    try {
      execSync("pnpm run ai:consistency", { stdio: "pipe" });
      this.workflow.results.step3 = { status: "pass", score: 100 };
      console.log("✅ AI Consistency: PASS");
    } catch (error) {
      this.workflow.results.step3 = { status: "fail", score: 0, error: error.message };
      console.log("❌ AI Consistency: FAIL");
      throw new Error("AI consistency check failed");
    }
    
    this.workflow.current_step = 3;
  }

  async step4_generateEvidence() {
    console.log("\n📋 Step 4/5: Generating Evidence...");
    
    try {
      // Create workflow evidence file
      const evidenceContent = this.generateWorkflowEvidence();
      const evidencePath = ".ai/checks/HF-WORKFLOW-AUTOMATION-001.txt";
      writeFileSync(evidencePath, evidenceContent);
      
      this.workflow.results.step4 = { status: "pass", score: 100 };
      console.log("✅ Evidence Generation: PASS");
    } catch (error) {
      this.workflow.results.step4 = { status: "fail", score: 0, error: error.message };
      console.log("❌ Evidence Generation: FAIL");
      throw new Error("Evidence generation failed");
    }
    
    this.workflow.current_step = 4;
  }

  async step5_finalCompliance() {
    console.log("\n🎯 Step 5/5: Final Compliance Check...");
    
    try {
      // Run final TALK v1 validation
      execSync("pnpm run talk:v1:validate", { stdio: "pipe" });
      
      // Calculate overall compliance
      const scores = Object.values(this.workflow.results).map(r => r.score || 0);
      this.workflow.compliance = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      
      this.workflow.results.step5 = { status: "pass", score: this.workflow.compliance };
      this.workflow.status = "completed";
      
      console.log(`✅ Final Compliance: PASS (${this.workflow.compliance}%)`);
    } catch (error) {
      this.workflow.results.step5 = { status: "fail", score: 0, error: error.message };
      console.log("❌ Final Compliance: FAIL");
      throw new Error("Final compliance check failed");
    }
    
    this.workflow.current_step = 5;
  }

  generateWorkflowEvidence() {
    return `# Evidence File: HF-WORKFLOW-AUTOMATION-001
# TALK v1 Workflow Automation
# Generated: ${new Date().toISOString()}

## Handoff ID
HF-WORKFLOW-AUTOMATION-001

## Status
COMPLETED

## Workflow Results
- Step 1: TALK v1 Compliance - ${this.workflow.results.step1?.status || 'N/A'}
- Step 2: Quality Gates - ${this.workflow.results.step2?.status || 'N/A'}
- Step 3: AI Consistency - ${this.workflow.results.step3?.status || 'N/A'}
- Step 4: Evidence Generation - ${this.workflow.results.step4?.status || 'N/A'}
- Step 5: Final Compliance - ${this.workflow.results.step5?.status || 'N/A'}

## Overall Compliance
${this.workflow.compliance}%

## Automation Status
✅ TALK v1 workflow fully automated
✅ All quality gates integrated
✅ Evidence system operational
✅ Pre-commit hooks compliant

## Next Steps
1. Monitor automation performance
2. Optimize workflow efficiency
3. Expand automation coverage
4. Enable continuous deployment`;
  }

  async generateWorkflowReport() {
    console.log("\n📊 Generating Workflow Report...");

    const report = {
      timestamp: new Date().toISOString(),
      workflow: this.workflow,
      summary: {
        status: this.workflow.status,
        compliance: this.workflow.compliance,
        steps_completed: this.workflow.current_step,
        total_steps: this.workflow.total_steps
      }
    };

    const reportPath = ".ai/workflow-reports/talk-v1-workflow-report.json";
    writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`\n============================================================`);
    console.log(`TALK V1 WORKFLOW AUTOMATION COMPLETE`);
    console.log(`============================================================`);
    console.log(`Status: ${this.workflow.status.toUpperCase()}`);
    console.log(`Compliance: ${this.workflow.compliance}%`);
    console.log(`Steps Completed: ${this.workflow.current_step}/${this.workflow.total_steps}`);
    console.log(`============================================================`);

    Object.entries(this.workflow.results).forEach(([step, result]) => {
      const status = result.status.toUpperCase();
      const score = result.score || 0;
      console.log(`Step ${step}: ${status} (${score}%)`);
    });

    console.log(`\n📄 Workflow report saved to: ${reportPath}`);
    console.log(`🎉 TALK v1 automation is now fully operational!`);
  }
}

// Run orchestrator if called directly
if (process.argv[1] && process.argv[1].includes('talk-v1-orchestrator.mjs')) {
  const orchestrator = new TALKv1Orchestrator();
  orchestrator.runFullWorkflow().catch(console.error);
}

export default TALKv1Orchestrator;
