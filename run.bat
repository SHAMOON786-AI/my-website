@echo off
echo ========================================================
echo   Launching Shamoon Ashraf's Portfolio Website
echo ========================================================
echo.
cd /d "%~dp0"
if exist "python-portfolio\venv\Scripts\python.exe" (
    echo Starting server with virtualenv python...
    "python-portfolio\venv\Scripts\python.exe" app.py
) else (
    echo Starting server with system python...
    python app.py
)
pause
