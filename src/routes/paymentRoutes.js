/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Zarinpal Payment Gateway Integration
 */

const express = require("express");
const axios = require("axios");
const auth = require("../middlewares/auth");
const router = express.Router();

const ZARINPAL_MERCHANT_ID = "00000000-0000-0000-0000-000000000000";
const CALLBACK_URL = "http://localhost:5000/api/payment/verify";

/**
 * @swagger
 * /payment/pay:
 *   post:
 *     summary: Create a payment link
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 10000
 *                 description: The amount to be paid (in Rial)
 *               description:
 *                 type: string
 *                 example: Payment for order #12345
 *     responses:
 *       200:
 *         description: Payment URL successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payment_url:
 *                   type: string
 *                   example: https://sandbox.zarinpal.com/pg/StartPay/0000000000
 *       400:
 *         description: Error in payment request
 *       500:
 *         description: Server error
 */
router.post("/pay", auth, async (req, res) => {
  const { amount, description } = req.body;

  try {
    const response = await axios.post(
      "https://sandbox.zarinpal.com/pg/v4/payment/request.json",
      {
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount,
        description,
        callback_url: CALLBACK_URL,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { authority, code } = response.data.data;

    if (code === 100) {
      res.status(200).json({
        payment_url: `https://sandbox.zarinpal.com/pg/StartPay/${authority}`,
      });
    } else {
      res.status(400).json({ message: "Error in payment request" });
    }
  } catch (err) {
    console.error("Payment Request Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Server error", error: err.response?.data });
  }
});

/**
 * @swagger
 * /payment/verify:
 *   get:
 *     summary: Verify a payment after redirect
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: Authority
 *         required: true
 *         schema:
 *           type: string
 *         description: Authority code returned by Zarinpal
 *       - in: query
 *         name: Status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [OK, NOK]
 *         description: Payment status ("OK" for successful, "NOK" for failed/canceled)
 *     responses:
 *       200:
 *         description: Payment successfully verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment successful
 *                 ref_id:
 *                   type: string
 *                   example: "123456789"
 *       400:
 *         description: Payment failed or canceled
 *       500:
 *         description: Server error
 */
router.get("/verify", auth, async (req, res) => {
  const { Authority, Status } = req.query;

  if (Status !== "OK") {
    return res.status(400).json({ message: "Payment failed or canceled" });
  }

  try {
    const response = await axios.post(
      "https://sandbox.zarinpal.com/pg/v4/payment/verify.json",
      {
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount: 10000, // Replace with actual dynamic amount
        authority: Authority,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { code, ref_id } = response.data.data;

    if (code === 100) {
      res.status(200).json({ message: "Payment successful", ref_id });
    } else {
      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (err) {
    console.error("Verification Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Server error", error: err.response?.data });
  }
});

module.exports = router;
