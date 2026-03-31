// orderRoutes.js
const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');

// Get all orders
router.get('/', OrderController.getAllOrders);

// Create a new order
router.post('/', OrderController.createOrder);

// Update order status
router.patch('/:orderId/status', OrderController.updateOrderStatus);

module.exports = router;

