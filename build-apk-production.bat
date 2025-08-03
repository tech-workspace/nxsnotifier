@echo off
chcp 65001 >nul

echo 📱 Building APK with Production Configuration
echo =============================================

echo.
echo ✅ Using Railway production backend for all environments
echo 🌐 Backend URL: https://nxsnotifier.up.railway.app/api
echo.

echo 🔧 Building APK with EAS...
echo.

eas build --platform android --profile preview

echo.
echo ✅ APK build completed!
echo.
echo 📱 The APK will use the Railway production backend
echo 🚂 No local backend setup required
echo.

pause 