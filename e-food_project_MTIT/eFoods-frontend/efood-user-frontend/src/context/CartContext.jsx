import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null); // Get from AuthContext in real

  const fetchCart = async () => {
    try {
      if (!user?._id) return;
      const res = await API.get(`/cart/${user._id}`); // updated to use user._id
      setCart(res.data.items);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  const addToCart = async (item) => {
    try {
      await API.post('/cart', item); // corrected endpoint
      fetchCart();
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const updateItemQty = async (restaurantId, menuItemId, quantity) => {
    try {
      await API.put(`/cart/${user._id}`, { restaurantId, menuItemId, quantity });
      fetchCart();
    } catch (err) {
      console.error("Update item quantity error:", err);
    }
  };

  const removeFromCart = async (restaurantId, menuItemId) => {
    try {
      await API.delete(`/cart/${user._id}/${menuItemId}`);
      fetchCart();
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, fetchCart, addToCart, updateItemQty, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
