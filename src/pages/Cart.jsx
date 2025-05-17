import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { RecoveryContext } from "../App";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isCorrectCode, setIsCorrectCode] = useState(false);
  const [discount, setDiscount] = useState(0);
  const { setTotalPrice } = useContext(RecoveryContext);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item._id === itemId
        ? { ...item, quantity: Math.max(1, newQuantity) }
        : item
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const totalQuantity = updatedCart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  };

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item._id !== itemId);

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const totalQuantity = updatedCart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  };

  const subTotal = cartItems.reduce(
    (total, item) => total + item.priceService * item.quantity,
    0
  );
  function handleSubmitCode(e) {
    e.preventDefault();
    const couponCode = e.target["coupon-code"].value.toUpperCase();
    switch (couponCode) {
      case "DISCOUNT10":
        const discountAmount = subTotal * 0.1;
        setDiscount(discountAmount);
        setIsCorrectCode(true);
        break;
      case "DISCOUNT20":
        const discountAmount20 = subTotal * 0.2;
        setDiscount(discountAmount20);
        setIsCorrectCode(true);
        break;
      default:
        setIsCorrectCode(false);
    }
  }
  const total = subTotal - discount;
  setTotalPrice(total);
  return (
    <section className="cart-section">
      <div className="auto-container">
        <div className="cart-outer">
          <div className="table-outer">
            <table className="cart-table">
              <thead className="cart-header">
                <tr>
                  <th>Preview</th>
                  <th className="prod-column">Product</th>
                  <th className="price">Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id}>
                    <td className="prod-column">
                      <div className="column-box">
                        <figure className="prod-thumb">
                          <img
                            src={item.photoService.url}
                            alt={item.nameService}
                          />
                        </figure>
                      </div>
                    </td>
                    <td>
                      <h4 className="prod-title">{item.nameService}</h4>
                      <p>{item.Unit}</p>
                    </td>
                    <td className="sub-total">
                      {item.priceService.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="qty">
                      <div className="item-quantity">
                        <input
                          className="quantity-spinner"
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item._id, parseInt(e.target.value))
                          }
                        />
                      </div>
                    </td>
                    <td className="total">
                      {(item.priceService * item.quantity).toLocaleString(
                        "vi-VN",
                        {
                          style: "currency",
                          currency: "VND",
                        }
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="remove-btn"
                      >
                        <span className="fa fa-times"></span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-options clearfix">
            <div className="pull-left">
              <div className="apply-coupon clearfix">
                <form
                  className="form-group clearfix"
                  onSubmit={handleSubmitCode}
                  style={{ display: "flex", gap: "10px" }}
                >
                  <input
                    type="text"
                    name="coupon-code"
                    placeholder="Coupon Code"
                  />

                  <button type="submit" className="theme-btn coupon-btn">
                    Apply Coupon
                  </button>
                </form>
              </div>
              {isCorrectCode && (
                <div className="alert alert-success mt-2" role="alert">
                  Mã giảm giá đã được áp dụng! Giảm{" "}
                  {discount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row justify-content-between">
          <div className="column pull-right col-lg-6 col-md-6 col-sm-12">
            <ul className="totals-table">
              <li>
                <h3>Cart Totals</h3>
              </li>
              <li className="clearfix total">
                <span className="col">Sub Total</span>
                <span className="col price">
                  {subTotal.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </li>
              <li className="clearfix total">
                <span className="col">Total</span>
                <span className="col price">
                  {total.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </li>
              <li className="text-right">
                <Link
                  to="/checkout"
                  className="theme-btn proceed-btn text-decoration-none"
                >
                  Proceed to Checkout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
