import { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import {
  FiUsers, FiPackage, FiShoppingCart, FiDollarSign, FiEdit, FiTrash2,
  FiPlus, FiEye, FiClock, FiTruck, FiCheckCircle, FiX, FiSave,
  FiSearch, FiDownload, FiAlertTriangle, FiMail, FiCalendar,
  FiShield, FiBarChart2, FiTrendingUp, FiActivity, FiLayers,
  FiFilter, FiRefreshCw
} from "react-icons/fi";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Product Management States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "", brand: "", price: "", category: "",
    description: "", stock: "", images: [""]
  });

  // ✅ AJOUT: Customer Search State
  const [customerSearch, setCustomerSearch] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!user.isAdmin && user.role !== "admin") {
      alert("Access Denied! Admin only.");
      navigate("/");
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = async () => {
    try {
      const [productsRes, usersRes, ordersRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5001/api/products").catch(() => ({ data: [] })),
        axios.get("http://localhost:5001/api/admin/users").catch(() => ({ data: [] })),
        axios.get("http://localhost:5001/api/admin/orders").catch(() => ({ data: [] })),
        axios.get("http://localhost:5001/api/admin/stats").catch(() => ({
          data: { totalRevenue: 0, totalOrders: 0, totalUsers: 0, totalProducts: 0 }
        }))
      ]);

      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  // FILTRAGE ET TRI
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (productSearch) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    if (stockFilter === "in-stock") {
      filtered = filtered.filter(p => p.stock >= 10);
    } else if (stockFilter === "low-stock") {
      filtered = filtered.filter(p => p.stock > 0 && p.stock < 10);
    } else if (stockFilter === "out-of-stock") {
      filtered = filtered.filter(p => p.stock === 0);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest": return new Date(a.createdAt) - new Date(b.createdAt);
        case "name-asc": return a.name.localeCompare(b.name);
        case "name-desc": return b.name.localeCompare(a.name);
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "stock-asc": return a.stock - b.stock;
        case "stock-desc": return b.stock - a.stock;
        default: return 0;
      }
    });

    return filtered;
  }, [products, productSearch, categoryFilter, stockFilter, sortBy]);

  // ✅ AJOUT: FILTRAGE DES CUSTOMERS
  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return users;
    
    return users.filter(customer =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.email.toLowerCase().includes(customerSearch.toLowerCase())
    );
  }, [users, customerSearch]);

  // PRODUCT OPERATIONS
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p._id));
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "", brand: "", price: "", category: "",
      description: "", stock: "", images: [""]
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      brand: product.brand,
      price: product.price,
      category: product.category,
      description: product.description || "",
      stock: product.stock || 0,
      images: product.images || [""]
    });
    setShowProductModal(true);
  };

  const handleViewProduct = (product) => {
    setViewingProduct(product);
    setShowViewModal(true);
  };

  const handleDeleteProductConfirm = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await axios.delete(`http://localhost:5001/api/products/${productToDelete._id}`);
      alert(`"${productToDelete.name}" deleted successfully!`);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
      loadData();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product!");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedProducts.length} product(s)? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await Promise.all(
        selectedProducts.map(id => axios.delete(`http://localhost:5001/api/products/${id}`))
      );
      alert(`${selectedProducts.length} product(s) deleted successfully!`);
      setSelectedProducts([]);
      loadData();
    } catch (error) {
      console.error("Error bulk deleting products:", error);
      alert("Failed to delete some products!");
    }
  };

  const handleSaveProduct = async () => {
    try {
      if (!productForm.name || !productForm.brand || !productForm.price || !productForm.category) {
        alert("Please fill in all required fields!");
        return;
      }

      const productData = {
        name: productForm.name,
        brand: productForm.brand,
        price: parseFloat(productForm.price),
        category: productForm.category,
        description: productForm.description || "",
        stock: parseInt(productForm.stock) || 0,
        images: productForm.images.filter(img => img.trim() !== "")
      };

      if (editingProduct) {
        await axios.put(`http://localhost:5001/api/products/${editingProduct._id}`, productData);
        alert(`"${productData.name}" updated successfully!`);
      } else {
        await axios.post("http://localhost:5001/api/products", productData);
        alert(`"${productData.name}" created successfully!`);
      }

      setShowProductModal(false);
      loadData();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product!");
    }
  };

  const handleExportProducts = () => {
    const csvContent = convertToCSV(filteredProducts);
    downloadCSV(csvContent, "products");
  };

  const convertToCSV = (data) => {
    const headers = ["ID", "Name", "Brand", "Category", "Price", "Stock", "Status"];
    const rows = data.map(p => [
      p._id,
      p.name,
      p.brand,
      p.category,
      p.price,
      p.stock,
      p.stock === 0 ? "Out of Stock" : (p.stock < 10 ? "Low Stock" : "In Stock")
    ]);
    return [headers.join(","), ...rows.map(row => row.map(cell => `"${cell}"`).join(","))].join("\n");
  };

  const downloadCSV = (csvContent, type) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${type}-${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageChange = (index, value) => {
    const newImages = [...productForm.images];
    newImages[index] = value;
    setProductForm({ ...productForm, images: newImages });
  };

  const addImageField = () => {
    setProductForm({ ...productForm, images: [...productForm.images, ""] });
  };

  const removeImageField = (index) => {
    const newImages = productForm.images.filter((_, i) => i !== index);
    setProductForm({ ...productForm, images: newImages });
  };

  // ORDER MANAGEMENT
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5001/api/admin/orders/${orderId}/status`, {
        status: newStatus
      });
      alert(`Order status updated to "${newStatus}"!`);
      loadData();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order status!");
    }
  };

  // ✅ FIX: Correction de handleDeleteOrder
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    
    try {
      await axios.delete(`http://localhost:5001/api/admin/orders/${orderId}`);
      alert("Order deleted successfully!");
      loadData();
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order!");
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "delivered": return { label: "Delivered", color: "#00ff00", icon: FiCheckCircle };
      case "shipping": return { label: "Shipping", color: "#5ac8fa", icon: FiTruck };
      case "processing": return { label: "Processing", color: "#ffcc00", icon: FiClock };
      case "confirmed": return { label: "Confirmed", color: "#5ac8fa", icon: FiCheckCircle };
      case "cancelled": return { label: "Cancelled", color: "#ff3b30", icon: FiX };
      default: return { label: "Unknown", color: "#666", icon: FiPackage };
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      "#c4ff0d", "#ff6b35", "#4a90e2", "#5ac8fa", "#af52de",
      "#ffcc00", "#30d158", "#ff2d55", "#ff9500", "#00c7be"
    ];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <style>{keyframes}</style>
        <div style={styles.spinnerContainer}>
          <div style={styles.spinner}></div>
          <FiActivity style={styles.spinnerIcon} />
        </div>
        <p style={styles.loadingText}>Loading Dashboard...</p>
        <p style={styles.loadingSubtext}>Preparing your analytics</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* ULTRA-PRO HEADER */}
        <div style={styles.headerPro}>
          <div style={styles.headerLeft}>
            <div style={styles.logoContainer}>
              <FiLayers style={styles.logoIcon} />
              <div>
                <h1 style={styles.titlePro}>Admin Dashboard</h1>
                <p style={styles.subtitlePro}>
                  Welcome back, <span style={{ color: "#c4ff0d" }}>{user?.name || "Admin"}</span>
                </p>
              </div>
            </div>
          </div>
          <div style={styles.headerRight}>
            <button
              onClick={loadData}
              style={styles.refreshBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#c4ff0d20";
                e.currentTarget.style.borderColor = "#c4ff0d";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "#2a2a2a";
              }}
            >
              <FiRefreshCw style={{ fontSize: "18px" }} />
            </button>
            <div style={styles.adminBadgePro}>
              <FiShield style={{ marginRight: "8px" }} />
              ADMIN
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              style={styles.logoutBtnPro}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ff3b30";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#ff3b30";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <FiX style={{ marginRight: "8px" }} />
              Logout
            </button>
          </div>
        </div>

        {/* ULTRA-PRO TABS */}
        <div style={styles.tabsPro}>
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              ...styles.tabPro,
              ...(activeTab === "overview" ? styles.tabActivePro : {})
            }}
          >
            <FiBarChart2 style={{ fontSize: "18px" }} />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            style={{
              ...styles.tabPro,
              ...(activeTab === "products" ? styles.tabActivePro : {})
            }}
          >
            <FiPackage style={{ fontSize: "18px" }} />
            <span>Products</span>
            <span style={styles.tabBadgePro}>{products.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            style={{
              ...styles.tabPro,
              ...(activeTab === "orders" ? styles.tabActivePro : {})
            }}
          >
            <FiShoppingCart style={{ fontSize: "18px" }} />
            <span>Orders</span>
            <span style={styles.tabBadgePro}>{orders.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            style={{
              ...styles.tabPro,
              ...(activeTab === "customers" ? styles.tabActivePro : {})
            }}
          >
            <FiUsers style={{ fontSize: "18px" }} />
            <span>Customers</span>
            <span style={styles.tabBadgePro}>{users.length}</span>
          </button>
        </div>

        {/* OVERVIEW TAB - ULTRA PRO */}
        {activeTab === "overview" && stats && (
          <div style={styles.content}>
            {/* Stats Grid Ultra Pro */}
            <div style={styles.statsGridPro}>
              <div style={styles.statCardPro}>
                <div style={styles.statCardHeader}>
                  <div style={{ ...styles.statIconPro, background: "linear-gradient(135deg, #c4ff0d 0%, #9acc0a 100%)" }}>
                    <FiDollarSign />
                  </div>
                  <div style={styles.statTrend}>
                    <FiTrendingUp style={{ fontSize: "14px", color: "#00ff00" }} />
                    <span>+12%</span>
                  </div>
                </div>
                <div style={styles.statCardBody}>
                  <div style={styles.statLabelPro}>Total Revenue</div>
                  <div style={styles.statValuePro}>${stats.totalRevenue?.toFixed(2) || "0.00"}</div>
                  <div style={styles.statProgress}>
                    <div style={{ ...styles.statProgressBar, width: "75%", backgroundColor: "#c4ff0d" }}></div>
                  </div>
                </div>
              </div>

              <div style={styles.statCardPro}>
                <div style={styles.statCardHeader}>
                  <div style={{ ...styles.statIconPro, background: "linear-gradient(135deg, #5ac8fa 0%, #3a9fd8 100%)" }}>
                    <FiShoppingCart />
                  </div>
                  <div style={styles.statTrend}>
                    <FiTrendingUp style={{ fontSize: "14px", color: "#00ff00" }} />
                    <span>+8%</span>
                  </div>
                </div>
                <div style={styles.statCardBody}>
                  <div style={styles.statLabelPro}>Total Orders</div>
                  <div style={styles.statValuePro}>{stats.totalOrders || 0}</div>
                  <div style={styles.statProgress}>
                    <div style={{ ...styles.statProgressBar, width: "60%", backgroundColor: "#5ac8fa" }}></div>
                  </div>
                </div>
              </div>

              <div style={styles.statCardPro}>
                <div style={styles.statCardHeader}>
                  <div style={{ ...styles.statIconPro, background: "linear-gradient(135deg, #ff9500 0%, #e67e00 100%)" }}>
                    <FiUsers />
                  </div>
                  <div style={styles.statTrend}>
                    <FiTrendingUp style={{ fontSize: "14px", color: "#00ff00" }} />
                    <span>+15%</span>
                  </div>
                </div>
                <div style={styles.statCardBody}>
                  <div style={styles.statLabelPro}>Total Customers</div>
                  <div style={styles.statValuePro}>{stats.totalUsers || 0}</div>
                  <div style={styles.statProgress}>
                    <div style={{ ...styles.statProgressBar, width: "85%", backgroundColor: "#ff9500" }}></div>
                  </div>
                </div>
              </div>

              <div style={styles.statCardPro}>
                <div style={styles.statCardHeader}>
                  <div style={{ ...styles.statIconPro, background: "linear-gradient(135deg, #00ff00 0%, #00cc00 100%)" }}>
                    <FiPackage />
                  </div>
                  <div style={styles.statTrend}>
                    <FiTrendingUp style={{ fontSize: "14px", color: "#00ff00" }} />
                    <span>+5%</span>
                  </div>
                </div>
                <div style={styles.statCardBody}>
                  <div style={styles.statLabelPro}>Total Products</div>
                  <div style={styles.statValuePro}>{stats.totalProducts || 0}</div>
                  <div style={styles.statProgress}>
                    <div style={{ ...styles.statProgressBar, width: "50%", backgroundColor: "#00ff00" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Insights */}
            <div style={styles.insightsGrid}>
              <div style={styles.insightCard}>
                <FiActivity style={styles.insightIcon} />
                <h3 style={styles.insightTitle}>Recent Activity</h3>
                <p style={styles.insightText}>{orders.length} orders processed today</p>
              </div>
              <div style={styles.insightCard}>
                <FiTrendingUp style={styles.insightIcon} />
                <h3 style={styles.insightTitle}>Growth Rate</h3>
                <p style={styles.insightText}>+12.5% compared to last month</p>
              </div>
              <div style={styles.insightCard}>
                <FiBarChart2 style={styles.insightIcon} />
                <h3 style={styles.insightTitle}>Performance</h3>
                <p style={styles.insightText}>All systems operational</p>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div style={styles.content}>
            {/* GARDE TON CODE PRODUCTS EXISTANT */}
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitlePro}>
                  <FiPackage style={{ marginRight: "12px", color: "#c4ff0d" }} />
                  Product Management
                </h2>
                <p style={styles.sectionSubtitlePro}>
                  {filteredProducts.length} of {products.length} products
                  {selectedProducts.length > 0 && ` • ${selectedProducts.length} selected`}
                </p>
              </div>
              <div style={styles.headerActions}>
                {selectedProducts.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    style={styles.bulkDeleteBtnPro}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ff3b30";
                      e.currentTarget.style.borderColor = "#ff3b30";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "#ff3b30";
                      e.currentTarget.style.color = "#ff3b30";
                    }}
                  >
                    <FiTrash2 style={{ marginRight: "8px" }} />
                    Delete ({selectedProducts.length})
                  </button>
                )}
                <button
                  onClick={handleExportProducts}
                  style={styles.exportBtnPro}
                >
                  <FiDownload style={{ marginRight: "8px" }} />
                  Export
                </button>
                <button
                  onClick={handleAddProduct}
                  style={styles.addBtnPro}
                >
                  <FiPlus style={{ marginRight: "8px" }} />
                  Add Product
                </button>
              </div>
            </div>

            {/* Search & Filters */}
            <div style={styles.filtersBarPro}>
              <div style={styles.searchContainerPro}>
                <FiSearch style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={styles.searchInput}
                />
                {productSearch && (
                  <button
                    onClick={() => setProductSearch("")}
                    style={styles.clearSearchBtn}
                  >
                    <FiX />
                  </button>
                )}
              </div>
              <div style={styles.filterGroupPro}>
                <div style={styles.filterItem}>
                  <FiFilter style={{ fontSize: "16px", marginRight: "8px", color: "#666" }} />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={styles.filterSelectPro}
                  >
                    <option value="all">All Categories</option>
                    <option value="smartphones">Smartphones</option>
                    <option value="laptops">Laptops</option>
                    <option value="tablets">Tablets</option>
                    <option value="accessories">Accessories</option>
                    <option value="wearables">Wearables</option>
                  </select>
                </div>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  style={styles.filterSelectPro}
                >
                  <option value="all">All Stock</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={styles.filterSelectPro}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low-High)</option>
                  <option value="price-desc">Price (High-Low)</option>
                </select>
              </div>
            </div>

            {/* Products Table Pro */}
            <div style={styles.tableContainerPro}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRowPro}>
                    <th style={styles.tableHeaderCellPro}>
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={handleSelectAll}
                        style={styles.checkboxPro}
                      />
                    </th>
                    <th style={styles.tableHeaderCellPro}>PRODUCT</th>
                    <th style={styles.tableHeaderCellPro}>CATEGORY</th>
                    <th style={styles.tableHeaderCellPro}>PRICE</th>
                    <th style={styles.tableHeaderCellPro}>STOCK</th>
                    <th style={styles.tableHeaderCellPro}>STATUS</th>
                    <th style={styles.tableHeaderCellPro}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={styles.emptyStateCell}>
                        <div style={styles.emptyStatePro}>
                          <FiPackage style={styles.emptyIcon} />
                          <p style={styles.emptyText}>No products found</p>
                          <button
                            onClick={() => {
                              setProductSearch("");
                              setCategoryFilter("all");
                              setStockFilter("all");
                            }}
                            style={styles.resetBtn}
                          >
                            Reset Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(product => (
                      <tr key={product._id} style={styles.tableRowPro}>
                        <td style={styles.tableCellPro}>
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => handleSelectProduct(product._id)}
                            style={styles.checkboxPro}
                          />
                        </td>
                        <td style={styles.tableCellPro}>
                          <div style={styles.productCellPro}>
                            <img
                              src={product.images?.[0] || "https://via.placeholder.com/60"}
                              alt={product.name}
                              style={styles.productImagePro}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/60/0f0f0f/c4ff0d?text=No+Image";
                              }}
                            />
                            <div style={styles.productInfoPro}>
                              <div style={styles.productNamePro}>{product.name}</div>
                              <div style={styles.productBrandPro}>{product.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.tableCellPro}>
                          <span style={styles.categoryBadgePro}>
                            {product.category}
                          </span>
                        </td>
                        <td style={styles.tableCellPro}>
                          <span style={styles.productPricePro}>${product.price}</span>
                        </td>
                        <td style={styles.tableCellPro}>
                          <span
                            style={{
                              ...styles.stockBadgePro,
                              ...(product.stock === 0
                                ? styles.stockBadgeOut
                                : product.stock < 10
                                ? styles.stockBadgeLow
                                : styles.stockBadgeIn)
                            }}
                          >
                            {product.stock} units
                          </span>
                        </td>
                        <td style={styles.tableCellPro}>
                          {product.stock === 0 ? (
                            <span style={styles.statusOutPro}>Out of Stock</span>
                          ) : product.stock < 10 ? (
                            <span style={styles.statusLowPro}>Low Stock</span>
                          ) : (
                            <span style={styles.statusInPro}>Available</span>
                          )}
                        </td>
                        <td style={styles.tableCellPro}>
                          <div style={styles.actionButtonsPro}>
                            <button
                              onClick={() => handleViewProduct(product)}
                              style={styles.viewBtnPro}
                              title="View Details"
                            >
                              <FiEye />
                            </button>
                            <button
                              onClick={() => handleEditProduct(product)}
                              style={styles.editBtnPro}
                              title="Edit Product"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteProductConfirm(product)}
                              style={styles.deleteBtnPro}
                              title="Delete Product"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div style={styles.content}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitlePro}>
                <FiShoppingCart style={{ marginRight: "12px", color: "#5ac8fa" }} />
                All Orders ({orders.length})
              </h2>
            </div>

            <div style={styles.ordersTablePro}>
              {orders.map(order => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <div key={order._id} style={styles.orderRowPro}>
                    <div style={styles.orderInfoPro}>
                      <div style={styles.orderNumberPro}>{order.orderNumber}</div>
                      <div style={styles.orderMeta}>
                        <FiUsers style={{ fontSize: "14px", marginRight: "6px" }} />
                        <span>{order.user?.name || "Unknown"}</span>
                        <span style={{ margin: "0 8px", color: "#333" }}>•</span>
                        <FiCalendar style={{ fontSize: "14px", marginRight: "6px" }} />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div style={styles.orderDetailsPro}>
                      <span style={styles.orderItems}>{order.items?.length || 0} items</span>
                      <span style={styles.orderTotalPro}>${order.total?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div
                      style={{
                        ...styles.orderStatusPro,
                        color: statusInfo.color,
                        borderColor: statusInfo.color
                      }}
                    >
                      <statusInfo.icon />
                      <span>{statusInfo.label}</span>
                    </div>
                    <div style={styles.orderActionsPro}>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        style={styles.statusSelectPro}
                      >
                        <option value="processing">Processing</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipping">Shipping</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        style={styles.deleteActionBtnPro}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB ULTRA PRO */}
        {activeTab === "customers" && (
          <div style={styles.content}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitlePro}>
                  <FiUsers style={{ marginRight: "12px", color: "#ff9500" }} />
                  Customer Management
                </h2>
                <p style={styles.sectionSubtitlePro}>
                  {filteredCustomers.length} of {users.length} customers
                </p>
              </div>
              <button
                onClick={() => {
                  const csvData = [
                    "Name,Email,Role,Orders,Spent,Joined",
                    ...users.map(u => {
                      const userOrders = orders.filter(o => o.user?._id === u._id);
                      const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
                      return `"${u.name}","${u.email}","${u.isAdmin ? "Admin" : "Customer"}",${userOrders.length},${totalSpent.toFixed(2)},"${new Date(u.createdAt).toLocaleDateString()}"`;
                    })
                  ].join("\n");
                  downloadCSV(csvData, "customers");
                }}
                style={styles.exportBtnPro}
              >
                <FiDownload style={{ marginRight: "8px" }} />
                Export
              </button>
            </div>

            {/* ✅ AJOUT: Customer Search Bar */}
            <div style={styles.filtersBarPro}>
              <div style={styles.searchContainerPro}>
                <FiSearch style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search customers by name or email..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  style={styles.searchInput}
                />
                {customerSearch && (
                  <button
                    onClick={() => setCustomerSearch("")}
                    style={styles.clearSearchBtn}
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>

            {/* Customers Grid Ultra Pro */}
            <div style={styles.customersGridUltraPro}>
              {filteredCustomers.map(customer => {
                const customerOrders = orders.filter(o => o.user?._id === customer._id);
                const totalSpent = customerOrders.reduce((sum, o) => sum + (o.total || 0), 0);
                const isAdmin = customer.isAdmin || customer.role === "admin";

                return (
                  <div key={customer._id} style={styles.customerCardUltraPro}>
                    <div style={styles.customerCardHeaderPro}>
                      <div
                        style={{
                          ...styles.customerAvatarUltraPro,
                          background: `linear-gradient(135deg, ${getAvatarColor(customer.name)} 0%, ${getAvatarColor(customer.name)}dd 100%)`
                        }}
                      >
                        {getInitials(customer.name)}
                      </div>
                      {isAdmin && (
                        <div style={styles.adminBadgeSmall}>
                          <FiShield style={{ fontSize: "10px" }} />
                        </div>
                      )}
                    </div>
                    <div style={styles.customerInfoPro}>
                      <h3 style={styles.customerNameUltraPro}>{customer.name}</h3>
                      <p style={styles.customerEmailUltraPro}>
                        <FiMail style={{ fontSize: "12px", marginRight: "6px" }} />
                        {customer.email}
                      </p>
                    </div>
                    <div style={styles.customerStatsUltraPro}>
                      <div style={styles.customerStatItemPro}>
                        <div style={{ ...styles.statIconSmall, backgroundColor: "#5ac8fa20", color: "#5ac8fa" }}>
                          <FiShoppingCart />
                        </div>
                        <div>
                          <div style={styles.customerStatNumberPro}>{customerOrders.length}</div>
                          <div style={styles.customerStatLabelPro}>Orders</div>
                        </div>
                      </div>
                      <div style={styles.customerStatItemPro}>
                        <div style={{ ...styles.statIconSmall, backgroundColor: "#c4ff0d20", color: "#c4ff0d" }}>
                          <FiDollarSign />
                        </div>
                        <div>
                          <div style={styles.customerStatNumberPro}>${totalSpent.toFixed(2)}</div>
                          <div style={styles.customerStatLabelPro}>Spent</div>
                        </div>
                      </div>
                      <div style={styles.customerStatItemPro}>
                        <div style={{ ...styles.statIconSmall, backgroundColor: "#ff950020", color: "#ff9500" }}>
                          <FiCalendar />
                        </div>
                        <div>
                          <div style={styles.customerStatNumberPro}>
                            {new Date(customer.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                          <div style={styles.customerStatLabelPro}>Joined</div>
                        </div>
                      </div>
                    </div>
                    <div style={styles.customerActionsPro}>
                      <button style={styles.customerActionBtnPro}>
                        <FiEye />
                      </button>
                      <button style={styles.customerActionBtnPro}>
                        <FiMail />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODALS - GARDE TES MODALS EXISTANTS */}
        {/* Product Modal */}
        {showProductModal && (
          <div style={styles.modal} onClick={() => setShowProductModal(false)}>
            <div style={styles.modalContentPro} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeaderPro}>
                <h2 style={styles.modalTitlePro}>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button onClick={() => setShowProductModal(false)} style={styles.closeBtnPro}>
                  <FiX />
                </button>
              </div>
              <div style={styles.modalBody}>
                <div style={styles.formGroup}>
                  <label style={styles.labelPro}>Product Name</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    style={styles.inputPro}
                    placeholder="iPhone 15 Pro Max"
                  />
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.labelPro}>Brand</label>
                    <input
                      type="text"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      style={styles.inputPro}
                      placeholder="Apple"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.labelPro}>Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      style={styles.inputPro}
                    >
                      <option value="">Select Category</option>
                      <option value="smartphones">Smartphones</option>
                      <option value="laptops">Laptops</option>
                      <option value="tablets">Tablets</option>
                      <option value="accessories">Accessories</option>
                      <option value="wearables">Wearables</option>
                    </select>
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.labelPro}>Price ($)</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      style={styles.inputPro}
                      placeholder="999.99"
                      step="0.01"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.labelPro}>Stock</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      style={styles.inputPro}
                      placeholder="100"
                    />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.labelPro}>Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    style={{ ...styles.inputPro, minHeight: "100px", resize: "vertical" }}
                    placeholder="Product description..."
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.labelPro}>Images (URLs)</label>
                  {productForm.images.map((image, index) => (
                    <div key={index} style={styles.imageInputRow}>
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        style={styles.inputPro}
                        placeholder="https://example.com/image.jpg"
                      />
                      {productForm.images.length > 1 && (
                        <button
                          onClick={() => removeImageField(index)}
                          style={styles.removeImageBtnPro}
                        >
                          <FiX />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={addImageField} style={styles.addImageBtnPro}>
                    <FiPlus style={{ marginRight: "6px" }} />
                    Add Image URL
                  </button>
                </div>
              </div>
              <div style={styles.modalFooterPro}>
                <button onClick={() => setShowProductModal(false)} style={styles.cancelBtnPro}>
                  Cancel
                </button>
                <button onClick={handleSaveProduct} style={styles.saveBtnPro}>
                  <FiSave style={{ marginRight: "8px" }} />
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && productToDelete && (
          <div style={styles.modal} onClick={() => setShowDeleteConfirm(false)}>
            <div style={styles.confirmModalPro} onClick={(e) => e.stopPropagation()}>
              <div style={styles.confirmIconPro}>
                <FiAlertTriangle />
              </div>
              <h2 style={styles.confirmTitlePro}>Delete Product?</h2>
              <p style={styles.confirmTextPro}>
                Are you sure you want to delete <strong>"{productToDelete.name}"</strong>?<br />
                This action cannot be undone.
              </p>
              <div style={styles.confirmActionsPro}>
                <button onClick={() => setShowDeleteConfirm(false)} style={styles.cancelBtnPro}>
                  Cancel
                </button>
                <button onClick={handleDeleteProduct} style={styles.deleteConfirmBtnPro}>
                  <FiTrash2 style={{ marginRight: "8px" }} />
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Product Modal */}
        {showViewModal && viewingProduct && (
          <div style={styles.modal} onClick={() => setShowViewModal(false)}>
            <div style={styles.viewModalContentPro} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeaderPro}>
                <h2 style={styles.modalTitlePro}>Product Details</h2>
                <button onClick={() => setShowViewModal(false)} style={styles.closeBtnPro}>
                  <FiX />
                </button>
              </div>
              <div style={styles.viewModalBodyPro}>
                <div style={styles.viewImageContainerPro}>
                  <img
                    src={viewingProduct.images?.[0] || "https://via.placeholder.com/400"}
                    alt={viewingProduct.name}
                    style={styles.viewImagePro}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400/0f0f0f/c4ff0d?text=No+Image";
                    }}
                  />
                </div>
                <div style={styles.viewDetailsPro}>
                  <div style={styles.viewBrandPro}>{viewingProduct.brand}</div>
                  <h3 style={styles.viewNamePro}>{viewingProduct.name}</h3>
                  <div style={styles.viewPricePro}>${viewingProduct.price}</div>
                  <div style={styles.viewInfoGridPro}>
                    <div style={styles.viewInfoItemPro}>
                      <span style={styles.viewInfoLabelPro}>Category</span>
                      <span style={styles.viewInfoValuePro}>{viewingProduct.category}</span>
                    </div>
                    <div style={styles.viewInfoItemPro}>
                      <span style={styles.viewInfoLabelPro}>Stock</span>
                      <span style={styles.viewInfoValuePro}>{viewingProduct.stock} units</span>
                    </div>
                  </div>
                  {viewingProduct.description && (
                    <div style={styles.viewDescriptionPro}>
                      <h4 style={styles.viewDescTitlePro}>Description</h4>
                      <p style={styles.viewDescTextPro}>{viewingProduct.description}</p>
                    </div>
                  )}
                  <div style={styles.viewActionsPro}>
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        handleEditProduct(viewingProduct);
                      }}
                      style={styles.viewEditBtnPro}
                    >
                      <FiEdit style={{ marginRight: "8px" }} />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setShowViewModal(false);
                        handleDeleteProductConfirm(viewingProduct);
                      }}
                      style={styles.viewDeleteBtnPro}
                    >
                      <FiTrash2 style={{ marginRight: "8px" }} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// KEYFRAMES
const keyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// STYLES ULTRA PRO (GARDE TON CODE STYLES COMPLET)
const styles = {
  page: { backgroundColor: "#000", minHeight: "100vh", paddingTop: "100px", paddingBottom: "80px" },
  container: { maxWidth: "1800px", margin: "0 auto", padding: "0 40px" },
  
  // LOADING ULTRA PRO
  loadingContainer: { minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "24px", backgroundColor: "#000" },
  spinnerContainer: { position: "relative", width: "80px", height: "80px" },
  spinner: { width: "80px", height: "80px", border: "4px solid #1a1a1a", borderTop: "4px solid #c4ff0d", borderRadius: "50%", animation: "spin 1s linear infinite" },
  spinnerIcon: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "32px", color: "#c4ff0d", animation: "pulse 1.5s ease-in-out infinite" },
  loadingText: { color: "#fff", fontSize: "20px", fontWeight: "700", letterSpacing: "-0.5px" },
  loadingSubtext: { color: "#666", fontSize: "14px" },

  // HEADER ULTRA PRO
  headerPro: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px", padding: "24px", backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "20px" },
  headerLeft: { display: "flex", alignItems: "center", gap: "20px" },
  logoContainer: { display: "flex", alignItems: "center", gap: "16px" },
  logoIcon: { fontSize: "48px", color: "#c4ff0d", padding: "12px", backgroundColor: "#c4ff0d20", borderRadius: "14px" },
  titlePro: { fontSize: "32px", fontWeight: "900", color: "#fff", letterSpacing: "-1.5px", margin: 0 },
  subtitlePro: { fontSize: "14px", color: "#666", margin: "4px 0 0 0" },
  headerRight: { display: "flex", alignItems: "center", gap: "16px" },
  refreshBtn: { width: "48px", height: "48px", backgroundColor: "transparent", border: "2px solid #2a2a2a", borderRadius: "12px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" },
  adminBadgePro: { display: "flex", alignItems: "center", padding: "12px 20px", background: "linear-gradient(135deg, #c4ff0d 0%, #9acc0a 100%)", color: "#000", fontSize: "13px", fontWeight: "800", borderRadius: "12px", letterSpacing: "0.5px" },
  logoutBtnPro: { display: "flex", alignItems: "center", padding: "12px 24px", backgroundColor: "transparent", border: "2px solid #ff3b30", borderRadius: "12px", color: "#ff3b30", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.3s" },

  // TABS ULTRA PRO
  tabsPro: { display: "flex", gap: "12px", marginBottom: "40px", padding: "8px", backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "16px" },
  tabPro: { display: "flex", alignItems: "center", gap: "10px", padding: "14px 24px", backgroundColor: "transparent", border: "none", borderRadius: "10px", color: "#666", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s", position: "relative" },
  tabActivePro: { backgroundColor: "#1a1a1a", color: "#c4ff0d", boxShadow: "0 0 20px rgba(196, 255, 13, 0.2)" },
  tabBadgePro: { padding: "4px 10px", backgroundColor: "#c4ff0d", color: "#000", borderRadius: "10px", fontSize: "11px", fontWeight: "800" },

  content: {},

  // STATS GRID ULTRA PRO
  statsGridPro: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "40px" },
  statCardPro: { padding: "24px", backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "20px", transition: "all 0.3s", cursor: "pointer" },
  statCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  statIconPro: { width: "56px", height: "56px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", color: "#000", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" },
  statTrend: { display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", backgroundColor: "#00ff0010", borderRadius: "10px", fontSize: "12px", fontWeight: "700", color: "#00ff00" },
  statCardBody: {},
  statLabelPro: { fontSize: "13px", color: "#666", fontWeight: "600", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" },
  statValuePro: { fontSize: "36px", fontWeight: "900", color: "#fff", letterSpacing: "-2px", marginBottom: "16px" },
  statProgress: { width: "100%", height: "6px", backgroundColor: "#1a1a1a", borderRadius: "10px", overflow: "hidden" },
  statProgressBar: { height: "100%", borderRadius: "10px", transition: "width 0.5s ease" },

  // INSIGHTS
  insightsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" },
  insightCard: { padding: "24px", backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "16px", textAlign: "center" },
  insightIcon: { fontSize: "40px", color: "#c4ff0d", marginBottom: "16px" },
  insightTitle: { fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "8px" },
  insightText: { fontSize: "14px", color: "#666" },

  // SECTION HEADER PRO
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" },
  sectionTitlePro: { display: "flex", alignItems: "center", fontSize: "28px", fontWeight: "800", color: "#fff", letterSpacing: "-1px", marginBottom: "8px" },
  sectionSubtitlePro: { fontSize: "14px", color: "#666", fontWeight: "500" },
  headerActions: { display: "flex", gap: "12px" },
  bulkDeleteBtnPro: { display: "flex", alignItems: "center", padding: "14px 24px", backgroundColor: "transparent", border: "2px solid #ff3b30", borderRadius: "12px", color: "#ff3b30", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.3s" },
  exportBtnPro: { display: "flex", alignItems: "center", padding: "14px 24px", backgroundColor: "#1a1a1a", border: "2px solid #2a2a2a", borderRadius: "12px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.3s" },
  addBtnPro: { display: "flex", alignItems: "center", padding: "14px 28px", background: "linear-gradient(135deg, #c4ff0d 0%, #9acc0a 100%)", border: "none", borderRadius: "12px", color: "#000", fontSize: "14px", fontWeight: "800", cursor: "pointer", transition: "all 0.3s", boxShadow: "0 4px 20px rgba(196, 255, 13, 0.3)" },

  // FILTERS BAR PRO
  filtersBarPro: { display: "flex", gap: "16px", marginBottom: "32px", flexWrap: "wrap" },
  searchContainerPro: { flex: "1", minWidth: "300px", position: "relative" },
  searchIcon: { position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", color: "#666", fontSize: "20px", pointerEvents: "none" },
  searchInput: { width: "100%", padding: "16px 50px", backgroundColor: "#0f0f0f", border: "2px solid #1a1a1a", borderRadius: "14px", color: "#fff", fontSize: "14px", fontWeight: "500", outline: "none", transition: "all 0.3s" },
  clearSearchBtn: { position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", width: "36px", height: "36px", backgroundColor: "#1a1a1a", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" },
  filterGroupPro: { display: "flex", gap: "12px", flexWrap: "wrap" },
  filterItem: { display: "flex", alignItems: "center", gap: "8px", padding: "0 12px", backgroundColor: "#0f0f0f", border: "2px solid #1a1a1a", borderRadius: "14px" },
  filterSelectPro: { padding: "16px 18px", backgroundColor: "#0f0f0f", border: "2px solid #1a1a1a", borderRadius: "14px", color: "#fff", fontSize: "14px", fontWeight: "500", cursor: "pointer", outline: "none", minWidth: "160px", transition: "all 0.3s" },

  // TABLE PRO
  tableContainerPro: { backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "20px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeaderRowPro: { backgroundColor: "#1a1a1a" },
  tableHeaderCellPro: { padding: "18px 24px", textAlign: "left", fontSize: "12px", fontWeight: "800", color: "#c4ff0d", letterSpacing: "1px", borderBottom: "1px solid #2a2a2a" },
  tableRowPro: { transition: "all 0.2s", cursor: "pointer" },
  tableCellPro: { padding: "18px 24px", borderBottom: "1px solid #1a1a1a", fontSize: "14px", color: "#fff", verticalAlign: "middle" },
  checkboxPro: { width: "20px", height: "20px", cursor: "pointer", accentColor: "#c4ff0d" },
  productCellPro: { display: "flex", alignItems: "center", gap: "16px" },
  productImagePro: { width: "64px", height: "64px", objectFit: "cover", borderRadius: "12px", border: "2px solid #1a1a1a" },
  productInfoPro: { flex: "1" },
  productNamePro: { fontSize: "15px", fontWeight: "700", color: "#fff", marginBottom: "4px" },
  productBrandPro: { fontSize: "13px", color: "#666" },
  categoryBadgePro: { display: "inline-block", padding: "6px 14px", backgroundColor: "#c4ff0d20", border: "1px solid #c4ff0d40", borderRadius: "8px", color: "#c4ff0d", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" },
  productPricePro: { fontSize: "18px", fontWeight: "800", color: "#c4ff0d", letterSpacing: "-0.5px" },
  stockBadgePro: { display: "inline-block", padding: "6px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: "700" },
  stockBadgeIn: { backgroundColor: "#00ff0020", color: "#00ff00", border: "1px solid #00ff0040" },
  stockBadgeLow: { backgroundColor: "#ff950020", color: "#ff9500", border: "1px solid #ff950040" },
  stockBadgeOut: { backgroundColor: "#ff3b3020", color: "#ff3b30", border: "1px solid #ff3b3040" },
  statusInPro: { display: "inline-block", padding: "6px 14px", backgroundColor: "#00ff0020", borderRadius: "8px", color: "#00ff00", fontSize: "13px", fontWeight: "700", border: "1px solid #00ff0040" },
  statusLowPro: { display: "inline-block", padding: "6px 14px", backgroundColor: "#ff950020", borderRadius: "8px", color: "#ff9500", fontSize: "13px", fontWeight: "700", border: "1px solid #ff950040" },
  statusOutPro: { display: "inline-block", padding: "6px 14px", backgroundColor: "#ff3b3020", borderRadius: "8px", color: "#ff3b30", fontSize: "13px", fontWeight: "700", border: "1px solid #ff3b3040" },
  actionButtonsPro: { display: "flex", gap: "8px" },
  viewBtnPro: { width: "38px", height: "38px", backgroundColor: "transparent", border: "2px solid #2a2a2a", borderRadius: "10px", color: "#c4ff0d", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", fontSize: "16px" },
  editBtnPro: { width: "38px", height: "38px", backgroundColor: "transparent", border: "2px solid #2a2a2a", borderRadius: "10px", color: "#5ac8fa", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", fontSize: "16px" },
  deleteBtnPro: { width: "38px", height: "38px", backgroundColor: "transparent", border: "2px solid #2a2a2a", borderRadius: "10px", color: "#ff3b30", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", fontSize: "16px" },
  emptyStateCell: { padding: "80px 20px", textAlign: "center" },
  emptyStatePro: { display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" },
  emptyIcon: { fontSize: "64px", color: "#2a2a2a" },
  emptyText: { fontSize: "18px", color: "#666", fontWeight: "600" },
  resetBtn: { padding: "12px 24px", background: "linear-gradient(135deg, #c4ff0d 0%, #9acc0a 100%)", border: "none", borderRadius: "10px", color: "#000", fontSize: "14px", fontWeight: "700", cursor: "pointer" },

  // ORDERS PRO
  ordersTablePro: { display: "flex", flexDirection: "column", gap: "16px" },
  orderRowPro: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px", backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "16px", transition: "all 0.3s" },
  orderInfoPro: {},
  orderNumberPro: { fontSize: "16px", fontWeight: "700", color: "#fff", marginBottom: "8px" },
  orderMeta: { display: "flex", alignItems: "center", fontSize: "13px", color: "#666" },
  orderDetailsPro: { display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-end" },
  orderItems: { fontSize: "14px", color: "#888" },
  orderTotalPro: { fontSize: "20px", fontWeight: "800", color: "#c4ff0d" },
  orderStatusPro: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", border: "2px solid", borderRadius: "10px", fontSize: "13px", fontWeight: "700" },
  orderActionsPro: { display: "flex", gap: "12px" },
  statusSelectPro: { padding: "10px 16px", backgroundColor: "#1a1a1a", border: "2px solid #2a2a2a", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", outline: "none" },
  deleteActionBtnPro: { width: "44px", height: "44px", backgroundColor: "transparent", border: "2px solid #ff3b30", borderRadius: "10px", color: "#ff3b30", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" },

  // CUSTOMERS ULTRA PRO
  customersGridUltraPro: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" },
  customerCardUltraPro: { padding: "28px", backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "20px", transition: "all 0.3s", cursor: "pointer" },
  customerCardHeaderPro: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" },
  customerAvatarUltraPro: { width: "72px", height: "72px", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "900", color: "#000", letterSpacing: "-1px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" },
  adminBadgeSmall: { width: "32px", height: "32px", backgroundColor: "#c4ff0d", borderRadius: "8px", color: "#000", display: "flex", alignItems: "center", justifyContent: "center" },
  customerInfoPro: { marginBottom: "24px" },
  customerNameUltraPro: { fontSize: "20px", fontWeight: "800", color: "#fff", marginBottom: "6px", letterSpacing: "-0.5px" },
  customerEmailUltraPro: { display: "flex", alignItems: "center", fontSize: "13px", color: "#666", margin: 0 },
  customerStatsUltraPro: { display: "flex", flexDirection: "column", gap: "14px", padding: "20px 0", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a", marginBottom: "20px" },
  customerStatItemPro: { display: "flex", alignItems: "center", gap: "14px" },
  statIconSmall: { width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 },
  customerStatNumberPro: { fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "2px", letterSpacing: "-0.5px" },
  customerStatLabelPro: { fontSize: "12px", color: "#666", textTransform: "uppercase", letterSpacing: "0.5px" },
  customerActionsPro: { display: "flex", gap: "12px" },
  customerActionBtnPro: { flex: "1", padding: "12px", backgroundColor: "#1a1a1a", border: "2px solid #2a2a2a", borderRadius: "10px", color: "#fff", fontSize: "16px", cursor: "pointer", transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center" },

  // MODALS PRO
  modal: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px", backdropFilter: "blur(10px)" },
  modalContentPro: { maxWidth: "700px", width: "100%", maxHeight: "90vh", backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column" },
  modalHeaderPro: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px", borderBottom: "1px solid #1a1a1a" },
  modalTitlePro: { fontSize: "24px", fontWeight: "800", color: "#fff", letterSpacing: "-0.5px" },
  closeBtnPro: { width: "44px", height: "44px", backgroundColor: "#1a1a1a", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", transition: "all 0.3s" },
  modalBody: { flex: "1", overflowY: "auto", padding: "28px" },
  formGroup: { marginBottom: "24px" },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  labelPro: { display: "block", fontSize: "13px", fontWeight: "700", color: "#fff", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" },
  inputPro: { width: "100%", padding: "14px 18px", backgroundColor: "#1a1a1a", border: "2px solid #2a2a2a", borderRadius: "10px", color: "#fff", fontSize: "14px", fontFamily: "inherit", outline: "none", transition: "all 0.3s" },
  imageInputRow: { display: "flex", gap: "10px", marginBottom: "10px" },
  removeImageBtnPro: { width: "44px", height: "44px", backgroundColor: "#ff3b30", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", flexShrink: 0 },
  addImageBtnPro: { display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 18px", backgroundColor: "#1a1a1a", border: "2px solid #2a2a2a", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s" },
  modalFooterPro: { display: "flex", gap: "14px", padding: "28px", borderTop: "1px solid #1a1a1a" },
  cancelBtnPro: { flex: "1", padding: "16px", backgroundColor: "#1a1a1a", border: "2px solid #2a2a2a", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s" },
  saveBtnPro: { flex: "1", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "linear-gradient(135deg, #c4ff0d 0%, #9acc0a 100%)", border: "none", borderRadius: "12px", color: "#000", fontSize: "15px", fontWeight: "700", cursor: "pointer", transition: "all 0.3s", boxShadow: "0 4px 20px rgba(196, 255, 13, 0.3)" },
  confirmModalPro: { maxWidth: "500px", width: "100%", padding: "40px", backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "24px", textAlign: "center" },
  confirmIconPro: { width: "80px", height: "80px", margin: "0 auto 24px", backgroundColor: "#ff3b3020", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px", color: "#ff3b30" },
  confirmTitlePro: { fontSize: "28px", fontWeight: "800", color: "#fff", marginBottom: "16px", letterSpacing: "-0.5px" },
  confirmTextPro: { fontSize: "16px", color: "#888", lineHeight: "1.6", marginBottom: "32px" },
  confirmActionsPro: { display: "flex", gap: "14px" },
  deleteConfirmBtnPro: { flex: "1", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", backgroundColor: "#ff3b30", border: "none", borderRadius: "12px", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", transition: "all 0.3s" },
  viewModalContentPro: { maxWidth: "900px", width: "100%", maxHeight: "90vh", backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column" },
  viewModalBodyPro: { flex: "1", overflowY: "auto", display: "grid", gridTemplateColumns: "400px 1fr", gap: "32px", padding: "32px" },
  viewImageContainerPro: { position: "sticky", top: 0 },
  viewImagePro: { width: "100%", height: "400px", objectFit: "cover", borderRadius: "20px", border: "1px solid #1a1a1a" },
  viewDetailsPro: {},
  viewBrandPro: { fontSize: "14px", color: "#c4ff0d", fontWeight: "700", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" },
  viewNamePro: { fontSize: "28px", fontWeight: "800", color: "#fff", marginBottom: "16px", letterSpacing: "-0.5px" },
  viewPricePro: { fontSize: "36px", fontWeight: "900", color: "#c4ff0d", marginBottom: "24px", letterSpacing: "-1px" },
  viewInfoGridPro: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" },
  viewInfoItemPro: { padding: "14px", backgroundColor: "#1a1a1a", borderRadius: "10px" },
  viewInfoLabelPro: { fontSize: "12px", color: "#666", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "6px", letterSpacing: "0.5px" },
  viewInfoValuePro: { fontSize: "16px", color: "#fff", fontWeight: "700" },
  viewDescriptionPro: { marginBottom: "32px" },
  viewDescTitlePro: { fontSize: "16px", fontWeight: "800", color: "#fff", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" },
  viewDescTextPro: { fontSize: "14px", color: "#888", lineHeight: "1.6" },
  viewActionsPro: { display: "flex", gap: "14px" },
  viewEditBtnPro: { flex: "1", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "linear-gradient(135deg, #c4ff0d 0%, #9acc0a 100%)", border: "none", borderRadius: "12px", color: "#000", fontSize: "15px", fontWeight: "700", cursor: "pointer", transition: "all 0.3s" },
  viewDeleteBtnPro: { flex: "1", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", backgroundColor: "transparent", border: "2px solid #ff3b30", borderRadius: "12px", color: "#ff3b30", fontSize: "15px", fontWeight: "700", cursor: "pointer", transition: "all 0.3s" }
};

export default AdminDashboard;
