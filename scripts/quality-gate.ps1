# QUALITY GATE SYSTEM
# Automatically validates PowerShell scripts before they can be used

param(
    [Parameter(Mandatory=$true)]
    [string]$ScriptPath
)

function Test-PowerShellQuality {
    param([string]$Path)
    
    Write-Host "Running PowerShell Quality Gate for: $Path" -ForegroundColor Cyan
    
    $Issues = @()
    $Content = Get-Content $Path -Raw
    
    # Check 1: PSUseApprovedVerbs
    $FunctionMatches = [regex]::Matches($Content, 'function\s+([A-Za-z-]+)')
    foreach ($Match in $FunctionMatches) {
        $FunctionName = $Match.Groups[1].Value
        $Verb = $FunctionName.Split('-')[0]
        
        # PowerShell approved verbs
        $ApprovedVerbs = @(
            'Add', 'Clear', 'Close', 'Copy', 'Enter', 'Exit', 'Find', 'Format', 'Get', 'Hide',
            'Join', 'Lock', 'Move', 'New', 'Open', 'Pop', 'Push', 'Redo', 'Remove', 'Rename',
            'Reset', 'Resize', 'Search', 'Select', 'Set', 'Show', 'Skip', 'Split', 'Step', 'Switch',
            'Test', 'Trace', 'Undo', 'Unlock', 'Watch'
        )
        
        if ($ApprovedVerbs -notcontains $Verb) {
            $Issues += @{
                Type = "PSUseApprovedVerbs"
                Message = "Function '$FunctionName' uses unapproved verb '$Verb'"
                Severity = "Warning"
                Line = ($Content.Substring(0, $Match.Index).Split("`n").Count + 1)
            }
        }
    }
    
    # Check 2: Proper Error Handling
    if ($Content.Contains('throw') -and -not $Content.Contains('try {')) {
        $Issues += @{
            Type = "ErrorHandling"
            Message = "Script uses 'throw' without proper try-catch blocks"
            Severity = "Error"
            Line = 0
        }
    }
    
    # Check 3: Parameter Validation
    if ($Content.Contains('param(') -and -not $Content.Contains('[Parameter(')) {
        $Issues += @{
            Type = "ParameterValidation"
            Message = "Script has parameters without validation attributes"
            Severity = "Warning"
            Line = 0
        }
    }
    
    # Check 4: Proper Exit Codes
    if ($Content.Contains('exit 1') -and -not $Content.Contains('exit 0')) {
        $Issues += @{
            Type = "ExitCodes"
            Message = "Script exits with error but no success exit code"
            Severity = "Info"
            Line = 0
        }
    }
    
    # Check 5: Documentation
    if (-not $Content.Contains('#') -or $Content.Split('#').Count -lt 3) {
        $Issues += @{
            Type = "Documentation"
            Message = "Script lacks proper documentation/comments"
            Severity = "Info"
            Line = 0
        }
    }
    
    return $Issues
}

function Show-QualityReport {
    param([array]$Issues, [string]$ScriptPath)
    
    Write-Host "QUALITY GATE REPORT for: $ScriptPath" -ForegroundColor Yellow
    
    if ($Issues.Count -eq 0) {
        Write-Host "ALL CHECKS PASSED - Script meets quality standards!" -ForegroundColor Green
        return @{ Status = "PASS"; ExitCode = 0 }
    }
    
    Write-Host "QUALITY ISSUES FOUND:" -ForegroundColor Red
    
    $ErrorCount = ($Issues | Where-Object { $_.Severity -eq "Error" }).Count
    $WarningCount = ($Issues | Where-Object { $_.Severity -eq "Warning" }).Count
    $InfoCount = ($Issues | Where-Object { $_.Severity -eq "Info" }).Count
    
    Write-Host "  Errors: $ErrorCount, Warnings: $WarningCount, Info: $InfoCount" -ForegroundColor Yellow
    
    foreach ($Issue in $Issues) {
        $Color = switch ($Issue.Severity) {
            "Error" { "Red" }
            "Warning" { "Yellow" }
            "Info" { "Cyan" }
            default { "White" }
        }
        
        $LineInfo = if ($Issue.Line -gt 0) { " (Line $($Issue.Line))" } else { "" }
        Write-Host "  [$($Issue.Severity.ToUpper())] $($Issue.Message)$LineInfo" -ForegroundColor $Color
    }
    
    # Quality Gate Decision with Exit Codes
    if ($ErrorCount -gt 0) {
        Write-Host "QUALITY GATE FAILED - Script cannot be used due to errors!" -ForegroundColor Red
        return @{ Status = "FAIL"; ExitCode = 1 }
    } elseif ($WarningCount -gt 0) {
        Write-Host "QUALITY GATE WARNING - Script has issues but can be used" -ForegroundColor Yellow
        return @{ Status = "WARNING"; ExitCode = 2 }
    } else {
        Write-Host "QUALITY GATE PASSED - Script is ready for use!" -ForegroundColor Green
        return @{ Status = "PASS"; ExitCode = 0 }
    }
}

# Main execution
try {
    if (-not (Test-Path $ScriptPath)) {
        throw "Script file not found: $ScriptPath"
    }
    
    $Issues = Test-PowerShellQuality -Path $ScriptPath
    $Result = Show-QualityReport -Issues $Issues -ScriptPath $ScriptPath
    
    # Exit with appropriate code
    exit $Result.ExitCode
    
} catch {
    Write-Host "[ERROR] Quality gate failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
