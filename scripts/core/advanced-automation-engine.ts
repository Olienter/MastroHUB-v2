import { EventEmitter } from 'events';
import { spawn } from 'child_process';
import * as os from 'os';

// ===== ADVANCED INTERFACES =====
export interface AdvancedTask extends Task {
  priority: 'low' | 'normal' | 'high' | 'critical';
  resourceRequirements: {
    minCpu: number;
    minMemory: number;
    maxConcurrency: number;
  };
  healthChecks: string[];
  rollbackStrategy?: 'none' | 'restart' | 'revert' | 'custom';
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeProcesses: number;
  timestamp: string;
}

export interface AdvancedTaskResult extends TaskResult {
  systemMetrics: SystemMetrics;
  resourceConsumption: {
    cpuTime: number;
    memoryPeak: number;
    diskIO: number;
  };
  healthCheckResults: {
    [checkId: string]: boolean;
  };
}

export class AdvancedAutomationEngine extends EventEmitter {
  private taskQueue: AdvancedTask[] = [];
  private activeTasks: Map<string, TaskExecution> = new Map();
  private completedTasks: Map<string, AdvancedTaskResult> = new Map();
  private systemMetrics: SystemMetrics[] = [];
  private maxConcurrency: number;
  private resourceMonitor!: NodeJS.Timeout;

  constructor(maxConcurrency = 4) {
    super();
    this.maxConcurrency = maxConcurrency;
    this.startResourceMonitoring();
  }

  // ===== RESOURCE MONITORING =====
  private startResourceMonitoring(): void {
    this.resourceMonitor = setInterval(() => {
      const metrics = this.collectSystemMetrics();
      this.systemMetrics.push(metrics);
      
      // Keep only last 100 metrics
      if (this.systemMetrics.length > 100) {
        this.systemMetrics.shift();
      }
      
      this.emit('system:metrics', metrics);
    }, 1000);
  }

  private collectSystemMetrics(): SystemMetrics {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;
    
    return {
      cpuUsage: os.loadavg()[0] * 100, // 1 minute average
      memoryUsage,
      diskUsage: 0, // Would need disk-usage package
      activeProcesses: this.activeTasks.size,
      timestamp: new Date().toISOString()
    };
  }

  // ===== INTELLIGENT TASK SCHEDULING =====
  private canExecuteTask(task: AdvancedTask): boolean {
    const currentMetrics = this.systemMetrics[this.systemMetrics.length - 1];
    if (!currentMetrics) return true;

    // Check resource requirements
    if (currentMetrics.cpuUsage > (100 - task.resourceRequirements.minCpu)) {
      return false;
    }
    
    if (currentMetrics.memoryUsage > (100 - task.resourceRequirements.minMemory)) {
      return false;
    }
    
    if (this.activeTasks.size >= task.resourceRequirements.maxConcurrency) {
      return false;
    }
    
    return true;
  }

  // ===== PARALLEL EXECUTION =====
  async executeWorkflowParallel(tasks: AdvancedTask[]): Promise<AdvancedTaskResult[]> {
    // Sort by priority and dependencies
    const sortedTasks = this.sortTasksByPriority(tasks);
    
    const results: AdvancedTaskResult[] = [];
    const executing: Promise<AdvancedTaskResult>[] = [];
    
    for (const task of sortedTasks) {
      // Wait if we can't execute more tasks
      while (executing.length >= this.maxConcurrency || !this.canExecuteTask(task)) {
        if (executing.length > 0) {
          try {
            const completed = await Promise.race(executing);
            const index = executing.findIndex(p => p === Promise.resolve(completed));
            if (index !== -1) {
              executing.splice(index, 1);
              results.push(completed);
            }
          } catch {
            // Remove failed task from executing array
            executing.splice(0, 1);
          }
        } else {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // Execute task
      const taskPromise = this.executeAdvancedTask(task);
      executing.push(taskPromise);
    }
    
    // Wait for remaining tasks
    try {
      const remainingResults = await Promise.all(executing);
      return [...results, ...remainingResults];
    } catch {
      // Return partial results if some tasks failed
      return results;
    }
  }

  // ===== SMART RETRY WITH EXPONENTIAL BACKOFF =====
  private async executeAdvancedTask(task: AdvancedTask): Promise<AdvancedTaskResult> {
    let attempt = 0;
    const maxAttempts = task.retries || 3;
    
    while (attempt < maxAttempts) {
      try {
        const result = await this.executeTask();
        return this.enhanceTaskResult(result);
      } catch (error) {
        attempt++;
        
        if (attempt >= maxAttempts) {
          throw error;
        }
        
        // Exponential backoff: 1s, 2s, 4s, 8s
        const delay = Math.pow(2, attempt - 1) * 1000;
        this.emit('task:retry', { taskId: task.id, attempt, delay, error });
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error(`Task ${task.id} failed after ${maxAttempts} attempts`);
  }

  // ===== HEALTH CHECKS =====
  private async runHealthChecks(task: AdvancedTask): Promise<{ [checkId: string]: boolean }> {
    const results: { [checkId: string]: boolean } = {};
    
    for (const check of task.healthChecks) {
      try {
        // Execute health check command
        const result = await this.executeHealthCheck(check);
        results[check] = result;
      } catch {
        results[check] = false;
      }
    }
    
    return results;
  }

  private async executeHealthCheck(check: string): Promise<boolean> {
    // Simple health check implementation
    // Could be extended with custom health check logic
    return new Promise((resolve) => {
      const process = spawn(check, [], { shell: true });
      
      process.on('close', (code) => {
        resolve(code === 0);
      });
      
      process.on('error', () => {
        resolve(false);
      });
      
      // Timeout after 5 seconds
      setTimeout(() => {
        process.kill();
        resolve(false);
      }, 5000);
    });
  }

  // ===== ROLLBACK STRATEGIES =====
  private async executeRollback(_task: AdvancedTask): Promise<void> {
    switch (_task.rollbackStrategy) {
      case 'restart':
        await this.restartTask(_task);
        break;
      case 'revert':
        await this.revertTask(_task);
        break;
      case 'custom':
        await this.executeCustomRollback(_task);
        break;
      default:
        // No rollback
        break;
    }
  }

  private async restartTask(task: AdvancedTask): Promise<void> {
    this.emit('task:rollback:restart', { taskId: task.id });
    // Implementation would depend on task type
  }

  private async revertTask(task: AdvancedTask): Promise<void> {
    this.emit('task:rollback:revert', { taskId: task.id });
    // Implementation would depend on task type
  }

  private async executeCustomRollback(task: AdvancedTask): Promise<void> {
    this.emit('task:rollback:custom', { taskId: task.id });
    // Implementation would depend on task type
  }

  // ===== UTILITY METHODS =====
  private sortTasksByPriority(tasks: AdvancedTask[]): AdvancedTask[] {
    const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
    
    return tasks.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // If same priority, sort by dependencies
      if (a.dependencies && b.dependencies) {
        return a.dependencies.length - b.dependencies.length;
      }
      
      return 0;
    });
  }

  private enhanceTaskResult(result: TaskResult): AdvancedTaskResult {
    const currentMetrics = this.systemMetrics[this.systemMetrics.length - 1];
    
    return {
      ...result,
      systemMetrics: currentMetrics || {
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        activeProcesses: 0,
        timestamp: new Date().toISOString()
      },
      resourceConsumption: {
        cpuTime: result.duration,
        memoryPeak: 0, // Would need process monitoring
        diskIO: 0 // Would need disk monitoring
      },
      healthCheckResults: {} // Would be populated by health checks
    };
  }

  // ===== CLEANUP =====
  async shutdown(): Promise<void> {
    if (this.resourceMonitor) {
      clearInterval(this.resourceMonitor);
    }
    
    await this.stopAllTasks();
  }

  private async stopAllTasks(): Promise<void> {
    // Implementation for stopping all tasks
    this.activeTasks.clear();
  }

  private async executeTask(): Promise<TaskResult> {
    // Placeholder implementation
    throw new Error('executeTask not implemented in AdvancedAutomationEngine');
  }
}

// Re-export base types for compatibility
export interface Task {
  id: string;
  name: string;
  command: string;
  args: string[];
  timeout?: number;
  retries?: number;
  dependencies?: string[];
}

export interface TaskResult {
  taskId: string;
  success: boolean;
  exitCode: number;
  output: string;
  errorOutput: string;
  duration: number;
  timestamp: string;
}

export interface TaskExecution {
  task: Task;
  process: unknown;
  startTime: number;
  output: string;
  errorOutput: string;
}
