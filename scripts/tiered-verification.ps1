# TIERED VERIFICATION SYSTEM
# Implements different verification levels for optimal performance

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("smoke", "targeted", "full")]
    [string]$Level,
    
    [Parameter(Mandatory=$false)]
    [string]$Target
)

$StartTime = Get-Date

function Show-Step {
    param([string]$Step)
    $Elapsed = ((Get-Date) - $StartTime).TotalMilliseconds
    Write-Host "  [OK] $Step ($([math]::Round($Elapsed))ms)" -ForegroundColor Green
}

function Test-SmokeTest {
    Write-Host "Running smoke test..." -ForegroundColor Yellow
    
    # Quick build check
    Show-Step "Build check"
    pnpm build
    
    # Basic dependency check
    Show-Step "Dependency check"
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    if (-not $pkg.dependencies.'next-themes') {
        throw "next-themes dependency missing"
    }
    
    Show-Step "Smoke test completed"
}

function Test-TargetedVerification {
    param([string]$FilePath)
    
    Write-Host "Running targeted verification for: $FilePath" -ForegroundColor Yellow
    
    if (-not $FilePath) {
        throw "Target file path required for targeted verification"
    }
    
    # File-specific checks
    Show-Step "File existence check"
    if (-not (Test-Path $FilePath)) {
        throw "Target file not found: $FilePath"
    }
    
    Show-Step "File content check"
    $content = Get-Content $FilePath -Raw
    if (-not $content.Contains('next-themes')) {
        throw "File missing next-themes integration"
    }
    
    Show-Step "Targeted verification completed"
}

function Test-FullVerification {
    param([string]$TaskId)
    
    Write-Host "Running full verification for task: $TaskId" -ForegroundColor Yellow
    
    # Complete dependency verification
    Show-Step "Dependency verification"
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    $required = @('next-themes', 'tailwindcss-animate')
    foreach ($dep in $required) {
        if (-not $pkg.dependencies.$dep -and -not $pkg.devDependencies.$dep) {
            throw "Missing required dependency: $dep"
        }
    }
    
    # Configuration verification
    Show-Step "Configuration verification"
    $tailwindConfig = Get-Content "tailwind.config.ts" -Raw
    if (-not $tailwindConfig.Contains('darkMode: ["class"]')) {
        throw "darkMode configuration missing"
    }
    
    # Implementation verification
    Show-Step "Implementation verification"
    $layout = Get-Content "app/layout.tsx" -Raw
    if (-not $layout.Contains('ThemeProvider')) {
        throw "ThemeProvider missing from layout"
    }
    
    # Build verification
    Show-Step "Build verification"
    pnpm build
    
    # Evidence verification
    Show-Step "Evidence verification"
    $evidencePath = ".ai/checks/$TaskId.txt"
    if (-not (Test-Path $evidencePath)) {
        throw "Evidence file $TaskId not found"
    }
    $evidence = Get-Content $evidencePath -Raw
    if (-not $evidence.Contains('RESULT: PASS')) {
        throw "Evidence file $TaskId not marked as PASS"
    }
    
    Show-Step "Full verification completed"
}

function Show-Results {
    param([string]$Level)
    
    $TotalTime = ((Get-Date) - $StartTime).TotalMilliseconds
    Write-Host "`n[SUCCESS] $Level verification completed successfully!" -ForegroundColor Green
    Write-Host "Total time: $([math]::Round($TotalTime))ms" -ForegroundColor Cyan
    
    if ($Level -eq "smoke" -and $TotalTime -gt 30000) {
        Write-Host "Warning: Smoke test took longer than 30 seconds" -ForegroundColor Yellow
    }
    
    if ($Level -eq "full" -and $TotalTime -gt 300000) {
        Write-Host "Warning: Full verification took longer than 5 minutes" -ForegroundColor Yellow
    }
}

# Main execution
try {
    Write-Host "Starting $Level verification..." -ForegroundColor Cyan
    
    switch ($Level) {
        "smoke" { Test-SmokeTest }
        "targeted" { 
            if (-not $Target) {
                throw "Target required for targeted verification"
            }
            Test-TargetedVerification -FilePath $Target 
        }
        "full" { 
            if (-not $Target) {
                throw "Task ID required for full verification"
            }
            Test-FullVerification -TaskId $Target 
        }
    }
    
    Show-Results -Level $Level
} catch {
    Write-Host "[ERROR] $Level verification failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
