@echo off
chcp 65001 >nul

echo 📱 Simple APK Build for Manual Testing
echo ======================================

echo.
echo 🔧 This will create a development build that you can install
echo.

echo 1. Installing dependencies...
npm install

echo.
echo 2. Creating development build...
echo    This will generate an APK file in the project directory
echo.

npx expo run:android --variant release

echo.
echo ✅ If successful, you should find the APK in:
echo    android/app/build/outputs/apk/release/
echo.

echo 📱 To install on your device:
echo    1. Enable "Install from unknown sources" in Android settings
echo    2. Transfer the APK to your device
echo    3. Tap the APK file to install
echo.

pause 