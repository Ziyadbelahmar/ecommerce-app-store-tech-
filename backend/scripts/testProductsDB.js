const mongoose = require("mongoose");
const Product = require("../models/Product");

mongoose.connect("mongodb://localhost:27017/ecommerce")
.then(async () => {
  console.log("✅ MongoDB Connected\n");
  
  try {
    // Compter les produits
    const count = await Product.countDocuments();
    console.log(`📦 Total products in database: ${count}\n`);
    
    // Afficher tous les produits
    const products = await Product.find({});
    
    if (products.length === 0) {
      console.log("❌ No products found in database!\n");
    } else {
      console.log("📋 PRODUCTS IN DATABASE:\n");
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Brand: ${product.brand}`);
        console.log(`   Price: $${product.price}`);
        console.log(`   Stock: ${product.stock}`);
        console.log(`   ID: ${product._id}\n`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
})
.catch((err) => {
  console.error("❌ MongoDB Connection Error:", err);
  process.exit(1);
});
