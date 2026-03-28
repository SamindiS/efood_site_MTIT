const mongoose = require("mongoose");

const userPointsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("UserPoints", userPointsSchema);