@echo off
title SignSpeak AI
echo ==================================================
echo   SignSpeak AI - Real-Time Sign Language Translator
echo ==================================================
echo.

echo [1/4] Checking Python...
python --version 2>nul || (echo Python not found! Install from python.org && pause && exit)

echo [2/4] Checking Node.js...
node --version 2>nul || (echo Node.js not found! Install from nodejs.org && pause && exit)

echo [3/4] Installing dependencies...
cd backend
pip install -q -r requirements.txt
cd ..

cd frontend
if not exist node_modules (
    echo Installing frontend packages...
    npm install
)
cd ..

echo [4/4] Starting servers...
echo.

start "SignSpeak Backend" cmd /c "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 /nobreak >nul

start "SignSpeak Frontend" cmd /c "cd frontend && npx vite --host 0.0.0.0 --port 3000"

timeout /t 3 /nobreak >nul

echo ==================================================
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo ==================================================
echo.

start http://localhost:3000

echo Press any key to stop all servers...
pause >nul

taskkill /FI "WINDOWTITLE eq SignSpeak Backend" /F 2>nul
taskkill /FI "WINDOWTITLE eq SignSpeak Frontend" /F 2>nul
echo Servers stopped.
