param(
  [switch]$Apply,
  [string]$Backup,
  [switch]$Minify
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-UserPath {
  (Get-ItemProperty -Path 'HKCU:\Environment' -Name 'Path' -ErrorAction SilentlyContinue).Path
}

function Set-UserPath($value) {
  Set-ItemProperty -Path 'HKCU:\Environment' -Name 'Path' -Value $value
}

function Normalize-Entries($pathStr) {
  $sep = ';'
  $items = @()
  if ([string]::IsNullOrWhiteSpace($pathStr) -eq $false) {
    $items = $pathStr.Split($sep) | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
  }
  return $items
}

function Is-FilePath($p) { $p -match '\.(exe|cmd|bat|ps1)$' }

$orig = Get-UserPath
$origItems = Normalize-Entries $orig

# Deduplicate (case-insensitive), remove file paths
$seen = @{}
$clean = New-Object System.Collections.Generic.List[string]
$removedDuplicates = New-Object System.Collections.Generic.List[string]
$removedFileEntries = New-Object System.Collections.Generic.List[string]

foreach ($p in $origItems) {
  $key = $p.ToLower()
  if (Is-FilePath $p) { $removedFileEntries.Add($p); continue }
  if ($seen.ContainsKey($key)) { $removedDuplicates.Add($p); continue }
  $seen[$key] = $true
  $clean.Add($p)
}

if ($Minify) {
  # Remove trailing separators and obvious no-op segments
  $clean = [System.Collections.Generic.List[string]]@($clean | ForEach-Object { $_.TrimEnd('\','/') })
}

$new = ($clean -join ';')

$report = [ordered]@{
  mode = if ($Apply) { "APPLY" } else { "DRY-RUN" }
  oldCount = $origItems.Count
  newCount = $clean.Count
  removedDuplicates = $removedDuplicates
  removedFileEntries = $removedFileEntries
  proposedPathPreview = ($new.Substring(0, [Math]::Min($new.Length, 400))) + $(if ($new.Length -gt 400) { '…' } else { '' })
}

$report | ConvertTo-Json -Depth 5 | Write-Output

if (-not $Apply) { exit 0 }

if ($Backup) {
  $backupObj = [ordered]@{ dateUtc = (Get-Date).ToUniversalTime().ToString('o'); userPath = $orig }
  $backupObj | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 -Path $Backup
  Write-Host "Backup saved to $Backup"
}

Write-Host "`nAbout to update **User PATH** only. Proceed? (Y/N)"
$confirm = Read-Host
if ($confirm -notin @('Y','y')) {
  Write-Host "Aborted."
  exit 0
}

Set-UserPath $new
Write-Host "User PATH updated. Please restart your terminal session."

