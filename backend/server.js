const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const wishlistRoutes = require("./routes/wishlist");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce")
.then(() => {
  console.log("✅ MongoDB Connected");
  console.log("📦 Database: ecommerce");
})
.catch((err) => console.error("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
