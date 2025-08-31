import { EventEmitter } from 'events';
import { spawn, SpawnOptions } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

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

export class AutomationEngine extends EventEmitter {
  private taskQueue: Task[] = [];
  private activeTasks: Map<string, TaskExecution> = new Map();
  private completedTasks: Map<string, TaskResult> = new Map();
  private reportsDir: string;

  constructor() {
    super();
    this.reportsDir = '.ai/automation-reports';
    this.ensureReportsDir();
  }

  private ensureReportsDir() {
    try {
      mkdirSync(this.reportsDir, { recursive: true });
    } catch {
      // Directory already exists
    }
  }

  async addTask(task: Task): Promise<void> {
    this.taskQueue.push(task);
    this.emit('task:added', task);
  }

  async executeTask(task: Task): Promise<TaskResult> {
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
      childProcess.stdout?.on('data', (data: Buffer) => {
        const line = data.toString();
        execution.output += line;
        
        this.emit('task:output', {
          taskId: task.id,
          type: 'stdout',
          data: line.trim()
        });
        
        // Log to console in real-time
        // eslint-disable-next-line no-console
        console.log(`[${task.name}] ${line.trim()}`);
      });

      childProcess.stderr?.on('data', (data: Buffer) => {
        const line = data.toString();
        execution.errorOutput += line;
        
        this.emit('task:error', {
          taskId: task.id,
          type: 'stderr',
          data: line.trim()
        });
        
        // Log to console in real-time
        // eslint-disable-next-line no-console
        console.error(`[${task.name}] ERROR: ${line.trim()}`);
      });

      childProcess.on('close', (code: number) => {
        const duration = Date.now() - startTime;
        const success = code === 0;
        
        const result: TaskResult = {
          taskId: task.id,
          success,
          exitCode: code,
          output: execution.output,
          errorOutput: execution.errorOutput,
          duration,
          timestamp: new Date().toISOString()
        };

        this.activeTasks.delete(task.id);
        this.completedTasks.set(task.id, result);
        
        this.emit('task:completed', result);
        
        if (success) {
          resolve(result);
        } else {
          reject(result);
        }
      });

      childProcess.on('error', (error: Error) => {
        const duration = Date.now() - startTime;
        
        const result: TaskResult = {
          taskId: task.id,
          success: false,
          exitCode: -1,
          output: execution.output,
          errorOutput: execution.errorOutput + '\n' + error.message,
          duration,
          timestamp: new Date().toISOString()
        };

        this.activeTasks.delete(task.id);
        this.completedTasks.set(task.id, result);
        
        this.emit('task:failed', result);
        reject(result);
      });

      // Timeout handling
      if (task.timeout) {
        setTimeout(() => {
          if (this.activeTasks.has(task.id)) {
            childProcess.kill('SIGTERM');
            this.emit('task:timeout', { taskId: task.id, timeout: task.timeout });
          }
        }, task.timeout);
      }
    });
  }

  async executeWorkflow(tasks: Task[]): Promise<TaskResult[]> {
    const results: TaskResult[] = [];
    
    for (const task of tasks) {
      try {
        // Check dependencies
        if (task.dependencies) {
          for (const depId of task.dependencies) {
            const depResult = this.completedTasks.get(depId);
            if (!depResult || !depResult.success) {
              throw new Error(`Dependency ${depId} failed or not completed`);
            }
          }
        }
        
        const result = await this.executeTask(task);
        results.push(result);
        
        // Save report
        this.saveTaskReport(result);
        
      } catch (error) {
        const result = error as TaskResult;
        results.push(result);
        
        // Save error report
        this.saveTaskReport(result);
        
        // Decide if we should continue
        if (task.retries && task.retries > 0) {
          // eslint-disable-next-line no-console
        console.log(`Retrying task ${task.name}...`);
          task.retries--;
          const retryResult = await this.executeTask(task);
          results.push(retryResult);
        }
      }
    }
    
    return results;
  }

  private saveTaskReport(result: TaskResult): void {
    const filename = `${result.taskId}-${Date.now()}.json`;
    const filepath = join(this.reportsDir, filename);
    
    writeFileSync(filepath, JSON.stringify(result, null, 2), 'utf8');
    // eslint-disable-next-line no-console
    console.log(`📄 Task report saved: ${filepath}`);
  }

  getActiveTasks(): TaskExecution[] {
    return Array.from(this.activeTasks.values());
  }

  getCompletedTasks(): TaskResult[] {
    return Array.from(this.completedTasks.values());
  }

  getTaskStatus(taskId: string): 'queued' | 'running' | 'completed' | 'failed' | 'unknown' {
    if (this.activeTasks.has(taskId)) return 'running';
    if (this.completedTasks.has(taskId)) {
      const result = this.completedTasks.get(taskId)!;
      return result.success ? 'completed' : 'failed';
    }
    if (this.taskQueue.find(t => t.id === taskId)) return 'queued';
    return 'unknown';
  }

  async stopTask(taskId: string): Promise<boolean> {
    const execution = this.activeTasks.get(taskId);
    if (execution) {
      (execution.process as { kill: (signal: string) => void }).kill('SIGTERM');
      this.activeTasks.delete(taskId);
      return true;
    }
    return false;
  }

  async stopAllTasks(): Promise<void> {
    const taskIds = Array.from(this.activeTasks.keys());
    await Promise.all(taskIds.map(id => this.stopTask(id)));
  }
}
