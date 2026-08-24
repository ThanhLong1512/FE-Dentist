import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useServices } from "../features/services/useServices";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../context/LanguageContext";
import Loading from "../components/Loading";
import { Search, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { handleSearchServices } from "../apis";
import { setCountCart } from "../redux/slices/cartUiSlice";

const ITEMS_PER_PAGE = 9;

function Shop() {
  const { isLoading, error, services = [] } = useServices();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useLanguage();

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

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const searchEnabled = Boolean(searchQuery.trim());
  const { data: searchedServices = [], isLoading: isSearching } = useQuery({
    queryKey: ["search-services", searchQuery],
    queryFn: () =>
      handleSearchServices({ q: searchQuery.trim(), limit: 200 }),
    enabled: searchEnabled,
  });

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    const cartItems = cartData ? JSON.parse(cartData) : [];
    dispatch(setCountCart(cartItems.length));
  }, [dispatch]);

  const filteredAndSortedServices = useMemo(() => {
    let result = searchEnabled ? [...(searchedServices || [])] : [...(services || [])];

    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) =>
          (a.nameService || "").localeCompare(b.nameService || "")
        );
        break;
      case "name-desc":
        result.sort((a, b) =>
          (b.nameService || "").localeCompare(a.nameService || "")
        );
        break;
      case "price-asc":
        result.sort((a, b) => (a.priceService || 0) - (b.priceService || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.priceService || 0) - (a.priceService || 0));
        break;
      default:
        break;
    }

    return result;
  }, [services, searchedServices, searchEnabled, sortBy]);

  const totalPages = Math.ceil(
    filteredAndSortedServices.length / ITEMS_PER_PAGE
  );
  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedServices.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedServices, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const addToCart = (service) => {
    const cartData = localStorage.getItem("cart");
    let currentCart = cartData ? JSON.parse(cartData) : [];

    const cartItem = { ...service, Unit: "Hour" };
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

  const formatPrice = (price) =>
    (price || 0).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  if (isLoading) return <Loading />;
  if (searchEnabled && isSearching) return <Loading />;
  if (error)
    return (
      <div className="shop-error">
        <p>Không thể tải dữ liệu: {error.message}</p>
      </div>
    );

  return (
    <div className="shop-page">
      <div className="shop-container">
        {/* Toolbar: Search + Sort */}
        <div className="shop-toolbar">
          <div className="shop-search">
            <Search size={20} className="shop-search-icon" />
            <input
              type="text"
              placeholder={t("shop.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shop-search-input"
            />
          </div>
          <div className="shop-controls">
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
            <span className="shop-results-count">
              {filteredAndSortedServices.length} {t("shop.resultsCount")}
            </span>
          </div>
        </div>

        {/* Empty state */}
        {filteredAndSortedServices.length === 0 && (
          <div className="shop-empty">
            <p>{t("shop.emptyMessage")}</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSortBy("default");
              }}
              className="shop-reset-btn"
            >
              {t("shop.resetFilter")}
            </button>
          </div>
        )}

        {/* Product Grid */}
        {paginatedServices.length > 0 && (
          <>
            <div className="shop-grid">
              {paginatedServices.map((service) => (
                <article key={service._id} className="shop-card">
                  <div
                    className="shop-card-image"
                    onClick={() => navigate(`/shop/${service._id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === "Enter" && navigate(`/shop/${service._id}`)
                    }
                  >
                    <img
                      src={
                      service.photoService?.url ||
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f1f5f9' width='400' height='300'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EDịch vụ%3C/text%3E%3C/svg%3E"
                    }
                      alt={service.nameService}
                      loading="lazy"
                    />
                    <div className="shop-card-overlay">
                      <span>{t("shop.viewDetail")}</span>
                    </div>
                  </div>
                  <div className="shop-card-body">
                    <h3 className="shop-card-title">{service.nameService}</h3>
                    <p className="shop-card-desc">
                      {service.description?.slice(0, 80)}
                      {(service.description?.length || 0) > 80 ? "..." : ""}
                    </p>
                    <div className="shop-card-meta">
                      <span className="shop-card-price">
                        {formatPrice(service.priceService)}
                      </span>
                      <span className="shop-card-unit">
                        / {service.Unit || t("shop.perHour")}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(service)}
                      className="shop-card-btn"
                    >
                      <ShoppingCart size={18} />
                      {t("shop.addToCart")}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="shop-pagination" aria-label="Phân trang">
                <button
                  type="button"
                  className="shop-pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Trang trước"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="shop-pagination-pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        className={`shop-pagination-page ${
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
                  className="shop-pagination-btn"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Trang sau"
                >
                  <ChevronRight size={20} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      <style>{`
        .shop-page {
          padding: 40px 0 60px;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          min-height: 60vh;
        }
        .shop-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .shop-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          padding: 24px 28px;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
        }
        .shop-search {
          position: relative;
          flex: 1;
          min-width: 260px;
          max-width: 420px;
        }
        .shop-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #475569;
          pointer-events: none;
        }
        .shop-search-input {
          width: 100%;
          padding: 14px 18px 14px 48px;
          border: 2px solid #cbd5e1;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          color: #1e293b;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .shop-search-input:focus {
          outline: none;
          border-color: #1370b5;
          box-shadow: 0 0 0 4px rgba(19, 112, 181, 0.2);
        }
        .shop-search-input::placeholder {
          color: #475569;
          font-weight: 400;
        }
        .shop-controls {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .shop-sort-label {
          font-size: 15px;
          font-weight: 700;
          color: #334155;
          white-space: nowrap;
        }
        .shop-sort-select {
          padding: 14px 44px 14px 18px;
          border: 2px solid #cbd5e1;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          background: #fff;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 12 12'%3E%3Cpath fill='%23334155' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
        }
        .shop-sort-select:focus {
          outline: none;
          border-color: #1370b5;
        }
        .shop-sort-select option {
          font-weight: 600;
          color: #1e293b;
        }
        .shop-results-count {
          font-size: 15px;
          font-weight: 700;
          color: #334155;
          white-space: nowrap;
        }
        .shop-empty {
          text-align: center;
          padding: 60px 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .shop-empty p {
          color: #64748b;
          margin-bottom: 16px;
        }
        .shop-reset-btn {
          padding: 10px 20px;
          background: #1370b5;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .shop-reset-btn:hover {
          background: #0d5a94;
        }
        .shop-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        .shop-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          flex-direction: column;
        }
        .shop-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        }
        .shop-card-image {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
          cursor: pointer;
          background: #f1f5f9;
        }
        .shop-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
        .shop-card:hover .shop-card-image img {
          transform: scale(1.05);
        }
        .shop-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(19, 112, 181, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .shop-card:hover .shop-card-overlay {
          opacity: 1;
        }
        .shop-card-overlay span {
          color: #fff;
          font-weight: 600;
          font-size: 15px;
        }
        .shop-card-body {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .shop-card-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 8px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .shop-card-desc {
          font-size: 14px;
          color: #64748b;
          line-height: 1.5;
          margin: 0 0 12px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .shop-card-meta {
          margin-bottom: 16px;
        }
        .shop-card-price {
          font-size: 18px;
          font-weight: 700;
          color: #1370b5;
        }
        .shop-card-unit {
          font-size: 13px;
          color: #94a3b8;
        }
        .shop-card-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          background: #1370b5;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .shop-card-btn:hover {
          background: #0d5a94;
        }
        .shop-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 40px;
        }
        .shop-pagination-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e8f0;
          background: #fff;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .shop-pagination-btn:hover:not(:disabled) {
          border-color: #1370b5;
          color: #1370b5;
        }
        .shop-pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .shop-pagination-pages {
          display: flex;
          gap: 6px;
        }
        .shop-pagination-page {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e8f0;
          background: #fff;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .shop-pagination-page:hover {
          border-color: #1370b5;
          color: #1370b5;
        }
        .shop-pagination-page.active {
          background: #1370b5;
          border-color: #1370b5;
          color: #fff;
        }
        .shop-error {
          text-align: center;
          padding: 60px 20px;
          color: #dc2626;
        }
        @media (max-width: 768px) {
          .shop-toolbar {
            flex-direction: column;
            align-items: stretch;
          }
          .shop-search {
            max-width: none;
          }
          .shop-controls {
            justify-content: space-between;
          }
          .shop-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Shop;
