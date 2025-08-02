# NXS Notifier v1

A React Native Expo app with MongoDB backend for managing inquiries.

## Project Structure

```
nxsnotifier/
├── app/                    # React Native Expo app
│   ├── (tabs)/            # Tab navigation screens
│   ├── services/          # API services
│   └── config/            # Configuration files
└── backend/               # Node.js/Express backend
    ├── server.js          # Main server file
    ├── seed-data.js       # Database seeding script
    └── .env               # Environment variables
```

## Setup Instructions

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

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/inquiries` - Get all inquiries
- `GET /api/inquiries/:id` - Get single inquiry by ID

**Note: This is a read-only application. Create, update, and delete operations are not available.**

## Database

The app connects directly to MongoDB using the connection string from the `.env` file:

- Database: `nxs`
- Collection: `inquiries`
- Schema: `{ name, email, mobile, message, createdAt }`
- No test data - only real data from your MongoDB database

## Features

- ✅ Direct MongoDB integration (no test data)
- ✅ Real-time data fetching from database
- ✅ Read-only inquiry viewing
- ✅ Modern UI with dark theme
- ✅ Responsive design

## Troubleshooting

### Backend Issues

- Make sure MongoDB connection string is correct
- Check if port 5000 is available
- Verify all dependencies are installed

### Frontend Issues

- For Android emulator, the API URL is set to `10.0.2.2:5000`
- For iOS simulator, use `localhost:5000`
- Make sure the backend server is running

## Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nxs
PORT=5000
```
