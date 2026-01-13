import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/AdminDashboard"; // ⬅️ AJOUTER

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/wishlist" element={<Wishlist />} />
              
              {/* ADMIN DASHBOARD - REMPLACER LA ROUTE */}
              <Route path="/admin" element={<AdminDashboard />} />
              
              {/* Routes additionnelles */}
              <Route path="/products" element={<Home />} />
              <Route path="/deals" element={<ComingSoon page="Deals" />} />
              <Route path="/about" element={<ComingSoon page="About" />} />
            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

// Composant temporaire pour les pages en développement
function ComingSoon({ page }) {
  return (
    <div style={styles.comingSoon}>
      <div style={styles.comingSoonContent}>
        <h1 style={styles.comingSoonTitle}>🚀 {page}</h1>
        <p style={styles.comingSoonText}>This page is coming soon!</p>
        <a href="/" style={styles.comingSoonLink}>← Back to Home</a>
      </div>
    </div>
  );
}

const styles = {
  comingSoon: {
    minHeight: "100vh",
    backgroundColor: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "100px 20px 20px"
  },
  comingSoonContent: {
    textAlign: "center"
  },
  comingSoonTitle: {
    fontSize: "48px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "20px"
  },
  comingSoonText: {
    fontSize: "20px",
    color: "#666",
    marginBottom: "40px"
  },
  comingSoonLink: {
    display: "inline-block",
    padding: "16px 40px",
    backgroundColor: "#c4ff0d",
    color: "#000",
    textDecoration: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    transition: "all 0.3s"
  }
};

export default App;
