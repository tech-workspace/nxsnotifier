const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

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

// Function to check for new inquiries
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
      
      // Update the last check timestamp
      global.lastInquiryCheck = new Date();
    }
    
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
    mode: 'Read-only with manual refresh',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NXS Notifier API server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Inquiries endpoint: http://localhost:${PORT}/api/inquiries`);
  console.log(`📊 Unread count: http://localhost:${PORT}/api/inquiries/unread/count`);
  console.log(`✅ Mark as read: PUT http://localhost:${PORT}/api/inquiries/:id/read`);
  console.log(`🗄️  MongoDB: Connected`);
}); 