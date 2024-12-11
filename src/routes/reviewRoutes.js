
const express = require("express");
const mongoose = require("mongoose"); 
const Review = require("../models/Review");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/:productId", auth, async (req, res) => {
  const { comment, rating } = req.body;
  const { productId } = req.params;
  const userId = req.user.userId;
  console.log(userId)

  try {
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const review = new Review({
      user: userId,
      product: productId,
      comment,
      rating,
    });
    await review.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
});

module.exports = router;