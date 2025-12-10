#!/bin/bash

# Start Backend and Frontend - Student Management System

echo "🚀 Starting Student Management System..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Start Backend
echo -e "${BLUE}📊 Starting Backend (SQLite Database)...${NC}"
cd backend
node server.js &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started on http://localhost:3001${NC}"
echo "   PID: $BACKEND_PID"
echo ""

# Wait a bit for backend to start
sleep 2

# Start Frontend
echo -e "${BLUE}🎨 Starting Frontend...${NC}"
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started on http://localhost:5173${NC}"
echo "   PID: $FRONTEND_PID"
echo ""

echo "============================================"
echo -e "${GREEN}🎉 Application is running!${NC}"
echo "============================================"
echo ""
echo "Backend:  http://localhost:3001"
echo "Frontend: http://localhost:5173"
echo ""
echo "To stop the servers:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Or press Ctrl+C and run:"
echo "  killall node"
echo ""

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
