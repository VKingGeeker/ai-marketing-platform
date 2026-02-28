@echo off
chcp 65001 >nul
echo ========================================
echo   GitHub Push Script
echo ========================================
echo.
echo 正在推送代码到 GitHub...
cd /d "%~dp0"
echo.
echo 如果提示登录，请输入您的 GitHub 用户名和密码
echo (建议使用 Personal Access Token 代替密码)
echo.
git push -u https://github.com/VKingGeeker/ai-marketing-platform.git master
echo.
echo ========================================
echo   操作完成
echo ========================================
pause
