@echo off
title Deploy VoxAI to Vercel
echo ==================================================================
echo           Trien khai VoxAI len Vercel (public ra ngoai)
echo ==================================================================
echo.
set PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%
cd /d "%~dp0"

echo [*] Dang khoi chay Vercel CLI...
echo     (Trinh duyet se mo de ban dang nhap tai khoan: vercel.com/nvt1)
echo.
npx vercel --prod
pause
