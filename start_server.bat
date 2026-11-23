@echo off
title Marwadi Royal Wedding Invitation Server - Ritika & Kailashji
cd /d "%~dp0"
start "" http://localhost:8000
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
