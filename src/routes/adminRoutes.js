const express = require("express");
const auth = require("./../middlewares/auth");
const checkRole = require("./../middlewares/checkRole");
const User = require("../models/User");
const router = express.Router();

// List all users
router.get("/users", auth, checkRole, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/users/:id", auth, checkRole, async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// List all products
router.get("/products", auth, checkRole, async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete product
router.delete("/products/:id", auth, checkRole, async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// List all comments
router.get("/comments", auth, checkRole, async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete comment
router.delete("/comments/:id", auth, checkRole, async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
