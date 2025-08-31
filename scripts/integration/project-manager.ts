import { AutomationEngine } from '../core/automation-engine';
import { Task, TaskResult } from '../core/automation-engine';
import { ProjectTasks } from '../tasks/project-tasks';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface WorkflowReport {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalTasks: number;
  successfulTasks: number;
  failedTasks: number;
  results: TaskResult[];
  summary: {
    success: boolean;
    totalDuration: number;
    averageTaskDuration: number;
    successRate: number;
  };
}

export class ProjectManager {
  private engine: AutomationEngine;
  private workflows: Map<string, string[]> = new Map();
  private reportsDir: string;

  constructor() {
    this.engine = new AutomationEngine();
    this.reportsDir = '.ai/workflow-reports';
    this.ensureReportsDir();
    this.setupEventListeners();
    this.registerDefaultWorkflows();
  }

  private ensureReportsDir(): void {
    try {
      mkdirSync(this.reportsDir, { recursive: true });
    } catch {
      // Directory already exists
    }
  }

  private setupEventListeners(): void {
    // Task lifecycle events
    this.engine.on('task:started', (task: Task) => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Task started: ${task.name}`);
    });

    this.engine.on('task:completed', (result: TaskResult) => {
      // eslint-disable-next-line no-console
      console.log(`✅ Task completed: ${result.taskId} (${result.duration}ms)`);
    });

    this.engine.on('task:failed', (result: TaskResult) => {
      // eslint-disable-next-line no-console
      console.log(`❌ Task failed: ${result.taskId} (${result.duration}ms)`);
    });

    // Real-time output streaming
    this.engine.on('task:output', (data: { taskId: string; type: string; data: string }) => {
      // eslint-disable-next-line no-console
      console.log(`[${data.taskId}] ${data.type.toUpperCase()}: ${data.data}`);
    });

    // System metrics
    this.engine.on('system:metrics', (metrics: { cpuUsage: number; memoryUsage: number; activeProcesses: number }) => {
      // eslint-disable-next-line no-console
      console.log(`📊 System: CPU ${metrics.cpuUsage}%, Memory ${metrics.memoryUsage}%, Active: ${metrics.activeProcesses}`);
    });
  }

  private registerDefaultWorkflows(): void {
    // Development workflow
    this.workflows.set('development', [
      'lint',
      'type-check',
      'build',
      'test'
    ]);

    // Quality assurance workflow
    this.workflows.set('quality', [
      'lint',
      'type-check',
      'test',
      'build',
      'audit'
    ]);

    // Full CI/CD workflow
    this.workflows.set('full', [
      'lint',
      'type-check',
      'test',
      'build',
      'audit',
      'deploy'
    ]);

    // Quick check workflow
    this.workflows.set('quick', [
      'lint',
      'type-check'
    ]);
  }

  async executeWorkflow(workflowName: string): Promise<WorkflowReport> {
    const taskIds = this.workflows.get(workflowName);
    if (!taskIds) {
      throw new Error(`Workflow '${workflowName}' not found`);
    }

    const startTime = new Date();
    // eslint-disable-next-line no-console
    console.log(`🚀 Starting workflow: ${workflowName}`);

    try {
      // Get tasks for this workflow
      const tasks = taskIds.map(id => ProjectTasks.getTask(id)).filter((task): task is Task => task !== undefined);
      
      if (tasks.length === 0) {
        throw new Error(`No tasks found for workflow '${workflowName}'`);
      }

      // Execute tasks
      const results = await this.engine.executeWorkflow(tasks);

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      // Create workflow report
      const report: WorkflowReport = {
        id: `${workflowName}-${Date.now()}`,
        name: workflowName,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration,
        totalTasks: tasks.length,
        successfulTasks: results.filter(r => r.success).length,
        failedTasks: results.filter(r => !r.success).length,
        results,
        summary: {
          success: results.every(r => r.success),
          totalDuration: duration,
          averageTaskDuration: results.reduce((sum, r) => sum + r.duration, 0) / results.length,
          successRate: results.filter(r => r.success).length / results.length
        }
      };

      // Save report
      this.saveWorkflowReport(report);

      // eslint-disable-next-line no-console
      console.log(`✅ Workflow completed: ${workflowName}`);
      // eslint-disable-next-line no-console
      console.log(`📊 Summary: ${report.summary.success ? report.totalTasks : 0}/${report.totalTasks} tasks successful`);
      // eslint-disable-next-line no-console
      console.log(`⏱️  Total duration: ${report.duration}ms`);

      return report;

    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      // Create error report
      const report: WorkflowReport = {
        id: `${workflowName}-${Date.now()}`,
        name: workflowName,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration,
        totalTasks: 0,
        successfulTasks: 0,
        failedTasks: 1,
        results: [],
        summary: {
          success: false,
          totalDuration: duration,
          averageTaskDuration: 0,
          successRate: 0
        }
      };

      this.saveWorkflowReport(report);

      // eslint-disable-next-line no-console
      console.error(`❌ Workflow failed: ${workflowName}`);
      // eslint-disable-next-line no-console
      console.error(`💥 Error: ${error instanceof Error ? error.message : String(error)}`);

      throw error;
    }
  }

  async executeTask(taskId: string): Promise<TaskResult> {
    const task = ProjectTasks.getTask(taskId);
    if (!task) {
      throw new Error(`Task '${taskId}' not found`);
    }

    // eslint-disable-next-line no-console
    console.log(`🚀 Executing task: ${task.name}`);
    
    try {
      const result = await this.engine.executeTask(task);
      
      // Save task report
      this.saveTaskReport(result);
      
      // eslint-disable-next-line no-console
      console.log(`✅ Task completed: ${task.name}`);
      
      return result;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`❌ Task failed: ${task.name}`);
      // eslint-disable-next-line no-console
      console.error(`💥 Error: ${error instanceof Error ? error.message : String(error)}`);
      
      throw error;
    }
  }

  private saveTaskReport(result: TaskResult): void {
    try {
      const reportPath = join(this.reportsDir, `task-${result.taskId}-${Date.now()}.json`);
      writeFileSync(reportPath, JSON.stringify(result, null, 2));
      // eslint-disable-next-line no-console
      console.log(`📄 Task report saved: ${reportPath}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to save task report: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private saveWorkflowReport(report: WorkflowReport): void {
    try {
      const reportPath = join(this.reportsDir, `workflow-${report.id}.json`);
      writeFileSync(reportPath, JSON.stringify(report, null, 2));
      // eslint-disable-next-line no-console
      console.log(`📄 Workflow report saved: ${reportPath}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to save workflow report: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  getAvailableWorkflows(): string[] {
    return Array.from(this.workflows.keys());
  }

  getWorkflowTasks(workflowName: string): string[] {
    return this.workflows.get(workflowName) || [];
  }

  async getSystemStatus(): Promise<{
    activeTasks: number;
    completedTasks: number;
    taskQueue: number;
  }> {
    const activeTasks = this.engine.getActiveTasks();
    const completedTasks = this.engine.getCompletedTasks();
    const taskQueue = this.engine['taskQueue'].length;
    
    return {
      activeTasks: activeTasks.length,
      completedTasks: completedTasks.length,
      taskQueue
    };
  }

  async shutdown(): Promise<void> {
    await this.engine.stopAllTasks();
  }
}
