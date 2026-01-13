const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// Get user wishlist
router.get("/:userId", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.params.userId })
      .populate("products");
    
    if (!wishlist) {
      return res.json([]);
    }
    
    res.json(wishlist.products);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: error.message });
  }
});

// Add to wishlist
router.post("/add", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    
    let wishlist = await Wishlist.findOne({ user: userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else {
      if (wishlist.products.includes(productId)) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }
      wishlist.products.push(productId);
    }
    
    await wishlist.save();
    res.json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from wishlist
router.delete("/remove/:userId/:productId", async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.params.userId });
    
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        id => id.toString() !== req.params.productId
      );
      await wishlist.save();
    }
    
    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
