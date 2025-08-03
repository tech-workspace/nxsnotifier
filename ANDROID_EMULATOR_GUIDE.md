# 📱 Android Emulator Testing Guide

## 🚨 **Current Issue**
You're getting a "No development build" error when trying to run on Android emulator.

## 🎯 **Recommended Solution: Use Expo Go**

Since you want to test with Railway backend, **Expo Go is the best option**:

### ✅ **Why Expo Go is Better**
- ✅ **No build issues** - avoids Gradle configuration problems
- ✅ **Faster setup** - works immediately
- ✅ **Railway backend** - uses production backend directly
- ✅ **Real testing** - tests actual network connectivity

### 📱 **Step-by-Step Instructions**

1. **Install Expo Go on Emulator**:
   - Open Google Play Store in your Android emulator
   - Search for "Expo Go"
   - Install the app

2. **Start Development Server**:
   ```bash
   npx expo start
   ```

3. **Scan QR Code**:
   - Open Expo Go app in your emulator
   - Tap "Scan QR Code"
   - Scan the QR code from your terminal

4. **Test Your App**:
   - Your app will load with Railway backend
   - Test the inquiries page
   - Should connect to `https://nxsnotifier.up.railway.app/api`

## 🔧 **Alternative: Fix Development Build (Advanced)**

If you specifically need a development build:

### Option 1: Use EAS Build
```bash
# Build development APK
eas build --platform android --profile development

# Install on emulator when build completes
```

### Option 2: Fix Local Build Issues
The local build is failing due to Gradle configuration. This requires:
- Fixing Android project configuration
- Resolving dependency conflicts
- Setting up proper build environment

## 🚀 **Quick Test Commands**

### Test Railway Backend
```bash
# Test if Railway is working
curl https://nxsnotifier.up.railway.app/api/health
```

### Start Expo Server
```bash
# Start with clear cache
npx expo start --clear
```

## 📋 **Expected Results**

When using Expo Go:
- ✅ App loads successfully
- ✅ Inquiries page connects to Railway
- ✅ No "failed to load inquiries" error
- ✅ Real data from MongoDB

## 🎯 **Recommendation**

**Use Expo Go** - it's the fastest, most reliable way to test your app with the Railway backend. The development build issues are complex and not necessary for testing your Railway integration.

Your Railway backend is working perfectly, so Expo Go will give you the best testing experience! 