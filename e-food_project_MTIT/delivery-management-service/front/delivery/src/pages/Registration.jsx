import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import backgroundImage from '../assets/bc.png';

const vehicleTypes = ['Motorcycle', 'Car', 'Van', 'Truck'];

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    licenseNumber: '',
    vehicleType: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.register(formData);
      login(response, response.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
        <div 
          className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
    {/* <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4"> */}
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
          Driver Registration
        </h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            name="licenseNumber"
            placeholder="License Number"
            value={formData.licenseNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Vehicle Type</option>
            {vehicleTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 bg-black rounded-md hover:bg-[rgba(0,0,0,0.8)] transition duration-300"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account? {' '}
          <a href="/login" className="text-primary hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
    // </div>
  );
};

export default Registration;