// API Configuration for React Native app
// Using multiple backends for different services

// API Gateway - for auth and visits (as per API_DOCUMENTATION.md)
const API_GATEWAY_URL = 'https://apigateway.up.railway.app';

// Local Backend - for inquiries (nxsnotifier backend)
const LOCAL_BACKEND_URL = 'https://nxsnotifier.up.railway.app/api';

// Default to API Gateway
export const API_BASE_URL = API_GATEWAY_URL;

// API endpoints configuration with their respective base URLs
export const ENDPOINTS = {
  INQUIRIES: '/inquiries',
  VISITS: '/v1/visits',
  AUTH_SIGNUP: '/v1/auth/signup',
  AUTH_LOGIN: '/v1/auth/login',
  AUTH_PROFILE: '/v1/auth/profile',
  HEALTH: '/health',
};

// Endpoint-to-base-URL mapping
const ENDPOINT_BASE_URLS = {
  '/inquiries': LOCAL_BACKEND_URL,
  '/v1/visits': API_GATEWAY_URL,
  '/v1/auth/signup': API_GATEWAY_URL,
  '/v1/auth/login': API_GATEWAY_URL,
  '/v1/auth/profile': API_GATEWAY_URL,
  '/health': LOCAL_BACKEND_URL,
};

// Full API URLs - automatically selects the correct base URL for each endpoint
export const getApiUrl = (endpoint) => {
  const baseUrl = ENDPOINT_BASE_URLS[endpoint] || API_BASE_URL;
  return `${baseUrl}${endpoint}`;
};

export default {
  API_BASE_URL,
  ENDPOINTS,
  getApiUrl,
}; 