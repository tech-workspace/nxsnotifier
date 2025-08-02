// API Configuration for React Native app
// This file manages the backend API URL for different environments

// Development environment configurations
const DEV_API_URL_ANDROID = 'http://10.0.2.2:5000/api'; // Android Emulator
const DEV_API_URL_IOS = 'http://localhost:5000/api'; // iOS Simulator
const DEV_API_URL_WEB = 'http://localhost:5000/api'; // Web browser

// Production environment (when deployed)
const PROD_API_URL = 'https://your-production-api.com/api';

// Get the correct API URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in a web environment
  if (typeof window !== 'undefined') {
    console.log('🌐 Detected web environment, using localhost:5000');
    return DEV_API_URL_WEB;
  }
  
  // For React Native, we'll use a simple approach
  // You can enhance this with Platform.OS detection if needed
  console.log('📱 Detected React Native environment, using 10.0.2.2:5000');
  return DEV_API_URL_ANDROID; // Default to Android emulator URL
};

export const API_BASE_URL = getApiBaseUrl();

// API endpoints
export const ENDPOINTS = {
  INQUIRIES: '/inquiries',
  HEALTH: '/health',
};

// Full API URLs
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

export default {
  API_BASE_URL,
  ENDPOINTS,
  getApiUrl,
}; 