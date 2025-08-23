// Configuration utility for the application
export const config = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  
  // App Configuration
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'MoneySplit',
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  
  // Feature Flags
  enableDebug: process.env.NODE_ENV === 'development',
};

// Helper function to get full API endpoint
export const getApiEndpoint = (endpoint) => {
  return `${config.apiUrl}${endpoint}`;
};

// Common API endpoints
export const apiEndpoints = {
  users: {
    login: '/api/users/login',
    signup: '/api/users/signup',
    getById: (id) => `/api/users/${id}`,
    addUser: '/api/users/addUser',
  },
  groups: {
    create: '/api/groups/create',
    getById: (id) => `/api/groups/${id}`,
  },
  expenses: {
    getAll: '/api/expenses',
    create: '/api/expenses/create',
    update: (id) => `/api/expenses/${id}`,
    delete: (id) => `/api/expenses/${id}`,
  },
  bills: {
    create: '/api/bills/createBills',
    delete: '/api/bills/deleteBills',
  },
};
