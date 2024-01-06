@echo off
start cmd /k "git pull origin main && npm install && npx prisma generate && npm run build && npm run start"
timeout /t 30  >nul
start http://localhost:3000