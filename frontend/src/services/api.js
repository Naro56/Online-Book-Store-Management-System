import axios from 'axios';

// Create an axios instance with default config
const API = axios.create({
  baseURL: 'http://localhost:8082/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Set a timeout to prevent long waiting times
  timeout: 10000, // Increased timeout for slower connections
});

// Add a request interceptor to add the auth token to requests
API.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.method?.toUpperCase()} ${config.url}`, config);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
API.interceptors.response.use(
  (response) => {
    console.log(`API Success: ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Log detailed error information to console
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`API Error (${error.response.status}): ${error.config.method.toUpperCase()} ${error.config.url}`, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error(`API Error (No response): ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`API Error: ${error.message}`, error.config);
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) => {
    console.log('API Service: Sending login request', { username, password: '***HIDDEN***' });
    return API.post('/auth/signin', { username, password });
  },

  register: (userData) => {
    console.log('API Service: Sending register request', { ...userData, password: '***HIDDEN***' });
    return API.post('/auth/signup', userData);
  },
};

// Books API
export const booksAPI = {
  getAll: (page = 0, size = 12, sortBy = 'id', direction = 'asc') =>
    API.get(`/books?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`),

  getById: (id) =>
    API.get(`/books/${id}`),

  search: (query, page = 0, size = 12) =>
    API.get(`/books/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`),

  getByCategory: (categoryId, page = 0, size = 12) => {
    // Ensure categoryId is a number
    const numericCategoryId = parseInt(categoryId, 10);
    if (isNaN(numericCategoryId)) {
      console.error('Invalid category ID:', categoryId);
      return Promise.reject(new Error('Invalid category ID'));
    }

    console.log(`Making API call to get books by category: /books/category/${numericCategoryId}?page=${page}&size=${size}`);
    return API.get(`/books/category/${numericCategoryId}?page=${page}&size=${size}`);
  },

  getRecent: () =>
    API.get('/books/recent'),

  create: (bookData) =>
    API.post('/books', bookData),

  update: (id, bookData) =>
    API.put(`/books/${id}`, bookData),

  delete: (id) =>
    API.delete(`/books/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () =>
    API.get('/categories'),

  getById: (id) =>
    API.get(`/categories/${id}`),

  create: (categoryData) =>
    API.post('/categories', categoryData),

  update: (id, categoryData) =>
    API.put(`/categories/${id}`, categoryData),

  delete: (id) =>
    API.delete(`/categories/${id}`),
};

// User API
export const userAPI = {
  getProfile: () =>
    API.get('/user/profile'),

  updateProfile: (userData) =>
    API.put('/user/profile', userData),

  getOrders: () =>
    API.get('/user/orders'),
};

// Orders API
export const ordersAPI = {
  create: (orderData) =>
    API.post('/orders', orderData),

  getById: (id) =>
    API.get(`/orders/${id}`),

  updateStatus: (id, status) =>
    API.patch(`/orders/${id}/status`, { status }),
};

// Admin API
export const adminAPI = {
  getAllOrders: (page = 0, size = 10) =>
    API.get(`/admin/orders?page=${page}&size=${size}`),

  getOrderById: (id) =>
    API.get(`/admin/orders/${id}`),

  updateOrderStatus: (id, status, trackingNumber) =>
    API.patch(`/admin/orders/${id}/status`, { status, trackingNumber }),
};

export default API;
