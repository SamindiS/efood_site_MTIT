import React, { useState, useEffect } from 'react';
import LiveTrackingMap from './LiveTrackingMap';

const DeliveryTracking = ({ deliveryId }) => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to get delivery details
    const getDeliveryDetails = () => {
      try {
        // In a real app, this would fetch from API
        // For demo purposes, using localStorage
        const activeDeliveries = JSON.parse(localStorage.getItem('activeDeliveries') || '[]');
        const currentDelivery = activeDeliveries.find(d => d._id === deliveryId);
        
        if (!currentDelivery) {
          setError('Delivery not found');
          setLoading(false);
          return;
        }
        
        // Add pickup and dropoff locations if not present (for demo)
        if (!currentDelivery.pickupLocation) {
          currentDelivery.pickupLocation = {
            lat: 37.7749 + (Math.random() * 0.02 - 0.01), // Randomize near San Francisco
            lng: -122.4194 + (Math.random() * 0.02 - 0.01)
          };
        }
        
        if (!currentDelivery.dropoffLocation) {
          currentDelivery.dropoffLocation = {
            lat: 37.7749 + (Math.random() * 0.04 - 0.02), // Randomize near San Francisco
            lng: -122.4194 + (Math.random() * 0.04 - 0.02)
          };
        }
        
        setDelivery(currentDelivery);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching delivery details:', err);
        setError('Failed to load delivery details');
        setLoading(false);
      }
    };
    
    getDeliveryDetails();
  }, [deliveryId]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="p-6 text-center text-gray-600">
        No delivery information found
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <h2 className="text-xl font-bold mb-2">
          Order #{delivery.orderNumber} - {delivery.restaurantName}
        </h2>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {delivery.status === 'accepted' ? 'En Route to Restaurant' : 'En Route to Customer'}
            </div>
          </div>
          
          <div>
            <span className="text-gray-600">Estimated Earnings:</span>
            <span className="font-bold text-green-600 ml-1">${delivery.estimatedEarnings}</span>
          </div>
        </div>
      </div>
      
      <div className="flex-grow bg-white shadow rounded-lg overflow-hidden" style={{ height: '500px' }}>
        <LiveTrackingMap delivery={delivery} />
      </div>
      
      <div className="bg-white shadow rounded-lg p-4 mt-4">
        <h3 className="font-bold mb-2">Delivery Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Restaurant:</p>
            <p className="font-medium">{delivery.restaurantName}</p>
            <p className="text-sm mt-1">{delivery.pickupAddress || 'Address not available'}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Customer:</p>
            <p className="font-medium">{delivery.customerName}</p>
            <p className="text-sm mt-1">{delivery.dropoffAddress}</p>
          </div>
        </div>
        
        {delivery.status === 'accepted' ? (
          <button className="w-full mt-4 bg-black text-white py-3 rounded-md hover:bg-gray-800">
            Mark as Picked Up
          </button>
        ) : (
          <button className="w-full mt-4 bg-green-500 text-white py-3 rounded-md hover:bg-green-600">
            Mark as Delivered
          </button>
        )}
      </div>
    </div>
  );
};

export default DeliveryTracking;