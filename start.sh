#!/bin/bash

# Azitti Portfolio - Quick Start Script
# This script sets up and runs the development server

echo "🚀 Starting Azitti Portfolio Development Server..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+ from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm v8+"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to Node.js v16+"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo "✅ npm $(npm -v) detected"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🎨 Starting particle animation website..."
echo "📡 Server will be available at: http://localhost:3000"
echo "🔄 Live reload enabled - changes will auto-refresh"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm start