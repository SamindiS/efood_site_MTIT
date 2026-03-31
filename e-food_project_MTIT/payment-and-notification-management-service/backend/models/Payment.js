const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Order",
  },
  stripeSessionId: {
    type: String,
    required: true,
  },
  amountTotal: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  paidAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = (connection) =>
  connection.model("Payment", PaymentSchema);
