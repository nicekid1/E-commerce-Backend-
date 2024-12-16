/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management routes for products
 */

const express = require("express");
const mongoose = require("mongoose");
const Review = require("../models/Review");
const auth = require("../middlewares/auth");
const router = express.Router();

/**
 * @swagger
 * /reviews/{productId}:
 *   post:
 *     summary: Add a comment to a product
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *               - rating
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Great product, really satisfied!"
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Invalid input, rating or comment issues
 *       500:
 *         description: Error adding the review
 */
router.post("/:productId", auth, async (req, res) => {
  const { comment, rating } = req.body;
  const { productId } = req.params;
  const userId = req.user.userId;

  try {
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
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
    res
      .status(500)
      .json({ message: "Error adding comment", error: err.message });
  }
});

/**
 * @swagger
 * /reviews/{productId}:
 *   get:
 *     summary: Get reviews for a specific product
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to get reviews for
 *     responses:
 *       200:
 *         description: List of reviews for the product
 *       500:
 *         description: Error retrieving reviews
 */
router.get("/:productId", auth, async (req, res) => {
  const { productId } = req.params;
  try {
    const comments = await Review.find({ product: productId }).populate(
      "user",
      "username"
    );
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving comments", error: err });
  }
});

module.exports = router;
