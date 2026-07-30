@echo off
REM ============================================================
REM  Virava Chemicals — start everything (DB + API + Client)
REM ============================================================
cd /d "%~dp0"

echo [1/3] Starting PostgreSQL (port 5433)...
call "%~dp0database\start.bat"

echo [2/3] Starting API server (port 5000)...
start "Virava API" cmd /k "cd /d %~dp0server && node src/app.js"

echo [3/3] Starting website (port 5190)...
start "Virava Client" cmd /k "cd /d %~dp0client && npm run dev -- --port 5190"

echo.
echo ============================================================
echo   Website : http://localhost:5190
echo   Admin   : http://localhost:5190/admin
echo   Login   : admin@viravachemicals.com  /  Virava@2026
echo ============================================================
echo Close the two opened windows to stop API + Client.
echo Run database\stop.bat to stop PostgreSQL.
pause
