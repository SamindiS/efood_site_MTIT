import express from 'express';
import {
  registerDriver,
  loginDriver,
  getDriverProfile,
  updateDriverProfile,
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  getOrders, // get orders from a different database
  deleteOrder,// delete an order from a different database
  getRestaurantAddress,
  deleteDriver
} from '../Controllers/driverController.js';
import { protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerDriver);
router.post('/login', loginDriver);

// Get orders from a different database
// This route needs to be BEFORE the /:id route to avoid conflict
router.get('/orders', getOrders);
router.delete('/orders/:id', deleteOrder);

// Route to get restaurant address by ID
router.get('/restaurants/:id/address', getRestaurantAddress);





// Add to your driverRoutes.js
router.get('/testrestaurant/:id', async (req, res) => {
  try {
    const { Restaurant } = req.app.locals.dbs;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    return res.json({ success: true, data: restaurant });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Add to your driverRoutes.js
router.get('/checkconnection', async (req, res) => {
  try {
    const { Restaurant } = req.app.locals.dbs;
    
    if (!Restaurant) {
      return res.status(500).json({ success: false, message: 'Restaurant model not available' });
    }
    
    // Try to get any restaurant (first one)
    const anyRestaurant = await Restaurant.findOne().limit(1);
    
    if (!anyRestaurant) {
      return res.status(404).json({ success: false, message: 'No restaurants found in database' });
    }
    
    return res.json({ 
      success: true, 
      message: 'Database connection working',
      sample: {
        id: anyRestaurant._id,
        name: anyRestaurant.name
      }
    });
  } catch (error) {
    console.error('Connection check error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});






// Protected routes with authentication
router.get('/profile', protect, getDriverProfile);
router.put('/profile', protect, updateDriverProfile);

// Additional CRUD routes
router.post('/', protect, createDriver);
router.get('/', protect, getAllDrivers);
router.get('/:id', protect, getDriverById);
router.put('/:id', protect, updateDriver);
router.delete('/:id', protect, deleteDriver);

export default router;