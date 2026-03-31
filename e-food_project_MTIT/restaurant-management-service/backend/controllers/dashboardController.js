const mongoose = require('mongoose');

exports.getStats = async (req, res) => {
  const { restaurantDB } = req.app.locals.dbs;
  const MenuItem = require('../models/MenuItem')(restaurantDB);
  const Order = require('../models/Order')(restaurantDB); // Assuming you have an Order model
  const Customer = require('../models/Customer')(restaurantDB); // Assuming you have a Customer model

  try {
    const restaurantId = req.query.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await Order.countDocuments({
      restaurantId,
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const totalRevenueResult = await Order.aggregate([
      { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId), status: 'completed' } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const pendingOrders = await Order.countDocuments({ restaurantId, status: 'pending' });
    const completedOrders = await Order.countDocuments({ restaurantId, status: 'completed' });
    const cancelledOrders = await Order.countDocuments({ restaurantId, status: 'cancelled' });

    const menuCount = await MenuItem.countDocuments({ restaurantId });

    const customerCount = await Customer.countDocuments({ restaurantId });

    // Revenue for last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);

      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);

      const dayRevenue = await Order.aggregate([
        {
          $match: {
            restaurantId: new mongoose.Types.ObjectId(restaurantId),
            status: 'completed',
            createdAt: { $gte: day, $lt: nextDay }
          }
        },
        {
          $group: { _id: null, total: { $sum: "$totalAmount" } }
        }
      ]);

      last7Days.push({
        date: day.toISOString().split('T')[0], // YYYY-MM-DD
        amount: dayRevenue[0]?.total || 0
      });
    }

    res.json({
      stats: {
        todayOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        menuCount,
        customerCount
      },
      revenueByDay: last7Days
    });

  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
