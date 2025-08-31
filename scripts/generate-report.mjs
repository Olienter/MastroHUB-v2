#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

class TerminalReporter {
  constructor() {
    this.reportsDir = '.ai/reports';
    this.ensureReportsDir();
  }

  ensureReportsDir() {
    try {
      mkdirSync(this.reportsDir, { recursive: true });
    } catch (error) {
      console.log('Reports directory already exists');
    }
  }

  async generateLintReport() {
    console.log('🔍 Generating ESLint report...');
    
    try {
      const output = execSync('pnpm run lint', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const report = {
        timestamp: new Date().toISOString(),
        command: 'pnpm run lint',
        exitCode: 0,
        output: output,
        summary: {
          totalProblems: 0,
          errors: 0,
          warnings: 0
        }
      };

      this.saveReport('eslint-report.json', report);
      console.log('✅ ESLint report generated successfully');
      return report;
      
    } catch (error) {
      const output = error.stdout?.toString() || error.stderr?.toString() || 'No output';
      const exitCode = error.status || 1;
      
      // Parse ESLint output for summary
      const lines = output.split('\n');
      let totalProblems = 0;
      let errors = 0;
      let warnings = 0;
      
      for (const line of lines) {
        if (line.includes('error')) errors++;
        if (line.includes('warning')) warnings++;
        if (line.includes('✖') && line.includes('problems')) {
          const match = line.match(/(\d+) problems/);
          if (match) totalProblems = parseInt(match[1]);
        }
      }
      
      const report = {
        timestamp: new Date().toISOString(),
        command: 'pnpm run lint',
        exitCode: exitCode,
        output: output,
        summary: {
          totalProblems,
          errors,
          warnings
        },
        error: error.message
      };

      this.saveReport('eslint-report.json', report);
      console.log(`⚠️ ESLint report generated with ${exitCode} exit code`);
      return report;
    }
  }

  async generateBuildReport() {
    console.log('🔨 Generating build report...');
    
    try {
      const output = execSync('pnpm run build', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const report = {
        timestamp: new Date().toISOString(),
        command: 'pnpm run build',
        exitCode: 0,
        output: output,
        summary: {
          status: 'success',
          pagesGenerated: 0,
          bundleSize: '0 kB'
        }
      };

      // Parse build output for summary
      const lines = output.split('\n');
      for (const line of lines) {
        if (line.includes('Generating static pages')) {
          const match = line.match(/\((\d+)\/(\d+)\)/);
          if (match) report.summary.pagesGenerated = parseInt(match[2]);
        }
        if (line.includes('First Load JS shared by all')) {
          const match = line.match(/(\d+\.\d+ kB)/);
          if (match) report.summary.bundleSize = match[1];
        }
      }

      this.saveReport('build-report.json', report);
      console.log('✅ Build report generated successfully');
      return report;
      
    } catch (error) {
      const output = error.stdout?.toString() || error.stderr?.toString() || 'No output';
      const exitCode = error.status || 1;
      
      const report = {
        timestamp: new Date().toISOString(),
        command: 'pnpm run build',
        exitCode: exitCode,
        output: output,
        summary: {
          status: 'failed',
          error: error.message
        }
      };

      this.saveReport('build-report.json', report);
      console.log(`❌ Build report generated with ${exitCode} exit code`);
      return report;
    }
  }

  async generateTypeCheckReport() {
    console.log('🔍 Generating TypeScript check report...');
    
    try {
      const output = execSync('pnpm run type-check', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const report = {
        timestamp: new Date().toISOString(),
        command: 'pnpm run type-check',
        exitCode: 0,
        output: output,
        summary: {
          status: 'success',
          typeErrors: 0
        }
      };

      this.saveReport('typescript-report.json', report);
      console.log('✅ TypeScript report generated successfully');
      return report;
      
    } catch (error) {
      const output = error.stdout?.toString() || error.stderr?.toString() || 'No output';
      const exitCode = error.status || 1;
      
      const report = {
        timestamp: new Date().toISOString(),
        command: 'pnpm run type-check',
        exitCode: exitCode,
        output: output,
        summary: {
          status: 'failed',
          error: error.message
        }
      };

      this.saveReport('typescript-report.json', report);
      console.log(`❌ TypeScript report generated with ${exitCode} exit code`);
      return report;
    }
  }

  async generateFullReport() {
    console.log('📊 Generating comprehensive project report...');
    
    const reports = {
      timestamp: new Date().toISOString(),
      project: 'MastroHUB v2',
      lint: await this.generateLintReport(),
      build: await this.generateBuildReport(),
      typescript: await this.generateTypeCheckReport()
    };

    this.saveReport('full-project-report.json', reports);
    console.log('✅ Full project report generated successfully');
    return reports;
  }

  saveReport(filename, data) {
    const filepath = join(this.reportsDir, filename);
    writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`📄 Report saved to: ${filepath}`);
  }

  displayReportSummary(report) {
    console.log('\n📊 REPORT SUMMARY:');
    console.log('='.repeat(50));
    
    if (report.lint) {
      console.log(`🔍 ESLint: ${report.lint.summary.totalProblems} problems (${report.lint.summary.errors} errors, ${report.lint.summary.warnings} warnings)`);
    }
    
    if (report.build) {
      console.log(`🔨 Build: ${report.build.summary.status} (${report.build.summary.pagesGenerated || 0} pages)`);
    }
    
    if (report.typescript) {
      console.log(`🔍 TypeScript: ${report.typescript.summary.status}`);
    }
    
    console.log('='.repeat(50));
  }
}

// Main execution
async function main() {
  const reporter = new TerminalReporter();
  
  try {
    const fullReport = await reporter.generateFullReport();
    reporter.displayReportSummary(fullReport);
  } catch (error) {
    console.error('❌ Error generating report:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { TerminalReporter };
