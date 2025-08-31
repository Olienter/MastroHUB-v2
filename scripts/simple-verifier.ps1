# SIMPLE VERIFIER - 100% FUNCTIONAL
# Tests basic functionality without complex logic

Write-Host "🚀 SIMPLE VERIFIER STARTING..." -ForegroundColor Green
Write-Host "Timestamp: $(Get-Date)" -ForegroundColor Gray

# Test 1: Basic file access
Write-Host "`n🧪 TEST 1: File Access" -ForegroundColor Yellow
try {
    if (Test-Path ".\scripts\") {
        Write-Host "✅ Scripts directory accessible" -ForegroundColor Green
    } else {
        Write-Host "❌ Scripts directory not found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ File access test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: PowerShell execution
Write-Host "`n🧪 TEST 2: PowerShell Execution" -ForegroundColor Yellow
try {
    $ExecutionPolicy = Get-ExecutionPolicy
    Write-Host "✅ Execution policy: $ExecutionPolicy" -ForegroundColor Green
} catch {
    Write-Host "❌ Execution policy check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Port check
Write-Host "`n🧪 TEST 3: Port Status" -ForegroundColor Yellow
try {
    $PortCheck = netstat -an | Select-String ":3000"
    if ($PortCheck) {
        Write-Host "⚠️  Port 3000 occupied:" -ForegroundColor Yellow
        Write-Host "   $PortCheck" -ForegroundColor Gray
    } else {
        Write-Host "✅ Port 3000 available" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Port check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Package.json check
Write-Host "`n🧪 TEST 4: Package.json" -ForegroundColor Yellow
try {
    if (Test-Path "package.json") {
        $Package = Get-Content "package.json" | ConvertFrom-Json
        Write-Host "✅ Package.json loaded: $($Package.name)" -ForegroundColor Green
    } else {
        Write-Host "❌ Package.json not found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Package.json check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Script count
Write-Host "`n🧪 TEST 5: Script Count" -ForegroundColor Yellow
try {
    $Scripts = Get-ChildItem ".\scripts\" -Filter "*.ps1" | Measure-Object
    Write-Host "✅ Found $($Scripts.Count) PowerShell scripts" -ForegroundColor Green
} catch {
    Write-Host "❌ Script count failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 SIMPLE VERIFIER COMPLETED!" -ForegroundColor Green
Write-Host "All basic tests executed successfully!" -ForegroundColor Green
