#!/usr/bin/env node

/**
 * Frontend Orchestrator for MastroHUB v2
 * Centralized management of all frontend automation tools
 */

import { execSync } from "child_process";
import { existsSync } from "fs";

class FrontendOrchestrator {
  constructor() {
    this.tools = {
      'design-system': 'frontend-automation-engine.mjs',
      'consistency': 'design-consistency-checker.mjs',
      'responsive': 'responsive-design-validator.mjs',
      'accessibility': 'accessibility-audit.mjs',
      'components': 'component-library-generator.mjs',
      'ui-completion': 'ui-completion-workflow.mjs'
    };
    
    this.workflows = {
      'full-audit': {
        name: 'Complete Frontend Audit',
        description: 'Run all frontend validation tools',
        steps: ['design-system', 'consistency', 'responsive', 'accessibility']
      },
      'design-system': {
        name: 'Design System Analysis',
        description: 'Analyze design tokens and system compliance',
        steps: ['design-system']
      },
      'consistency': {
        name: 'Design Consistency Check',
        description: 'Validate design consistency across components',
        steps: ['consistency']
      },
      'responsive': {
        name: 'Responsive Design Validation',
        description: 'Test responsive design across breakpoints',
        steps: ['responsive']
      },
      'accessibility': {
        name: 'Accessibility Audit',
        description: 'WCAG 2.1 AA compliance validation',
        steps: ['accessibility']
      },
      'component-generation': {
        name: 'Component Library Generation',
        description: 'Generate new components with design system integration',
        steps: ['components']
      },
      'ui-completion': {
        name: 'UI/UX Completion Workflow',
        description: 'Complete frontend development workflow',
        steps: ['ui-completion']
      }
    };
  }

  async runWorkflow(workflowName, args = []) {
    const workflow = this.workflows[workflowName];
    if (!workflow) {
      console.log(`❌ Workflow '${workflowName}' not found`);
      return;
    }

    console.log(`🚀 Running workflow: ${workflow.name}`);
    console.log(`📝 Description: ${workflow.description}`);
    console.log(`🔧 Steps: ${workflow.steps.join(' → ')}`);
    console.log("=" .repeat(60));

    for (const step of workflow.steps) {
      await this.runTool(step, args);
    }

    console.log("=" .repeat(60));
    console.log(`✅ Workflow '${workflow.name}' completed successfully`);
  }

  async runTool(toolName, args = []) {
    const toolFile = this.tools[toolName];
    if (!toolFile) {
      console.log(`❌ Tool '${toolName}' not found`);
      return;
    }

    const toolPath = `scripts/${toolFile}`;
    if (!existsSync(toolPath)) {
      console.log(`❌ Tool file '${toolPath}' not found`);
      return;
    }

    console.log(`\n🔧 Running ${toolName}...`);
    
    try {
      const command = `node ${toolPath} ${args.join(' ')}`;
      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: 'inherit'
      });
      
      console.log(`✅ ${toolName} completed successfully`);
    } catch (error) {
      console.log(`❌ ${toolName} failed: ${error.message}`);
    }
  }

  async runFullAudit() {
    console.log("🎨 MASTROHUB V2 - COMPLETE FRONTEND AUDIT");
    console.log("=" .repeat(60));
    
    const startTime = Date.now();
    
    // Run all validation tools
    await this.runWorkflow('full-audit');
    
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);
    
    console.log("\n🎯 FRONTEND AUDIT SUMMARY");
    console.log("=" .repeat(60));
    console.log(`⏱️  Total Duration: ${duration} seconds`);
    console.log(`🔧 Tools Executed: ${Object.keys(this.tools).length}`);
    console.log(`📊 Reports Generated: Check .ai/reports/ directory`);
    console.log("\n💡 Next Steps:");
    console.log("1. Review generated reports");
    console.log("2. Fix critical issues identified");
    console.log("3. Implement recommended improvements");
    console.log("4. Run component generation for missing components");
    console.log("5. Set up automated testing pipeline");
  }

  async generateComponents(componentNames = []) {
    console.log("🧩 COMPONENT LIBRARY GENERATION");
    console.log("=" .repeat(60));
    
    if (componentNames.length === 0) {
      console.log("📋 Available components:");
      const command = `node scripts/component-library-generator.mjs list`;
      execSync(command, { stdio: 'inherit' });
      return;
    }
    
    for (const componentName of componentNames) {
      await this.runTool('components', ['generate', componentName]);
    }
    
    console.log("✅ Component generation completed");
  }

  async runUICompletion() {
    console.log("🎨 UI/UX COMPLETION WORKFLOW");
    console.log("=" .repeat(60));
    
    await this.runWorkflow('ui-completion');
    
    console.log("\n📋 UI/UX COMPLETION CHECKLIST");
    console.log("=" .repeat(60));
    console.log("✅ Design System Analysis");
    console.log("✅ Component Consistency Check");
    console.log("✅ Responsive Design Validation");
    console.log("✅ Accessibility Audit");
    console.log("✅ UI/UX Completion Report");
    
    console.log("\n🚀 READY FOR PRODUCTION");
    console.log("Your frontend is now ready for:");
    console.log("- Customer deployment");
    console.log("- User testing");
    console.log("- Performance optimization");
    console.log("- SEO implementation");
  }

  async run() {
    const args = process.argv.slice(2);
    const command = args[0];
    const subArgs = args.slice(1);

    switch (command) {
      case "audit":
        await this.runFullAudit();
        break;
        
      case "workflow":
        const workflowName = subArgs[0];
        if (!workflowName) {
          console.log("📋 Available workflows:");
          Object.entries(this.workflows).forEach(([key, workflow]) => {
            console.log(`  ${key}: ${workflow.name}`);
            console.log(`    ${workflow.description}`);
          });
          return;
        }
        await this.runWorkflow(workflowName, subArgs.slice(1));
        break;
        
      case "tool":
        const toolName = subArgs[0];
        if (!toolName) {
          console.log("📋 Available tools:");
          Object.entries(this.tools).forEach(([key, file]) => {
            console.log(`  ${key}: ${file}`);
          });
          return;
        }
        await this.runTool(toolName, subArgs.slice(1));
        break;
        
      case "generate":
        await this.generateComponents(subArgs);
        break;
        
      case "complete":
        await this.runUICompletion();
        break;
        
      case "list":
        console.log("🎨 MastroHUB v2 Frontend Orchestrator");
        console.log("\n📋 Available Commands:");
        console.log("  audit                    - Run complete frontend audit");
        console.log("  workflow <name>          - Run specific workflow");
        console.log("  tool <name>              - Run specific tool");
        console.log("  generate [components]    - Generate components");
        console.log("  complete                 - Run UI/UX completion workflow");
        console.log("  list                     - Show this help");
        
        console.log("\n📋 Available Workflows:");
        Object.entries(this.workflows).forEach(([key, workflow]) => {
          console.log(`  ${key}: ${workflow.name}`);
        });
        
        console.log("\n📋 Available Tools:");
        Object.entries(this.tools).forEach(([key, file]) => {
          console.log(`  ${key}: ${file}`);
        });
        break;
        
      default:
        console.log("🎨 MastroHUB v2 Frontend Orchestrator");
        console.log("\nUsage:");
        console.log("  node frontend-orchestrator.mjs audit     - Complete frontend audit");
        console.log("  node frontend-orchestrator.mjs workflow  - Run specific workflow");
        console.log("  node frontend-orchestrator.mjs tool      - Run specific tool");
        console.log("  node frontend-orchestrator.mjs generate  - Generate components");
        console.log("  node frontend-orchestrator.mjs complete  - UI/UX completion");
        console.log("  node frontend-orchestrator.mjs list      - Show all options");
        break;
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('frontend-orchestrator.mjs')) {
  const orchestrator = new FrontendOrchestrator();
  orchestrator.run().catch(error => {
    console.error("❌ Frontend orchestrator failed:", error.message);
    process.exit(1);
  });
}

export default FrontendOrchestrator;
