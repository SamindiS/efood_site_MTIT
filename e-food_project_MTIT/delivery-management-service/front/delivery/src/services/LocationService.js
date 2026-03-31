import axios from 'axios';

class LocationService {
  constructor() {
    this.watchId = null;
    this.currentLocation = null;
    this.listeners = [];
    this.apiUrl = process.env.VITE_GOOGLE_MAPS_API_KEY || 'http://localhost:5010/delivery-service/api';
  }

  // Start tracking driver location
  startTracking() {
    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(
        this.handlePositionUpdate.bind(this),
        this.handleError.bind(this),
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 10000
        }
      );
      return true;
    } else {
      console.error('Geolocation is not supported by this browser');
      return false;
    }
  }

  // Stop tracking location
  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      return true;
    }
    return false;
  }

  // Handle successful position update
  async handlePositionUpdate(position) {
    const location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      timestamp: new Date().toISOString()
    };

    this.currentLocation = location;

    // Notify all listeners
    this.listeners.forEach(listener => listener(location));

    // Send location to server
    try {
      await this.updateDriverLocation(location);
    } catch (error) {
      console.error('Error updating location on server:', error);
    }
  }

  // Handle geolocation errors
  handleError(error) {
    let errorMessage;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "User denied the request for geolocation";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information is unavailable";
        break;
      case error.TIMEOUT:
        errorMessage = "The request to get user location timed out";
        break;
      case error.UNKNOWN_ERROR:
        errorMessage = "An unknown error occurred";
        break;
      default:
        errorMessage = "Error getting location";
    }
    console.error(errorMessage);
  }

  // Get current location
  getCurrentLocation() {
    return this.currentLocation;
  }

  // Add location update listener
  addListener(callback) {
    if (typeof callback === 'function' && !this.listeners.includes(callback)) {
      this.listeners.push(callback);
      return true;
    }
    return false;
  }

  // Remove location update listener
  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index !== -1) {
      this.listeners.splice(index, 1);
      return true;
    }
    return false;
  }

  // Update driver location on the server
  async updateDriverLocation(location) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${this.apiUrl}/drivers/location`,
        {
          lat: location.lat,
          lng: location.lng,
          timestamp: location.timestamp
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating driver location:', error);
      throw error;
    }
  }

  // Get specific driver's location
  async getDriverLocation(driverId) {
    try {
      const response = await axios.get(`${this.apiUrl}/drivers/${driverId}/location`);
      return response.data;
    } catch (error) {
      console.error('Error fetching driver location:', error);
      throw error;
    }
  }

  // Get geocoded location from address
  async getGeocodedLocation(address) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/geocode?address=${encodeURIComponent(address)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw error;
    }
  }
}

// Export as singleton
const locationService = new LocationService();
export default locationService;