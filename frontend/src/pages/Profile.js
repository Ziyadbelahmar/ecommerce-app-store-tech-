import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  FiUser, 
  FiMail, 
  FiShield,
  FiEdit2,
  FiSave,
  FiX,
  FiPackage,
  FiHeart,
  FiSettings,
  FiLogOut,
  FiCalendar
} from "react-icons/fi";

export default function Profile() {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    updateUser({
      ...user,
      name: formData.name,
      email: formData.email
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || ""
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>My Account</h1>
          <p style={styles.subtitle}>Manage your profile and preferences</p>
        </div>

        <div style={styles.grid}>
          {/* Profile Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={styles.cardTitleContainer}>
                <FiUser style={styles.cardIcon} />
                <h2 style={styles.cardTitle}>Profile Information</h2>
              </div>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} style={styles.editBtn}>
                  <FiEdit2 />
                  <span>Edit</span>
                </button>
              ) : (
                <div style={styles.editActions}>
                  <button onClick={handleSave} style={styles.saveBtn}>
                    <FiSave />
                    <span>Save</span>
                  </button>
                  <button onClick={handleCancel} style={styles.cancelBtn}>
                    <FiX />
                  </button>
                </div>
              )}
            </div>

            <div style={styles.cardBody}>
              {/* Avatar */}
              <div style={styles.avatarSection}>
                <div style={styles.avatar}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                {user.role === "admin" && (
                  <span style={styles.adminBadge}>
                    <FiShield style={{ fontSize: "12px" }} />
                    Admin
                  </span>
                )}
              </div>

              {/* Form Fields */}
              <div style={styles.formFields}>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>
                    <FiUser style={styles.fieldIcon} />
                    FULL NAME
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="Enter your name"
                    />
                  ) : (
                    <div style={styles.fieldValue}>{user.name}</div>
                  )}
                </div>

                <div style={styles.field}>
                  <label style={styles.fieldLabel}>
                    <FiMail style={styles.fieldIcon} />
                    EMAIL ADDRESS
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div style={styles.fieldValue}>{user.email}</div>
                  )}
                </div>

                <div style={styles.field}>
                  <label style={styles.fieldLabel}>
                    <FiShield style={styles.fieldIcon} />
                    ACCOUNT TYPE
                  </label>
                  <div style={styles.fieldValue}>
                    {user.role === "admin" ? "Administrator" : "Customer"}
                  </div>
                </div>

                <div style={styles.field}>
                  <label style={styles.fieldLabel}>
                    <FiCalendar style={styles.fieldIcon} />
                    MEMBER SINCE
                  </label>
                  <div style={styles.fieldValue}>
                    {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                      month: 'numeric',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={styles.actionsCard}>
            <h3 style={styles.actionsTitle}>Quick Actions</h3>
            
            <div style={styles.actionsList}>
              <button 
                onClick={() => navigate("/my-orders")} 
                style={styles.actionBtn}
              >
                <div style={styles.actionIconWrapper}>
                  <FiPackage style={styles.actionIcon} />
                </div>
                <div style={styles.actionContent}>
                  <div style={styles.actionTitle}>My Orders</div>
                  <div style={styles.actionText}>View order history</div>
                </div>
              </button>

              <button 
                onClick={() => navigate("/wishlist")} 
                style={styles.actionBtn}
              >
                <div style={styles.actionIconWrapper}>
                  <FiHeart style={styles.actionIcon} />
                </div>
                <div style={styles.actionContent}>
                  <div style={styles.actionTitle}>Wishlist</div>
                  <div style={styles.actionText}>Saved products</div>
                </div>
              </button>

              {user.role === "admin" && (
                <button 
                  onClick={() => navigate("/admin")} 
                  style={styles.actionBtn}
                >
                  <div style={styles.actionIconWrapper}>
                    <FiSettings style={styles.actionIcon} />
                  </div>
                  <div style={styles.actionContent}>
                    <div style={styles.actionTitle}>Admin Panel</div>
                    <div style={styles.actionText}>Manage platform</div>
                  </div>
                </button>
              )}

              <button 
                onClick={handleLogout} 
                style={styles.logoutActionBtn}
              >
                <div style={styles.logoutIconWrapper}>
                  <FiLogOut style={styles.actionIcon} />
                </div>
                <div style={styles.actionContent}>
                  <div style={styles.actionTitle}>Logout</div>
                  <div style={styles.actionText}>Sign out of account</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== STYLES ====================
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#000",
    padding: "100px 20px 40px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto"
  },
  header: {
    marginBottom: "40px",
    textAlign: "center"
  },
  title: {
    fontSize: "42px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "8px",
    letterSpacing: "-0.5px"
  },
  subtitle: {
    fontSize: "16px",
    color: "#666",
    fontWeight: "400"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 400px",
    gap: "24px",
    alignItems: "start"
  },

  // ========== CARD ==========
  card: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #1a1a1a",
    borderRadius: "16px",
    padding: "32px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    paddingBottom: "24px",
    borderBottom: "1px solid #1a1a1a"
  },
  cardTitleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  cardIcon: {
    fontSize: "24px",
    color: "#c4ff0d"
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    margin: 0
  },
  editBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    color: "#c4ff0d",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  editActions: {
    display: "flex",
    gap: "10px"
  },
  saveBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#c4ff0d",
    border: "none",
    borderRadius: "10px",
    color: "#000",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  cancelBtn: {
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
    transition: "all 0.2s"
  },

  // ========== CARD BODY ==========
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "32px"
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    paddingBottom: "24px",
    borderBottom: "1px solid #1a1a1a"
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#c4ff0d",
    color: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    fontWeight: "800",
    flexShrink: 0
  },
  adminBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    backgroundColor: "#c4ff0d15",
    border: "1px solid #c4ff0d",
    borderRadius: "8px",
    color: "#c4ff0d",
    fontSize: "13px",
    fontWeight: "700",
    textTransform: "uppercase"
  },

  // ========== FORM FIELDS ==========
  formFields: {
    display: "flex",
    flexDirection: "column",
    gap: "28px"
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  fieldLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "1.2px"
  },
  fieldIcon: {
    fontSize: "14px"
  },
  fieldValue: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#fff",
    padding: "14px 0",
    lineHeight: "1.5"
  },
  input: {
    padding: "14px 16px",
    backgroundColor: "#0a0a0a",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "500",
    outline: "none",
    transition: "all 0.2s",
    fontFamily: "inherit"
  },

  // ========== ACTIONS CARD ==========
  actionsCard: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #1a1a1a",
    borderRadius: "16px",
    padding: "28px",
    position: "sticky",
    top: "100px"
  },
  actionsTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "24px",
    margin: "0 0 24px 0"
  },
  actionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px 18px",
    backgroundColor: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: "12px",
    color: "#fff",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s",
    width: "100%"
  },
  actionIconWrapper: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    backgroundColor: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  actionIcon: {
    fontSize: "20px",
    color: "#c4ff0d"
  },
  actionContent: {
    flex: 1
  },
  actionTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "4px"
  },
  actionText: {
    fontSize: "13px",
    color: "#666",
    fontWeight: "400"
  },
  logoutActionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "16px 18px",
    backgroundColor: "#1a0a0a",
    border: "1px solid #331111",
    borderRadius: "12px",
    color: "#fff",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s",
    marginTop: "8px",
    width: "100%"
  },
  logoutIconWrapper: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    backgroundColor: "#2a1111",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  }
};
