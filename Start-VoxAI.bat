@echo off
title VoxAI English Learning Platform
cd /d "%~dp0"
if exist "VoxAI.exe" (
    VoxAI.exe
) else (
    set PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%
    npm run dev
)
pause
