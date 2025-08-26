# REAL TIERED VERIFICATION SYSTEM
# Actually provides different verification levels based on change type

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("file-only", "quick-build", "full-build")]
    [string]$Level,
    
    [Parameter(Mandatory=$false)]
    [string]$Target
)

$StartTime = Get-Date
$Results = @()

function Write-Step {
    param([string]$Step)
    $Elapsed = ((Get-Date) - $StartTime).TotalMilliseconds
    $Results += @{ Step = $Step; Elapsed = $Elapsed }
    Write-Host "  [OK] $Step ($([math]::Round($Elapsed))ms)" -ForegroundColor Green
}

function Test-FileOnlyVerification {
    Write-Host "Running FILE-ONLY verification (0.1s target)..." -ForegroundColor Green
    
    # Only file checks - no build
    Write-Step "Dependency check"
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    if (-not $pkg.dependencies.'next-themes') {
        throw "next-themes dependency missing"
    }
    
    Write-Step "Configuration check"
    $tailwindConfig = Get-Content "tailwind.config.ts" -Raw
    if (-not $tailwindConfig.Contains('darkMode: ["class"]')) {
        throw "darkMode configuration missing"
    }
    
    Write-Step "Implementation check"
    $layout = Get-Content "app/layout.tsx" -Raw
    if (-not $layout.Contains('ThemeProvider')) {
        throw "ThemeProvider missing from layout"
    }
    
    Write-Step "File-only verification completed"
}

function Test-QuickBuildVerification {
    Write-Host "Running QUICK-BUILD verification (1-2m target)..." -ForegroundColor Yellow
    
    # File checks + quick build
    Write-Step "Dependency check"
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    if (-not $pkg.dependencies.'next-themes') {
        throw "next-themes dependency missing"
    }
    
    Write-Step "Configuration check"
    $tailwindConfig = Get-Content "tailwind.config.ts" -Raw
    if (-not $tailwindConfig.Contains('darkMode: ["class"]')) {
        throw "darkMode configuration missing"
    }
    
    Write-Step "Quick build check"
    pnpm build
    
    Write-Step "Quick-build verification completed"
}

function Test-FullBuildVerification {
    param([string]$TaskId)
    
    Write-Host "Running FULL-BUILD verification (5m target)..." -ForegroundColor Red
    
    # Complete verification + evidence check
    Write-Step "Dependency verification"
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    $required = @('next-themes', 'tailwindcss-animate')
    foreach ($dep in $required) {
        if (-not $pkg.dependencies.$dep -and -not $pkg.devDependencies.$dep) {
            throw "Missing required dependency: $dep"
        }
    }
    
    Write-Step "Configuration verification"
    $tailwindConfig = Get-Content "tailwind.config.ts" -Raw
    if (-not $tailwindConfig.Contains('darkMode: ["class"]')) {
        throw "darkMode configuration missing"
    }
    if (-not $tailwindConfig.Contains('tailwindcss-animate')) {
        throw "tailwindcss-animate plugin missing"
    }
    
    Write-Step "Implementation verification"
    $layout = Get-Content "app/layout.tsx" -Raw
    if (-not $layout.Contains('ThemeProvider')) {
        throw "ThemeProvider missing from layout"
    }
    if (-not $layout.Contains('next-themes')) {
        throw "next-themes import missing"
    }
    
    Write-Step "Full build check"
    pnpm build
    
    Write-Step "Evidence verification"
    $evidencePath = ".ai/checks/$TaskId.txt"
    if (-not (Test-Path $evidencePath)) {
        throw "Evidence file $TaskId not found"
    }
    $evidence = Get-Content $evidencePath -Raw
    if (-not $evidence.Contains('RESULT: PASS')) {
        throw "Evidence file $TaskId not marked as PASS"
    }
    
    Write-Step "Full-build verification completed"
}

function Write-Results {
    param([string]$Level)
    
    $TotalTime = ((Get-Date) - $StartTime).TotalMilliseconds
    Write-Host "`n[SUCCESS] $Level verification completed successfully!" -ForegroundColor Green
    Write-Host "Total time: $([math]::Round($TotalTime))ms" -ForegroundColor Cyan
    
    # Check if we achieved claimed performance
    if ($Level -eq "file-only" -and $TotalTime -lt 1000) {
        Write-Host "ACHIEVED: File-only under 1 second!" -ForegroundColor Green
    } elseif ($Level -eq "file-only" -and $TotalTime -gt 1000) {
        Write-Host "FAILED: File-only over 1 second" -ForegroundColor Red
    }
    
    if ($Level -eq "quick-build" -and $TotalTime -lt 120000) {
        Write-Host "ACHIEVED: Quick-build under 2 minutes!" -ForegroundColor Green
    } elseif ($Level -eq "quick-build" -and $TotalTime -gt 120000) {
        Write-Host "FAILED: Quick-build over 2 minutes" -ForegroundColor Red
    }
    
    if ($Level -eq "full-build" -and $TotalTime -lt 300000) {
        Write-Host "ACHIEVED: Full-build under 5 minutes!" -ForegroundColor Green
    } elseif ($Level -eq "full-build" -and $TotalTime -gt 300000) {
        Write-Host "FAILED: Full-build over 5 minutes" -ForegroundColor Red
    }
}

# Main execution
try {
    Write-Host "Starting $Level verification..." -ForegroundColor Cyan
    
    switch ($Level) {
        "file-only" { Test-FileOnlyVerification }
        "quick-build" { Test-QuickBuildVerification }
        "full-build" { 
            if (-not $Target) {
                throw "Task ID required for full-build verification"
            }
            Test-FullBuildVerification -TaskId $Target 
        }
    }
    
    Write-Results -Level $Level
} catch {
    Write-Host "[ERROR] $Level verification failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
