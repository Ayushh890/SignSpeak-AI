@echo off
chcp 65001 >nul 2>&1
title SignSpeak AI - Real-Time Sign Language Translator
color 0A

echo.
echo  ============================================================
echo          SignSpeak AI - Real-Time Sign Language Translator
echo  ============================================================
echo.
echo   Detects hand signs, facial expressions, body pose,
echo   lip movement and translates to 8+ languages.
echo.
echo  ============================================================
echo.

:: Check Python
echo  [1/5] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo  ERROR: Python is not installed!
    echo  Download from: https://www.python.org/downloads/
    echo  Make sure to check "Add Python to PATH" during install.
    echo.
    pause
    exit /b 1
)
for /f "tokens=2" %%i in ('python --version 2^>^&1') do echo         Found Python %%i

:: Check Node.js
echo  [2/5] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo  ERROR: Node.js is not installed!
    echo  Download from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
for /f %%i in ('node --version') do echo         Found Node.js %%i

:: Install backend dependencies
echo  [3/5] Installing backend dependencies...
cd /d "%~dp0backend"
python -m pip install -q -r requirements.txt >nul 2>&1
echo         Done.

:: Install frontend dependencies
echo  [4/5] Installing frontend dependencies...
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo         First run - installing packages ^(this may take a minute^)...
    call npm install >nul 2>&1
)
echo         Done.

:: Start servers
echo  [5/5] Starting servers...
echo.

cd /d "%~dp0backend"
start /B "SignSpeak-Backend" cmd /c "python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 2>&1 >nul"

cd /d "%~dp0frontend"
start /B "SignSpeak-Frontend" cmd /c "npx vite --host 127.0.0.1 --port 3000 2>&1 >nul"

:: Wait for servers to start
echo  Waiting for servers to start...
timeout /t 5 /nobreak >nul

:: Open browser
start http://localhost:3000

echo.
echo  ============================================================
echo.
echo   SignSpeak AI is running!
echo.
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:8000
echo   API Docs:  http://localhost:8000/docs
echo.
echo  ============================================================
echo.
echo   Press any key to STOP all servers and exit...
echo.
pause >nul

:: Kill servers
taskkill /FI "WINDOWTITLE eq SignSpeak-Backend" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq SignSpeak-Frontend" /F >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1

echo.
echo  Servers stopped. Goodbye!
timeout /t 2 /nobreak >nul
