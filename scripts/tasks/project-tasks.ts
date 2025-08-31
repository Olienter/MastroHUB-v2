import { Task } from '../core/automation-engine';

export class ProjectTasks {
  static getLintTask(): Task {
    return {
      id: 'lint-project',
      name: 'ESLint Check',
      command: 'pnpm',
      args: ['run', 'lint'],
      timeout: 300000, // 5 minutes
      retries: 1
    };
  }

  static getTypeCheckTask(): Task {
    return {
      id: 'type-check',
      name: 'TypeScript Check',
      command: 'pnpm',
      args: ['run', 'type-check'],
      timeout: 120000, // 2 minutes
      retries: 1
    };
  }

  static getBuildTask(): Task {
    return {
      id: 'build-project',
      name: 'Next.js Build',
      command: 'pnpm',
      args: ['run', 'build'],
      timeout: 600000, // 10 minutes
      retries: 1,
      dependencies: ['type-check'] // Must run after type check
    };
  }

  static getTestTask(): Task {
    return {
      id: 'run-tests',
      name: 'Playwright Tests',
      command: 'pnpm',
      args: ['run', 'test'],
      timeout: 900000, // 15 minutes
      retries: 1,
      dependencies: ['build-project'] // Must run after build
    };
  }

  static getFormatTask(): Task {
    return {
      id: 'format-code',
      name: 'Prettier Format',
      command: 'pnpm',
      args: ['run', 'format'],
      timeout: 60000, // 1 minute
      retries: 0
    };
  }

  static getLintFixTask(): Task {
    return {
      id: 'lint-fix',
      name: 'ESLint Auto-fix',
      command: 'pnpm',
      args: ['run', 'lint:fix'],
      timeout: 300000, // 5 minutes
      retries: 1
    };
  }

  static getHealthCheckTask(): Task {
    return {
      id: 'health-check',
      name: 'Project Health Check',
      command: 'pnpm',
      args: ['run', 'health:check'],
      timeout: 600000, // 10 minutes
      retries: 1,
      dependencies: ['lint-project', 'type-check', 'build-project']
    };
  }

  static getPerformanceMonitorTask(): Task {
    return {
      id: 'performance-monitor',
      name: 'Performance Monitoring',
      command: 'pnpm',
      args: ['run', 'perf:monitor'],
      timeout: 300000, // 5 minutes
      retries: 1
    };
  }

  static getMCPDiagnosticTask(): Task {
    return {
      id: 'mcp-diagnostic',
      name: 'MCP Server Diagnostic',
      command: 'pnpm',
      args: ['run', 'diag:mcp'],
      timeout: 120000, // 2 minutes
      retries: 1
    };
  }

  static getCleanTask(): Task {
    return {
      id: 'clean-project',
      name: 'Clean Project',
      command: 'pnpm',
      args: ['run', 'clean:win'],
      timeout: 120000, // 2 minutes
      retries: 0
    };
  }

  static getInstallTask(): Task {
    return {
      id: 'install-deps',
      name: 'Install Dependencies',
      command: 'pnpm',
      args: ['install'],
      timeout: 300000, // 5 minutes
      retries: 1,
      dependencies: ['clean-project']
    };
  }

  static getDevSetupTask(): Task {
    return {
      id: 'dev-setup',
      name: 'Development Setup',
      command: 'pnpm',
      args: ['run', 'setup:dev'],
      timeout: 900000, // 15 minutes
      retries: 1,
      dependencies: ['install-deps']
    };
  }

  // Predefined workflows
  static getDevelopmentWorkflow(): Task[] {
    return [
      this.getLintTask(),
      this.getTypeCheckTask(),
      this.getBuildTask(),
      this.getTestTask()
    ];
  }

  static getQualityWorkflow(): Task[] {
    return [
      this.getLintTask(),
      this.getTypeCheckTask(),
      this.getFormatTask(),
      this.getLintFixTask(),
      this.getBuildTask(),
      this.getHealthCheckTask()
    ];
  }

  static getFullWorkflow(): Task[] {
    return [
      this.getCleanTask(),
      this.getInstallTask(),
      this.getLintTask(),
      this.getTypeCheckTask(),
      this.getFormatTask(),
      this.getLintFixTask(),
      this.getBuildTask(),
      this.getTestTask(),
      this.getHealthCheckTask(),
      this.getPerformanceMonitorTask(),
      this.getMCPDiagnosticTask()
    ];
  }

  static getQuickCheckWorkflow(): Task[] {
    return [
      this.getLintTask(),
      this.getTypeCheckTask(),
      this.getBuildTask()
    ];
  }

  // Get task by ID
  static getTask(taskId: string): Task | undefined {
    const taskMap: Record<string, () => Task> = {
      'lint': this.getLintTask,
      'type-check': this.getTypeCheckTask,
      'build': this.getBuildTask,
      'test': this.getTestTask,
      'format': this.getFormatTask,
      'lint-fix': this.getLintFixTask,
      'health-check': this.getHealthCheckTask,
      'performance-monitor': this.getPerformanceMonitorTask,
      'mcp-diagnostic': this.getMCPDiagnosticTask,
      'clean': this.getCleanTask,
      'install': this.getInstallTask,
      'dev-setup': this.getDevSetupTask
    };

    const taskGetter = taskMap[taskId];
    return taskGetter ? taskGetter() : undefined;
  }
}
