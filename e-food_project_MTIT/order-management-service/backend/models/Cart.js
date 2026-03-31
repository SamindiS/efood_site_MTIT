const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // ref is informational here, not used for population across DBs
        ref: 'User',
    },
    items: [
        {
            restaurantId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Restaurant',
            },
            menuItemId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'MenuItem',
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ],
}, {
    timestamps: true
});

// Prevent OverwriteModelError
module.exports = (orderDB) => {
    return orderDB.models.Cart || orderDB.model('Cart', CartSchema);
};