@echo off
chcp 65001 >nul

echo 🚂 Testing Railway Backend Connection
echo =====================================

echo.
echo 🔍 Testing connection to: https://nxsnotifier.up.railway.app/api
echo.

echo 📋 Testing health endpoint...
curl -s https://nxsnotifier.up.railway.app/api/health
echo.

echo 📋 Testing inquiries endpoint...
curl -s https://nxsnotifier.up.railway.app/api/inquiries
echo.

echo.
echo ✅ Connection test completed!
echo.
echo 📱 Next steps:
echo 1. Make sure Expo Go is using the latest code
echo 2. Check the console logs in your terminal
echo 3. Look for the Railway URL in the logs
echo.

pause 