import { useState, useEffect } from 'react';

const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let watchId;
    
    // Handler for successful position retrieval
    const handleSuccess = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      
      setLocation({
        lat: latitude,
        lng: longitude,
        accuracy,
        timestamp: position.timestamp,
      });
      
      setLoading(false);
    };

    // Handler for errors
    const handleError = (error) => {
      setError(error.message);
      setLoading(false);
    };

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
    
    // Set up continuous watching of position
    watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
    
    // Clean up on unmount
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [options]);

  return { location, error, loading };
};

export default useGeolocation;