import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:2139/api', // Replace with your backend URL
  withCredentials: true, // Send cookies (sessions)
});

export default API;
