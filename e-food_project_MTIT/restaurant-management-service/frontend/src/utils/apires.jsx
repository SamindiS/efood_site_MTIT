import axios from 'axios';

const APIres = axios.create({
  baseURL: 'http://localhost:5010/restaurant-service',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add token to requests
APIres.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default APIres;