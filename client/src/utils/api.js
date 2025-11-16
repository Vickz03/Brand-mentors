import axios from 'axios'

// Use environment variable in production, localhost in development
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://your-backend-url.com/api'  // Update this with your backend URL
    : 'http://localhost:5000/api'
  )

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add error interceptor to handle API errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't log CORS errors if backend is not running
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      console.warn('Backend API not available. Make sure server is running on http://localhost:5000')
    }
    return Promise.reject(error)
  }
)

// Brands API
export const brandsAPI = {
  getAll: () => api.get('/brands'),
  getById: (id) => api.get(`/brands/${id}`),
  create: (data) => api.post('/brands', data),
  update: (id, data) => api.put(`/brands/${id}`, data),
  delete: (id) => api.delete(`/brands/${id}`),
  scrape: (id) => api.post(`/brands/${id}/scrape`)
}

// Mentions API
export const mentionsAPI = {
  getByBrand: (brandId, params) => api.get(`/mentions/brand/${brandId}`, { params }),
  getLatest: (limit = 20) => api.get('/mentions/latest', { params: { limit } }),
  getById: (id) => api.get(`/mentions/${id}`),
  getStats: (brandId) => api.get(`/mentions/brand/${brandId}/stats`)
}

// Dashboard API
export const dashboardAPI = {
  getData: (brandId) => api.get(`/dashboard/brand/${brandId}`)
}

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, name) => api.post('/auth/register', { email, password, name })
}

export default api

