// backend/models/Restaurant.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const restaurantSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: { type: String, required: true },
  contact: String,
  description: String,
  address: String,
  country: String,
  state: String,
  city: String,
  image: [String],
  menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  rating: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  deliveryFee: { type: Number, default: 0 },
  status: { type: String, default: 'pending' },
  isAvailable: { type: Boolean, default: true },
  openingTime: { type: String, default: '09:00' },
  closingTime: { type: String, default: '22:00' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto-hash password before saving
restaurantSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Helper to compare password
restaurantSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = (restaurantDB) => {
  return restaurantDB.models.Restaurant || restaurantDB.model('Restaurant', restaurantSchema);
};
