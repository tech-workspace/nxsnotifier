const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const useragent = require('express-useragent');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Production security settings
if (NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  console.log('🔒 Production mode enabled - security settings applied');
}

// CORS configuration - Allow all origins for mobile app access
const corsOptions = {
  origin: '*', // Allow all origins for mobile app
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'X-Session-Id', 'X-User-Id'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers for production
if (NODE_ENV === 'production') {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
}

// MongoDB Connection with Mongoose
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env file');
  process.exit(1);
}

console.log('🔍 Attempting to connect to MongoDB...');
console.log('📡 URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
console.log('🌍 Environment:', NODE_ENV);

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

// Define User Schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 10,
    maxlength: 15
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

// Define Visit Schema
const visitSchema = new mongoose.Schema({
  sourceSystemConst: {
    type: String,
    required: true,
    maxlength: 50,
    uppercase: true
  },
  deviceIPAddress: {
    type: String,
    maxlength: 45
  },
  deviceName: {
    type: String,
    maxlength: 200
  },
  deviceLocation: {
    country: String,
    city: String,
    region: String,
    timezone: String
  },
  userAgent: String,
  browser: {
    name: String,
    version: String
  },
  os: {
    name: String,
    version: String
  },
  device: {
    type: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'other']
    },
    vendor: String,
    model: String
  },
  referrer: String,
  pageUrl: String,
  sessionId: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: mongoose.Schema.Types.Mixed,
  message: {
    type: String,
    default: 'Success'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Visit = mongoose.model('Visit', visitSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token is required' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};

// Middleware to parse user agent
app.use(useragent.express());

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

// ==================== Authentication Routes ====================

// POST /v1/auth/signup - Create new user account
app.post('/api/v1/auth/signup', async (req, res) => {
  try {
    const { fullName, mobile, password, roleId } = req.body;

    // Validation
    if (!fullName || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'Full name, mobile, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'Mobile number already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      fullName,
      mobile,
      password: hashedPassword,
      roleId: roleId || null
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, mobile: user.mobile },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user without password
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      mobile: user.mobile,
      roleId: user.roleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
});

// POST /v1/auth/login - Authenticate user
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // Validation
    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Mobile and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ mobile }).populate('roleId');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, mobile: user.mobile },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user without password
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      mobile: user.mobile,
      roleId: user.roleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// GET /v1/auth/profile - Get current user's profile
app.get('/api/v1/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password').populate('roleId');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
});

// ==================== Visits Routes ====================

// POST /v1/visits - Record a new visit
app.post('/api/v1/visits', async (req, res) => {
  try {
    const { sourceSystemConst, sessionId, userId, metadata } = req.body;

    if (!sourceSystemConst) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'sourceSystemConst',
            message: 'Source system constant is required'
          }
        ]
      });
    }

    // Extract IP address
    const deviceIPAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() 
      || req.headers['x-real-ip'] 
      || req.connection.remoteAddress 
      || req.socket.remoteAddress;

    // Parse user agent
    const userAgentString = req.headers['user-agent'] || '';
    const ua = req.useragent;

    // Build device info
    const device = {
      type: ua.isMobile ? 'mobile' : ua.isTablet ? 'tablet' : ua.isDesktop ? 'desktop' : 'other',
      vendor: ua.platform || null,
      model: ua.source || null
    };

    // Build browser info
    const browser = {
      name: ua.browser || null,
      version: ua.version || null
    };

    // Build OS info
    const os = {
      name: ua.os || null,
      version: ua.platform || null
    };

    // Get referrer and page URL
    const referrer = req.headers['referer'] || req.headers['referrer'] || null;
    const pageUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    // Create visit record
    const visit = new Visit({
      sourceSystemConst: sourceSystemConst.toUpperCase(),
      deviceIPAddress,
      deviceName: req.headers['x-device-name'] || null,
      deviceLocation: {
        country: req.headers['cf-ipcountry'] || null,
        city: req.headers['cf-ipcity'] || null,
        region: req.headers['cf-region'] || null,
        timezone: req.headers['cf-timezone'] || null
      },
      userAgent: userAgentString,
      browser,
      os,
      device,
      referrer,
      pageUrl,
      sessionId: sessionId || req.headers['x-session-id'] || null,
      userId: userId || req.headers['x-user-id'] || null,
      metadata: metadata || {
        acceptLanguage: req.headers['accept-language'],
        method: req.method
      },
      timestamp: new Date()
    });

    await visit.save();

    res.json({
      success: true,
      message: 'Visit recorded successfully',
      data: {
        visit
      }
    });
  } catch (error) {
    console.error('Record visit error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record visit',
      error: error.message
    });
  }
});

// GET /v1/visits - Get paginated visits with filters
app.get('/api/v1/visits', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search,
      sourceSystemConst,
      deviceIPAddress,
      deviceType,
      sessionId,
      userId,
      sortBy = 'timestamp',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = {};
    if (sourceSystemConst) filter.sourceSystemConst = sourceSystemConst;
    if (deviceIPAddress) filter.deviceIPAddress = deviceIPAddress;
    if (deviceType) filter['device.type'] = deviceType;
    if (sessionId) filter.sessionId = sessionId;
    if (userId) filter.userId = userId;
    if (search) {
      filter.$or = [
        { deviceIPAddress: { $regex: search, $options: 'i' } },
        { deviceName: { $regex: search, $options: 'i' } },
        { pageUrl: { $regex: search, $options: 'i' } }
      ];
    }

    // Get visits
    const visits = await Visit.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limitNum);

    const totalVisits = await Visit.countDocuments(filter);
    const totalPages = Math.ceil(totalVisits / limitNum);

    res.json({
      success: true,
      message: 'Visits retrieved successfully',
      data: {
        visits,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalVisits,
          limit: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Get visits error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get visits',
      error: error.message
    });
  }
});

// GET /v1/visits/statistics - Get visit statistics
app.get('/api/v1/visits/statistics', authenticateToken, async (req, res) => {
  try {
    const totalVisits = await Visit.countDocuments();
    const uniqueVisitors = await Visit.distinct('deviceIPAddress').then(ips => ips.length);

    const topCountries = await Visit.aggregate([
      { $group: { _id: '$deviceLocation.country', count: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const deviceTypes = await Visit.aggregate([
      { $group: { _id: '$device.type', count: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } },
      { $sort: { count: -1 } }
    ]);

    const topBrowsers = await Visit.aggregate([
      { $group: { _id: '$browser.name', count: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const topOS = await Visit.aggregate([
      { $group: { _id: '$os.name', count: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        statistics: {
          totalVisits,
          uniqueVisitors,
          topCountries,
          deviceTypes,
          topBrowsers,
          topOS
        }
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics',
      error: error.message
    });
  }
});

// ==================== Inquiry Routes ====================

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
  console.log(`\n🔐 Authentication Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/v1/auth/signup`);
  console.log(`   POST http://localhost:${PORT}/api/v1/auth/login`);
  console.log(`   GET  http://localhost:${PORT}/api/v1/auth/profile`);
  console.log(`\n🌐 Visits Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/v1/visits`);
  console.log(`   GET  http://localhost:${PORT}/api/v1/visits`);
  console.log(`   GET  http://localhost:${PORT}/api/v1/visits/statistics`);
  console.log(`\n📋 Inquiry Endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/inquiries`);
  console.log(`   GET  http://localhost:${PORT}/api/inquiries/unread/count`);
  console.log(`   PUT  http://localhost:${PORT}/api/inquiries/:id/read`);
  console.log(`\n🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  MongoDB: Connected`);
  console.log(`🔑 JWT Secret: ${JWT_SECRET.substring(0, 10)}...`);
}); 