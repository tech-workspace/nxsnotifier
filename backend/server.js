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
  }
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

// API Routes

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



// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NXS Notifier API is running',
    mongodb: 'Connected',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Read-only server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Inquiries endpoint: http://localhost:${PORT}/api/inquiries`);
  console.log(`🗄️  MongoDB: Connected`);
  console.log(`🔒 Read-only mode: Create, update, and delete operations disabled`);
}); 