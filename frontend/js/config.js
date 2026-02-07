// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Endpoints
const API_ENDPOINTS = {
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  GET_ME: `${API_BASE_URL}/users/me`,
  GET_USERS: `${API_BASE_URL}/users`,
  SEND_REQUEST: `${API_BASE_URL}/requests`,
  GET_REQUESTS: `${API_BASE_URL}/requests`,
  RESPOND_REQUEST: (id) => `${API_BASE_URL}/requests/${id}/respond`,
};

// Helper function to get auth token
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Helper function to set auth token
function setAuthToken(token) {
  localStorage.setItem('authToken', token);
}

// Helper function to remove auth token
function removeAuthToken() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
}

// Helper function to check if user is logged in
function isLoggedIn() {
  return !!getAuthToken();
}

// Helper function to get auth headers
function getAuthHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}
