@echo off
REM Task Tracker System - Setup Script for Windows

echo.
echo ========================================
echo   Task Tracker System Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js detected: %NODE_VERSION%
echo.

REM Change to backend directory
echo [1/4] Setting up Backend...
cd backend
echo       Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
echo [OK] Backend setup complete!
cd ..
echo.

REM Change to frontend directory
echo [2/4] Setting up Frontend...
cd frontend
echo       Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
echo [OK] Frontend setup complete!
cd ..
echo.

REM Verification
echo [3/4] Verifying setup...
cd backend
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend environment verified
)
cd ..
echo.

echo [4/4] Setup Summary
echo ========================================
echo.
echo ✓ Backend installed successfully
echo ✓ Frontend installed successfully
echo ✓ All dependencies resolved
echo.
echo ========================================
echo   READY TO START!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Open Terminal 1 and run:
echo    cd backend
echo    npm run dev
echo.
echo 2. Open Terminal 2 and run:
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open browser: http://localhost:3000
echo    PIN: 1234
echo.
echo For detailed setup, see QUICK_START.md
echo.
pause
