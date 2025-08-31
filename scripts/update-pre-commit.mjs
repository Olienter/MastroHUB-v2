#!/usr/bin/env node

/**
 * Pre-commit Hook Updater
 * Automatically updates pre-commit hook for TALK v1 compliance
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

class PreCommitUpdater {
  constructor() {
    this.hookPath = ".git/hooks/pre-commit";
    this.templatePath = "scripts/pre-commit-template.ps1";
  }

  async updatePreCommitHook() {
    console.log("🔧 Updating Pre-commit Hook for TALK v1...\n");

    try {
      // Check if hook exists
      if (!existsSync(this.hookPath)) {
        console.log("❌ Pre-commit hook not found");
        return false;
      }

      // Read current hook
      const currentHook = readFileSync(this.hookPath, "utf8");
      console.log("📖 Current pre-commit hook loaded");

      // Check if already updated
      if (currentHook.includes("TALK v1") && currentHook.includes("talk:v1:validate")) {
        console.log("✅ Pre-commit hook already updated for TALK v1");
        return true;
      }

      // Create updated hook content
      const updatedHook = this.createUpdatedHook(currentHook);
      
      // Write updated hook
      writeFileSync(this.hookPath, updatedHook);
      console.log("✅ Pre-commit hook updated for TALK v1");

      // Make hook executable
      this.makeHookExecutable();

      return true;
    } catch (error) {
      console.error("❌ Failed to update pre-commit hook:", error.message);
      return false;
    }
  }

  createUpdatedHook(currentHook) {
    const timestamp = new Date().toISOString();
    const handoffId = "HF-VERIF-FIX-001";
    return `#!/usr/bin/env powershell
# Pre-commit hook pre TALK v1 compliance
# Windows PowerShell compatible
# Auto-updated: ${timestamp}

Write-Host "🔍 Pre-commit: TALK v1 Compliance Check..." -ForegroundColor Cyan

# Check if required evidence file exists
$HANDOFF_ID = "${handoffId}"
$EVIDENCE_FILE = ".ai/checks/${handoffId}.txt"

if (-not (Test-Path $EVIDENCE_FILE)) {
    Write-Host "❌ TALK v1 compliance check failed" -ForegroundColor Red
    Write-Host "ERROR: Missing required evidence file: $EVIDENCE_FILE" -ForegroundColor Red
    Write-Host "REASON: Pre-commit hook requires evidence file for handoff ID: $HANDOFF_ID" -ForegroundColor Red
    Write-Host "SOLUTION: Run 'pnpm run talk:v1:orchestrate' or create evidence manually" -ForegroundColor Yellow
    exit 1
}

# Run TALK v1 validation
try {
    $result = pnpm run talk:v1:validate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ TALK v1 compliance check failed" -ForegroundColor Red
        Write-Host "ERROR: TALK v1 validation failed" -ForegroundColor Red
        Write-Host "REASON: TALK v1 format or compliance issues detected" -ForegroundColor Red
        Write-Host "SOLUTION: Fix issues and run 'pnpm run talk:v1:validate' again" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ TALK v1 compliance check failed" -ForegroundColor Red
    Write-Host "ERROR: Failed to run TALK v1 validation" -ForegroundColor Red
    Write-Host "REASON: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Run AI consistency check
try {
    $result = pnpm run ai:consistency
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ TALK v1 compliance check failed" -ForegroundColor Red
        Write-Host "ERROR: AI consistency check failed" -ForegroundColor Red
        Write-Host "REASON: Code quality or TALK v1 format issues detected" -ForegroundColor Red
        Write-Host "SOLUTION: Fix issues and run 'pnpm run ai:consistency' again" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ TALK v1 compliance check failed" -ForegroundColor Red
    Write-Host "ERROR: Failed to run AI consistency check" -ForegroundColor Red
    Write-Host "REASON: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "✅ TALK v1 compliance check passed" -ForegroundColor Green
Write-Host "EVIDENCE: $EVIDENCE_FILE exists" -ForegroundColor Green
Write-Host "TALK V1: Validation passed" -ForegroundColor Green
Write-Host "AI CONSISTENCY: All checks passed" -ForegroundColor Green
Write-Host "STATUS: Ready for commit" -ForegroundColor Green
exit 0`;
  }

  makeHookExecutable() {
    try {
      // On Windows, PowerShell scripts are executable by default
      console.log("✅ Hook permissions set for Windows PowerShell");
    } catch (error) {
      console.log("⚠️ Could not set hook permissions:", error.message);
    }
  }

  async createTemplate() {
    console.log("\n📝 Creating pre-commit template...");

    try {
      const templateContent = this.createUpdatedHook("");
      writeFileSync(this.templatePath, templateContent);
      console.log("✅ Pre-commit template created");
      return true;
    } catch (error) {
      console.error("❌ Failed to create template:", error.message);
      return false;
    }
  }
}

// Run updater if called directly
if (process.argv[1] && process.argv[1].includes('update-pre-commit.mjs')) {
  const updater = new PreCommitUpdater();
  
  if (process.argv.includes("--template")) {
    updater.createTemplate();
  } else {
    updater.updatePreCommitHook();
  }
}

export default PreCommitUpdater;
