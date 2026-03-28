const express = require("express");
const router = express.Router();

const Review = require("../models/Review");


// ⭐ Get ALL reviews (MUST BE FIRST)
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ⭐ Add Review
router.post("/reviews", async (req, res) => {
  try {
    const { userId, restaurantId, rating, comment } = req.body;

    const review = new Review({
      userId,
      restaurantId,
      rating,
      comment
    });

    await review.save();

    res.json({
      message: "Review added successfully",
      review
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ⭐ Get Reviews by Restaurant
router.get("/reviews/:restaurantId", async (req, res) => {
  try {
    const reviews = await Review.find({
      restaurantId: req.params.restaurantId
    });

    res.json(reviews);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ⭐ Average Rating
router.get("/reviews/average/:restaurantId", async (req, res) => {
  try {
    const reviews = await Review.find({
      restaurantId: req.params.restaurantId
    });

    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) /
      (reviews.length || 1);

    res.json({
      averageRating: avg.toFixed(1),
      totalReviews: reviews.length
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;