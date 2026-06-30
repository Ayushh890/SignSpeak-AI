@echo off
title Build SignSpeak AI Executable
color 0E

echo.
echo  ============================================
echo   Building SignSpeak AI Windows Executable
echo  ============================================
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo  ERROR: Python not found. Install from python.org
    pause
    exit /b 1
)

:: Install PyInstaller
echo  [1/3] Installing PyInstaller...
python -m pip install pyinstaller >nul 2>&1
echo         Done.

:: Build exe
echo  [2/3] Compiling SignSpeakAI.exe...
python -m PyInstaller --onefile --name SignSpeakAI --console --icon=NONE launcher.py
echo         Done.

:: Done
echo  [3/3] Cleaning up...
rmdir /s /q build >nul 2>&1
del SignSpeakAI.spec >nul 2>&1

echo.
echo  ============================================
echo   BUILD COMPLETE!
echo.
echo   Your executable is at:
echo   dist\SignSpeakAI.exe
echo.
echo   Copy SignSpeakAI.exe to the project root
echo   folder and double-click to run!
echo  ============================================
echo.
pause
