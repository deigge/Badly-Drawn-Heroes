@echo off
cd /d %~dp0

echo ===================================
echo   CONTAINER STATUS
echo ===================================

docker compose ps

echo.
pause