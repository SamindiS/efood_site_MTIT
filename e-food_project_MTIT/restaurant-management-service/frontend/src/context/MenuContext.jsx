import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check authentication status
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const restaurantId = localStorage.getItem('restaurantId');
    
    if (!token || !restaurantId) {
      return false;
    }
    return true;
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const restaurantId = localStorage.getItem('restaurantId');
      if (!restaurantId) {
        throw new Error('Restaurant not authenticated');
      }

      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/menu/restaurant/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMenuItems(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch menu items');
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = async (formData) => {
    if (!checkAuth()) {
      throw new Error('Please login to add menu items');
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const restaurantId = localStorage.getItem('restaurantId');
      
      formData.append('restaurantId', restaurantId);

      const response = await axios.post('http://localhost:5000/api/menu/', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setMenuItems(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add menu item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMenuItem = async (id, formData) => {
    if (!checkAuth()) {
      throw new Error('Please login to update menu items');
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const restaurantId = localStorage.getItem('restaurantId');
      
      formData.append('restaurantId', restaurantId);

      const response = await axios.put(`http://localhost:5000/api/menu/${id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      setMenuItems(prev => prev.map(item => item._id === id ? response.data : item));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update menu item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Also add deleteMenuItem if it's not defined
  const deleteMenuItem = async (id) => {
    if (!checkAuth()) {
      throw new Error('Please login to delete menu items');
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/menu/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMenuItems(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete menu item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checkAuth()) {
      fetchMenuItems();
    }
  }, []);

  return (
    <MenuContext.Provider value={{
      menuItems,
      loading,
      error,
      fetchMenuItems,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      checkAuth
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);