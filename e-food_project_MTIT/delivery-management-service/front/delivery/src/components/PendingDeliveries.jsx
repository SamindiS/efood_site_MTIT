import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingDeliveries = () => {
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingDeliveries = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/deliveries/pending', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPendingDeliveries(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch pending deliveries');
        setLoading(false);
      }
    };

    fetchPendingDeliveries();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingDeliveries, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (deliveryId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/deliveries/${deliveryId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from pending list
      setPendingDeliveries(pendingDeliveries.filter(delivery => delivery._id !== deliveryId));
    } catch (err) {
      setError('Failed to accept delivery');
    }
  };

  const handleReject = async (deliveryId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/deliveries/${deliveryId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove from pending list
      setPendingDeliveries(pendingDeliveries.filter(delivery => delivery._id !== deliveryId));
    } catch (err) {
      setError('Failed to reject delivery');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Pending Deliveries</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {pendingDeliveries.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No pending deliveries available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pendingDeliveries.map(delivery => (
            <div key={delivery._id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{delivery.restaurantName}</h3>
                  <p className="text-gray-600 mt-1">Order #{delivery.orderNumber}</p>
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  Pending
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Pickup Location:</p>
                  <p className="font-medium">{delivery.pickupAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dropoff Location:</p>
                  <p className="font-medium">{delivery.dropoffAddress}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600">Estimated Delivery Time:</p>
                <p className="font-medium">{delivery.estimatedDeliveryTime || 30} minutes</p>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600">Estimated Earnings:</p>
                <p className="font-medium text-green-600">${delivery.estimatedEarnings.toFixed(2)}</p>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <button 
                  onClick={() => handleAccept(delivery._id)}
                  className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleReject(delivery._id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingDeliveries;