import { createContext, useContext, useEffect, useState } from 'react';
import API from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async (userId) => {
    try {
      const res = await API.get(`/auth/user/${userId}`);
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    setUser(res.data);
    return res.data;
  };

  const register = async (userData) => {
    const res = await API.post('/auth/register', userData);
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await API.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);