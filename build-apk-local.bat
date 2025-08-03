@echo off
chcp 65001 >nul

echo 📱 Building APK for Manual Testing
echo ===================================

echo.
echo 🔧 Preparing for local APK build...
echo.

echo 1. Checking EAS CLI...
eas --version

echo.
echo 2. Building APK with development profile...
echo    This will create an APK file you can install manually
echo.

eas build --platform android --profile development --local

echo.
echo ✅ APK build completed!
echo.
echo 📁 The APK file will be in the build output directory
echo 📱 You can now install this APK on your Android device
echo.

pause 