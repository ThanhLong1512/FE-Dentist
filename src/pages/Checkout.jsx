function Checkout() {
  return (
    <section className="checkout-page">
      <div className="auto-container">
        <div className="checkout-form">
          <form
            method="post"
            action="https://skyethemes.com/html/2022/medicoz/checkout.html"
          >
            <div className="row clearfix">
              <div className="column col-lg-6 col-md-12 col-sm-12">
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

                    <div className="form-group col-md-12 col-sm-12">
                      <div className="field-label">Company Name</div>
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
                      <div className="field-label">Country</div>
                      <select>
                        <option>Pakistan</option>
                        <option>India</option>
                        <option>Australia</option>
                        <option>Usa</option>
                      </select>
                    </div>

                    <div className="form-group col-md-12 col-sm-12">
                      <div className="field-label">Address</div>
                      <input
                        type="text"
                        name="field-name"
                        value=""
                        placeholder="Street address"
                      />
                    </div>

                    <div className="form-group col-md-12 col-sm-12">
                      <input
                        type="text"
                        name="field-name"
                        value=""
                        placeholder="Apartment,suite,unit etc. (optional)"
                      />
                    </div>

                    <div className="form-group col-md-12 col-sm-12">
                      <div className="field-label">Town/City</div>

                      <input
                        type="text"
                        name="field-name"
                        value=""
                        placeholder=""
                      />
                    </div>

                    <div className="form-group col-md-6 col-sm-12">
                      <div className="field-label">State / County</div>
                      <input
                        type="text"
                        name="field-name"
                        value=""
                        placeholder=""
                      />
                    </div>

                    <div className="form-group col-md-6 col-sm-12">
                      <div className="field-label">Postcode/ ZIP</div>
                      <input
                        type="text"
                        name="field-name"
                        value=""
                        placeholder=""
                      />
                    </div>

                    <div className="form-group col-lg-12 col-md-12 col-sm-12">
                      <input
                        type="checkbox"
                        name="shipping-option"
                        id="account-option"
                      />{" "}
                      &ensp;{" "}
                      <label for="account-option">Create An Account?</label>
                      <div className="text">
                        Create an account by entering the information below. if
                        you are a returning custoer please login at the top of
                        the page.
                      </div>
                    </div>

                    <div className="form-group col-md-12 col-sm-12">
                      <div className="field-label">
                        <span>Account Password</span>
                      </div>
                      <input
                        type="password"
                        name="field-name"
                        value=""
                        placeholder="Password"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="column col-lg-6 col-md-12 col-sm-12">
                <div className="inner-column">
                  <div className="sec-title">
                    <h3>Ship to a different address?</h3>
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

                    <div className="form-group col-md-12 col-sm-12 ">
                      <div className="field-label">Company Name</div>
                      <input
                        type="text"
                        name="field-name"
                        value=""
                        placeholder=""
                      />
                    </div>

                    <div className="form-group col-md-12 col-sm-12 ">
                      <div className="field-label">Country</div>
                      <select>
                        <option>Pakistan</option>
                        <option>India</option>
                        <option>Australia</option>
                        <option>Usa</option>
                      </select>
                    </div>

                    <div className="form-group col-md-12 col-sm-12 ">
                      <div className="field-label">Address</div>
                      <input
                        type="text"
                        name="field-name"
                        value=""
                        placeholder="Street address"
                      />
                    </div>

                    <div className="form-group col-md-12 col-sm-12 ">
                      <input
                        type="text"
                        name="field-name"
                        value=""
                        placeholder="Apartment,suite,unit etc. (optional)"
                      />
                    </div>

                    <div className="form-group col-md-12 col-sm-12 ">
                      <div className="field-label">Town/City</div>
                      <input
                        type="text"
                        name="field-name"
                        value=""
                        placeholder=""
                      />
                    </div>

                    <div className="form-group col-md-6 col-sm-12">
                      <div className="field-label">State / County</div>
                      <input
                        type="text"
                        name="field-name"
                        value=""
                        placeholder=""
                      />
                    </div>

                    <div className="form-group col-md-6 col-sm-12">
                      <div className="field-label">Postcode/ ZIP</div>
                      <input
                        type="text"
                        name="field-name"
                        value=""
                        placeholder=""
                      />
                    </div>

                    <div className="form-group col-md-12 col-sm-12 ">
                      <div className="field-label">Other Notes</div>
                      <textarea
                        className=""
                        placeholder="Notes about your order,e.g. special notes for delivery."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

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
              <strong>Product Title</strong>
              <span>$35.00</span>
            </li>
            <li className="clearfix">
              SUBTOTAL<span>$35.00</span>
            </li>
            <li className="clearfix">
              SHIPPING<span className="free">Free Shipping</span>
            </li>
            <li className="clearfix">
              TOTAL<span>$35.00</span>
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
                      id="payment-2"
                      checked
                    />
                    <label for="payment-2">
                      <strong>Direct Bank Transfer</strong>
                      <span className="small-text">
                        Make your payment directly into our bank account. Please
                        use your Order ID as the payment reference. Your order
                        won’t be shipped until the funds have cleared in our
                        account.
                      </span>
                    </label>
                  </div>
                </li>
                <li>
                  <div className="radio-option">
                    <input type="radio" name="payment-group" id="payment-1" />
                    <label for="payment-1">
                      <strong>Check Payments</strong>
                      <span className="small-text">
                        Make your payment directly into our bank account. Please
                        use your Order ID as the payment reference. Your order
                        won’t be shipped until the funds have cleared in our
                        account.
                      </span>
                    </label>
                  </div>
                </li>

                <li>
                  <div className="radio-option">
                    <input type="radio" name="payment-group" id="payment-3" />
                    <label for="payment-3">
                      <strong>Cash on Delivery</strong>
                      <span className="small-text">
                        Make your payment directly into our bank account. Please
                        use your Order ID as the payment reference. Your order
                        won’t be shipped until the funds have cleared in our
                        account.
                      </span>
                    </label>
                  </div>
                </li>
                <li>
                  <div className="radio-option">
                    <input type="radio" name="payment-group" id="payment-4" />
                    <label for="payment-4">
                      <strong>PayPal</strong>
                      <span className="image">
                        <img src="images/icons/paypal.png" alt="" />
                      </span>
                    </label>
                    <a href="#" className="what-paypall">
                      What is PayPal?
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="lower-box">
            <a href="#" className="theme-btn btn-style-one">
              <span className="btn-title">Place Order</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
