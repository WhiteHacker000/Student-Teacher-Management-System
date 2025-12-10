#!/bin/bash

echo "🔍 Verifying Student-Teacher Management System Setup..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "1. Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js v16+"
    exit 1
fi

# Check npm
echo "2. Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm installed: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

# Check backend .env
echo "3. Checking backend/.env..."
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} backend/.env exists"
    
    # Check MONGODB_URI
    if grep -q "MONGODB_URI=mongodb" backend/.env; then
        if grep -q "MONGODB_URI=mongodb+srv://kushalvats1316_db_user:okay@" backend/.env; then
            echo -e "${YELLOW}⚠${NC}  Warning: Using default MongoDB password 'okay'"
            echo "   Please change this password in MongoDB Atlas and update .env"
        else
            echo -e "${GREEN}✓${NC} MONGODB_URI configured"
        fi
    else
        echo -e "${RED}✗${NC} MONGODB_URI not found in .env"
    fi
    
    # Check JWT_SECRET
    if grep -q "JWT_SECRET=" backend/.env; then
        if grep -q "JWT_SECRET=a1b2c3d4e5f6g7h8i9j0" backend/.env; then
            echo -e "${YELLOW}⚠${NC}  Warning: Using example JWT_SECRET"
            echo "   Please generate a new secret with:"
            echo "   node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
        else
            echo -e "${GREEN}✓${NC} JWT_SECRET configured"
        fi
    else
        echo -e "${RED}✗${NC} JWT_SECRET not found in .env"
    fi
else
    echo -e "${RED}✗${NC} backend/.env not found"
    echo "   Copy from backend/.env.example and configure"
    exit 1
fi

# Check frontend .env
echo "4. Checking frontend/.env..."
if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✓${NC} frontend/.env exists"
    
    if grep -q "VITE_API_URL=" frontend/.env; then
        echo -e "${GREEN}✓${NC} VITE_API_URL configured"
    else
        echo -e "${RED}✗${NC} VITE_API_URL not found in .env"
    fi
else
    echo -e "${YELLOW}⚠${NC}  frontend/.env not found (will use defaults)"
fi

# Check dependencies
echo "5. Checking dependencies..."
if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC}  Backend dependencies not installed"
    echo "   Run: cd backend && npm install"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC}  Frontend dependencies not installed"
    echo "   Run: cd frontend && npm install"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Summary:"
echo ""

# Count issues
ISSUES=0

if grep -q "MONGODB_URI=mongodb+srv://kushalvats1316_db_user:okay@" backend/.env 2>/dev/null; then
    ISSUES=$((ISSUES + 1))
fi

if grep -q "JWT_SECRET=a1b2c3d4e5f6g7h8i9j0" backend/.env 2>/dev/null; then
    ISSUES=$((ISSUES + 1))
fi

if [ ! -d "backend/node_modules" ]; then
    ISSUES=$((ISSUES + 1))
fi

if [ ! -d "frontend/node_modules" ]; then
    ISSUES=$((ISSUES + 1))
fi

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "You can start the application with:"
    echo "  npm run dev"
else
    echo -e "${YELLOW}⚠ $ISSUES issue(s) found${NC}"
    echo ""
    echo "Please fix the issues above before starting."
    echo ""
    echo "Quick fixes:"
    echo "1. Update MongoDB password in backend/.env"
    echo "2. Generate new JWT secrets"
    echo "3. Install dependencies: npm install"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentation:"
echo "  - Quick Start: QUICK_START.md"
echo "  - Setup Guide: BEFORE_YOU_START.md"
echo "  - Full Docs: README_NEW.md"
echo ""
