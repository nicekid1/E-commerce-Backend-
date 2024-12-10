const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const auth = require("../middlewares/auth");
const router = express.Router();

// Place a new order
router.post("/:userId",auth, async (req, res) => {
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

// Get all orders
router.get("/:userId",auth, async (req, res) => {
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
