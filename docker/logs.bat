@echo off
cd /d %~dp0

echo ===================================
echo   LIVE LOGS (CTRL+C to exit)
echo ===================================

docker compose logs -f