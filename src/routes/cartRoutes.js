/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Manage the user's shopping cart
 */

const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * /cart/{userId}:
 *   post:
 *     summary: Add a product to the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to add
 *               quantity:
 *                 type: number
 *                 description: The quantity of the product to add
 *     responses:
 *       200:
 *         description: Product successfully added to cart
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error adding product to cart
 */
router.post("/:userId", auth, async (req, res) => {
  const { productId, quantity } = req.body;
  const { userId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const cart = await Cart.findOne({ userId });
    if (cart) {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );
      if (existingItem) existingItem.quantity += quantity;
      else cart.items.push({ product: productId, quantity });
      await cart.save();
    } else {
      const newCart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
      });
      await newCart.save();
    }
    res.status(200).json({ message: "Product added to cart" });
  } catch (err) {
    res.status(500).json({ message: "Error adding product to cart" });
  }
});

/**
 * @swagger
 * /cart/{userId}:
 *   get:
 *     summary: Retrieve the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose cart to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's cart
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Error retrieving cart
 */
router.get("/:userId", auth, async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving cart" });
  }
});

module.exports = router;
