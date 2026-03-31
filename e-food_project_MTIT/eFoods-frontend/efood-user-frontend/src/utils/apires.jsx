import axios from 'axios';

const APIres = axios.create({
  baseURL: 'http://localhost:5000/api', // Restaurant Management Service
  withCredentials: true, // Send cookies (sessions)
});

export default APIres;
