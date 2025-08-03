@echo off
chcp 65001 >nul

echo 🚀 NXS Notifier Production Deployment
echo =====================================

REM Check if EAS CLI is installed
eas --version >nul 2>&1
if errorlevel 1 (
    echo ❌ EAS CLI not found. Installing...
    npm install -g eas-cli
)

REM Check if user is logged in to EAS
eas whoami >nul 2>&1
if errorlevel 1 (
    echo 🔐 Please login to EAS:
    eas login
)

echo.
echo What would you like to do?
echo 1. Build Android APK/Bundle
echo 2. Build iOS App
echo 3. Build Preview (both platforms)
echo 4. Submit to Google Play Store
echo 5. Submit to Apple App Store
echo 6. Full deployment (build + submit)
echo 7. Exit
echo.

set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" (
    echo 📱 Building for Android...
    npm run build:android
) else if "%choice%"=="2" (
    echo 📱 Building for iOS...
    npm run build:ios
) else if "%choice%"=="3" (
    echo 📱 Building Preview (both platforms)...
    npm run build:preview
) else if "%choice%"=="4" (
    echo 📤 Submitting to Google Play Store...
    npm run submit:android
) else if "%choice%"=="5" (
    echo 📤 Submitting to Apple App Store...
    npm run submit:ios
) else if "%choice%"=="6" (
    echo 🔄 Full deployment process...
    echo Building for Android...
    npm run build:android
    echo Building for iOS...
    npm run build:ios
    echo Submitting to stores...
    npm run submit:android
    npm run submit:ios
) else if "%choice%"=="7" (
    echo 👋 Goodbye!
    exit /b 0
) else (
    echo ❌ Invalid choice. Please run the script again.
    exit /b 1
)

echo.
echo ✅ Deployment process completed!
echo 📋 Check your EAS dashboard for build status: https://expo.dev
pause 