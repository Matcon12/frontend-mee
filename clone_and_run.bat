@echo off
echo Cloning the React.js repository...
git clone https://github.com/Matcon12/frontend-mee.git

cd 'frontend-mee'

echo Installing npm packages...
npm install
echo Installing npx globally 
npm install -g npx
echo Killing port 
npm install kill-port
