// Database service using fetch API for React Native compatibility
// Connects to the Node.js/Express backend with Mongoose

import { API_BASE_URL, ENDPOINTS, getApiUrl } from '../config/api';

export const getInquiries = async () => {
  try {
    const apiUrl = getApiUrl(ENDPOINTS.INQUIRIES);
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for mobile
    
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
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching inquiries:', error.message);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check if the backend server is running and accessible.');
    }
    
    if (error.message.includes('Network request failed')) {
      throw new Error('Network request failed. Please check your network connection and ensure the backend server is running on the correct IP address.');
    }
    
    if (error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    throw error;
  }
};

// Mark inquiry as read
export const markInquiryAsRead = async (inquiryId) => {
  try {
    const apiUrl = `${getApiUrl(ENDPOINTS.INQUIRIES)}/${inquiryId}/read`;
    
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to mark inquiry as read:', error);
    throw error;
  }
};

// Get unread count
export const getUnreadCount = async () => {
  try {
    const apiUrl = `${getApiUrl(ENDPOINTS.INQUIRIES)}/unread/count`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data.unreadCount;
  } catch (error) {
    console.error('Failed to get unread count:', error);
    throw error;
  }
};



// Health check
export const checkApiHealth = async () => {
  try {
    const response = await fetch(getApiUrl(ENDPOINTS.HEALTH), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'NXSNotifier-Mobile/1.0',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};

// Test network connectivity
export const testNetworkConnectivity = async () => {
  try {
    // Test basic internet connectivity
    const testResponse = await fetch('https://httpbin.org/get', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    // Test our API connectivity
    const apiResponse = await fetch(getApiUrl(ENDPOINTS.HEALTH), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    return apiResponse.ok;
  } catch (error) {
    console.error('Network connectivity test failed:', error);
    return false;
  }
};

// Get visits with authentication
export const getVisits = async (token, page = 1, limit = 10, sourceSystemConst = 'NEXUS_WEBSITE') => {
  try {
    const apiUrl = `${getApiUrl(ENDPOINTS.VISITS)}?page=${page}&limit=${limit}&sortBy=timestamp&sortOrder=desc&sourceSystemConst=${sourceSystemConst}`;
    
    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'NXSNotifier-Mobile/1.0',
        'Cache-Control': 'no-cache',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.json();
    
    // Return the visits array from the data property
    return responseData.data?.visits || [];
  } catch (error) {
    console.error('Error fetching visits:', error.message);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check if the backend server is running and accessible.');
    }
    
    if (error.message.includes('Network request failed')) {
      throw new Error('Network request failed. Please check your network connection and ensure the backend server is running.');
    }
    
    if (error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    throw error;
  }
};

// Get visit statistics
export const getVisitStatistics = async (token) => {
  try {
    const apiUrl = `${getApiUrl(ENDPOINTS.VISITS)}/statistics`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data.data?.statistics || {};
  } catch (error) {
    console.error('Failed to get visit statistics:', error);
    throw error;
  }
};

// Authentication APIs

// Signup - Create new user account
export const signupUser = async (fullName, mobile, password) => {
  try {
    const apiUrl = getApiUrl(ENDPOINTS.AUTH_SIGNUP);
    
    console.log('Signup API URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        mobile,
        password,
      }),
    });
    
    console.log('Signup response status:', response.status);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Non-JSON response received:', textResponse.substring(0, 500));
      throw new Error('Server returned an invalid response. Please check if the API is running correctly.');
    }
    
    const data = await response.json();
    console.log('Signup response data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }
    
    return {
      success: data.success,
      user: data.data?.user,
      token: data.data?.token,
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Login - Authenticate user
export const loginUser = async (mobile, password) => {
  try {
    const apiUrl = getApiUrl(ENDPOINTS.AUTH_LOGIN);
    
    console.log('Login API URL:', apiUrl);
    console.log('Login payload:', { mobile, password: '***' });
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        mobile,
        password,
      }),
    });
    
    console.log('Login response status:', response.status);
    console.log('Login response headers:', Object.fromEntries(response.headers.entries()));
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Non-JSON response received:', textResponse.substring(0, 500));
      throw new Error('Server returned an invalid response. Please check if the API is running correctly.');
    }
    
    const data = await response.json();
    console.log('Login response data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return {
      success: data.success,
      user: data.data?.user,
      token: data.data?.token,
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (token) => {
  try {
    const apiUrl = getApiUrl(ENDPOINTS.AUTH_PROFILE);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Non-JSON response received:', textResponse.substring(0, 500));
      throw new Error('Server returned an invalid response. Please check if the API is running correctly.');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get profile');
    }
    
    return {
      success: data.success,
      user: data.data?.user,
    };
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

 