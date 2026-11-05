@echo off
powershell.exe -NoProfile -File "%~dp0START_TLM.ps1" %*
exit /b %errorlevel%
