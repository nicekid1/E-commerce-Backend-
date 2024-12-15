const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Product = require("./../models/Product");
const auth = require("./../middlewares/auth");

//register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email or password is invalid" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Email or password is invalid" });
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//Add product to favorites
router.post("/favorites/:productId", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const user = await User.findById(req.user.userId);
    if (user.favoriteProducts.includes(product.id))
      return res
        .status(400)
        .json({ message: "Product has already been added." });
    user.favoriteProducts.push(product._id);
    await user.save();
    res.status(200).json({
      message: "Product added to favorites",
      favoriteProducts: user.favoriteProducts,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//Remove product from favorites
router.delete("/favorites/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.favoriteProducts = user.favoriteProducts.filter(
      (id) => id.toString() !== req.params.productId
    );
    await user.save();
    res.status(200).json({
      message: "Product removed from favorites",
      favoriteProducts: user.favoriteProducts,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//retrieve all favorites
router.get('/favorites', auth, async(req,res)=>{
  try {
    const user = await User.findById(req.user.userId).populate('favoriteProducts', 'name');
    res.status(200).json({ favoriteProducts: user.favoriteProducts });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
})

module.exports = router;
