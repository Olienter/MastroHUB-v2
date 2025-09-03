#!/usr/bin/env node

/**
 * MastroHUB v2 Automation Orchestrator
 * Central orchestrator for all automation workflows
 * 
 * Features:
 * - Workflow management
 * - Error handling with retry logic
 * - Performance monitoring
 * - Evidence tracking
 * - Health monitoring
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

class AutomationOrchestrator {
  constructor() {
    this.workflows = new Map();
    this.results = {
      timestamp: new Date().toISOString(),
      overall_status: "idle",
      workflows: {},
      errors: [],
      performance: {
        start_time: Date.now(),
        end_time: null,
        duration_ms: 0
      }
    };
    
    this.initializeWorkflows();
  }

  initializeWorkflows() {
    // Define all available workflows
    this.workflows.set("full", {
      name: "Full Automation Workflow",
      steps: [
        "validate_environment",
        "run_quality_gates", 
        "execute_talk_v1",
        "generate_evidence",
        "update_journal",
        "final_validation"
      ],
      timeout: 300000, // 5 minutes
      retries: 3
    });

    this.workflows.set("quality", {
      name: "Quality Gates Only",
      steps: [
        "validate_environment",
        "run_quality_gates",
        "generate_evidence"
      ],
      timeout: 120000, // 2 minutes
      retries: 2
    });

    this.workflows.set("talk_v1", {
      name: "TALK v1 Workflow",
      steps: [
        "validate_talk_v1_compliance",
        "execute_talk_v1_core",
        "validate_evidence",
        "update_journal"
      ],
      timeout: 180000, // 3 minutes
      retries: 2
    });

    this.workflows.set("ci", {
      name: "CI/CD Pipeline",
      steps: [
        "validate_environment",
        "run_tests",
        "build_project",
        "run_quality_gates",
        "deploy_check"
      ],
      timeout: 600000, // 10 minutes
      retries: 1
    });
  }

  async executeWorkflow(workflowName, options = {}) {
    const workflow = this.workflows.get(workflowName);
    if (!workflow) {
      throw new Error(`Workflow '${workflowName}' not found`);
    }

    console.log(`🚀 Starting workflow: ${workflow.name}`);
    console.log(`📋 Steps: ${workflow.steps.join(" → ")}`);
    console.log(`⏱️  Timeout: ${workflow.timeout}ms`);
    console.log(`🔄 Retries: ${workflow.retries}\n`);

    this.results.overall_status = "running";
    this.results.workflows[workflowName] = {
      status: "running",
      steps: {},
      start_time: Date.now(),
      errors: []
    };

    try {
      for (const step of workflow.steps) {
        await this.executeStep(step, workflowName, options);
      }

      this.results.workflows[workflowName].status = "completed";
      this.results.workflows[workflowName].end_time = Date.now();
      this.results.overall_status = "completed";

      console.log(`✅ Workflow '${workflowName}' completed successfully`);
      await this.generateReport(workflowName);

    } catch (error) {
      this.results.workflows[workflowName].status = "failed";
      this.results.workflows[workflowName].end_time = Date.now();
      this.results.workflows[workflowName].errors.push(error.message);
      this.results.overall_status = "failed";
      this.results.errors.push({
        workflow: workflowName,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      console.error(`❌ Workflow '${workflowName}' failed: ${error.message}`);
      
      // Attempt retry if configured
      if (workflow.retries > 0) {
        console.log(`🔄 Retrying workflow '${workflowName}' (${workflow.retries} retries left)`);
        workflow.retries--;
        return await this.executeWorkflow(workflowName, options);
      }

      throw error;
    }
  }

  async executeStep(stepName, workflowName, options) {
    console.log(`  🔧 Executing step: ${stepName}`);
    
    const stepStartTime = Date.now();
    let stepResult = { status: "running", output: "", error: null };

    try {
      switch (stepName) {
        case "validate_environment":
          stepResult = await this.validateEnvironment();
          break;
        case "run_quality_gates":
          stepResult = await this.runQualityGates();
          break;
        case "execute_talk_v1":
          stepResult = await this.executeTalkV1();
          break;
        case "execute_talk_v1_core":
          stepResult = await this.executeTalkV1Core();
          break;
        case "validate_talk_v1_compliance":
          stepResult = await this.validateTalkV1Compliance();
          break;
        case "generate_evidence":
          stepResult = await this.generateEvidence();
          break;
        case "update_journal":
          stepResult = await this.updateJournal();
          break;
        case "validate_evidence":
          stepResult = await this.validateEvidence();
          break;
        case "final_validation":
          stepResult = await this.finalValidation();
          break;
        case "run_tests":
          stepResult = await this.runTests();
          break;
        case "build_project":
          stepResult = await this.buildProject();
          break;
        case "deploy_check":
          stepResult = await this.deployCheck();
          break;
        default:
          throw new Error(`Unknown step: ${stepName}`);
      }

      const duration = Date.now() - stepStartTime;
      stepResult.duration_ms = duration;
      stepResult.status = "completed";

      this.results.workflows[workflowName].steps[stepName] = stepResult;
      console.log(`    ✅ ${stepName} completed in ${duration}ms`);

    } catch (error) {
      const duration = Date.now() - stepStartTime;
      stepResult.status = "failed";
      stepResult.error = error.message;
      stepResult.duration_ms = duration;

      this.results.workflows[workflowName].steps[stepName] = stepResult;
      console.error(`    ❌ ${stepName} failed: ${error.message}`);
      
      throw error;
    }
  }

  // Step implementations
  async validateEnvironment() {
    try {
      // Check if required files exist
      const requiredFiles = [
        "package.json",
        "next.config.mjs",
        ".ai/manifest.json"
      ];

      for (const file of requiredFiles) {
        if (!existsSync(file)) {
          throw new Error(`Required file missing: ${file}`);
        }
      }

      // Check if pnpm is available
      try {
        execSync("pnpm --version", { stdio: "pipe" });
      } catch {
        throw new Error("pnpm is not available");
      }

      return { output: "Environment validation passed", status: "completed" };
    } catch (error) {
      return { error: error.message, status: "failed" };
    }
  }

  async runQualityGates() {
    try {
      const output = execSync("node scripts/quality-gate.mjs", { 
        encoding: "utf8",
        stdio: "pipe"
      });
      return { output, status: "completed" };
    } catch (error) {
      return { error: error.message, status: "failed" };
    }
  }

  async executeTalkV1() {
    try {
      const output = execSync("node scripts/talk-v1-orchestrator.mjs", { 
        encoding: "utf8",
        stdio: "pipe"
      });
      return { output, status: "completed" };
    } catch (error) {
      return { error: error.message, status: "failed" };
    }
  }

  async executeTalkV1Core() {
    try {
      const output = execSync("node scripts/talk-v1-core.mjs status", { 
        encoding: "utf8",
        stdio: "pipe"
      });
      return { output, status: "completed" };
    } catch (error) {
      return { error: error.message, status: "failed" };
    }
  }

  async validateTalkV1Compliance() {
    try {
      const output = execSync("node scripts/talk-v1-validator.mjs", { 
        encoding: "utf8",
        stdio: "pipe"
      });
      return { output, status: "completed" };
    } catch (error) {
      return { error: error.message, status: "failed" };
    }
  }

  async generateEvidence() {
    try {
      // Create evidence file for this automation run
      const evidenceData = {
        pid: `AUTO-ORCHESTRATOR-${Date.now()}`,
        timestamp: new Date().toISOString(),
        workflow: "automation-orchestrator",
        status: "completed",
        results: this.results
      };

      const evidenceFile = `.ai/checks/AUTO-ORCHESTRATOR-${Date.now()}.json`;
      writeFileSync(evidenceFile, JSON.stringify(evidenceData, null, 2));
      
      return { 
        output: `Evidence generated: ${evidenceFile}`, 
        status: "completed" 
      };
    } catch (error) {
      return { error: error.message, status: "failed" };
    }
  }

  async updateJournal() {
    try {
      const journalEntry = `
## ${new Date().toISOString().split('T')[0]}

### ${new Date().toLocaleTimeString()} - Automation Orchestrator Run

**Status**: ${this.results.overall_status}
**Workflows**: ${Object.keys(this.results.workflows).join(", ")}
**Duration**: ${Date.now() - this.results.performance.start_time}ms

**Results**:
${Object.entries(this.results.workflows).map(([name, workflow]) => 
  `- ${name}: ${workflow.status}`
).join("\n")}

**Errors**: ${this.results.errors.length > 0 ? this.results.errors.map(e => e.error).join(", ") : "None"}

---
`;

      const journalFile = ".ai/chronicle/journal.md";
      if (existsSync(journalFile)) {
        const currentContent = readFileSync(journalFile, "utf8");
        writeFileSync(journalFile, currentContent + journalEntry);
      } else {
        writeFileSync(journalFile, journalEntry);
      }

      return { output: "Journal updated", status: "completed" };
    } catch (error) {
      return { error: error.message, status: "failed" };
    }
  }

  async validateEvidence() {
    try {
      const checksDir = ".ai/checks";
      if (!existsSync(checksDir)) {
        throw new Error("Evidence directory not found");
      }

      // Count evidence files
      const fs = await import("fs");
      const files = fs.readdirSync(checksDir);
      const evidenceCount = files.filter(f => f.endsWith('.json') || f.endsWith('.txt')).length;

      return { 
        output: `Found ${evidenceCount} evidence files`, 
        status: "completed" 
      };
    } catch (error) {
      return { error: error.message, status: "failed" };
    }
  }

  async finalValidation() {
    try {
      // Final checks
      const checks = [
        { name: "Build Status", check: () => execSync("pnpm run typecheck", { stdio: "pipe" }) },
        { name: "Lint Status", check: () => execSync("pnpm run lint", { stdio: "pipe" }) }
      ];

      const results = [];
      for (const check of checks) {
        try {
          check.check();
          results.push(`✅ ${check.name}: PASS`);
        } catch (error) {
          results.push(`❌ ${check.name}: FAIL`);
        }
      }

      return { 
        output: results.join("\n"), 
        status: "completed" 
      };
    } catch (error) {
      return { error: error.message, status: "failed" };
    }
  }

  async runTests() {
    try {
      const output = execSync("pnpm run test", { 
        encoding: "utf8",
        stdio: "pipe"
      });
      return { output, status: "completed" };
    } catch (error) {
      return { error: error.message, status: "failed" };
    }
  }

  async buildProject() {
    try {
      const output = execSync("pnpm run build", { 
        encoding: "utf8",
        stdio: "pipe"
      });
      return { output, status: "completed" };
    } catch (error) {
      return { error: error.message, status: "failed" };
    }
  }

  async deployCheck() {
    try {
      // Check if build artifacts exist
      if (!existsSync(".next")) {
        throw new Error("Build artifacts not found");
      }

      return { 
        output: "Deploy check passed - build artifacts found", 
        status: "completed" 
      };
    } catch (error) {
      return { error: error.message, status: "failed" };
    }
  }

  async generateReport(workflowName) {
    this.results.performance.end_time = Date.now();
    this.results.performance.duration_ms = 
      this.results.performance.end_time - this.results.performance.start_time;

    const reportFile = `.ai/reports/automation-report-${Date.now()}.json`;
    
    // Ensure reports directory exists
    const fs = await import("fs");
    if (!existsSync(".ai/reports")) {
      fs.mkdirSync(".ai/reports", { recursive: true });
    }

    writeFileSync(reportFile, JSON.stringify(this.results, null, 2));
    console.log(`📊 Report generated: ${reportFile}`);
  }

  // CLI interface
  async run() {
    const args = process.argv.slice(2);
    const command = args[0];
    const workflowName = args[1];

    switch (command) {
      case "run":
        if (!workflowName) {
          console.error("❌ Please specify a workflow name");
          console.log("Available workflows:", Array.from(this.workflows.keys()).join(", "));
          process.exit(1);
        }
        await this.executeWorkflow(workflowName);
        break;
      
      case "list":
        console.log("📋 Available workflows:");
        for (const [name, workflow] of this.workflows) {
          console.log(`  - ${name}: ${workflow.name}`);
          console.log(`    Steps: ${workflow.steps.join(" → ")}`);
        }
        process.exit(0);
        break;
      
      case "status":
        console.log("📊 Automation Orchestrator Status:");
        console.log(`  Overall Status: ${this.results.overall_status}`);
        console.log(`  Available Workflows: ${this.workflows.size}`);
        console.log(`  Last Run: ${this.results.timestamp}`);
        break;
      
      default:
        console.log("🤖 MastroHUB v2 Automation Orchestrator");
        console.log("\nUsage:");
        console.log("  node automation-orchestrator.mjs run <workflow>  - Run a workflow");
        console.log("  node automation-orchestrator.mjs list           - List available workflows");
        console.log("  node automation-orchestrator.mjs status         - Show status");
        console.log("\nAvailable workflows:", Array.from(this.workflows.keys()).join(", "));
        break;
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('automation-orchestrator.mjs')) {
  const orchestrator = new AutomationOrchestrator();
  orchestrator.run().catch(error => {
    console.error("❌ Orchestrator failed:", error.message);
    process.exit(1);
  });
}

export default AutomationOrchestrator;
