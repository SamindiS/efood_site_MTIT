import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import RestaurantManager from './pages/RestaurantManager';
import OrderManager from './pages/OrderManager';
import UserManager from './pages/UserManager';
import MenuManager from './pages/MenuManager';
import RestaurantOrderManager from './pages/RestaurantOrderManager';
import PaymentManager from './pages/PaymentManager';
import DeliveryManager from './pages/DeliveryManager';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAdmin') === 'true');

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />

        <Route path="/" element={
          <AdminLayout handleLogout={handleLogout}>
            <Dashboard />
          </AdminLayout>
        } />

        <Route path="/restaurants" element={
          <AdminLayout handleLogout={handleLogout}>
            <RestaurantManager />
          </AdminLayout>
        } />

        <Route path="/users" element={
          <AdminLayout handleLogout={handleLogout}>
            <UserManager />
          </AdminLayout>
        } />

        <Route path="/orders" element={
          <AdminLayout handleLogout={handleLogout}>
            <OrderManager />
          </AdminLayout>
        } />

        <Route path="/restaurants/:id/menu" element={
          <AdminLayout handleLogout={handleLogout}>
            <MenuManager />
          </AdminLayout>
        } />

        <Route path="/restaurants/:id/orders" element={
          <AdminLayout handleLogout={handleLogout}>
            <RestaurantOrderManager />
          </AdminLayout>
        } />

        <Route path="/payments" element={
          <AdminLayout handleLogout={handleLogout}>
            <PaymentManager />
          </AdminLayout>
        } />

        <Route path="/delivery" element={
          <AdminLayout handleLogout={handleLogout}>
            <DeliveryManager />
          </AdminLayout>
        } />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
