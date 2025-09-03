#!/usr/bin/env node

/**
 * MastroHUB v2 Performance Monitor
 * Real-time performance tracking and optimization
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      timestamp: new Date().toISOString(),
      system: {},
      project: {},
      automation: {},
      recommendations: []
    };
  }

  async collectSystemMetrics() {
    try {
      // CPU and Memory usage
      const systemInfo = execSync("systeminfo", { encoding: "utf8", stdio: "pipe" });
      
      // Extract relevant info
      const lines = systemInfo.split('\n');
      const totalMemory = lines.find(line => line.includes('Total Physical Memory'));
      const availableMemory = lines.find(line => line.includes('Available Physical Memory'));
      
      this.metrics.system = {
        totalMemory: totalMemory ? totalMemory.split(':')[1].trim() : 'Unknown',
        availableMemory: availableMemory ? availableMemory.split(':')[1].trim() : 'Unknown',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.metrics.system = { error: error.message };
    }
  }

  async collectProjectMetrics() {
    try {
      // Build time
      const buildStart = Date.now();
      execSync("pnpm run typecheck", { stdio: "pipe" });
      const buildTime = Date.now() - buildStart;

      // Bundle size (if .next exists)
      let bundleSize = 0;
      if (existsSync(".next")) {
        const bundleInfo = execSync("dir .next /s", { encoding: "utf8", stdio: "pipe" });
        // Extract size info (simplified)
        bundleSize = bundleInfo.length; // Simplified metric
      }

      // File count
      const fileCount = execSync("dir /s /b *.ts *.tsx *.js *.jsx | find /c /v \"\"", { 
        encoding: "utf8", 
        stdio: "pipe" 
      });

      this.metrics.project = {
        buildTime,
        bundleSize,
        fileCount: parseInt(fileCount.trim()) || 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.metrics.project = { error: error.message };
    }
  }

  async collectAutomationMetrics() {
    try {
      // Load recent automation reports
      const reportsDir = ".ai/reports";
      if (!existsSync(reportsDir)) {
        this.metrics.automation = { error: "No reports directory found" };
        return;
      }

      const fs = await import("fs");
      const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.json'));
      
      if (files.length === 0) {
        this.metrics.automation = { error: "No automation reports found" };
        return;
      }

      // Load latest report
      const latestReport = files.sort().pop();
      const reportContent = readFileSync(join(reportsDir, latestReport), 'utf8');
      const report = JSON.parse(reportContent);

      // Calculate automation metrics
      const totalDuration = report.performance?.duration_ms || 0;
      const workflowCount = Object.keys(report.workflows || {}).length;
      const errorCount = report.errors?.length || 0;

      this.metrics.automation = {
        totalDuration,
        workflowCount,
        errorCount,
        successRate: errorCount === 0 ? 100 : Math.max(0, 100 - (errorCount * 10)),
        lastRun: report.timestamp,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.metrics.automation = { error: error.message };
    }
  }

  generateRecommendations() {
    const recommendations = [];

    // Build time recommendations
    if (this.metrics.project.buildTime > 30000) {
      recommendations.push({
        type: "performance",
        priority: "high",
        message: "Build time over 30s - consider TypeScript optimization",
        metric: `Build time: ${this.metrics.project.buildTime}ms`
      });
    }

    // File count recommendations
    if (this.metrics.project.fileCount > 1000) {
      recommendations.push({
        type: "maintenance",
        priority: "medium",
        message: "High file count - consider code organization",
        metric: `Files: ${this.metrics.project.fileCount}`
      });
    }

    // Automation recommendations
    if (this.metrics.automation.totalDuration > 120000) {
      recommendations.push({
        type: "automation",
        priority: "medium",
        message: "Automation duration over 2 minutes - optimize workflows",
        metric: `Duration: ${this.metrics.automation.totalDuration}ms`
      });
    }

    if (this.metrics.automation.successRate < 90) {
      recommendations.push({
        type: "reliability",
        priority: "high",
        message: "Automation success rate below 90% - investigate failures",
        metric: `Success rate: ${this.metrics.automation.successRate}%`
      });
    }

    this.metrics.recommendations = recommendations;
  }

  async generateReport() {
    const reportFile = `.ai/reports/performance-report-${Date.now()}.json`;
    
    // Ensure reports directory exists
    const fs = await import("fs");
    if (!existsSync(".ai/reports")) {
      fs.mkdirSync(".ai/reports", { recursive: true });
    }

    writeFileSync(reportFile, JSON.stringify(this.metrics, null, 2));
    return reportFile;
  }

  displayMetrics() {
    console.log("📊 MastroHUB v2 Performance Monitor");
    console.log("=" .repeat(50));
    
    // System Metrics
    console.log("\n🖥️ SYSTEM METRICS");
    if (this.metrics.system.error) {
      console.log(`❌ Error: ${this.metrics.system.error}`);
    } else {
      console.log(`Total Memory: ${this.metrics.system.totalMemory}`);
      console.log(`Available Memory: ${this.metrics.system.availableMemory}`);
    }
    
    // Project Metrics
    console.log("\n📁 PROJECT METRICS");
    if (this.metrics.project.error) {
      console.log(`❌ Error: ${this.metrics.project.error}`);
    } else {
      console.log(`Build Time: ${this.metrics.project.buildTime}ms`);
      console.log(`Bundle Size: ${this.metrics.project.bundleSize} bytes`);
      console.log(`File Count: ${this.metrics.project.fileCount}`);
    }
    
    // Automation Metrics
    console.log("\n🤖 AUTOMATION METRICS");
    if (this.metrics.automation.error) {
      console.log(`❌ Error: ${this.metrics.automation.error}`);
    } else {
      console.log(`Total Duration: ${this.metrics.automation.totalDuration}ms`);
      console.log(`Workflow Count: ${this.metrics.automation.workflowCount}`);
      console.log(`Error Count: ${this.metrics.automation.errorCount}`);
      console.log(`Success Rate: ${this.metrics.automation.successRate}%`);
      console.log(`Last Run: ${this.metrics.automation.lastRun}`);
    }
    
    // Recommendations
    console.log("\n💡 RECOMMENDATIONS");
    if (this.metrics.recommendations.length === 0) {
      console.log("✅ No performance issues detected");
    } else {
      for (const rec of this.metrics.recommendations) {
        const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
        console.log(`${priority} ${rec.message}`);
        console.log(`   ${rec.metric}`);
      }
    }
    
    console.log("\n" + "=" .repeat(50));
  }

  async run() {
    const args = process.argv.slice(2);
    const command = args[0];

    console.log("🔍 Collecting performance metrics...");

    await this.collectSystemMetrics();
    await this.collectProjectMetrics();
    await this.collectAutomationMetrics();
    this.generateRecommendations();

    switch (command) {
      case "report":
        const reportFile = await this.generateReport();
        console.log(`📊 Performance report generated: ${reportFile}`);
        break;
        
      case "monitor":
        this.displayMetrics();
        break;
        
      default:
        this.displayMetrics();
        console.log("\nUsage:");
        console.log("  node performance-monitor.mjs monitor - Display metrics");
        console.log("  node performance-monitor.mjs report  - Generate report file");
        break;
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('performance-monitor.mjs')) {
  const monitor = new PerformanceMonitor();
  monitor.run().catch(error => {
    console.error("❌ Performance monitor failed:", error.message);
    process.exit(1);
  });
}

export default PerformanceMonitor;