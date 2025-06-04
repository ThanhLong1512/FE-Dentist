import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { handleLogoutApi } from "../apis/index";
import Setup2FA from "../components/setup-2fa";
import Require2FA from "../components/require-2fa";
import HomeFooter from "../components/HomeFooter";
import HomeFeatures from "../components/HomeFeatures";
import HomeAbout from "../components/HomeAbout";
import HomeServices from "../components/HomeServices";
import HomeTeam from "../components/HomeTeam";
import HomeAppointment from "../components/HomeAppointment";
import HomePricing from "../components/HomePricing";
import HomeNews from "../components/HomeNews";
import HomeClients from "../components/HomeClients";
import Chat from "../components/Chat";

function Home() {
  const [openSetup2FA, setOpenSetup2FA] = useState(false);
  const [showRequire2FA, setShowRequire2FA] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("vi");

  const userMenuRef = useRef(null);

  let formatEmail,
    check2FA = false,
    checkVerify2FA;

  const useInfoFromLocalStorage = localStorage.getItem("userInfo");

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = getUserInfoFromStorage();
    if (userInfo) {
      setShowRequire2FA(userInfo.require_2FA && !userInfo.is_2fa_verified);
    }
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getUserInfoFromStorage = () => {
    const storedInfo = localStorage.getItem("userInfo");
    if (storedInfo) {
      return JSON.parse(storedInfo);
    }
    return null;
  };

  const handleLogout = async () => {
    await handleLogoutApi();
    navigate("/login");
  };

  const handleSuccessVerify2FA = (response) => {
    const { is_2fa_verified, last_login, user } = response.data;
    const newUserInfo = {
      email: user.email,
      id: user._id,
      role: user.role,
      require_2FA: user.require_2FA,
      is_2fa_verified: is_2fa_verified,
      last_login: last_login,
    };
    localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
    setShowRequire2FA(false);
  };

  const handleSuccessSetup2FA = (response) => {
    const { is_2fa_verified, last_login, user } = response.data;
    const newUserInfo = {
      email: user.email,
      id: user._id,
      role: user.role,
      require_2FA: user.require_2FA,
      is_2fa_verified: is_2fa_verified,
      last_login: last_login,
    };
    localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
    setOpenSetup2FA(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
  };

  const userInfo = getUserInfoFromStorage();
  if (userInfo) {
    const { email, require_2FA, is_2fa_verified, image } = userInfo;
    formatEmail = email.split("@")[0];
    check2FA = require_2FA;
    checkVerify2FA = is_2fa_verified;
  }

  const userMenuStyle = {
    position: "absolute",
    top: "100%",
    right: "0",
    backgroundColor: "#fff",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
    borderRadius: "4px",
    width: "220px",
    zIndex: "1000",
    padding: "8px 0",
    display: showUserMenu ? "block" : "none",
  };

  const menuItemStyle = {
    padding: "10px 16px",
    display: "block",
    color: "#333",
    textDecoration: "none",
    transition: "background-color 0.2s",
    cursor: "pointer",
  };

  const menuItemHoverStyle = {
    backgroundColor: "#f5f5f5",
  };

  const dividerStyle = {
    height: "1px",
    margin: "8px 0",
    backgroundColor: "#e0e0e0",
  };

  const avatarContainerStyle = {
    position: "relative",
    cursor: "pointer",
  };

  const avatarStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #fff",
  };

  return (
    <>
      {check2FA ? (
        <div
          style={{
            backgroundColor: "#e1f5fe",
            padding: "8px 12px",
            borderRadius: "4px",
            borderLeft: "4px solid #03a9f4",
            margin: "5px 0",
          }}
        >
          <span style={{ fontWeight: "500" }}>
            Tình trạng bảo mật tài khoản:
          </span>{" "}
          <span style={{ color: "#2e7d32" }}>
            Đã bật xác thực 2 lớp - Two-Factor Authentication (2FA)
          </span>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#fff8e1",
            padding: "8px 12px",
            borderRadius: "4px",
            borderLeft: "4px solid #ff9800",
            margin: "5px 0",
          }}
        >
          <span style={{ color: "#ff9800", fontWeight: "500" }}>
            Lời khuyên bảo mật:
          </span>
          <span style={{ color: "#5f5f5f" }}>
            Bật xác thực 2 bước để bảo vệ tài khoản tốt hơn.
            <Link
              to="#"
              onClick={() => setOpenSetup2FA(true)}
              style={{
                color: "#1976d2",
                marginLeft: "5px",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Bật ngay
            </Link>
          </span>
        </div>
      )}
      <Setup2FA
        isOpen={openSetup2FA}
        toggleOpen={setOpenSetup2FA}
        handleSuccessSetup2FA={handleSuccessSetup2FA}
      />
      <div className="mm-wrapper">
        <div className="mm-page mm-slideout" id="mm-0">
          <div className="page-wrapper">
            <div className="preloader" style={{ display: "none" }}></div>

            <header className="main-header header-style-one">
              <div className="header-top">
                <div className="auto-container">
                  <div className="inner-container">
                    <div className="top-left">
                      <ul className="contact-list clearfix">
                        <li>
                          <i className="flaticon-hospital-1"></i>234 Triumph,
                          Los Angeles, California, US{" "}
                        </li>
                        <li>
                          <i className="flaticon-back-in-time"></i>Mon - Sat
                          8.00 - 18.00. Sunday CLOSED
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

              <div className="header-lower">
                <div className="auto-container">
                  <div className="main-box">
                    <div className="logo-box">
                      <div className="logo">
                        <Link to="/home">
                          <img src="/images/logo.png" alt="" title="" />
                        </Link>
                      </div>
                    </div>

                    <div className="nav-outer">
                      <nav className="nav main-menu">
                        <ul className="navigation" id="navbar">
                          <li className="current dropdown">
                            <Link to="/home">
                              <span>Home</span>
                            </Link>
                          </li>
                          <li className="dropdown">
                            <Link to="/shop">
                              <span>Shop</span>
                            </Link>
                          </li>
                          <li className="dropdown">
                            <Link to="/blog">
                              <span>Blog</span>
                            </Link>
                          </li>
                          <li>
                            <Link to="/contact">
                              <span>Contact</span>
                            </Link>
                          </li>
                          {useInfoFromLocalStorage ? (
                            <>
                              <li>
                                <span
                                  style={{
                                    marginRight: "5px",
                                    display: "inline-block",
                                    width: "230px",
                                  }}
                                >
                                  {formatEmail}{" "}
                                  <span
                                    style={{
                                      fontSize: "20px",
                                      marginRight: "5px",
                                    }}
                                  >
                                    👋
                                  </span>
                                </span>
                              </li>
                              <li
                                ref={userMenuRef}
                                style={avatarContainerStyle}
                              >
                                <img
                                  src={
                                    userInfo?.image ||
                                    "/images/default-avatar.png"
                                  }
                                  alt="User"
                                  style={avatarStyle}
                                  onClick={() => setShowUserMenu(!showUserMenu)}
                                />
                                <div style={userMenuStyle}>
                                  <Link
                                    to="/account/profile"
                                    style={menuItemStyle}
                                  >
                                    <i
                                      className="fas fa-user"
                                      style={{
                                        marginRight: "10px",
                                        width: "20px",
                                      }}
                                    ></i>
                                    My Account
                                  </Link>

                                  <Link
                                    to="/account/appointments"
                                    style={menuItemStyle}
                                  >
                                    <i
                                      className="fas fa-calendar-check"
                                      style={{
                                        marginRight: "10px",
                                        width: "20px",
                                      }}
                                    ></i>
                                    My Appointments
                                  </Link>

                                  <Link
                                    to="/account/orders"
                                    style={menuItemStyle}
                                  >
                                    <i
                                      className="fas fa-shopping-bag"
                                      style={{
                                        marginRight: "10px",
                                        width: "20px",
                                      }}
                                    ></i>
                                    My Orders
                                  </Link>

                                  <div style={dividerStyle}></div>

                                  <div
                                    style={menuItemStyle}
                                    onClick={toggleDarkMode}
                                  >
                                    <i
                                      className={
                                        darkMode ? "fas fa-sun" : "fas fa-moon"
                                      }
                                      style={{
                                        marginRight: "10px",
                                        width: "20px",
                                      }}
                                    ></i>
                                    {darkMode ? "Light Mode" : "Dark Mode"}
                                    <span style={{ float: "right" }}>
                                      <div
                                        style={{
                                          width: "40px",
                                          height: "20px",
                                          backgroundColor: darkMode
                                            ? "#2196F3"
                                            : "#ccc",
                                          borderRadius: "10px",
                                          position: "relative",
                                          transition: "0.3s",
                                        }}
                                      >
                                        <div
                                          style={{
                                            position: "absolute",
                                            width: "16px",
                                            height: "16px",
                                            backgroundColor: "#fff",
                                            borderRadius: "50%",
                                            top: "2px",
                                            left: darkMode ? "22px" : "2px",
                                            transition: "0.3s",
                                          }}
                                        ></div>
                                      </div>
                                    </span>
                                  </div>

                                  <div style={dividerStyle}></div>

                                  <div style={{ padding: "10px 16px" }}>
                                    <span
                                      style={{
                                        marginRight: "10px",
                                        width: "20px",
                                        display: "inline-block",
                                      }}
                                    >
                                      <i className="fas fa-language"></i>
                                    </span>
                                    Language:
                                    <div style={{ marginTop: "5px" }}>
                                      <button
                                        onClick={() => changeLanguage("vi")}
                                        style={{
                                          padding: "2px 8px",
                                          marginRight: "5px",
                                          backgroundColor:
                                            currentLanguage === "vi"
                                              ? "#2196F3"
                                              : "#e0e0e0",
                                          color:
                                            currentLanguage === "vi"
                                              ? "#fff"
                                              : "#333",
                                          border: "none",
                                          borderRadius: "4px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        VI
                                      </button>
                                      <button
                                        onClick={() => changeLanguage("en")}
                                        style={{
                                          padding: "2px 8px",
                                          backgroundColor:
                                            currentLanguage === "en"
                                              ? "#2196F3"
                                              : "#e0e0e0",
                                          color:
                                            currentLanguage === "en"
                                              ? "#fff"
                                              : "#333",
                                          border: "none",
                                          borderRadius: "4px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        EN
                                      </button>
                                    </div>
                                  </div>

                                  <div style={dividerStyle}></div>

                                  <div
                                    style={{
                                      ...menuItemStyle,
                                      color: "#f44336",
                                    }}
                                    onClick={handleLogout}
                                  >
                                    <i
                                      className="fas fa-sign-out-alt"
                                      style={{
                                        marginRight: "10px",
                                        width: "20px",
                                      }}
                                    ></i>
                                    Logout
                                  </div>
                                </div>
                              </li>
                            </>
                          ) : (
                            <li>
                              <Link to="/login">
                                <span>Login</span>
                              </Link>
                            </li>
                          )}
                        </ul>
                      </nav>

                      <div className="outer-box">
                        <a
                          href="appointment.html"
                          id="appointment-btn"
                          className="theme-btn btn-style-one text-decoration-none"
                        >
                          <span className="btn-title ">Appointment</span>
                          <span></span> <span></span> <span></span>{" "}
                          <span></span> <span></span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky-header">
                <div className="auto-container">
                  <div className="main-box">
                    <div className="logo-box">
                      <div className="logo">
                        <a href="index.html">
                          <img src="/images/logo.png" alt="" title="" />
                        </a>
                      </div>
                    </div>

                    <nav className="nav main-menu">
                      <ul className="navigation" id="navbar">
                        <li>
                          <span>Home</span>
                        </li>

                        <li>
                          <span>Blog</span>
                        </li>
                        <li className="dropdown">
                          <span>Shop</span>
                        </li>
                        <li>
                          <a href="contact.html">Contact</a>
                        </li>
                      </ul>
                    </nav>

                    <div className="outer-box">
                      <button className="search-btn">
                        <span className="fa fa-search"></span>
                      </button>
                      <a
                        href="appointment.html"
                        id="appointment-btn"
                        className="theme-btn btn-style-one"
                      >
                        <span className="btn-title text-decoration-none ">
                          Appointment
                        </span>
                        <span></span> <span></span> <span></span> <span></span>{" "}
                        <span></span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mobile-header">
                <div className="logo">
                  <a href="index.html">
                    <img src="/images/logo.png" alt="" title="" />
                  </a>
                </div>

                <div className="nav-outer clearfix">
                  <div className="outer-box">
                    <div className="search-box">
                      <button className="search-btn mobile-search-btn">
                        <i className="flaticon-magnifying-glass"></i>
                      </button>
                    </div>

                    <a
                      href="#nav-mobile"
                      className="mobile-nav-toggler navbar-trigger"
                    >
                      <span className="fa fa-bars"></span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="search-popup">
                <span className="search-back-drop"></span>
                <button className="close-search">
                  <span className="fa fa-times"></span>
                </button>

                <div className="search-inner">
                  <form
                    method="post"
                    action="https://skyethemes.com/html/2022/medicoz/blog-showcase.html"
                  >
                    <div className="form-group">
                      <input
                        type="search"
                        name="search-field"
                        defaultValue=""
                        placeholder="Search..."
                        required=""
                      />
                      <button type="submit">
                        <i className="flaticon-magnifying-glass"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </header>

            <section className="banner-section-one">
              <div className="banner-carousel owl-carousel owl-theme default-arrows dark owl-loaded owl-drag">
                <div
                  className="owl-stage-outer owl-height"
                  style={{ height: "780px" }}
                >
                  <div
                    className="owl-stage"
                    style={{
                      transform: "translate3d(-3038px, 0px, 0px)",
                      transition: "all",
                      width: "9114px",
                    }}
                  >
                    <div
                      className="owl-item cloned"
                      style={{ width: "1519px" }}
                    >
                      <div
                        className="slide-item"
                        style={{
                          backgroundImage: `url('/images/main-slider/1.jpg')`,
                        }}
                      >
                        <div className="auto-container">
                          <div className="content-outer">
                            <div className="content-box">
                              <span className="title">
                                Welcome to our Medical Care Center
                              </span>
                              <h2>
                                We take care our <br />
                                patients health
                              </h2>
                              <div className="text">
                                I realized that becoming a doctor, I can only
                                help a small community. <br />
                                But by becoming a doctor, I can help my whole
                                country.{" "}
                              </div>
                              <div className="btn-box">
                                <a
                                  href="about-us.html"
                                  className="theme-btn btn-style-one"
                                >
                                  <span className="btn-title">About Us</span>
                                  <span></span> <span></span> <span></span>{" "}
                                  <span></span> <span></span>
                                </a>
                                <a
                                  href="departments.html"
                                  className="theme-btn btn-style-two"
                                >
                                  <span className="btn-title">
                                    Our Services
                                  </span>
                                  <span></span> <span></span> <span></span>{" "}
                                  <span></span> <span></span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="owl-item cloned"
                      style={{ width: "1519px" }}
                    >
                      <div
                        className="slide-item"
                        style={{
                          backgroundImage: `url('/images/main-slider/2.jpg')`,
                        }}
                      >
                        <div className="auto-container">
                          <div className="content-outer">
                            <div className="content-box">
                              <span className="title">
                                Welcome to our Medical Care Center
                              </span>
                              <h2>
                                We take care our <br />
                                patients health
                              </h2>
                              <div className="text">
                                I realized that becoming a doctor, I can only
                                help a small community. <br />
                                But by becoming a doctor, I can help my whole
                                country.{" "}
                              </div>
                              <div className="btn-box">
                                <a
                                  href="about-us.html"
                                  className="theme-btn btn-style-one"
                                >
                                  <span className="btn-title">About Us</span>
                                  <span></span> <span></span> <span></span>{" "}
                                  <span></span> <span></span>
                                </a>
                                <a
                                  href="departments.html"
                                  className="theme-btn btn-style-two"
                                >
                                  <span className="btn-title">
                                    Our Services
                                  </span>
                                  <span></span> <span></span> <span></span>{" "}
                                  <span></span> <span></span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="owl-item active"
                      style={{ width: "1519px" }}
                    >
                      <div
                        className="slide-item"
                        style={{
                          backgroundImage: `url('/images/main-slider/1.jpg')`,
                        }}
                      >
                        <div className="auto-container">
                          <div className="content-outer">
                            <div className="content-box">
                              <span className="title">
                                Welcome to our Medical Care Center
                              </span>
                              <h2>
                                We take care our <br />
                                patients health
                              </h2>
                              <div className="text">
                                I realized that becoming a doctor, I can only
                                help a small community. <br />
                                But by becoming a doctor, I can help my whole
                                country.{" "}
                              </div>
                              <div className="btn-box">
                                <a
                                  href="about-us.html"
                                  className="theme-btn btn-style-one"
                                >
                                  <span className="btn-title">About Us</span>
                                  <span></span> <span></span> <span></span>{" "}
                                  <span></span> <span></span>
                                </a>
                                <a
                                  href="departments.html"
                                  className="theme-btn btn-style-two"
                                >
                                  <span className="btn-title">
                                    Our Services
                                  </span>
                                  <span></span> <span></span> <span></span>{" "}
                                  <span></span> <span></span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="owl-item" style={{ width: "1519px" }}>
                      <div
                        className="slide-item"
                        style={{
                          backgroundImage: `url('/images/main-slider/2.jpg')`,
                        }}
                      >
                        <div className="auto-container">
                          <div className="content-outer">
                            <div className="content-box">
                              <span className="title">
                                Welcome to our Medical Care Center
                              </span>
                              <h2>
                                We take care our <br />
                                patients health
                              </h2>
                              <div className="text">
                                I realized that becoming a doctor`&lsquo;` I can
                                only help a small community. <br />
                                But by becoming a doctor, I can help my whole
                                country.
                              </div>
                              <div className="btn-box">
                                <a
                                  href="about-us.html"
                                  className="theme-btn btn-style-one"
                                >
                                  <span className="btn-title">About Us</span>
                                  <span></span> <span></span> <span></span>{" "}
                                  <span></span> <span></span>
                                </a>
                                <a
                                  href="departments.html"
                                  className="theme-btn btn-style-two"
                                >
                                  <span className="btn-title">
                                    Our Services
                                  </span>
                                  <span></span> <span></span> <span></span>{" "}
                                  <span></span> <span></span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="owl-item cloned"
                      style={{ width: "1519px" }}
                    >
                      <div
                        className="slide-item"
                        style={{
                          backgroundImage: `url('/images/main-slider/1.jpg')`,
                        }}
                      >
                        <div className="auto-container">
                          <div className="content-outer">
                            <div className="content-box">
                              <span className="title">
                                Welcome to our Medical Care Center
                              </span>
                              <h2>
                                We take care our <br />
                                patients health
                              </h2>
                              <div className="text">
                                I realized that becoming a doctor, I can only
                                help a small community. <br />
                                But by becoming a doctor, I can help my whole
                                country.{" "}
                              </div>
                              <div className="btn-box">
                                <a
                                  href="about-us.html"
                                  className="theme-btn btn-style-one"
                                >
                                  <span className="btn-title">About Us</span>
                                  <span></span> <span></span> <span></span>{" "}
                                  <span></span> <span></span>
                                </a>
                                <a
                                  href="departments.html"
                                  className="theme-btn btn-style-two"
                                >
                                  <span className="btn-title">
                                    Our Services
                                  </span>
                                  <span></span> <span></span> <span></span>{" "}
                                  <span></span> <span></span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="owl-item cloned"
                      style={{ width: "1519px" }}
                    >
                      <div
                        className="slide-item"
                        style={{
                          backgroundImage: `url('/images/main-slider/2.jpg')`,
                        }}
                      >
                        <div className="auto-container">
                          <div className="content-outer">
                            <div className="content-box">
                              <span className="title">
                                Welcome to our Medical Care Center
                              </span>
                              <h2>
                                We take care our <br />
                                patients health
                              </h2>
                              <div className="text">
                                I realized that becoming a doctor, I can only
                                help a small community. <br />
                                But by becoming a doctor, I can help my whole
                                country.{" "}
                              </div>
                              <div className="btn-box">
                                <a
                                  href="about-us.html"
                                  className="theme-btn btn-style-one"
                                >
                                  <span className="btn-title">About Us</span>
                                  <span></span> <span></span> <span></span>{" "}
                                  <span></span> <span></span>
                                </a>
                                <a
                                  href="departments.html"
                                  className="theme-btn btn-style-two"
                                >
                                  <span className="btn-title">
                                    Our Services
                                  </span>
                                  <span></span> <span></span> <span></span>{" "}
                                  <span></span> <span></span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="owl-nav">
                  <div className="owl-prev">
                    <span className="fa fa-angle-left"></span>
                  </div>
                  <div className="owl-next">
                    <span className="fa fa-angle-right"></span>
                  </div>
                </div>
                <div className="owl-dots">
                  <div className="owl-dot active">
                    <span></span>
                  </div>
                  <div className="owl-dot">
                    <span></span>
                  </div>
                </div>
              </div>
            </section>
            <HomeFeatures />
            <HomeAbout />
            <HomeServices />
            <HomeTeam />
            <HomeAppointment />
            <section className="testimonial-section">
              <div className="auto-container">
                <div className="sec-title text-center">
                  <span className="title">HAPPY Patient</span>
                  <h2>What Says Our Patients</h2>
                  <span className="divider">
                    <svg viewBox="0 0 300.08 300.08">
                      <path d="m293.26 184.14h-82.877l-12.692-76.138c-.546-3.287-3.396-5.701-6.718-5.701-.034 0-.061 0-.089 0-3.369.027-6.199 2.523-6.677 5.845l-12.507 87.602-14.874-148.69c-.355-3.43-3.205-6.056-6.643-6.138-.048 0-.096 0-.143 0-3.39 0-6.274 2.489-6.752 5.852l-19.621 137.368h-9.405l-12.221-42.782c-.866-3.028-3.812-5.149-6.8-4.944-3.13.109-5.777 2.332-6.431 5.395l-8.941 42.332h-73.049c-3.771 0-6.82 3.049-6.82 6.82 0 3.778 3.049 6.82 6.82 6.82h78.566c3.219 0 6.002-2.251 6.67-5.408l4.406-20.856 6.09 21.313c.839 2.939 3.526 4.951 6.568 4.951h20.46c3.396 0 6.274-2.489 6.752-5.845l12.508-87.596 14.874 148.683c.355 3.437 3.205 6.056 6.643 6.138h.143c3.39 0 6.274-2.489 6.752-5.845l14.227-99.599 6.397 38.362c.546 3.287 3.396 5.702 6.725 5.702h88.66c3.771 0 6.82-3.049 6.82-6.82-.001-3.772-3.05-6.821-6.821-6.821z"></path>
                    </svg>
                  </span>
                </div>

                <div className="testimonial-outer">
                  <div className="client-testimonial-carousel owl-carousel owl-theme owl-loaded owl-drag">
                    <div className="owl-stage-outer">
                      <div
                        className="owl-stage"
                        style={{
                          transform: "translate3d(-3200px, 0px, 0px)",
                          transition: "0.5s",
                          width: "8800px",
                        }}
                      >
                        <div
                          className="owl-item cloned"
                          style={{ width: "800px" }}
                        >
                          <div className="testimonial-block">
                            <div className="inner-box">
                              <div className="text">
                                Medical Centre is a great place to get all of
                                your medical needs. I came in for a check up and
                                did not wait more than 5 minutes before I was
                                seen. I can only imagine the type of service you
                                get for more serious issues. Thanks!
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="owl-item cloned"
                          style={{ width: "800px" }}
                        >
                          <div className="testimonial-block">
                            <div className="inner-box">
                              <div className="text">
                                Medical Centre is a great place to get all of
                                your medical needs. I came in for a check up and
                                did not wait more than 5 minutes before I was
                                seen. I can only imagine the type of service you
                                get for more serious issues. Thanks!
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="owl-item cloned"
                          style={{ width: "800px" }}
                        >
                          <div className="testimonial-block">
                            <div className="inner-box">
                              <div className="text">
                                Medical Centre is a great place to get all of
                                your medical needs. I came in for a check up and
                                did not wait more than 5 minutes before I was
                                seen. I can only imagine the type of service you
                                get for more serious issues. Thanks!
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="owl-item" style={{ width: "800px" }}>
                          <div className="testimonial-block">
                            <div className="inner-box">
                              <div className="text">
                                Medical Centre is a great place to get all of
                                your medical needs. I came in for a check up and
                                did not wait more than 5 minutes before I was
                                seen. I can only imagine the type of service you
                                get for more serious issues. Thanks!
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="owl-item active"
                          style={{ width: "800px" }}
                        >
                          <div className="testimonial-block">
                            <div className="inner-box">
                              <div className="text">
                                Medical Centre is a great place to get all of
                                your medical needs. I came in for a check up and
                                did not wait more than 5 minutes before I was
                                seen. I can only imagine the type of service you
                                get for more serious issues. Thanks!
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="owl-item" style={{ width: "800px" }}>
                          <div className="testimonial-block">
                            <div className="inner-box">
                              <div className="text">
                                Medical Centre is a great place to get all of
                                your medical needs. I came in for a check up and
                                did not wait more than 5 minutes before I was
                                seen. I can only imagine the type of service you
                                get for more serious issues. Thanks!
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="owl-item" style={{ width: "800px" }}>
                          <div className="testimonial-block">
                            <div className="inner-box">
                              <div className="text">
                                Medical Centre is a great place to get all of
                                your medical needs. I came in for a check up and
                                did not wait more than 5 minutes before I was
                                seen. I can only imagine the type of service you
                                get for more serious issues. Thanks!
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="owl-item" style={{ width: "800px" }}>
                          <div className="testimonial-block">
                            <div className="inner-box">
                              <div className="text">
                                Medical Centre is a great place to get all of
                                your medical needs. I came in for a check up and
                                did not wait more than 5 minutes before I was
                                seen. I can only imagine the type of service you
                                get for more serious issues. Thanks!
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="owl-item cloned"
                          style={{ width: "800px" }}
                        >
                          <div className="testimonial-block">
                            <div className="inner-box">
                              <div className="text">
                                Medical Centre is a great place to get all of
                                your medical needs. I came in for a check up and
                                did not wait more than 5 minutes before I was
                                seen. I can only imagine the type of service you
                                get for more serious issues. Thanks!
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="owl-item cloned"
                          style={{ width: "800px" }}
                        >
                          <div className="testimonial-block">
                            <div className="inner-box">
                              <div className="text">
                                Medical Centre is a great place to get all of
                                your medical needs. I came in for a check up and
                                did not wait more than 5 minutes before I was
                                seen. I can only imagine the type of service you
                                get for more serious issues. Thanks!
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="owl-item cloned"
                          style={{ width: "800px" }}
                        >
                          <div className="testimonial-block">
                            <div className="inner-box">
                              <div className="text">
                                Medical Centre is a great place to get all of
                                your medical needs. I came in for a check up and
                                did not wait more than 5 minutes before I was
                                seen. I can only imagine the type of service you
                                get for more serious issues. Thanks!
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="owl-nav">
                      <div className="owl-prev">
                        <span className="fa fa-angle-left"></span>
                      </div>
                      <div className="owl-next">
                        <span className="fa fa-angle-right"></span>
                      </div>
                    </div>
                    <div className="owl-dots">
                      <div className="owl-dot">
                        <span></span>
                      </div>
                      <div className="owl-dot active">
                        <span></span>
                      </div>
                      <div className="owl-dot">
                        <span></span>
                      </div>
                      <div className="owl-dot">
                        <span></span>
                      </div>
                      <div className="owl-dot">
                        <span></span>
                      </div>
                    </div>
                  </div>

                  <div className="client-thumb-outer">
                    <div className="client-thumbs-carousel owl-carousel owl-theme owl-loaded owl-drag">
                      <div className="owl-stage-outer">
                        <div
                          className="owl-stage"
                          style={{
                            transition: "0.25s",
                            width: "1430px",
                            transform: "translate3d(-780px, 0px, 0px)",
                          }}
                        >
                          <div
                            className="owl-item cloned"
                            style={{ width: "130px" }}
                          >
                            <div className="thumb-item">
                              <figure className="thumb-box">
                                <img
                                  src="/images/resource/testi-thumb-3.jpg"
                                  alt=""
                                />
                              </figure>
                              <div className="author-info">
                                <span className="icon fa fa-quote-left"></span>
                                <div className="author-name">Lara Croft</div>
                                <div className="designation">
                                  Restaurant Owner
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="owl-item cloned"
                            style={{ width: "130px" }}
                          >
                            <div className="thumb-item">
                              <figure className="thumb-box">
                                <img
                                  src="/images/resource/testi-thumb-2.jpg"
                                  alt=""
                                />
                              </figure>
                              <div className="author-info">
                                <span className="icon fa fa-quote-left"></span>
                                <div className="author-name">Lara Croft</div>
                                <div className="designation">
                                  Restaurant Owner
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="owl-item cloned"
                            style={{ width: "130px" }}
                          >
                            <div className="thumb-item">
                              <figure className="thumb-box">
                                <img
                                  src="/images/resource/testi-thumb-3.jpg"
                                  alt=""
                                />
                              </figure>
                              <div className="author-info">
                                <span className="icon fa fa-quote-left"></span>
                                <div className="author-name">Lara Croft</div>
                                <div className="designation">
                                  Restaurant Owner
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="owl-item" style={{ width: "130px" }}>
                            <div className="thumb-item">
                              <figure className="thumb-box">
                                <img
                                  src="/images/resource/testi-thumb-1.jpg"
                                  alt=""
                                />
                              </figure>
                              <div className="author-info">
                                <span className="icon fa fa-quote-left"></span>
                                <div className="author-name">Lara Croft</div>
                                <div className="designation">
                                  Restaurant Owner
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="owl-item" style={{ width: "130px" }}>
                            <div className="thumb-item">
                              <figure className="thumb-box">
                                <img
                                  src="/images/resource/testi-thumb-2.jpg"
                                  alt=""
                                />
                              </figure>
                              <div className="author-info">
                                <span className="icon fa fa-quote-left"></span>
                                <div className="author-name">Lara Croft</div>
                                <div className="designation">
                                  Restaurant Owner
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="owl-item" style={{ width: "130px" }}>
                            <div className="thumb-item">
                              <figure className="thumb-box">
                                <img
                                  src="/images/resource/testi-thumb-3.jpg"
                                  alt=""
                                />
                              </figure>
                              <div className="author-info">
                                <span className="icon fa fa-quote-left"></span>
                                <div className="author-name">Lara Croft</div>
                                <div className="designation">
                                  Restaurant Owner
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="owl-item active center"
                            style={{ width: "130px" }}
                          >
                            <div className="thumb-item">
                              <figure className="thumb-box">
                                <img
                                  src="/images/resource/testi-thumb-2.jpg"
                                  alt=""
                                />
                              </figure>
                              <div className="author-info">
                                <span className="icon fa fa-quote-left"></span>
                                <div className="author-name">Lara Croft</div>
                                <div className="designation">
                                  Restaurant Owner
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="owl-item" style={{ width: "130px" }}>
                            <div className="thumb-item">
                              <figure className="thumb-box">
                                <img
                                  src="/images/resource/testi-thumb-3.jpg"
                                  alt=""
                                />
                              </figure>
                              <div className="author-info">
                                <span className="icon fa fa-quote-left"></span>
                                <div className="author-name">Lara Croft</div>
                                <div className="designation">
                                  Restaurant Owner
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="owl-item cloned"
                            style={{ width: "130px" }}
                          >
                            <div className="thumb-item">
                              <figure className="thumb-box">
                                <img
                                  src="/images/resource/testi-thumb-1.jpg"
                                  alt=""
                                />
                              </figure>
                              <div className="author-info">
                                <span className="icon fa fa-quote-left"></span>
                                <div className="author-name">Lara Croft</div>
                                <div className="designation">
                                  Restaurant Owner
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="owl-item cloned"
                            style={{ width: "130px" }}
                          >
                            <div className="thumb-item">
                              <figure className="thumb-box">
                                <img
                                  src="/images/resource/testi-thumb-2.jpg"
                                  alt=""
                                />
                              </figure>
                              <div className="author-info">
                                <span className="icon fa fa-quote-left"></span>
                                <div className="author-name">Lara Croft</div>
                                <div className="designation">
                                  Restaurant Owner
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="owl-item cloned"
                            style={{ width: "130px" }}
                          >
                            <div className="thumb-item">
                              <figure className="thumb-box">
                                <img
                                  src="/images/resource/testi-thumb-3.jpg"
                                  alt=""
                                />
                              </figure>
                              <div className="author-info">
                                <span className="icon fa fa-quote-left"></span>
                                <div className="author-name">Lara Croft</div>
                                <div className="designation">
                                  Restaurant Owner
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="owl-nav disabled">
                        <div className="owl-prev">
                          <span className="icon flaticon-left-arrow-2"></span>
                        </div>
                        <div className="owl-next">
                          <span className="icon flaticon-right-arrow-1"></span>
                        </div>
                      </div>
                      <div className="owl-dots disabled"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <HomePricing />
            <HomeNews />
            <HomeClients />

            <HomeFooter />
          </div>
        </div>
      </div>
      {userInfo && userInfo.role === "user" && <Chat />}
      {showRequire2FA && (
        <Require2FA handleSuccessVerify2FA={handleSuccessVerify2FA} />
      )}
    </>
  );
}

export default Home;
