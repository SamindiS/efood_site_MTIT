// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   restaurantId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Restaurant',
//     required: true,
//   },
//   items: [
//     {
//       menuItemId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'MenuItem',
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         min: 1,
//       },
//       price: {
//         type: Number,
//         required: true,
//       }
//     }
//   ],
//   customer: {
//     name: String,
//     phone: String,
//     email: String,
//     address: String
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
//     default: 'pending',
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['cash_on_delivery', 'card', 'online'],
//     default: 'cash_on_delivery'
//   },
//   totalAmount: {
//     type: Number,
//     required: true
//   },
//   isPaid: {
//     type: Boolean,
//     default: false
//   },
//   paidAt: Date,
//   deliveryTimeEstimate: Number, // in minutes
// }, { timestamps: true });

// module.exports = mongoose.model('Order', orderSchema);
