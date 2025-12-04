<#
.SYNOPSIS
    Password Change Tool for Lab3 Website

.DESCRIPTION
    This script generates a new auth_config.js file with a hashed password.
    The generated file can then be uploaded to the web server to change the
    admin password.

.NOTES
    Run this script offline/locally, not on the web server.
    Passwords are never stored in plain text - only SHA-256 hashes.
#>

function Get-SHA256Hash {
    param([string]$Text)
    
    $sha256 = [System.Security.Cryptography.SHA256]::Create()
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
    $hash = $sha256.ComputeHash($bytes)
    $hashString = [BitConverter]::ToString($hash) -replace '-', ''
    return $hashString.ToLower()
}

function Test-PasswordStrength {
    param([string]$Password)
    
    $issues = @()
    
    if ($Password.Length -lt 8) {
        $issues += "Password must be at least 8 characters long."
    }
    
    if ($Password -cnotmatch '[A-Z]') {
        $issues += "Password should contain at least one uppercase letter."
    }
    
    if ($Password -cnotmatch '[a-z]') {
        $issues += "Password should contain at least one lowercase letter."
    }
    
    if ($Password -notmatch '\d') {
        $issues += "Password should contain at least one number."
    }
    
    return $issues
}

function New-AuthConfig {
    param([string]$PasswordHash)
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    return @"
// SHA256 hash of the secure password
// Generated: $timestamp
// DO NOT share this file publicly or commit to public repositories
const PASSWORD_HASH = "$PasswordHash";
"@
}

# Main script
Clear-Host
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "  Lab3 Website Password Change Tool" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "This tool will generate a new auth_config.js file with your"
Write-Host "new password. Upload the generated file to your web server"
Write-Host "to change the admin password."
Write-Host ""
Write-Host ("-" * 60) -ForegroundColor DarkGray

# Get password
do {
    Write-Host ""
    $securePassword = Read-Host "Enter new password" -AsSecureString
    $password = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
    )
    
    if ([string]::IsNullOrEmpty($password)) {
        Write-Host "Error: Password cannot be empty." -ForegroundColor Red
        continue
    }
    
    # Check password strength
    $issues = Test-PasswordStrength -Password $password
    if ($issues.Count -gt 0) {
        Write-Host "Warning:" -ForegroundColor Yellow
        foreach ($issue in $issues) {
            Write-Host "  - $issue" -ForegroundColor Yellow
        }
        $proceed = Read-Host "Continue anyway? (y/n)"
        if ($proceed -ne 'y') {
            continue
        }
    }
    
    # Confirm password
    $secureConfirm = Read-Host "Confirm new password" -AsSecureString
    $confirmPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureConfirm)
    )
    
    if ($password -ne $confirmPassword) {
        Write-Host "Error: Passwords do not match. Please try again." -ForegroundColor Red
        continue
    }
    
    break
} while ($true)

# Generate hash
$passwordHash = Get-SHA256Hash -Text $password

Write-Host ""
Write-Host ("-" * 60) -ForegroundColor DarkGray
Write-Host "Password hash generated successfully!" -ForegroundColor Green
Write-Host "Hash: $passwordHash" -ForegroundColor DarkGray
Write-Host ""

# Determine paths
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$outputDir = Join-Path $scriptDir "output"
$actualConfigPath = Join-Path $projectRoot "js\auth_config.js"
$outputConfigPath = Join-Path $outputDir "auth_config.js"

# Create output directory
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

# Generate config content
$configContent = New-AuthConfig -PasswordHash $passwordHash

# Save to output directory
$configContent | Out-File -FilePath $outputConfigPath -Encoding UTF8 -NoNewline
Write-Host "New auth_config.js saved to:" -ForegroundColor Green
Write-Host "  $outputConfigPath" -ForegroundColor Cyan
Write-Host ""

# Ask about updating actual file
Write-Host "Would you like to also update the actual auth_config.js file?"
Write-Host "  Location: $actualConfigPath" -ForegroundColor DarkGray
$updateActual = Read-Host "Update now? (y/n)"

if ($updateActual -eq 'y') {
    try {
        $configContent | Out-File -FilePath $actualConfigPath -Encoding UTF8 -NoNewline
        Write-Host ""
        Write-Host "✓ auth_config.js has been updated!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "  1. Test the new password locally"
        Write-Host "  2. Commit and push the changes to your repository"
        Write-Host "  3. Deploy to your web server"
    }
    catch {
        Write-Host "Error updating file: $_" -ForegroundColor Red
        Write-Host "You can manually copy the file from the output directory."
    }
}
else {
    Write-Host ""
    Write-Host "To deploy the new password:" -ForegroundColor Yellow
    Write-Host "  1. Copy the generated auth_config.js to your js/ directory"
    Write-Host "  2. Upload to your web server"
    Write-Host "  3. Clear your browser cache and test the new password"
}

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "  Password change complete!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan

# Security reminder
Write-Host ""
Write-Host "SECURITY REMINDER:" -ForegroundColor Yellow
Write-Host "- Never share your password or this hash publicly" -ForegroundColor DarkGray
Write-Host "- Delete any temporary files containing password information" -ForegroundColor DarkGray
Write-Host "- Consider using a password manager" -ForegroundColor DarkGray
Write-Host ""

# Clear password from memory
$password = $null
$confirmPassword = $null
[System.GC]::Collect()

Read-Host "Press Enter to exit"
