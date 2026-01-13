const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "protech_secret_key_2026_super_secure";

// Middleware pour vérifier que l'utilisateur est connecté
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Récupérer le token depuis le header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Not authorized, no token" });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ajouter l'utilisateur à la requête
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ error: "Not authorized, token failed" });
  }
};

// Middleware pour vérifier que l'utilisateur est admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }
};
