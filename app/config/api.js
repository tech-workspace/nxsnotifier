// API Configuration for React Native app
// This file manages the backend API URL for different environments

// Development environment configurations
const DEV_API_URL_ANDROID = 'http://10.0.2.2:5000/api'; // Android Emulator
const DEV_API_URL_IOS = 'http://localhost:5000/api'; // iOS Simulator
const DEV_API_URL_WEB = 'http://localhost:5000/api'; // Web browser

// Production environment (when deployed)
// Update this to your actual production backend URL
const PROD_API_URL = 'https://your-backend-domain.com/api';

// Get the correct API URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in a web environment
  if (typeof window !== 'undefined') {
    console.log('🌐 Detected web environment, using localhost:5000');
    return DEV_API_URL_WEB;
  }
  
  // For React Native builds, use production URL
  // For development, use local URLs
  const isDevelopment = __DEV__;
  
  if (isDevelopment) {
    console.log('📱 Detected React Native development environment, using 10.0.2.2:5000');
    return DEV_API_URL_ANDROID;
  } else {
    console.log('📱 Detected React Native production environment, using production URL');
    return PROD_API_URL;
  }
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