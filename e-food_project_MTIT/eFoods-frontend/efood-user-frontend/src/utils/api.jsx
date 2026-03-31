import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api', // Order Management Service
  withCredentials: true, // Send cookies (sessions)
});

export default API;
