# NXS Notifier

A React Native Expo app with MongoDB backend for managing inquiries with on-demand real-time notifications.

## Project Structure

```
nxsnotifier/
├── app/                    # React Native Expo app
│   ├── (tabs)/            # Tab navigation screens
│   ├── services/          # API services
│   ├── config/            # Configuration files
│   └── context/           # React Context providers
└── backend/               # Node.js/Express backend
    ├── server.js          # Main server file
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

The server will run on `http://localhost:5000` with WebSocket support on `ws://localhost:5000`

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
- `GET /api/inquiries/unread/count` - Get count of unread inquiries
- `PUT /api/inquiries/:id/read` - Mark inquiry as read
- `GET /api/ws/unread-count` - Trigger WebSocket unread count update
- `POST /api/ws/check-new-inquiries` - Manually check for new inquiries

## WebSocket Events

- `unreadCountUpdate` - Real-time unread count updates
- `newInquiry` - New inquiry notifications
- Connection status monitoring

## Database

The app connects directly to MongoDB using the connection string from the `.env` file:
- Database: `nxs`
- Collection: `inquiries`
- Schema: `{ name, email, mobile, message, isRead, createdAt }`
- Real data from your MongoDB database with read/unread tracking

## Features

- ✅ Direct MongoDB integration with real-time data
- ✅ On-demand real-time notifications (no automatic polling)
- ✅ Manual refresh button for checking new inquiries
- ✅ Instant updates when new inquiries are detected
- ✅ Read/unread status tracking
- ✅ Badge notifications on inquiries tab
- ✅ Automatic marking as read when viewing inquiries
- ✅ Visual indicators for unread inquiries
- ✅ Connection status monitoring
- ✅ Modern UI with dark theme
- ✅ Responsive design

## Real-Time Notifications

The app includes comprehensive real-time notification features using WebSocket technology with on-demand checking:

### 🔄 On-Demand Refresh System
- **Manual Refresh Button**: Tap the refresh icon in the header to check for new inquiries
- **Pull-to-Refresh**: Pull down the inquiry list to refresh and check for new items
- **No Automatic Polling**: Eliminates unnecessary server requests and battery drain
- **Smart Detection**: Only checks for new inquiries when requested

### 🔌 WebSocket Connection
- **Real-time Updates**: WebSocket connection for instant communication
- **Instant Notifications**: New inquiries trigger immediate badge updates
- **Connection Monitoring**: Visual indicator shows WebSocket connection status
- **Automatic Reconnection**: Handles connection drops gracefully

### 🔔 Badge Notifications
- **Tab Badge**: Shows unread count on the inquiries tab
- **Real-time Updates**: Updates instantly when new inquiries are detected
- **Cross-tab Visibility**: Shows even when you're on other tabs

### 📱 Visual Indicators
- **Refresh Button**: Golden refresh icon in the header for manual checking
- **Connection Status**: Green/red dot shows WebSocket connection state
- **Unread Borders**: Unread inquiries have golden borders
- **"NEW" Badge**: Unread inquiry items show a "NEW" badge
- **Unread Dot**: Small golden dot next to unread inquiry names

### ⚡ Efficient Updates
- **On-Demand Only**: No background polling - saves battery and server resources
- **Event-driven**: Updates only when database changes are detected
- **Responsive**: Immediate UI feedback for all actions
- **Smart Alerts**: Shows notification when new inquiries are found

### 🗄️ Database Integration
- **Existing `isRead` Property**: Uses your existing database structure
- **Manual Detection**: Checks for new inquiries only when triggered
- **Persistent State**: Read/unread status is saved in the database

## Technical Implementation

### Backend (Node.js/Express + Socket.IO)
- **WebSocket Server**: Socket.IO for real-time communication
- **Manual Detection**: Checks for new inquiries only when triggered
- **Event Emission**: Sends updates when database changes are detected
- **Connection Management**: Handles multiple client connections
- **CORS Support**: Cross-origin WebSocket connections

### Frontend (React Native + Socket.IO Client)
- **WebSocket Client**: Socket.IO client for real-time updates
- **Refresh Button**: Manual trigger for checking new inquiries
- **Context Provider**: Global state management for notifications
- **Connection Monitoring**: Real-time connection status
- **Event Listeners**: Handles WebSocket events

## Troubleshooting

### Backend Issues
- Make sure MongoDB connection string is correct
- Check if port 5000 is available
- Verify all dependencies are installed
- Ensure WebSocket port is not blocked by firewall

### Frontend Issues
- For Android emulator, the API URL is set to `10.0.2.2:5000`
- For iOS simulator, use `localhost:5000`
- Make sure the backend server is running
- Check WebSocket connection status indicator

### WebSocket Issues
- Verify WebSocket port (5000) is accessible
- Check connection status indicator in the app
- Ensure no firewall blocking WebSocket connections
- Monitor server logs for connection events

## Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nxs
PORT=5000
```

## Real-Time Features

### On-Demand System
- **Manual Refresh**: Tap refresh button to check for new inquiries
- **Pull-to-Refresh**: Pull down list to refresh and check for new items
- **No Background Polling**: Eliminates unnecessary requests
- **Efficient**: Only checks when user requests it

### WebSocket System
- **Protocol**: WebSocket over HTTP upgrade
- **Events**: `unreadCountUpdate`, `newInquiry`
- **Connection**: Automatic reconnection on disconnect
- **Efficiency**: Event-driven updates only when needed

### Read/Unread Logic
- **New inquiries**: Automatically marked as unread (`isRead: false`)
- **Viewing**: Automatically marked as read when opened
- **Database**: Persistent state in MongoDB
- **UI**: Immediate visual feedback

### Badge System
- **Tab Badge**: Shows unread count on inquiries tab
- **Header Badge**: Shows unread count in inquiries page header
- **Item Badges**: Visual indicators on individual inquiry items
- **Real-time**: Updates instantly via WebSocket events
