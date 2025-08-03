# NXS Notifier

A React Native Expo app with MongoDB backend for managing inquiries with on-demand real-time notifications.

## 🚀 Quick Start

### Development
```bash
# Backend
cd backend && npm install && npm start

# Frontend
npm install && npx expo start
```

### Production Deployment
```bash
# Use the deployment script
./deploy.sh          # Linux/Mac
deploy.bat           # Windows

# Or manual deployment
npm run build:android
npm run build:ios
```

📖 **Full deployment guide**: [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)

## 📱 Features

- ✅ Direct MongoDB integration with real-time data
- ✅ On-demand real-time notifications (no automatic polling)
- ✅ Manual refresh button for checking new inquiries
- ✅ Instant updates when new inquiries are detected
- ✅ Read/unread status tracking
- ✅ Badge notifications on inquiries tab
- ✅ Cross-platform (Android, iOS, Web)
- ✅ Production-ready with EAS Build

## 🏗️ Project Structure

```
nxsnotifier/
├── app/                    # React Native Expo app
│   ├── (tabs)/            # Tab navigation screens
│   ├── services/          # API services
│   ├── config/            # Configuration files
│   └── context/           # React Context providers
├── backend/               # Node.js/Express backend
│   ├── server.js          # Main server file
│   └── .env               # Environment variables
├── deploy.sh              # Deployment script (Linux/Mac)
├── deploy.bat             # Deployment script (Windows)
└── PRODUCTION_DEPLOYMENT.md # Production guide
```

## ⚙️ Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `env.example` to `.env`
   - Update the MongoDB connection string in `.env`

4. Start the backend server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000`

### 2. Frontend Setup

1. Install Expo CLI (if not already installed):
   ```bash
   npm install -g @expo/cli
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

## 🔌 API Endpoints

- `GET /api/health` - Health check
- `GET /api/inquiries` - Get all inquiries
- `GET /api/inquiries/:id` - Get single inquiry by ID
- `GET /api/inquiries/unread/count` - Get count of unread inquiries
- `PUT /api/inquiries/:id/read` - Mark inquiry as read
- `GET /api/ws/unread-count` - Trigger WebSocket unread count update
- `POST /api/ws/check-new-inquiries` - Manually check for new inquiries

## 📊 Database

The app connects directly to MongoDB using the connection string from the `.env` file:

- Database: `nxs`
- Collection: `inquiries`
- Schema: `{ name, email, mobile, message, isRead, createdAt }`
- Real data from your MongoDB database with read/unread tracking

## 🚀 Production Deployment

### Quick Deploy
```bash
# Run deployment script
./deploy.sh          # Linux/Mac
deploy.bat           # Windows
```

### Manual Deploy
```bash
# Build for production
npm run build:android
npm run build:ios

# Submit to stores
npm run submit:android
npm run submit:ios
```

### Backend Deployment
- Deploy to [Render](https://render.com) or [Railway](https://railway.app)
- Update `app/config/api.js` with production URL
- Set environment variables in hosting platform

## 📋 Available Scripts

```bash
# Development
npm start              # Start Expo development server
npm run android        # Start Android development
npm run ios           # Start iOS development
npm run web           # Start web development

# Production Builds
npm run build:android # Build Android APK/Bundle
npm run build:ios     # Build iOS App
npm run build:preview # Build preview for both platforms

# Store Submission
npm run submit:android # Submit to Google Play Store
npm run submit:ios     # Submit to Apple App Store

# Backend
npm run deploy:backend # Start backend server
```

## 🔧 Configuration

### Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5000)

### API Configuration
Update `app/config/api.js` for different environments:
- Development: Local IP addresses
- Production: Your deployed backend URL

## 📱 Platform Support

- ✅ Android (APK & App Bundle)
- ✅ iOS (App Store)
- ✅ Web (Progressive Web App)

## 🛠️ Tech Stack

- **Frontend**: React Native, Expo, React Router
- **Backend**: Node.js, Express, MongoDB
- **Build**: EAS Build, Expo Application Services
- **Deployment**: Render/Railway (Backend), EAS Submit (Mobile)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:
- 📧 Email: support@techworkspace.com
- 📖 Documentation: [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)
- 🐛 Issues: Create an issue in the repository
