import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import locationService from '../services/LocationService';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const LiveTrackingMap = ({ delivery }) => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const directionsService = useRef(null);
  const trackingStarted = useRef(false);
  
  // Initialize map
  const onLoad = useCallback(map => {
    setMapInstance(map);
    try {
      const google = window.google;
      if (google && google.maps) {
        directionsService.current = new google.maps.DirectionsService();
      }
    } catch (error) {
      console.error("Error initializing Google Maps:", error);
      setError("Failed to initialize map services");
    }
  }, []);

  const onUnmount = useCallback(() => {
    setMapInstance(null);
    directionsService.current = null;
  }, []);
  
  // Listen for location updates
  useEffect(() => {
    const locationCallback = (location) => {
      setDriverLocation(location);
      setLoading(false);
    };

    // Add listener for location updates
    locationService.addListener(locationCallback);
    
    // Start tracking if not already started
    if (!trackingStarted.current) {
      const success = locationService.startTracking();
      if (!success) {
        setError("Location tracking is not available");
        setLoading(false);
      }
      trackingStarted.current = true;
    } else {
      // If tracking already started, get current location
      const currentLocation = locationService.getCurrentLocation();
      if (currentLocation) {
        setDriverLocation(currentLocation);
        setLoading(false);
      }
    }
    
    // Clean up
    return () => {
      locationService.removeListener(locationCallback);
    };
  }, []);
  
  // Stop tracking when component unmounts
  useEffect(() => {
    return () => {
      if (trackingStarted.current) {
        locationService.stopTracking();
        trackingStarted.current = false;
      }
    };
  }, []);
  
  // Update directions when location changes
  useEffect(() => {
    if (!directionsService.current || !delivery || !driverLocation || !window.google) return;

    try {
      // Calculate the correct origin and destination based on delivery status
      const origin = delivery.status === 'accepted' 
        ? { lat: driverLocation.lat, lng: driverLocation.lng } 
        : { lat: delivery.pickupLocation.lat, lng: delivery.pickupLocation.lng };
      
      const destination = delivery.status === 'accepted'
        ? { lat: delivery.pickupLocation.lat, lng: delivery.pickupLocation.lng }
        : { lat: delivery.dropoffLocation.lat, lng: delivery.dropoffLocation.lng };

      directionsService.current.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
            
            // Fit map to include all points
            if (mapInstance) {
              const bounds = new window.google.maps.LatLngBounds();
              bounds.extend(origin);
              bounds.extend(destination);
              mapInstance.fitBounds(bounds);
            }
          } else {
            console.error(`Error fetching directions: ${status}`);
            setError("Failed to calculate route");
          }
        }
      );
    } catch (error) {
      console.error("Error calculating directions:", error);
      setError("Failed to update map directions");
    }
  }, [delivery, driverLocation, mapInstance]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading map and tracking data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Use a placeholder API key - in production, this should be an environment variable
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '';

  return (
    <div className="h-full w-full">
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={["places"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={driverLocation ? driverLocation : { lat: 37.7749, lng: -122.4194 }}
          zoom={14}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: true
          }}
        >
          {/* Driver's current location */}
          {driverLocation && (
            <Marker
              position={driverLocation}
              icon={{
                url: '/icons/delivery-truck.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          )}

          {/* Restaurant location */}
          {delivery && delivery.pickupLocation && (
            <Marker
              position={delivery.pickupLocation}
              icon={{
                url: '/icons/restaurant.png',
                scaledSize: new window.google.maps.Size(36, 36),
              }}
            />
          )}

          {/* Customer location */}
          {delivery && delivery.dropoffLocation && (
            <Marker
              position={delivery.dropoffLocation}
              icon={{
                url: '/icons/home.png',
                scaledSize: new window.google.maps.Size(36, 36),
              }}
            />
          )}

          {/* Directions */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: '#FF8C00',
                  strokeWeight: 5
                }
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default LiveTrackingMap;