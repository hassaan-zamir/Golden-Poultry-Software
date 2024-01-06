@echo off
cd /d %~dp0

echo Pulling changes from origin main...
git pull origin main

echo Installing npm packages...
npm install

echo Generating Prisma client...
npx prisma generate

echo Building npm project...
npm run build

echo All commands executed successfully.
echo Close and run run.bat file now