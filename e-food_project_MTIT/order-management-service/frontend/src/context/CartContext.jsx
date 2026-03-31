import { createContext, useContext, useEffect, useState } from 'react';
import API from '../utils/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null); // Get from AuthContext in real

  const fetchCart = async () => {
    if (!userId) return;
    const res = await API.get(`/cart/${userId}`);
    setCart(res.data.items);
  };

  const addToCart = async (item) => {
    await API.post('/cart/add', item);
    fetchCart();
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);