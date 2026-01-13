import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAlert } from "../hooks/useAlert";
import CustomAlert from "../components/CustomAlert";
import axios from "axios";
import { 
  FiShoppingCart, 
  FiHeart, 
  FiTruck, 
  FiShield, 
  FiRotateCcw,
  FiCheck,
  FiChevronLeft,
  FiPackage,
  FiAward,
  FiClock
} from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";


export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { alert, showAlert, closeAlert } = useAlert();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);


  useEffect(() => {
    fetchProduct();
  }, [id]);


  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/products/${id}`);
      setProduct(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  };


  const handleAddToCart = () => {
    if (product) {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        quantity: quantity
      });
      showAlert({
        type: "success",
        title: "Product Added!",
        message: `${product.name} has been successfully added to your cart with quantity ${quantity}.`
      });
    }
  };


  const handleBuyNow = () => {
    if (product) {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        quantity: quantity
      });
      showAlert({
        type: "success",
        title: "Redirecting to Cart...",
        message: "Your product has been added. Proceeding to checkout."
      });
      setTimeout(() => navigate("/cart"), 1500);
    }
  };


  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading product details...</p>
      </div>
    );
  }


  if (!product) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <h2 style={styles.errorTitle}>Product Not Found</h2>
        <p style={styles.errorText}>The product you're looking for doesn't exist</p>
        <button onClick={() => navigate("/")} style={styles.backBtn}>
          <FiChevronLeft style={{ marginRight: "8px" }} />
          Back to Home
        </button>
      </div>
    );
  }


  const images = product.images || ["https://via.placeholder.com/600"];
  const rating = product.rating || 4.8;


  return (
    <div style={styles.page}>
      <style>{keyframesCSS}</style>


      {/* Back Button */}
      <div style={styles.backButtonContainer}>
        <button onClick={() => navigate("/")} style={styles.backNavBtn}>
          <FiChevronLeft style={{ fontSize: "20px" }} />
          <span>Back to Products</span>
        </button>
      </div>


      <div style={styles.container}>
        {/* Product Section */}
        <div style={styles.productSection}>
          {/* Left: Image Gallery */}
          <div style={styles.galleryColumn}>
            {/* Main Image */}
            <div style={styles.mainImageContainer}>
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                style={styles.mainImage}
              />
              
              {/* Badges */}
              <div style={styles.badgesContainer}>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span style={styles.saleBadge}>
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
                <span style={styles.newBadge}>NEW</span>
              </div>


              {/* Wishlist Button */}
              <button 
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  showAlert({
                    type: isWishlisted ? "info" : "success",
                    title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist!",
                    message: isWishlisted 
                      ? "Product removed from your wishlist." 
                      : "Product added to your wishlist successfully."
                  });
                }}
                style={{
                  ...styles.wishlistBtnFloat,
                  ...(isWishlisted && styles.wishlistBtnFloatActive)
                }}
              >
                <FiHeart style={{ fontSize: "22px" }} />
              </button>
            </div>


            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={styles.thumbnailsRow}>
                {images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    style={{
                      ...styles.thumbnail,
                      ...(selectedImage === index && styles.thumbnailActive)
                    }}
                  >
                    <img src={img} alt={`View ${index + 1}`} style={styles.thumbnailImg} />
                  </div>
                ))}
              </div>
            )}
          </div>


          {/* Right: Product Info */}
          <div style={styles.infoColumn}>
            {/* Brand & Breadcrumb */}
            <div style={styles.brandRow}>
              <span style={styles.brandBadge}>{product.brand}</span>
              <span style={styles.categoryBadge}>{product.category}</span>
            </div>


            {/* Product Name */}
            <h1 style={styles.productName}>{product.name}</h1>


            {/* Rating & Reviews */}
            <div style={styles.ratingRow}>
              <div style={styles.starsContainer}>
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(rating) ? (
                    <AiFillStar key={i} style={styles.starFilled} />
                  ) : (
                    <AiOutlineStar key={i} style={styles.starEmpty} />
                  )
                ))}
              </div>
              <span style={styles.ratingText}>{rating}</span>
              <span style={styles.reviewDivider}>|</span>
              <span style={styles.reviewCount}>128 Reviews</span>
              <span style={styles.reviewDivider}>|</span>
              <span style={styles.soldCount}>500+ Sold</span>
            </div>


            {/* Price Section */}
            <div style={styles.priceBox}>
              <div style={styles.priceMain}>
                <span style={styles.currency}>$</span>
                <span style={styles.price}>{product.price}</span>
                <span style={styles.decimal}>.00</span>
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div style={styles.priceSecondary}>
                  <span style={styles.originalPrice}>${product.originalPrice}.00</span>
                  <span style={styles.savingsText}>
                    You save ${(product.originalPrice - product.price).toFixed(2)} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
                  </span>
                </div>
              )}
            </div>


            {/* Stock & Shipping Info */}
            <div style={styles.infoCards}>
              <div style={styles.infoCard}>
                <FiCheck style={styles.infoCardIcon} />
                <div>
                  <div style={styles.infoCardTitle}>In Stock</div>
                  <div style={styles.infoCardText}>Ready to ship</div>
                </div>
              </div>
              <div style={styles.infoCard}>
                <FiTruck style={styles.infoCardIcon} />
                <div>
                  <div style={styles.infoCardTitle}>Free Shipping</div>
                  <div style={styles.infoCardText}>On orders over $100</div>
                </div>
              </div>
              <div style={styles.infoCard}>
                <FiClock style={styles.infoCardIcon} />
                <div>
                  <div style={styles.infoCardTitle}>Fast Delivery</div>
                  <div style={styles.infoCardText}>2-3 business days</div>
                </div>
              </div>
            </div>


            {/* Description */}
            <div style={styles.descriptionBox}>
              <p style={styles.descriptionText}>
                {product.description || "Experience cutting-edge technology with this premium product. Designed for performance, built for reliability, and crafted with precision to exceed your expectations."}
              </p>
            </div>


            {/* Quantity Selector */}
            <div style={styles.quantityRow}>
              <label style={styles.quantityLabel}>Quantity</label>
              <div style={styles.quantityControl}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={styles.quantityBtn}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#1a1a1a"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                >
                  -
                </button>
                <span style={styles.quantityDisplay}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  style={styles.quantityBtn}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#1a1a1a"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                >
                  +
                </button>
              </div>
            </div>


            {/* Action Buttons */}
            <div style={styles.actionsRow}>
              <button 
                onClick={handleBuyNow} 
                style={styles.buyNowBtn}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 30px rgba(196, 255, 13, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 20px rgba(196, 255, 13, 0.3)";
                }}
              >
                Buy Now
              </button>
              <button 
                onClick={handleAddToCart} 
                style={styles.addToCartBtn}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#c4ff0d";
                  e.target.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#c4ff0d";
                }}
              >
                <FiShoppingCart style={{ marginRight: "10px", fontSize: "20px" }} />
                Add to Cart
              </button>
            </div>


            {/* Trust Badges */}
            <div style={styles.trustBadges}>
              <div style={styles.trustBadge}>
                <FiShield style={styles.trustIcon} />
                <span style={styles.trustText}>2-Year Warranty</span>
              </div>
              <div style={styles.trustBadge}>
                <FiRotateCcw style={styles.trustIcon} />
                <span style={styles.trustText}>30-Day Returns</span>
              </div>
              <div style={styles.trustBadge}>
                <FiAward style={styles.trustIcon} />
                <span style={styles.trustText}>Certified Quality</span>
              </div>
              <div style={styles.trustBadge}>
                <FiPackage style={styles.trustIcon} />
                <span style={styles.trustText}>Secure Packaging</span>
              </div>
            </div>
          </div>
        </div>


        {/* Tabs Section */}
        <div style={styles.tabsSection}>
          {/* Tab Headers */}
          <div style={styles.tabHeaders}>
            <button
              onClick={() => setActiveTab("description")}
              style={{
                ...styles.tabHeader,
                ...(activeTab === "description" && styles.tabHeaderActive)
              }}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              style={{
                ...styles.tabHeader,
                ...(activeTab === "specifications" && styles.tabHeaderActive)
              }}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              style={{
                ...styles.tabHeader,
                ...(activeTab === "reviews" && styles.tabHeaderActive)
              }}
            >
              Reviews
              <span style={styles.tabBadge}>128</span>
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              style={{
                ...styles.tabHeader,
                ...(activeTab === "shipping" && styles.tabHeaderActive)
              }}
            >
              Shipping & Returns
            </button>
          </div>


          {/* Tab Content */}
          <div style={styles.tabContentBox}>
            {activeTab === "description" && (
              <div style={styles.tabPane}>
                <h3 style={styles.tabTitle}>Product Overview</h3>
                <p style={styles.tabText}>
                  {product.description || "Discover excellence with this premium product. Engineered with precision and designed for performance, it combines cutting-edge technology with sleek aesthetics. Perfect for professionals and enthusiasts alike."}
                </p>
                <div style={styles.featuresList}>
                  <h4 style={styles.featuresTitle}>Key Features:</h4>
                  <ul style={styles.featuresUl}>
                    <li style={styles.featureLi}>✓ Premium build quality with attention to detail</li>
                    <li style={styles.featureLi}>✓ Latest generation technology for superior performance</li>
                    <li style={styles.featureLi}>✓ Energy-efficient design for sustainability</li>
                    <li style={styles.featureLi}>✓ Sleek and modern aesthetic that complements any space</li>
                    <li style={styles.featureLi}>✓ Intuitive interface for seamless user experience</li>
                  </ul>
                </div>
              </div>
            )}


            {activeTab === "specifications" && (
              <div style={styles.tabPane}>
                <h3 style={styles.tabTitle}>Technical Specifications</h3>
                <div style={styles.specsTable}>
                  {[
                    { label: "Brand", value: product.brand },
                    { label: "Model", value: product.name },
                    { label: "Category", value: product.category },
                    { label: "Warranty", value: "2 Years Manufacturer Warranty" },
                    { label: "Dimensions", value: "To be specified" },
                    { label: "Weight", value: "To be specified" },
                    { label: "Color Options", value: "Multiple available" },
                    { label: "Package Contents", value: "Product, Manual, Accessories" }
                  ].map((spec, index) => (
                    <div key={index} style={styles.specRow}>
                      <span style={styles.specLabel}>{spec.label}</span>
                      <span style={styles.specValue}>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {activeTab === "reviews" && (
              <div style={styles.tabPane}>
                <h3 style={styles.tabTitle}>Customer Reviews</h3>
                <div style={styles.reviewsPlaceholder}>
                  <div style={styles.reviewsIcon}>⭐</div>
                  <p style={styles.reviewsText}>Customer reviews are coming soon!</p>
                  <p style={styles.reviewsSubtext}>Be the first to review this product</p>
                </div>
              </div>
            )}


            {activeTab === "shipping" && (
              <div style={styles.tabPane}>
                <h3 style={styles.tabTitle}>Shipping & Returns Policy</h3>
                <div style={styles.policySection}>
                  <h4 style={styles.policyTitle}>🚚 Shipping Information</h4>
                  <ul style={styles.policyList}>
                    <li>Free standard shipping on orders over $100</li>
                    <li>Express shipping available at checkout</li>
                    <li>Delivery within 2-3 business days</li>
                    <li>Track your order in real-time</li>
                  </ul>
                </div>
                <div style={styles.policySection}>
                  <h4 style={styles.policyTitle}>↩️ Returns & Refunds</h4>
                  <ul style={styles.policyList}>
                    <li>30-day money-back guarantee</li>
                    <li>Free return shipping</li>
                    <li>No questions asked policy</li>
                    <li>Full refund or exchange available</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Alert Pro */}
      {alert && (
        <CustomAlert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={closeAlert}
        />
      )}
    </div>
  );
}


// ==================== KEYFRAMES ====================
const keyframesCSS = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
`;


// ==================== STYLES ====================
const styles = {
  page: {
    backgroundColor: "#000",
    minHeight: "100vh",
    paddingTop: "90px",
    paddingBottom: "100px"
  },


  // Back Button
  backButtonContainer: {
    maxWidth: "1400px",
    margin: "0 auto 24px",
    padding: "0 40px"
  },
  backNavBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    backgroundColor: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },


  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 40px"
  },


  // ========== PRODUCT SECTION ==========
  productSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "80px",
    marginBottom: "100px",
    animation: "fadeIn 0.8s ease-out"
  },


  // Gallery Column
  galleryColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  mainImageContainer: {
    position: "relative",
    backgroundColor: "#0f0f0f",
    borderRadius: "24px",
    padding: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #1a1a1a",
    minHeight: "600px",
    overflow: "hidden"
  },
  mainImage: {
    maxWidth: "100%",
    maxHeight: "500px",
    objectFit: "contain",
    transition: "transform 0.5s ease"
  },
  badgesContainer: {
    position: "absolute",
    top: "24px",
    left: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  saleBadge: {
    padding: "12px 20px",
    backgroundColor: "#ff3b30",
    color: "#fff",
    fontSize: "13px",
    fontWeight: "800",
    borderRadius: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    boxShadow: "0 4px 20px rgba(255, 59, 48, 0.4)",
    animation: "pulse 2s ease-in-out infinite"
  },
  newBadge: {
    padding: "12px 20px",
    backgroundColor: "#c4ff0d",
    color: "#000",
    fontSize: "13px",
    fontWeight: "800",
    borderRadius: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  wishlistBtnFloat: {
    position: "absolute",
    top: "24px",
    right: "24px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#0f0f0f",
    border: "2px solid #1a1a1a",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  wishlistBtnFloatActive: {
    backgroundColor: "#c4ff0d",
    borderColor: "#c4ff0d",
    color: "#000"
  },
  thumbnailsRow: {
    display: "flex",
    gap: "16px"
  },
  thumbnail: {
    width: "120px",
    height: "120px",
    backgroundColor: "#0f0f0f",
    borderRadius: "16px",
    border: "2px solid #1a1a1a",
    padding: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  thumbnailActive: {
    borderColor: "#c4ff0d",
    backgroundColor: "#c4ff0d10"
  },
  thumbnailImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain"
  },


  // Info Column
  infoColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    animation: "slideIn 0.8s ease-out 0.2s backwards"
  },
  brandRow: {
    display: "flex",
    gap: "12px"
  },
  brandBadge: {
    padding: "8px 16px",
    backgroundColor: "#c4ff0d15",
    border: "1px solid #c4ff0d",
    borderRadius: "8px",
    color: "#c4ff0d",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1.5px"
  },
  categoryBadge: {
    padding: "8px 16px",
    backgroundColor: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: "8px",
    color: "#666",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1.5px"
  },
  productName: {
    fontSize: "48px",
    fontWeight: "900",
    color: "#fff",
    lineHeight: "1.1",
    letterSpacing: "-2px",
    margin: 0
  },
  ratingRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  starsContainer: {
    display: "flex",
    gap: "4px"
  },
  starFilled: {
    color: "#c4ff0d",
    fontSize: "20px"
  },
  starEmpty: {
    color: "#333",
    fontSize: "20px"
  },
  ratingText: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#c4ff0d"
  },
  reviewDivider: {
    color: "#333",
    fontSize: "16px"
  },
  reviewCount: {
    fontSize: "14px",
    color: "#666",
    fontWeight: "500"
  },
  soldCount: {
    fontSize: "14px",
    color: "#666",
    fontWeight: "500"
  },
  priceBox: {
    padding: "28px",
    backgroundColor: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: "16px"
  },
  priceMain: {
    display: "flex",
    alignItems: "baseline",
    marginBottom: "12px"
  },
  currency: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#c4ff0d",
    marginRight: "4px"
  },
  price: {
    fontSize: "56px",
    fontWeight: "900",
    color: "#fff",
    letterSpacing: "-2px"
  },
  decimal: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#666"
  },
  priceSecondary: {
    display: "flex",
    alignItems: "center",
    gap: "16px"
  },
  originalPrice: {
    fontSize: "20px",
    color: "#666",
    textDecoration: "line-through",
    fontWeight: "500"
  },
  savingsText: {
    fontSize: "14px",
    color: "#c4ff0d",
    fontWeight: "600"
  },
  infoCards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px"
  },
  infoCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: "12px"
  },
  infoCardIcon: {
    fontSize: "24px",
    color: "#c4ff0d",
    flexShrink: 0
  },
  infoCardTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "2px"
  },
  infoCardText: {
    fontSize: "12px",
    color: "#666"
  },
  descriptionBox: {
    padding: "24px",
    backgroundColor: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: "16px"
  },
  descriptionText: {
    fontSize: "16px",
    color: "#888",
    lineHeight: "1.8",
    margin: 0
  },
  quantityRow: {
    display: "flex",
    alignItems: "center",
    gap: "24px"
  },
  quantityLabel: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff"
  },
  quantityControl: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: "12px",
    overflow: "hidden"
  },
  quantityBtn: {
    width: "48px",
    height: "48px",
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  quantityDisplay: {
    minWidth: "80px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "700",
    color: "#fff",
    borderLeft: "1px solid #1a1a1a",
    borderRight: "1px solid #1a1a1a"
  },
  actionsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px"
  },
  buyNowBtn: {
    padding: "20px 32px",
    backgroundColor: "#c4ff0d",
    border: "none",
    borderRadius: "14px",
    color: "#000",
    fontSize: "17px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 20px rgba(196, 255, 13, 0.3)"
  },
  addToCartBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 32px",
    backgroundColor: "transparent",
    border: "2px solid #c4ff0d",
    borderRadius: "14px",
    color: "#c4ff0d",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  trustBadges: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px"
  },
  trustBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "16px",
    backgroundColor: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: "12px"
  },
  trustIcon: {
    fontSize: "20px",
    color: "#c4ff0d"
  },
  trustText: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#888"
  },


  // ========== TABS ==========
  tabsSection: {
    animation: "fadeIn 1s ease-out 0.4s backwards"
  },
  tabHeaders: {
    display: "flex",
    gap: "8px",
    marginBottom: "0",
    borderBottom: "1px solid #1a1a1a"
  },
  tabHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "20px 32px",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "3px solid transparent",
    color: "#666",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  tabHeaderActive: {
    color: "#c4ff0d",
    borderBottomColor: "#c4ff0d"
  },
  tabBadge: {
    padding: "4px 10px",
    backgroundColor: "#c4ff0d20",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#c4ff0d"
  },
  tabContentBox: {
    padding: "48px",
    backgroundColor: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderTop: "none",
    borderRadius: "0 0 24px 24px"
  },
  tabPane: {},
  tabTitle: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "24px",
    letterSpacing: "-1px"
  },
  tabText: {
    fontSize: "16px",
    color: "#888",
    lineHeight: "1.8",
    marginBottom: "32px"
  },
  featuresList: {
    marginTop: "32px"
  },
  featuresTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "16px"
  },
  featuresUl: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  featureLi: {
    fontSize: "15px",
    color: "#888",
    lineHeight: "1.6"
  },
  specsTable: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  specRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    backgroundColor: "#000",
    borderRadius: "12px"
  },
  specLabel: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#666"
  },
  specValue: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#fff"
  },
  reviewsPlaceholder: {
    textAlign: "center",
    padding: "80px 40px"
  },
  reviewsIcon: {
    fontSize: "64px",
    marginBottom: "24px"
  },
  reviewsText: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "8px"
  },
  reviewsSubtext: {
    fontSize: "16px",
    color: "#666"
  },
  policySection: {
    marginBottom: "32px"
  },
  policyTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "16px"
  },
  policyList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    fontSize: "15px",
    color: "#888",
    lineHeight: "1.6"
  },


  // ========== LOADING & ERROR ==========
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
    backgroundColor: "#000"
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "4px solid #1a1a1a",
    borderTop: "4px solid #c4ff0d",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  loadingText: {
    color: "#666",
    fontSize: "16px",
    fontWeight: "500"
  },
  errorContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
    backgroundColor: "#000",
    padding: "40px"
  },
  errorIcon: {
    fontSize: "80px"
  },
  errorTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#fff"
  },
  errorText: {
    fontSize: "18px",
    color: "#666",
    marginBottom: "16px"
  },
  backBtn: {
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
    transition: "all 0.3s ease"
  }
};
