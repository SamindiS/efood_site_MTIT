const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Protect the route if needed with your auth middleware
// const { protect } = require('../middleware/authMiddleware');

router.get('/stats', dashboardController.getStats);

module.exports = router;
