@echo off
cd "C:\Users\matcon\Downloads\mee-material-management"
git pull
start cmd.exe /k "call npx kill-port 3000"

cd "C:\Users\matcon\Downloads\mee-material-management"
start cmd.exe /k "call npm start"
pause
