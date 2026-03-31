const express = require('express');
const router = express.Router();
const {
  addItemToCart,
  getCartItems,
  updateItemQuantity,
  removeItemFromCart
} = require ('../controllers/cartController.js');

// @route   POST /api/cart
// @desc    Add item to cart or update quantity
router.post('/', addItemToCart);

// @route   GET /api/cart/:userId
// @desc    Get cart items
router.get('/:userId', getCartItems);

// @route   PUT /api/cart/:userId
// @desc    Update quantity of a specific item
router.put('/:userId', updateItemQuantity);

// @route   DELETE /api/cart/:userId/:restaurantId/:menuItemId
// @desc    Remove an item from cart
router.delete('/:userId/:restaurantId/:menuItemId', removeItemFromCart);

module.exports = router;
