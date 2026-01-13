import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.2; // 20% TVA
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyContent}>
          <div style={styles.emptyIcon}>🛒</div>
          <h2 style={styles.emptyTitle}>Your cart is empty</h2>
          <p style={styles.emptyText}>Add some products to get started!</p>
          <button onClick={() => navigate("/")} style={styles.shopButton}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Shopping Cart</h1>
          <p style={styles.itemCount}>{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
        </div>

        <div style={styles.mainLayout}>
          {/* Cart Items */}
          <div style={styles.cartSection}>
            <div style={styles.cartHeader}>
              <span style={styles.headerLabel}>Product</span>
              <span style={styles.headerLabel}>Price</span>
              <span style={styles.headerLabel}>Quantity</span>
              <span style={styles.headerLabel}>Total</span>
            </div>

            {cart.map((item) => (
              <div key={`${item._id}-${item.selectedColor}`} style={styles.cartItem}>
                {/* Product Info */}
                <div style={styles.productSection}>
                  <div style={styles.imageContainer}>
                    <img
                      src={item.images?.[0] || "https://via.placeholder.com/150"}
                      alt={item.name}
                      style={styles.productImage}
                    />
                  </div>
                  <div style={styles.productInfo}>
                    <h3 style={styles.productName}>{item.name}</h3>
                    <p style={styles.productBrand}>{item.brand}</p>
                    {item.selectedColor && (
                      <p style={styles.productColor}>Color: {item.selectedColor}</p>
                    )}
                    <button
                      onClick={() => removeFromCart(item._id, item.selectedColor)}
                      style={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div style={styles.priceSection}>
                  <span style={styles.price}>${item.price}.00</span>
                </div>

                {/* Quantity Controls */}
                <div style={styles.quantitySection}>
                  <div style={styles.quantityControls}>
                    <button
                      onClick={() => updateQuantity(item._id, item.selectedColor, Math.max(1, item.quantity - 1))}
                      style={styles.quantityButton}
                    >
                      −
                    </button>
                    <span style={styles.quantityValue}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.selectedColor, Math.min(item.stock || 99, item.quantity + 1))}
                      style={styles.quantityButton}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div style={styles.totalSection}>
                  <span style={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button onClick={clearCart} style={styles.clearButton}>
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div style={styles.summarySection}>
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryTitle}>Order Summary</h2>
              
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Subtotal</span>
                <span style={styles.summaryValue}>${calculateSubtotal().toFixed(2)}</span>
              </div>

              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Tax (20%)</span>
                <span style={styles.summaryValue}>${calculateTax().toFixed(2)}</span>
              </div>

              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Shipping</span>
                <span style={styles.summaryValueFree}>FREE</span>
              </div>

              <div style={styles.divider}></div>

              <div style={styles.summaryTotal}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalValue}>${calculateTotal().toFixed(2)}</span>
              </div>

              {/* BOUTON CHECKOUT AVEC NAVIGATION */}
              <button onClick={() => navigate("/checkout")} style={styles.checkoutButton}>
                Proceed to Checkout
              </button>

              <button onClick={() => navigate("/")} style={styles.continueButton}>
                Continue Shopping
              </button>

              {/* Promo Code */}
              <div style={styles.promoSection}>
                <input
                  type="text"
                  placeholder="Promo code"
                  style={styles.promoInput}
                />
                <button style={styles.promoButton}>Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#1a1a1a",
    minHeight: "100vh",
    paddingBottom: "60px"
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "40px"
  },
  
  // Header
  header: {
    marginBottom: "40px",
    paddingBottom: "24px",
    borderBottom: "1px solid #2d2d2d"
  },
  title: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "8px"
  },
  itemCount: {
    fontSize: "15px",
    color: "#666"
  },
  
  // Main Layout
  mainLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 400px",
    gap: "40px"
  },
  
  // Cart Section
  cartSection: {
    backgroundColor: "#0f0f0f",
    borderRadius: "12px",
    border: "1px solid #2d2d2d",
    padding: "0"
  },
  cartHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: "20px",
    padding: "20px 24px",
    borderBottom: "1px solid #2d2d2d"
  },
  headerLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  cartItem: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: "20px",
    padding: "24px",
    borderBottom: "1px solid #2d2d2d",
    alignItems: "center"
  },
  
  // Product Section
  productSection: {
    display: "flex",
    gap: "16px"
  },
  imageContainer: {
    width: "100px",
    height: "100px",
    backgroundColor: "#1a1a1a",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    flexShrink: 0
  },
  productImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain"
  },
  productInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  productName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "4px"
  },
  productBrand: {
    fontSize: "12px",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  productColor: {
    fontSize: "13px",
    color: "#999"
  },
  removeButton: {
    marginTop: "8px",
    padding: "0",
    backgroundColor: "transparent",
    border: "none",
    color: "#c4ff0d",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    textAlign: "left",
    width: "fit-content"
  },
  
  // Price Section
  priceSection: {
    display: "flex",
    alignItems: "center"
  },
  price: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#fff"
  },
  
  // Quantity Section
  quantitySection: {
    display: "flex",
    alignItems: "center"
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: "8px",
    border: "1px solid #2d2d2d"
  },
  quantityButton: {
    width: "36px",
    height: "36px",
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
    fontWeight: "600"
  },
  quantityValue: {
    width: "48px",
    textAlign: "center",
    fontSize: "15px",
    fontWeight: "600",
    color: "#fff",
    borderLeft: "1px solid #2d2d2d",
    borderRight: "1px solid #2d2d2d"
  },
  
  // Total Section
  totalSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  itemTotal: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#c4ff0d"
  },
  
  // Clear Cart
  clearButton: {
    margin: "24px",
    padding: "12px 24px",
    backgroundColor: "transparent",
    border: "1px solid #2d2d2d",
    borderRadius: "8px",
    color: "#666",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  
  // Summary Section
  summarySection: {
    position: "sticky",
    top: "100px",
    height: "fit-content"
  },
  summaryCard: {
    backgroundColor: "#0f0f0f",
    borderRadius: "12px",
    border: "1px solid #2d2d2d",
    padding: "24px"
  },
  summaryTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "24px"
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px"
  },
  summaryLabel: {
    fontSize: "15px",
    color: "#999"
  },
  summaryValue: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#fff"
  },
  summaryValueFree: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#c4ff0d"
  },
  divider: {
    height: "1px",
    backgroundColor: "#2d2d2d",
    margin: "20px 0"
  },
  summaryTotal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px"
  },
  totalLabel: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff"
  },
  totalValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#c4ff0d"
  },
  checkoutButton: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#c4ff0d",
    border: "none",
    borderRadius: "8px",
    color: "#000",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  continueButton: {
    width: "100%",
    padding: "14px",
    backgroundColor: "transparent",
    border: "1px solid #2d2d2d",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    marginBottom: "20px"
  },
  
  // Promo Code
  promoSection: {
    display: "flex",
    gap: "8px"
  },
  promoInput: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#1a1a1a",
    border: "1px solid #2d2d2d",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    outline: "none"
  },
  promoButton: {
    padding: "12px 20px",
    backgroundColor: "#2d2d2d",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
  },
  
  // Empty Cart
  emptyContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "70vh",
    backgroundColor: "#1a1a1a"
  },
  emptyContent: {
    textAlign: "center"
  },
  emptyIcon: {
    fontSize: "80px",
    marginBottom: "24px",
    opacity: 0.3
  },
  emptyTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "12px"
  },
  emptyText: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "32px"
  },
  shopButton: {
    padding: "14px 32px",
    backgroundColor: "#c4ff0d",
    border: "none",
    borderRadius: "8px",
    color: "#000",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer"
  }
};
