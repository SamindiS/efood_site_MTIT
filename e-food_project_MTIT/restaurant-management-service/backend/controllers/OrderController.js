// // OrderController.js
// const Order = require('../models/Order');

// // GET all orders with populated restaurant and menu item details
// exports.getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate('restaurantId', 'name email')
//       .populate('items.menuItemId', 'name price');
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching orders', error });
//   }
// };


// // CREATE new order
// exports.createOrder = async (req, res) => {
//   try {
//     const newOrder = new Order(req.body);
//     const saved = await newOrder.save();
//     res.status(201).json(saved);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating order', error });
//   }
// };


// // PATCH update order status
// exports.updateOrderStatus = async (req, res) => {
//   const { orderId } = req.params;
//   const { status } = req.body;

//   if (!['confirmed', 'cancelled'].includes(status)) {
//     return res.status(400).json({ message: 'Invalid status update' });
//   }

//   try {
//     const order = await Order.findByIdAndUpdate(
//       orderId,
//       { status },
//       { new: true }
//     );

//     if (!order) return res.status(404).json({ message: 'Order not found' });

//     res.status(200).json({ message: 'Order status updated', order });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating status', error });
//   }
// };



