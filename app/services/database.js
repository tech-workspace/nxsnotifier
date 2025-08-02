// Database service using fetch API for React Native compatibility
// Connects to the Node.js/Express backend with Mongoose

import { API_BASE_URL, ENDPOINTS, getApiUrl } from '../config/api';

export const getInquiries = async () => {
  try {
    const apiUrl = getApiUrl(ENDPOINTS.INQUIRIES);
    console.log('🌐 Attempting to connect to API:', apiUrl);
    console.log('🔧 API Base URL:', API_BASE_URL);
    console.log('📱 Platform detection:', typeof window !== 'undefined' ? 'Web' : 'React Native');
    console.log('🔍 Full API URL being used:', apiUrl);
    
    // Connect to your backend API
    const response = await fetch(apiUrl);
    
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
    throw error;
  }
};



// Health check
export const checkApiHealth = async () => {
  try {
    const response = await fetch(getApiUrl(ENDPOINTS.HEALTH));
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};

 