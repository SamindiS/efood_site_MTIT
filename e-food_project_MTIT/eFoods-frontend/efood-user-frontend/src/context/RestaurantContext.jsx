import React, { createContext, useContext, useEffect, useState } from 'react';
import APIres from '../utils/apires';

export const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(() => {
    // Load user from localStorage if available
    const storedRestaurant = localStorage.getItem('restaurant');
    return storedRestaurant ? JSON.parse(storedRestaurant) : null;
  });

  const login = async (email, password) => {
    const res = await APIres.post('/api/restaurants/login', { email, password });
    setRestaurant(res.data);
    localStorage.setItem('restaurant', JSON.stringify(res.data));
  };

  const register = async (userData) => {
    const res = await APIres.post('/api/restaurants/register', userData);
    setRestaurant(res.data);
    localStorage.setItem('restaurant', JSON.stringify(res.data));
  };

  const logout = () => {
    setRestaurant(null);
    localStorage.removeItem('restaurant'); // Clear restaurant from localStorage
  };

  return (
    <RestaurantContext.Provider value={{ restaurant, login, register, logout }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => useContext(RestaurantContext);