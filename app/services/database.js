// Database service using fetch API for React Native compatibility
// Connects to the Node.js/Express backend with Mongoose

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

export const getInquiries = async () => {
  try {
    console.log('🌐 Attempting to connect to API:', `${API_BASE_URL}/inquiries`);
    
    // Connect to your backend API
    const response = await fetch(`${API_BASE_URL}/inquiries`);
    
    console.log('📡 API Response status:', response.status);
    console.log('📡 API Response ok:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ API Response data:', data);
    console.log('📊 Fetched inquiries count:', data.length);
    
    // Check if we got real data or mock data
    if (data.length > 0 && data[0]._id && typeof data[0]._id === 'object') {
      console.log('🗄️  Data appears to be from MongoDB (ObjectId format)');
    } else {
      console.log('📋 Data appears to be mock data (string ID format)');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch inquiries:', error);
    console.log('🔄 Falling back to mock data...');
    
    // Fallback to mock data for development
    const mockData = getMockInquiries();
    console.log('📋 Using mock data:', mockData.length, 'items');
    return mockData;
  }
};

// Create new inquiry
export const createInquiry = async (inquiryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inquiryData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to create inquiry:', error);
    throw error;
  }
};

// Delete inquiry
export const deleteInquiry = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/inquiries/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to delete inquiry:', error);
    throw error;
  }
};

// Health check
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};

// Mock data for development/testing
const getMockInquiries = () => {
  return [
    {
      _id: '1',
      fullName: 'John Doe',
      mobile: '+1 (555) 123-4567',
      email: 'john.doe@example.com',
      message: 'I would like to inquire about your services and pricing. Please provide more information about what you offer.',
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      fullName: 'Jane Smith',
      mobile: '+1 (555) 987-6543',
      email: 'jane.smith@example.com',
      message: 'I am interested in learning more about your reading list app. Can you tell me about the features and how it works?',
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      fullName: 'Mike Johnson',
      mobile: '+1 (555) 456-7890',
      email: 'mike.johnson@example.com',
      message: 'I have a question about the user interface and whether it supports dark mode. Also, is there a mobile app available?',
      createdAt: new Date().toISOString()
    },
    {
      _id: '4',
      fullName: 'Sarah Wilson',
      mobile: '+1 (555) 321-0987',
      email: 'sarah.wilson@example.com',
      message: 'I would like to know if there are any subscription plans available and what the pricing structure looks like.',
      createdAt: new Date().toISOString()
    },
    {
      _id: '5',
      fullName: 'David Brown',
      mobile: '+1 (555) 654-3210',
      email: 'david.brown@example.com',
      message: 'I am experiencing some issues with the app. Can you help me troubleshoot the login problem I am facing?',
      createdAt: new Date().toISOString()
    }
  ];
}; 