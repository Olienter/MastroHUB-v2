#!/usr/bin/env node

/**
 * TIERED VERIFICATION SYSTEM
 * Implementing Gemini's feedback about workflow efficiency
 * 
 * Usage:
 * - Smoke Test: node scripts/tiered-verification.mjs smoke
 * - Targeted: node scripts/tiered-verification.mjs targeted <file_path>
 * - Full: node scripts/tiered-verification.mjs full <task_id>
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const VERIFICATION_LEVELS = {
  SMOKE: 'smoke',      // < 30 seconds - basic build check
  TARGETED: 'targeted', // < 1 minute - specific file/component
  FULL: 'full'         // 2-5 minutes - complete verification
};

class TieredVerification {
  constructor() {
    this.startTime = Date.now();
    this.results = [];
  }

  async run(level, target = null) {
    console.log(`🚀 Starting ${level.toUpperCase()} verification...`);
    
    try {
      switch (level) {
        case VERIFICATION_LEVELS.SMOKE:
          await this.smokeTest();
          break;
        case VERIFICATION_LEVELS.TARGETED:
          await this.targetedVerification(target);
          break;
        case VERIFICATION_LEVELS.FULL:
          await this.fullVerification(target);
          break;
        default:
          throw new Error(`Unknown verification level: ${level}`);
      }
      
      this.logResults(level);
    } catch (error) {
      console.error(`❌ ${level.toUpperCase()} verification failed:`, error.message);
      process.exit(1);
    }
  }

  async smokeTest() {
    console.log('🔥 Running smoke test...');
    
    // Quick build check
    this.logStep('Build check');
    execSync('pnpm build', { stdio: 'inherit' });
    
    // Basic dependency check
    this.logStep('Dependency check');
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    if (!pkg.dependencies['next-themes']) {
      throw new Error('next-themes dependency missing');
    }
    
    this.logStep('Smoke test completed');
  }

  async targetedVerification(filePath) {
    console.log(`🎯 Running targeted verification for: ${filePath}`);
    
    if (!filePath) {
      throw new Error('Target file path required for targeted verification');
    }
    
    // Check specific file
    this.logStep(`Checking ${filePath}`);
    if (!readFileSync(filePath, 'utf8').includes('next-themes')) {
      throw new Error(`${filePath} missing next-themes integration`);
    }
    
    // Quick build to ensure no regressions
    this.logStep('Quick build check');
    execSync('pnpm build', { stdio: 'inherit' });
    
    this.logStep('Targeted verification completed');
  }

  async fullVerification(taskId) {
    console.log(`🔍 Running full verification for task: ${taskId}`);
    
    // Complete dependency verification
    this.logStep('Dependency verification');
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    this.verifyDependencies(pkg);
    
    // Configuration verification
    this.logStep('Configuration verification');
    this.verifyConfiguration();
    
    // Implementation verification
    this.logStep('Implementation verification');
    this.verifyImplementation();
    
    // Build verification
    this.logStep('Build verification');
    execSync('pnpm build', { stdio: 'inherit' });
    
    // Evidence verification
    this.logStep('Evidence verification');
    this.verifyEvidence(taskId);
    
    this.logStep('Full verification completed');
  }

  verifyDependencies(pkg) {
    const required = ['next-themes', 'tailwindcss-animate'];
    for (const dep of required) {
      if (!pkg.dependencies[dep] && !pkg.devDependencies[dep]) {
        throw new Error(`Missing required dependency: ${dep}`);
      }
    }
  }

  verifyConfiguration() {
    const tailwindConfig = readFileSync('tailwind.config.ts', 'utf8');
    if (!tailwindConfig.includes('darkMode: ["class"]')) {
      throw new Error('darkMode configuration missing');
    }
    if (!tailwindConfig.includes('tailwindcss-animate')) {
      throw new Error('tailwindcss-animate plugin missing');
    }
  }

  verifyImplementation() {
    const layout = readFileSync('app/layout.tsx', 'utf8');
    if (!layout.includes('ThemeProvider')) {
      throw new Error('ThemeProvider missing from layout');
    }
    if (!layout.includes('next-themes')) {
      throw new Error('next-themes import missing');
    }
  }

  verifyEvidence(taskId) {
    const evidencePath = `.ai/checks/${taskId}.txt`;
    if (!readFileSync(evidencePath, 'utf8').includes('RESULT: PASS')) {
      throw new Error(`Evidence file ${taskId} not marked as PASS`);
    }
  }

  logStep(step) {
    const elapsed = Date.now() - this.startTime;
    this.results.push({ step, elapsed });
    console.log(`  ✅ ${step} (${elapsed}ms)`);
  }

  logResults(level) {
    const totalTime = Date.now() - this.startTime;
    console.log(`\n🎉 ${level.toUpperCase()} verification completed successfully!`);
    console.log(`⏱️  Total time: ${totalTime}ms`);
    
    if (level === VERIFICATION_LEVELS.SMOKE && totalTime > 30000) {
      console.warn('⚠️  Warning: Smoke test took longer than 30 seconds');
    }
    
    if (level === VERIFICATION_LEVELS.FULL && totalTime > 300000) {
      console.warn('⚠️  Warning: Full verification took longer than 5 minutes');
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const level = process.argv[2];
  const target = process.argv[3];
  
  if (!level || !Object.values(VERIFICATION_LEVELS).includes(level)) {
    console.error('Usage: node scripts/tiered-verification.mjs <smoke|targeted|full> [target]');
    process.exit(1);
  }
  
  const verifier = new TieredVerification();
  verifier.run(level, target);
}

export default TieredVerification;
