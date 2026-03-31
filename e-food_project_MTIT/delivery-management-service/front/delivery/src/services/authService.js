import axios from 'axios';

const API_URL = 'http://localhost:5002/api/drivers';

export const authService = {
  register: async (driverData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, driverData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getProfile: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  updateProfile: async (token, updateData) => {
    try {
      const response = await axios.put(`${API_URL}/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};