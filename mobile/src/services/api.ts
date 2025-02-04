import axios from 'axios';
import Constants from 'expo-constants';

// Get the development server URL dynamically
const getBaseUrl = () => {
  // Get the local IP address from Expo
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(':')[0];

  if (!localhost) {
    return 'http://localhost:8000';
  }

  return `http://${localhost}:8000`;
};

const BASE_URL = getBaseUrl();

console.log('Using API URL:', BASE_URL); // Debug log

export const api = axios.create({
  baseURL: BASE_URL,
  // Increase timeout to 5 minutes
  timeout: 300000,  // 5 minutes
  headers: {
    'Content-Type': 'application/json',
    // Add CORS headers
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
});

// Improve request logging
api.interceptors.request.use(request => {
  const startTime = new Date().getTime();
  console.log('🚀 API Request:', {
    url: `${BASE_URL}${request.url}`,
    method: request.method,
    data: request.data,
    timestamp: new Date().toISOString()
  });
  
  request.metadata = { startTime };
  return request;
});

api.interceptors.response.use(
  response => {
    const duration = new Date().getTime() - response.config.metadata.startTime;
    console.log('✅ API Response:', {
      status: response.status,
      duration: `${(duration/1000).toFixed(2)} seconds`,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    return response;
  },
  error => {
    const duration = error.config?.metadata?.startTime 
      ? (new Date().getTime() - error.config.metadata.startTime) / 1000
      : 'unknown';
      
    console.log('❌ API Error:', {
      message: error.message,
      code: error.code,
      data: error?.response?.data,
      status: error?.response?.status,
      duration: `${duration.toFixed(2)} seconds`,
      timestamp: new Date().toISOString()
    });
    return Promise.reject(error);
  }
);

export const endpoints = {
  recommendations: '/api/recommendations',
};
