import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { RecoveryContext } from "../App";

function Header() {
  const [userInfo, setUserInfo] = useState(null);
  const { countCart } = useContext(RecoveryContext);
  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);

  return (
    <>
      <div className="preloader" style={{ display: "none" }}></div>
      <header className="main-header header-style-two">
        <div className="header-top-two">
          <div className="auto-container">
            <div className="inner-container">
              <div className="top-left">
                <ul className="contact-list clearfix">
                  <li>
                    <i className="flaticon-hospital-1"></i>
                    234 Triumph, Los Angeles, <br />
                    California, US
                  </li>
                  <li>
                    <i className="flaticon-back-in-time"></i>
                    Mon - Sat 8.00 - 18.00. <br />
                    Sunday CLOSED
                  </li>
                </ul>
              </div>
              <div className="top-right">
                <ul className="social-icon-one">
                  <li>
                    <a href="#">
                      <span className="fab fa-facebook-f"></span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span className="fab fa-twitter"></span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span className="fab fa-skype"></span>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <span className="fab fa-linkedin-in"></span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Header Lower */}
        <div className="header-lower">
          <div className="auto-container">
            <div className="main-box">
              {/* Logo */}
              <div className="logo-box">
                <div className="logo">
                  <Link to="/home">
                    <img src="/images/logo-9.png" alt="Company Logo" />
                  </Link>
                </div>
              </div>

              {/* Navigation */}
              <div className="nav-outer">
                <nav className="nav main-menu">
                  <ul className="navigation" id="navbar">
                    <li>
                      <Link to="/home">Home</Link>
                    </li>
                    <li>
                      <Link to="/shop">Shop</Link>
                    </li>
                    <li>
                      <Link to="/blog">Blog</Link>
                    </li>
                    <li>
                      <Link to="/contact">Contact</Link>
                    </li>
                    {!userInfo && (
                      <li>
                        <Link to="/login">Login</Link>
                      </li>
                    )}
                  </ul>
                </nav>

                <div className="outer-box">
                  <button className="cart-btn">
                    <Link
                      to="/cart"
                      className="icon "
                      style={{ color: "white" }}
                    >
                      <i className=" flaticon-shopping-cart"></i>
                    </Link>
                    {countCart ? (
                      <span className="count">{countCart}</span>
                    ) : (
                      <span className="count">0</span>
                    )}
                  </button>
                  <button className="search-btn">
                    <span className="fa fa-search"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky-header">
          <div className="auto-container">
            <div className="main-box">
              {/* Logo */}
              <div className="logo-box">
                <div className="logo">
                  <Link to="/home">
                    <img src="/images/logo.png" alt="Company Logo" />
                  </Link>
                </div>
              </div>

              {/* Navigation */}
              <nav className="nav main-menu">
                <ul className="navigation" id="navbar">
                  <li>
                    <Link to="/home">Home</Link>
                  </li>
                  <li>
                    <Link to="/blog">Blog</Link>
                  </li>
                  <li>
                    <Link to="/shop">Shop</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact</Link>
                  </li>
                  {!userInfo && (
                    <li>
                      <Link to="/login">Login</Link>
                    </li>
                  )}
                </ul>
              </nav>

              {/* Header Icons */}
              <div className="outer-box">
                <button className="cart-btn">
                  <i className="icon flaticon-shopping-cart"></i>
                  <span className="count">3</span>
                </button>

                <button className="search-btn">
                  <span className="fa fa-search"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="mobile-header">
          <div className="logo">
            <Link to="/home">
              <img src="/images/logo.png" alt="Company Logo" />
            </Link>
          </div>

          <div className="nav-outer clearfix">
            <div className="outer-box">
              <div className="search-box">
                <button className="search-btn mobile-search-btn">
                  <i className="flaticon-magnifying-glass"></i>
                </button>
              </div>
              <button className="cart-btn">
                <i className="icon flaticon-shopping-cart"></i>
                <span className="count">3</span>
              </button>

              <a
                href="#nav-mobile"
                className="mobile-nav-toggler navbar-trigger"
              >
                <span className="fa fa-bars"></span>
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
