import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  CreditCard,
  Calendar,
  ChevronRight,
  Sparkles,
  Package,
  User,
  Mail,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import { useMyOrders } from "../features/order/useMyOrders";
import { getImageUrl, handleImageError } from "../utils/imageHelper";
import "./Order.css";

const Order = () => {
  const { codOrders, paidOrders, isLoading, error } = useMyOrders();
  const [filterType, setFilterType] = useState("all"); // 'all' | 'paid' | 'cod'
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyOrderId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Đã sao chép mã đơn hàng!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const allOrders = [
    ...(paidOrders || []).map((o) => ({ ...o, type: "paid" })),
    ...(codOrders || []).map((o) => ({ ...o, type: "cod" })),
  ].sort(
    (a, b) =>
      new Date(b.createAt || b.createdAt || 0) -
      new Date(a.createAt || a.createdAt || 0)
  );

  const filteredOrders = allOrders.filter((order) => {
    if (filterType === "paid") return order.type === "paid";
    if (filterType === "cod") return order.type === "cod";
    return true;
  });

  const totalRevenue = allOrders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );

  const formatVND = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Mới đây";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (order) => {
    if (order.type === "paid" || order.status === "Completed") {
      return (
        <span className="order-badge-pill status-paid">
          <CheckCircle2 size={13} />
          <span>Đã thanh toán Online</span>
        </span>
      );
    }
    if (order.status === "Processing" || order.status === "Pending") {
      return (
        <span className="order-badge-pill status-processing">
          <Clock size={13} />
          <span>Chờ thanh toán tại quầy</span>
        </span>
      );
    }
    if (order.status === "Cancelled") {
      return (
        <span className="order-badge-pill status-cancelled">
          <AlertCircle size={13} />
          <span>Đã hủy</span>
        </span>
      );
    }
    return (
      <span className="order-badge-pill status-processing">
        <Clock size={13} />
        <span>{order.status || "Đang xử lý"}</span>
      </span>
    );
  };

  return (
    <div className="orders-container">
      {/* 1. Header Card */}
      <section className="orders-header-card">
        <div className="orders-header-info">
          <h1>Đơn hàng & Gói dịch vụ</h1>
          <p>
            Theo dõi trạng thái thanh toán và lịch sử các dịch vụ nha khoa bạn đã đăng ký
          </p>
        </div>
        <Link to="/shop" className="btn-explore-services">
          <Sparkles size={16} />
          <span>Xem bảng giá & Đặt thêm</span>
        </Link>
      </section>

      {/* 2. Stats Overview */}
      <div className="orders-stats-grid">
        <div className="order-stat-card">
          <div className="stat-icon-bubble blue">
            <ShoppingBag size={22} />
          </div>
          <div className="stat-text-info">
            <span>Tổng đơn dịch vụ</span>
            <strong>{allOrders.length}</strong>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="stat-icon-bubble green">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-text-info">
            <span>Đã thanh toán (Online)</span>
            <strong>{paidOrders.length}</strong>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="stat-icon-bubble amber">
            <Clock size={22} />
          </div>
          <div className="stat-text-info">
            <span>Thanh toán tại quầy (COD)</span>
            <strong>{codOrders.length}</strong>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="stat-icon-bubble purple">
            <CreditCard size={22} />
          </div>
          <div className="stat-text-info">
            <span>Tổng chi phí dịch vụ</span>
            <strong>{formatVND(totalRevenue)}</strong>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="orders-filter-bar">
        <button
          type="button"
          className={`filter-pill-btn ${filterType === "all" ? "active" : ""}`}
          onClick={() => setFilterType("all")}
        >
          <span>Tất cả đơn hàng</span>
          <span className="filter-count-badge">{allOrders.length}</span>
        </button>

        <button
          type="button"
          className={`filter-pill-btn ${filterType === "paid" ? "active" : ""}`}
          onClick={() => setFilterType("paid")}
        >
          <span>Đã thanh toán Online</span>
          <span className="filter-count-badge">{paidOrders.length}</span>
        </button>

        <button
          type="button"
          className={`filter-pill-btn ${filterType === "cod" ? "active" : ""}`}
          onClick={() => setFilterType("cod")}
        >
          <span>Thanh toán tại quầy (COD)</span>
          <span className="filter-count-badge">{codOrders.length}</span>
        </button>
      </div>

      {/* 4. Orders Content */}
      {isLoading ? (
        <div className="account-page-loading">Đang tải danh sách đơn hàng...</div>
      ) : error ? (
        <div className="orders-empty-card">
          <div className="orders-empty-icon-bubble" style={{ background: "#fef2f2", color: "#ef4444" }}>
            <AlertCircle size={32} />
          </div>
          <h2>Không thể tải đơn hàng</h2>
          <p>Đã xảy ra lỗi khi đồng bộ đơn hàng. Vui lòng thử tải lại trang.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="orders-empty-card">
          <div className="orders-empty-icon-bubble">
            <ShoppingBag size={32} />
          </div>
          <h2>Chưa có đơn hàng dịch vụ nào</h2>
          <p>
            Bạn chưa đăng ký gói dịch vụ nha khoa nào. Hãy khám phá các gói niềng răng,
            cấy ghép Implant, bọc răng sứ thẩm mỹ và đặt lịch trải nghiệm ngay!
          </p>
          <Link to="/shop" className="btn-explore-services">
            <Sparkles size={16} />
            <span>Khám phá bảng giá dịch vụ</span>
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <article key={order._id} className="order-card">
              {/* Order Header */}
              <div className="order-card-header">
                <div className="order-header-left">
                  <span
                    className="order-id-badge"
                    title="Bấm để sao chép mã đơn"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCopyOrderId(order._id)}
                  >
                    #{order._id.slice(-8).toUpperCase()}
                    {copiedId === order._id ? (
                      <Check size={12} style={{ display: "inline", marginLeft: 4 }} />
                    ) : (
                      <Copy size={12} style={{ display: "inline", marginLeft: 4 }} />
                    )}
                  </span>

                  <div className="order-date-text">
                    <Calendar size={14} />
                    <span>{formatDate(order.createAt || order.createdAt)}</span>
                  </div>
                </div>

                <div className="order-header-right">
                  <span className="order-badge-pill payment-method">
                    <CreditCard size={13} />
                    <span>{order.paymentMethod || (order.type === "paid" ? "VNPAY" : "COD")}</span>
                  </span>
                  {getStatusBadge(order)}
                </div>
              </div>

              {/* Order Services */}
              <div className="order-services-body">
                {(order.service || []).map((service) => (
                  <div key={service._id} className="order-service-item">
                    <div className="order-service-main">
                      <img
                        src={getImageUrl(
                          service.photoService,
                          "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=150&q=80"
                        )}
                        alt={service.nameService}
                        className="order-service-img"
                        loading="lazy"
                        onError={(e) =>
                          handleImageError(
                            e,
                            "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=150&q=80"
                          )
                        }
                      />
                      <div className="order-service-info">
                        <h3 className="order-service-name">{service.nameService}</h3>
                        <p className="order-service-summary">{service.summary || "Dịch vụ nha khoa chuyên sâu chất lượng cao"}</p>
                        {service.Unit && (
                          <span className="order-service-unit">Đơn vị: {service.Unit}</span>
                        )}
                      </div>
                    </div>

                    <div className="order-service-price">
                      <span className="order-service-amount">
                        {formatVND(service.priceDiscount || service.priceService || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="order-card-footer">
                <div className="order-customer-info">
                  <span>
                    <User size={14} style={{ display: "inline", marginRight: 4 }} />
                    {order.account?.name || "Khách hàng"}
                  </span>
                  <span>
                    <Mail size={14} style={{ display: "inline", marginRight: 4 }} />
                    {order.account?.email || "-"}
                  </span>
                </div>

                <div className="order-footer-right">
                  <div className="order-total-price-wrap">
                    Tổng chi phí: <strong>{formatVND(order.totalPrice || 0)}</strong>
                  </div>

                  {order.service?.[0]?._id && (
                    <Link
                      to={`/booking?serviceId=${order.service[0]._id}`}
                      className="btn-book-order-svc"
                    >
                      <span>Đặt lịch ngay</span>
                      <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
