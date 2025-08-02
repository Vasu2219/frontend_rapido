// Configuration file to centralize environment variables
const config = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
    socketUrl: process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000',
  },

  // App Configuration
  app: {
    name: process.env.REACT_APP_NAME || 'Rapido Corporate',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },

  // React Query Configuration
  query: {
    staleTime: parseInt(process.env.REACT_APP_QUERY_STALE_TIME) || 30000,
    refetchInterval: parseInt(process.env.REACT_APP_QUERY_REFETCH_INTERVAL) || 30000,
    fastRefetchInterval: parseInt(process.env.REACT_APP_QUERY_FAST_REFETCH_INTERVAL) || 10000,
    slowRefetchInterval: parseInt(process.env.REACT_APP_QUERY_SLOW_REFETCH_INTERVAL) || 60000,
  },

  // Notification Configuration
  notifications: {
    enabled: process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
    timeout: parseInt(process.env.REACT_APP_NOTIFICATION_TIMEOUT) || 5000,
  },

  // External Services
  services: {
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  },

  // Development flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default config;
