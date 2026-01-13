const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: String,
    country: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    default: "Cash on Delivery"
  },
  subtotal: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["processing", "confirmed", "shipping", "delivered", "cancelled"],
    default: "processing"
  },
  orderStatus: {
    type: String,
    enum: ["processing", "confirmed", "shipped", "delivered", "cancelled"],
    default: "processing"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: Date,
  deliveredAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);
