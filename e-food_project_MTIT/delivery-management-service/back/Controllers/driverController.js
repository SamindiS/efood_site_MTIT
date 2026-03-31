import Driver from '../models/driverModel.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

//get orders from a different database (sasin)
export const getOrders = async (req, res) => {
  try {
    // Get Order model from the database connections
    const { Order } = req.app.locals.dbs;
    
    if (!Order) {
      return res.status(500).json({
        success: false,
        message: 'Order model not available'
      });
    }
    
    // Fetch all orders from the database
    const orders = await Order.find({});
    
    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:'.red.bold, error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
}

export const getRestaurantAddress = async (req, res) => {
  try {
    // Get Restaurant model from the database connections
    const { Restaurant } = req.app.locals.dbs;
    
    if (!Restaurant) {
      return res.status(500).json({
        success: false,
        message: 'Restaurant model not available'
      });
    }
    
    // Validate if id is a valid ObjectId
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid restaurant ID format'
      });
    }
    
    // Find restaurant by ID and select address-related fields
    const restaurant = await Restaurant.findById(id).select('name address city state country');
    
    // Check if restaurant exists
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }
    
    // Return restaurant address info
    return res.status(200).json({
      success: true,
      data: {
        id: restaurant._id,
        name: restaurant.name,
        address: restaurant.address,
        city: restaurant.city,
        state: restaurant.state,
        country: restaurant.country,
        // Only use the address field if it exists
        fullAddress: restaurant.address || "No address available"
      }
    });
  } catch (error) {
    console.error('Error fetching restaurant address:'.red.bold, error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch restaurant address',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

//delete
// Delete an order from a different database
export const deleteOrder = async (req, res) => {
  try {
    const { Order } = req.app.locals.dbs;
    
    if (!Order) {
      return res.status(500).json({
        success: false,
        message: 'Order model not available'
      });
    }
    
    const orderId = req.params.id;
    
    // Check if the order exists
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Delete the order
    await Order.findByIdAndDelete(orderId);
    
    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:'.red.bold, error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
}




//bellow is my model controllers

// Generate JWT Token
const generateToken = (driver) => {
  return jwt.sign(
    { 
      id: driver._id, 
      email: driver.email 
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: '100d' 
    }
  );
};

// CREATE Driver (POST)
export const createDriver = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phoneNumber,
      licenseNumber,
      vehicleType 
    } = req.body;
    
    // Check if driver already exists
    const existingDriver = await Driver.findOne({ 
      $or: [{ email }, { licenseNumber }] 
    });

    if (existingDriver) {
      return res.status(400).json({ 
        message: 'Driver already exists with this email or license number' 
      });
    }

    // Create new driver
    const driver = await Driver.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      licenseNumber,
      vehicleType
    });

    // Generate token
    const token = generateToken(driver);

    res.status(201).json({
      _id: driver._id,
      firstName: driver.firstName,
      lastName: driver.lastName,
      email: driver.email,
      token
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error creating driver', 
      error: error.message 
    });
  }
};

// GET All Drivers
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select('-password');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching drivers', 
      error: error.message 
    });
  }
};

// GET Single Driver by ID
export const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).select('-password');
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching driver', 
      error: error.message 
    });
  }
};

// UPDATE Driver
export const updateDriver = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      phoneNumber, 
      vehicleType,
      licenseNumber 
    } = req.body;

    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ 
        message: 'Driver not found' 
      });
    }

    // Update fields
    driver.firstName = firstName || driver.firstName;
    driver.lastName = lastName || driver.lastName;
    driver.phoneNumber = phoneNumber || driver.phoneNumber;
    driver.vehicleType = vehicleType || driver.vehicleType;
    driver.licenseNumber = licenseNumber || driver.licenseNumber;

    await driver.save();

    res.json({
      _id: driver._id,
      firstName: driver.firstName,
      lastName: driver.lastName,
      email: driver.email,
      phoneNumber: driver.phoneNumber,
      vehicleType: driver.vehicleType,
      licenseNumber: driver.licenseNumber
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating driver', 
      error: error.message 
    });
  }
};

// DELETE Driver
export const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    
    if (!driver) {
      return res.status(404).json({ 
        message: 'Driver not found' 
      });
    }
    
    res.json({ 
      message: 'Driver deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting driver', 
      error: error.message 
    });
  }
};

// Existing authentication methods
export const registerDriver = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phoneNumber, 
      licenseNumber, 
      vehicleType 
    } = req.body;

    // Check if driver already exists
    const existingDriver = await Driver.findOne({ 
      $or: [{ email }, { licenseNumber }] 
    });

    if (existingDriver) {
      return res.status(400).json({ 
        message: 'Driver already exists with this email or license number' 
      });
    }

    // Create new driver
    const driver = await Driver.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      licenseNumber,
      vehicleType
    });

    // Generate token
    const token = generateToken(driver);

    res.status(201).json({
      _id: driver._id,
      firstName: driver.firstName,
      lastName: driver.lastName,
      email: driver.email,
      token
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error registering driver', 
      error: error.message 
    });
  }
};

export const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find driver
    const driver = await Driver.findOne({ email });

    if (!driver) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await driver.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(driver);

    res.json({
      _id: driver._id,
      firstName: driver.firstName,
      lastName: driver.lastName,
      email: driver.email,
      token
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error logging in', 
      error: error.message 
    });
  }
};

export const getDriverProfile = async (req, res) => {
  try {
    // req.driver is attached by the auth middleware
    const driver = await Driver.findById(req.driver.id).select('-password');

    if (!driver) {
      return res.status(404).json({ 
        message: 'Driver not found' 
      });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching driver profile', 
      error: error.message 
    });
  }
};

export const updateDriverProfile = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      phoneNumber, 
      vehicleType 
    } = req.body;

    const driver = await Driver.findById(req.driver.id);

    if (!driver) {
      return res.status(404).json({ 
        message: 'Driver not found' 
      });
    }

    // Update fields
    driver.firstName = firstName || driver.firstName;
    driver.lastName = lastName || driver.lastName;
    driver.phoneNumber = phoneNumber || driver.phoneNumber;
    driver.vehicleType = vehicleType || driver.vehicleType;

    await driver.save();

    res.json({
      _id: driver._id,
      firstName: driver.firstName,
      lastName: driver.lastName,
      email: driver.email,
      phoneNumber: driver.phoneNumber,
      vehicleType: driver.vehicleType
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating driver profile', 
      error: error.message 
    });
  }
};