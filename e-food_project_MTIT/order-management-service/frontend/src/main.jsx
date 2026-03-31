import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
  
);