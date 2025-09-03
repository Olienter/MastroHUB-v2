#!/usr/bin/env node

/**
 * MastroHUB v2 Automation Dashboard
 * Real-time monitoring and analytics for automation system
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

class AutomationDashboard {
  constructor() {
    this.data = {
      workflows: new Map(),
      reports: [],
      evidence: [],
      performance: {
        totalRuns: 0,
        successRate: 0,
        avgDuration: 0,
        lastRun: null
      }
    };
  }

  async loadData() {
    await this.loadReports();
    await this.loadEvidence();
    await this.calculateMetrics();
  }

  async loadReports() {
    const reportsDir = ".ai/reports";
    if (!existsSync(reportsDir)) return;

    const files = readdirSync(reportsDir).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      try {
        const content = readFileSync(join(reportsDir, file), 'utf8');
        const report = JSON.parse(content);
        this.data.reports.push({
          file,
          ...report,
          timestamp: new Date(report.timestamp)
        });
      } catch (error) {
        console.warn(`⚠️ Could not load report ${file}: ${error.message}`);
      }
    }

    // Sort by timestamp
    this.data.reports.sort((a, b) => b.timestamp - a.timestamp);
  }

  async loadEvidence() {
    const checksDir = ".ai/checks";
    if (!existsSync(checksDir)) return;

    const files = readdirSync(checksDir).filter(f => f.endsWith('.json') || f.endsWith('.txt'));
    
    for (const file of files) {
      try {
        const content = readFileSync(join(checksDir, file), 'utf8');
        let evidence;
        
        if (file.endsWith('.json')) {
          evidence = JSON.parse(content);
        } else {
          evidence = { file, content, type: 'text' };
        }
        
        this.data.evidence.push({
          file,
          ...evidence,
          timestamp: new Date(evidence.timestamp || Date.now())
        });
      } catch (error) {
        console.warn(`⚠️ Could not load evidence ${file}: ${error.message}`);
      }
    }

    // Sort by timestamp
    this.data.evidence.sort((a, b) => b.timestamp - a.timestamp);
  }

  calculateMetrics() {
    const reports = this.data.reports;
    
    if (reports.length === 0) return;

    this.data.performance.totalRuns = reports.length;
    
    const successfulRuns = reports.filter(r => r.overall_status === 'completed').length;
    this.data.performance.successRate = (successfulRuns / reports.length) * 100;
    
    const durations = reports
      .filter(r => r.performance?.duration_ms)
      .map(r => r.performance.duration_ms);
    
    if (durations.length > 0) {
      this.data.performance.avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    }
    
    this.data.performance.lastRun = reports[0]?.timestamp;
  }

  generateDashboard() {
    console.log("📊 MastroHUB v2 Automation Dashboard");
    console.log("=" .repeat(50));
    
    // Performance Overview
    console.log("\n🎯 PERFORMANCE OVERVIEW");
    console.log(`Total Runs: ${this.data.performance.totalRuns}`);
    console.log(`Success Rate: ${this.data.performance.successRate.toFixed(1)}%`);
    console.log(`Avg Duration: ${(this.data.performance.avgDuration / 1000).toFixed(1)}s`);
    console.log(`Last Run: ${this.data.performance.lastRun ? new Date(this.data.performance.lastRun).toLocaleString() : 'Never'}`);
    
    // Recent Reports
    console.log("\n📋 RECENT REPORTS");
    const recentReports = this.data.reports.slice(0, 5);
    for (const report of recentReports) {
      const status = report.overall_status === 'completed' ? '✅' : '❌';
      const duration = report.performance?.duration_ms ? 
        `${(report.performance.duration_ms / 1000).toFixed(1)}s` : 'N/A';
      console.log(`${status} ${report.timestamp.toLocaleString()} - ${duration}`);
    }
    
    // Workflow Analysis
    console.log("\n🔄 WORKFLOW ANALYSIS");
    const workflowStats = new Map();
    
    for (const report of this.data.reports) {
      for (const [workflowName, workflow] of Object.entries(report.workflows || {})) {
        if (!workflowStats.has(workflowName)) {
          workflowStats.set(workflowName, { runs: 0, successes: 0, totalDuration: 0 });
        }
        
        const stats = workflowStats.get(workflowName);
        stats.runs++;
        if (workflow.status === 'completed') stats.successes++;
        if (workflow.end_time && workflow.start_time) {
          stats.totalDuration += (workflow.end_time - workflow.start_time);
        }
      }
    }
    
    for (const [name, stats] of workflowStats) {
      const successRate = (stats.successes / stats.runs) * 100;
      const avgDuration = stats.totalDuration / stats.runs / 1000;
      console.log(`${name}: ${stats.runs} runs, ${successRate.toFixed(1)}% success, ${avgDuration.toFixed(1)}s avg`);
    }
    
    // Evidence Summary
    console.log("\n📝 EVIDENCE SUMMARY");
    console.log(`Total Evidence Files: ${this.data.evidence.length}`);
    
    const evidenceTypes = new Map();
    for (const evidence of this.data.evidence) {
      const type = evidence.type || 'json';
      evidenceTypes.set(type, (evidenceTypes.get(type) || 0) + 1);
    }
    
    for (const [type, count] of evidenceTypes) {
      console.log(`${type}: ${count} files`);
    }
    
    // Health Status
    console.log("\n🏥 SYSTEM HEALTH");
    const recentErrors = this.data.reports
      .slice(0, 10)
      .filter(r => r.errors && r.errors.length > 0)
      .length;
    
    if (recentErrors === 0) {
      console.log("✅ System healthy - no recent errors");
    } else {
      console.log(`⚠️ ${recentErrors} recent runs with errors`);
    }
    
    // Recommendations
    console.log("\n💡 RECOMMENDATIONS");
    if (this.data.performance.successRate < 90) {
      console.log("⚠️ Success rate below 90% - investigate failed runs");
    }
    
    if (this.data.performance.avgDuration > 60000) {
      console.log("⚠️ Average duration over 1 minute - consider optimization");
    }
    
    if (this.data.performance.totalRuns < 5) {
      console.log("ℹ️ Limited data - run more workflows for better insights");
    }
    
    console.log("\n" + "=" .repeat(50));
  }

  async run() {
    const args = process.argv.slice(2);
    const command = args[0];

    await this.loadData();

    switch (command) {
      case "status":
        this.generateDashboard();
        break;
        
      case "reports":
        console.log("📋 Recent Reports:");
        for (const report of this.data.reports.slice(0, 10)) {
          console.log(`- ${report.file}: ${report.overall_status} (${report.timestamp.toLocaleString()})`);
        }
        break;
        
      case "evidence":
        console.log("📝 Recent Evidence:");
        for (const evidence of this.data.evidence.slice(0, 10)) {
          console.log(`- ${evidence.file}: ${evidence.type || 'json'} (${evidence.timestamp.toLocaleString()})`);
        }
        break;
        
      default:
        this.generateDashboard();
        console.log("\nUsage:");
        console.log("  node automation-dashboard.mjs status   - Full dashboard");
        console.log("  node automation-dashboard.mjs reports  - Recent reports");
        console.log("  node automation-dashboard.mjs evidence - Recent evidence");
        break;
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('automation-dashboard.mjs')) {
  const dashboard = new AutomationDashboard();
  dashboard.run().catch(error => {
    console.error("❌ Dashboard failed:", error.message);
    process.exit(1);
  });
}

export default AutomationDashboard;
