import React from "react";
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX, FiAlertCircle } from "react-icons/fi";

function CustomAlert({ type = "error", title, message, onClose, showIcon = true }) {
  const alertConfig = {
    error: {
      icon: <FiAlertCircle />,
      bgColor: "#ff3b30",
      bgLight: "#ff3b3010",
      borderColor: "#ff3b30"
    },
    warning: {
      icon: <FiAlertTriangle />,
      bgColor: "#ff9500",
      bgLight: "#ff950010",
      borderColor: "#ff9500"
    },
    success: {
      icon: <FiCheckCircle />,
      bgColor: "#00ff00",
      bgLight: "#00ff0010",
      borderColor: "#00ff00"
    },
    info: {
      icon: <FiInfo />,
      bgColor: "#5ac8fa",
      bgLight: "#5ac8fa10",
      borderColor: "#5ac8fa"
    }
  };

  const config = alertConfig[type] || alertConfig.error;

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      backdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 99999,
      padding: "20px",
      animation: "fadeIn 0.3s ease"
    },
    container: {
      maxWidth: "480px",
      width: "100%",
      backgroundColor: "#0f0f0f",
      border: `2px solid ${config.borderColor}`,
      borderRadius: "24px",
      padding: "32px",
      position: "relative",
      boxShadow: `0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px ${config.bgColor}30`,
      animation: "slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
    },
    closeBtn: {
      position: "absolute",
      top: "20px",
      right: "20px",
      width: "36px",
      height: "36px",
      backgroundColor: "#1a1a1a",
      border: "1px solid #2a2a2a",
      borderRadius: "10px",
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      transition: "all 0.3s",
      zIndex: 1
    },
    iconContainer: {
      width: "80px",
      height: "80px",
      margin: "0 auto 24px",
      backgroundColor: config.bgLight,
      border: `3px solid ${config.borderColor}`,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "pulse 2s infinite"
    },
    icon: {
      fontSize: "40px",
      color: config.bgColor
    },
    title: {
      fontSize: "24px",
      fontWeight: "900",
      color: "#fff",
      textAlign: "center",
      marginBottom: "12px",
      letterSpacing: "-0.5px"
    },
    message: {
      fontSize: "16px",
      color: "#888",
      textAlign: "center",
      lineHeight: "1.6",
      marginBottom: "28px"
    },
    button: {
      width: "100%",
      padding: "16px",
      backgroundColor: config.bgColor,
      border: "none",
      borderRadius: "14px",
      color: type === "success" || type === "warning" ? "#000" : "#fff",
      fontSize: "16px",
      fontWeight: "800",
      cursor: "pointer",
      transition: "all 0.3s",
      textTransform: "uppercase",
      letterSpacing: "1px",
      boxShadow: `0 8px 24px ${config.bgColor}40`
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
      `}</style>
      
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.container} onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={onClose} 
            style={styles.closeBtn}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#2a2a2a";
              e.target.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#1a1a1a";
              e.target.style.transform = "rotate(0deg)";
            }}
          >
            <FiX />
          </button>

          {showIcon && (
            <div style={styles.iconContainer}>
              <div style={styles.icon}>{config.icon}</div>
            </div>
          )}

          <h2 style={styles.title}>{title}</h2>
          <p style={styles.message}>{message}</p>

          <button
            onClick={onClose}
            style={styles.button}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = `0 12px 32px ${config.bgColor}60`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = `0 8px 24px ${config.bgColor}40`;
            }}
          >
            GOT IT
          </button>
        </div>
      </div>
    </>
  );
}

export default CustomAlert;
