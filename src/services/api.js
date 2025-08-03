import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';

// Create axios instance
const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    let message = 'Something went wrong';
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const errorData = error.response.data;
      
      // Handle specific error cases
      if (status === 401) {
        if (error.config.url.includes('/auth/login')) {
          // Login failed
          message = errorData?.message || 'Invalid email or password';
          if (message.toLowerCase().includes('user not found') || 
              message.toLowerCase().includes('user does not exist') ||
              message.toLowerCase().includes('no user found')) {
            message = 'User does not exist';
          } else if (message.toLowerCase().includes('password') || 
                     message.toLowerCase().includes('credential')) {
            message = 'Invalid email or password';
          }
        } else {
          // Session expired or unauthorized access
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } else if (status === 404) {
        message = errorData?.message || 'Resource not found';
      } else if (status === 400) {
        message = errorData?.message || 'Invalid request';
      } else if (status === 403) {
        message = errorData?.message || 'Access forbidden';
      } else if (status >= 500) {
        message = 'Server error. Please try again later.';
      } else {
        message = errorData?.message || `Server error: ${status}`;
      }
      
      console.error('Server Error:', errorData);
    } else if (error.request) {
      // Request was made but no response received
      message = 'Unable to connect to server. Please check your internet connection.';
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      message = error.message || 'Request failed';
      console.error('Request Error:', error.message);
    }
    
    // Show toast error message
    toast.error(message);
    
    return Promise.reject(error);
  }
);

// Helper function to build query parameters
const buildQueryParams = (filters = {}) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params.append(key, filters[key]);
    }
  });
  return params.toString();
};

// Auth API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Re-throw the error so it can be handled by the calling component
      throw error;
    }
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Delete own account
  deleteAccount: async () => {
    const response = await api.delete('/users/delete-account');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Rides API
export const ridesAPI = {
  // Get user's rides with optional filtering
  getUserRides: async (filters = {}) => {
    const params = buildQueryParams(filters);
    const response = await api.get(`/rides?${params}`);
    return response.data;
  },

  // Get specific ride details
  getRide: async (rideId) => {
    const response = await api.get(`/rides/${rideId}`);
    return response.data;
  },

  // Create new ride request
  createRide: async (rideData) => {
    const response = await api.post('/rides', rideData);
    return response.data;
  },

  // Update ride (only pending rides)
  updateRide: async (rideId, updateData) => {
    const response = await api.put(`/rides/${rideId}`, updateData);
    return response.data;
  },

  // Cancel ride (changes status to cancelled)
  cancelRide: async (rideId, reason = 'Cancelled by user') => {
    const response = await api.delete(`/rides/${rideId}`, {
      data: { reason }
    });
    return response.data;
  },

  // Delete ride permanently from database
  deleteRide: async (rideId) => {
    const response = await api.delete(`/rides/${rideId}/permanent`);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  // Get all rides (admin only)
  getAllRides: async (filters = {}) => {
    const params = buildQueryParams(filters);
    const response = await api.get(`/admin/rides?${params}`);
    return response.data;
  },

  // Approve ride
  approveRide: async (rideId, comments) => {
    const response = await api.put(`/admin/rides/${rideId}/approve`, { comments });
    return response.data;
  },

  // Reject ride
  rejectRide: async (rideId, reason, comments) => {
    const response = await api.put(`/admin/rides/${rideId}/reject`, { reason, comments });
    return response.data;
  },

  // Get ride analytics
  getAnalytics: async (filters = {}) => {
    const params = buildQueryParams(filters);
    const response = await api.get(`/admin/analytics?${params}`);
    return response.data;
  },

  // Get all users (admin only)
  getAllUsers: async (filters = {}) => {
    const params = buildQueryParams(filters);
    const response = await api.get(`/users?${params}`);
    return response.data;
  },

  // Create new user (admin only)
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update user (admin only)
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // Get recent activity for dashboard
  getRecentActivity: async (limit = 10) => {
    const response = await api.get(`/admin/recent-activity?limit=${limit}`);
    return response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  // Get notifications
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Set auth token
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Remove auth token
  removeToken: () => {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get user role
  getUserRole: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role || 'user';
  },

  // Check if user is admin
  isAdmin: () => {
    return apiUtils.getUserRole() === 'admin';
  },
};

export default api; 