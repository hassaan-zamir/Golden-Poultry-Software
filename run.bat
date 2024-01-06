@echo off
start cmd /k "npm run start"
timeout /t 15  >nul
start http://localhost:3000