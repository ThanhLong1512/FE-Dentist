function Shop() {
  return (
    <div className="sidebar-page-container">
      <div className="auto-container">
        <div className="row clearfix">
          <div className="content-side col-lg-8 col-md-12 col-sm-12">
            <div className="our-shop">
              <div className="shop-upper-box">
                <div className="orderby">
                  <select name="orderby">
                    <option defaultValue="default">Default Sorting</option>
                    <option defaultValue="popularity">
                      Sort by popularity
                    </option>
                    <option defaultValue="rating">
                      Sort by average rating
                    </option>
                    <option defaultValue="date">Sort by newness</option>
                    <option defaultValue="price">
                      Sort by price: low to high
                    </option>
                    <option defaultValue="price-desc">
                      Sort by price: high to low
                    </option>
                  </select>
                </div>
                <div className="items-label">Showing all 9 results</div>
              </div>

              <div className="row">
                <div className="shop-item col-lg-4 col-md-6 col-sm-12">
                  <div className="inner-box">
                    <div className="image-box">
                      <figure className="image">
                        <a href="shop-single.html">
                          <img src="images/resource/products/1.jpg" alt="" />
                        </a>
                      </figure>
                      <span className="onsale">Sale</span>
                    </div>
                    <div className="lower-content">
                      <div className="rating">
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star light"></span>
                      </div>
                      <h4 className="name">
                        <a href="shop-single.html">Hand Sanitizer</a>
                      </h4>
                      <div className="price">
                        {" "}
                        $12.00 <del>$14.00</del>
                      </div>
                      <a
                        href="shopping-cart.html"
                        className="theme-btn add-to-cart"
                      >
                        Add to cart
                      </a>
                    </div>
                  </div>
                </div>

                <div className="shop-item col-lg-4 col-md-6 col-sm-12">
                  <div className="inner-box">
                    <div className="image-box">
                      <figure className="image">
                        <a href="shop-single.html">
                          <img src="images/resource/products/2.jpg" alt="" />
                        </a>
                      </figure>
                      <span className="onsale">-17%</span>
                    </div>
                    <div className="lower-content">
                      <div className="rating">
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star light"></span>
                      </div>
                      <h4 className="name">
                        <a href="shop-single.html">Liquid Sanitizer</a>
                      </h4>
                      <div className="price">
                        {" "}
                        $14.00 <del>$17.00</del>
                      </div>
                      <a
                        href="shopping-cart.html"
                        className="theme-btn add-to-cart"
                      >
                        Add to cart
                      </a>
                    </div>
                  </div>
                </div>

                <div className="shop-item col-lg-4 col-md-6 col-sm-12">
                  <div className="inner-box">
                    <div className="image-box">
                      <figure className="image">
                        <a href="shop-single.html">
                          <img src="images/resource/products/3.jpg" alt="" />
                        </a>
                      </figure>
                      <span className="onsale">-17%</span>
                    </div>
                    <div className="lower-content">
                      <div className="rating">
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star light"></span>
                      </div>
                      <h4 className="name">
                        <a href="shop-single.html">Sanitizer Gel</a>
                      </h4>
                      <div className="price">
                        $25.00 <del>$15.00</del>
                      </div>
                      <a
                        href="shopping-cart.html"
                        className="theme-btn add-to-cart"
                      >
                        Add to cart
                      </a>
                    </div>
                  </div>
                </div>

                <div className="shop-item col-lg-4 col-md-6 col-sm-12">
                  <div className="inner-box">
                    <div className="image-box">
                      <figure className="image">
                        <a href="shop-single.html">
                          <img src="images/resource/products/4.jpg" alt="" />
                        </a>
                      </figure>
                    </div>
                    <div className="lower-content">
                      <div className="rating">
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star light"></span>
                      </div>
                      <h4 className="name">
                        <a href="shop-single.html">Vitamin D3</a>
                      </h4>
                      <div className="price"> $16.88</div>
                      <a
                        href="shopping-cart.html"
                        className="theme-btn add-to-cart"
                      >
                        Add to cart
                      </a>
                    </div>
                  </div>
                </div>

                <div className="shop-item col-lg-4 col-md-6 col-sm-12">
                  <div className="inner-box">
                    <div className="image-box">
                      <figure className="image">
                        <a href="shop-single.html">
                          <img src="images/resource/products/5.jpg" alt="" />
                        </a>
                      </figure>
                      <span className="onsale">-17%</span>
                    </div>
                    <div className="lower-content">
                      <div className="rating">
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star light"></span>
                      </div>
                      <h4 className="name">
                        <a href="shop-single.html">Vitamin B2</a>
                      </h4>
                      <div className="price">
                        {" "}
                        $14.00 <del>$17.00</del>
                      </div>
                      <a
                        href="shopping-cart.html"
                        className="theme-btn add-to-cart"
                      >
                        Add to cart
                      </a>
                    </div>
                  </div>
                </div>

                <div className="shop-item col-lg-4 col-md-6 col-sm-12">
                  <div className="inner-box">
                    <div className="image-box">
                      <figure className="image">
                        <a href="shop-single.html">
                          <img src="images/resource/products/6.jpg" alt="" />
                        </a>
                      </figure>
                      <span className="onsale">-17%</span>
                    </div>
                    <div className="lower-content">
                      <div className="rating">
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star light"></span>
                      </div>
                      <h4 className="name">
                        <a href="shop-single.html">Vitamin C+</a>
                      </h4>
                      <div className="price">
                        $25.00 <del>$15.00</del>
                      </div>
                      <a
                        href="shopping-cart.html"
                        className="theme-btn add-to-cart"
                      >
                        Add to cart
                      </a>
                    </div>
                  </div>
                </div>

                <div className="shop-item col-lg-4 col-md-6 col-sm-12">
                  <div className="inner-box">
                    <div className="image-box">
                      <figure className="image">
                        <a href="shop-single.html">
                          <img src="images/resource/products/7.jpg" alt="" />
                        </a>
                      </figure>
                      <span className="onsale">-17%</span>
                    </div>
                    <div className="lower-content">
                      <div className="rating">
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star light"></span>
                      </div>
                      <h4 className="name">
                        <a href="shop-single.html">Dental Instruments</a>
                      </h4>
                      <div className="price"> $16.88</div>
                      <a
                        href="shopping-cart.html"
                        className="theme-btn add-to-cart"
                      >
                        Add to cart
                      </a>
                    </div>
                  </div>
                </div>

                <div className="shop-item col-lg-4 col-md-6 col-sm-12">
                  <div className="inner-box">
                    <div className="image-box">
                      <figure className="image">
                        <a href="shop-single.html">
                          <img src="images/resource/products/8.jpg" alt="" />
                        </a>
                      </figure>
                    </div>
                    <div className="lower-content">
                      <div className="rating">
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star light"></span>
                      </div>
                      <h4 className="name">
                        <a href="shop-single.html">First Aid Kit</a>
                      </h4>
                      <div className="price">
                        {" "}
                        $14.00 <del>$17.00</del>
                      </div>
                      <a
                        href="shopping-cart.html"
                        className="theme-btn add-to-cart"
                      >
                        Add to cart
                      </a>
                    </div>
                  </div>
                </div>

                <div className="shop-item col-lg-4 col-md-6 col-sm-12">
                  <div className="inner-box">
                    <div className="image-box">
                      <figure className="image">
                        <a href="shop-single.html">
                          <img src="images/resource/products/9.jpg" alt="" />
                        </a>
                      </figure>
                    </div>
                    <div className="lower-content">
                      <div className="rating">
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star light"></span>
                      </div>
                      <h4 className="name">
                        <a href="shop-single.html">classNameic Stethoscope</a>
                      </h4>
                      <div className="price">
                        $25.00 <del>$15.00</del>
                      </div>
                      <a
                        href="shopping-cart.html"
                        className="theme-btn add-to-cart"
                      >
                        Add to cart
                      </a>
                    </div>
                  </div>
                </div>

                <div className="shop-item col-lg-4 col-md-6 col-sm-12">
                  <div className="inner-box">
                    <div className="image-box">
                      <figure className="image">
                        <a href="shop-single.html">
                          <img src="images/resource/products/10.jpg" alt="" />
                        </a>
                      </figure>
                      <span className="onsale">-17%</span>
                    </div>
                    <div className="lower-content">
                      <div className="rating">
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star light"></span>
                      </div>
                      <h4 className="name">
                        <a href="shop-single.html">Zinc Tablet</a>
                      </h4>
                      <div className="price"> $16.88</div>
                      <a
                        href="shopping-cart.html"
                        className="theme-btn add-to-cart"
                      >
                        Add to cart
                      </a>
                    </div>
                  </div>
                </div>

                <div className="shop-item col-lg-4 col-md-6 col-sm-12">
                  <div className="inner-box">
                    <div className="image-box">
                      <figure className="image">
                        <a href="shop-single.html">
                          <img src="images/resource/products/11.jpg" alt="" />
                        </a>
                      </figure>
                    </div>
                    <div className="lower-content">
                      <div className="rating">
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star light"></span>
                      </div>
                      <h4 className="name">
                        <a href="shop-single.html">Iron Tablet</a>
                      </h4>
                      <div className="price">
                        {" "}
                        $14.00 <del>$17.00</del>
                      </div>
                      <a
                        href="shopping-cart.html"
                        className="theme-btn add-to-cart"
                      >
                        Add to cart
                      </a>
                    </div>
                  </div>
                </div>

                <div className="shop-item col-lg-4 col-md-6 col-sm-12">
                  <div className="inner-box">
                    <div className="image-box">
                      <figure className="image">
                        <a href="shop-single.html">
                          <img src="images/resource/products/12.jpg" alt="" />
                        </a>
                      </figure>
                    </div>
                    <div className="lower-content">
                      <div className="rating">
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star light"></span>
                      </div>
                      <h4 className="name">
                        <a href="shop-single.html">Folic Acid</a>
                      </h4>
                      <div className="price">
                        $25.00 <del>$15.00</del>
                      </div>
                      <a
                        href="shopping-cart.html"
                        className="theme-btn add-to-cart"
                      >
                        {" "}
                        Add to cart
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <ul className="styled-pagination">
                <li>
                  <a href="#" className="arrow">
                    <span className="flaticon-left"></span>
                  </a>
                </li>
                <li>
                  <a href="#">1</a>
                </li>
                <li>
                  <a href="#" className="active">
                    2
                  </a>
                </li>
                <li>
                  <a href="#">3</a>
                </li>
                <li>
                  <a href="#" className="arrow">
                    <span className="flaticon-right"></span>
                  </a>
                </li>
              </ul>
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
                      defaultValue=""
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
                      defaultValue=""
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

export default Shop;
