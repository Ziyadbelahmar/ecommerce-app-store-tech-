import React, { useState, useEffect, useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  FiSearch, 
  FiHeart, 
  FiShoppingCart, 
  FiTruck, 
  FiLock, 
  FiRotateCcw, 
  FiMessageCircle,
  FiFilter,
  FiX,
  FiEye,
  FiArrowUp,
  FiMail,
  FiSend
} from "react-icons/fi";
import { AiFillStar, AiFillFire } from "react-icons/ai";
import { MdKeyboardArrowRight } from "react-icons/md";
import { 
  BsPhone, 
  BsLaptop, 
  BsHeadphones, 
  BsTablet, 
  BsSmartwatch 
} from "react-icons/bs";



export default function Home() {
  const navigate = useNavigate();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchBrand, setSearchBrand] = useState("");
  const [visibleSections, setVisibleSections] = useState({});
  
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [email, setEmail] = useState("");



  const categories = [
    { name: "All Items", value: "all", icon: <AiFillFire />, color: "#ff6b35" },
    { name: "Smartphones", value: "smartphones", icon: <BsPhone />, color: "#4a90e2" },
    { name: "Laptops", value: "laptops", icon: <BsLaptop />, color: "#5ac8fa" },
    { name: "Audio", value: "accessories", icon: <BsHeadphones />, color: "#af52de" },
    { name: "Tablets", value: "tablets", icon: <BsTablet />, color: "#ffcc00" },
    { name: "Wearables", value: "wearables", icon: <BsSmartwatch />, color: "#30d158" }
  ];


  const brands = ["Apple", "Samsung", "Google", "Dell", "HP", "Sony", "Bose"];



  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };



  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);



  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedBrands]);



  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5001/api/products");
      let productsData = Array.isArray(res.data) ? res.data : [];
      
      if (selectedCategory !== "all") {
        productsData = productsData.filter(p => 
          p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
      
      if (selectedBrands.length > 0) {
        productsData = productsData.filter(p => {
          if (!p.brand) return false;
          
          const productBrand = p.brand.trim().toLowerCase();
          const isMatch = selectedBrands.some(selectedBrand => 
            selectedBrand.trim().toLowerCase() === productBrand
          );
          
          return isMatch;
        });
      }
      
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error:", error);
      setProducts([]);
      setLoading(false);
    }
  };



  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };



  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrands([]);
    setSearchBrand("");
  };



  const filteredBrands = brands.filter(brand => 
    brand.toLowerCase().includes(searchBrand.toLowerCase())
  );


  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
    const toast = document.createElement('div');
    toast.textContent = `✅ ${product.name} added to cart!`;
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
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };


  const handleNavigate = (path) => {
    setIsPageTransitioning(true);
    setTimeout(() => {
      navigate(path);
    }, 300);
  };


  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      const toast = document.createElement('div');
      toast.textContent = `✅ Thank you for subscribing!`;
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
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      setEmail("");
    }
  };


  const getSelectedCategoryName = () => {
    const category = categories.find(c => c.value === selectedCategory);
    return category ? category.name : "All Items";
  };



  return (
    <div style={styles.page}>
      <style>{keyframesCSS}</style>


      {isPageTransitioning && (
        <div style={styles.pageTransitionOverlay} />
      )}


      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          style={styles.scrollTopBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(196, 255, 13, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(196, 255, 13, 0.4)";
          }}
        >
          <FiArrowUp style={{ fontSize: "24px" }} />
        </button>
      )}


      {/* ==================== HERO SECTION ==================== */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <span style={styles.heroTag}>NEW GENERATION</span>
            <h1 style={styles.heroTitle}>
              The Future of<br />
              <span style={styles.heroTitleGradientWrapper}>
                <span style={styles.heroTitleGradient}>Technology</span>
              </span>
            </h1>
            <p style={styles.heroSubtitle}>
              Discover the world's most advanced tech products with exclusive deals
            </p>
            <div style={styles.heroButtons}>
              <button 
                onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })} 
                style={styles.heroCTA}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(196, 255, 13, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(196, 255, 13, 0.3)";
                }}
              >
                <FiShoppingCart style={{ marginRight: "10px" }} />
                EXPLORE PRODUCTS
              </button>
            </div>
          </div>
          
          <div style={styles.statsGrid}>
            <div 
              style={styles.statCard}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={styles.statNumber}>500+</div>
              <div style={styles.statLabel}>PRODUCTS</div>
            </div>
            <div 
              style={styles.statCard}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={styles.statNumber}>50K+</div>
              <div style={styles.statLabel}>CUSTOMERS</div>
            </div>
            <div 
              style={styles.statCard}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={styles.statNumber}>98%</div>
              <div style={styles.statLabel}>SATISFACTION</div>
            </div>
          </div>
        </div>
      </section>


      {/* ==================== CATEGORIES ==================== */}
      <section id="categories" data-animate style={styles.categoriesSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Browse by Category</h2>
          <div style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <div
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                style={{
                  ...styles.categoryCard,
                  ...(selectedCategory === category.value && styles.categoryCardActive),
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.05)";
                  e.currentTarget.style.borderColor = category.color;
                  e.currentTarget.style.boxShadow = `0 12px 32px ${category.color}40`;
                }}
                onMouseLeave={(e) => {
                  const isActive = selectedCategory === category.value;
                  e.currentTarget.style.transform = isActive ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)";
                  e.currentTarget.style.borderColor = isActive ? "#c4ff0d" : "#1a1a1a";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span style={{
                  ...styles.categoryIcon,
                  color: selectedCategory === category.value ? "#c4ff0d" : category.color
                }}>
                  {category.icon}
                </span>
                <span style={styles.categoryName}>{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ==================== PRODUCTS ==================== */}
      <section id="products" data-animate style={styles.productsSection}>
        <div style={styles.containerFull}>
          <div style={styles.breadcrumb}>
            <Link 
              to="/" 
              style={styles.breadcrumbLink}
              onMouseEnter={(e) => e.currentTarget.style.color = "#c4ff0d"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#666"}
            >
              Home
            </Link>
            <MdKeyboardArrowRight style={styles.breadcrumbSeparator} />
            <span style={styles.breadcrumbCurrent}>{getSelectedCategoryName()}</span>
          </div>


          <div style={styles.productsLayout}>
            <aside style={styles.sidebar}>
              <div style={styles.filterHeader}>
                <div style={styles.filterTitleContainer}>
                  <FiFilter style={styles.filterIcon} />
                  <h3 style={styles.filterTitle}>Filters</h3>
                </div>
                {(selectedBrands.length > 0 || selectedCategory !== "all") && (
                  <button 
                    onClick={resetFilters} 
                    style={styles.resetBtn}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#c4ff0d15";
                      e.currentTarget.style.borderColor = "#c4ff0d";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "#2a2a2a";
                    }}
                  >
                    <FiX style={{ marginRight: "4px" }} />
                    Reset
                  </button>
                )}
              </div>


              <div style={styles.filterSection}>
                <h4 style={styles.filterSectionTitle}>BRAND</h4>
                <div style={styles.searchInputContainer}>
                  <FiSearch style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search brands"
                    value={searchBrand}
                    onChange={(e) => setSearchBrand(e.target.value)}
                    style={styles.searchInput}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#c4ff0d";
                      e.currentTarget.style.backgroundColor = "#0f0f0f";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#2a2a2a";
                      e.currentTarget.style.backgroundColor = "#1a1a1a";
                    }}
                  />
                </div>
                
                {selectedBrands.length > 0 && (
                  <div style={{ marginBottom: "12px", fontSize: "12px", color: "#c4ff0d", fontWeight: "600" }}>
                    ✓ {selectedBrands.length} brand(s) selected
                  </div>
                )}
                
                <div style={styles.brandsList}>
                  {filteredBrands.map(brand => (
                    <label 
                      key={brand} 
                      style={styles.checkboxLabel}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#1a1a1a";
                        e.currentTarget.style.paddingLeft = "8px";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.paddingLeft = "0";
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        style={styles.checkbox}
                      />
                      <span style={styles.brandName}>{brand}</span>
                    </label>
                  ))}
                </div>
                {filteredBrands.length === 0 && (
                  <p style={styles.noResultsText}>No brands found</p>
                )}
              </div>
            </aside>


            <main style={styles.productsMain}>
              {loading ? (
                <div style={styles.loadingContainer}>
                  <div style={styles.spinner}></div>
                  <p style={styles.loadingText}>Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div style={styles.emptyState}>
                  <FiSearch style={styles.emptyIcon} />
                  <h3 style={styles.emptyTitle}>No products found</h3>
                  <p style={{ color: "#666", marginBottom: "20px" }}>
                    Try adjusting your filters
                  </p>
                  <button 
                    onClick={resetFilters} 
                    style={styles.resetFiltersBtn}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(196, 255, 13, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div style={styles.productsGrid}>
                  {products.map((product, index) => (
                    <div
                      key={product._id}
                      style={{
                        ...styles.productCard,
                        ...(hoveredProduct === product._id && styles.productCardHover),
                        animationDelay: `${index * 0.05}s`
                      }}
                      onMouseEnter={() => setHoveredProduct(product._id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <div 
                        style={styles.productImageContainer}
                        onClick={() => handleNavigate(`/product/${product._id}`)}
                      >
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span style={styles.saleBadge}>
                            SALE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </span>
                        )}
                        
                        <button 
                          style={{
                            ...styles.wishlistBtn,
                            ...(isInWishlist(product._id) && styles.wishlistBtnActive)
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isInWishlist(product._id)) {
                              removeFromWishlist(product._id);
                            } else {
                              addToWishlist(product);
                            }
                          }}
                          onMouseEnter={(e) => {
                            if (!isInWishlist(product._id)) {
                              e.currentTarget.style.backgroundColor = "#c4ff0d";
                              e.currentTarget.style.borderColor = "#c4ff0d";
                              e.currentTarget.style.color = "#000";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isInWishlist(product._id)) {
                              e.currentTarget.style.backgroundColor = "#0f0f0f";
                              e.currentTarget.style.borderColor = "#2a2a2a";
                              e.currentTarget.style.color = "#fff";
                            }
                          }}
                        >
                          <FiHeart style={{ 
                            fill: isInWishlist(product._id) ? '#c4ff0d' : 'none' 
                          }} />
                        </button>
                        
                        <img
                          src={product.images?.[0] || "https://via.placeholder.com/300"}
                          alt={product.name}
                          style={{
                            ...styles.productImage,
                            transform: hoveredProduct === product._id ? "scale(1.1)" : "scale(1)"
                          }}
                        />
                      </div>


                      <div style={styles.productInfo}>
                        <span style={styles.productBrand}>{product.brand?.toUpperCase() || "UNKNOWN"}</span>
                        <h3 
                          style={styles.productName}
                          onClick={() => handleNavigate(`/product/${product._id}`)}
                          onMouseEnter={(e) => e.currentTarget.style.color = "#c4ff0d"}
                          onMouseLeave={(e) => e.currentTarget.style.color = "#fff"}
                        >
                          {product.name}
                        </h3>
                        
                        <div style={styles.rating}>
                          {[...Array(5)].map((_, i) => (
                            <AiFillStar key={i} style={styles.star} />
                          ))}
                          <span style={styles.ratingValue}>{product.rating || 4.8}</span>
                        </div>


                        <div style={styles.priceContainer}>
                          <span style={styles.price}>${product.price}.00</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span style={styles.originalPrice}>${product.originalPrice}.00</span>
                          )}
                        </div>


                        <div style={styles.productActions}>
                          <button
                            onClick={() => handleNavigate(`/product/${product._id}`)}
                            style={styles.viewDetailsBtn}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#c4ff0d";
                              e.currentTarget.style.color = "#000";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.color = "#c4ff0d";
                            }}
                          >
                            <FiEye style={{ marginRight: "6px" }} />
                            View
                          </button>
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            style={styles.addToCartBtn}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.1)";
                              e.currentTarget.style.boxShadow = "0 4px 16px rgba(196, 255, 13, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <FiShoppingCart />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>


      {/* ==================== FEATURES ==================== */}
      <section id="features" data-animate style={styles.featuresSection}>
        <div style={styles.container}>
          <div style={styles.featuresGrid}>
            <div 
              style={styles.featureCard}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-8px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={styles.featureIconContainer}>
                <FiTruck style={styles.featureIcon} />
              </div>
              <h3 style={styles.featureTitle}>Free Delivery</h3>
              <p style={styles.featureText}>On all orders over $100</p>
            </div>

            <div 
              style={styles.featureCard}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-8px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={styles.featureIconContainer}>
                <FiLock style={styles.featureIcon} />
              </div>
              <h3 style={styles.featureTitle}>Secure Payment</h3>
              <p style={styles.featureText}>100% secure transactions</p>
            </div>

            <div 
              style={styles.featureCard}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-8px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={styles.featureIconContainer}>
                <FiRotateCcw style={styles.featureIcon} />
              </div>
              <h3 style={styles.featureTitle}>Easy Returns</h3>
              <p style={styles.featureText}>30-day return policy</p>
            </div>

            <div 
              style={styles.featureCard}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-8px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={styles.featureIconContainer}>
                <FiMessageCircle style={styles.featureIcon} />
              </div>
              <h3 style={styles.featureTitle}>24/7 Support</h3>
              <p style={styles.featureText}>Dedicated support</p>
            </div>
          </div>
        </div>
      </section>


      {/* ==================== NEWSLETTER ==================== */}
      <section id="newsletter" data-animate style={styles.newsletterSection}>
        <div style={styles.container}>
          <div style={styles.newsletterCard}>
            <div style={styles.newsletterGlow}></div>
            
            <div style={styles.newsletterContent}>
              <div style={styles.newsletterIconContainer}>
                <FiMail style={styles.newsletterIcon} />
              </div>
              
              <h2 style={styles.newsletterTitle}>Subscribe to Our Newsletter</h2>
              
              <p style={styles.newsletterText}>
                Get the latest updates on new products and exclusive deals delivered to your inbox
              </p>
              
              <form onSubmit={handleNewsletterSubmit} style={styles.newsletterForm}>
                <div style={styles.newsletterInputWrapper}>
                  <FiMail style={styles.newsletterInputIcon} />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.newsletterInput}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#c4ff0d";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(196, 255, 13, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#2a2a2a";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
                
                <button 
                  type="submit" 
                  style={styles.newsletterButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(196, 255, 13, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <FiSend style={{ marginRight: "8px", fontSize: "18px" }} />
                  SUBSCRIBE
                </button>
              </form>
              
              <div style={styles.newsletterDisclaimer}>
                <FiLock style={{ fontSize: "14px", marginRight: "6px" }} />
                We respect your privacy. Unsubscribe at any time.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



const keyframesCSS = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { 
      transform: scale(1); 
      opacity: 1; 
    }
    50% { 
      transform: scale(1.05); 
      opacity: 0.9; 
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
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

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: translateY(100px) scale(0.5);
    }
    60% {
      opacity: 1;
      transform: translateY(-10px) scale(1.1);
    }
    100% {
      transform: translateY(0) scale(1);
    }
  }

  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(196, 255, 13, 0.2), 0 0 40px rgba(196, 255, 13, 0.1);
    }
    50% {
      box-shadow: 0 0 30px rgba(196, 255, 13, 0.4), 0 0 60px rgba(196, 255, 13, 0.2);
    }
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
`;



const styles = {
  page: {
    backgroundColor: "#000",
    minHeight: "100vh"
  },

  scrollTopBtn: {
    position: "fixed",
    bottom: "40px",
    right: "40px",
    width: "56px",
    height: "56px",
    backgroundColor: "#c4ff0d",
    border: "none",
    borderRadius: "50%",
    color: "#000",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    boxShadow: "0 8px 24px rgba(196, 255, 13, 0.4)",
    transition: "all 0.3s ease",
    animation: "float 3s ease-in-out infinite"
  },

  pageTransitionOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "#000",
    zIndex: 999999,
    animation: "fadeIn 0.3s ease-out"
  },
  
  hero: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
    padding: "0 40px"
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at 50% 50%, rgba(196, 255, 13, 0.08) 0%, transparent 60%)",
    pointerEvents: "none",
    animation: "pulse 4s ease-in-out infinite"
  },
  heroContent: {
    maxWidth: "1400px",
    width: "100%",
    position: "relative",
    zIndex: 1
  },
  heroText: {
    maxWidth: "700px",
    marginBottom: "60px",
    animation: "fadeInUp 1s ease"
  },
  heroTag: {
    display: "inline-block",
    padding: "10px 24px",
    backgroundColor: "#c4ff0d15",
    border: "1px solid #c4ff0d",
    borderRadius: "30px",
    color: "#c4ff0d",
    fontSize: "12px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginBottom: "24px",
    animation: "pulse 2s ease-in-out infinite"
  },
  heroTitle: {
    fontSize: "72px",
    fontWeight: "900",
    color: "#fff",
    lineHeight: "1.1",
    marginBottom: "24px",
    letterSpacing: "-3px"
  },
  heroTitleGradientWrapper: {
    position: "relative",
    display: "inline-block"
  },
  heroTitleGradient: {
    background: "linear-gradient(135deg, #c4ff0d 0%, #9fff00 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  heroSubtitle: {
    fontSize: "18px",
    color: "#888",
    lineHeight: "1.8",
    marginBottom: "40px",
    maxWidth: "550px"
  },
  heroButtons: {
    display: "flex",
    gap: "16px"
  },
  heroCTA: {
    display: "flex",
    alignItems: "center",
    padding: "18px 40px",
    backgroundColor: "#c4ff0d",
    border: "none",
    borderRadius: "12px",
    color: "#000",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "1px",
    transform: "translateY(0)",
    boxShadow: "0 4px 15px rgba(196, 255, 13, 0.3)"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "48px",
    maxWidth: "800px"
  },
  statCard: {
    textAlign: "left",
    animation: "scaleIn 0.8s ease",
    transition: "transform 0.3s ease"
  },
  statNumber: {
    fontSize: "48px",
    fontWeight: "900",
    color: "#c4ff0d",
    marginBottom: "8px",
    lineHeight: "1"
  },
  statLabel: {
    fontSize: "12px",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    fontWeight: "700"
  },

  categoriesSection: {
    padding: "80px 0",
    backgroundColor: "#0a0a0a"
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 40px"
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "40px",
    textAlign: "center",
    animation: "fadeInUp 0.6s ease"
  },
  categoriesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "16px"
  },
  categoryCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
    padding: "28px 16px",
    backgroundColor: "#0f0f0f",
    border: "2px solid #1a1a1a",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    animation: "scaleIn 0.5s ease-out forwards",
    opacity: 0,
    transform: "translateY(0) scale(1)"
  },
  categoryCardActive: {
    backgroundColor: "#c4ff0d15",
    borderColor: "#c4ff0d",
    transform: "translateY(-4px) scale(1.02)"
  },
  categoryIcon: {
    fontSize: "40px",
    transition: "all 0.3s ease"
  },
  categoryName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    transition: "color 0.3s ease"
  },

  productsSection: {
    padding: "80px 0",
    backgroundColor: "#000"
  },
  containerFull: {
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "0 40px"
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "32px",
    animation: "slideInLeft 0.5s ease"
  },
  breadcrumbLink: {
    color: "#666",
    textDecoration: "none",
    fontSize: "14px",
    transition: "color 0.3s ease"
  },
  breadcrumbSeparator: {
    color: "#666",
    fontSize: "16px"
  },
  breadcrumbCurrent: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600"
  },
  productsLayout: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "32px"
  },
  
  sidebar: {
    backgroundColor: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: "16px",
    padding: "24px",
    height: "fit-content",
    position: "sticky",
    top: "100px",
    animation: "slideInLeft 0.6s ease"
  },
  filterHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "1px solid #1a1a1a"
  },
  filterTitleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  filterIcon: {
    fontSize: "20px",
    color: "#c4ff0d"
  },
  filterTitle: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#fff",
    margin: 0
  },
  resetBtn: {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    backgroundColor: "transparent",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    color: "#c4ff0d",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  filterSection: {
    marginBottom: "24px"
  },
  filterSectionTitle: {
    fontSize: "12px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "16px",
    textTransform: "uppercase",
    letterSpacing: "1.5px"
  },
  searchInputContainer: {
    position: "relative",
    marginBottom: "16px"
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#666",
    fontSize: "16px"
  },
  searchInput: {
    width: "100%",
    padding: "12px 14px 12px 40px",
    backgroundColor: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.3s ease"
  },
  brandsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    padding: "0",
    borderRadius: "6px",
    transition: "all 0.2s ease"
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#c4ff0d"
  },
  brandName: {
    fontSize: "14px",
    color: "#ddd",
    fontWeight: "500"
  },
  noResultsText: {
    fontSize: "14px",
    color: "#666",
    textAlign: "center",
    padding: "20px 0"
  },

  productsMain: {
    minHeight: "600px"
  },
  
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px"
  },
  productCard: {
    backgroundColor: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: "14px",
    overflow: "hidden",
    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    animation: "scaleIn 0.5s ease-out forwards",
    opacity: 0
  },
  productCardHover: {
    transform: "translateY(-12px) scale(1.02)",
    boxShadow: "0 20px 60px rgba(196, 255, 13, 0.3)",
    borderColor: "#c4ff0d"
  },
  productImageContainer: {
    position: "relative",
    backgroundColor: "#1a1a1a",
    padding: "24px",
    height: "220px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    overflow: "hidden"
  },
  saleBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    padding: "4px 10px",
    backgroundColor: "#c4ff0d",
    color: "#000",
    fontSize: "10px",
    fontWeight: "800",
    borderRadius: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    zIndex: 2,
    animation: "pulse 2s ease-in-out infinite"
  },
  wishlistBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#0f0f0f",
    border: "1px solid #2a2a2a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "16px",
    color: "#fff",
    transition: "all 0.3s ease",
    zIndex: 2
  },
  wishlistBtnActive: {
    backgroundColor: "#c4ff0d",
    borderColor: "#c4ff0d",
    color: "#000",
    animation: "bounceIn 0.4s ease"
  },
  productImage: {
    maxWidth: "100%",
    maxHeight: "180px",
    objectFit: "contain",
    transition: "transform 0.3s ease"
  },
  productInfo: {
    padding: "16px"
  },
  productBrand: {
    fontSize: "10px",
    fontWeight: "800",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "6px",
    display: "block"
  },
  productName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "10px",
    lineHeight: "1.4",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    cursor: "pointer",
    transition: "color 0.2s ease"
  },
  rating: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "10px"
  },
  star: {
    color: "#c4ff0d",
    fontSize: "12px"
  },
  ratingValue: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#c4ff0d"
  },
  priceContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "14px"
  },
  price: {
    fontSize: "20px",
    fontWeight: "900",
    color: "#fff"
  },
  originalPrice: {
    fontSize: "14px",
    color: "#666",
    textDecoration: "line-through"
  },
  productActions: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "8px"
  },
  viewDetailsBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    backgroundColor: "transparent",
    border: "2px solid #c4ff0d",
    borderRadius: "8px",
    color: "#c4ff0d",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },
  addToCartBtn: {
    width: "44px",
    height: "44px",
    backgroundColor: "#c4ff0d",
    border: "none",
    borderRadius: "8px",
    color: "#000",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease"
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    gap: "16px"
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #1a1a1a",
    borderTop: "4px solid #c4ff0d",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  loadingText: {
    color: "#666",
    fontSize: "16px"
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    animation: "fadeInUp 0.6s ease"
  },
  emptyIcon: {
    fontSize: "64px",
    color: "#2a2a2a",
    marginBottom: "20px"
  },
  emptyTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "20px"
  },
  resetFiltersBtn: {
    padding: "14px 32px",
    backgroundColor: "#c4ff0d",
    border: "none",
    borderRadius: "10px",
    color: "#000",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease"
  },

  featuresSection: {
    padding: "80px 0",
    backgroundColor: "#0a0a0a"
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "32px"
  },
  featureCard: {
    textAlign: "center",
    padding: "32px 16px",
    animation: "fadeInUp 0.6s ease",
    transition: "transform 0.3s ease"
  },
  featureIconContainer: {
    width: "72px",
    height: "72px",
    margin: "0 auto 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#c4ff0d15",
    borderRadius: "50%",
    border: "2px solid #c4ff0d",
    animation: "pulse 3s ease-in-out infinite"
  },
  featureIcon: {
    fontSize: "32px",
    color: "#c4ff0d"
  },
  featureTitle: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "8px"
  },
  featureText: {
    fontSize: "14px",
    color: "#666"
  },

  newsletterSection: {
    padding: "80px 0",
    backgroundColor: "#000",
    position: "relative"
  },
  newsletterCard: {
    position: "relative",
    background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
    border: "2px solid #c4ff0d",
    borderRadius: "24px",
    padding: "60px 40px",
    textAlign: "center",
    overflow: "hidden",
    animation: "glow 3s ease-in-out infinite"
  },
  newsletterGlow: {
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background: "radial-gradient(circle, rgba(196, 255, 13, 0.1) 0%, transparent 70%)",
    animation: "rotate 20s linear infinite",
    pointerEvents: "none"
  },
  newsletterContent: {
    maxWidth: "700px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1
  },
  newsletterIconContainer: {
    width: "80px",
    height: "80px",
    margin: "0 auto 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#c4ff0d",
    borderRadius: "50%",
    animation: "pulse 2s ease-in-out infinite"
  },
  newsletterIcon: {
    fontSize: "40px",
    color: "#000"
  },
  newsletterTitle: {
    fontSize: "38px",
    fontWeight: "900",
    color: "#fff",
    marginBottom: "16px",
    letterSpacing: "-1px",
    animation: "fadeInUp 0.8s ease"
  },
  newsletterText: {
    fontSize: "16px",
    color: "#888",
    lineHeight: "1.8",
    marginBottom: "40px",
    maxWidth: "600px",
    margin: "0 auto 40px"
  },
  newsletterForm: {
    display: "flex",
    gap: "12px",
    maxWidth: "600px",
    margin: "0 auto 24px",
    alignItems: "stretch"
  },
  newsletterInputWrapper: {
    position: "relative",
    flex: 1
  },
  newsletterInputIcon: {
    position: "absolute",
    left: "20px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#666",
    fontSize: "20px",
    zIndex: 1
  },
  newsletterInput: {
    width: "100%",
    padding: "18px 20px 18px 52px",
    backgroundColor: "#0a0a0a",
    border: "2px solid #2a2a2a",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.3s ease",
    fontWeight: "500"
  },
  newsletterButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "18px 36px",
    backgroundColor: "#c4ff0d",
    border: "none",
    borderRadius: "12px",
    color: "#000",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "1px",
    whiteSpace: "nowrap"
  },
  newsletterDisclaimer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    color: "#666",
    marginTop: "20px"
  }
};
