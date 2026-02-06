@echo off
REM ========================================
REM Task Management App - Run Both Servers
REM ========================================

REM Colors for output (if supported)
cls
echo.
echo ========================================
echo   Task Management App Startup Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found: 
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if errorlevel 1 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)

echo ✓ npm found:
npm --version
echo.

REM Get the script directory
set SCRIPT_DIR=%~dp0
echo Script directory: %SCRIPT_DIR%
echo.

REM Check if backend exists
if not exist "%SCRIPT_DIR%backend\package.json" (
    echo ERROR: backend\package.json not found
    echo Please ensure you're running this from the project root
    pause
    exit /b 1
)

REM Check if frontend exists
if not exist "%SCRIPT_DIR%frontend\package.json" (
    echo ERROR: frontend\package.json not found
    echo Please ensure you're running this from the project root
    pause
    exit /b 1
)

echo ✓ Both project folders found
echo.

REM Ask user for mode
echo Choose startup mode:
echo 1. Run both servers
echo 2. Run backend only (port 5000)
echo 3. Run frontend only (port 3000)
echo 4. Install dependencies first

set /p choice="Enter choice (1-4): "

if "%choice%"=="1" goto run_both
if "%choice%"=="2" goto run_backend
if "%choice%"=="3" goto run_frontend
if "%choice%"=="4" goto install_deps
echo Invalid choice
goto end

:install_deps
echo.
echo Installing backend dependencies...
cd /d "%SCRIPT_DIR%backend"
call npm install
if errorlevel 1 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd /d "%SCRIPT_DIR%frontend"
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
pause
goto end

:run_backend
echo.
echo Starting Backend Server...
echo URL: http://localhost:5000
echo API: http://localhost:5000/api and deployed URL: https://taskmanagementapp-jywv.onrender.com/api
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%SCRIPT_DIR%backend"
call npm run dev
goto end

:run_frontend
echo.
echo Starting Frontend Server...
echo URL: http://localhost:3000 and deployed URL: https://taskmanagementapp-theta.vercel.app/
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%SCRIPT_DIR%frontend"
call npm run dev
goto end

:run_both
echo.
echo Starting BOTH servers...
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000 (or 3001) and deployed URL: https://taskmanagementapp-theta.vercel.app/
echo.
echo Press Ctrl+C in each terminal to stop the server
echo.

REM Open two command prompts
start cmd /k "cd /d %SCRIPT_DIR%backend && npm run dev"
start cmd /k "cd /d %SCRIPT_DIR%frontend && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo Wait a few moments for them to fully initialize
echo.
pause
goto end

:end
echo.
echo Goodbye!
