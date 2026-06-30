@echo off
title Build SignSpeak AI Executable
color 0E

echo.
echo  ============================================
echo   Building SignSpeak AI Windows Executable
echo  ============================================
echo.

:: Check Python
python --version 2>&1
if errorlevel 1 (
    echo  ERROR: Python not found. Install from python.org
    pause
    exit /b 1
)

:: Install PyInstaller
echo.
echo  [1/3] Installing PyInstaller...
pip install pyinstaller
if errorlevel 1 (
    echo.
    echo  ERROR: PyInstaller failed to install.
    echo  Your Python version may be too new.
    echo  Install Python 3.12 from: https://www.python.org/downloads/release/python-3128/
    echo  Make sure to check "Add Python to PATH".
    echo.
    pause
    exit /b 1
)
echo         Done.

:: Build exe
echo.
echo  [2/3] Compiling SignSpeakAI.exe...
pyinstaller --onefile --name SignSpeakAI --console launcher.py
if errorlevel 1 (
    echo.
    echo  ERROR: Build failed. See errors above.
    pause
    exit /b 1
)
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
