// Database service using fetch API for React Native compatibility
// Connects to the Node.js/Express backend with Mongoose

import { API_BASE_URL, ENDPOINTS, getApiUrl } from '../config/api';

export const getInquiries = async () => {
  try {
    const apiUrl = getApiUrl(ENDPOINTS.INQUIRIES);
    console.log('🚀 ===== INQUIRIES API CALL START =====');
    console.log('🌐 Attempting to connect to API:', apiUrl);
    console.log('🔧 API Base URL:', API_BASE_URL);
    console.log('📱 Platform detection:', typeof window !== 'undefined' ? 'Web' : 'React Native');
    console.log('🔍 Full API URL being used:', apiUrl);
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for mobile
    
    console.log('📡 Making fetch request...');
    
    // Connect to your backend API with additional headers for mobile compatibility
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'NXSNotifier-Mobile/1.0',
        'Cache-Control': 'no-cache',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    console.log('📡 API Response received:');
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error response:', errorText);
      console.error('❌ ===== INQUIRIES API CALL FAILED =====');
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ API Response data received:');
    console.log('✅ Data type:', typeof data);
    console.log('✅ Data length:', Array.isArray(data) ? data.length : 'Not an array');
    console.log('✅ First item:', data[0] || 'No data');
    console.log('✅ ===== INQUIRIES API CALL SUCCESS =====');
    
    // Check if we got real data or mock data
    if (data.length > 0 && data[0]._id && typeof data[0]._id === 'object') {
      console.log('🗄️  Data appears to be from MongoDB (ObjectId format)');
    } else {
      console.log('📋 Data appears to be mock data (string ID format)');
    }
    
    return data;
  } catch (error) {
    console.error('❌ ===== INQUIRIES API CALL ERROR =====');
    console.error('❌ Error type:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    // Provide more specific error messages for mobile debugging
    if (error.name === 'AbortError') {
      console.error('⏰ Request timed out - check if backend server is running');
      throw new Error('Request timed out. Please check if the backend server is running and accessible.');
    }
    
    if (error.message.includes('Network request failed')) {
      console.error('🌐 Network request failed - check network connection and IP address');
      throw new Error('Network request failed. Please check your network connection and ensure the backend server is running on the correct IP address.');
    }
    
    if (error.message.includes('fetch')) {
      console.error('🌐 Fetch error - possible network or CORS issue');
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    throw error;
  }
};

// Mark inquiry as read
export const markInquiryAsRead = async (inquiryId) => {
  try {
    const apiUrl = `${getApiUrl(ENDPOINTS.INQUIRIES)}/${inquiryId}/read`;
    console.log('✅ Marking inquiry as read:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error marking inquiry as read:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Inquiry marked as read successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed to mark inquiry as read:', error);
    throw error;
  }
};

// Get unread count
export const getUnreadCount = async () => {
  try {
    const apiUrl = `${getApiUrl(ENDPOINTS.INQUIRIES)}/unread/count`;
    console.log('📊 Getting unread count:', apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error getting unread count:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('📊 Unread count:', data.unreadCount);
    return data.unreadCount;
  } catch (error) {
    console.error('❌ Failed to get unread count:', error);
    throw error;
  }
};



// Health check
export const checkApiHealth = async () => {
  try {
    console.log('🏥 Testing API health...');
    const response = await fetch(getApiUrl(ENDPOINTS.HEALTH), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'NXSNotifier-Mobile/1.0',
      },
    });
    
    console.log('🏥 Health check response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('🏥 Health check successful:', data);
    return data;
  } catch (error) {
    console.error('❌ API health check failed:', error);
    throw error;
  }
};

// Test network connectivity
export const testNetworkConnectivity = async () => {
  try {
    console.log('🌐 Testing network connectivity...');
    
    // Test basic internet connectivity
    const testResponse = await fetch('https://httpbin.org/get', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (testResponse.ok) {
      console.log('✅ Basic internet connectivity: OK');
    } else {
      console.log('❌ Basic internet connectivity: FAILED');
    }
    
    // Test our API connectivity
    const apiResponse = await fetch(getApiUrl(ENDPOINTS.HEALTH), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (apiResponse.ok) {
      console.log('✅ API connectivity: OK');
      return true;
    } else {
      console.log('❌ API connectivity: FAILED');
      return false;
    }
  } catch (error) {
    console.error('❌ Network connectivity test failed:', error);
    return false;
  }
};

 