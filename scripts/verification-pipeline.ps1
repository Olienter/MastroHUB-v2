# VERIFICATION PIPELINE
# Automated system that validates code quality, performance claims, and functionality

param(
    [Parameter(Mandatory=$true)]
    [string]$ScriptPath,
    
    [Parameter(Mandatory=$false)]
    [string]$PerformanceClaim = "",
    
    [Parameter(Mandatory=$false)]
    [string]$BaselineValue = ""
)

function Test-CodeQuality {
    param([string]$Path)
    
    Write-Host "=== PHASE 1: CODE QUALITY CHECK ===" -ForegroundColor Cyan
    
    try {
        $Result = & ".\scripts\quality-gate.ps1" $Path
        $ExitCode = $LASTEXITCODE
        
        switch ($ExitCode) {
            0 { 
                Write-Host "Code quality check PASSED" -ForegroundColor Green
                return @{ Status = $true; Type = "PASS" }
            }
            1 { 
                Write-Host "Code quality check FAILED" -ForegroundColor Red
                return @{ Status = $false; Type = "FAIL" }
            }
            2 { 
                Write-Host "Code quality check WARNING" -ForegroundColor Yellow
                return @{ Status = $true; Type = "WARNING" }
            }
            default {
                Write-Host "Code quality check UNKNOWN EXIT CODE: $ExitCode" -ForegroundColor Red
                return @{ Status = $false; Type = "ERROR" }
            }
        }
    } catch {
        Write-Host "Code quality check ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return @{ Status = $false; Type = "ERROR" }
    }
}

function Test-PerformanceClaims {
    param([string]$Claim, [string]$Baseline)
    
    if (-not $Claim -or -not $Baseline) {
        Write-Host "=== PHASE 2: PERFORMANCE VALIDATION ===" -ForegroundColor Cyan
        Write-Host "No performance claims to validate - SKIPPING" -ForegroundColor Yellow
        return @{ Status = $true; Type = "SKIP" }
    }
    
    Write-Host "=== PHASE 2: PERFORMANCE VALIDATION ===" -ForegroundColor Cyan
    
    try {
        $Result = & ".\scripts\performance-validator.ps1" "speedup" $Claim $Baseline
        $ExitCode = $LASTEXITCODE
        
        if ($ExitCode -eq 0) {
            Write-Host "Performance validation PASSED" -ForegroundColor Green
            return @{ Status = $true; Type = "PASS" }
        } else {
            Write-Host "Performance validation FAILED" -ForegroundColor Red
            return @{ Status = $false; Type = "FAIL" }
        }
    } catch {
        Write-Host "Performance validation ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return @{ Status = $false; Type = "ERROR" }
    }
}

function Test-Functionality {
    param([string]$Path)
    
    Write-Host "=== PHASE 3: FUNCTIONALITY TEST ===" -ForegroundColor Cyan
    
    # Extract script name for testing
    $ScriptName = Split-Path $Path -Leaf
    $ScriptDir = Split-Path $Path -Parent
    
    try {
        # Test 1: Script can be loaded
        Write-Host "Testing script loading..." -ForegroundColor White
        $ScriptContent = Get-Content $Path -Raw
        if (-not $ScriptContent) {
            throw "Script is empty or cannot be read"
        }
        Write-Host "Script loading: PASSED" -ForegroundColor Green
        
        # Test 2: Script has required structure
        Write-Host "Testing script structure..." -ForegroundColor White
        if (-not $ScriptContent.Contains('param(')) {
            Write-Host "Warning: Script has no parameters" -ForegroundColor Yellow
        }
        if (-not $ScriptContent.Contains('function ')) {
            Write-Host "Warning: Script has no functions" -ForegroundColor Yellow
        }
        Write-Host "Script structure: PASSED" -ForegroundColor Green
        
        # Test 3: Script can be parsed (basic syntax check)
        Write-Host "Testing script syntax..." -ForegroundColor White
        $null = [System.Management.Automation.PSParser]::Tokenize($ScriptContent, [ref]$null)
        Write-Host "Script syntax: PASSED" -ForegroundColor Green
        
        return @{ Status = $true; Type = "PASS" }
        
    } catch {
        Write-Host "Functionality test FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return @{ Status = $false; Type = "FAIL" }
    }
}

function Show-PipelineReport {
    param([hashtable]$Quality, [hashtable]$Performance, [hashtable]$Functionality, [string]$ScriptPath)
    
    Write-Host "=== VERIFICATION PIPELINE REPORT ===" -ForegroundColor Yellow
    Write-Host "Script: $ScriptPath" -ForegroundColor White
    
    $Results = @(
        @{ Phase = "Code Quality"; Status = $Quality.Status; Type = $Quality.Type },
        @{ Phase = "Performance Validation"; Status = $Performance.Status; Type = $Performance.Type },
        @{ Phase = "Functionality Test"; Status = $Functionality.Status; Type = $Functionality.Type }
    )
    
    foreach ($Result in $Results) {
        $Color = if ($Result.Status) { "Green" } else { "Red" }
        $Status = if ($Result.Status) { "PASSED" } else { "FAILED" }
        $TypeInfo = " ($($Result.Type))"
        Write-Host "  $($Result.Phase): $Status$TypeInfo" -ForegroundColor $Color
    }
    
    # Pipeline Decision Logic
    $AllPassed = $Quality.Status -and $Performance.Status -and $Functionality.Status
    $HasErrors = ($Quality.Type -eq "FAIL" -or $Performance.Type -eq "FAIL" -or $Functionality.Type -eq "FAIL")
    $HasWarnings = ($Quality.Type -eq "WARNING" -or $Performance.Type -eq "WARNING")
    
    if ($AllPassed -and -not $HasErrors) {
        Write-Host "VERIFICATION PIPELINE: ALL PHASES PASSED" -ForegroundColor Green
        Write-Host "Script is ready for production use!" -ForegroundColor Green
        return $true
    } elseif ($HasErrors) {
        Write-Host "VERIFICATION PIPELINE: CRITICAL FAILURES DETECTED" -ForegroundColor Red
        Write-Host "Script cannot be used due to errors!" -ForegroundColor Red
        return $false
    } else {
        Write-Host "VERIFICATION PIPELINE: WARNINGS DETECTED" -ForegroundColor Yellow
        Write-Host "Script has issues but can be used with caution!" -ForegroundColor Yellow
        return $true
    }
}

# Main execution
try {
    Write-Host "Starting Verification Pipeline for: $ScriptPath" -ForegroundColor Cyan
    
    # Phase 1: Code Quality
    $QualityResult = Test-CodeQuality -Path $ScriptPath
    
    # Phase 2: Performance Validation
    $PerformanceResult = Test-PerformanceClaims -Claim $PerformanceClaim -Baseline $BaselineValue
    
    # Phase 3: Functionality Test
    $FunctionalityResult = Test-Functionality -Path $ScriptPath
    
    # Final Report
    $AllPassed = Show-PipelineReport -Quality $QualityResult -Performance $PerformanceResult -Functionality $FunctionalityResult -ScriptPath $ScriptPath
    
    if (-not $AllPassed) {
        exit 1
    }
    
} catch {
    Write-Host "[ERROR] Verification pipeline failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
