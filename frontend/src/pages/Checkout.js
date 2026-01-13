import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { 
  FiCreditCard, 
  FiLock, 
  FiMapPin, 
  FiCheckCircle,
  FiTruck,
  FiDollarSign
} from "react-icons/fi";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || "",
    lastName: user?.name?.split(' ')[1] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Morocco"
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);

  // BLOQUER L'ADMIN ET LES UTILISATEURS NON CONNECTÉS
  useEffect(() => {
    if (!user) {
      alert("⚠️ Please login to proceed with checkout!");
      navigate("/login");
      return;
    }
    
    if (user.isAdmin) {
      alert("⛔ Admins cannot place orders!\n\nPlease use a customer account to place orders.");
      navigate("/");
      return;
    }

    if (cart.length === 0) {
      navigate("/");
    }
  }, [user, navigate, cart]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Validation du formulaire
    if (!formData.phone || !formData.address || !formData.city) {
      alert("⚠️ Please fill in all required fields!");
      return;
    }

    // Vérifier si l'utilisateur est admin
    if (user.isAdmin) {
      alert("⛔ Admins cannot place orders!");
      navigate("/");
      return;
    }

    setIsProcessing(true);

    try {
      // ENVOYER LA COMMANDE AU BACKEND
      const orderData = {
        userId: user._id,
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || item.image || ""
        })),
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Card",
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total
      };

      const response = await axios.post("http://localhost:5001/api/orders", orderData);

      // Succès
      alert(
        `✅ Order placed successfully!\n\n` +
        `📦 Order Number: ${response.data.order.orderNumber}\n` +
        `💰 Payment Method: Cash on Delivery\n` +
        `💵 Total to pay: $${total.toFixed(2)}\n\n` +
        `📧 Confirmation email sent to ${formData.email}\n` +
        `🚚 Your order will be delivered soon!`
      );
      
      clearCart();
      navigate("/my-orders");
    } catch (error) {
      console.error("Error creating order:", error);
      alert(error.response?.data?.message || "❌ Failed to place order! Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>🛒</div>
        <h2 style={styles.emptyTitle}>Your cart is empty</h2>
        <p style={styles.emptyText}>Add some products before checkout</p>
        <button onClick={() => navigate("/")} style={styles.shopBtn}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Checkout</h1>
          <div style={styles.secureText}>
            <FiLock style={styles.lockIcon} />
            <span>Secure Checkout</span>
          </div>
        </div>

        <div style={styles.mainGrid}>
          {/* Left: Forms */}
          <div style={styles.formsColumn}>
            {/* Shipping Information */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <FiMapPin style={styles.sectionIcon} />
                <h2 style={styles.sectionTitle}>Delivery Information</h2>
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      style={styles.input}
                      placeholder="John"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      style={styles.input}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={styles.input}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      style={styles.input}
                      placeholder="+212 6XX XXX XXX"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Delivery Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    placeholder="Street address, apartment, suite, etc."
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      style={styles.input}
                      placeholder="Meknes"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="50000"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="Morocco">Morocco</option>
                    <option value="France">France</option>
                    <option value="Spain">Spain</option>
                    <option value="USA">United States</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <FiDollarSign style={styles.sectionIcon} />
                <h2 style={styles.sectionTitle}>Payment Method</h2>
              </div>

              {/* COD Highlighted */}
              <div style={styles.codHighlight}>
                <FiTruck style={styles.codIcon} />
                <div style={styles.codContent}>
                  <div style={styles.codTitle}>💰 Cash on Delivery (Recommended)</div>
                  <div style={styles.codText}>
                    Pay with cash when you receive your order. No prepayment required!
                  </div>
                </div>
              </div>

              <div style={styles.paymentMethods}>
                <div
                  onClick={() => setPaymentMethod("cod")}
                  style={{
                    ...styles.paymentOption,
                    ...(paymentMethod === "cod" && styles.paymentOptionActive)
                  }}
                >
                  <div style={styles.radioOuter}>
                    {paymentMethod === "cod" && <div style={styles.radioInner}></div>}
                  </div>
                  <div>
                    <div style={styles.paymentTitle}>💵 Cash on Delivery</div>
                    <div style={styles.paymentText}>Pay when you receive your order</div>
                  </div>
                  <span style={styles.recommendedBadge}>RECOMMENDED</span>
                </div>

                <div
                  onClick={() => setPaymentMethod("card")}
                  style={{
                    ...styles.paymentOption,
                    ...(paymentMethod === "card" && styles.paymentOptionActive)
                  }}
                >
                  <div style={styles.radioOuter}>
                    {paymentMethod === "card" && <div style={styles.radioInner}></div>}
                  </div>
                  <div>
                    <div style={styles.paymentTitle}>💳 Credit / Debit Card</div>
                    <div style={styles.paymentText}>Visa, Mastercard, Amex (Coming Soon)</div>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod("bank")}
                  style={{
                    ...styles.paymentOption,
                    ...(paymentMethod === "bank" && styles.paymentOptionActive)
                  }}
                >
                  <div style={styles.radioOuter}>
                    {paymentMethod === "bank" && <div style={styles.radioInner}></div>}
                  </div>
                  <div>
                    <div style={styles.paymentTitle}>🏦 Bank Transfer</div>
                    <div style={styles.paymentText}>Transfer to our bank account (Coming Soon)</div>
                  </div>
                </div>
              </div>

              {/* Payment Info Box */}
              <div style={styles.paymentInfoBox}>
                <div style={styles.infoBoxTitle}>ℹ️ Payment Information</div>
                <ul style={styles.infoList}>
                  <li>✅ Cash on Delivery is available for all orders</li>
                  <li>✅ Please have exact change ready</li>
                  <li>✅ You can inspect the product before payment</li>
                  <li>✅ Our delivery agent will wait for you to verify your order</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div style={styles.summaryColumn}>
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryTitle}>Order Summary</h2>

              {/* Products */}
              <div style={styles.productsList}>
                {cart.map((item) => (
                  <div key={item._id} style={styles.summaryItem}>
                    <img 
                      src={item.images?.[0] || item.image || "https://via.placeholder.com/80"} 
                      alt={item.name}
                      style={styles.summaryItemImage}
                    />
                    <div style={styles.summaryItemInfo}>
                      <div style={styles.summaryItemName}>{item.name}</div>
                      <div style={styles.summaryItemQty}>Qty: {item.quantity}</div>
                    </div>
                    <div style={styles.summaryItemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div style={styles.pricingSection}>
                <div style={styles.pricingRow}>
                  <span style={styles.pricingLabel}>Subtotal</span>
                  <span style={styles.pricingValue}>${subtotal.toFixed(2)}</span>
                </div>
                <div style={styles.pricingRow}>
                  <span style={styles.pricingLabel}>Shipping</span>
                  <span style={styles.pricingValue}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div style={styles.pricingRow}>
                  <span style={styles.pricingLabel}>Tax (10%)</span>
                  <span style={styles.pricingValue}>${tax.toFixed(2)}</span>
                </div>
                <div style={styles.divider}></div>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Total to Pay</span>
                  <span style={styles.totalValue}>${total.toFixed(2)}</span>
                </div>
                <div style={styles.codNote}>
                  💵 Pay in cash upon delivery
                </div>
              </div>

              {/* Place Order Button */}
              <button 
                onClick={handleSubmit}
                disabled={isProcessing}
                style={{
                  ...styles.placeOrderBtn,
                  ...(isProcessing && styles.placeOrderBtnDisabled)
                }}
              >
                {isProcessing ? (
                  <>
                    <div style={styles.miniSpinner}></div>
                    Processing Order...
                  </>
                ) : (
                  <>
                    <FiCheckCircle style={{ marginRight: "10px", fontSize: "20px" }} />
                    Confirm Order - ${total.toFixed(2)}
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div style={styles.trustSection}>
                <div style={styles.trustItem}>
                  <FiTruck style={styles.trustIcon} />
                  <span style={styles.trustText}>Free Shipping over $100</span>
                </div>
                <div style={styles.trustItem}>
                  <FiCheckCircle style={styles.trustIcon} />
                  <span style={styles.trustText}>Inspect before Payment</span>
                </div>
                <div style={styles.trustItem}>
                  <FiLock style={styles.trustIcon} />
                  <span style={styles.trustText}>Secure Order Processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== KEYFRAMES ====================
const keyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// ==================== STYLES ====================
const styles = {
  page: {
    backgroundColor: "#000",
    minHeight: "100vh",
    paddingTop: "100px",
    paddingBottom: "80px"
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 40px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "48px"
  },
  title: {
    fontSize: "48px",
    fontWeight: "900",
    color: "#fff",
    letterSpacing: "-2px",
    margin: 0
  },
  secureText: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    backgroundColor: "#00ff0010",
    border: "1px solid #00ff00",
    borderRadius: "10px",
    color: "#00ff00",
    fontSize: "14px",
    fontWeight: "600"
  },
  lockIcon: {
    fontSize: "18px"
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "40px"
  },

  // Forms Column
  formsColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "32px"
  },
  section: {
    backgroundColor: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: "20px",
    padding: "32px"
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px"
  },
  sectionIcon: {
    fontSize: "24px",
    color: "#c4ff0d"
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#fff",
    margin: 0
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#888"
  },
  input: {
    padding: "14px 18px",
    backgroundColor: "#000",
    border: "1px solid #1a1a1a",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.3s ease"
  },
  select: {
    padding: "14px 18px",
    backgroundColor: "#000",
    border: "1px solid #1a1a1a",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    cursor: "pointer"
  },

  // COD Highlight
  codHighlight: {
    display: "flex",
    gap: "16px",
    padding: "24px",
    backgroundColor: "#c4ff0d15",
    border: "2px solid #c4ff0d",
    borderRadius: "16px",
    marginBottom: "24px"
  },
  codIcon: {
    fontSize: "32px",
    color: "#c4ff0d",
    flexShrink: 0
  },
  codContent: {},
  codTitle: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#c4ff0d",
    marginBottom: "8px"
  },
  codText: {
    fontSize: "14px",
    color: "#888",
    lineHeight: "1.6"
  },

  // Payment Methods
  paymentMethods: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "24px"
  },
  paymentOption: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#000",
    border: "2px solid #1a1a1a",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  paymentOptionActive: {
    borderColor: "#c4ff0d",
    backgroundColor: "#c4ff0d10"
  },
  radioOuter: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    border: "2px solid #1a1a1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  radioInner: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#c4ff0d"
  },
  paymentTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "4px"
  },
  paymentText: {
    fontSize: "13px",
    color: "#666"
  },
  recommendedBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    padding: "6px 12px",
    backgroundColor: "#c4ff0d",
    color: "#000",
    fontSize: "11px",
    fontWeight: "800",
    borderRadius: "6px",
    letterSpacing: "0.5px"
  },

  // Payment Info Box
  paymentInfoBox: {
    padding: "20px",
    backgroundColor: "#000",
    border: "1px solid #1a1a1a",
    borderRadius: "12px"
  },
  infoBoxTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "12px"
  },
  infoList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "14px",
    color: "#888"
  },

  // Summary Column
  summaryColumn: {},
  summaryCard: {
    position: "sticky",
    top: "100px",
    backgroundColor: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: "20px",
    padding: "32px"
  },
  summaryTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "24px"
  },
  productsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "24px"
  },
  summaryItem: {
    display: "flex",
    gap: "16px",
    padding: "16px",
    backgroundColor: "#000",
    borderRadius: "12px"
  },
  summaryItemImage: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "8px",
    backgroundColor: "#1a1a1a"
  },
  summaryItemInfo: {
    flex: 1
  },
  summaryItemName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "4px"
  },
  summaryItemQty: {
    fontSize: "13px",
    color: "#666"
  },
  summaryItemPrice: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#c4ff0d"
  },
  pricingSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "24px"
  },
  pricingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  pricingLabel: {
    fontSize: "15px",
    color: "#888"
  },
  pricingValue: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#fff"
  },
  divider: {
    height: "1px",
    backgroundColor: "#1a1a1a",
    margin: "8px 0"
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  totalLabel: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff"
  },
  totalValue: {
    fontSize: "28px",
    fontWeight: "900",
    color: "#c4ff0d"
  },
  codNote: {
    padding: "12px",
    backgroundColor: "#c4ff0d15",
    border: "1px solid #c4ff0d",
    borderRadius: "8px",
    color: "#c4ff0d",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "center"
  },
  placeOrderBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#c4ff0d",
    border: "none",
    borderRadius: "12px",
    color: "#000",
    fontSize: "17px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginBottom: "24px"
  },
  placeOrderBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed"
  },
  miniSpinner: {
    width: "20px",
    height: "20px",
    border: "3px solid #00000030",
    borderTop: "3px solid #000",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginRight: "10px"
  },
  trustSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  trustIcon: {
    fontSize: "18px",
    color: "#c4ff0d"
  },
  trustText: {
    fontSize: "13px",
    color: "#666"
  },

  // Empty State
  emptyContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
    backgroundColor: "#000",
    padding: "40px"
  },
  emptyIcon: {
    fontSize: "80px"
  },
  emptyTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#fff"
  },
  emptyText: {
    fontSize: "18px",
    color: "#666"
  },
  shopBtn: {
    padding: "16px 40px",
    backgroundColor: "#c4ff0d",
    border: "none",
    borderRadius: "12px",
    color: "#000",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease"
  }
};
