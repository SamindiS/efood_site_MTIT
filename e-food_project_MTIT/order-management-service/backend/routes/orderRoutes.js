const express = require('express');
const router = express.Router();
const {
    createOrder,
    markOrderAsPaid,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    deleteOrder
} = require('../controllers/orderController');

// @route   POST /api/orders
// @desc    Place new order (from cart)
router.post('/', createOrder);

// @route   PUT /api/orders/:orderId/pay
// @desc    Mark order as paid
router.put('/:orderId/pay', markOrderAsPaid);

// @route   GET /api/orders/user/:userId
// @desc    Get all orders of a user
router.get('/user/:userId', getUserOrders);

// @route   GET /api/orders
// @desc    Get all orders (admin)
router.get('/', getAllOrders);

// @route   PUT /api/orders/:orderId/status
// @desc    Update order status (admin)
router.put('/:orderId/status', updateOrderStatus);

// @route   GET /api/orders/restaurant/:restaurantId
// @desc    Get all orders for a specific restaurant
router.get('/restaurant/:restaurantId', require('../controllers/orderController').getRestaurantOrders);

// @route   DELETE /api/orders/:orderId
// @desc    Delete order (admin)
router.delete('/:orderId', deleteOrder);

module.exports = router;