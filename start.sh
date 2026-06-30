#!/bin/bash
# SignSpeak AI — Start Script
# Starts both frontend and backend servers

echo "========================================="
echo "  SignSpeak AI — Starting servers..."
echo "========================================="
echo ""

# Start backend
echo "[1/2] Starting FastAPI backend on :8000..."
cd backend
pip install -q -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Start frontend
echo "[2/2] Starting React frontend on :3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================="
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo "========================================="
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
