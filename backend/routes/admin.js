const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Middleware pour vérifier si admin
const isAdmin = (req, res, next) => {
  // À implémenter avec JWT plus tard
  next();
};

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get orders by user
router.get("/orders/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put("/orders/:orderId/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    order.status = status;
    
    if (status === "delivered") {
      order.deliveredAt = Date.now();
    }
    
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete order
router.delete("/orders/:orderId", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.orderId);
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    const ordersByStatus = {
      processing: await Order.countDocuments({ status: "processing" }),
      shipping: await Order.countDocuments({ status: "shipping" }),
      delivered: await Order.countDocuments({ status: "delivered" }),
      cancelled: await Order.countDocuments({ status: "cancelled" })
    };
    
    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      ordersByStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
