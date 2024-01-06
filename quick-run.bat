@echo off
start cmd /k "npm run start"
timeout /t 5  >nul
start http://localhost:3000