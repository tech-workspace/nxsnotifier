@echo off
chcp 65001 >nul

echo 📱 Manual APK Creation Guide
echo ============================

echo.
echo 🔧 Since automated builds are having issues, here are alternative methods:
echo.

echo 📋 Method 1: Use Expo Go (Easiest)
echo ===================================
echo 1. Install Expo Go app on your Android device
echo 2. Run: npx expo start
echo 3. Scan the QR code with Expo Go
echo 4. Your app will run directly on your device
echo.

echo 📋 Method 2: Development Build (Recommended)
echo ============================================
echo 1. Install Expo Go app on your Android device
echo 2. Run: npx expo start --dev-client
echo 3. Scan the QR code with Expo Go
echo 4. This will create a development build
echo.

echo 📋 Method 3: Use EAS Build with Different Profile
echo ================================================
echo 1. Try: eas build --platform android --profile development
echo 2. This might work better than preview profile
echo.

echo 📋 Method 4: Manual APK Generation
echo ==================================
echo 1. Run: npx expo run:android --variant debug
echo 2. This creates a debug APK locally
echo 3. Look for APK in: android/app/build/outputs/apk/debug/
echo.

echo 🎯 Recommended Next Steps:
echo 1. Try Method 1 first (Expo Go) - it's the fastest
echo 2. If you need a standalone APK, try Method 4
echo 3. For production testing, use Method 2
echo.

echo 📱 To install APK on your device:
echo 1. Enable "Install from unknown sources" in Android settings
echo 2. Transfer APK to your device
echo 3. Tap APK file to install
echo.

pause 