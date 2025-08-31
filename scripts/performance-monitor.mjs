#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PERFORMANCE_LOG = '.ai/performance-log.json';

class PerformanceMonitor {
  constructor() {
    this.ensureLogFile();
  }

  ensureLogFile() {
    const logDir = path.dirname(PERFORMANCE_LOG);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    if (!fs.existsSync(PERFORMANCE_LOG)) {
      fs.writeFileSync(PERFORMANCE_LOG, JSON.stringify([], null, 2));
    }
  }

  async measureBuildTime() {
    console.log('🏗️  Measuring build time...');
    const startTime = Date.now();
    
    try {
      execSync('pnpm run build', { stdio: 'pipe' });
      const buildTime = Date.now() - startTime;
      
      console.log(`✅ Build completed in ${buildTime}ms`);
      return { type: 'build', duration: buildTime, success: true };
    } catch (error) {
      const buildTime = Date.now() - startTime;
      console.log(`❌ Build failed after ${buildTime}ms`);
      return { type: 'build', duration: buildTime, success: false, error: error.message };
    }
  }

  async measureLintTime() {
    console.log('🔍 Measuring lint time...');
    const startTime = Date.now();
    
    try {
      execSync('pnpm run lint', { stdio: 'pipe' });
      const lintTime = Date.now() - startTime;
      
      console.log(`✅ Lint completed in ${lintTime}ms`);
      return { type: 'lint', duration: lintTime, success: true };
    } catch (error) {
      const lintTime = Date.now() - startTime;
      console.log(`❌ Lint failed after ${lintTime}ms`);
      return { type: 'lint', duration: lintTime, success: false, error: error.message };
    }
  }

  async measureTypeCheckTime() {
    console.log('📝 Measuring type check time...');
    const startTime = Date.now();
    
    try {
      execSync('pnpm run type-check', { stdio: 'pipe' });
      const typeCheckTime = Date.now() - startTime;
      
      console.log(`✅ Type check completed in ${typeCheckTime}ms`);
      return { type: 'type-check', duration: typeCheckTime, success: true };
    } catch (error) {
      const typeCheckTime = Date.now() - startTime;
      console.log(`❌ Type check failed after ${typeCheckTime}ms`);
      return { type: 'type-check', duration: typeCheckTime, success: false, error: error.message };
    }
  }

  async getBundleSize() {
    try {
      if (fs.existsSync('.next')) {
        const stats = fs.statSync('.next');
        return { type: 'bundle-size', size: stats.size, success: true };
      }
      return { type: 'bundle-size', size: 0, success: false, error: 'No build found' };
    } catch (error) {
      return { type: 'bundle-size', size: 0, success: false, error: error.message };
    }
  }

  logPerformance(metrics) {
    const logs = JSON.parse(fs.readFileSync(PERFORMANCE_LOG, 'utf8'));
    const logEntry = {
      timestamp: new Date().toISOString(),
      metrics
    };
    
    logs.push(logEntry);
    
    // Keep only last 100 entries
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    fs.writeFileSync(PERFORMANCE_LOG, JSON.stringify(logs, null, 2));
  }

  generateReport() {
    const logs = JSON.parse(fs.readFileSync(PERFORMANCE_LOG, 'utf8'));
    
    if (logs.length === 0) {
      console.log('📊 No performance data available');
      return;
    }

    const recentLogs = logs.slice(-10);
    
    console.log('\n📊 Performance Report (Last 10 runs):');
    console.log('=====================================');
    
    const buildTimes = recentLogs
      .flatMap(log => log.metrics.filter(m => m.type === 'build' && m.success))
      .map(m => m.duration);
    
    const lintTimes = recentLogs
      .flatMap(log => log.metrics.filter(m => m.type === 'lint' && m.success))
      .map(m => m.duration);
    
    const typeCheckTimes = recentLogs
      .flatMap(log => log.metrics.filter(m => m.type === 'type-check' && m.success))
      .map(m => m.duration);

    if (buildTimes.length > 0) {
      const avgBuildTime = Math.round(buildTimes.reduce((a, b) => a + b, 0) / buildTimes.length);
      console.log(`🏗️  Average Build Time: ${avgBuildTime}ms`);
    }
    
    if (lintTimes.length > 0) {
      const avgLintTime = Math.round(lintTimes.reduce((a, b) => a + b, 0) / lintTimes.length);
      console.log(`🔍 Average Lint Time: ${avgLintTime}ms`);
    }
    
    if (typeCheckTimes.length > 0) {
      const avgTypeCheckTime = Math.round(typeCheckTimes.reduce((a, b) => a + b, 0) / typeCheckTimes.length);
      console.log(`📝 Average Type Check Time: ${avgTypeCheckTime}ms`);
    }
  }

  async runFullAnalysis() {
    console.log('🚀 Starting Performance Analysis...\n');
    
    const metrics = [];
    
    // Measure all metrics
    metrics.push(await this.measureBuildTime());
    metrics.push(await this.measureLintTime());
    metrics.push(await this.measureTypeCheckTime());
    metrics.push(await this.getBundleSize());
    
    // Log results
    this.logPerformance(metrics);
    
    // Generate report
    this.generateReport();
    
    console.log('\n✅ Performance analysis completed!');
    console.log(`📁 Results saved to: ${PERFORMANCE_LOG}`);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new PerformanceMonitor();
  monitor.runFullAnalysis();
}

export { PerformanceMonitor };
