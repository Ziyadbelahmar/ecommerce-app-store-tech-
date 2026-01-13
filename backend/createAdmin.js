const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://localhost:27017/ecommerce_db")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ Error:", err));

const createAdmin = async () => {
  try {
    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: "admin@protech.com" });
    
    if (existingAdmin) {
      console.log("⚠️  Admin already exists!");
      process.exit();
    }

    // Créer l'admin
    const admin = new User({
      name: "Admin Protech",
      email: "admin@protech.com",
      password: "admin123",
      role: "admin"
    });

    await admin.save();
    
    console.log("✅ Admin created successfully!");
    console.log("📧 Email: admin@protech.com");
    console.log("🔑 Password: admin123");
    
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createAdmin();
