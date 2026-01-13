import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft } from "react-icons/fi";

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, clearWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`✅ ${product.name} added to cart!`);
  };

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
  };

  if (wishlist.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIcon}>
          <FiHeart style={{ fontSize: "80px", color: "#333" }} />
        </div>
        <h2 style={styles.emptyTitle}>Your Wishlist is Empty</h2>
        <p style={styles.emptyText}>
          Save your favorite products to buy them later
        </p>
        <button onClick={() => navigate("/")} style={styles.shopBtn}>
          <FiArrowLeft style={{ marginRight: "10px" }} />
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              <FiHeart style={{ marginRight: "16px", color: "#c4ff0d" }} />
              My Wishlist
            </h1>
            <p style={styles.subtitle}>
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          {wishlist.length > 0 && (
            <button 
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
                  clearWishlist();
                }
              }} 
              style={styles.clearBtn}
            >
              <FiTrash2 style={{ marginRight: "8px" }} />
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Grid */}
        <div style={styles.grid}>
          {wishlist.map((product) => (
            <div key={product._id} style={styles.card}>
              {/* Product Image */}
              <div 
                style={styles.imageContainer}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/300"}
                  alt={product.name}
                  style={styles.image}
                />
                
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(product._id);
                  }}
                  style={styles.removeBtn}
                >
                  <FiTrash2 />
                </button>
              </div>

              {/* Product Info */}
              <div style={styles.info}>
                <div style={styles.brand}>{product.brand}</div>
                <h3 style={styles.name}>{product.name}</h3>
                
                {/* Price */}
                <div style={styles.priceContainer}>
                  <span style={styles.price}>${product.price}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span style={styles.originalPrice}>${product.originalPrice}</span>
                      <span style={styles.discount}>
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div style={styles.actions}>
                  <button
                    onClick={() => handleAddToCart(product)}
                    style={styles.addToCartBtn}
                  >
                    <FiShoppingCart style={{ marginRight: "8px" }} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => navigate(`/product/${product._id}`)}
                    style={styles.viewBtn}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
    alignItems: "flex-start",
    marginBottom: "48px"
  },
  title: {
    display: "flex",
    alignItems: "center",
    fontSize: "48px",
    fontWeight: "900",
    color: "#fff",
    marginBottom: "12px",
    letterSpacing: "-2px"
  },
  subtitle: {
    fontSize: "18px",
    color: "#666",
    fontWeight: "500"
  },
  clearBtn: {
    display: "flex",
    alignItems: "center",
    padding: "14px 28px",
    backgroundColor: "transparent",
    border: "2px solid #ff3b30",
    borderRadius: "12px",
    color: "#ff3b30",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "32px"
  },
  card: {
    backgroundColor: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: "20px",
    overflow: "hidden",
    transition: "all 0.3s",
    cursor: "pointer"
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "300px",
    backgroundColor: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  removeBtn: {
    position: "absolute",
    top: "16px",
    right: "16px",
    width: "40px",
    height: "40px",
    backgroundColor: "#ff3b30",
    border: "none",
    borderRadius: "50%",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s"
  },
  info: {
    padding: "24px"
  },
  brand: {
    fontSize: "13px",
    color: "#c4ff0d",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: "8px",
    letterSpacing: "1px"
  },
  name: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "16px",
    lineHeight: "1.3"
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px"
  },
  price: {
    fontSize: "28px",
    fontWeight: "900",
    color: "#c4ff0d"
  },
  originalPrice: {
    fontSize: "18px",
    color: "#666",
    textDecoration: "line-through"
  },
  discount: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#ff3b30",
    backgroundColor: "#ff3b3020",
    padding: "4px 8px",
    borderRadius: "6px"
  },
  actions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px"
  },
  addToCartBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px",
    backgroundColor: "#c4ff0d",
    border: "none",
    borderRadius: "10px",
    color: "#000",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s"
  },
  viewBtn: {
    padding: "14px",
    backgroundColor: "transparent",
    border: "2px solid #2a2a2a",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s"
  },
  emptyContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    backgroundColor: "#000"
  },
  emptyIcon: {
    marginBottom: "32px"
  },
  emptyTitle: {
    fontSize: "36px",
    fontWeight: "900",
    color: "#fff",
    marginBottom: "16px"
  },
  emptyText: {
    fontSize: "18px",
    color: "#666",
    marginBottom: "32px"
  },
  shopBtn: {
    display: "flex",
    alignItems: "center",
    padding: "16px 40px",
    backgroundColor: "#c4ff0d",
    border: "none",
    borderRadius: "12px",
    color: "#000",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s"
  }
};
