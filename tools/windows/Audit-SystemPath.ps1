param(
  [switch]$Verbose
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

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

function Is-Duplicate($entries, $index) {
  $current = $entries[$index]
  for ($i = 0; $i -lt $index; $i++) {
    if ($entries[$i] -eq $current) { return $true }
  }
  return $false
}

try {
  $orig = Get-SystemPath
  $origItems = Normalize-Entries $orig
  
  # Analyze duplicates and file entries
  $duplicates = @()
  $fileEntries = @()
  $seen = @{}
  
  for ($i = 0; $i -lt $origItems.Count; $i++) {
    $p = $origItems[$i]
    $key = $p.ToLower()
    
    if (Is-FilePath $p) { 
      $fileEntries += $p 
    }
    
    if ($seen.ContainsKey($key)) {
      $duplicates += $p
    } else {
      $seen[$key] = $true
    }
  }
  
  $total = $origItems.Count
  $unique = $seen.Count
  $overlong = $total -gt 64
  
  $report = [ordered]@{
    timestamp = (Get-Date).ToUniversalTime().ToString('o')
    scope = "System PATH (HKLM)"
    totalEntries = $total
    uniqueEntries = $unique
    duplicates = $duplicates
    fileEntries = $fileEntries
    overlong = $overlong
    status = if ($duplicates.Count -gt 0 -or $fileEntries.Count -gt 0 -or $overlong) { "WARN" } else { "OK" }
    recommendations = @()
  }
  
  if ($fileEntries.Count -gt 0) {
    $report.recommendations += "Remove file paths from System PATH: *.exe, *.cmd, *.bat, *.ps1, *.msi, *.dll"
  }
  if ($duplicates.Count -gt 0) {
    $report.recommendations += "Remove duplicate System PATH entries to reduce lookup ambiguity"
  }
  if ($overlong) {
    $report.recommendations += "Trim System PATH length (target ≤ 64 entries)"
  }
  if ($report.recommendations.Count -eq 0) {
    $report.recommendations += "System PATH is clean - no action needed"
  }
  
  $report | ConvertTo-Json -Depth 5 | Write-Output
  
  if ($Verbose) {
    Write-Host "`nDetailed Analysis:" -ForegroundColor Yellow
    Write-Host "Total entries: $total" -ForegroundColor White
    Write-Host "Unique entries: $unique" -ForegroundColor White
    Write-Host "Duplicates: $($duplicates.Count)" -ForegroundColor $(if ($duplicates.Count -gt 0) { "Red" } else { "Green" })
    Write-Host "File entries: $($fileEntries.Count)" -ForegroundColor $(if ($fileEntries.Count -gt 0) { "Red" } else { "Green" })
    Write-Host "Overlong: $overlong" -ForegroundColor $(if ($overlong) { "Red" } else { "Green" })
  }
}
catch {
  Write-Error "Audit failed: $($_.Exception.Message)"
  exit 1
}
