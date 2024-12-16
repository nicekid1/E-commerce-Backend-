const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const productRoutes = require("./src/routes/productRoutes");
const userRoutes = require("./src/routes/userRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const setupSwagger = require("./swagger");

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

//Swagger Setting
setupSwagger(app);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
mongoose.connection.once("open", () => {
  console.log("Database Name:", mongoose.connection.db.databaseName);
});

// Simple route to test the server
app.get("/", (req, res) => {
  res.send("Welcome to E-commerce APIs");
});

//Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/admin", adminRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/categories", categoryRoutes);
app.use("/reviews", reviewRoutes);
app.use("/payment", paymentRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
