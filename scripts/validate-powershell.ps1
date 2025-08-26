# POWERSHELL VALIDATION SCRIPT
# For CI/CD validation of PowerShell scripts

param(
    [Parameter(Mandatory=$false)]
    [string]$ScriptPath = "scripts"
)

function Test-PowerShellScripts {
    param([string]$Path)
    
    Write-Host "Validating PowerShell scripts in: $Path" -ForegroundColor Cyan
    
    $Scripts = Get-ChildItem -Path $Path -Filter "*.ps1" -Recurse
    $TotalScripts = $Scripts.Count
    $ValidScripts = 0
    $Issues = @()
    
    Write-Host "Found $TotalScripts PowerShell scripts" -ForegroundColor White
    
    foreach ($Script in $Scripts) {
        Write-Host "  Checking: $($Script.Name)" -ForegroundColor White
        
        try {
            # Test 1: Script can be loaded
            $Content = Get-Content $Script.FullName -Raw
            if (-not $Content) {
                $Issues += @{ Script = $Script.Name; Issue = "Empty script" }
                continue
            }
            
            # Test 2: Basic syntax check
            $null = [System.Management.Automation.PSParser]::Tokenize($Content, [ref]$null)
            
            # Test 3: Check for PSUseApprovedVerbs
            $FunctionMatches = [regex]::Matches($Content, 'function\s+([A-Za-z-]+)')
            foreach ($Match in $FunctionMatches) {
                $FunctionName = $Match.Groups[1].Value
                $Verb = $FunctionName.Split('-')[0]
                
                $ApprovedVerbs = @(
                    'Add', 'Clear', 'Close', 'Copy', 'Enter', 'Exit', 'Find', 'Format', 'Get', 'Hide',
                    'Join', 'Lock', 'Move', 'New', 'Open', 'Pop', 'Push', 'Redo', 'Remove', 'Rename',
                    'Reset', 'Resize', 'Search', 'Select', 'Set', 'Show', 'Skip', 'Split', 'Step', 'Switch',
                    'Test', 'Trace', 'Undo', 'Unlock', 'Watch'
                )
                
                if ($ApprovedVerbs -notcontains $Verb) {
                    $Issues += @{ Script = $Script.Name; Issue = "Function '$FunctionName' uses unapproved verb '$Verb'" }
                }
            }
            
            $ValidScripts++
            
        } catch {
            $Issues += @{ Script = $Script.Name; Issue = "Syntax error: $($_.Exception.Message)" }
        }
    }
    
    # Report results
    Write-Host "`nValidation Results:" -ForegroundColor Yellow
    Write-Host "  Total scripts: $TotalScripts" -ForegroundColor White
    Write-Host "  Valid scripts: $ValidScripts" -ForegroundColor Green
    Write-Host "  Issues found: $($Issues.Count)" -ForegroundColor $(if ($Issues.Count -eq 0) { "Green" } else { "Red" })
    
    if ($Issues.Count -gt 0) {
        Write-Host "`nIssues found:" -ForegroundColor Red
        foreach ($Issue in $Issues) {
            Write-Host "  [$($Issue.Script)] $($Issue.Issue)" -ForegroundColor Red
        }
        return $false
    }
    
    Write-Host "`nAll PowerShell scripts are valid!" -ForegroundColor Green
    return $true
}

# Main execution
try {
    $Result = Test-PowerShellScripts -Path $ScriptPath
    
    if (-not $Result) {
        Write-Host "PowerShell validation FAILED" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "PowerShell validation PASSED" -ForegroundColor Green
    exit 0
    
} catch {
    Write-Host "[ERROR] PowerShell validation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
