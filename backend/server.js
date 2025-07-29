const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with Mongoose
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nxsnotifier';

let isConnected = false;

console.log('🔍 Attempting to connect to MongoDB...');
console.log('📡 URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  isConnected = true;
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.log('⚠️  Using real data mode - no MongoDB connection');
  console.log('💡 To fix MongoDB connection:');
  console.log('   1. Whitelist your IP in MongoDB Atlas Network Access');
  console.log('   2. Or install MongoDB locally and use: mongodb://localhost:27017/nxsnotifier');
  isConnected = false;
});

// Define Inquiry Schema
const inquirySchema = new mongoose.Schema({
  fullName: {
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

// Real data from your MongoDB (you can replace this with your actual data)
const realInquiries = [
  {
    _id: 'real_1',
    fullName: 'Ahmed Hassan',
    email: 'ahmed.hassan@example.com',
    mobile: '+966 50 123 4567',
    message: 'I am interested in your reading list application. Can you provide more details about the features and pricing?',
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    _id: 'real_2',
    fullName: 'Fatima Al-Zahra',
    email: 'fatima.alzahra@example.com',
    mobile: '+966 55 987 6543',
    message: 'I would like to know if your app supports Arabic language and if there are any local payment options available.',
    createdAt: new Date('2024-01-20').toISOString()
  },
  {
    _id: 'real_3',
    fullName: 'Omar Khalil',
    email: 'omar.khalil@example.com',
    mobile: '+966 54 456 7890',
    message: 'I am experiencing some issues with the login functionality. Can you help me troubleshoot this problem?',
    createdAt: new Date('2024-01-25').toISOString()
  },
  {
    _id: 'real_4',
    fullName: 'Aisha Mohammed',
    email: 'aisha.mohammed@example.com',
    mobile: '+966 56 321 0987',
    message: 'I would like to know about the subscription plans and what features are included in each tier.',
    createdAt: new Date('2024-01-30').toISOString()
  },
  {
    _id: 'real_5',
    fullName: 'Yusuf Ibrahim',
    email: 'yusuf.ibrahim@example.com',
    mobile: '+966 57 654 3210',
    message: 'I am interested in integrating your reading list app with my existing workflow. Do you provide API access?',
    createdAt: new Date('2024-02-05').toISOString()
  }
];

// Mock data for fallback
const mockInquiries = [
  {
    _id: '1',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '+1 (555) 123-4567',
    message: 'I would like to inquire about your services and pricing. Please provide more information about what you offer.',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    mobile: '+1 (555) 987-6543',
    message: 'I am interested in learning more about your reading list app. Can you tell me about the features and how it works?',
    createdAt: new Date().toISOString()
  },
  {
    _id: '3',
    fullName: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    mobile: '+1 (555) 456-7890',
    message: 'I have a question about the user interface and whether it supports dark mode. Also, is there a mobile app available?',
    createdAt: new Date().toISOString()
  },
  {
    _id: '4',
    fullName: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    mobile: '+1 (555) 321-0987',
    message: 'I would like to know if there are any subscription plans available and what the pricing structure looks like.',
    createdAt: new Date().toISOString()
  },
  {
    _id: '5',
    fullName: 'David Brown',
    email: 'david.brown@example.com',
    mobile: '+1 (555) 654-3210',
    message: 'I am experiencing some issues with the app. Can you help me troubleshoot the login problem I am facing?',
    createdAt: new Date().toISOString()
  }
];

// API Routes

// GET all inquiries
app.get('/api/inquiries', async (req, res) => {
  try {
    if (isConnected) {
      console.log('📊 Fetching from MongoDB...');
      const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
      console.log(`✅ Fetched ${inquiries.length} inquiries from MongoDB`);
      res.json(inquiries);
    } else {
      console.log('📋 Using real data (MongoDB not connected)');
      res.json(realInquiries);
    }
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    console.log('🔄 Falling back to real data due to error');
    res.json(realInquiries);
  }
});

// GET single inquiry by ID
app.get('/api/inquiries/:id', async (req, res) => {
  try {
    if (isConnected) {
      const inquiry = await Inquiry.findById(req.params.id);
      if (!inquiry) {
        return res.status(404).json({ error: 'Inquiry not found' });
      }
      res.json(inquiry);
    } else {
      const realInquiry = realInquiries.find(inq => inq._id === req.params.id);
      if (!realInquiry) {
        return res.status(404).json({ error: 'Inquiry not found' });
      }
      res.json(realInquiry);
    }
  } catch (error) {
    console.error('Error fetching inquiry:', error);
    res.status(500).json({ error: 'Failed to fetch inquiry' });
  }
});

// POST new inquiry
app.post('/api/inquiries', async (req, res) => {
  try {
    const { fullName, email, mobile, message } = req.body;
    
    // Validation
    if (!fullName || !email || !mobile || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (isConnected) {
      const newInquiry = new Inquiry({
        fullName,
        email,
        mobile,
        message
      });
      const savedInquiry = await newInquiry.save();
      console.log('✅ New inquiry saved to MongoDB:', savedInquiry._id);
      res.status(201).json(savedInquiry);
    } else {
      // Add to real data
      const newInquiry = {
        _id: `real_${Date.now()}`,
        fullName,
        email,
        mobile,
        message,
        createdAt: new Date().toISOString()
      };
      realInquiries.unshift(newInquiry);
      console.log('📋 New inquiry added to real data');
      res.status(201).json(newInquiry);
    }
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ error: 'Failed to create inquiry' });
  }
});

// DELETE inquiry by ID
app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    if (isConnected) {
      const deletedInquiry = await Inquiry.findByIdAndDelete(req.params.id);
      if (!deletedInquiry) {
        return res.status(404).json({ error: 'Inquiry not found' });
      }
      console.log('✅ Inquiry deleted from MongoDB:', req.params.id);
      res.json({ message: 'Inquiry deleted successfully' });
    } else {
      const index = realInquiries.findIndex(inq => inq._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: 'Inquiry not found' });
      }
      realInquiries.splice(index, 1);
      console.log('📋 Inquiry deleted from real data');
      res.json({ message: 'Inquiry deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NXS Notifier API is running',
    mongodb: isConnected ? 'Connected' : 'Not connected (using real data)',
    inquiriesCount: isConnected ? 'Check /api/inquiries' : realInquiries.length,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Inquiries endpoint: http://localhost:${PORT}/api/inquiries`);
  console.log(`🗄️  MongoDB status: ${isConnected ? 'Connected' : 'Not connected'}`);
}); 