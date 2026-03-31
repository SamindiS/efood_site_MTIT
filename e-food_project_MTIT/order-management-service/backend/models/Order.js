const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // informational only
    },
    items: [
      {
        restaurantId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Restaurant", // informational only
        },
        menuitemId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "MenuItem", // informational only
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentInfo: {
      stripeSessionId: { type: String },
      status: { type: String },
      paidAt: { type: Date },
    },

    isPaid: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivering", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent OverwriteModelError
module.exports = (orderDB) => {
  return orderDB.models.Order || orderDB.model("Order", OrderSchema);
};
