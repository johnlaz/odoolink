@echo off
:: Odoo Email Link - Start
:: Double-click to launch. imap_server.py starts server.py automatically.
cd /d "%~dp0"

python --version >nul 2>&1
if errorlevel 1 (
    echo Python not found. Install from https://python.org
    pause
    exit /b 1
)

:: Stop any existing instance on port 7843
powershell -WindowStyle Hidden -Command "Stop-Process -Id (Get-NetTCPConnection -LocalPort 7843 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue" >nul 2>&1

:: Start imap_server.py — it will also start server.py automatically
powershell -WindowStyle Hidden -Command "Start-Process pythonw -ArgumentList 'imap_server.py' -WorkingDirectory '%~dp0' -WindowStyle Hidden -ErrorAction SilentlyContinue"
if errorlevel 1 (
    powershell -WindowStyle Hidden -Command "Start-Process python -ArgumentList 'imap_server.py' -WorkingDirectory '%~dp0' -WindowStyle Hidden"
)

:: Wait for servers to come up
timeout /t 3 /nobreak >nul

:: Open the app
start "" "index.html"
exit /b 0
