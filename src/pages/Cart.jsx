import { Link } from "react-router-dom";
function Cart() {
  return (
    <section className="cart-section">
      <div className="auto-container">
        <div className="cart-outer">
          <div className="table-outer">
            <table className="cart-table">
              <thead className="cart-header">
                <tr>
                  <th>Preview</th>
                  <th className="prod-column">product</th>
                  <th className="price">Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="prod-column">
                    <div className="column-box">
                      <figure className="prod-thumb">
                        <a href="#">
                          <img
                            src="images/resource/products/cart-img.jpg"
                            alt=""
                          />
                        </a>
                      </figure>
                    </div>
                  </td>
                  <td>
                    <h4 className="prod-title">Product Title</h4>
                  </td>
                  <td className="sub-total">$35.00</td>
                  <td className="qty">
                    <div className="item-quantity">
                      <input
                        className="quantity-spinner"
                        type="text"
                        value="2"
                        name="quantity"
                      />
                    </div>
                  </td>
                  <td className="total">$35.00</td>
                  <td>
                    <a href="#" className="remove-btn">
                      <span className="fa fa-times"></span>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="cart-options clearfix">
            <div className="pull-left">
              <div className="apply-coupon clearfix">
                <div className="form-group clearfix">
                  <input
                    type="text"
                    name="coupon-code"
                    value=""
                    placeholder="Coupon Code"
                  />
                </div>
                <div className="form-group clearfix">
                  <button type="button" className="theme-btn coupon-btn">
                    Apply Coupon
                  </button>
                </div>
              </div>
            </div>

            <div className="pull-right">
              <button type="button" className="theme-btn cart-btn">
                update cart
              </button>
            </div>
          </div>
        </div>

        <div className="row justify-content-between">
          <div className="column pull-left col-lg-5 col-md-6 col-sm-12">
            <div className="shipping-block">
              <div className="inner-box">
                <h3>Free Shipping</h3>
                <h4>Calculate Shipping</h4>

                <div className="shipping-form">
                  <form
                    method="post"
                    action="https://skyethemes.com/html/2022/medicoz/contact.html"
                  >
                    <div className="row clearfix">
                      <div className="form-group col-md-6 col-sm-12">
                        <input
                          type="text"
                          name="text"
                          placeholder="Pakistan"
                          required
                        />
                      </div>
                      <div className="form-group col-md-6 col-sm-12">
                        <input
                          type="text"
                          name="text"
                          placeholder="Postcode / ZIP"
                          required
                        />
                      </div>
                      <div className="form-group col-md-12 col-sm-12">
                        <input
                          type="text"
                          name="text"
                          placeholder="State / County"
                          required
                        />
                      </div>
                      <div className="form-group col-md-12 col-sm-12">
                        <button
                          className="theme-btn totals-btn"
                          type="submit"
                          name="submit-form"
                        >
                          Update Totals
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="column pull-right col-lg-6 col-md-6 col-sm-12">
            <ul className="totals-table">
              <li>
                <h3>Cart Totals</h3>
              </li>
              <li className="clearfix total">
                <span className="col">Sub Total</span>
                <span className="col price">$35.00</span>
              </li>
              <li className="clearfix total">
                <span className="col">Total</span>
                <span className="col price">$35.00</span>
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
