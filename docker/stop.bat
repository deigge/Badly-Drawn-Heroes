@echo off
cd /d %~dp0

echo ===================================
echo   STOPPING DOCKER CONTAINER
echo ===================================

docker compose down

echo.
echo Checking status...
docker compose ps

echo.
echo [OK] Container stopped
echo.

pause