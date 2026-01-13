const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Clé secrète JWT
const JWT_SECRET = "protech_secret_key_2026_super_secure";
const JWT_EXPIRE = "7d";

// Générer token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// ==========================================
// POST /api/auth/register - INSCRIPTION
// ==========================================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("📝 Register attempt:", { name, email });

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Email already exists:", email);
      return res.status(400).json({ error: "Email already registered" });
    }

    // Créer l'utilisateur
    const user = new User({
      name: name || email.split("@")[0],
      email,
      password
    });

    await user.save();
    console.log("✅ User created:", user._id);

    // Générer token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin || user.role === "admin",  // ⬅️ AJOUTÉ
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// POST /api/auth/login - CONNEXION
// ==========================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔑 Login attempt:", email);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log("❌ Invalid password for:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // ⬇️ DÉTERMINER SI ADMIN
    const isAdmin = user.isAdmin || user.role === "admin";

    console.log("✅ Login successful:", user._id);
    console.log("👑 isAdmin:", isAdmin);
    console.log("🎭 role:", user.role);

    // Générer token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: isAdmin,  // ⬅️ UTILISER LA VALEUR CALCULÉE
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// GET /api/auth/me - UTILISATEUR CONNECTÉ
// ==========================================
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ⬇️ AJOUTER isAdmin
    const userData = user.toObject();
    userData.isAdmin = user.isAdmin || user.role === "admin";

    res.json({
      success: true,
      user: userData
    });

  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
