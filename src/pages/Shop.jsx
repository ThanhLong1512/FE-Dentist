import { useState, useEffect } from "react";
import axios from "axios";
import { handleGetService } from "../apis";

function Shop() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      await handleGetService()
        .then((res) => {
          setServices(res);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    };

    fetchServices();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
                <div className="items-label">
                  Showing {services.length} results
                </div>
              </div>

              <div className="row">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="shop-item col-lg-4 col-md-6 col-sm-12"
                  >
                    <div className="inner-box">
                      <div className="image-box">
                        <figure className="image">
                          <a href="#">
                            <img
                              src={service.photoService.url}
                              alt={service.nameService}
                            />
                          </a>
                        </figure>
                      </div>
                      <div className="lower-content">
                        <h4 className="name">
                          <a href="#">{service.nameService}</a>
                        </h4>
                        <div className="price">
                          {service.priceService.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </div>
                        <div className="description">{service.description}</div>
                        <div className="unit">Đơn vị: {service.Unit}</div>
                        <a
                          href="#"
                          className="theme-btn add-to-cart text-decoration-none"
                        >
                          Add to cart
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
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
