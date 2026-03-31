import asyncHandler from 'express-async-handler';
import Driver from '../models/Driver.js';

// In-memory storage for driver locations (as a fallback)
const driverLocations = new Map();

const driverLocationController = {
  // Update the driver's current location
  updateLocation: asyncHandler(async (req, res) => {
    try {
      // Support both naming conventions (lat/lng and latitude/longitude)
      const latitude = req.body.latitude || req.body.lat;
      const longitude = req.body.longitude || req.body.lng;
      const timestamp = req.body.timestamp || new Date().toISOString();
      
      // Get driver ID from auth middleware
      const driverId = req.driver?._id || req.user._id;
      
      if (!latitude || !longitude) {
        res.status(400);
        throw new Error('Latitude and longitude are required');
      }
      
      try {
        // Try to update in database first
        await Driver.findByIdAndUpdate(driverId, {
          currentLocation: {
            type: 'Point',
            coordinates: [longitude, latitude] // GeoJSON format: [longitude, latitude]
          },
          locationUpdatedAt: new Date(timestamp)
        });
      } catch (dbError) {
        console.warn('Database update failed, using in-memory storage', dbError);
        // Fallback to in-memory storage if database fails
        driverLocations.set(driverId.toString(), {
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
          timestamp: timestamp,
          updatedAt: new Date()
        });
      }
      
      return res.status(200).json({ 
        success: true,
        message: 'Location updated successfully' 
      });
    } catch (error) {
      console.error('Error updating driver location:', error);
      res.status(500);
      throw new Error('Server error updating location');
    }
  }),
  
  // Get the driver's current location
  getLocation: asyncHandler(async (req, res) => {
    try {
      const driverId = req.params.id;
      
      // Try to get from database first
      let driver;
      let location;
      let stale = false;
      
      try {
        driver = await Driver.findById(driverId).select('currentLocation locationUpdatedAt firstName lastName');
        
        if (driver && driver.currentLocation) {
          const [lng, lat] = driver.currentLocation.coordinates;
          location = {
            lat,
            lng,
            timestamp: driver.locationUpdatedAt,
            updatedAt: driver.locationUpdatedAt
          };
          
          // Check if location is stale (older than 5 minutes)
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          if (new Date(driver.locationUpdatedAt) < fiveMinutesAgo) {
            stale = true;
          }
        }
      } catch (dbError) {
        console.warn('Database lookup failed, checking in-memory storage', dbError);
      }
      
      // If not found in database, try in-memory storage
      if (!location) {
        location = driverLocations.get(driverId);
        
        if (location) {
          // Check if in-memory location is stale
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
          if (new Date(location.updatedAt) < fiveMinutesAgo) {
            stale = true;
          }
        }
      }
      
      if (!location) {
        res.status(404);
        throw new Error('Driver location not found');
      }
      
      const responseData = {
        success: true,
        data: location,
        stale
      };
      
      // Add driver details if available
      if (driver) {
        responseData.driver = {
          id: driver._id,
          name: driver.firstName && driver.lastName ? 
                `${driver.firstName} ${driver.lastName}` : 
                undefined
        };
      }
      
      if (stale) {
        responseData.message = 'Location data may be outdated';
      }
      
      return res.status(200).json(responseData);
    } catch (error) {
      console.error('Error getting driver location:', error);
      res.status(500);
      throw new Error('Server error getting location');
    }
  }),
  
  // Toggle driver's online status
  toggleOnlineStatus: asyncHandler(async (req, res) => {
    try {
      const driverId = req.driver?._id || req.user._id;
      const { isOnline } = req.body;
      
      if (isOnline === undefined) {
        res.status(400);
        throw new Error('Online status is required');
      }
      
      const driver = await Driver.findByIdAndUpdate(
        driverId, 
        { isOnline }, 
        { new: true }
      ).select('isOnline');
      
      return res.status(200).json({
        success: true,
        isOnline: driver.isOnline
      });
    } catch (error) {
      console.error('Error toggling online status:', error);
      res.status(500);
      throw new Error('Server error updating online status');
    }
  })
};

export default driverLocationController;