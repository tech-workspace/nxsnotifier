# NXS Notifier Backend API

A Node.js/Express backend with Mongoose for MongoDB connectivity to serve the React Native app.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
1. Copy `env.example` to `.env`
2. Update the MongoDB connection string in `.env`:
   ```
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database
   ```

### 3. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check if API is running

### Inquiries
- `GET /api/inquiries` - Get all inquiries
- `GET /api/inquiries/:id` - Get single inquiry
- `POST /api/inquiries` - Create new inquiry
- `DELETE /api/inquiries/:id` - Delete inquiry

## MongoDB Schema

The `inquiries` collection uses this schema:
```javascript
{
  name: String (required),
  email: String (required),
  mobile: String (required),
  message: String (required),
  createdAt: Date (auto-generated)
}
```

## Connecting to React Native App

Update your React Native app's `app/services/database.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api'; // or your server URL
``` 