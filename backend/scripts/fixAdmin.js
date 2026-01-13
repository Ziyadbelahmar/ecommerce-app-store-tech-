const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ecommerce")
.then(async () => {
  console.log("✅ MongoDB Connected\n");
  
  try {
    const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));
    
    // Mettre à jour l'admin
    const result = await User.updateOne(
      { email: "admin@protech.com" },
      { $set: { isAdmin: true } }
    );
    
    console.log("✅ Admin updated!");
    console.log(`📧 Email: admin@protech.com`);
    console.log(`👑 isAdmin: true\n`);
    
    // Vérifier
    const admin = await User.findOne({ email: "admin@protech.com" });
    console.log("✅ Verification:");
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   isAdmin: ${admin.isAdmin}\n`);
    
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
