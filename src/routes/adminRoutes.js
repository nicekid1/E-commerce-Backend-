const express = require("express");
const auth = require("./../middlewares/auth");
const checkRole = require("./../middlewares/checkRole");
const User = require("../models/User");
const Product = require("../models/Product");
const Review = require("../models/Review");
const DiscountCode = require("../models/DiscountCode");

const router = express.Router();

// List all users
router.get("/users", auth, checkRole, async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/users/:id", auth, checkRole, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// List all products
router.get("/products", auth, checkRole, async (req, res) => {
  try {
    const products = await Product.find({});
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete product
router.delete("/products/:id", auth, checkRole, async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// List all comments
router.get("/comments", auth, checkRole, async (req, res) => {
  try {
    const reviews = await Review.find({});
    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }
    res.status(200).json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete comment
router.delete("/comments/:id", auth, checkRole, async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create discount code
router.post("/discounts", auth, checkRole, async (req, res) => {
  const { discountPercentage, expiresAt } = req.body;
  try {
    const discount = new DiscountCode({
      code,
      discountPercentage,
      expiresAt,
    });
    discount.save();
    res.status(201).json(discount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// List of discount codes
router.get("/discounts", auth, checkRole, async (req, res) => {
  try {
    const discountCodes = await DiscountCode.find({});
    res.status(200).json(discountCodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove discount code
router.delete("/discounts/:id", auth, checkRole, async (req, res) => {});

module.exports = router;
