const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ecommerce")
.then(async () => {
  console.log("✅ MongoDB Connected\n");
  
  try {
    const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));
    
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log("❌ No users found in database!\n");
    } else {
      console.log(`📋 FOUND ${users.length} USERS:\n`);
      
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name || 'No Name'}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   👑 isAdmin: ${user.isAdmin || false}`);
        console.log(`   🎭 role: ${user.role || 'N/A'}`);
        console.log(`   🆔 ID: ${user._id}\n`);
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
