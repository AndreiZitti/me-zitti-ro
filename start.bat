@echo off
:: Azitti Portfolio - Quick Start Script (Windows)
:: This script sets up and runs the development server

echo 🚀 Starting Azitti Portfolio Development Server...
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js v16+ from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm v8+
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo ✅ npm detected
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo.
)

echo 🎨 Starting particle animation website...
echo 📡 Server will be available at: http://localhost:3000
echo 🔄 Live reload enabled - changes will auto-refresh
echo.
echo Press Ctrl+C to stop the server
echo.

:: Start the development server
npm start

pause