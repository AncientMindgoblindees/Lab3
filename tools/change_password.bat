@echo off
REM Password Change Tool Launcher for Lab3 Website
REM Run this script to change the admin password

echo.
echo ============================================================
echo   Lab3 Website Password Change Tool
echo ============================================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Running password change tool...
    echo.
    python "%~dp0change_password.py"
) else (
    echo Python is not installed or not in PATH.
    echo.
    echo Please install Python from https://python.org
    echo Or run the PowerShell version: .\change_password.ps1
    echo.
)

echo.
pause
