import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle,
  FiClock,
  FiX,
  FiEye,
  FiTrash2,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
  FiDollarSign,
  FiImage
} from "react-icons/fi";


export default function MyOrders() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadOrders();
  }, [user, navigate]);


 const loadOrders = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`http://localhost:5001/api/orders/user/${user._id}`);
    
    // ⬇️ DEBUG: VOIR LA STRUCTURE DES DONNÉES
    console.log("==================== ORDERS DEBUG ====================");
    console.log("📦 Total orders:", response.data.length);
    console.log("📦 Full orders data:", response.data);
    
    if (response.data.length > 0) {
      console.log("📦 First order structure:", response.data[0]);
      console.log("📦 First order items:", response.data[0].items);
      
      if (response.data[0].items && response.data[0].items.length > 0) {
        console.log("📦 First item structure:", response.data[0].items[0]);
        console.log("🖼️ Image from item.image:", response.data[0].items[0].image);
        console.log("🖼️ Image from item.product:", response.data[0].items[0].product);
        console.log("🖼️ Full item keys:", Object.keys(response.data[0].items[0]));
      }
    }
    console.log("====================================================");
    
    setOrders(response.data);
    setLoading(false);
  } catch (error) {
    console.error("Error loading orders:", error);
    setOrders([]);
    setLoading(false);
  }
};



  const getStatusInfo = (status) => {
    switch (status) {
      case "delivered":
        return { label: "Delivered", color: "#00ff00", bg: "#00ff0010", icon: <FiCheckCircle /> };
      case "shipping":
        return { label: "Shipping", color: "#5ac8fa", bg: "#5ac8fa10", icon: <FiTruck /> };
      case "processing":
        return { label: "Processing", color: "#ffcc00", bg: "#ffcc0010", icon: <FiClock /> };
      case "confirmed":
        return { label: "Confirmed", color: "#5ac8fa", bg: "#5ac8fa10", icon: <FiCheckCircle /> };
      case "cancelled":
        return { label: "Cancelled", color: "#ff3b30", bg: "#ff3b3010", icon: <FiX /> };
      default:
        return { label: "Unknown", color: "#666", bg: "#66666610", icon: <FiPackage /> };
    }
  };


  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };


  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`http://localhost:5001/api/admin/orders/${orderId}`);
        setOrders(orders.filter(order => order._id !== orderId));
        alert("✅ Order deleted successfully!");
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("❌ Failed to delete order!");
      }
    }
  };


  // ⬇️ FONCTION POUR OBTENIR L'IMAGE (CORRIGÉE)
  const getProductImage = (item) => {
    // Essaie différentes sources d'image
    return item.image || 
           item.product?.image || 
           item.product?.images?.[0] || 
           (item.product?.images && item.product.images.length > 0 ? item.product.images[0] : null);
  };


  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => order.status === activeTab);


  if (!user) {
    return null;
  }


  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <style>{keyframes}</style>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your orders...</p>
      </div>
    );
  }


  return (
    <div style={styles.page}>
      <style>{keyframes}</style>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Orders</h1>
            <p style={styles.subtitle}>Track and manage your orders</p>
          </div>
          <div style={styles.orderCount}>
            <FiPackage style={styles.orderCountIcon} />
            <span>{orders.length} Total Orders</span>
          </div>
        </div>


        {/* Tabs */}
        <div style={styles.tabs}>
          <button onClick={() => setActiveTab("all")} style={{...styles.tab, ...(activeTab === "all" && styles.tabActive)}}>
            All Orders
            <span style={styles.tabBadge}>{orders.length}</span>
          </button>
          <button onClick={() => setActiveTab("processing")} style={{...styles.tab, ...(activeTab === "processing" && styles.tabActive)}}>
            Processing
            <span style={styles.tabBadge}>{orders.filter(o => o.status === "processing").length}</span>
          </button>
          <button onClick={() => setActiveTab("shipping")} style={{...styles.tab, ...(activeTab === "shipping" && styles.tabActive)}}>
            Shipping
            <span style={styles.tabBadge}>{orders.filter(o => o.status === "shipping").length}</span>
          </button>
          <button onClick={() => setActiveTab("delivered")} style={{...styles.tab, ...(activeTab === "delivered" && styles.tabActive)}}>
            Delivered
            <span style={styles.tabBadge}>{orders.filter(o => o.status === "delivered").length}</span>
          </button>
        </div>


        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div style={styles.emptyState}>
            <FiPackage style={styles.emptyIcon} />
            <h3 style={styles.emptyTitle}>No orders found</h3>
            <p style={styles.emptyText}>
              {activeTab === "all" ? "You haven't placed any orders yet" : `No ${activeTab} orders`}
            </p>
            <button onClick={() => navigate("/")} style={styles.shopBtn}>Start Shopping</button>
          </div>
        ) : (
          <div style={styles.ordersList}>
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order._id} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <div style={styles.orderHeaderLeft}>
                      <div style={styles.orderId}>
                        <FiPackage style={styles.orderIdIcon} />
                        <span>{order.orderNumber}</span>
                      </div>
                      <div style={styles.orderDate}>
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div style={{...styles.statusBadge, color: statusInfo.color, backgroundColor: statusInfo.bg, border: `1px solid ${statusInfo.color}`}}>
                      {statusInfo.icon}
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>


                  <div style={styles.orderItems}>
                    {order.items.map((item, index) => {
                      const productImage = getProductImage(item);
                      return (
                        <div key={index} style={styles.orderItem}>
                          {/* ⬇️ IMAGE AVEC STYLE PRO */}
                          <div style={styles.itemImageWrapper}>
                            {productImage ? (
                              <img 
                                src={productImage} 
                                alt={item.name} 
                                style={styles.itemImage}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div style={{
                              ...styles.itemImagePlaceholder,
                              display: productImage ? 'none' : 'flex'
                            }}>
                              <FiImage style={styles.placeholderIcon} />
                            </div>
                            <div style={styles.itemImageOverlay}>
                              <FiEye style={styles.overlayIcon} />
                            </div>
                          </div>
                          
                          <div style={styles.itemInfo}>
                            <div style={styles.itemName}>{item.name}</div>
                            <div style={styles.itemMeta}>Qty: {item.quantity} × ${item.price.toFixed(2)}</div>
                          </div>
                          <div style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      );
                    })}
                  </div>


                  <div style={styles.orderFooter}>
                    <div style={styles.orderTotal}>
                      <span style={styles.totalLabel}>Total:</span>
                      <span style={styles.totalValue}>${order.total.toFixed(2)}</span>
                    </div>
                    <div style={styles.orderActions}>
                      <button 
                        onClick={() => handleViewDetails(order)}
                        style={styles.viewBtn}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#1a1a1a";
                          e.currentTarget.style.borderColor = "#c4ff0d";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.borderColor = "#1a1a1a";
                        }}
                      >
                        <FiEye style={{ marginRight: "8px" }} />
                        View Details
                      </button>
                      {order.status === "delivered" && (
                        <button style={styles.reorderBtn}>Reorder</button>
                      )}
                      {order.status === "shipping" && (
                        <button style={styles.trackBtn}>
                          <FiTruck style={{ marginRight: "8px" }} />
                          Track Order
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteOrder(order._id)}
                        style={styles.deleteBtn}
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
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>


      {/* Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div style={styles.modalOverlay} onClick={() => setShowDetailsModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Order Details</h2>
                <p style={styles.modalOrderId}>{selectedOrder.orderNumber}</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} style={styles.closeBtn}>
                <FiX style={{ fontSize: "24px" }} />
              </button>
            </div>


            {/* Modal Body */}
            <div style={styles.modalBody}>
              {/* Status */}
              <div style={styles.detailSection}>
                <h3 style={styles.detailSectionTitle}>Order Status</h3>
                <div style={{
                  ...styles.statusBadgeLarge,
                  color: getStatusInfo(selectedOrder.status).color,
                  backgroundColor: getStatusInfo(selectedOrder.status).bg,
                  border: `2px solid ${getStatusInfo(selectedOrder.status).color}`
                }}>
                  {getStatusInfo(selectedOrder.status).icon}
                  <span>{getStatusInfo(selectedOrder.status).label}</span>
                </div>
              </div>


              {/* Items */}
              <div style={styles.detailSection}>
                <h3 style={styles.detailSectionTitle}>Order Items</h3>
                <div style={styles.detailItems}>
                  {selectedOrder.items.map((item, index) => {
                    const productImage = getProductImage(item);
                    return (
                      <div key={index} style={styles.detailItem}>
                        {/* ⬇️ IMAGE MODALE AVEC STYLE PRO */}
                        <div style={styles.detailItemImageWrapper}>
                          {productImage ? (
                            <img 
                              src={productImage} 
                              alt={item.name} 
                              style={styles.detailItemImage}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div style={{
                            ...styles.detailImagePlaceholder,
                            display: productImage ? 'none' : 'flex'
                          }}>
                            <FiImage style={styles.detailPlaceholderIcon} />
                          </div>
                        </div>
                        
                        <div style={styles.detailItemInfo}>
                          <div style={styles.detailItemName}>{item.name}</div>
                          <div style={styles.detailItemQty}>Quantity: {item.quantity}</div>
                        </div>
                        <div style={styles.detailItemPrice}>${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>


              {/* Shipping Address */}
              <div style={styles.detailSection}>
                <h3 style={styles.detailSectionTitle}>Shipping Address</h3>
                <div style={styles.addressCard}>
                  <div style={styles.addressRow}>
                    <FiUser style={styles.addressIcon} />
                    <span>{selectedOrder.shippingAddress.fullName}</span>
                  </div>
                  <div style={styles.addressRow}>
                    <FiPhone style={styles.addressIcon} />
                    <span>{selectedOrder.shippingAddress.phone}</span>
                  </div>
                  <div style={styles.addressRow}>
                    <FiMail style={styles.addressIcon} />
                    <span>{selectedOrder.shippingAddress.email}</span>
                  </div>
                  <div style={styles.addressRow}>
                    <FiMapPin style={styles.addressIcon} />
                    <span>
                      {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
                    </span>
                  </div>
                </div>
              </div>


              {/* Payment Details */}
              <div style={styles.detailSection}>
                <h3 style={styles.detailSectionTitle}>Payment Details</h3>
                <div style={styles.paymentCard}>
                  <div style={styles.paymentRow}>
                    <span style={styles.paymentLabel}>Payment Method:</span>
                    <span style={styles.paymentValue}>
                      <FiDollarSign style={{ marginRight: "6px" }} />
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                  <div style={styles.divider}></div>
                  <div style={styles.paymentRow}>
                    <span style={styles.paymentLabel}>Subtotal:</span>
                    <span style={styles.paymentValue}>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div style={styles.paymentRow}>
                    <span style={styles.paymentLabel}>Shipping:</span>
                    <span style={styles.paymentValue}>{selectedOrder.shipping === 0 ? "FREE" : `$${selectedOrder.shipping.toFixed(2)}`}</span>
                  </div>
                  <div style={styles.paymentRow}>
                    <span style={styles.paymentLabel}>Tax:</span>
                    <span style={styles.paymentValue}>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div style={styles.divider}></div>
                  <div style={styles.paymentRow}>
                    <span style={styles.totalLabelModal}>Total:</span>
                    <span style={styles.totalValueModal}>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>


            {/* Modal Footer */}
            <div style={styles.modalFooter}>
              <button onClick={() => setShowDetailsModal(false)} style={styles.closeModalBtn}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ==================== KEYFRAMES ====================
const keyframes = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;


// ==================== STYLES ====================
const styles = {
  page: { backgroundColor: "#000", minHeight: "100vh", paddingTop: "100px", paddingBottom: "80px" },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "0 40px" },
  loadingContainer: { minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "24px", backgroundColor: "#000" },
  spinner: { width: "60px", height: "60px", border: "4px solid #1a1a1a", borderTop: "4px solid #c4ff0d", borderRadius: "50%", animation: "spin 1s linear infinite" },
  loadingText: { color: "#666", fontSize: "16px", fontWeight: "500" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "48px" },
  title: { fontSize: "48px", fontWeight: "900", color: "#fff", letterSpacing: "-2px", marginBottom: "8px" },
  subtitle: { fontSize: "16px", color: "#666", margin: 0 },
  orderCount: { display: "flex", alignItems: "center", gap: "12px", padding: "16px 24px", backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "12px", color: "#fff", fontSize: "16px", fontWeight: "600" },
  orderCountIcon: { fontSize: "24px", color: "#c4ff0d" },
  tabs: { display: "flex", gap: "12px", marginBottom: "40px", borderBottom: "1px solid #1a1a1a", paddingBottom: "0" },
  tab: { display: "flex", alignItems: "center", gap: "8px", padding: "16px 24px", backgroundColor: "transparent", border: "none", borderBottom: "3px solid transparent", color: "#666", fontSize: "15px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" },
  tabActive: { color: "#c4ff0d", borderBottomColor: "#c4ff0d" },
  tabBadge: { padding: "4px 10px", backgroundColor: "#1a1a1a", borderRadius: "20px", fontSize: "12px", fontWeight: "700" },
  ordersList: { display: "flex", flexDirection: "column", gap: "24px" },
  orderCard: { backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "20px", padding: "0", overflow: "hidden", transition: "all 0.3s ease" },
  orderHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px", backgroundColor: "#0a0a0a", borderBottom: "1px solid #1a1a1a" },
  orderHeaderLeft: { display: "flex", flexDirection: "column", gap: "8px" },
  orderId: { display: "flex", alignItems: "center", gap: "10px", fontSize: "18px", fontWeight: "700", color: "#fff" },
  orderIdIcon: { fontSize: "20px", color: "#c4ff0d" },
  orderDate: { fontSize: "14px", color: "#666" },
  statusBadge: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "10px", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" },
  orderItems: { display: "flex", flexDirection: "column", gap: "16px", padding: "24px 32px" },
  orderItem: { display: "flex", gap: "20px", alignItems: "center" },
  
  // ⬇️ STYLES PRO POUR LES IMAGES
  itemImageWrapper: {
    position: "relative",
    width: "100px",
    height: "100px",
    borderRadius: "14px",
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    border: "2px solid #2a2a2a",
    flexShrink: 0,
    transition: "all 0.3s ease"
  },
  itemImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block"
  },
  itemImagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a"
  },
  placeholderIcon: {
    fontSize: "32px",
    color: "#c4ff0d50"
  },
  itemImageOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s ease"
  },
  overlayIcon: {
    fontSize: "24px",
    color: "#c4ff0d"
  },
  
  itemInfo: { flex: 1 },
  itemName: { fontSize: "16px", fontWeight: "600", color: "#fff", marginBottom: "6px" },
  itemMeta: { fontSize: "14px", color: "#666" },
  itemPrice: { fontSize: "18px", fontWeight: "700", color: "#c4ff0d" },
  orderFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px", backgroundColor: "#0a0a0a", borderTop: "1px solid #1a1a1a" },
  orderTotal: { display: "flex", alignItems: "center", gap: "12px" },
  totalLabel: { fontSize: "16px", color: "#666", fontWeight: "600" },
  totalValue: { fontSize: "28px", fontWeight: "900", color: "#c4ff0d", letterSpacing: "-1px" },
  orderActions: { display: "flex", gap: "12px" },
  viewBtn: { display: "flex", alignItems: "center", padding: "12px 24px", backgroundColor: "transparent", border: "1px solid #1a1a1a", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" },
  trackBtn: { display: "flex", alignItems: "center", padding: "12px 24px", backgroundColor: "#5ac8fa20", border: "1px solid #5ac8fa", borderRadius: "10px", color: "#5ac8fa", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" },
  reorderBtn: { padding: "12px 24px", backgroundColor: "#c4ff0d", border: "none", borderRadius: "10px", color: "#000", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.3s ease" },
  deleteBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", backgroundColor: "transparent", border: "1px solid #ff3b30", borderRadius: "10px", color: "#ff3b30", fontSize: "18px", cursor: "pointer", transition: "all 0.3s ease" },
  emptyState: { textAlign: "center", padding: "100px 40px", backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "20px" },
  emptyIcon: { fontSize: "80px", color: "#2a2a2a", marginBottom: "24px" },
  emptyTitle: { fontSize: "28px", fontWeight: "800", color: "#fff", marginBottom: "12px" },
  emptyText: { fontSize: "16px", color: "#666", marginBottom: "32px" },
  shopBtn: { padding: "16px 40px", backgroundColor: "#c4ff0d", border: "none", borderRadius: "12px", color: "#000", fontSize: "16px", fontWeight: "700", cursor: "pointer", transition: "all 0.3s ease" },


  // Modal
  modalOverlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "40px", backdropFilter: "blur(8px)" },
  modalContent: { maxWidth: "900px", width: "100%", maxHeight: "90vh", backgroundColor: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column", animation: "fadeIn 0.3s ease" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "32px", borderBottom: "1px solid #1a1a1a", backgroundColor: "#0a0a0a" },
  modalTitle: { fontSize: "32px", fontWeight: "900", color: "#fff", marginBottom: "8px", letterSpacing: "-1px" },
  modalOrderId: { fontSize: "16px", color: "#c4ff0d", fontWeight: "600", margin: 0 },
  closeBtn: { width: "44px", height: "44px", backgroundColor: "#1a1a1a", border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", transition: "all 0.3s ease", display: "flex", alignItems: "center", justifyContent: "center" },
  modalBody: { flex: 1, overflowY: "auto", padding: "32px" },
  detailSection: { marginBottom: "32px" },
  detailSectionTitle: { fontSize: "20px", fontWeight: "800", color: "#fff", marginBottom: "16px" },
  statusBadgeLarge: { display: "inline-flex", alignItems: "center", gap: "12px", padding: "16px 32px", borderRadius: "12px", fontSize: "18px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" },
  detailItems: { display: "flex", flexDirection: "column", gap: "16px" },
  detailItem: { display: "flex", gap: "20px", padding: "20px", backgroundColor: "#000", borderRadius: "16px", alignItems: "center" },
  
  // ⬇️ STYLES PRO POUR IMAGES MODALE
  detailItemImageWrapper: {
    position: "relative",
    width: "120px",
    height: "120px",
    borderRadius: "16px",
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    border: "3px solid #2a2a2a",
    flexShrink: 0
  },
  detailItemImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block"
  },
  detailImagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a"
  },
  detailPlaceholderIcon: {
    fontSize: "48px",
    color: "#c4ff0d50"
  },
  
  detailItemInfo: { flex: 1 },
  detailItemName: { fontSize: "18px", fontWeight: "700", color: "#fff", marginBottom: "6px" },
  detailItemBrand: { fontSize: "14px", color: "#c4ff0d", fontWeight: "600", marginBottom: "8px" },
  detailItemQty: { fontSize: "14px", color: "#666" },
  detailItemPrice: { fontSize: "24px", fontWeight: "900", color: "#c4ff0d" },
  addressCard: { padding: "24px", backgroundColor: "#000", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "16px" },
  addressRow: { display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", color: "#fff" },
  addressIcon: { fontSize: "20px", color: "#c4ff0d", flexShrink: 0 },
  paymentCard: { padding: "24px", backgroundColor: "#000", borderRadius: "16px" },
  paymentRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  paymentLabel: { fontSize: "15px", color: "#666", fontWeight: "600" },
  paymentValue: { fontSize: "15px", color: "#fff", fontWeight: "600", display: "flex", alignItems: "center" },
  divider: { height: "1px", backgroundColor: "#1a1a1a", margin: "16px 0" },
  totalLabelModal: { fontSize: "20px", color: "#fff", fontWeight: "700" },
  totalValueModal: { fontSize: "32px", color: "#c4ff0d", fontWeight: "900", letterSpacing: "-1px" },
  modalFooter: { padding: "24px 32px", borderTop: "1px solid #1a1a1a", backgroundColor: "#0a0a0a", display: "flex", justifyContent: "flex-end" },
  closeModalBtn: { padding: "14px 32px", backgroundColor: "#c4ff0d", border: "none", borderRadius: "12px", color: "#000", fontSize: "15px", fontWeight: "700", cursor: "pointer", transition: "all 0.3s ease" }
};
