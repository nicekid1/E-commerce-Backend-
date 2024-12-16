/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin routes for managing users, products, reviews, and discount codes
 */

const express = require("express");
const auth = require("./../middlewares/auth");
const checkRole = require("./../middlewares/checkRole");
const User = require("../models/User");
const Product = require("../models/Product");
const Review = require("../models/Review");
const DiscountCode = require("../models/DiscountCode");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");


const router = express.Router();


/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Register a new Admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the new Admin
 *               email:
 *                 type: string
 *                 description: The email of the new Admin
 *               password:
 *                 type: string
 *                 description: The password for the new Admin
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Server error
 */
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    try {
      const existingUser = await User.findOne({$or: [
        { username: username },
        { email: email }
      ]});
      if (existingUser) {
        return res.status(400).json({ message: "Username or email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role: "admin",
      });
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);


/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Authenticate a Admin and return a token
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the admin
 *               password:
 *                 type: string
 *                 description: The admin's password
 *     responses:
 *       200:
 *         description: Login successful, token returned
 *       400:
 *         description: Invalid email or password
 *       404:
 *         description: User not found
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("A valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

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
  }
);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully returned a list of users
 *       404:
 *         description: No users found
 *       500:
 *         description: Server error
 */
router.get("/users", auth, checkRole, async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/users/:id", auth, checkRole, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /admin/products:
 *   get:
 *     summary: Retrieve a list of all products
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully returned a list of products
 *       404:
 *         description: No products found
 *       500:
 *         description: Server error
 */
router.get("/products", auth, checkRole, async (req, res) => {
  try {
    const products = await Product.find({});
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /admin/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to delete
 *     responses:
 *       200:
 *         description: Product successfully deleted
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete("/products/:id", auth, checkRole, async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /admin/comments:
 *   get:
 *     summary: Retrieve a list of all comments
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully returned a list of comments
 *       404:
 *         description: No comments found
 *       500:
 *         description: Server error
 */
router.get("/comments", auth, checkRole, async (req, res) => {
  try {
    const reviews = await Review.find({});
    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /admin/comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment successfully deleted
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.delete("/comments/:id", auth, checkRole, async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /admin/discounts:
 *   post:
 *     summary: Create a new discount code
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discountPercentage:
 *                 type: number
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Discount code created successfully
 *       500:
 *         description: Server error
 */
router.post("/discounts", auth, checkRole, async (req, res) => {
  const { discountPercentage, expiresAt } = req.body;
  try {
    const discount = new DiscountCode({
      discountPercentage,
      expiresAt,
    });
    await discount.save();
    res.status(201).json(discount);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /admin/discounts:
 *   get:
 *     summary: Retrieve all discount codes
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of discount codes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier for the discount code
 *                   code:
 *                     type: string
 *                     description: Discount code string
 *                   discountPercentage:
 *                     type: number
 *                     description: Discount percentage
 *                   expiresAt:
 *                     type: string
 *                     format: date
 *                     description: Expiration date of the discount code
 *       500:
 *         description: Server error
 */
router.get("/discounts", auth, checkRole, async (req, res) => {
  try {
    const discountCodes = await DiscountCode.find({});
    res.status(200).json(discountCodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /admin/discounts/{id}:
 *   delete:
 *     summary: Delete a discount code by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the discount code to delete
 *     responses:
 *       200:
 *         description: Discount code removed successfully
 *       404:
 *         description: Discount code not found
 *       500:
 *         description: Server error
 */
router.delete("/discounts/:id", auth, checkRole, async (req, res) => {
  try {
    const discountCodes = await DiscountCode.findByIdAndDelete(req.params.id);
    if (discountCodes)
      res.status(200).json({ message: "Discount code removed." });
    else res.status(404).json({ message: "Discount code not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
