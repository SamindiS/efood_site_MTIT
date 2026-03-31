const express = require("express");
const router = express.Router();

const Coupon = require("../models/Coupon");
const UserPoints = require("../models/UserPoints");


// ✅ Validate Coupon
router.post("/promo/validate", async(req, res) => {
    try {
        const { code } = req.body;

        const coupon = await Coupon.findOne({ code });

        if (!coupon || !coupon.valid) {
            return res.status(400).json({
                message: "Invalid coupon"
            });
        }

        res.json({
            message: "Coupon applied successfully",
            discount: coupon.discount
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ✅ Add Loyalty Points
router.post("/loyalty/points", async(req, res) => {
    try {
        const { userId, points } = req.body;

        let user = await UserPoints.findOne({ userId });

        if (!user) {
            user = new UserPoints({ userId, points });
        } else {
            user.points += points;
        }

        await user.save();

        res.json({
            message: "Points added successfully",
            totalPoints: user.points
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;