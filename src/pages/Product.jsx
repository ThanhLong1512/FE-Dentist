function Product() {
  return (
    <div className="sidebar-page-container">
      <div className="auto-container">
        <div className="row clearfix">
          <div className="content-side col-lg-8 col-md-12 col-sm-12">
            <div className="shop-single">
              <div className="product-details">
                <div className="basic-details">
                  <div className="row clearfix">
                    <div className="image-column col-md-6 col-sm-12">
                      <figure className="image-box">
                        <a
                          href="images/resource/products/product-sinlge.jpg"
                          className="lightbox-image"
                          title="Image Caption Here"
                        >
                          <img
                            src="images/resource/products/product-sinlge.jpg"
                            alt=""
                          />
                        </a>
                      </figure>
                    </div>
                    <div className="info-column col-md-6 col-sm-12">
                      <div className="details-header">
                        <h4>Hand Sanitizer</h4>
                        <div className="rating">
                          <span className="fa fa-star"></span>
                          <span className="fa fa-star"></span>
                          <span className="fa fa-star"></span>
                          <span className="fa fa-star"></span>
                          <span className="fa fa-star"></span>
                        </div>
                        <a className="reviews" href="#">
                          ( 3 Customer Reviews )
                        </a>
                        <div className="item-price">
                          $25.00 <del>$30</del>
                        </div>
                      </div>

                      <div className="text">
                        There are many variations of passages of Lorem Ipsum
                        available, but the majority have suffered alteration in
                        some form, by injected humour, or randomised words which
                        don't look even slightly believable. If you are going.
                      </div>
                      <div className="other-options clearfix">
                        <div className="item-quantity">
                          <input
                            className="quantity-spinner"
                            type="text"
                            value="2"
                            name="quantity"
                          />
                        </div>
                        <button
                          type="button"
                          className="theme-btn btn-style-one add-to-cart"
                        >
                          <span className="btn-title">Add To Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="product-info-tabs">
                  <div className="prod-tabs tabs-box">
                    <ul className="tab-btns tab-buttons clearfix">
                      <li data-tab="#prod-details" className="tab-btn">
                        Descripton
                      </li>
                      <li
                        data-tab="#prod-reviews"
                        className="tab-btn active-btn"
                      >
                        Review (3)
                      </li>
                    </ul>

                    <div className="tabs-content">
                      <div className="tab" id="prod-details">
                        <div className="content">
                          <h3>Product Descripton</h3>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore
                            eu fugiat nulla pariatur.
                          </p>
                          <p>
                            Excepteur sint occaecat cupidatat non proident, sunt
                            in culpa qui officia deserunt mollit anim id est
                            laborum consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. sunt in culpa qui officia deserunt mollit
                          </p>
                        </div>
                      </div>

                      <div className="tab active-tab" id="prod-reviews">
                        <h2 className="title">3 Reviews For Patient Ninja</h2>

                        <div className="comments-area style-two">
                          <div className="comment-box">
                            <div className="comment">
                              <div className="author-thumb">
                                <img
                                  src="images/resource/avatar-1.jpg"
                                  alt=""
                                />
                              </div>
                              <div className="comment-inner">
                                <div className="comment-info">
                                  <div className="name">Steven Rich</div>
                                  <div className="date">May 29, 2020</div>
                                </div>
                                <div className="rating">
                                  <span className="fa fa-star"></span>
                                  <span className="fa fa-star"></span>
                                  <span className="fa fa-star"></span>
                                  <span className="fa fa-star"></span>
                                  <span className="fa fa-star light"></span>
                                </div>
                                <div className="text">
                                  Lorem Ipsum is simply dummy text of the
                                  printing and typesetting industry. Lorem Ipsum
                                  has been the industry.
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="comment-box reply-comment">
                            <div className="comment">
                              <div className="author-thumb">
                                <img
                                  src="images/resource/avatar-2.jpg"
                                  alt=""
                                />
                              </div>
                              <div className="comment-inner">
                                <div className="comment-info">
                                  <div className="name">Cobus Besten</div>
                                  <div className="date">June 01, 2020</div>
                                </div>
                                <div className="rating">
                                  <span className="fa fa-star"></span>
                                  <span className="fa fa-star"></span>
                                  <span className="fa fa-star"></span>
                                  <span className="fa fa-star"></span>
                                  <span className="fa fa-star"></span>
                                </div>
                                <div className="text">
                                  Lorem Ipsum is simply dummy text of the
                                  printing{" "}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="comment-box">
                            <div className="comment">
                              <div className="author-thumb">
                                <img
                                  src="images/resource/avatar-3.jpg"
                                  alt=""
                                />
                              </div>
                              <div className="comment-inner">
                                <div className="comment-info">
                                  <div className="name">Magnus Hichki</div>
                                  <div className="date">June 02, 2020</div>
                                </div>
                                <div className="rating">
                                  <span className="fa fa-star"></span>
                                  <span className="fa fa-star"></span>
                                  <span className="fa fa-star"></span>
                                  <span className="fa fa-star"></span>
                                  <span className="fa fa-star"></span>
                                </div>
                                <div className="text">
                                  Contrary to popular belief, Lorem Ipsum is not
                                  simply random text. It has roots in a piece of
                                  classNameical Latin literature from 45 BC,
                                  making it over 2000 years old. Richard
                                  McClintock,{" "}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="shop-comment-form">
                          <h2>Add a Review</h2>
                          <div className="mail-text">
                            <span className="theme_color">
                              Your email address will not be published.
                            </span>{" "}
                            Required fields are marked*
                          </div>
                          <div className="rating-box">
                            <div className="text"> Your Rating:</div>
                            <div className="rating">
                              <a href="#">
                                <span className="fa fa-star"></span>
                              </a>
                            </div>
                            <div className="rating">
                              <a href="#">
                                <span className="fa fa-star"></span>
                                <span className="fa fa-star"></span>
                              </a>
                              <a href="#"></a>
                            </div>
                            <div className="rating">
                              <a href="#">
                                <span className="fa fa-star"></span>
                                <span className="fa fa-star"></span>
                                <span className="fa fa-star"></span>
                              </a>
                            </div>
                            <div className="rating">
                              <a href="#">
                                <span className="fa fa-star"></span>
                                <span className="fa fa-star"></span>
                                <span className="fa fa-star"></span>
                                <span className="fa fa-star"></span>
                              </a>
                            </div>
                            <div className="rating">
                              <a href="#">
                                <span className="fa fa-star"></span>
                                <span className="fa fa-star"></span>
                                <span className="fa fa-star"></span>
                                <span className="fa fa-star"></span>
                                <span className="fa fa-star"></span>
                              </a>
                            </div>
                          </div>
                          <form
                            method="post"
                            action="https://skyethemes.com/html/2022/medicoz/contact.html"
                          >
                            <div className="form-group">
                              <textarea
                                name="message"
                                placeholder="Your Review*"
                              ></textarea>
                            </div>
                            <div className="form-group">
                              <input
                                type="text"
                                name="username"
                                placeholder="Name"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <input
                                type="text"
                                name="number"
                                placeholder="Email"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <button
                                className="theme-btn btn-style-one"
                                type="submit"
                                name="submit-form"
                              >
                                <span className="btn-title">SUBMIT</span>
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-side col-lg-4 col-md-12 col-sm-12">
            <aside className="sidebar">
              <div className="sidebar-widget search-box">
                <form
                  method="post"
                  action="https://skyethemes.com/html/2022/medicoz/blog.html"
                >
                  <div className="form-group">
                    <input
                      type="search"
                      name="search-field"
                      value=""
                      placeholder="Search....."
                      required=""
                    />
                    <button type="submit">
                      <span className="icon fa fa-search"></span>
                    </button>
                  </div>
                </form>
              </div>

              <div className="sidebar-widget category-list">
                <div className="sidebar-title">
                  <h3>Categories</h3>
                </div>
                <ul className="cat-list">
                  <li>
                    <a href="#">
                      Procedures <span>(06)</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      Transplantation <span>(02)</span>
                    </a>
                  </li>
                  <li className="active">
                    <a href="#">
                      Management <span>(05)</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      Healthcare Tips <span>(25)</span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      Uncategorized <span>(04)</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="sidebar-widget latest-news">
                <div className="sidebar-title">
                  <h3>Popular Products</h3>
                </div>
                <div className="widget-content">
                  <article className="post">
                    <div className="post-thumb">
                      <a href="shop-single.html">
                        <img
                          src="images/resource/products/product-thumb-1.jpg"
                          alt=""
                        />
                      </a>
                    </div>
                    <h5>
                      <a href="shop-single.html">First Aid Kit</a>
                    </h5>
                    <div className="price">$9.00</div>
                    <div className="rating">
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                    </div>
                  </article>

                  <article className="post">
                    <div className="post-thumb">
                      <a href="shop-single.html">
                        <img
                          src="images/resource/products/product-thumb-2.jpg"
                          alt=""
                        />
                      </a>
                    </div>
                    <h5>
                      <a href="shop-single.html">Vitamin C+</a>
                    </h5>
                    <div className="price">$20.00</div>
                    <div className="rating">
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                    </div>
                  </article>

                  <article className="post">
                    <div className="post-thumb">
                      <a href="shop-single.html">
                        <img
                          src="images/resource/products/product-thumb-3.jpg"
                          alt=""
                        />
                      </a>
                    </div>
                    <h5>
                      <a href="shop-single.html">Zinc Tablet</a>
                    </h5>
                    <div className="price">$ 18.00</div>
                    <div className="rating">
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                      <span className="fa fa-star"></span>
                    </div>
                  </article>
                </div>
              </div>

              <div className="sidebar-widget newslatters">
                <div className="sidebar-title">
                  <h3>
                    <span className="icon flaticon-rss-symbol"></span>Newsletter
                  </h3>
                </div>
                <div className="text">
                  Enter your email address below to subscribe to our newsletter
                </div>
                <form
                  method="post"
                  action="https://skyethemes.com/html/2022/medicoz/blog-sidebar.html"
                >
                  <div className="form-group">
                    <input
                      type="text"
                      name="input"
                      value=""
                      placeholder="Your email address..."
                      required=""
                    />
                    <button type="submit" className="theme-btn">
                      <span className="btn-title">Subscribe</span>
                    </button>
                  </div>
                </form>
              </div>

              <div className="sidebar-widget tags">
                <div className="sidebar-title">
                  <h3>Tag Cloud</h3>
                </div>
                <ul className="popular-tags clearfix">
                  <li>
                    <a href="#">Ideas</a>
                  </li>
                  <li>
                    <a href="#">Doctor</a>
                  </li>
                  <li>
                    <a href="#">Health</a>
                  </li>
                  <li>
                    <a href="#">Department</a>
                  </li>
                  <li>
                    <a href="#">Nurse</a>
                  </li>
                  <li>
                    <a href="#">Growth</a>
                  </li>
                  <li>
                    <a href="#">Expert</a>
                  </li>
                  <li>
                    <a href="#">Tips</a>
                  </li>
                  <li>
                    <a href="#">Service</a>
                  </li>
                  <li>
                    <a href="#">Medical</a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
