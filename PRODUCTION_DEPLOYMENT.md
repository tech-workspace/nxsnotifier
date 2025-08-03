# NXS Notifier - Production Deployment Guide

## 🚀 Overview
This guide will help you deploy the NXS Notifier app to production for both Android and iOS platforms.

## 📋 Prerequisites

### Required Accounts
- [Expo Account](https://expo.dev/signup)
- [Google Play Console](https://play.google.com/console) (for Android)
- [Apple Developer Account](https://developer.apple.com) (for iOS)
- [Render](https://render.com) or [Railway](https://railway.app) (for backend hosting)
- [MongoDB Atlas](https://mongodb.com/atlas) (for database)

### Required Tools
- Node.js 18+ and npm
- Expo CLI: `npm install -g @expo/cli`
- EAS CLI: `npm install -g eas-cli`

## 🔧 Backend Deployment

### 1. Deploy to Render (Recommended)

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub repository

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Set environment variables:
     ```
     MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/nxs
     NODE_ENV=production
     PORT=5000
     ```

3. **Update API Configuration**
   - Update `app/config/api.js` with your Render URL:
     ```javascript
     const PROD_API_URL = 'https://your-app-name.onrender.com/api';
     ```

### 2. Alternative: Deploy to Railway

1. **Create Railway Account**
   - Sign up at [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Deploy Backend**
   - Create new project
   - Add environment variables
   - Deploy automatically

## 📱 Mobile App Deployment

### 1. Configure EAS Build

1. **Login to EAS**
   ```bash
   eas login
   ```

2. **Configure Project**
   ```bash
   eas build:configure
   ```

3. **Update eas.json** (already configured)

### 2. Android Deployment

#### A. Build for Production
```bash
npm run build:android
```

#### B. Submit to Google Play Store
1. **Create Google Play Console Account**
   - Sign up at [play.google.com/console](https://play.google.com/console)
   - Pay $25 one-time registration fee

2. **Create App**
   - Click "Create App"
   - Fill in app details
   - Upload your app bundle

3. **Submit for Review**
   ```bash
   npm run submit:android
   ```

### 3. iOS Deployment

#### A. Build for Production
```bash
npm run build:ios
```

#### B. Submit to App Store
1. **Create Apple Developer Account**
   - Sign up at [developer.apple.com](https://developer.apple.com)
   - Pay $99/year subscription

2. **Create App in App Store Connect**
   - Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - Create new app
   - Fill in app details

3. **Submit for Review**
   ```bash
   npm run submit:ios
   ```

## 🔐 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nxs
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (app/config/api.js)
```javascript
const PROD_API_URL = 'https://your-backend-domain.com/api';
```

## 📊 Monitoring & Analytics

### 1. Backend Monitoring
- Use Render/Railway built-in monitoring
- Set up alerts for downtime
- Monitor MongoDB Atlas performance

### 2. App Analytics
- Consider adding [Expo Analytics](https://docs.expo.dev/guides/analytics/)
- Or integrate [Firebase Analytics](https://firebase.google.com/analytics)

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          # Add your deployment commands here

  deploy-app:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and Deploy App
        run: |
          npm install
          npm run build:android
          npm run build:ios
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check EAS build logs
   - Verify all dependencies are installed
   - Ensure app.json is properly configured

2. **Backend Connection Issues**
   - Verify CORS settings
   - Check environment variables
   - Test API endpoints manually

3. **App Store Rejection**
   - Follow Apple's guidelines
   - Test thoroughly on real devices
   - Provide clear app descriptions

### Support Resources
- [Expo Documentation](https://docs.expo.dev)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native Documentation](https://reactnative.dev)

## 📈 Post-Deployment

### 1. Testing
- Test on multiple devices
- Verify all features work
- Check performance

### 2. Monitoring
- Monitor app crashes
- Track user engagement
- Monitor backend performance

### 3. Updates
- Plan regular updates
- Monitor user feedback
- Keep dependencies updated

## 🎉 Success!
Your NXS Notifier app is now ready for production use!

For support, contact: support@techworkspace.com 