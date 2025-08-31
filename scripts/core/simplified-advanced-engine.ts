import { EventEmitter } from 'events';
import { spawn, SpawnOptions, ChildProcess } from 'child_process';
import * as os from 'os';

// ===== SIMPLIFIED INTERFACES =====
export interface SimplifiedTask {
  id: string;
  name: string;
  command: string;
  args: string[];
  timeout?: number;
  retries?: number;
  dependencies?: string[];
  priority: 'low' | 'normal' | 'high' | 'critical';
  maxConcurrency?: number;
}

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeProcesses: number;
  timestamp: string;
}

export interface SimplifiedTaskResult {
  taskId: string;
  success: boolean;
  exitCode: number;
  output: string;
  errorOutput: string;
  duration: number;
  timestamp: string;
  systemMetrics: SystemMetrics;
  attempts: number;
}

export interface TaskExecution {
  task: SimplifiedTask;
  process: ChildProcess;
  startTime: number;
  output: string;
  errorOutput: string;
}

// ===== SIMPLIFIED ADVANCED AUTOMATION ENGINE =====
export class SimplifiedAdvancedEngine extends EventEmitter {
  private taskQueue: SimplifiedTask[] = [];
  private activeTasks: Map<string, TaskExecution> = new Map();
  private completedTasks: Map<string, SimplifiedTaskResult> = new Map();
  private systemMetrics: SystemMetrics[] = [];
  private maxConcurrency: number;
  private resourceMonitor!: NodeJS.Timeout;

  constructor(maxConcurrency = 4) {
    super();
    this.maxConcurrency = maxConcurrency;
    this.startResourceMonitoring();
  }

  // ===== RESOURCE MONITORING (100% POSSIBLE) =====
  private startResourceMonitoring(): void {
    this.resourceMonitor = setInterval(() => {
      const metrics = this.collectSystemMetrics();
      this.systemMetrics.push(metrics);
      
      // Keep only last 50 metrics (memory efficient)
      if (this.systemMetrics.length > 50) {
        this.systemMetrics.shift();
      }
      
      this.emit('system:metrics', metrics);
    }, 2000); // Every 2 seconds (less aggressive)
  }

  private collectSystemMetrics(): SystemMetrics {
    try {
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const memoryUsage = ((totalMemory - freeMemory) / totalMemory) * 100;
      
      // Windows-compatible CPU usage (loadavg might not work on Windows)
      let cpuUsage = 0;
      try {
        const loadAvg = os.loadavg();
        cpuUsage = loadAvg[0] * 100; // 1 minute average
      } catch {
        // Windows fallback - estimate based on active processes
        cpuUsage = Math.min(this.activeTasks.size * 25, 100);
      }
      
      return {
        cpuUsage: Math.round(cpuUsage),
        memoryUsage: Math.round(memoryUsage),
        activeProcesses: this.activeTasks.size,
        timestamp: new Date().toISOString()
      };
    } catch {
      // Fallback metrics
      return {
        cpuUsage: 0,
        memoryUsage: 0,
        activeProcesses: this.activeTasks.size,
        timestamp: new Date().toISOString()
      };
    }
  }

  // ===== INTELLIGENT TASK SCHEDULING (100% POSSIBLE) =====
  private canExecuteTask(task: SimplifiedTask): boolean {
    const currentMetrics = this.systemMetrics[this.systemMetrics.length - 1];
    if (!currentMetrics) return true;

    // Simple resource checks
    if (currentMetrics.memoryUsage > 90) {
      return false; // Too much memory usage
    }
    
    if (this.activeTasks.size >= (task.maxConcurrency || this.maxConcurrency)) {
      return false; // Max concurrency reached
    }
    
    return true;
  }

  // ===== PARALLEL EXECUTION (100% POSSIBLE) =====
  async executeWorkflowParallel(tasks: SimplifiedTask[]): Promise<SimplifiedTaskResult[]> {
    // Sort by priority
    const sortedTasks = this.sortTasksByPriority(tasks);
    
    const results: SimplifiedTaskResult[] = [];
    const executing: Promise<SimplifiedTaskResult>[] = [];
    
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
      const taskPromise = this.executeSimplifiedTask(task);
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

  // ===== SMART RETRY WITH EXPONENTIAL BACKOFF (100% POSSIBLE) =====
  private async executeSimplifiedTask(task: SimplifiedTask): Promise<SimplifiedTaskResult> {
    let attempt = 0;
    const maxAttempts = task.retries || 3;
    
    while (attempt < maxAttempts) {
      try {
        const result = await this.executeTask(task);
        return this.enhanceTaskResult(result, task, attempt + 1);
      } catch (error) {
        attempt++;
        
        if (attempt >= maxAttempts) {
          throw error;
        }
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.min(Math.pow(2, attempt - 1) * 1000, 10000); // Max 10s delay
        this.emit('task:retry', { taskId: task.id, attempt, delay, error });
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error(`Task ${task.id} failed after ${maxAttempts} attempts`);
  }

  // ===== BASIC TASK EXECUTION (100% POSSIBLE) =====
  private async executeTask(task: SimplifiedTask): Promise<SimplifiedTaskResult> {
    const startTime = Date.now();
    
    this.emit('task:started', task);
    
    return new Promise((resolve, reject) => {
      const options: SpawnOptions = {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true,
        cwd: process.cwd()
      };

      const childProcess = spawn(task.command, task.args, options);
      
      const execution: TaskExecution = {
        task,
        process: childProcess,
        startTime,
        output: '',
        errorOutput: ''
      };

      this.activeTasks.set(task.id, execution);

      // Real-time output streaming
      if (childProcess.stdout) {
        childProcess.stdout.on('data', (data: Buffer) => {
          const line = data.toString();
          execution.output += line;
          
          this.emit('task:output', {
            taskId: task.id,
            type: 'stdout',
            data: line.trim()
          });
        });
      }

      if (childProcess.stderr) {
        childProcess.stderr.on('data', (data: Buffer) => {
          const line = data.toString();
          execution.errorOutput += line;
          
          this.emit('task:output', {
            taskId: task.id,
            type: 'stderr',
            data: line.trim()
          });
        });
      }

      childProcess.on('close', (code: number) => {
        const duration = Date.now() - startTime;
        this.activeTasks.delete(task.id);
        
        const result: SimplifiedTaskResult = {
          taskId: task.id,
          success: code === 0,
          exitCode: code,
          output: execution.output,
          errorOutput: execution.errorOutput,
          duration,
          timestamp: new Date().toISOString(),
          systemMetrics: this.getCurrentMetrics(),
          attempts: 1
        };
        
        this.completedTasks.set(task.id, result);
        this.emit('task:completed', result);
        
        resolve(result);
      });

      childProcess.on('error', (error: Error) => {
        const duration = Date.now() - startTime;
        this.activeTasks.delete(task.id);
        
        const result: SimplifiedTaskResult = {
          taskId: task.id,
          success: false,
          exitCode: -1,
          output: execution.output,
          errorOutput: error.message,
          duration,
          timestamp: new Date().toISOString(),
          systemMetrics: this.getCurrentMetrics(),
          attempts: 1
        };
        
        this.completedTasks.set(task.id, result);
        this.emit('task:failed', result);
        
        reject(error);
      });

      // Timeout handling
      if (task.timeout) {
        setTimeout(() => {
          if (childProcess && !childProcess.killed) {
            childProcess.kill('SIGTERM');
            reject(new Error(`Task ${task.id} timed out after ${task.timeout}ms`));
          }
        }, task.timeout);
      }
    });
  }

  // ===== UTILITY METHODS (100% POSSIBLE) =====
  private sortTasksByPriority(tasks: SimplifiedTask[]): SimplifiedTask[] {
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

  private enhanceTaskResult(result: SimplifiedTaskResult, task: SimplifiedTask, attempts: number): SimplifiedTaskResult {
    return {
      ...result,
      attempts,
      systemMetrics: this.getCurrentMetrics()
    };
  }

  private getCurrentMetrics(): SystemMetrics {
    const current = this.systemMetrics[this.systemMetrics.length - 1];
    return current || {
      cpuUsage: 0,
      memoryUsage: 0,
      activeProcesses: this.activeTasks.size,
      timestamp: new Date().toISOString()
    };
  }

  // ===== PUBLIC API (100% POSSIBLE) =====
  async addTask(task: SimplifiedTask): Promise<void> {
    this.taskQueue.push(task);
    this.emit('task:added', task);
  }

  async getSystemStatus(): Promise<{
    activeTasks: number;
    completedTasks: number;
    currentMetrics: SystemMetrics;
    taskQueue: number;
  }> {
    return {
      activeTasks: this.activeTasks.size,
      completedTasks: this.completedTasks.size,
      currentMetrics: this.getCurrentMetrics(),
      taskQueue: this.taskQueue.length
    };
  }

  async stopAllTasks(): Promise<void> {
    const entries = Array.from(this.activeTasks.entries());
    for (const [, execution] of entries) {
      try {
        execution.process.kill('SIGTERM');
      } catch {
        // Ignore errors when killing processes
      }
    }
    this.activeTasks.clear();
  }

  // ===== CLEANUP =====
  async shutdown(): Promise<void> {
    if (this.resourceMonitor) {
      clearInterval(this.resourceMonitor);
    }
    
    await this.stopAllTasks();
  }
}
