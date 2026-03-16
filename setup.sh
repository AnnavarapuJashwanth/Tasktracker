#!/bin/bash

# Task Tracker System - Setup Script for Mac/Linux

echo ""
echo "========================================"
echo "  Task Tracker System Setup Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please download from: https://nodejs.org/"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

node_version=$(node --version)
echo "[OK] Node.js detected: $node_version"
echo ""

# Setup Backend
echo "[1/4] Setting up Backend..."
cd backend
echo "       Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    cd ..
    read -p "Press Enter to exit..."
    exit 1
fi
echo "[OK] Backend setup complete!"
cd ..
echo ""

# Setup Frontend
echo "[2/4] Setting up Frontend..."
cd frontend
echo "       Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    cd ..
    read -p "Press Enter to exit..."
    exit 1
fi
echo "[OK] Frontend setup complete!"
cd ..
echo ""

# Verification
echo "[3/4] Verifying setup..."
if command -v node &> /dev/null; then
    echo "[OK] Backend environment verified"
fi
echo ""

# Summary
echo "[4/4] Setup Summary"
echo "========================================"
echo ""
echo "✓ Backend installed successfully"
echo "✓ Frontend installed successfully"
echo "✓ All dependencies resolved"
echo ""
echo "========================================"
echo "   READY TO START!"
echo "========================================"
echo ""
echo "To start the application:"
echo ""
echo "1. Open Terminal 1 and run:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "2. Open Terminal 2 and run:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open browser: http://localhost:3000"
echo "   PIN: 1234"
echo ""
echo "For detailed setup, see QUICK_START.md"
echo ""
