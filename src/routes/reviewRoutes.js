const express = require("express");
const { body, param, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const auth = require("../middlewares/auth");
const Review = require("../models/Review"); 

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
router.post(
  "/:productId",
  auth,
  [
    param("productId")
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage("Invalid product ID"),

    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be a number between 1 and 5"),

    body("comment")
      .trim()
      .notEmpty()
      .withMessage("Comment cannot be empty")
      .isLength({ min: 5 })
      .withMessage("Comment must be at least 5 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { comment, rating } = req.body;
    const { productId } = req.params;
    const userId = req.user.userId;

    try {
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
  }
);

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
router.get(
  "/:productId",
  auth,
  [
    param("productId")
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage("Invalid product ID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId } = req.params;
    try {
      const comments = await Review.find({ product: productId }).populate(
        "user",
        "username"
      );
      res.status(200).json(comments);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error retrieving comments", error: err.message });
    }
  }
);

module.exports = router;
