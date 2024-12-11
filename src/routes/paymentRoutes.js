const express = require("express");
const axios = require("axios");
const auth = require("../middlewares/auth");
const router = express.Router();

const ZARINPAL_MERCHANT_ID = "00000000-0000-0000-0000-000000000000";
const CALLBACK_URL = "http://localhost:5000/api/payment/verify";

// Create a payment link
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
      console.log(authority)
    } else {
      res.status(400).json({ message: "Error in payment request" });
    }
  } catch (err) {
    console.error("Payment Request Error:", err.response?.data || err.message);
    res.status(500).json({ message: "Server error", error: err.response?.data });
  }
});

// Payment verification
router.get("/verify", auth, async (req, res) => {
  const { Authority, Status } = req.query;
  console.log("Authority:", Authority, "Status:", Status);

  if (Status !== "OK") {
    return res.status(400).json({ message: "Payment failed or canceled" });
  }

  try {
    const response = await axios.post(
      "https://sandbox.zarinpal.com/pg/v4/payment/verify.json",
      {
        merchant_id: ZARINPAL_MERCHANT_ID,
        amount: 10000, // مقدار واقعی را از دیتابیس بگیرید
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
