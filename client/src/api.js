import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach admin token when present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('virava_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401 for admin routes
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 && location.pathname.startsWith('/admin') &&
        !location.pathname.endsWith('/login')) {
      localStorage.removeItem('virava_token');
      location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;
