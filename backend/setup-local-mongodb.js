const mongoose = require('mongoose');
require('dotenv').config();

// Local MongoDB connection string
const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/nxsnotifier';

console.log('🔧 Setting up local MongoDB connection...');
console.log('📡 Local URI:', LOCAL_MONGODB_URI);

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

async function setupLocalMongoDB() {
  try {
    console.log('🔄 Attempting to connect to local MongoDB...');
    
    await mongoose.connect(LOCAL_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to local MongoDB!');
    
    // Check if we have any existing data
    const count = await Inquiry.countDocuments();
    console.log(`📊 Current inquiries in database: ${count}`);
    
    // Add sample data if database is empty
    if (count === 0) {
      console.log('➕ Adding sample inquiries to local database...');
      
      const sampleInquiries = [
        {
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          mobile: '+1 (555) 123-4567',
          message: 'I would like to inquire about your services and pricing. Please provide more information about what you offer.',
        },
        {
          fullName: 'Jane Smith',
          email: 'jane.smith@example.com',
          mobile: '+1 (555) 987-6543',
          message: 'I am interested in learning more about your reading list app. Can you tell me about the features and how it works?',
        },
        {
          fullName: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          mobile: '+1 (555) 456-7890',
          message: 'I have a question about the user interface and whether it supports dark mode. Also, is there a mobile app available?',
        },
        {
          fullName: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          mobile: '+1 (555) 321-0987',
          message: 'I would like to know if there are any subscription plans available and what the pricing structure looks like.',
        },
        {
          fullName: 'David Brown',
          email: 'david.brown@example.com',
          mobile: '+1 (555) 654-3210',
          message: 'I am experiencing some issues with the app. Can you help me troubleshoot the login problem I am facing?',
        }
      ];
      
      await Inquiry.insertMany(sampleInquiries);
      console.log('✅ Sample inquiries added successfully!');
    }
    
    // Display all inquiries
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    console.log('\n📋 All inquiries in local database:');
    console.log('='.repeat(50));
    
    inquiries.forEach((inquiry, index) => {
      console.log(`${index + 1}. ${inquiry.fullName} (${inquiry.email})`);
      console.log(`   Mobile: ${inquiry.mobile}`);
      console.log(`   Message: ${inquiry.message.substring(0, 50)}...`);
      console.log(`   Created: ${inquiry.createdAt}`);
      console.log('');
    });
    
    console.log('🎉 Local MongoDB setup complete!');
    console.log('💡 To use local MongoDB, update your .env file with:');
    console.log('   MONGODB_URI=mongodb://localhost:27017/nxsnotifier');
    
  } catch (error) {
    console.error('❌ Error setting up local MongoDB:', error.message);
    console.log('\n💡 To install MongoDB locally:');
    console.log('   1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community');
    console.log('   2. Install it on your system');
    console.log('   3. Start the MongoDB service');
    console.log('   4. Run this script again');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

setupLocalMongoDB(); 