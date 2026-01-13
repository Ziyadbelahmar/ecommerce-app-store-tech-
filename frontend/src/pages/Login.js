import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff,
  FiArrowRight,
  FiZap
} from "react-icons/fi";
import { 
  BsCpu, 
  BsLightning, 
  BsShieldCheck 
} from "react-icons/bs";


export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔄 Attempting login...");
      console.log("📧 Email:", formData.email);

      const res = await axios.post("http://localhost:5001/api/auth/login", formData);
      
      console.log("✅ Login response:", res.data);

      // ⬇️ SAUVEGARDE LE TOKEN ET L'UTILISATEUR
      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("💾 Token saved:", token);
      console.log("💾 User saved:", user);

      // Vérification immédiate
      console.log("🔍 Verification:");
      console.log("Token from storage:", localStorage.getItem("token"));
      console.log("User from storage:", localStorage.getItem("user"));

      // Utilise aussi le context
      login(user);

      // Toast de succès
      const toast = document.createElement('div');
      toast.textContent = `✅ Welcome back, ${user.name || user.email}!`;
      toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #c4ff0d;
        color: #000;
        padding: 16px 24px;
        border-radius: 12px;
        font-weight: 700;
        z-index: 99999;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 8px 24px rgba(196, 255, 13, 0.4);
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);

      // Redirection après un court délai
      setTimeout(() => {
        navigate("/");
      }, 500);

    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("❌ Error response:", error.response?.data);
      
      setError(error.response?.data?.error || error.response?.data?.message || "Login failed. Please check your credentials.");
      setLoading(false);
    }
  };


  return (
    <div style={styles.page}>
      <style>{keyframesCSS}</style>

      {/* LEFT SIDE - Tech Visual */}
      <div style={styles.leftSide}>
        <div style={styles.techOverlay}>
          {/* Floating Icons */}
          <div style={styles.floatingIcons}>
            <BsCpu style={styles.floatingIcon1} />
            <BsLightning style={styles.floatingIcon2} />
            <BsShieldCheck style={styles.floatingIcon3} />
            <FiZap style={styles.floatingIcon4} />
          </div>


          {/* Content */}
          <div style={styles.leftContent}>
            <Link to="/" style={styles.logo}>
              <span style={styles.logoZ}>Z</span>
              <span style={styles.logoTech}>-tech</span>
            </Link>
            
            <h1 style={styles.leftTitle}>
              Welcome Back to the
              <br />
              <span style={styles.leftTitleGradient}>Future of Tech</span>
            </h1>
            
            <p style={styles.leftSubtitle}>
              Access your account and explore the latest innovations in technology
            </p>


            <div style={styles.features}>
              <div style={styles.feature}>
                <BsShieldCheck style={styles.featureIcon} />
                <div>
                  <div style={styles.featureTitle}>Secure Login</div>
                  <div style={styles.featureText}>256-bit encryption</div>
                </div>
              </div>
              <div style={styles.feature}>
                <BsLightning style={styles.featureIcon} />
                <div>
                  <div style={styles.featureTitle}>Fast Access</div>
                  <div style={styles.featureText}>Instant authentication</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* RIGHT SIDE - Login Form */}
      <div style={styles.rightSide}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Sign In</h2>
            <p style={styles.formSubtitle}>Enter your credentials to access your account</p>
          </div>


          {error && (
            <div style={styles.errorAlert}>
              <span style={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <FiMail style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>


            {/* Password Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <FiLock style={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>


            {/* Remember & Forgot */}
            <div style={styles.rememberRow}>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" style={styles.checkbox} />
                <span>Remember me</span>
              </label>
              <a href="#" style={styles.forgotLink}>Forgot password?</a>
            </div>


            {/* Submit Button */}
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight style={{ fontSize: "20px" }} />
                </>
              )}
            </button>
          </form>


          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>OR</span>
            <div style={styles.dividerLine}></div>
          </div>


          {/* Register Link */}
          <div style={styles.registerPrompt}>
            <span style={styles.registerText}>Don't have an account?</span>
            <Link to="/register" style={styles.registerLink}>
              Create Account
              <FiArrowRight style={{ fontSize: "16px" }} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


// ==================== KEYFRAMES ====================
const keyframesCSS = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(5deg);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;


// ==================== STYLES ====================
const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#0a0a0a"
  },


  // ========== LEFT SIDE ==========
  leftSide: {
    flex: 1,
    position: "relative",
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  techOverlay: {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  floatingIcons: {
    position: "absolute",
    inset: 0
  },
  floatingIcon1: {
    position: "absolute",
    top: "15%",
    left: "15%",
    fontSize: "80px",
    color: "#c4ff0d30",
    animation: "float 6s ease-in-out infinite"
  },
  floatingIcon2: {
    position: "absolute",
    top: "20%",
    right: "20%",
    fontSize: "60px",
    color: "#c4ff0d20",
    animation: "float 8s ease-in-out infinite"
  },
  floatingIcon3: {
    position: "absolute",
    bottom: "25%",
    left: "25%",
    fontSize: "70px",
    color: "#c4ff0d25",
    animation: "float 7s ease-in-out infinite"
  },
  floatingIcon4: {
    position: "absolute",
    bottom: "15%",
    right: "15%",
    fontSize: "90px",
    color: "#c4ff0d15",
    animation: "float 5s ease-in-out infinite"
  },
  leftContent: {
    position: "relative",
    zIndex: 1,
    maxWidth: "500px",
    padding: "40px"
  },
  logo: {
    display: "inline-flex",
    alignItems: "baseline",
    gap: "2px",
    textDecoration: "none",
    marginBottom: "40px"
  },
  logoZ: {
    fontSize: "48px",
    fontWeight: "900",
    background: "linear-gradient(135deg, #c4ff0d 0%, #7fff00 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "'Arial Black', sans-serif",
    letterSpacing: "-3px"
  },
  logoTech: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#fff",
    letterSpacing: "-1px"
  },
  leftTitle: {
    fontSize: "42px",
    fontWeight: "700",
    color: "#fff",
    lineHeight: "1.2",
    marginBottom: "20px"
  },
  leftTitleGradient: {
    background: "linear-gradient(135deg, #c4ff0d 0%, #7fff00 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },
  leftSubtitle: {
    fontSize: "16px",
    color: "#999",
    lineHeight: "1.6",
    marginBottom: "40px"
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  feature: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    backgroundColor: "#0f0f0f80",
    borderRadius: "12px",
    border: "1px solid #1a1a1a"
  },
  featureIcon: {
    fontSize: "32px",
    color: "#c4ff0d"
  },
  featureTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "4px"
  },
  featureText: {
    fontSize: "14px",
    color: "#666"
  },


  // ========== RIGHT SIDE ==========
  rightSide: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    backgroundColor: "#0f0f0f"
  },
  formContainer: {
    width: "100%",
    maxWidth: "450px"
  },
  formHeader: {
    marginBottom: "32px"
  },
  formTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "8px"
  },
  formSubtitle: {
    fontSize: "14px",
    color: "#666"
  },


  // ========== ERROR ALERT ==========
  errorAlert: {
    padding: "12px 16px",
    backgroundColor: "#ff444420",
    border: "1px solid #ff4444",
    borderRadius: "8px",
    color: "#ff4444",
    fontSize: "14px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  errorIcon: {
    fontSize: "18px"
  },


  // ========== FORM ==========
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff"
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  inputIcon: {
    position: "absolute",
    left: "16px",
    fontSize: "20px",
    color: "#666"
  },
  input: {
    width: "100%",
    padding: "14px 16px 14px 48px",
    backgroundColor: "#1a1a1a",
    border: "1px solid #2d2d2d",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box"
  },
  eyeButton: {
    position: "absolute",
    right: "16px",
    width: "36px",
    height: "36px",
    borderRadius: "6px",
    backgroundColor: "transparent",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#666",
    fontSize: "20px",
    transition: "all 0.2s"
  },
  rememberRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#999",
    fontSize: "14px",
    cursor: "pointer"
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#c4ff0d"
  },
  forgotLink: {
    color: "#c4ff0d",
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none"
  },
  submitBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "16px",
    backgroundColor: "#c4ff0d",
    border: "none",
    borderRadius: "10px",
    color: "#000",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s",
    marginTop: "8px"
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "32px 0",
    gap: "16px"
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#2d2d2d"
  },
  dividerText: {
    color: "#666",
    fontSize: "13px",
    fontWeight: "600"
  },
  registerPrompt: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "20px",
    backgroundColor: "#1a1a1a",
    borderRadius: "10px",
    border: "1px solid #2d2d2d"
  },
  registerText: {
    color: "#999",
    fontSize: "14px"
  },
  registerLink: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#c4ff0d",
    fontSize: "14px",
    fontWeight: "700",
    textDecoration: "none",
    transition: "all 0.2s"
  }
};
