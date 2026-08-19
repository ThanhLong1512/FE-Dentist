import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RecoveryContext } from "../App";
import {
  handlePostReview,
  handleDeleteReview,
  handleUpdateReview,
} from "../apis";
import { toast } from "react-toastify";
import { useService } from "../features/services/useService";
import { useServices } from "../features/services/useServices";
import { useLanguage } from "../context/LanguageContext";
import Loading from "../components/Loading";
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
} from "lucide-react";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f1f5f9' width='400' height='300'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EDịch vụ%3C/text%3E%3C/svg%3E";

function DetailService() {
  const { ServiceID } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { service, isLoading, error } = useService(ServiceID);
  const { services = [] } = useServices();
  const { setCountCart } = useContext(RecoveryContext);

  const [activeTab, setActiveTab] = useState("description");
  const [activeStar, setActiveStar] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(0);

  const userID = JSON.parse(localStorage.getItem("userInfo"))?.id;

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCountCart(cart.length);
  }, [setCountCart]);

  const review = service?.reviews || [];
  const hasReviewed = review.some(
    (r) => r.account?._id === userID && r.service === service?._id
  );

  const relatedServices = (services || []).filter(
    (s) => s._id !== ServiceID
  ).slice(0, 3);

  const formatPrice = (price) =>
    (price || 0).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const incrementQuantity = () => setQuantity((p) => p + 1);
  const decrementQuantity = () =>
    setQuantity((p) => (p > 1 ? p - 1 : 1));

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
      unit: "Hour",
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
    setCountCart(currentCart.length);
    toast.success(t("toast.addToCartSuccess"));
  };

  const postReviewMutation = useMutation({
    mutationFn: (data) => handlePostReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service", ServiceID] });
      setReviewText("");
      setActiveStar(0);
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
    if (!service || activeStar < 1) {
      toast.error(t("toast.selectStars"));
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
      <div className="ds-error">
        <p>{error?.message || t("detailService.notFound")}</p>
        <button type="button" onClick={() => navigate("/shop")}>
          {t("detailService.backToShop")}
        </button>
      </div>
    );
  }

  const imgUrl = service.photoService?.url || PLACEHOLDER_IMG;

  return (
    <div className="ds-page">
      <div className="ds-container">
        {/* Back */}
        <button
          type="button"
          className="ds-back"
          onClick={() => navigate("/shop")}
        >
          <ArrowLeft size={18} />
          {t("detailService.backToShop")}
        </button>

        {/* Hero + Info */}
        <section className="ds-hero">
          <div className="ds-hero-image">
            <img src={imgUrl} alt={service.nameService} />
          </div>
          <div className="ds-hero-content">
            <h1 className="ds-title">{service.nameService}</h1>
            <div className="ds-rating-row">
              <div className="ds-stars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i <= (service.ratingsAverage || 0) ? "filled" : ""}
                  />
                ))}
              </div>
              <span className="ds-review-count">
                {service.ratingsQuantity || 0} {t("detailService.reviews")}
              </span>
            </div>
            {service.summary && (
              <p className="ds-summary">{service.summary}</p>
            )}
            <div className="ds-price-row">
              <span className="ds-price">
                {formatPrice(service.priceDiscount || service.priceService)}
              </span>
              {service.priceDiscount && (
                <span className="ds-price-old">
                  {formatPrice(service.priceService)}
                </span>
              )}
              <span className="ds-unit">/ {service.Unit || t("detailService.hour")}</span>
            </div>
            <div className="ds-actions">
              <div className="ds-quantity">
                <button
                  type="button"
                  onClick={decrementQuantity}
                  aria-label={t("detailService.decrease")}
                >
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={incrementQuantity}
                  aria-label={t("detailService.increase")}
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                type="button"
                className="ds-add-cart"
                onClick={addToCart}
              >
                <ShoppingCart size={20} />
                {t("detailService.addToCart")}
              </button>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="ds-tabs-section">
          <div className="ds-tabs-header">
            <button
              type="button"
              className={`ds-tab ${activeTab === "description" ? "active" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              <FileText size={18} />
              {t("detailService.description")}
            </button>
            <button
              type="button"
              className={`ds-tab ${activeTab === "review" ? "active" : ""}`}
              onClick={() => setActiveTab("review")}
            >
              <MessageCircle size={18} />
              {t("detailService.review")} ({service.ratingsQuantity || 0})
            </button>
          </div>

          <div className="ds-tabs-content">
            {activeTab === "description" && (
              <div className="ds-description">
                <p>{service.description || t("detailService.noDescription")}</p>
              </div>
            )}

            {activeTab === "review" && (
              <div className="ds-reviews">
                {review.length > 0 ? (
                  <ul className="ds-review-list">
                    {review.map((r) => (
                      <li key={r._id} className="ds-review-card">
                        <div className="ds-review-avatar">
                          {(r.account?.email?.[0] || "?").toUpperCase()}
                        </div>
                        <div className="ds-review-body">
                          <div className="ds-review-meta">
                            <span className="ds-review-email">
                              {r.account?.email}
                            </span>
                            <span className="ds-review-date">
                              {formatDate(r.createdAt)}
                            </span>
                            {r.account?._id === userID && (
                              <div className="ds-review-actions">
                                {editReviewId === r._id ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditReviewId(null);
                                        setEditReviewText("");
                                        setEditReviewRating(0);
                                      }}
                                    >
                                      {t("detailService.cancel")}
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditReviewId(r._id);
                                        setEditReviewText(r.review);
                                        setEditReviewRating(r.rating);
                                      }}
                                    >
                                      <Pencil size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteReviewClick(r._id)}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="ds-review-stars">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i <= r.rating ? "filled" : ""}
                              />
                            ))}
                          </div>
                          {editReviewId === r._id ? (
                            <form
                              onSubmit={handleUpdateReviewSubmit}
                              className="ds-edit-form"
                            >
                              <textarea
                                value={editReviewText}
                                onChange={(e) => setEditReviewText(e.target.value)}
                                required
                              />
                              <div className="ds-edit-stars">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    onClick={() => setEditReviewRating(i)}
                                  >
                                    <Star
                                      size={18}
                                      className={i <= editReviewRating ? "filled" : ""}
                                    />
                                  </button>
                                ))}
                              </div>
                              <button type="submit">{t("detailService.update")}</button>
                            </form>
                          ) : (
                            <p className="ds-review-text">{r.review}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ds-no-reviews">Chưa có đánh giá nào.</p>
                )}

                {!hasReviewed && (
                  <form
                    onSubmit={handleReviewSubmit}
                    className="ds-add-review"
                  >
                    <h3>{t("detailService.writeReview")}</h3>
                    <div className="ds-add-stars">
                      <span>{t("detailService.yourRating")}</span>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveStar(i)}
                        >
                          <Star
                            size={24}
                            className={i <= activeStar ? "filled" : ""}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      placeholder={t("detailService.reviewPlaceholder")}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      required
                    />
                    <button
                      type="submit"
                      disabled={postReviewMutation.isPending}
                    >
                      {t("detailService.submitReview")}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="ds-related">
            <h2>{t("detailService.relatedServices")}</h2>
            <div className="ds-related-grid">
              {relatedServices.map((s) => (
                <article
                  key={s._id}
                  className="ds-related-card"
                  onClick={() => navigate(`/shop/${s._id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && navigate(`/shop/${s._id}`)
                  }
                >
                  <img
                    src={s.photoService?.url || PLACEHOLDER_IMG}
                    alt={s.nameService}
                  />
                  <div className="ds-related-info">
                    <h4>{s.nameService}</h4>
                    <span>{formatPrice(s.priceService)}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        .ds-page { padding: 24px 0 60px; background: #f8fafc; min-height: 60vh; }
        .ds-container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        .ds-error { text-align: center; padding: 60px 20px; }
        .ds-error button { margin-top: 16px; padding: 10px 20px; background: #1370b5; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
        .ds-back { display: inline-flex; align-items: center; gap: 8px; padding: 10px 0; color: #64748b; background: none; border: none; cursor: pointer; font-size: 15px; margin-bottom: 24px; }
        .ds-back:hover { color: #1370b5; }
        .ds-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); margin-bottom: 32px; }
        .ds-hero-image { aspect-ratio: 4/3; overflow: hidden; background: #f1f5f9; }
        .ds-hero-image img { width: 100%; height: 100%; object-fit: cover; }
        .ds-hero-content { padding: 32px 40px; }
        .ds-title { font-size: 28px; font-weight: 700; color: #1e293b; margin: 0 0 16px; line-height: 1.3; }
        .ds-rating-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .ds-stars { display: flex; gap: 4px; }
        .ds-stars svg, .ds-review-stars svg { color: #e2e8f0; }
        .ds-stars svg.filled, .ds-review-stars svg.filled { color: #fbbf24; fill: #fbbf24; }
        .ds-review-count { font-size: 14px; color: #64748b; }
        .ds-summary { font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 20px; }
        .ds-price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
        .ds-price { font-size: 26px; font-weight: 700; color: #1370b5; }
        .ds-price-old { font-size: 18px; color: #94a3b8; text-decoration: line-through; }
        .ds-unit { font-size: 14px; color: #64748b; }
        .ds-actions { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
        .ds-quantity { display: flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
        .ds-quantity button { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #fff; border: none; cursor: pointer; color: #64748b; }
        .ds-quantity button:hover { background: #f1f5f9; color: #1370b5; }
        .ds-quantity span { min-width: 44px; text-align: center; font-weight: 600; }
        .ds-add-cart { display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px; background: #1370b5; color: #fff; border: none; border-radius: 10px; font-weight: 600; font-size: 16px; cursor: pointer; transition: background 0.2s; }
        .ds-add-cart:hover { background: #0d5a94; }
        .ds-tabs-section { background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); overflow: hidden; margin-bottom: 40px; }
        .ds-tabs-header { display: flex; border-bottom: 1px solid #e2e8f0; }
        .ds-tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 18px 24px; background: none; border: none; font-size: 16px; font-weight: 500; color: #64748b; cursor: pointer; transition: all 0.2s; }
        .ds-tab:hover { color: #1370b5; }
        .ds-tab.active { color: #1370b5; border-bottom: 2px solid #1370b5; margin-bottom: -1px; }
        .ds-tabs-content { padding: 32px 40px; }
        .ds-description p { font-size: 16px; line-height: 1.8; color: #475569; margin: 0; }
        .ds-reviews { display: flex; flex-direction: column; gap: 32px; }
        .ds-review-list { list-style: none; padding: 0; margin: 0; }
        .ds-review-card { display: flex; gap: 20px; padding: 24px; background: #f8fafc; border-radius: 12px; margin-bottom: 16px; }
        .ds-review-avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #1370b5, #0d5a94); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; flex-shrink: 0; }
        .ds-review-body { flex: 1; min-width: 0; }
        .ds-review-meta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
        .ds-review-email { font-weight: 600; color: #1e293b; }
        .ds-review-date { font-size: 13px; color: #94a3b8; }
        .ds-review-actions { display: flex; gap: 8px; margin-left: auto; }
        .ds-review-actions button { background: none; border: none; cursor: pointer; color: #64748b; padding: 4px; }
        .ds-review-actions button:hover { color: #1370b5; }
        .ds-review-stars { margin-bottom: 8px; }
        .ds-review-text { font-size: 15px; line-height: 1.6; color: #475569; margin: 0; }
        .ds-no-reviews { color: #94a3b8; font-size: 15px; margin: 0 0 24px; }
        .ds-add-review { padding: 24px; background: #f8fafc; border-radius: 12px; }
        .ds-add-review h3 { font-size: 18px; margin: 0 0 16px; color: #1e293b; }
        .ds-add-stars { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .ds-add-stars span { font-size: 14px; color: #64748b; }
        .ds-add-stars button { background: none; border: none; cursor: pointer; padding: 4px; }
        .ds-add-stars button svg { color: #e2e8f0; }
        .ds-add-stars button svg.filled { color: #fbbf24; fill: #fbbf24; }
        .ds-add-review textarea { width: 100%; min-height: 120px; padding: 14px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 15px; resize: vertical; margin-bottom: 16px; }
        .ds-add-review textarea:focus { outline: none; border-color: #1370b5; }
        .ds-add-review button { padding: 12px 24px; background: #1370b5; color: #fff; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; }
        .ds-add-review button:hover:not(:disabled) { background: #0d5a94; }
        .ds-add-review button:disabled { opacity: 0.6; cursor: not-allowed; }
        .ds-edit-form textarea { width: 100%; min-height: 80px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 12px; }
        .ds-edit-stars { display: flex; gap: 4px; margin-bottom: 12px; }
        .ds-edit-stars button { background: none; border: none; cursor: pointer; padding: 2px; }
        .ds-edit-form button[type=submit] { padding: 8px 16px; background: #1370b5; color: #fff; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; }
        .ds-related h2 { font-size: 22px; font-weight: 700; color: #1e293b; margin: 0 0 24px; }
        .ds-related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
        .ds-related-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
        .ds-related-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); }
        .ds-related-card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; }
        .ds-related-info { padding: 16px; }
        .ds-related-info h4 { font-size: 16px; font-weight: 600; margin: 0 0 8px; color: #1e293b; }
        .ds-related-info span { font-size: 15px; font-weight: 600; color: #1370b5; }
        @media (max-width: 768px) {
          .ds-hero { grid-template-columns: 1fr; }
          .ds-hero-content { padding: 24px; }
          .ds-title { font-size: 22px; }
          .ds-tabs-content { padding: 24px; }
          .ds-review-card { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}

export default DetailService;
