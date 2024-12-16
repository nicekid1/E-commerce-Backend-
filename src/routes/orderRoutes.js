/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Manage user orders
 */

const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const auth = require("../middlewares/auth");
const router = express.Router();

/**
 * @swagger
 * /orders/{userId}:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user placing the order
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order placed successfully
 *                 order:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The ID of the created order
 *                     user:
 *                       type: string
 *                       description: User ID
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: string
 *                             description: Product ID
 *                           quantity:
 *                             type: number
 *                             description: Quantity of the product
 *                     totalAmount:
 *                       type: number
 *                       description: Total price for the order
 *                     status:
 *                       type: string
 *                       description: Status of the order
 *       400:
 *         description: Cart is empty or invalid
 *       500:
 *         description: Error placing the order
 */
router.post("/:userId", auth, async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    const totalAmount = items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0
    );

    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      status: "pending",
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ userId });

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error placing order", error: err.message });
  }
});

/**
 * @swagger
 * /orders/{userId}:
 *   get:
 *     summary: Retrieve all orders for a user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved user orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         product:
 *                           type: string
 *                           description: Product ID
 *                         quantity:
 *                           type: number
 *                           description: Quantity of the product
 *                   totalAmount:
 *                     type: number
 *                   status:
 *                     type: string
 *       500:
 *         description: Error retrieving orders
 */
router.get("/:userId", auth, async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.findOne({ user: userId }).populate(
      "items.product"
    );
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving orders" });
  }
});

module.exports = router;
