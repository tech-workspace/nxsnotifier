@echo off
chcp 65001 >nul

echo 🚂 Railway URL Update Helper
echo ============================

echo.
echo 📋 Please follow these steps:
echo.
echo 1. Go to your Railway dashboard
echo 2. Click on your deployed service
echo 3. Copy the URL (it looks like: https://your-app-name.railway.app)
echo 4. Paste it below when prompted
echo.

set /p RAILWAY_URL="Enter your Railway URL (without /api): "

echo.
echo 🔧 Updating frontend configuration...
echo.

echo Current PROD_API_URL in app/config/api.js:
findstr "PROD_API_URL" app\config\api.js

echo.
echo Updating to: %RAILWAY_URL%/api

powershell -Command "(Get-Content 'app/config/api.js') -replace 'const PROD_API_URL = .*', 'const PROD_API_URL = \"%RAILWAY_URL%/api\";' | Set-Content 'app/config/api.js'"

echo.
echo ✅ Updated! New PROD_API_URL:
findstr "PROD_API_URL" app\config\api.js

echo.
echo 🎯 Next steps:
echo 1. Test your app to make sure it connects to Railway
echo 2. Deploy your frontend to Vercel/Netlify
echo 3. Build your mobile app for production
echo.

pause 