// Place new order (from cart)
exports.createOrder = async (req, res) => {
  const { orderDB, restaurantDB } = req.app.locals.dbs;
  const Cart = require('../models/Cart')(orderDB);
  const Order = require('../models/Order')(orderDB);
  const MenuItem = require('../../../restaurant-management-service-neranda/backend/models/MenuItem')(restaurantDB);

  const { userId, shippingInfo } = req.body;
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) continue;

      const itemTotal = item.quantity * menuItem.price;
      totalAmount += itemTotal;

      orderItems.push({
        restaurantId: item.restaurantId,
        menuitemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    const order = await Order.create({
      userId,
      items: orderItems,
      shippingInfo,
      totalAmount,
      isPaid: false,
    });

    // Optionally clear cart after placing order
    await Cart.findOneAndDelete({ userId });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Mark order as paid
exports.markOrderAsPaid = async (req, res) => {
  const { orderDB } = req.app.locals.dbs;
  const Order = require('../models/Order')(orderDB);

  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isPaid = true;
    order.paidAt = new Date();
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders of a user
exports.getUserOrders = async (req, res) => {
  const { orderDB } = req.app.locals.dbs;
  const Order = require('../models/Order')(orderDB);

  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  const { orderDB } = req.app.locals.dbs;
  const Order = require('../models/Order')(orderDB);
  const User = require('../models/User')(orderDB);

  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findById(order.userId).select('name email');
        return {
          ...order.toObject(),
          user,
        };
      })
    );

    res.json(enrichedOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  const { orderDB } = req.app.locals.dbs;
  const Order = require('../models/Order')(orderDB);

  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete order (admin)
exports.deleteOrder = async (req, res) => {
  const { orderDB } = req.app.locals.dbs;
  const Order = require('../models/Order')(orderDB);

  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get orders by restaurantId
exports.getRestaurantOrders = async (req, res) => {
  const { orderDB, restaurantDB } = req.app.locals.dbs;
  const Order = require('../models/Order')(orderDB);
  const User = require('../models/User')(orderDB);
  const MenuItem = require('../../../restaurant-management-service-neranda/backend/models/MenuItem')(restaurantDB);

  try {
    const { restaurantId } = req.params;
    // Find orders where at least one item belongs to this restaurant
    const orders = await Order.find({ "items.restaurantId": restaurantId }).sort({ createdAt: -1 });

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findById(order.userId).select('name email');

        // Populate menu items for each order
        const enrichedItems = await Promise.all(
          order.items.map(async (item) => {
            const menuItem = await MenuItem.findById(item.menuitemId);
            return {
              ...item.toObject(),
              menuItemId: menuItem // ensuring it has the full object for the frontend table
            };
          })
        );

        return {
          ...order.toObject(),
          customer: user || { name: 'Unknown User', email: 'N/A' },
          items: enrichedItems
        };
      })
    );

    res.json(enrichedOrders);
  } catch (err) {
    console.error("Error fetching restaurant orders:", err);
    res.status(500).json({ message: err.message });
  }
};