@echo off
cd /d "%~dp0client"
call npm run dev -- --port 5190
