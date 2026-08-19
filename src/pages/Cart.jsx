import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { RecoveryContext } from "../App";
import { useLanguage } from "../context/LanguageContext";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  Tag,
} from "lucide-react";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f1f5f9' width='400' height='300'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EDịch vụ%3C/text%3E%3C/svg%3E";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [isCorrectCode, setIsCorrectCode] = useState(false);
  const [discount, setDiscount] = useState(0);
  const { setTotalPrice, setCountCart } = useContext(RecoveryContext);
  const { t } = useLanguage();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const syncCartToStorage = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCountCart?.(updatedCart.length);
  };

  const updateQuantity = (itemId, newQuantity) => {
    const qty = Math.max(1, parseInt(newQuantity, 10) || 1);
    const updatedCart = cartItems.map((item) =>
      item._id === itemId ? { ...item, quantity: qty } : item
    );
    syncCartToStorage(updatedCart);
  };

  const incrementQty = (itemId) => {
    const item = cartItems.find((i) => i._id === itemId);
    if (item) updateQuantity(itemId, item.quantity + 1);
  };

  const decrementQty = (itemId) => {
    const item = cartItems.find((i) => i._id === itemId);
    if (item) updateQuantity(itemId, Math.max(1, item.quantity - 1));
  };

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item._id !== itemId);
    syncCartToStorage(updatedCart);
  };

  const getItemPrice = (item) =>
    item.priceDiscount ?? item.priceService ?? 0;

  const subTotal = cartItems.reduce(
    (total, item) => total + getItemPrice(item) * (item.quantity || 1),
    0
  );

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    switch (code) {
      case "DISCOUNT10":
        setDiscount(subTotal * 0.1);
        setIsCorrectCode(true);
        break;
      case "DISCOUNT20":
        setDiscount(subTotal * 0.2);
        setIsCorrectCode(true);
        break;
      default:
        setIsCorrectCode(false);
        setDiscount(0);
    }
  };

  const total = Math.max(0, subTotal - discount);
  setTotalPrice?.(total);

  const formatPrice = (price) =>
    (price || 0).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  const getImageUrl = (item) =>
    item.photoService?.url || item.photoService || PLACEHOLDER_IMG;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-empty">
            <div className="cart-empty-icon">
              <ShoppingCart size={64} strokeWidth={1.5} />
            </div>
            <h2>{t("cart.empty")}</h2>
            <p>{t("cart.emptyDesc")}</p>
            <Link to="/shop" className="cart-empty-btn">
              <ArrowLeft size={18} />
              {t("cart.continueShopping")}
            </Link>
          </div>
        </div>
        <style>{cartStyles}</style>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">{t("cart.title")}</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <article key={item._id} className="cart-item">
                <div className="cart-item-image">
                  <Link to={`/shop/${item._id}`}>
                    <img
                      src={getImageUrl(item)}
                      alt={item.nameService}
                      loading="lazy"
                    />
                  </Link>
                </div>
                <div className="cart-item-body">
                  <Link to={`/shop/${item._id}`} className="cart-item-name">
                    {item.nameService}
                  </Link>
                  <span className="cart-item-unit">
                    / {item.Unit || item.unit || t("cart.perUnit")}
                  </span>
                  <div className="cart-item-price">
                    {formatPrice(getItemPrice(item))}
                    {item.priceDiscount && (
                      <span className="cart-item-price-old">
                        {formatPrice(item.priceService)}
                      </span>
                    )}
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-item-qty">
                      <button
                        type="button"
                        onClick={() => decrementQty(item._id)}
                        aria-label={t("detailService.decrease")}
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity || 1}
                        onChange={(e) =>
                          updateQuantity(item._id, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => incrementQty(item._id)}
                        aria-label={t("detailService.increase")}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="cart-item-remove"
                      onClick={() => removeItem(item._id)}
                      aria-label={t("cart.remove")}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">
                  {formatPrice(getItemPrice(item) * (item.quantity || 1))}
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <div className="cart-summary-card">
              <h3>{t("cart.subTotal")}</h3>
              <form onSubmit={handleApplyCoupon} className="cart-coupon">
                <div className="cart-coupon-input-wrap">
                  <Tag size={18} className="cart-coupon-icon" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={t("cart.couponPlaceholder")}
                    className="cart-coupon-input"
                  />
                </div>
                <button type="submit" className="cart-coupon-btn">
                  {t("cart.applyCoupon")}
                </button>
              </form>
              {isCorrectCode && (
                <p className="cart-coupon-success">
                  {t("cart.couponSuccess")} {formatPrice(discount)}
                </p>
              )}
              {discount > 0 && (
                <div className="cart-summary-row">
                  <span>{t("cart.discount")}</span>
                  <span className="cart-summary-discount">
                    -{formatPrice(discount)}
                  </span>
                </div>
              )}
              <div className="cart-summary-row cart-summary-total">
                <span>{t("cart.total")}</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Link to="/checkout" className="cart-checkout-btn">
                {t("cart.checkout")}
              </Link>
            </div>
            <Link to="/shop" className="cart-back-link">
              <ArrowLeft size={18} />
              {t("cart.continueShopping")}
            </Link>
          </aside>
        </div>
      </div>
      <style>{cartStyles}</style>
    </div>
  );
}

const cartStyles = `
  .cart-page {
    padding: 24px 0 60px;
    background: #f8fafc;
    min-height: 60vh;
  }
  .cart-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 20px;
  }
  .cart-title {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 28px;
  }
  .cart-empty {
    text-align: center;
    padding: 80px 40px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .cart-empty-icon {
    color: #94a3b8;
    margin-bottom: 24px;
  }
  .cart-empty h2 {
    font-size: 22px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 12px;
  }
  .cart-empty p {
    font-size: 16px;
    color: #64748b;
    margin: 0 0 28px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  .cart-empty-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    background: #1370b5;
    color: #fff;
    border-radius: 10px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.2s;
  }
  .cart-empty-btn:hover {
    background: #0d5a94;
    color: #fff;
  }
  .cart-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 32px;
    align-items: start;
  }
  .cart-items {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .cart-item {
    display: grid;
    grid-template-columns: 120px 1fr auto;
    gap: 24px;
    align-items: center;
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .cart-item-image {
    width: 120px;
    height: 90px;
    border-radius: 10px;
    overflow: hidden;
    background: #f1f5f9;
  }
  .cart-item-image a {
    display: block;
    width: 100%;
    height: 100%;
  }
  .cart-item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .cart-item-body {
    min-width: 0;
  }
  .cart-item-name {
    display: block;
    font-size: 17px;
    font-weight: 600;
    color: #1e293b;
    text-decoration: none;
    margin-bottom: 4px;
    transition: color 0.2s;
  }
  .cart-item-name:hover {
    color: #1370b5;
  }
  .cart-item-unit {
    font-size: 13px;
    color: #94a3b8;
    display: block;
    margin-bottom: 8px;
  }
  .cart-item-price {
    font-size: 18px;
    font-weight: 700;
    color: #1370b5;
    margin-bottom: 12px;
  }
  .cart-item-price-old {
    font-size: 14px;
    color: #94a3b8;
    text-decoration: line-through;
    margin-left: 8px;
  }
  .cart-item-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .cart-item-qty {
    display: flex;
    align-items: center;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
  }
  .cart-item-qty button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border: none;
    cursor: pointer;
    color: #64748b;
    transition: background 0.2s, color 0.2s;
  }
  .cart-item-qty button:hover {
    background: #f1f5f9;
    color: #1370b5;
  }
  .cart-item-qty input {
    width: 48px;
    text-align: center;
    border: none;
    font-weight: 600;
    font-size: 15px;
    -moz-appearance: textfield;
  }
  .cart-item-qty input::-webkit-outer-spin-button,
  .cart-item-qty input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .cart-item-remove {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: color 0.2s, background 0.2s;
  }
  .cart-item-remove:hover {
    color: #dc2626;
    background: #fef2f2;
  }
  .cart-item-total {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    text-align: right;
    min-width: 120px;
  }
  .cart-summary {
    position: sticky;
    top: 24px;
  }
  .cart-summary-card {
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    margin-bottom: 16px;
  }
  .cart-summary-card h3 {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 20px;
  }
  .cart-coupon {
    margin-bottom: 16px;
  }
  .cart-coupon-input-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    margin-bottom: 10px;
  }
  .cart-coupon-icon {
    color: #94a3b8;
    flex-shrink: 0;
  }
  .cart-coupon-input {
    flex: 1;
    border: none;
    font-size: 15px;
    outline: none;
  }
  .cart-coupon-input::placeholder {
    color: #94a3b8;
  }
  .cart-coupon-btn {
    width: 100%;
    padding: 12px;
    background: #f1f5f9;
    color: #475569;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .cart-coupon-btn:hover {
    background: #e2e8f0;
    color: #1e293b;
  }
  .cart-coupon-success {
    font-size: 14px;
    color: #16a34a;
    margin: 0 0 12px;
    font-weight: 500;
  }
  .cart-summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    font-size: 15px;
    color: #475569;
  }
  .cart-summary-discount {
    color: #16a34a;
    font-weight: 600;
  }
  .cart-summary-total {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    border-top: 1px solid #e2e8f0;
    margin-top: 8px;
    padding-top: 16px;
  }
  .cart-checkout-btn {
    display: block;
    text-align: center;
    padding: 16px 24px;
    background: #1370b5;
    color: #fff;
    border-radius: 10px;
    font-weight: 600;
    font-size: 16px;
    text-decoration: none;
    margin-top: 20px;
    transition: background 0.2s;
  }
  .cart-checkout-btn:hover {
    background: #0d5a94;
    color: #fff;
  }
  .cart-back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }
  .cart-back-link:hover {
    color: #1370b5;
  }
  @media (max-width: 900px) {
    .cart-layout {
      grid-template-columns: 1fr;
    }
    .cart-summary {
      position: static;
    }
    .cart-item {
      grid-template-columns: 100px 1fr;
      grid-template-rows: auto auto;
    }
    .cart-item-image {
      width: 100px;
      height: 75px;
    }
    .cart-item-total {
      grid-column: 2;
      text-align: left;
      min-width: auto;
    }
  }
  @media (max-width: 600px) {
    .cart-item {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .cart-item-image {
      width: 100%;
      height: 160px;
    }
    .cart-item-total {
      grid-column: 1;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
    }
  }
`;

export default Cart;
