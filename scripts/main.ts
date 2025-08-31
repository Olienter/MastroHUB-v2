#!/usr/bin/env node

import { ProjectManager } from './integration/project-manager';

class AutomationCLI {
  private projectManager: ProjectManager;

  constructor() {
    this.projectManager = new ProjectManager();
  }

  async run() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      this.showHelp();
      return;
    }

    const command = args[0];
    const workflowId = args[1];

    try {
      switch (command) {
        case 'workflows':
          this.listWorkflows();
          break;
          
        case 'run':
          if (!workflowId) {
            // eslint-disable-next-line no-console
            console.error('❌ Please specify workflow ID');
            this.showHelp();
            return;
          }
          await this.runWorkflow(workflowId);
          break;
          
        case 'status':
          await this.showStatus();
          break;
          
        case 'stop':
          await this.stopAllTasks();
          break;
          
        case 'quick':
          await this.runQuickCheck();
          break;
          
        case 'dev':
          await this.runDevelopmentCheck();
          break;
          
        case 'quality':
          await this.runQualityCheck();
          break;
          
        case 'full':
          await this.runFullProjectCheck();
          break;
          
        default:
          // eslint-disable-next-line no-console
          console.error(`❌ Unknown command: ${command}`);
          this.showHelp();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Error:', error);
      process.exit(1);
    }
  }

  private showHelp() {
    // eslint-disable-next-line no-console
    console.log(`
🚀 MASTRO AUTOMATION SYSTEM v2.0
================================

USAGE:
  node scripts/main.js <command> [workflow-id]

COMMANDS:
  workflows                    - List all available workflows
  run <workflow-id>           - Run specific workflow
  status                      - Show current system status
  stop                        - Stop all running tasks
  quick                       - Run quick check workflow
  dev                         - Run development workflow
  quality                     - Run quality workflow
  full                        - Run full project workflow

EXAMPLES:
  node scripts/main.js workflows
  node scripts/main.js run development
  node scripts/main.js quick
  node scripts/main.js status

WORKFLOWS:
  - quick-check: Fast validation check
  - development: Standard development checks
  - quality: Full quality assurance
  - full: Complete project setup and validation
`);
  }

  private listWorkflows() {
    const workflows = this.projectManager.getAvailableWorkflows();
    // eslint-disable-next-line no-console
    console.log('\n📋 AVAILABLE WORKFLOWS:');
    // eslint-disable-next-line no-console
    console.log('='.repeat(50));
    
    workflows.forEach(id => {
      const tasks = this.projectManager.getWorkflowTasks(id);
      // eslint-disable-next-line no-console
      console.log(`\n🔹 ${id.toUpperCase()}`);
      // eslint-disable-next-line no-console
      console.log(`   Tasks: ${tasks.length}`);
    });
    
    // eslint-disable-next-line no-console
    console.log('\n💡 Use "node scripts/main.js run <workflow-id>" to execute');
  }

  private async runWorkflow(workflowId: string) {
    // eslint-disable-next-line no-console
    console.log(`🚀 Running workflow: ${workflowId}`);
    const result = await this.projectManager.executeWorkflow(workflowId);
    
    if (result.summary.success) {
      // eslint-disable-next-line no-console
      console.log(`\n✅ Workflow completed successfully!`);
      process.exit(0);
    } else {
      // eslint-disable-next-line no-console
      console.log(`\n❌ Workflow failed!`);
      process.exit(1);
    }
  }

  private async showStatus() {
    const status = await this.projectManager.getSystemStatus();
    // eslint-disable-next-line no-console
    console.log('\n📊 SYSTEM STATUS:');
    // eslint-disable-next-line no-console
    console.log('='.repeat(30));
    // eslint-disable-next-line no-console
    console.log(`Active tasks: ${status.activeTasks}`);
    // eslint-disable-next-line no-console
    console.log(`Completed tasks: ${status.completedTasks}`);
    // eslint-disable-next-line no-console
    console.log(`Task queue: ${status.taskQueue}`);
    
    if (status.activeTasks > 0) {
      // eslint-disable-next-line no-console
      console.log('\n🔄 Currently running tasks:');
      // This would show active task details
    }
  }

  private async stopAllTasks() {
    // eslint-disable-next-line no-console
    console.log('🛑 Stopping all tasks...');
    await this.projectManager.shutdown();
    // eslint-disable-next-line no-console
    console.log('✅ All tasks stopped');
  }

  private async runQuickCheck() {
    // eslint-disable-next-line no-console
    console.log('⚡ Running quick check...');
    const result = await this.projectManager.executeWorkflow('quick');
    
    if (result.summary.success) {
      // eslint-disable-next-line no-console
      console.log('✅ Quick check passed!');
      process.exit(0);
    } else {
      // eslint-disable-next-line no-console
      console.log('❌ Quick check failed!');
      process.exit(1);
    }
  }

  private async runDevelopmentCheck() {
    // eslint-disable-next-line no-console
    console.log('🔧 Running development check...');
    const result = await this.projectManager.executeWorkflow('development');
    
    if (result.summary.success) {
      // eslint-disable-next-line no-console
      console.log('✅ Development check passed!');
      process.exit(0);
    } else {
      // eslint-disable-next-line no-console
      console.log('❌ Development check failed!');
      process.exit(1);
    }
  }

  private async runQualityCheck() {
    // eslint-disable-next-line no-console
    console.log('🎯 Running quality check...');
    const result = await this.projectManager.executeWorkflow('quality');
    
    if (result.summary.success) {
      // eslint-disable-next-line no-console
      console.log('✅ Quality check passed!');
      process.exit(0);
    } else {
      // eslint-disable-next-line no-console
      console.log('❌ Quality check failed!');
      process.exit(1);
    }
  }

  private async runFullProjectCheck() {
    // eslint-disable-next-line no-console
    console.log('🚀 Running full project check...');
    const result = await this.projectManager.executeWorkflow('full');
    
    if (result.summary.success) {
      // eslint-disable-next-line no-console
      console.log('✅ Full project check passed!');
      process.exit(0);
    } else {
      // eslint-disable-next-line no-console
      console.log('❌ Full project check failed!');
      process.exit(1);
    }
  }
}

// Main execution
const cli = new AutomationCLI();
cli.run().catch(error => {
  // eslint-disable-next-line no-console
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

export { AutomationCLI };
