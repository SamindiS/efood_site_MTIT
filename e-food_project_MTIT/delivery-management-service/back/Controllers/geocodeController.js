import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Controller for geocoding addresses
const geocodeController = {
  // Geocode an address to get latitude and longitude
  geocodeAddress: async (req, res) => {
    try {
      const { address } = req.query;
      
      if (!address) {
        return res.status(400).json({ message: 'Address is required' });
      }
      
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ message: 'Google Maps API key not configured' });
      }
      
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );
      
      if (response.data.status !== 'OK') {
        return res.status(400).json({ 
          message: 'Geocoding failed', 
          status: response.data.status 
        });
      }
      
      const location = response.data.results[0].geometry.location;
      
      return res.json({
        lat: location.lat,
        lng: location.lng,
        formattedAddress: response.data.results[0].formatted_address
      });
    } catch (error) {
      console.error('Geocoding error:', error);
      return res.status(500).json({ message: 'Server error during geocoding' });
    }
  }
};

export default geocodeController;