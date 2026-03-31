import express from 'express';
import geocodeController from '../controllers/geocodeController.js';
import driverLocationController from '../controllers/driverLocationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Geocoding route
router.get('/geocode', geocodeController.geocodeAddress);

// Driver location routes
router.post('/drivers/location', protect, driverLocationController.updateLocation);
router.put('/drivers/location', protect, driverLocationController.updateLocation); // Support both POST and PUT
router.get('/drivers/:id/location', driverLocationController.getLocation);
router.post('/drivers/status', protect, driverLocationController.toggleOnlineStatus);

export default router;