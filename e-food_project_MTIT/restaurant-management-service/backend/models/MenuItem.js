const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({

    restaurantId: {  required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  
    // Basic info
    name: { type: String, required: true },
    description: String,
    image: [String],
    category: String,
  
    // Pricing
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // in percentage
    // finalPrice: Number, // optionally store the discounted price
    isAvailable: { type: Boolean, default: true },
  
    // Ordering options
    sizes: [{
      size: String,       // e.g., Small, Medium, Large
      price: Number
    }],
    addOns: [{
      name: String,       // e.g., Extra Cheese
      price: Number
    }],
  
    // Tags and filters
    tags: [String],       // e.g., ['spicy', 'vegan', 'gluten-free']
    ingredients: [String],
    prepTime: Number,     // in minutes
  
    // Stock control (optional for restaurants that manage inventory)
    stock: Number,
    lowStockThreshold: Number,
  
    // Audit
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
    // Localization (optional for multilingual platforms)
    translations: mongoose.Schema.Types.Mixed,
  
  }, { timestamps: true });

  // module.exports = mongoose.model('MenuItem', menuItemSchema);

  // Prevent OverwriteModelError
module.exports = (restaurantDB) => {
  return restaurantDB.models.MenuItems || restaurantDB.model('MenuItems', menuItemSchema);
};