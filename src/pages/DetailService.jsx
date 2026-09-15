import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import {
  Star,
  ShoppingCart,
  Minus,
  Plus,
  FileText,
  MessageCircle,
  Pencil,
  Trash2,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Award,
  ChevronRight,
} from "lucide-react";

import {
  handlePostReview,
  handleDeleteReview,
  handleUpdateReview,
} from "../apis";
import { useService } from "../features/services/useService";
import { useServices } from "../features/services/useServices";
import { useLanguage } from "../context/LanguageContext";
import { useDarkMode } from "../hooks/useDarkMode";
import {
  translateService,
  formatLocalizedPrice,
} from "../utils/dataTranslator";
import Loading from "../components/Loading";
import { setCountCart } from "../redux/slices/cartUiSlice";
import { getImageUrl, handleImageError, PLACEHOLDER_SERVICE_IMG } from "../utils/imageHelper";

function DetailService() {
  const { ServiceID } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { service: rawService, isLoading, error } = useService(ServiceID);
  const { services: rawServices = [] } = useServices();

  const service = useMemo(
    () => (rawService ? translateService(rawService, language) : null),
    [rawService, language]
  );

  const [activeTab, setActiveTab] = useState("description");
  const [activeStar, setActiveStar] = useState(0);
  const [activeHoverStar, setActiveHoverStar] = useState(-1);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(0);

  const userID = JSON.parse(localStorage.getItem("userInfo") || "null")?.id;

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    dispatch(setCountCart(cart.length));
  }, [dispatch]);

  const review = service?.reviews || [];
  const hasReviewed = review.some(
    (r) => r.account?._id === userID && r.service === service?._id
  );

  const relatedServices = useMemo(() => {
    return (rawServices || [])
      .filter((s) => s._id !== ServiceID)
      .slice(0, 3)
      .map((s) => translateService(s, language));
  }, [rawServices, ServiceID, language]);

  const formatPrice = (price) => formatLocalizedPrice(price, language);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(
      language === "zh" ? "zh-CN" : language === "en" ? "en-US" : "vi-VN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  const incrementQuantity = () => setQuantity((p) => p + 1);
  const decrementQuantity = () => setQuantity((p) => (p > 1 ? p - 1 : 1));

  const addToCart = () => {
    if (!service) return;
    const cartItem = {
      _id: service._id,
      id: service._id,
      nameService: service.nameService,
      photoService: service.photoService,
      priceDiscount: service.priceDiscount,
      priceService: service.priceService,
      quantity,
      unit: service.Unit || "Hour",
      summary: service.summary,
    };
    let currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const idx = currentCart.findIndex((item) => item._id === service._id);
    if (idx !== -1) {
      currentCart[idx].quantity += quantity;
    } else {
      currentCart.push(cartItem);
    }
    localStorage.setItem("cart", JSON.stringify(currentCart));
    dispatch(setCountCart(currentCart.length));
    toast.success(t("toast.addToCartSuccess"));
  };

  const handleBookNow = () => {
    if (!service) return;
    navigate(`/booking?serviceId=${service._id}`);
  };

  const postReviewMutation = useMutation({
    mutationFn: (data) => handlePostReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service", ServiceID] });
      setReviewText("");
      setActiveStar(0);
      setActiveHoverStar(-1);
      setActiveTab("review");
      toast.success(t("toast.reviewSuccess"));
    },
    onError: () => toast.error(t("toast.reviewFail")),
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({ id, data }) => handleUpdateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service", ServiceID] });
      setEditReviewId(null);
      setEditReviewText("");
      setEditReviewRating(0);
      toast.success(t("toast.reviewUpdateSuccess"));
    },
    onError: () => toast.error(t("toast.reviewUpdateFail")),
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (id) => handleDeleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service", ServiceID] });
      toast.success(t("toast.reviewDeleteSuccess"));
    },
    onError: () => toast.error(t("toast.reviewDeleteFail")),
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!service || !activeStar || activeStar < 0.5) {
      toast.error(t("toast.selectStars") || "Vui lòng chọn số sao đánh giá");
      return;
    }
    postReviewMutation.mutate({
      rating: activeStar,
      review: reviewText,
      service: service._id,
    });
  };

  const handleUpdateReviewSubmit = (e) => {
    e.preventDefault();
    if (!editReviewId || editReviewRating < 1) return;
    updateReviewMutation.mutate({
      id: editReviewId,
      data: { rating: editReviewRating, review: editReviewText },
    });
  };

  const handleDeleteReviewClick = (reviewId) => {
    if (window.confirm(t("detailService.confirmDelete"))) {
      deleteReviewMutation.mutate(reviewId);
    }
  };

  if (isLoading) return <Loading />;
  if (error || !service) {
    return (
      <div className={`ds-page ${isDarkMode ? "dark-theme" : ""}`}>
        <div className="ds-error-card">
          <p>{error?.message || t("detailService.notFound")}</p>
          <button type="button" onClick={() => navigate("/shop")}>
            {t("detailService.backToShop")}
          </button>
        </div>
      </div>
    );
  }

  const hasDiscount =
    service.priceDiscount && service.priceDiscount < service.priceService;

  const currentPrice = service.priceDiscount || service.priceService || 0;

  return (
    <div className={`ds-page ${isDarkMode ? "dark-theme" : ""}`}>
      <div className="ds-container">
        {/* Breadcrumbs & Back */}
        <nav className="ds-breadcrumb-bar" aria-label="Breadcrumb">
          <button
            type="button"
            className="ds-back-pill"
            onClick={() => navigate("/shop")}
          >
            <ArrowLeft size={16} />
            <span>{t("detailService.backToShop")}</span>
          </button>

          <div className="ds-breadcrumbs">
            <span onClick={() => navigate("/")} className="crumb-link">
              Home
            </span>
            <ChevronRight size={14} className="crumb-sep" />
            <span onClick={() => navigate("/shop")} className="crumb-link">
              Shop
            </span>
            <ChevronRight size={14} className="crumb-sep" />
            <span className="crumb-current">{service.nameService}</span>
          </div>
        </nav>

        {/* Hero Showcase Section */}
        <section className="ds-hero-card">
          {/* Left Column: Media Showcase */}
          <div className="ds-media-column">
            <div className="ds-main-image-wrap">
              <img
                src={getImageUrl(service.photoService)}
                alt={service.nameService}
                onError={handleImageError}
                className="ds-main-image"
              />
              <div className="ds-image-badge-wrap">
                <span className="ds-badge-hot">
                  <Sparkles size={13} /> {t("shop.hotTag") || "HOT"}
                </span>
                <span className="ds-badge-duration">
                  <Clock size={13} /> {service.durationMinutes || 30}{" "}
                  {t("booking.durationUnit")}
                </span>
              </div>
            </div>

            {/* Quality Guarantees under Image */}
            <div className="ds-trust-cards">
              <div className="trust-mini-card">
                <ShieldCheck size={20} className="trust-icon" />
                <div>
                  <h4>Vô trùng Autoclave</h4>
                  <p>100% chuẩn Đức & Châu Âu</p>
                </div>
              </div>
              <div className="trust-mini-card">
                <Award size={20} className="trust-icon" />
                <div>
                  <h4>Bác sĩ Chuyên khoa</h4>
                  <p>Tu nghiệp quốc tế & tận tâm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="ds-info-column">
            <div className="ds-tag-pill">
              <Sparkles size={14} />
              <span>Nha Khoa Chuẩn Quốc Tế</span>
            </div>

            <h1 className="ds-title">{service.nameService}</h1>

            {/* Rating Bar */}
            <div className="ds-rating-row">
              <Rating
                value={Number(service.ratingsAverage || 5)}
                precision={0.5}
                readOnly
                size="small"
                sx={{
                  color: "#f59e0b",
                  "& .MuiRating-iconEmpty": {
                    color: isDarkMode ? "#475569" : "#cbd5e1",
                  },
                }}
              />
              <span className="ds-rating-score">
                {(service.ratingsAverage || 5.0).toFixed(1)} / 5.0
              </span>
              <span className="ds-rating-divider">•</span>
              <span className="ds-review-count">
                {service.ratingsQuantity || 0} {t("detailService.reviews")}
              </span>
            </div>

            {/* Summary */}
            {service.summary && (
              <p className="ds-summary">{service.summary}</p>
            )}

            {/* Price Showcase Card */}
            <div className="ds-price-card">
              <div className="ds-price-row">
                <span className="ds-price-value">{formatPrice(currentPrice)}</span>
                {hasDiscount && (
                  <span className="ds-price-original">
                    {formatPrice(service.priceService)}
                  </span>
                )}
                <span className="ds-price-unit">
                  / {service.Unit || t("detailService.hour")}
                </span>
              </div>
              <div className="ds-installment-tip">
                <CheckCircle2 size={15} color="#10b981" />
                <span>Hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng</span>
              </div>
            </div>

            {/* Actions & Quantity */}
            <div className="ds-actions-block">
              <div className="ds-quantity-group">
                <label className="qty-label">Số lượng dịch vụ:</label>
                <div className="ds-quantity-selector">
                  <button
                    type="button"
                    onClick={decrementQuantity}
                    aria-label={t("detailService.decrease")}
                    className="qty-btn"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    type="button"
                    onClick={incrementQuantity}
                    aria-label={t("detailService.increase")}
                    className="qty-btn"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="ds-button-group">
                <button
                  type="button"
                  className="ds-book-btn"
                  onClick={handleBookNow}
                >
                  <Calendar size={20} />
                  <span>{t("shop.bookNow")}</span>
                </button>

                <button
                  type="button"
                  className="ds-cart-btn"
                  onClick={addToCart}
                >
                  <ShoppingCart size={20} />
                  <span>{t("detailService.addToCart")}</span>
                </button>
              </div>
            </div>

            {/* Consultation Helpline */}
            <div className="ds-helpline-box">
              <PhoneCall size={18} className="phone-icon" />
              <div>
                <strong>Cần tư vấn phác đồ điều trị trực tiếp?</strong>
                <span>
                  Hotline miễn cước:{" "}
                  <a href="tel:02873001234">028 7300 1234</a> (24/7)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs Section: Description, Reviews, Quality Guarantee */}
        <section className="ds-tabs-card">
          <div className="ds-tabs-header">
            <button
              type="button"
              className={`ds-tab-btn ${
                activeTab === "description" ? "active" : ""
              }`}
              onClick={() => setActiveTab("description")}
            >
              <FileText size={18} />
              <span>{t("detailService.description")}</span>
            </button>

            <button
              type="button"
              className={`ds-tab-btn ${
                activeTab === "review" ? "active" : ""
              }`}
              onClick={() => setActiveTab("review")}
            >
              <MessageCircle size={18} />
              <span>
                {t("detailService.review")} ({service.ratingsQuantity || 0})
              </span>
            </button>

            <button
              type="button"
              className={`ds-tab-btn ${
                activeTab === "commitment" ? "active" : ""
              }`}
              onClick={() => setActiveTab("commitment")}
            >
              <ShieldCheck size={18} />
              <span>Cam Kết Chất Lượng</span>
            </button>
          </div>

          <div className="ds-tabs-body">
            {/* 1. Description */}
            {activeTab === "description" && (
              <div className="ds-tab-pane">
                <div className="ds-description-prose">
                  <p>
                    {service.description || t("detailService.noDescription")}
                  </p>
                </div>
              </div>
            )}

            {/* 2. Reviews */}
            {activeTab === "review" && (
              <div className="ds-tab-pane">
                <div className="ds-reviews-container">
                  {review.length > 0 ? (
                    <div className="ds-review-cards-list">
                      {review.map((r) => (
                        <div key={r._id} className="ds-single-review">
                          <div className="reviewer-avatar">
                            {(r.account?.email?.[0] || "?").toUpperCase()}
                          </div>
                          <div className="reviewer-content">
                            <div className="reviewer-meta-row">
                              <span className="reviewer-email">
                                {r.account?.name || r.account?.email}
                              </span>
                              <span className="reviewer-date">
                                {formatDate(r.createdAt)}
                              </span>

                              {r.account?._id === userID && (
                                <div className="reviewer-actions">
                                  {editReviewId === r._id ? (
                                    <button
                                      type="button"
                                      className="review-action-btn"
                                      onClick={() => {
                                        setEditReviewId(null);
                                        setEditReviewText("");
                                        setEditReviewRating(0);
                                      }}
                                    >
                                      {t("detailService.cancel")}
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        className="review-action-btn"
                                        onClick={() => {
                                          setEditReviewId(r._id);
                                          setEditReviewText(r.review);
                                          setEditReviewRating(r.rating);
                                        }}
                                        title={t("detailService.editReview")}
                                      >
                                        <Pencil size={14} />
                                      </button>
                                      <button
                                        type="button"
                                        className="review-action-btn delete"
                                        onClick={() =>
                                          handleDeleteReviewClick(r._id)
                                        }
                                        title={t("detailService.deleteReview")}
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="reviewer-stars" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <Rating
                                value={Number(r.rating || 5)}
                                precision={0.5}
                                readOnly
                                size="small"
                                sx={{
                                  color: "#f59e0b",
                                  "& .MuiRating-iconEmpty": {
                                    color: isDarkMode ? "#475569" : "#cbd5e1",
                                  },
                                }}
                              />
                              <span style={{ fontSize: "13px", fontWeight: 700, color: "#f59e0b" }}>
                                {Number(r.rating || 5).toFixed(1)}
                              </span>
                            </div>

                            {editReviewId === r._id ? (
                              <form
                                onSubmit={handleUpdateReviewSubmit}
                                className="ds-edit-review-form"
                              >
                                <textarea
                                  value={editReviewText}
                                  onChange={(e) =>
                                    setEditReviewText(e.target.value)
                                  }
                                  required
                                  rows={3}
                                />
                                <div className="edit-stars-row" style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0" }}>
                                  <Rating
                                    value={Number(editReviewRating || 0)}
                                    precision={0.5}
                                    onChange={(event, newValue) => {
                                      setEditReviewRating(newValue || 0);
                                    }}
                                    size="medium"
                                    sx={{
                                      color: "#f59e0b",
                                      "& .MuiRating-iconEmpty": {
                                        color: isDarkMode ? "#475569" : "#cbd5e1",
                                      },
                                    }}
                                  />
                                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#f59e0b" }}>
                                    {editReviewRating > 0 ? `${editReviewRating.toFixed(1)} ⭐` : "Chưa chọn"}
                                  </span>
                                </div>
                                <button
                                  type="submit"
                                  className="save-edit-btn"
                                >
                                  {t("detailService.update")}
                                </button>
                              </form>
                            ) : (
                              <p className="reviewer-comment">{r.review}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="ds-no-reviews-box">
                      <MessageCircle size={36} />
                      <p>{t("detailService.noReviews")}</p>
                    </div>
                  )}

                  {/* Add Review Form */}
                  {!hasReviewed && (
                    <form
                      onSubmit={handleReviewSubmit}
                      className="ds-add-review-card"
                    >
                      <h3>{t("detailService.writeReview")}</h3>
                      <div className="rating-picker-row" style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "18px" }}>
                        <span style={{ fontWeight: 600 }}>{t("detailService.yourRating")}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <Rating
                            name="service-rating"
                            value={Number(activeStar || 0)}
                            precision={0.5}
                            onChange={(event, newValue) => {
                              setActiveStar(newValue || 0);
                            }}
                            onChangeActive={(event, newHover) => {
                              setActiveHoverStar(newHover);
                            }}
                            size="large"
                            sx={{
                              color: "#f59e0b",
                              "& .MuiRating-icon": {
                                fontSize: "30px",
                              },
                              "& .MuiRating-iconEmpty": {
                                color: isDarkMode ? "#475569" : "#cbd5e1",
                              },
                            }}
                          />
                          <span style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: (activeHoverStar !== -1 ? activeHoverStar : activeStar) > 0 ? "#f59e0b" : "#94a3b8",
                            minWidth: "60px"
                          }}>
                            {(activeHoverStar !== -1 ? activeHoverStar : activeStar) > 0
                              ? `${(activeHoverStar !== -1 ? activeHoverStar : activeStar).toFixed(1)} ⭐`
                              : "Chưa chọn"}
                          </span>
                        </div>
                      </div>
                      <textarea
                        placeholder={t("detailService.reviewPlaceholder")}
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                        rows={4}
                      />
                      <button
                        type="submit"
                        disabled={postReviewMutation.isPending}
                        className="submit-review-btn"
                      >
                        {t("detailService.submitReview")}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* 3. Commitment */}
            {activeTab === "commitment" && (
              <div className="ds-tab-pane">
                <div className="ds-commitments-grid">
                  <div className="commitment-item">
                    <ShieldCheck size={28} className="commit-icon" />
                    <h4>Vật Liệu Nha Khoa Chính Hãng</h4>
                    <p>
                      100% phôi sứ, trụ Implant và khí cụ chỉnh nha nhập khẩu
                      trực tiếp từ Thụy Sĩ, Đức, Hoa Kỳ với tem bảo hành điện tử
                      toàn cầu.
                    </p>
                  </div>
                  <div className="commitment-item">
                    <Sparkles size={28} className="commit-icon" />
                    <h4>Phòng Khám Vô Trùng Khép Kín</h4>
                    <p>
                      Hệ thống lò hấp sấy áp suất âm Melag chuẩn y khoa Châu Âu,
                      mỗi khách hàng sử dụng 1 bộ dụng cụ riêng biệt loại trừ
                      hoàn toàn nguy cơ lây nhiễm chéo.
                    </p>
                  </div>
                  <div className="commitment-item">
                    <Award size={28} className="commit-icon" />
                    <h4>Minh Bạch Chi Phí & Bảo Hành</h4>
                    <p>
                      Bảng giá trọn gói không phát sinh chi phí phụ, hỗ trợ trả
                      góp 0% lãi suất với hồ sơ xét duyệt nhanh chóng ngay tại
                      phòng khám.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="ds-related-section">
            <h2 className="ds-related-title">
              {t("detailService.relatedServices")}
            </h2>
            <div className="ds-related-grid">
              {relatedServices.map((s) => (
                <article
                  key={s._id}
                  className="ds-related-card"
                  onClick={() => navigate(`/shop/${s._id}`)}
                >
                  <div className="related-img-wrap">
                    <img
                      src={getImageUrl(s.photoService)}
                      alt={s.nameService}
                      onError={handleImageError}
                    />
                    <span className="related-duration-badge">
                      <Clock size={12} /> {s.durationMinutes || 30}{" "}
                      {t("booking.durationUnit")}
                    </span>
                  </div>
                  <div className="related-info-wrap">
                    <h3 className="related-name">{s.nameService}</h3>
                    <p className="related-summary">
                      {s.summary ||
                        s.description?.slice(0, 75) ||
                        "Chăm sóc nha khoa chất lượng cao."}
                    </p>
                    <div className="related-bottom-row">
                      <span className="related-price">
                        {formatPrice(s.priceDiscount || s.priceService)}
                      </span>
                      <button
                        type="button"
                        className="related-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/booking?serviceId=${s._id}`);
                        }}
                      >
                        Đặt lịch
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        /* --- CONTAINER & PAGE BASE --- */
        .ds-page {
          min-height: 90vh;
          background: #f8fafc;
          color: #0f172a;
          padding: 32px 0 80px;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .ds-page.dark-theme {
          background: #090d16;
          color: #f8fafc;
        }

        .ds-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* --- BREADCRUMB --- */
        .ds-breadcrumb-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }

        .ds-back-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dark-theme .ds-back-pill {
          background: #1e293b;
          border-color: #334155;
          color: #94a3b8;
        }

        .ds-back-pill:hover {
          border-color: #0284c7;
          color: #0284c7;
          transform: translateX(-3px);
        }

        .ds-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          color: #64748b;
        }

        .dark-theme .ds-breadcrumbs {
          color: #94a3b8;
        }

        .crumb-link {
          cursor: pointer;
          transition: color 0.2s;
        }

        .crumb-link:hover {
          color: #0284c7;
        }

        .crumb-sep {
          color: #cbd5e1;
        }

        .crumb-current {
          font-weight: 600;
          color: #0f172a;
          max-width: 280px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dark-theme .crumb-current {
          color: #ffffff;
        }

        /* --- HERO CARD --- */
        .ds-hero-card {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 40px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 36px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          margin-bottom: 36px;
        }

        .dark-theme .ds-hero-card {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        }

        /* --- LEFT COLUMN: MEDIA --- */
        .ds-media-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ds-main-image-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 18px;
          overflow: hidden;
          background: #f1f5f9;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
        }

        .dark-theme .ds-main-image-wrap {
          background: #0f172a;
        }

        .ds-main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .ds-main-image-wrap:hover .ds-main-image {
          transform: scale(1.04);
        }

        .ds-image-badge-wrap {
          position: absolute;
          top: 14px;
          left: 14px;
          right: 14px;
          display: flex;
          justify-content: space-between;
          pointer-events: none;
        }

        .ds-badge-hot {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(239, 68, 68, 0.9);
          color: #ffffff;
          font-weight: 700;
          font-size: 12px;
          backdrop-filter: blur(8px);
        }

        .ds-badge-duration {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.75);
          color: #ffffff;
          font-weight: 600;
          font-size: 12px;
          backdrop-filter: blur(8px);
        }

        .ds-trust-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .trust-mini-card {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .dark-theme .trust-mini-card {
          background: #0f172a;
          border-color: #334155;
        }

        .trust-icon {
          color: #0284c7;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .dark-theme .trust-icon {
          color: #38bdf8;
        }

        .trust-mini-card h4 {
          font-size: 13.5px;
          font-weight: 700;
          margin: 0 0 2px;
          color: #0f172a;
        }

        .dark-theme .trust-mini-card h4 {
          color: #ffffff;
        }

        .trust-mini-card p {
          font-size: 12px;
          margin: 0;
          color: #64748b;
        }

        .dark-theme .trust-mini-card p {
          color: #94a3b8;
        }

        /* --- RIGHT COLUMN: INFO --- */
        .ds-info-column {
          display: flex;
          flex-direction: column;
        }

        .ds-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 999px;
          background: rgba(2, 132, 199, 0.1);
          color: #0284c7;
          font-size: 12.5px;
          font-weight: 700;
          width: fit-content;
          margin-bottom: 12px;
        }

        .dark-theme .ds-tag-pill {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
        }

        .ds-title {
          font-size: 30px;
          font-weight: 800;
          line-height: 1.25;
          margin: 0 0 14px;
          color: #0f172a;
        }

        .dark-theme .ds-title {
          color: #ffffff;
        }

        .ds-rating-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }

        .ds-stars {
          display: flex;
          gap: 3px;
        }

        .ds-rating-score {
          font-size: 14.5px;
          font-weight: 700;
          color: #f59e0b;
        }

        .ds-rating-divider {
          color: #cbd5e1;
        }

        .ds-review-count {
          font-size: 13.5px;
          color: #64748b;
        }

        .dark-theme .ds-review-count {
          color: #94a3b8;
        }

        .ds-summary {
          font-size: 15.5px;
          line-height: 1.65;
          color: #475569;
          margin: 0 0 24px;
        }

        .dark-theme .ds-summary {
          color: #cbd5e1;
        }

        /* --- PRICE CARD --- */
        .ds-price-card {
          padding: 20px 24px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(37, 99, 235, 0.03) 100%);
          border: 1px solid rgba(2, 132, 199, 0.2);
          margin-bottom: 28px;
        }

        .dark-theme .ds-price-card {
          background: rgba(2, 132, 199, 0.1);
          border-color: rgba(56, 189, 248, 0.25);
        }

        .ds-price-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 8px;
        }

        .ds-price-value {
          font-size: 32px;
          font-weight: 800;
          color: #0284c7;
          letter-spacing: -0.02em;
        }

        .dark-theme .ds-price-value {
          color: #38bdf8;
        }

        .ds-price-original {
          font-size: 18px;
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 500;
        }

        .ds-price-unit {
          font-size: 14px;
          color: #64748b;
          font-weight: 600;
        }

        .dark-theme .ds-price-unit {
          color: #94a3b8;
        }

        .ds-installment-tip {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #059669;
          font-weight: 600;
        }

        /* --- ACTIONS BLOCK --- */
        .ds-actions-block {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 24px;
        }

        .ds-quantity-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .qty-label {
          font-size: 14px;
          font-weight: 600;
          color: #475569;
        }

        .dark-theme .qty-label {
          color: #cbd5e1;
        }

        .ds-quantity-selector {
          display: flex;
          align-items: center;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          background: #ffffff;
          overflow: hidden;
        }

        .dark-theme .ds-quantity-selector {
          background: #0f172a;
          border-color: #334155;
        }

        .qty-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: #0f172a;
          cursor: pointer;
          transition: background 0.15s;
        }

        .dark-theme .qty-btn {
          color: #ffffff;
        }

        .qty-btn:hover {
          background: rgba(2, 132, 199, 0.1);
          color: #0284c7;
        }

        .qty-value {
          min-width: 44px;
          text-align: center;
          font-size: 15px;
          font-weight: 700;
        }

        .ds-button-group {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 14px;
        }

        .ds-book-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 15px 24px;
          border-radius: 14px;
          background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
          color: #ffffff;
          border: none;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
        }

        .ds-book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(2, 132, 199, 0.45);
        }

        .ds-cart-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 15px 20px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          color: #0f172a;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dark-theme .ds-cart-btn {
          background: #0f172a;
          border-color: #334155;
          color: #ffffff;
        }

        .ds-cart-btn:hover {
          border-color: #0284c7;
          color: #0284c7;
          background: rgba(2, 132, 199, 0.08);
          transform: translateY(-2px);
        }

        .dark-theme .ds-cart-btn:hover {
          border-color: #38bdf8;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.12);
        }

        /* --- HELPLINE BOX --- */
        .ds-helpline-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 14px;
          background: #f1f5f9;
          border: 1px dashed #cbd5e1;
          font-size: 13px;
        }

        .dark-theme .ds-helpline-box {
          background: #0f172a;
          border-color: #334155;
        }

        .phone-icon {
          color: #0284c7;
          flex-shrink: 0;
        }

        .dark-theme .phone-icon {
          color: #38bdf8;
        }

        .ds-helpline-box strong {
          display: block;
          color: #0f172a;
        }

        .dark-theme .ds-helpline-box strong {
          color: #ffffff;
        }

        .ds-helpline-box a {
          color: #0284c7;
          font-weight: 700;
          text-decoration: none;
        }

        /* --- TABS SECTION --- */
        .ds-tabs-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 48px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }

        .dark-theme .ds-tabs-card {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .ds-tabs-header {
          display: flex;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
          overflow-x: auto;
        }

        .dark-theme .ds-tabs-header {
          background: #0f172a;
          border-color: #334155;
        }

        .ds-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 18px 28px;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border-bottom: 3px solid transparent;
          white-space: nowrap;
        }

        .dark-theme .ds-tab-btn {
          color: #94a3b8;
        }

        .ds-tab-btn:hover {
          color: #0284c7;
        }

        .ds-tab-btn.active {
          color: #0284c7;
          border-bottom-color: #0284c7;
          background: #ffffff;
        }

        .dark-theme .ds-tab-btn.active {
          color: #38bdf8;
          border-bottom-color: #38bdf8;
          background: #1e293b;
        }

        .ds-tabs-body {
          padding: 32px 36px;
        }

        .ds-description-prose {
          font-size: 16px;
          line-height: 1.85;
          color: #334155;
        }

        .dark-theme .ds-description-prose {
          color: #cbd5e1;
        }

        /* --- COMMITMENTS GRID --- */
        .ds-commitments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .commitment-item {
          padding: 24px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .dark-theme .commitment-item {
          background: #0f172a;
          border-color: #334155;
        }

        .commit-icon {
          color: #0284c7;
          margin-bottom: 12px;
        }

        .dark-theme .commit-icon {
          color: #38bdf8;
        }

        .commitment-item h4 {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 8px;
          color: #0f172a;
        }

        .dark-theme .commitment-item h4 {
          color: #ffffff;
        }

        .commitment-item p {
          font-size: 14px;
          line-height: 1.6;
          color: #64748b;
          margin: 0;
        }

        .dark-theme .commitment-item p {
          color: #94a3b8;
        }

        /* --- REVIEWS TAB --- */
        .ds-reviews-container {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .ds-review-cards-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ds-single-review {
          display: flex;
          gap: 16px;
          padding: 20px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .dark-theme .ds-single-review {
          background: #0f172a;
          border-color: #334155;
        }

        .reviewer-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0284c7, #2563eb);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 17px;
          flex-shrink: 0;
        }

        .reviewer-content {
          flex: 1;
        }

        .reviewer-meta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }

        .reviewer-email {
          font-weight: 700;
          font-size: 14.5px;
          color: #0f172a;
        }

        .dark-theme .reviewer-email {
          color: #ffffff;
        }

        .reviewer-date {
          font-size: 12.5px;
          color: #94a3b8;
        }

        .reviewer-actions {
          margin-left: auto;
          display: flex;
          gap: 6px;
        }

        .review-action-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
        }

        .review-action-btn:hover {
          color: #0284c7;
        }

        .review-action-btn.delete:hover {
          color: #ef4444;
        }

        .reviewer-stars {
          display: flex;
          gap: 3px;
          margin-bottom: 8px;
        }

        .reviewer-comment {
          font-size: 14.5px;
          line-height: 1.6;
          color: #334155;
          margin: 0;
        }

        .dark-theme .reviewer-comment {
          color: #cbd5e1;
        }

        .ds-no-reviews-box {
          text-align: center;
          padding: 40px 20px;
          color: #94a3b8;
        }

        .ds-no-reviews-box p {
          margin-top: 10px;
          font-size: 15px;
        }

        /* --- ADD REVIEW FORM --- */
        .ds-add-review-card {
          padding: 24px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .dark-theme .ds-add-review-card {
          background: #0f172a;
          border-color: #334155;
        }

        .ds-add-review-card h3 {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 16px;
        }

        .rating-picker-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 14px;
          font-weight: 600;
        }

        .rating-star-buttons {
          display: flex;
          gap: 4px;
        }

        .star-pick-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 2px;
        }

        .ds-add-review-card textarea {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: 1.5px solid #cbd5e1;
          background: #ffffff;
          font-size: 14.5px;
          color: #0f172a;
          outline: none;
          margin-bottom: 16px;
          box-sizing: border-box;
        }

        .dark-theme .ds-add-review-card textarea {
          background: #1e293b;
          border-color: #334155;
          color: #ffffff;
        }

        .submit-review-btn {
          padding: 12px 28px;
          border-radius: 12px;
          background: #0284c7;
          color: #ffffff;
          border: none;
          font-weight: 700;
          font-size: 14.5px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-review-btn:hover {
          background: #0369a1;
        }

        /* --- RELATED SERVICES --- */
        .ds-related-section {
          margin-top: 48px;
        }

        .ds-related-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0 0 24px;
          color: #0f172a;
        }

        .dark-theme .ds-related-title {
          color: #ffffff;
        }

        .ds-related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .ds-related-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        .dark-theme .ds-related-card {
          background: #1e293b;
          border-color: #334155;
        }

        .ds-related-card:hover {
          transform: translateY(-4px);
          border-color: #0284c7;
          box-shadow: 0 10px 24px rgba(2, 132, 199, 0.12);
        }

        .dark-theme .ds-related-card:hover {
          border-color: #38bdf8;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
        }

        .related-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          background: #f1f5f9;
          overflow: hidden;
        }

        .related-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .ds-related-card:hover .related-img-wrap img {
          transform: scale(1.05);
        }

        .related-duration-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.75);
          color: #ffffff;
          font-size: 11px;
          font-weight: 600;
        }

        .related-info-wrap {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .related-name {
          font-size: 16.5px;
          font-weight: 700;
          margin: 0 0 6px;
          line-height: 1.35;
          color: #0f172a;
        }

        .dark-theme .related-name {
          color: #ffffff;
        }

        .related-summary {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
          margin: 0 0 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .dark-theme .related-summary {
          color: #94a3b8;
        }

        .related-bottom-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px dashed #e2e8f0;
        }

        .dark-theme .related-bottom-row {
          border-top-color: #334155;
        }

        .related-price {
          font-size: 17px;
          font-weight: 800;
          color: #0284c7;
        }

        .dark-theme .related-price {
          color: #38bdf8;
        }

        .related-action-btn {
          padding: 7px 14px;
          border-radius: 8px;
          background: #0284c7;
          color: #ffffff;
          border: none;
          font-weight: 600;
          font-size: 12.5px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .related-action-btn:hover {
          background: #0369a1;
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 860px) {
          .ds-hero-card {
            grid-template-columns: 1fr;
            padding: 24px;
          }
          .ds-button-group {
            grid-template-columns: 1fr;
          }
          .ds-tabs-body {
            padding: 24px 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default DetailService;
