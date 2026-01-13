const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ecommerce")
.then(async () => {
  console.log("✅ MongoDB Connected\n");
  
  try {
    const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));
    
    // Afficher tous les utilisateurs
    const users = await User.find({});
    
    console.log("📋 LIST OF ALL USERS:\n");
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Admin: ${user.isAdmin ? '✅ YES' : '❌ NO'}`);
      console.log(`   ID: ${user._id}\n`);
    });
    
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
