#!/usr/bin/env node

/**
 * Performance Monitoring Script for MastroHUB v2
 * Tracks bundle size, build time, and performance metrics
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      timestamp: new Date().toISOString(),
      bundle_size: {},
      build_time: {},
      performance_score: 0,
      recommendations: [],
    };
  }

  async runPerformanceCheck() {
    try {
      console.log("⚡ Starting Performance Monitoring...\n");

      // Check bundle size
      await this.checkBundleSize();

      // Measure build time
      await this.measureBuildTime();

      // Calculate performance score
      this.calculatePerformanceScore();

      // Generate recommendations
      this.generateRecommendations();

      // Save report
      await this.saveReport();

      console.log("\n🎯 Performance monitoring completed!");
      return this.metrics;
    } catch (error) {
      console.error(`❌ Performance monitoring failed: ${error.message}`);
      process.exit(1);
    }
  }

  async checkBundleSize() {
    console.log("📦 Checking Bundle Size...");

    try {
      const startTime = Date.now();
      const buildOutput = execSync("pnpm run build", { encoding: "utf8" });
      const buildTime = Date.now() - startTime;

      // Extract bundle size information
      const bundleInfo = this.extractBundleInfo(buildOutput);

      this.metrics.bundle_size = {
        ...bundleInfo,
        build_time_ms: buildTime,
        build_time_seconds: Math.round(buildTime / 1000),
      };

      console.log(`✅ Bundle Size: ${bundleInfo.total_size || "Unknown"}`);
      console.log(`✅ Build Time: ${Math.round(buildTime / 1000)}s`);
    } catch (error) {
      this.metrics.bundle_size = {
        error: error.message,
        status: "failed",
      };
      console.log("❌ Bundle size check failed");
    }
  }

  extractBundleInfo(buildOutput) {
    const info = {
      status: "success",
      total_size: "Unknown",
      chunks: 0,
      assets: 0,
    };

    try {
      // Look for bundle size information
      if (buildOutput.includes("First Load JS")) {
        info.total_size = "Available";
      }

      // Count chunks and assets
      const chunkMatches = buildOutput.match(/chunk \d+/g);
      if (chunkMatches) {
        info.chunks = chunkMatches.length;
      }

      const assetMatches = buildOutput.match(/asset \d+/g);
      if (assetMatches) {
        info.assets = assetMatches.length;
      }
    } catch (error) {
      info.status = "error";
      info.error = error.message;
    }

    return info;
  }

  async measureBuildTime() {
    console.log("\n⏱️ Measuring Build Performance...");

    try {
      // Clean build
      execSync("rm -rf .next", { stdio: "pipe" });

      const startTime = Date.now();
      execSync("pnpm run build", { stdio: "pipe" });
      const cleanBuildTime = Date.now() - startTime;

      this.metrics.build_time = {
        clean_build_ms: cleanBuildTime,
        clean_build_seconds: Math.round(cleanBuildTime / 1000),
        status: "measured",
      };

      console.log(`✅ Clean Build Time: ${Math.round(cleanBuildTime / 1000)}s`);
    } catch (error) {
      this.metrics.build_time = {
        error: error.message,
        status: "failed",
      };
      console.log("⚠️ Build time measurement failed");
    }
  }

  calculatePerformanceScore() {
    console.log("\n📊 Calculating Performance Score...");

    let score = 100;
    const recommendations = [];

    // Bundle size scoring
    if (this.metrics.bundle_size.status === "success") {
      if (this.metrics.bundle_size.chunks > 10) {
        score -= 10;
        recommendations.push(
          "Consider reducing number of chunks for better performance"
        );
      }
    } else {
      score -= 20;
    }

    // Build time scoring
    if (this.metrics.build_time.status === "measured") {
      const buildTimeSeconds = this.metrics.build_time.clean_build_seconds;

      if (buildTimeSeconds > 30) {
        score -= 15;
        recommendations.push("Build time is slow, consider optimization");
      } else if (buildTimeSeconds > 20) {
        score -= 10;
        recommendations.push("Build time could be improved");
      } else if (buildTimeSeconds < 10) {
        score += 10;
        recommendations.push("Excellent build performance!");
      }
    } else {
      score -= 15;
    }

    // Ensure score is within bounds
    this.metrics.performance_score = Math.max(0, Math.min(100, score));
    this.metrics.recommendations = recommendations;

    console.log(`✅ Performance Score: ${this.metrics.performance_score}/100`);
  }

  generateRecommendations() {
    if (this.metrics.recommendations.length > 0) {
      console.log("\n🔧 Performance Recommendations:");
      this.metrics.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }
  }

  async saveReport() {
    try {
      const reportPath = join(process.cwd(), ".ai", "performance-report.json");
      writeFileSync(reportPath, JSON.stringify(this.metrics, null, 2));
      console.log(`\n📄 Performance report saved to: ${reportPath}`);

      // Update manifest
      await this.updateManifest();
    } catch (error) {
      console.error(`❌ Failed to save performance report: ${error.message}`);
    }
  }

  async updateManifest() {
    try {
      const manifestPath = ".ai/manifest.json";
      if (existsSync(manifestPath)) {
        const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

        manifest.performance_monitoring = {
          last_check: this.metrics.timestamp,
          performance_score: this.metrics.performance_score,
          bundle_size: this.metrics.bundle_size,
          build_time: this.metrics.build_time,
        };

        writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        console.log("✅ Manifest updated with performance metrics");
      }
    } catch (error) {
      console.log("⚠️ Could not update manifest:", error.message);
    }
  }
}

// Run performance monitoring if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new PerformanceMonitor();
  monitor.runPerformanceCheck().catch((error) => {
    console.error(`❌ Performance monitoring failed: ${error.message}`);
    process.exit(1);
  });
}

export default PerformanceMonitor;
