const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a restaurant
exports.register = async (req, res) => {
  const { restaurantDB } = req.app.locals.dbs;
  const Restaurant = require('../models/Restaurant')(restaurantDB);

  try {
    const uploadedImages = req.files ? req.files.map(file => `/uploads/restaurants/${file.filename}`) : [];
    const fields = { ...req.body, image: uploadedImages };

    // Model hook handles password hashing automatically
    const restaurant = new Restaurant(fields);
    await restaurant.save();
    res.status(201).json(restaurant);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { restaurantDB } = req.app.locals.dbs;
  const Restaurant = require('../models/Restaurant')(restaurantDB);
  try {
    const { email, password } = req.body;
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) return res.status(400).json({ error: 'Not Found!' });

    const isMatch = await restaurant.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid Credentials!' });

    const token = jwt.sign(
      { id: restaurant._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.json({ token, restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleAvailability = async (req, res) => {
  const { restaurantDB } = req.app.locals.dbs;
  const Restaurant = require('../models/Restaurant')(restaurantDB);
  try {
    const { isAvailable } = req.body;
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true }
    );
    res.status(200).json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update availability' });
  }
};

// Get restaurant by ID
exports.getOne = async (req, res) => {
  const { restaurantDB } = req.app.locals.dbs;
  const Restaurant = require('../models/Restaurant')(restaurantDB);
  const restaurant = await Restaurant.findById(req.params.id);
  res.json(restaurant);
};

// Get all restaurants
exports.getAll = async (req, res) => {
  const { restaurantDB } = req.app.locals.dbs;
  const Restaurant = require('../models/Restaurant')(restaurantDB);
  const restaurants = await Restaurant.find();
  res.json(restaurants);
};

// Create new restaurant
exports.create = async (req, res) => {
  const { restaurantDB } = req.app.locals.dbs;
  const Restaurant = require('../models/Restaurant')(restaurantDB);
  // Model hook handles password hashing automatically
  const restaurant = new Restaurant(req.body);
  await restaurant.save();
  res.status(201).json(restaurant);
};

// Update restaurant (Supports both Admin via ID and Self via Token)
exports.update = async (req, res) => {
  const { restaurantDB } = req.app.locals.dbs;
  const Restaurant = require('../models/Restaurant')(restaurantDB);
  try {
    let restaurantId = req.params.id;

    if (!restaurantId) {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'No authorization provided' });
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      restaurantId = decoded.id;
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    // Update fields from body
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) restaurant[key] = req.body[key];
    });

    if (req.files && req.files.length > 0) {
      restaurant.image = req.files.map(file => `/uploads/restaurants/${file.filename}`);
    }

    await restaurant.save();
    res.status(200).json({ message: 'Restaurant updated successfully', restaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
};

// Delete restaurant
exports.remove = async (req, res) => {
  const { restaurantDB } = req.app.locals.dbs;
  const Restaurant = require('../models/Restaurant')(restaurantDB);
  await Restaurant.findByIdAndDelete(req.params.id);
  res.json({ message: 'Restaurant deleted' });
};

exports.getLoggedRestaurant = async (req, res) => {
  const { restaurantDB } = req.app.locals.dbs;
  const Restaurant = require('../models/Restaurant')(restaurantDB);
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const restaurant = await Restaurant.findById(decoded.id);

    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    res.status(200).json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
