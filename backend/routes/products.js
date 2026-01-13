const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ==================== GET ALL PRODUCTS ====================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    console.log(`✅ Fetched ${products.length} products from MongoDB`);
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== GET SINGLE PRODUCT ====================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== CREATE PRODUCT (ADMIN) ====================
router.post("/", async (req, res) => {
  try {
    console.log("📝 Creating product:", req.body);
    
    const product = new Product({
      name: req.body.name,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description || "",
      stock: req.body.stock || 0,
      images: req.body.images || []
    });
    
    await product.save();
    
    console.log("✅ Product created in MongoDB:", product._id);
    res.status(201).json(product);
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== UPDATE PRODUCT (ADMIN) ====================
router.put("/:id", async (req, res) => {
  try {
    console.log("📝 Updating product:", req.params.id);
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
        stock: req.body.stock,
        images: req.body.images
      },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    console.log("✅ Product updated in MongoDB:", product._id);
    res.json(product);
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== DELETE PRODUCT (ADMIN) ====================
router.delete("/:id", async (req, res) => {
  try {
    console.log("🗑️ Deleting product:", req.params.id);
    
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    console.log("✅ Product deleted from MongoDB:", product._id);
    res.json({ message: "Product deleted successfully", product });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
