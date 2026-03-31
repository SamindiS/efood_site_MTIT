const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['restaurant', 'rider', 'admin'],
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Prevent OverwriteModelError
module.exports = (paymentDB) => {
  return paymentDB.models.Wallet || paymentDB.model('Wallet', WalletSchema);
};
