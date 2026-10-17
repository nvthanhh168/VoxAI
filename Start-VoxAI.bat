@echo off
title VoxAI English Learning Platform
echo ==================================================================
echo        VoxAI - Next-Gen AI English Learning SaaS Platform
echo ==================================================================
set PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%
cd /d "c:\Users\NV THANH\OneDrive\Documents\Project\English"

echo [*] Starting server on http://localhost:3000 ...
start "" http://localhost:3000
npm run dev
pause
