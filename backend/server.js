const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma']
}));
app.use(express.json());

// MongoDB Connection with Mongoose
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env file');
  process.exit(1);
}

console.log('🔍 Attempting to connect to MongoDB...');
console.log('📡 URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.log('💡 Please check your MongoDB connection string in .env file');
  process.exit(1);
});

// Define Inquiry Schema
const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  // Send initial unread count
  sendUnreadCount(socket);
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Function to send unread count to all connected clients
const sendUnreadCount = async (socket = null) => {
  try {
    const count = await Inquiry.countDocuments({ isRead: false });
    const totalCount = await Inquiry.countDocuments({});
    const data = { unreadCount: count, timestamp: new Date().toISOString() };
    
    if (socket) {
      socket.emit('unreadCountUpdate', data);
    } else {
      io.emit('unreadCountUpdate', data);
    }
    
    console.log(`📊 Sent unread count to clients: ${count}/${totalCount} (unread/total)`);
  } catch (error) {
    console.error('❌ Error sending unread count:', error);
  }
};

// Function to send new inquiry notification
const sendNewInquiryNotification = async (inquiry) => {
  try {
    const data = {
      type: 'newInquiry',
      inquiry: inquiry,
      timestamp: new Date().toISOString()
    };
    
    io.emit('newInquiry', data);
    console.log('🔔 Sent new inquiry notification for:', inquiry._id);
  } catch (error) {
    console.error('❌ Error sending new inquiry notification:', error);
  }
};

// Function to check for new inquiries and notify clients
const checkForNewInquiries = async () => {
  try {
    // Get the latest inquiry timestamp from memory or use a default
    const latestTimestamp = global.lastInquiryCheck || new Date(0);
    
    // Find inquiries created after the last check
    const newInquiries = await Inquiry.find({
      createdAt: { $gt: latestTimestamp }
    }).sort({ createdAt: -1 });
    
    if (newInquiries.length > 0) {
      console.log(`🔍 Found ${newInquiries.length} new inquiries`);
      
      // Send notification for each new inquiry
      for (const inquiry of newInquiries) {
        await sendNewInquiryNotification(inquiry);
      }
      
      // Update the last check timestamp
      global.lastInquiryCheck = new Date();
    }
    
    // Always send updated unread count (not just when new inquiries are found)
    await sendUnreadCount();
    
    return { found: newInquiries.length, inquiries: newInquiries };
  } catch (error) {
    console.error('❌ Error checking for new inquiries:', error);
    throw error;
  }
};

// API Routes

// WebSocket endpoints (must come before inquiry routes to avoid conflicts)
app.get('/api/ws/unread-count', (req, res) => {
  sendUnreadCount();
  res.json({ message: 'Unread count update sent to all clients' });
});

// Manual trigger to check for new inquiries
app.post('/api/ws/check-new-inquiries', async (req, res) => {
  try {
    const result = await checkForNewInquiries();
    res.json({ 
      message: 'New inquiries check completed',
      found: result.found,
      inquiries: result.inquiries
    });
  } catch (error) {
    console.error('❌ Error in manual new inquiries check:', error);
    res.status(500).json({ error: 'Failed to check for new inquiries' });
  }
});

// Debug endpoint to check inquiry status
app.get('/api/debug/inquiries', async (req, res) => {
  try {
    const allInquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    const unreadCount = await Inquiry.countDocuments({ isRead: false });
    const totalCount = await Inquiry.countDocuments({});
    
    const inquiriesWithStatus = allInquiries.map(inquiry => ({
      _id: inquiry._id,
      name: inquiry.name,
      isRead: inquiry.isRead,
      createdAt: inquiry.createdAt
    }));
    
    res.json({
      totalCount,
      unreadCount,
      inquiries: inquiriesWithStatus
    });
  } catch (error) {
    console.error('❌ Error in debug endpoint:', error);
    res.status(500).json({ error: 'Failed to get debug info' });
  }
});

// GET all inquiries
app.get('/api/inquiries', async (req, res) => {
  try {
    console.log('📊 Fetching inquiries from MongoDB...');
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    console.log(`✅ Fetched ${inquiries.length} inquiries from MongoDB`);
    res.json(inquiries);
  } catch (error) {
    console.error('❌ Error fetching inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries from database' });
  }
});

// GET unread count
app.get('/api/inquiries/unread/count', async (req, res) => {
  try {
    const count = await Inquiry.countDocuments({ isRead: false });
    console.log(`📊 Unread inquiries count: ${count}`);
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('❌ Error getting unread count:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// GET single inquiry by ID
app.get('/api/inquiries/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    res.json(inquiry);
  } catch (error) {
    console.error('❌ Error fetching inquiry:', error);
    res.status(500).json({ error: 'Failed to fetch inquiry' });
  }
});

// PUT mark inquiry as read
app.put('/api/inquiries/:id/read', async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    
    console.log(`✅ Marked inquiry ${req.params.id} as read`);
    
    // Send updated unread count to all clients
    sendUnreadCount();
    
    res.json(inquiry);
  } catch (error) {
    console.error('❌ Error marking inquiry as read:', error);
    res.status(500).json({ error: 'Failed to mark inquiry as read' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NXS Notifier API is running',
    mongodb: 'Connected',
    websocket: 'Active',
    timestamp: new Date().toISOString()
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Real-time notification server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔌 WebSocket available at ws://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Inquiries endpoint: http://localhost:${PORT}/api/inquiries`);
  console.log(`📊 Unread count: http://localhost:${PORT}/api/inquiries/unread/count`);
  console.log(`✅ Mark as read: PUT http://localhost:${PORT}/api/inquiries/:id/read`);
  console.log(`🗄️  MongoDB: Connected`);
  console.log(`🔔 Real-time notifications enabled with WebSocket`);
}); 