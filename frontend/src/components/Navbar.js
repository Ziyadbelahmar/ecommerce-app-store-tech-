import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { 
  FiShoppingCart, 
  FiUser, 
  FiLogOut, 
  FiPackage,
  FiSettings,
  FiHeart
} from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Détecter le scroll pour changer le style de la navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setShowUserMenu(false);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Vérifier si on est sur la homepage
  const isHomePage = location.pathname === "/";

  return (
    <nav style={{
      ...styles.navbar,
      backgroundColor: (isHomePage && !scrolled) ? "transparent" : "#0a0a0a",
      borderBottom: (isHomePage && !scrolled) ? "1px solid rgba(26, 26, 26, 0.3)" : "1px solid #1a1a1a"
    }}>
      <div style={styles.container}>
        {/* Logo Z-tech */}
        <Link to="/" style={styles.logo}>
          <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.logoSvg}>
            <rect x="15" y="15" width="30" height="30" stroke="#c4ff0d" strokeWidth="2.5" fill="none" opacity="0.4"/>
            <rect x="20" y="20" width="20" height="20" fill="#c4ff0d" opacity="0.3"/>
            <line x1="5" y1="20" x2="15" y2="20" stroke="#c4ff0d" strokeWidth="2.5" opacity="0.4"/>
            <line x1="5" y1="30" x2="15" y2="30" stroke="#c4ff0d" strokeWidth="2.5" opacity="0.4"/>
            <line x1="5" y1="40" x2="15" y2="40" stroke="#c4ff0d" strokeWidth="2.5" opacity="0.4"/>
            <line x1="45" y1="20" x2="55" y2="20" stroke="#c4ff0d" strokeWidth="2.5" opacity="0.4"/>
            <line x1="45" y1="30" x2="55" y2="30" stroke="#c4ff0d" strokeWidth="2.5" opacity="0.4"/>
            <line x1="45" y1="40" x2="55" y2="40" stroke="#c4ff0d" strokeWidth="2.5" opacity="0.4"/>
            <line x1="20" y1="5" x2="20" y2="15" stroke="#c4ff0d" strokeWidth="2.5" opacity="0.4"/>
            <line x1="30" y1="5" x2="30" y2="15" stroke="#c4ff0d" strokeWidth="2.5" opacity="0.4"/>
            <line x1="40" y1="5" x2="40" y2="15" stroke="#c4ff0d" strokeWidth="2.5" opacity="0.4"/>
            <line x1="20" y1="45" x2="20" y2="55" stroke="#c4ff0d" strokeWidth="2.5" opacity="0.4"/>
            <line x1="30" y1="45" x2="30" y2="55" stroke="#c4ff0d" strokeWidth="2.5" opacity="0.4"/>
            <line x1="40" y1="45" x2="40" y2="55" stroke="#c4ff0d" strokeWidth="2.5" opacity="0.4"/>
          </svg>
          <span style={styles.logoText}>
            <span style={styles.logoZ}>Z</span>
            <span style={styles.logoTech}>-tech</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={styles.navLinks}>
          <Link to="/" style={styles.navLink}>
            Home
          </Link>
          <Link to="/products" style={styles.navLink}>
            Products
          </Link>
          <Link to="/about" style={styles.navLink}>
            About
          </Link>
        </div>

        {/* Right Actions */}
        <div style={styles.rightActions}>
          {/* Cart Button */}
          <Link to="/cart" style={styles.cartBtn}>
            <FiShoppingCart style={{ fontSize: "20px" }} />
            {totalItems > 0 && (
              <span style={styles.cartBadge}>{totalItems}</span>
            )}
          </Link>

          {/* User Menu */}
          {user ? (
            <div 
              style={styles.userContainer}
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <button 
                onClick={() => {
                  if (showUserMenu) {
                    navigate("/profile");
                  } else {
                    setShowUserMenu(true);
                  }
                }}
                style={styles.userButton}
              >
                <FiUser style={{ fontSize: "18px" }} />
                <span style={styles.userName}>{user.name}</span>
                {user.role === "admin" && (
                  <span style={styles.adminBadge}>Admin</span>
                )}
              </button>

              {showUserMenu && (
                <div style={styles.userDropdown}>
                  <div style={styles.userMenuHeader}>
                    <div style={styles.userMenuAvatar}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={styles.userMenuName}>{user.name}</div>
                      <div style={styles.userMenuEmail}>{user.email}</div>
                    </div>
                  </div>
                  
                  <div style={styles.divider}></div>
                  
                  <Link 
                    to="/profile" 
                    style={styles.userMenuItem}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FiUser />
                    <span>My Profile</span>
                  </Link>
                  
                  <Link 
                    to="/my-orders" 
                    style={styles.userMenuItem}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FiPackage />
                    <span>My Orders</span>
                  </Link>

                  <Link 
                    to="/wishlist" 
                    style={styles.userMenuItem}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <FiHeart />
                    <span>My Wishlist</span>
                  </Link>
                  
                  {user.role === "admin" && (
                    <Link 
                      to="/admin" 
                      style={styles.userMenuItem}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FiSettings />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  
                  <div style={styles.divider}></div>
                  
                  <button 
                    onClick={handleLogout} 
                    style={styles.logoutMenuItem}
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={styles.loginBtn}>
              <FiUser style={{ marginRight: "8px" }} />
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// ==================== STYLES ====================
const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    padding: "16px 0",
    zIndex: 1000,
    transition: "all 0.3s ease"
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // ========== LOGO Z-TECH ==========
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
    fontSize: "24px",
    fontWeight: "800",
    color: "#fff",
    transition: "all 0.3s ease"
  },
  logoSvg: {
    transition: "all 0.3s ease",
    filter: "drop-shadow(0 0 10px rgba(196, 255, 13, 0.3))"
  },
  logoText: {
    display: "flex",
    alignItems: "center",
    fontSize: "24px",
    fontWeight: "800",
    letterSpacing: "-0.5px"
  },
  logoZ: {
    color: "#c4ff0d",
    fontSize: "28px",
    fontWeight: "900",
    filter: "drop-shadow(0 0 10px rgba(196, 255, 13, 0.5))"
  },
  logoTech: {
    color: "#fff",
    fontSize: "24px",
    fontWeight: "700"
  },

  // ========== NAV LINKS ==========
  navLinks: {
    display: "flex",
    gap: "32px",
    alignItems: "center",
  },
  navLink: {
    color: "#999",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
    transition: "color 0.2s",
  },

  // ========== RIGHT ACTIONS ==========
  rightActions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  // ========== CART ==========
  cartBtn: {
    position: "relative",
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "rgba(26, 26, 26, 0.8)",
    border: "1px solid rgba(45, 45, 45, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    textDecoration: "none",
    color: "#fff",
    transition: "all 0.2s",
  },
  cartBadge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    backgroundColor: "#c4ff0d",
    color: "#000",
    fontSize: "11px",
    fontWeight: "700",
    padding: "2px 6px",
    borderRadius: "10px",
    minWidth: "18px",
    textAlign: "center",
  },

  // ========== USER MENU ==========
  userContainer: {
    position: "relative",
  },
  userButton: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    backgroundColor: "rgba(26, 26, 26, 0.8)",
    border: "1px solid rgba(45, 45, 45, 0.8)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  userName: {
    maxWidth: "120px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  adminBadge: {
    padding: "4px 8px",
    backgroundColor: "#c4ff0d20",
    border: "1px solid #c4ff0d",
    borderRadius: "6px",
    color: "#c4ff0d",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  // ========== DROPDOWN ==========
  userDropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    minWidth: "280px",
    backgroundColor: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: "12px",
    padding: "8px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
    zIndex: 100,
  },

  userMenuHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    marginBottom: "8px",
  },
  userMenuAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#c4ff0d",
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "700",
    flexShrink: 0,
  },
  userMenuName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "2px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  userMenuEmail: {
    fontSize: "12px",
    color: "#666",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  userMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
    transition: "all 0.2s",
    cursor: "pointer",
    backgroundColor: "transparent",
    border: "none",
    width: "100%",
    textAlign: "left",
  },
  logoutMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "8px",
    color: "#ff4444",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
    transition: "all 0.2s",
    cursor: "pointer",
    backgroundColor: "transparent",
    border: "none",
    width: "100%",
    textAlign: "left",
  },

  divider: {
    height: "1px",
    backgroundColor: "#1a1a1a",
    margin: "8px 0",
  },

  loginBtn: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#c4ff0d",
    color: "#000",
    border: "none",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    textDecoration: "none",
    transition: "all 0.2s",
  },
};
