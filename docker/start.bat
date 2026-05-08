@echo off
cd /d %~dp0

echo ===================================
echo   STARTING DOCKER CONTAINER
echo ===================================

docker compose up -d

echo.
echo Checking container status...
docker compose ps

echo.
echo Opening browser...

start http://localhost:8080

echo.
echo [OK] Container is running at http://localhost:8080
echo.

pause