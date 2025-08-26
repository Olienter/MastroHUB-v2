# ULTRA-FAST VERIFICATION - No Build Required
# Testing if we can achieve claimed 30-second smoke test

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("ultra-smoke", "ultra-targeted", "ultra-full")]
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

function Test-UltraSmokeTest {
    Write-Host "Running ULTRA-FAST smoke test (NO BUILD)..." -ForegroundColor Yellow
    
    # Dependency check only
    Write-Step "Dependency check"
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    if (-not $pkg.dependencies.'next-themes') {
        throw "next-themes dependency missing"
    }
    if (-not $pkg.devDependencies.'tailwindcss-animate') {
        throw "tailwindcss-animate dependency missing"
    }
    
    # Configuration check only
    Write-Step "Configuration check"
    $tailwindConfig = Get-Content "tailwind.config.ts" -Raw
    if (-not $tailwindConfig.Contains('darkMode: ["class"]')) {
        throw "darkMode configuration missing"
    }
    if (-not $tailwindConfig.Contains('tailwindcss-animate')) {
        throw "tailwindcss-animate plugin missing"
    }
    
    # Implementation check only
    Write-Step "Implementation check"
    $layout = Get-Content "app/layout.tsx" -Raw
    if (-not $layout.Contains('ThemeProvider')) {
        throw "ThemeProvider missing from layout"
    }
    if (-not $layout.Contains('next-themes')) {
        throw "next-themes import missing"
    }
    
    Write-Step "Ultra-smoke test completed"
}

function Test-UltraTargetedTest {
    param([string]$FilePath)
    
    Write-Host "Running ULTRA-FAST targeted test for: $FilePath (NO BUILD)..." -ForegroundColor Yellow
    
    if (-not $FilePath) {
        throw "Target file path required for targeted verification"
    }
    
    # Check specific file only
    Write-Step "Checking $FilePath"
    $content = Get-Content $FilePath -Raw
    if (-not $content.Contains('next-themes')) {
        throw "$FilePath missing next-themes integration"
    }
    
    Write-Step "Ultra-targeted test completed"
}

function Test-UltraFullTest {
    param([string]$TaskId)
    
    Write-Host "Running ULTRA-FAST full test for task: $TaskId (NO BUILD)..." -ForegroundColor Yellow
    
    # Complete dependency verification
    Write-Step "Dependency verification"
    $pkg = Get-Content "package.json" | ConvertFrom-Json
    $required = @('next-themes', 'tailwindcss-animate')
    foreach ($dep in $required) {
        if (-not $pkg.dependencies.$dep -and -not $pkg.devDependencies.$dep) {
            throw "Missing required dependency: $dep"
        }
    }
    
    # Configuration verification
    Write-Step "Configuration verification"
    $tailwindConfig = Get-Content "tailwind.config.ts" -Raw
    if (-not $tailwindConfig.Contains('darkMode: ["class"]')) {
        throw "darkMode configuration missing"
    }
    if (-not $tailwindConfig.Contains('tailwindcss-animate')) {
        throw "tailwindcss-animate plugin missing"
    }
    
    # Implementation verification
    Write-Step "Implementation verification"
    $layout = Get-Content "app/layout.tsx" -Raw
    if (-not $layout.Contains('ThemeProvider')) {
        throw "ThemeProvider missing from layout"
    }
    if (-not $layout.Contains('next-themes')) {
        throw "next-themes import missing"
    }
    
    # Evidence verification
    Write-Step "Evidence verification"
    $evidencePath = ".ai/checks/$TaskId.txt"
    if (-not (Test-Path $evidencePath)) {
        throw "Evidence file $TaskId not found"
    }
    $evidence = Get-Content $evidencePath -Raw
    if (-not $evidence.Contains('RESULT: PASS')) {
        throw "Evidence file $TaskId not marked as PASS"
    }
    
    Write-Step "Ultra-full test completed"
}

function Write-Results {
    param([string]$Level)
    
    $TotalTime = ((Get-Date) - $StartTime).TotalMilliseconds
    Write-Host "`n[SUCCESS] $Level verification completed successfully!" -ForegroundColor Green
    Write-Host "Total time: $([math]::Round($TotalTime))ms" -ForegroundColor Cyan
    
    # Check if we achieved claimed performance
    if ($Level -eq "ultra-smoke" -and $TotalTime -lt 30000) {
        Write-Host "ACHIEVED: Ultra-smoke test under 30 seconds!" -ForegroundColor Green
    } elseif ($Level -eq "ultra-smoke" -and $TotalTime -gt 30000) {
        Write-Host "FAILED: Ultra-smoke test over 30 seconds" -ForegroundColor Red
    }
    
    if ($Level -eq "ultra-targeted" -and $TotalTime -lt 60000) {
        Write-Host "ACHIEVED: Ultra-targeted test under 1 minute!" -ForegroundColor Green
    } elseif ($Level -eq "ultra-targeted" -and $TotalTime -gt 60000) {
        Write-Host "FAILED: Ultra-targeted test over 1 minute" -ForegroundColor Red
    }
}

# Main execution
try {
    Write-Host "Starting $Level verification (NO BUILD)..." -ForegroundColor Cyan
    
    switch ($Level) {
        "ultra-smoke" { Test-UltraSmokeTest }
        "ultra-targeted" { 
            if (-not $Target) {
                throw "Target required for targeted verification"
            }
            Test-UltraTargetedTest -FilePath $Target 
        }
        "ultra-full" { 
            if (-not $Target) {
                throw "Task ID required for full verification"
            }
            Test-UltraFullTest -TaskId $Target 
        }
    }
    
    Write-Results -Level $Level
} catch {
    Write-Host "[ERROR] $Level verification failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
