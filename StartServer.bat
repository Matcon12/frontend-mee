@echo off
cd "C:\Users\matcon\Downloads\frontend-mee"
git pull
start cmd.exe /k "call npx kill-port 3000"

cd "C:\Users\matcon\Downloads\frontend-mee"
start cmd.exe /k "call npm start"
pause
