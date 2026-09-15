import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  ShoppingCart,
  Calendar,
  Star,
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
  CheckCircle,
  Eye,
} from "lucide-react";

import { useServices } from "../features/services/useServices";
import { useLanguage } from "../context/LanguageContext";
import { useDarkMode } from "../hooks/useDarkMode";
import Loading from "../components/Loading";
import { handleSearchServices } from "../apis";
import { setCountCart } from "../redux/slices/cartUiSlice";
import { getImageUrl, handleImageError } from "../utils/imageHelper";
import {
  translateService,
  formatLocalizedPrice,
} from "../utils/dataTranslator";

const ITEMS_PER_PAGE = 9;

function Shop() {
  const { isLoading, error, services = [] } = useServices();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isDarkMode } = useDarkMode();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const CATEGORIES = useMemo(
    () => [
      { id: "all", label: t("shop.catAll") },
      { id: "implant", label: t("shop.catImplant") },
      { id: "ortho", label: t("shop.catOrtho") },
      { id: "cosmetic", label: t("shop.catCosmetic") },
      { id: "general", label: t("shop.catGeneral") },
    ],
    [t]
  );

  const SORT_OPTIONS = useMemo(
    () => [
      { value: "default", label: t("shop.sortDefault") },
      { value: "name-asc", label: t("shop.sortNameAsc") },
      { value: "name-desc", label: t("shop.sortNameDesc") },
      { value: "price-asc", label: t("shop.sortPriceAsc") },
      { value: "price-desc", label: t("shop.sortPriceDesc") },
    ],
    [t]
  );

  const searchEnabled = Boolean(searchQuery.trim());
  const { data: searchedServices = [], isLoading: isSearching } = useQuery({
    queryKey: ["search-services", searchQuery],
    queryFn: () => handleSearchServices({ q: searchQuery.trim(), limit: 200 }),
    enabled: searchEnabled,
  });

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    const cartItems = cartData ? JSON.parse(cartData) : [];
    dispatch(setCountCart(cartItems.length));
  }, [dispatch]);

  const filteredAndSortedServices = useMemo(() => {
    const rawList = searchEnabled
      ? [...(searchedServices || [])]
      : [...(services || [])];

    // Filter by Category
    let list = rawList.map((s) => translateService(s, language));

    if (selectedCategory !== "all") {
      list = list.filter((s) => {
        const text = `${s.nameService || ""} ${s.summary || ""} ${s.description || ""}`.toLowerCase();
        switch (selectedCategory) {
          case "implant":
            return (
              text.includes("implant") ||
              text.includes("trồng răng") ||
              text.includes("cấy ghép") ||
              text.includes("种植")
            );
          case "ortho":
            return (
              text.includes("niềng") ||
              text.includes("chỉnh nha") ||
              text.includes("invisalign") ||
              text.includes("mắc cài") ||
              text.includes("正畸") ||
              text.includes("orthodont")
            );
          case "cosmetic":
            return (
              text.includes("sứ") ||
              text.includes("tẩy trắng") ||
              text.includes("veneer") ||
              text.includes("thẩm mỹ") ||
              text.includes("đính đá") ||
              text.includes("美白") ||
              text.includes("贴面")
            );
          case "general":
            return (
              text.includes("nhổ") ||
              text.includes("khôn") ||
              text.includes("trám") ||
              text.includes("tủy") ||
              text.includes("cạo vôi") ||
              text.includes("vệ sinh") ||
              text.includes("viêm") ||
              text.includes("洁牙") ||
              text.includes("补牙") ||
              text.includes("拔牙")
            );
          default:
            return true;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case "name-asc":
        list.sort((a, b) =>
          (a.nameService || "").localeCompare(b.nameService || "")
        );
        break;
      case "name-desc":
        list.sort((a, b) =>
          (b.nameService || "").localeCompare(a.nameService || "")
        );
        break;
      case "price-asc":
        list.sort(
          (a, b) =>
            (a.priceDiscount || a.priceService || 0) -
            (b.priceDiscount || b.priceService || 0)
        );
        break;
      case "price-desc":
        list.sort(
          (a, b) =>
            (b.priceDiscount || b.priceService || 0) -
            (a.priceDiscount || a.priceService || 0)
        );
        break;
      default:
        break;
    }

    return list;
  }, [services, searchedServices, searchEnabled, selectedCategory, sortBy, language]);

  const totalPages = Math.ceil(
    filteredAndSortedServices.length / ITEMS_PER_PAGE
  );
  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedServices.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedServices, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const addToCart = (service, e) => {
    if (e) e.stopPropagation();
    const cartData = localStorage.getItem("cart");
    let currentCart = cartData ? JSON.parse(cartData) : [];

    const cartItem = { ...service, Unit: service.Unit || "Giờ" };
    const existingIndex = currentCart.findIndex((item) => item._id === service._id);

    if (existingIndex > -1) {
      currentCart[existingIndex] = {
        ...currentCart[existingIndex],
        quantity: (currentCart[existingIndex].quantity || 1) + 1,
      };
    } else {
      currentCart.push({ ...cartItem, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(currentCart));
    dispatch(setCountCart(currentCart.length));
    toast.success(t("toast.addToCartSuccess"));
  };

  const handleBookNow = (serviceId, e) => {
    if (e) e.stopPropagation();
    navigate(`/booking?serviceId=${serviceId}`);
  };

  const formatPrice = (price) => formatLocalizedPrice(price, language);

  if (isLoading) return <Loading />;
  if (searchEnabled && isSearching) return <Loading />;
  if (error)
    return (
      <div className={`shop-page ${isDarkMode ? "dark-theme" : ""}`}>
        <div className="shop-error">
          <p>Không thể tải dữ liệu: {error.message}</p>
        </div>
      </div>
    );

  return (
    <div className={`shop-page ${isDarkMode ? "dark-theme" : ""}`}>
      {/* 1. HERO SHOWCASE BANNER */}
      <section className="shop-hero">
        <div className="shop-hero-content">
          <div className="shop-hero-badge">
            <Sparkles size={16} className="badge-sparkle" />
            <span>{t("shop.heroBadge")}</span>
          </div>
          <h1 className="shop-hero-title">{t("shop.heroTitle")}</h1>
          <p className="shop-hero-subtitle">{t("shop.heroSubtitle")}</p>

          <div className="shop-trust-grid">
            <div className="trust-item">
              <ShieldCheck size={18} className="trust-icon" />
              <span>{t("shop.trustTag1")}</span>
            </div>
            <div className="trust-item">
              <Award size={18} className="trust-icon" />
              <span>{t("shop.trustTag2")}</span>
            </div>
            <div className="trust-item">
              <CheckCircle size={18} className="trust-icon" />
              <span>{t("shop.trustTag3")}</span>
            </div>
            <div className="trust-item">
              <CreditCard size={18} className="trust-icon" />
              <span>{t("shop.trustTag4")}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="shop-container">
        {/* 2. CATEGORY PILL FILTER */}
        <div className="category-chips-container">
          <div className="category-chips">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-chip ${
                  selectedCategory === cat.id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. SEARCH & SORT TOOLBAR */}
        <div className="shop-toolbar-card">
          <div className="shop-search-wrapper">
            <Search size={20} className="shop-search-icon" />
            <input
              type="text"
              placeholder={t("shop.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shop-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="shop-toolbar-controls">
            <div className="sort-group">
              <label htmlFor="shop-sort" className="shop-sort-label">
                {t("shop.sortLabel")}
              </label>
              <select
                id="shop-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="shop-sort-select"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="results-counter-badge">
              <span>
                {filteredAndSortedServices.length} {t("shop.resultsCount")}
              </span>
            </div>
          </div>
        </div>

        {/* 4. EMPTY STATE */}
        {filteredAndSortedServices.length === 0 && (
          <div className="shop-empty-card">
            <div className="empty-icon-wrap">
              <Search size={40} />
            </div>
            <h3>{t("shop.emptyMessage")}</h3>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSortBy("default");
              }}
              className="shop-reset-btn"
            >
              {t("shop.resetFilter")}
            </button>
          </div>
        )}

        {/* 5. SERVICE CARDS GRID */}
        {paginatedServices.length > 0 && (
          <>
            <div className="shop-cards-grid">
              {paginatedServices.map((service) => {
                const hasDiscount =
                  service.priceDiscount &&
                  service.priceDiscount < service.priceService;

                return (
                  <article
                    key={service._id}
                    className="dental-service-card"
                    onClick={() => navigate(`/shop/${service._id}`)}
                  >
                    {/* Media Thumbnail */}
                    <div className="card-media-wrap">
                      <img
                        src={getImageUrl(service.photoService)}
                        alt={service.nameService}
                        loading="lazy"
                        onError={handleImageError}
                        className="service-image"
                      />
                      <div className="card-media-overlay">
                        <span className="view-detail-btn">
                          <Eye size={16} /> {t("shop.viewDetail")}
                        </span>
                      </div>

                      {/* Tag Badges */}
                      <div className="card-badge-top-left">
                        <span className="badge-tag hot-tag">
                          <Sparkles size={12} /> {t("shop.hotTag")}
                        </span>
                      </div>

                      <div className="card-badge-top-right">
                        <span className="badge-tag duration-tag">
                          <Clock size={12} /> {service.durationMinutes || 30}{" "}
                          {t("booking.durationUnit")}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-content">
                      <div className="card-rating-row">
                        <div className="star-rating">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className="star-filled"
                              fill="#f59e0b"
                              color="#f59e0b"
                            />
                          ))}
                        </div>
                        <span className="rating-text">4.9 / 5.0 (180+)</span>
                      </div>

                      <h3 className="card-service-title">{service.nameService}</h3>

                      <p className="card-service-desc">
                        {service.summary ||
                          service.description?.slice(0, 95) ||
                          "Dịch vụ nha khoa chuyên sâu chất lượng cao đạt chuẩn Châu Âu."}
                        {(service.description?.length || 0) > 95 && !service.summary
                          ? "..."
                          : ""}
                      </p>

                      {/* Price Section */}
                      <div className="card-price-section">
                        <div className="price-stack">
                          <span className="current-price">
                            {formatPrice(
                              service.priceDiscount || service.priceService || 0
                            )}
                          </span>
                          {hasDiscount && (
                            <span className="original-price">
                              {formatPrice(service.priceService)}
                            </span>
                          )}
                        </div>
                        <span className="price-unit">
                          / {service.Unit || t("shop.perHour")}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="card-actions-row">
                        <button
                          type="button"
                          className="book-now-action-btn"
                          onClick={(e) => handleBookNow(service._id, e)}
                        >
                          <Calendar size={16} />
                          <span>{t("shop.bookNow")}</span>
                        </button>
                        <button
                          type="button"
                          className="cart-action-btn"
                          onClick={(e) => addToCart(service, e)}
                          title={t("shop.addToCart")}
                          aria-label={t("shop.addToCart")}
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* 6. MODERN PAGINATION */}
            {totalPages > 1 && (
              <nav className="shop-pagination-nav" aria-label="Phân trang">
                <button
                  type="button"
                  className="page-nav-btn prev-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Trang trước"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="page-numbers-list">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        className={`page-num-btn ${
                          currentPage === page ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  type="button"
                  className="page-nav-btn next-btn"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Trang sau"
                >
                  <ChevronRight size={18} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      <style>{`
        /* --- MAIN PAGE STYLING --- */
        .shop-page {
          min-height: 90vh;
          background: #f8fafc;
          color: #0f172a;
          font-family: inherit;
          padding-bottom: 80px;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .shop-page.dark-theme {
          background: #090d16;
          color: #f8fafc;
        }

        .shop-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* --- 1. HERO SHOWCASE --- */
        .shop-hero {
          position: relative;
          background: linear-gradient(135deg, #0284c7 0%, #1e40af 100%);
          padding: 56px 24px 48px;
          color: #ffffff;
          text-align: center;
          margin-bottom: 32px;
          box-shadow: 0 10px 30px rgba(2, 132, 199, 0.15);
        }

        .dark-theme .shop-hero {
          background: linear-gradient(135deg, #0f2b48 0%, #172554 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .shop-hero-content {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .shop-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 18px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(10px);
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .badge-sparkle {
          color: #fde047;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        .shop-hero-title {
          font-size: 38px;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.2;
          color: #ffffff;
        }

        .shop-hero-subtitle {
          font-size: 16px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.88);
          max-width: 650px;
          margin: 0;
        }

        .shop-trust-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px 24px;
          margin-top: 14px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          font-weight: 600;
          color: #f0fdf4;
        }

        .trust-icon {
          color: #4ade80;
        }

        /* --- 2. CATEGORY CHIPS --- */
        .category-chips-container {
          margin-bottom: 24px;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }

        .category-chips-container::-webkit-scrollbar {
          display: none;
        }

        .category-chips {
          display: flex;
          gap: 10px;
          padding: 4px 2px;
        }

        .category-chip {
          padding: 10px 22px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          white-space: nowrap;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
        }

        .category-chip:hover {
          border-color: #0284c7;
          color: #0284c7;
          transform: translateY(-1px);
        }

        .category-chip.active {
          background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
        }

        .dark-theme .category-chip {
          background: #1e293b;
          border-color: #334155;
          color: #94a3b8;
        }

        .dark-theme .category-chip:hover {
          border-color: #38bdf8;
          color: #38bdf8;
        }

        .dark-theme .category-chip.active {
          background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
        }

        /* --- 3. TOOLBAR CARD --- */
        .shop-toolbar-card {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 16px 20px;
          margin-bottom: 32px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .dark-theme .shop-toolbar-card {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }

        .shop-search-wrapper {
          position: relative;
          flex: 1;
          min-width: 280px;
          max-width: 460px;
        }

        .shop-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .shop-search-input {
          width: 100%;
          padding: 11px 40px 11px 42px;
          border-radius: 12px;
          border: 1.5px solid #cbd5e1;
          background: #f8fafc;
          font-size: 14.5px;
          color: #0f172a;
          outline: none;
          transition: all 0.2s ease;
        }

        .dark-theme .shop-search-input {
          background: #0f172a;
          border-color: #334155;
          color: #ffffff;
        }

        .shop-search-input:focus {
          border-color: #0284c7;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
        }

        .dark-theme .shop-search-input:focus {
          background: #0f172a;
          border-color: #38bdf8;
          box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
        }

        .search-clear-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
        }

        .search-clear-btn:hover {
          color: #0f172a;
        }

        .shop-toolbar-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .sort-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .shop-sort-label {
          font-size: 13.5px;
          font-weight: 600;
          color: #64748b;
          white-space: nowrap;
        }

        .dark-theme .shop-sort-label {
          color: #94a3b8;
        }

        .shop-sort-select {
          padding: 10px 32px 10px 14px;
          border-radius: 10px;
          border: 1.5px solid #cbd5e1;
          background: #f8fafc;
          color: #0f172a;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          outline: none;
        }

        .dark-theme .shop-sort-select {
          background-color: #0f172a;
          border-color: #334155;
          color: #ffffff;
        }

        .shop-sort-select:focus {
          border-color: #0284c7;
        }

        .results-counter-badge {
          padding: 8px 14px;
          border-radius: 8px;
          background: rgba(2, 132, 199, 0.08);
          color: #0284c7;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
        }

        .dark-theme .results-counter-badge {
          background: rgba(56, 189, 248, 0.12);
          color: #38bdf8;
        }

        /* --- 4. EMPTY CARD --- */
        .shop-empty-card {
          text-align: center;
          padding: 60px 24px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          margin: 32px 0;
        }

        .dark-theme .shop-empty-card {
          background: #1e293b;
          border-color: #334155;
        }

        .empty-icon-wrap {
          width: 70px;
          height: 70px;
          margin: 0 auto 16px;
          border-radius: 50%;
          background: rgba(2, 132, 199, 0.1);
          color: #0284c7;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .shop-empty-card h3 {
          font-size: 18px;
          margin: 0 0 16px;
          color: #64748b;
        }

        .shop-reset-btn {
          padding: 11px 24px;
          border-radius: 999px;
          background: #0284c7;
          color: #ffffff;
          border: none;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .shop-reset-btn:hover {
          background: #0369a1;
        }

        /* --- 5. CARDS GRID --- */
        .shop-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 26px;
        }

        .dental-service-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
          position: relative;
        }

        .dark-theme .dental-service-card {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
        }

        .dental-service-card:hover {
          transform: translateY(-6px);
          border-color: #0284c7;
          box-shadow: 0 14px 28px rgba(2, 132, 199, 0.14);
        }

        .dark-theme .dental-service-card:hover {
          border-color: #38bdf8;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45);
        }

        .card-media-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          background: #f1f5f9;
          overflow: hidden;
        }

        .dark-theme .card-media-wrap {
          background: #0f172a;
        }

        .service-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .dental-service-card:hover .service-image {
          transform: scale(1.06);
        }

        .card-media-overlay {
          position: absolute;
          inset: 0;
          background: rgba(2, 132, 199, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .dental-service-card:hover .card-media-overlay {
          opacity: 1;
        }

        .view-detail-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.95);
          color: #0284c7;
          font-weight: 700;
          font-size: 13px;
          border-radius: 999px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        }

        .card-badge-top-left {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
        }

        .card-badge-top-right {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
        }

        .badge-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11.5px;
          font-weight: 700;
          backdrop-filter: blur(8px);
        }

        .hot-tag {
          background: rgba(239, 68, 68, 0.9);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.35);
        }

        .duration-tag {
          background: rgba(15, 23, 42, 0.75);
          color: #ffffff;
        }

        .card-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .star-rating {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .rating-text {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }

        .dark-theme .rating-text {
          color: #94a3b8;
        }

        .card-service-title {
          font-size: 17px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.35;
          margin: 0 0 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 44px;
        }

        .dark-theme .card-service-title {
          color: #f8fafc;
        }

        .card-service-desc {
          font-size: 13.5px;
          color: #64748b;
          line-height: 1.5;
          margin: 0 0 16px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .dark-theme .card-service-desc {
          color: #94a3b8;
        }

        .card-price-section {
          display: flex;
          align-items: baseline;
          gap: 6px;
          padding-top: 14px;
          border-top: 1px dashed #e2e8f0;
          margin-bottom: 16px;
        }

        .dark-theme .card-price-section {
          border-top-color: #334155;
        }

        .price-stack {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .current-price {
          font-size: 20px;
          font-weight: 800;
          color: #0284c7;
          letter-spacing: -0.01em;
        }

        .dark-theme .current-price {
          color: #38bdf8;
        }

        .original-price {
          font-size: 13.5px;
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 500;
        }

        .price-unit {
          font-size: 12.5px;
          font-weight: 500;
          color: #94a3b8;
        }

        .card-actions-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
        }

        .book-now-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 11px 16px;
          background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 10px rgba(2, 132, 199, 0.25);
        }

        .book-now-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(2, 132, 199, 0.35);
        }

        .cart-action-btn {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          color: #0f172a;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dark-theme .cart-action-btn {
          background: #0f172a;
          border-color: #334155;
          color: #f8fafc;
        }

        .cart-action-btn:hover {
          border-color: #0284c7;
          color: #0284c7;
          background: rgba(2, 132, 199, 0.08);
          transform: translateY(-2px);
        }

        .dark-theme .cart-action-btn:hover {
          border-color: #38bdf8;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.12);
        }

        /* --- 6. PAGINATION --- */
        .shop-pagination-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 48px;
        }

        .page-nav-btn {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          color: #0f172a;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dark-theme .page-nav-btn {
          background: #1e293b;
          border-color: #334155;
          color: #f8fafc;
        }

        .page-nav-btn:hover:not(:disabled) {
          border-color: #0284c7;
          color: #0284c7;
        }

        .page-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .page-numbers-list {
          display: flex;
          gap: 6px;
        }

        .page-num-btn {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          color: #0f172a;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dark-theme .page-num-btn {
          background: #1e293b;
          border-color: #334155;
          color: #f8fafc;
        }

        .page-num-btn:hover {
          border-color: #0284c7;
          color: #0284c7;
        }

        .page-num-btn.active {
          background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
          border-color: transparent;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
        }

        /* --- RESPONSIVE --- */
        @media (max-width: 768px) {
          .shop-hero-title {
            font-size: 28px;
          }
          .shop-toolbar-card {
            flex-direction: column;
            align-items: stretch;
          }
          .shop-search-wrapper {
            max-width: none;
          }
          .shop-toolbar-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .sort-group {
            justify-content: space-between;
          }
          .results-counter-badge {
            text-align: center;
          }
          .shop-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Shop;
