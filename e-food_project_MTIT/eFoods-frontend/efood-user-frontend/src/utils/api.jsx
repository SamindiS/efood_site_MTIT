import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5010/order-service/api', // Order Management Service
  withCredentials: true, // Send cookies (sessions)
});

export default API;
