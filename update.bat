@echo off
cd /d %~dp0

echo Pulling changes from origin main...
git pull origin main

echo Installing npm packages...
npm install
IF %ERRORLEVEL% NEQ 0 (
    echo Error: npm install failed.
    exit /b %ERRORLEVEL%
)

echo Generating Prisma client...
npx prisma generate
IF %ERRORLEVEL% NEQ 0 (
    echo Error: Prisma generation failed.
    exit /b %ERRORLEVEL%
)

echo Building npm project...
npm run build
IF %ERRORLEVEL% NEQ 0 (
    echo Error: npm run build failed.
    exit /b %ERRORLEVEL%
)

echo All commands executed successfully.
