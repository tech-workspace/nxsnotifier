// API Configuration for React Native app
// This file manages the backend API URL for different environments

// Development environment configurations
const DEV_API_URL_ANDROID_EMULATOR = 'http://10.0.2.2:5000/api'; // Android Emulator
const DEV_API_URL_ANDROID_DEVICE = 'http://10.0.0.84:5000/api'; // Physical Android Device (update IP)
const DEV_API_URL_IOS = 'http://localhost:5000/api'; // iOS Simulator
const DEV_API_URL_WEB = 'http://localhost:5000/api'; // Web browser

// Production environment (when deployed)
// Update this to your actual production backend URL
const PROD_API_URL = 'https://nxsnotifier-backend.onrender.com/api';

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
    // For Android, we need to detect if it's an emulator or physical device
    // For now, we'll use a more flexible approach
    console.log('📱 Detected React Native development environment');
    
    // You can update this IP address to match your computer's IP
    // To find your IP: on Windows run 'ipconfig', on Mac/Linux run 'ifconfig'
    return DEV_API_URL_ANDROID_DEVICE;
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