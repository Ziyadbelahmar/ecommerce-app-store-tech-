const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User"); // ⬅️ AJOUTÉ
const transporter = require("../config/emailConfig");
const { orderConfirmationEmail } = require("../utils/emailTemplates");

// Create new order with email
router.post("/", async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod, subtotal, shipping, tax, total } = req.body;
    
    // Validation
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Vérifier et réduire le stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Only ${product.stock} left.` 
        });
      }

      // Réduire le stock
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Créer la commande
    const order = new Order({
      user: userId,
      orderNumber,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      shippingCost: shipping,
      tax,
      total,
      totalAmount: total,
      status: "processing",
      orderStatus: "processing",
      paymentStatus: paymentMethod === "Cash on Delivery" ? "pending" : "paid",
      isPaid: paymentMethod !== "Cash on Delivery"
    });
    
    await order.save();

    // Récupérer l'utilisateur pour l'email
    const user = await User.findById(userId).select('name email');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ ENVOYER L'EMAIL
    try {
      const emailHTML = orderConfirmationEmail(order, user);

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `✅ Order Confirmed - #${orderNumber}`,
        html: emailHTML
      });

      console.log(`✅ Confirmation email sent to ${user.email}`);
    } catch (emailError) {
      console.error('❌ Email error:', emailError.message);
      // Continue même si l'email échoue
    }

    res.json({ 
      message: "Order created successfully! Check your email for confirmation.", 
      order: {
        ...order.toObject(),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("user", "name email")
      .populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel order
router.put("/:orderId/cancel", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      return res.status(400).json({ message: 'Cannot cancel shipped/delivered orders' });
    }

    // Restaurer le stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    order.orderStatus = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
