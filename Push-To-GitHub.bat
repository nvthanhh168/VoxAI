@echo off
title Push VoxAI to GitHub
echo ==================================================================
echo              Day code VoxAI len GitHub (nvthanhh168)
echo ==================================================================
echo.
echo [*] Dang kiem tra va day code len repository:
echo     https://github.com/nvthanhh168/VoxAI.git
echo.
echo (Luu y: Hay chac chan ban da tao repo ten la "VoxAI" tren https://github.com/new)
echo.
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ==================================================================
    echo [✓] Da day code len GitHub thanh cong!
    echo     Xem tai: https://github.com/nvthanhh168/VoxAI
    echo ==================================================================
) else (
    echo [!] Neu gap loi "Repository not found":
    echo     1. Vao https://github.com/new va tao repo ten: VoxAI
    echo     2. Chay lai file nay!
)
pause
