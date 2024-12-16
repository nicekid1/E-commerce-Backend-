const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const discountCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, default: uuidv4 },
    discountPercentage: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiscountCode", discountCodeSchema);
