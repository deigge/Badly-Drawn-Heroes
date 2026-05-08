@echo off
cd /d %~dp0

echo ===================================
echo   RESTARTING CONTAINER
echo ===================================

docker compose down
docker compose up -d

echo.
echo Checking status...
docker compose ps

echo.
echo Opening browser...

start http://localhost:8080

echo.
echo [OK] Restart complete
echo.

pause