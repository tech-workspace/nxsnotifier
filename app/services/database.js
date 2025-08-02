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

// Trigger check for new inquiries
export const checkForNewInquiries = async () => {
  try {
    const apiUrl = `${getApiUrl(ENDPOINTS.INQUIRIES).replace('/inquiries', '')}/ws/check-new-inquiries`;
    console.log('🔍 Triggering check for new inquiries:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error triggering new inquiries check:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ New inquiries check triggered:', data.message);
    return data;
  } catch (error) {
    console.error('❌ Failed to trigger new inquiries check:', error);
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

 