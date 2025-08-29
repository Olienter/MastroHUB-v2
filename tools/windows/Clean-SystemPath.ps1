param(
  [switch]$Apply,
  [string]$Backup,
  [switch]$Verbose
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Test-AdminPrivileges {
  $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Get-SystemPath {
  try {
    $systemPath = (Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment' -Name 'Path' -ErrorAction Stop).Path
    return $systemPath
  }
  catch {
    Write-Error "Cannot read System PATH (HKLM). Error: $($_.Exception.Message)"
    Write-Host "This usually means PowerShell doesn't have admin privileges to read HKLM."
    Write-Host "Use manual GUI cleanup instead (see docs/path-system-cleanup.md)"
    exit 1
  }
}

function Set-SystemPath($value) {
  try {
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment' -Name 'Path' -Value $value
    return $true
  }
  catch {
    Write-Error "Cannot write System PATH (HKLM). Error: $($_.Exception.Message)"
    Write-Host "This usually means PowerShell doesn't have admin privileges to write HKLM."
    Write-Host "Use manual GUI cleanup instead (see docs/path-system-cleanup.md)"
    return $false
  }
}

function Normalize-Entries($pathStr) {
  $sep = ';'
  $items = @()
  if ([string]::IsNullOrWhiteSpace($pathStr) -eq $false) {
    $items = $pathStr.Split($sep) | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
  }
  return $items
}

function Is-FilePath($p) { 
  $p -match '\.(exe|cmd|bat|ps1|msi|dll)$' 
}

function Clean-PathEntries($entries) {
  $seen = @{}
  $clean = New-Object System.Collections.Generic.List[string]
  $removedDuplicates = New-Object System.Collections.Generic.List[string]
  $removedFileEntries = New-Object System.Collections.Generic.List[string]

  foreach ($p in $entries) {
    $key = $p.ToLower()
    
    if (Is-FilePath $p) {
      $removedFileEntries.Add($p)
      continue
    }
    
    if ($seen.ContainsKey($key)) {
      $removedDuplicates.Add($p)
      continue
    }
    
    $seen[$key] = $true
    $clean.Add($p)
  }

  return @{
    Clean = $clean
    RemovedDuplicates = $removedDuplicates
    RemovedFileEntries = $removedFileEntries
  }
}

# Main execution
try {
  # Check admin privileges
  if (-not (Test-AdminPrivileges)) {
    Write-Error "This script requires Administrator privileges to modify System PATH (HKLM)."
    Write-Host "Please run PowerShell as Administrator or use manual GUI cleanup."
    Write-Host "See docs/path-system-cleanup.md for manual procedure."
    exit 1
  }

  $orig = Get-SystemPath
  $origItems = Normalize-Entries $orig
  
  # Clean the PATH
  $cleaned = Clean-PathEntries $origItems
  
  $new = ($cleaned.Clean -join ';')
  
  $report = [ordered]@{
    mode = if ($Apply) { "APPLY" } else { "DRY-RUN" }
    scope = "System PATH (HKLM)"
    oldCount = $origItems.Count
    newCount = $cleaned.Clean.Count
    removedDuplicates = $cleaned.RemovedDuplicates
    removedFileEntries = $cleaned.RemovedFileEntries
    proposedPathPreview = ($new.Substring(0, [Math]::Min($new.Length, 400))) + $(if ($new.Length -gt 400) { '…' } else { '' })
    recommendations = @()
  }
  
  if ($cleaned.RemovedFileEntries.Count -gt 0) {
    $report.recommendations += "Removed file paths from System PATH: *.exe, *.cmd, *.bat, *.ps1, *.msi, *.dll"
  }
  if ($cleaned.RemovedDuplicates.Count -gt 0) {
    $report.recommendations += "Removed duplicate System PATH entries to reduce lookup ambiguity"
  }
  if ($report.recommendations.Count -eq 0) {
    $report.recommendations += "System PATH is already clean - no action needed"
  }
  
  $report | ConvertTo-Json -Depth 5 | Write-Output
  
  if (-not $Apply) { 
    Write-Host "`nDRY-RUN completed. To apply changes, use: -Apply" -ForegroundColor Yellow
    exit 0 
  }
  
  # Apply phase
  if ($Backup) {
    $backupObj = [ordered]@{
      dateUtc = (Get-Date).ToUniversalTime().ToString('o')
      scope = "System PATH (HKLM)"
      originalPath = $orig
      originalCount = $origItems.Count
    }
    $backupObj | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 -Path $Backup
    Write-Host "Backup saved to $Backup" -ForegroundColor Green
  }
  
  Write-Host "`n⚠️  WARNING: About to modify SYSTEM PATH (HKLM) - affects ALL users!" -ForegroundColor Red
  Write-Host "This will remove $($cleaned.RemovedDuplicates.Count) duplicates and $($cleaned.RemovedFileEntries.Count) file entries." -ForegroundColor Yellow
  Write-Host "Proceed with System PATH cleanup? (Y/N)" -ForegroundColor White
  
  $confirm = Read-Host
  if ($confirm -notin @('Y','y')) {
    Write-Host "Aborted. System PATH unchanged." -ForegroundColor Yellow
    exit 0
  }
  
  # Apply the changes
  if (Set-SystemPath $new) {
    Write-Host "✅ System PATH updated successfully!" -ForegroundColor Green
    Write-Host "Changes applied: -$($cleaned.RemovedDuplicates.Count) duplicates, -$($cleaned.RemovedFileEntries.Count) file entries" -ForegroundColor Green
    Write-Host "`n⚠️  IMPORTANT: Restart your terminal session and run 'pnpm run diag:env' to verify changes." -ForegroundColor Yellow
  } else {
    Write-Host "❌ Failed to update System PATH. Use manual GUI cleanup instead." -ForegroundColor Red
    exit 1
  }
  
  if ($Verbose) {
    Write-Host "`nDetailed Summary:" -ForegroundColor Cyan
    Write-Host "Original entries: $($origItems.Count)" -ForegroundColor White
    Write-Host "New entries: $($cleaned.Clean.Count)" -ForegroundColor White
    Write-Host "Duplicates removed: $($cleaned.RemovedDuplicates.Count)" -ForegroundColor Green
    Write-Host "File entries removed: $($cleaned.RemovedFileEntries.Count)" -ForegroundColor Green
  }
}
catch {
  Write-Error "System PATH cleanup failed: $($_.Exception.Message)"
  Write-Host "Use manual GUI cleanup instead (see docs/path-system-cleanup.md)" -ForegroundColor Yellow
  exit 1
}
