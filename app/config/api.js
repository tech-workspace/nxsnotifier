// API Configuration for React Native app
// This file manages the backend API URL - using production Railway service for all environments

// Production environment (Railway hosted backend)
const PROD_API_URL = 'https://nxsnotifier.up.railway.app/api';

// Use production URL for all environments
export const API_BASE_URL = PROD_API_URL;

// Debug logging - this should appear immediately when app loads
console.log('🚀 ===== API CONFIGURATION LOADED =====');
console.log('🔧 API Configuration Loaded:');
console.log('🌐 API_BASE_URL:', API_BASE_URL);
console.log('📱 Environment:', typeof window !== 'undefined' ? 'Web' : 'React Native');
console.log('🔍 Using Railway backend for all environments');
console.log('✅ Configuration is using Railway URL:', API_BASE_URL === 'https://nxsnotifier.up.railway.app/api');
console.log('🚀 ===== END API CONFIGURATION =====');

// API endpoints
export const ENDPOINTS = {
  INQUIRIES: '/inquiries',
  HEALTH: '/health',
};

// Full API URLs
export const getApiUrl = (endpoint) => {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log('🔗 Generated API URL:', fullUrl);
  return fullUrl;
};

export default {
  API_BASE_URL,
  ENDPOINTS,
  getApiUrl,
}; 