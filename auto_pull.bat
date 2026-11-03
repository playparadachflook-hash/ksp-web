@echo off
cd /d "E:\ksp-webhos"

git fetch origin main >nul 2>&1

for /f %%i in ('git rev-parse HEAD') do set LOCAL=%%i
for /f %%i in ('git rev-parse origin/main') do set REMOTE=%%i

if "%LOCAL%"=="%REMOTE%" (
    echo [%date% %time%] Website is already up to date.
) else (
    echo [%date% %time%] New changes detected on GitHub. Pulling updates...
    git pull origin main
    echo [%date% %time%] Website updated successfully!
)

if "%1"=="/loop" (
    timeout /t 60 /nobreak >nul
    goto :loop_start
)

exit /b 0

:loop_start
cls
:start_again
cd /d "E:\ksp-webhos"
git fetch origin main >nul 2>&1
for /f %%i in ('git rev-parse HEAD') do set LOCAL=%%i
for /f %%i in ('git rev-parse origin/main') do set REMOTE=%%i
if not "%LOCAL%"=="%REMOTE%" (
    echo [%date% %time%] Pulling new changes from GitHub...
    git pull origin main
)
timeout /t 60 /nobreak >nul
goto :start_again
