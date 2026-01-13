import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { 
  FiMail, 
  FiLock, 
  FiUser,
  FiEye, 
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle
} from "react-icons/fi";
import { 
  BsCpu, 
  BsRocket, 
  BsStars 
} from "react-icons/bs";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5001/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      login(res.data.user);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* LEFT SIDE - Tech Visual */}
      <div style={styles.leftSide}>
        <div style={styles.techOverlay}>
          {/* Floating Icons */}
          <div style={styles.floatingIcons}>
            <BsCpu style={styles.floatingIcon1} />
            <BsRocket style={styles.floatingIcon2} />
            <BsStars style={styles.floatingIcon3} />
            <FiCheckCircle style={styles.floatingIcon4} />
          </div>

          {/* Content */}
          <div style={styles.leftContent}>
            <Link to="/" style={styles.logo}>
              <span style={styles.logoZ}>Z</span>
              <span style={styles.logoTech}>-tech</span>
            </Link>
            
            <h1 style={styles.leftTitle}>
              Join the
              <br />
              <span style={styles.leftTitleGradient}>Tech Revolution</span>
            </h1>
            
            <p style={styles.leftSubtitle}>
              Create your account and get access to exclusive tech deals and innovations
            </p>

            <div style={styles.benefits}>
              <div style={styles.benefit}>
                <FiCheckCircle style={styles.benefitIcon} />
                <span style={styles.benefitText}>Exclusive member deals</span>
              </div>
              <div style={styles.benefit}>
                <FiCheckCircle style={styles.benefitIcon} />
                <span style={styles.benefitText}>Priority customer support</span>
              </div>
              <div style={styles.benefit}>
                <FiCheckCircle style={styles.benefitIcon} />
                <span style={styles.benefitText}>Early access to new products</span>
              </div>
              <div style={styles.benefit}>
                <FiCheckCircle style={styles.benefitIcon} />
                <span style={styles.benefitText}>Personalized recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Register Form */}
      <div style={styles.rightSide}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create Account</h2>
            <p style={styles.formSubtitle}>Start your tech journey with Z-tech</p>
          </div>

          {error && (
            <div style={styles.errorAlert}>
              <span style={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Name Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrapper}>
                <FiUser style={styles.inputIcon} />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

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
                  placeholder="Minimum 6 characters"
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

            {/* Confirm Password Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.inputWrapper}>
                <FiLock style={styles.inputIcon} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label style={styles.termsLabel}>
              <input type="checkbox" style={styles.checkbox} required />
              <span style={styles.termsText}>
                I agree to the <a href="#" style={styles.termsLink}>Terms & Conditions</a> and <a href="#" style={styles.termsLink}>Privacy Policy</a>
              </span>
            </label>

            {/* Submit Button */}
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <FiArrowRight style={{ fontSize: "20px" }} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={styles.divider}>
            <span style={styles.dividerText}>OR</span>
          </div>

          {/* Login Link */}
          <div style={styles.loginPrompt}>
            <span style={styles.loginText}>Already have an account?</span>
            <Link to="/login" style={styles.loginLink}>
              Sign In
              <FiArrowRight style={{ fontSize: "16px" }} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== STYLES (SAME AS LOGIN WITH ADDITIONS) ====================
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
  benefits: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  benefit: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  benefitIcon: {
    fontSize: "24px",
    color: "#c4ff0d",
    flexShrink: 0
  },
  benefitText: {
    fontSize: "15px",
    color: "#e0e0e0",
    fontWeight: "500"
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
  termsLabel: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    cursor: "pointer"
  },
  termsText: {
    color: "#999",
    fontSize: "13px",
    lineHeight: "1.5"
  },
  termsLink: {
    color: "#c4ff0d",
    textDecoration: "none",
    fontWeight: "600"
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#c4ff0d",
    marginTop: "2px",
    flexShrink: 0
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
    position: "relative"
  },
  dividerText: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "0 16px",
    backgroundColor: "#0f0f0f",
    color: "#666",
    fontSize: "13px",
    fontWeight: "600"
  },
  loginPrompt: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "20px",
    backgroundColor: "#1a1a1a",
    borderRadius: "10px",
    border: "1px solid #2d2d2d"
  },
  loginText: {
    color: "#999",
    fontSize: "14px"
  },
  loginLink: {
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
