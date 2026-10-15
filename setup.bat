@echo off
setlocal
rem Stock Forum - one-click local environment setup (Windows)
rem Steps: check Node.js, install packages, prepare .env, check database, run checks.
rem Safe to run again: every step skips work that is already done.

cd /d "%~dp0"

echo.
echo [1/5] Checking Node.js ...
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js 20 LTS or newer from https://nodejs.org/ and run this file again.
  goto :fail
)
node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit((a===18&&b>=18)||(a===20&&b>=9)||a>=21?0:1)"
if errorlevel 1 (
  echo This project needs Node.js 18.18+, 20.9+ or 22+. Installed version:
  node -v
  goto :fail
)
node -v
node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit((a===20&&b>=19)||(a===22&&b>=13)||a>=24?0:1)"
if errorlevel 1 (
  echo Note: Node.js 22 LTS is recommended. Some lint packages expect 20.19+ or 22.13+
  echo and npm may print EBADENGINE warnings. Setup will continue.
)

echo.
echo [2/5] Installing packages from package-lock.json ...
call npm ci
if errorlevel 1 goto :fail

echo.
echo [3/5] Preparing .env ...
call node scripts\init-env.mjs
if errorlevel 2 goto :editenv
if errorlevel 1 goto :fail
goto :database

:editenv
echo.
echo Notepad will open .env. Fill in the values listed above
echo (MONGODB_URI, DEMO_PASSWORD, ...), save the file and close Notepad to continue.
start /wait notepad .env
call node scripts\init-env.mjs
if errorlevel 1 (
  echo .env is still incomplete. Edit .env and run this file again.
  goto :fail
)

:database
echo.
echo [4/5] Checking database connection and the guest account ...
call npm run setup:db
if errorlevel 1 goto :fail

echo.
echo [5/5] Running lint and type check ...
call npm run check
if errorlevel 1 goto :fail

echo.
echo ============================================================
echo  Setup complete. Start the site with:  npm run dev
echo  Then open http://localhost:3000
echo ============================================================
pause
exit /b 0

:fail
echo.
echo Setup stopped. Read the message above, fix it, then run setup.bat again.
pause
exit /b 1
