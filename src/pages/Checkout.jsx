import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { RecoveryContext } from "../App";
import {
  handlePayWithCOD,
  handlePayWithMoMo,
  handlePayWithVNPay,
  handlePayWithZaloPay,
} from "../apis";

function Checkout() {
  const [provinces, setProvinces] = useState([]);
  const { totalPrice } = useContext(RecoveryContext);
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [services, setServices] = useState(() => {
    const cartData = localStorage.getItem("cart");
    return cartData ? JSON.parse(cartData) : [];
  });
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("https://provinces.open-api.vn/api/");
        setProvinces(response.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);
  const handlePaymentChange = (e) => {
    setSelectedPayment(e.target.value);
  };

  const handleOrder = async () => {
    try {
      const serviceID = services.map((service) => service._id);
      switch (selectedPayment) {
        case "momo":
          await handlePayWithMoMo({
            totalPrice,
            service: serviceID,
          }).then((res) => {
            localStorage.removeItem("cart");
            window.location.href = res.data.payUrl;
          });
          break;
        case "zalopay":
          await handlePayWithZaloPay({
            totalPrice,
            service: serviceID,
          }).then((res) => {
            localStorage.removeItem("cart");
            window.location.href = res.data.payUrl;
          });
          break;
        case "vnpay":
          await handlePayWithVNPay({
            totalPrice,
            service: serviceID,
          }).then((res) => {
            localStorage.removeItem("cart");
            window.location.href = res.data.paymentUrl;
          });
          break;
        case "cod":
          await handlePayWithCOD({
            totalPrice,
            service: serviceID,
          }).then((res) => {
            localStorage.removeItem("cart");
            location.href = "/home";
          });
          break;
        default:
          console.log("Invalid payment method");
      }
    } catch (error) {
      console.error("Error processing order:", error);
      alert("Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại!");
    }
  };

  return (
    <section className="checkout-page">
      <div className="auto-container" style={{ display: "flex", gap: "20px" }}>
        <div className="checkout-form" style={{ flex: "50%" }}>
          <div className="row clearfix">
            <div
              className="column col-lg-6 col-md-12 col-sm-12"
              style={{ width: "100%" }}
            >
              <div className="inner-column">
                <div className="sec-title">
                  <h3>Billing Details</h3>
                </div>

                <div className="row clearfix">
                  <div className="form-group col-md-6 col-sm-12">
                    <div className="field-label">
                      First Name <sup>*</sup>
                    </div>
                    <input
                      type="text"
                      name="field-name"
                      value=""
                      placeholder=""
                    />
                  </div>

                  <div className="form-group col-md-6 col-sm-12">
                    <div className="field-label">Last Name </div>
                    <input
                      type="text"
                      name="field-name"
                      value=""
                      placeholder=""
                    />
                  </div>

                  <div className="form-group col-md-6 col-sm-12">
                    <div className="field-label">Email Address</div>
                    <input
                      type="text"
                      name="field-name"
                      value=""
                      placeholder=""
                    />
                  </div>

                  <div className="form-group col-md-6 col-sm-12">
                    <div className="field-label">Phone</div>
                    <input
                      type="text"
                      name="field-name"
                      value=""
                      placeholder=""
                    />
                  </div>

                  <div className="form-group col-md-12 col-sm-12">
                    <div className="field-label">Provinces</div>
                    <select>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group col-md-12 col-sm-12">
                    <div className="field-label">Address</div>
                    <input type="text" name="field-name" value="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="block"
          style={{ display: "flex", flexDirection: "column", flex: "40%" }}
        >
          <div className="order-box">
            <div className="sec-title">
              <h3>Your Order</h3>
            </div>
            <div className="title-box clearfix">
              <div className="col">PRODUCT</div>
              <div className="col">TOTAL</div>
            </div>
            <ul>
              <li className="clearfix">
                <strong>Product Price</strong>
                <span>
                  {" "}
                  {totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </li>
              <li className="clearfix">
                SHIPPING<span className="free">Free Shipping</span>
              </li>
              <li className="clearfix">
                TOTAL
                <span>
                  {" "}
                  {totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </li>
            </ul>
          </div>

          <div className="payment-box">
            <div className="upper-box">
              <div className="payment-options">
                <ul>
                  <li>
                    <div className="radio-option">
                      <input
                        type="radio"
                        name="payment-group"
                        id="momo-payment"
                        value="momo"
                        checked={selectedPayment === "momo"}
                        onChange={handlePaymentChange}
                      />
                      <label htmlFor="momo-payment">
                        <strong> MoMo Wallet</strong>
                        <span className="image">
                          <img
                            src="images/payments/momo.png"
                            alt="MoMo"
                            style={{ height: "24px", marginLeft: "10px" }}
                          />
                        </span>
                        <span className="small-text">
                          Pay via MoMo application with QR Code or phone number
                          phone.
                        </span>
                      </label>
                    </div>
                  </li>

                  <li>
                    <div className="radio-option">
                      <input
                        type="radio"
                        name="payment-group"
                        id="zalopay-payment"
                        value="zalopay"
                        checked={selectedPayment === "zalopay"}
                        onChange={handlePaymentChange}
                      />
                      <label htmlFor="zalopay-payment">
                        <strong>ZaloPay Wallet</strong>
                        <span className="image">
                          <img
                            src="images/payments/zalopay.png"
                            alt="ZaloPay"
                            style={{ height: "24px", marginLeft: "10px" }}
                          />
                        </span>
                        <span className="small-text">
                          Pay quickly via ZaloPay application.
                        </span>
                      </label>
                    </div>
                  </li>

                  <li>
                    <div className="radio-option">
                      <input
                        type="radio"
                        name="payment-group"
                        id="vnpay-payment"
                        value="vnpay"
                        checked={selectedPayment === "vnpay"}
                        onChange={handlePaymentChange}
                      />
                      <label htmlFor="vnpay-payment">
                        <strong>VNPay</strong>
                        <span className="image">
                          <img
                            src="images/payments/vnpay.png"
                            alt="VNPay"
                            style={{ height: "24px", marginLeft: "10px" }}
                          />
                        </span>
                        <span className="small-text">
                          Payment via domestic bank card or Internet Banking
                        </span>
                      </label>
                    </div>
                  </li>

                  <li>
                    <div className="radio-option">
                      <input
                        type="radio"
                        name="payment-group"
                        id="cod-payment"
                        value="cod"
                        checked={selectedPayment === "cod"}
                        onChange={handlePaymentChange}
                        defaultChecked
                      />
                      <label htmlFor="cod-payment">
                        <strong>Payment upon receipt (COD)</strong>
                        <span className="small-text">
                          You only have to pay when you receive the goods
                          delivery officer.
                        </span>
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="lower-box">
              <button className="theme-btn btn-style-one" onClick={handleOrder}>
                <span className="btn-title">Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
