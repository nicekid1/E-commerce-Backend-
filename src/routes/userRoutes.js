/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User authentication and favorite product management
 */

const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Product = require("./../models/Product");
const auth = require("./../middlewares/auth");

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword123"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /users/favorites/{productId}:
 *   post:
 *     summary: Add a product to the user's favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to add to favorites
 *     responses:
 *       200:
 *         description: Product added to favorites
 *       400:
 *         description: Product already in favorites
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /users/favorites/{productId}:
 *   delete:
 *     summary: Remove a product from the user's favorites
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to remove from favorites
 *     responses:
 *       200:
 *         description: Product removed from favorites
 *       404:
 *         description: Product not found in favorites
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /users/favorites:
 *   get:
 *     summary: Retrieve the list of favorite products for the user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite products
 *       500:
 *         description: Server error
 */
router.get('/favorites', auth, async (req,res)=>{
  try {
    const user = await User.findById(req.user.userId).populate('favoriteProducts', 'name');
    res.status(200).json({ favoriteProducts: user.favoriteProducts });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
})

module.exports = router;
