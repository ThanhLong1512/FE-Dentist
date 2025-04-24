import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import authorizedAxiosInstance from "../utils/authorizedAxios";
import { API_ROOT } from "../utils/constants";
import { handleLogoutApi } from "../apis/index";
import Setup2FA from "../components/setup-2fa";
import Require2FA from "../components/require-2fa";
function Home() {
  const [openSetup2FA, setOpenSetup2FA] = useState(false);
  let formatEmail,
    check2FA = false,
    checkVerify2FA;
  const useInfoFromLocalStorage = localStorage.getItem("userInfo");
  const navigate = useNavigate();
  const handleLogout = async () => {
    handleLogoutApi();
    navigate("/login");
  };
  const handleSuccessSetup2FA = (response) => {
    // console.log(response);
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
  if (useInfoFromLocalStorage) {
    const { id, email, role, require_2FA, is_2fa_verified } = JSON.parse(
      useInfoFromLocalStorage
    );
    formatEmail = email.split("@")[0];
    check2FA = require_2FA;
    checkVerify2FA = is_2fa_verified;
  }

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
                            <Link to="/blog">
                              <span>Blog</span>
                            </Link>
                          </li>
                          <li className="dropdown">
                            <Link to="/shop">
                              <span>Shop</span>
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
                              <li>
                                <Button
                                  variant="contained"
                                  color="error"
                                  sx={{ width: "100px" }}
                                  onClick={() => {
                                    handleLogout();
                                  }}
                                >
                                  Log out
                                </Button>
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
                          className="theme-btn btn-style-one"
                        >
                          <span className="btn-title">Appointment</span>
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
                        <span className="btn-title">Appointment</span>
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
            <section className="top-features">
              <div className="auto-container">
                <div className="row">
                  <div className="feature-block col-lg-4 col-md-6 col-sm-12">
                    <div className="inner-box">
                      <span className="icon flaticon-charity"></span>
                      <h4>
                        <a href="#">Quality &amp; Safety</a>
                      </h4>
                      <p>
                        Our Delmont hospital utilizes state of the art
                        technology and employs a team of true experts.
                      </p>
                    </div>
                  </div>
                  <div className="feature-block col-lg-4 col-md-6 col-sm-12">
                    <div className="inner-box">
                      <span className="icon flaticon-lifeline"></span>
                      <h4>
                        <a href="#">Leading Technology</a>
                      </h4>
                      <p>
                        Our Delmont hospital utilizes state of the art
                        technology and employs a team of true experts.
                      </p>
                    </div>
                  </div>
                  <div className="feature-block col-lg-4 col-md-6 col-sm-12">
                    <div className="inner-box">
                      <span className="icon flaticon-doctor"></span>
                      <h4>
                        <a href="#">Experts by Experience</a>
                      </h4>
                      <p>
                        Our Delmont hospital utilizes state of the art
                        technology and employs a team of true experts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="about-section">
              <div className="auto-container">
                <div className="row">
                  <div className="content-column col-lg-6 col-md-12 col-sm-12 order-2">
                    <div className="inner-column">
                      <div className="sec-title">
                        <span className="sub-title">OUR MEDICAL</span>
                        <h2>
                          We&apos;re setting Standards in Research what&apos;
                          more, Clinical Care.
                        </h2>
                        <span className="divider">
                          <svg viewBox="0 0 300.08 300.08">
                            <path d="m293.26 184.14h-82.877l-12.692-76.138c-.546-3.287-3.396-5.701-6.718-5.701-.034 0-.061 0-.089 0-3.369.027-6.199 2.523-6.677 5.845l-12.507 87.602-14.874-148.69c-.355-3.43-3.205-6.056-6.643-6.138-.048 0-.096 0-.143 0-3.39 0-6.274 2.489-6.752 5.852l-19.621 137.368h-9.405l-12.221-42.782c-.866-3.028-3.812-5.149-6.8-4.944-3.13.109-5.777 2.332-6.431 5.395l-8.941 42.332h-73.049c-3.771 0-6.82 3.049-6.82 6.82 0 3.778 3.049 6.82 6.82 6.82h78.566c3.219 0 6.002-2.251 6.67-5.408l4.406-20.856 6.09 21.313c.839 2.939 3.526 4.951 6.568 4.951h20.46c3.396 0 6.274-2.489 6.752-5.845l12.508-87.596 14.874 148.683c.355 3.437 3.205 6.056 6.643 6.138h.143c3.39 0 6.274-2.489 6.752-5.845l14.227-99.599 6.397 38.362c.546 3.287 3.396 5.702 6.725 5.702h88.66c3.771 0 6.82-3.049 6.82-6.82-.001-3.772-3.05-6.821-6.821-6.821z"></path>
                          </svg>
                        </span>
                        <p>
                          We provide the most full medical services, so every
                          person could have the pportunity o receive qualitative
                          medical help.
                        </p>
                        <p>
                          {" "}
                          Our Clinic has grown to provide a world className
                          facility for the treatment of tooth loss, dental
                          cosmetics and bore advanced restorative dentistry. We
                          are among the most qualified implant providers in the
                          AUS with over 30 years of uality training and
                          experience.
                        </p>
                      </div>
                      <div className="link-box">
                        <figure className="signature">
                          <img src="/images/resource/signature.png" alt="" />
                        </figure>
                        <a href="#" className="theme-btn btn-style-one">
                          <span className="btn-title">More About</span>
                          <span></span> <span></span> <span></span>{" "}
                          <span></span> <span></span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="images-column col-lg-6 col-md-12 col-sm-12">
                    <div className="inner-column">
                      <div className="video-link">
                        <a
                          href="https://www.youtube.com/watch?v=4UvS3k8D4rs"
                          className="play-btn lightbox-image"
                          data-fancybox="images"
                        >
                          <span className="flaticon-play-button-1"></span>
                        </a>
                      </div>
                      <figure className="image-1">
                        <img src="/images/resource/image-1.png" alt="" />
                      </figure>
                      <figure className="image-2">
                        <img src="/images/resource/image-2.png" alt="" />
                      </figure>
                      <figure className="image-3">
                        <span className="hex"></span>
                        <img src="/images/resource/image-3.png" alt="" />
                      </figure>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="services-section">
              <div className="auto-container">
                <div className="sec-title text-center">
                  <span className="sub-title">OUR SERVICES</span>
                  <h2>We Care Our Patients.</h2>
                  <span className="divider">
                    <svg viewBox="0 0 300.08 300.08">
                      <path d="m293.26 184.14h-82.877l-12.692-76.138c-.546-3.287-3.396-5.701-6.718-5.701-.034 0-.061 0-.089 0-3.369.027-6.199 2.523-6.677 5.845l-12.507 87.602-14.874-148.69c-.355-3.43-3.205-6.056-6.643-6.138-.048 0-.096 0-.143 0-3.39 0-6.274 2.489-6.752 5.852l-19.621 137.368h-9.405l-12.221-42.782c-.866-3.028-3.812-5.149-6.8-4.944-3.13.109-5.777 2.332-6.431 5.395l-8.941 42.332h-73.049c-3.771 0-6.82 3.049-6.82 6.82 0 3.778 3.049 6.82 6.82 6.82h78.566c3.219 0 6.002-2.251 6.67-5.408l4.406-20.856 6.09 21.313c.839 2.939 3.526 4.951 6.568 4.951h20.46c3.396 0 6.274-2.489 6.752-5.845l12.508-87.596 14.874 148.683c.355 3.437 3.205 6.056 6.643 6.138h.143c3.39 0 6.274-2.489 6.752-5.845l14.227-99.599 6.397 38.362c.546 3.287 3.396 5.702 6.725 5.702h88.66c3.771 0 6.82-3.049 6.82-6.82-.001-3.772-3.05-6.821-6.821-6.821z"></path>
                    </svg>
                  </span>
                </div>

                <div className="row">
                  <div className="service-block col-lg-4 col-md-6 col-sm-12">
                    <div className="inner-box">
                      <span className="icon flaticon-heartbeat"></span>
                      <h5>
                        <a href="#">Health Check</a>
                      </h5>
                      <div className="text">
                        We offer extensive medical procedures to outbound &amp;
                        inbound patients what it is and we are very proud
                        achievement staff.
                      </div>
                    </div>
                  </div>
                  <div className="service-block col-lg-4 col-md-6 col-sm-12">
                    <div className="inner-box">
                      <span className="icon flaticon-surgery-room"></span>
                      <h5>
                        <a href="#">Operation Theater</a>
                      </h5>
                      <div className="text">
                        We offer extensive medical procedures to outbound &amp;
                        inbound patients what it is and we are very proud
                        achievement staff.
                      </div>
                    </div>
                  </div>
                  <div className="service-block col-lg-4 col-md-6 col-sm-12">
                    <div className="inner-box">
                      <span className="icon flaticon-pharmacy"></span>
                      <h5>
                        <a href="#">Pharmacy Support</a>
                      </h5>
                      <div className="text">
                        We offer extensive medical procedures to outbound &amp;
                        inbound patients what it is and we are very proud
                        achievement staff.
                      </div>
                    </div>
                  </div>
                  <div className="service-block col-lg-4 col-md-6 col-sm-12">
                    <div className="inner-box">
                      <span className="icon flaticon-transport"></span>
                      <h5>
                        <a href="#">Ambulance Car</a>
                      </h5>
                      <div className="text">
                        We offer extensive medical procedures to outbound &amp;
                        inbound patients what it is and we are very proud
                        achievement staff.
                      </div>
                    </div>
                  </div>
                  <div className="service-block col-lg-4 col-md-6 col-sm-12">
                    <div className="inner-box">
                      <span className="icon flaticon-lab"></span>
                      <h5>
                        <a href="#">Lat Tests</a>
                      </h5>
                      <div className="text">
                        We offer extensive medical procedures to outbound &amp;
                        inbound patients what it is and we are very proud
                        achievement staff.
                      </div>
                    </div>
                  </div>

                  <div className="service-block col-lg-4 col-md-6 col-sm-12">
                    <div className="inner-box">
                      <span className="icon flaticon-first-aid"></span>
                      <h5>
                        <a href="#">Intensive Care</a>
                      </h5>
                      <div className="text">
                        We offer extensive medical procedures to outbound &amp;
                        inbound patients what it is and we are very proud
                        achievement staff.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="team-section">
              <div className="auto-container">
                <div className="sec-title text-center">
                  <span className="sub-title">Our Doctor</span>
                  <h2>Our Dedicated Doctors Team</h2>
                  <span className="divider">
                    <svg viewBox="0 0 300.08 300.08">
                      <path d="m293.26 184.14h-82.877l-12.692-76.138c-.546-3.287-3.396-5.701-6.718-5.701-.034 0-.061 0-.089 0-3.369.027-6.199 2.523-6.677 5.845l-12.507 87.602-14.874-148.69c-.355-3.43-3.205-6.056-6.643-6.138-.048 0-.096 0-.143 0-3.39 0-6.274 2.489-6.752 5.852l-19.621 137.368h-9.405l-12.221-42.782c-.866-3.028-3.812-5.149-6.8-4.944-3.13.109-5.777 2.332-6.431 5.395l-8.941 42.332h-73.049c-3.771 0-6.82 3.049-6.82 6.82 0 3.778 3.049 6.82 6.82 6.82h78.566c3.219 0 6.002-2.251 6.67-5.408l4.406-20.856 6.09 21.313c.839 2.939 3.526 4.951 6.568 4.951h20.46c3.396 0 6.274-2.489 6.752-5.845l12.508-87.596 14.874 148.683c.355 3.437 3.205 6.056 6.643 6.138h.143c3.39 0 6.274-2.489 6.752-5.845l14.227-99.599 6.397 38.362c.546 3.287 3.396 5.702 6.725 5.702h88.66c3.771 0 6.82-3.049 6.82-6.82-.001-3.772-3.05-6.821-6.821-6.821z"></path>
                    </svg>
                  </span>
                </div>

                <div className="row">
                  <div className="team-block col-lg-3 col-md-6 col-sm-12 wow fadeInUp">
                    <div className="inner-box">
                      <figure className="image">
                        <img src="/images/resource/team-1.jpg" alt="" />
                      </figure>
                      <ul className="social-links">
                        <li>
                          <a href="#">
                            <span className="fab fa-facebook"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="fab fa-linkedin-in"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="fab fa-twitter"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="fab fa-pinterest"></span>
                          </a>
                        </li>
                      </ul>
                      <div className="info-box">
                        <h4 className="name">
                          <a href="doctor-detail.html">Dr. Morila Wood</a>
                        </h4>
                        <span className="designation">
                          Senior Dr. at Delmont
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="team-block col-lg-3 col-md-6 col-sm-12 wow fadeInUp">
                    <div className="inner-box">
                      <figure className="image">
                        <img src="/images/resource/team-2.jpg" alt="" />
                      </figure>
                      <ul className="social-links">
                        <li>
                          <a href="#">
                            <span className="fab fa-facebook"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="fab fa-linkedin-in"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="fab fa-twitter"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="fab fa-pinterest"></span>
                          </a>
                        </li>
                      </ul>
                      <div className="info-box">
                        <h4 className="name">
                          <a href="doctor-detail.html">Dr. Morila Wood</a>
                        </h4>
                        <span className="designation">
                          Senior Dr. at Delmont
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="team-block col-lg-3 col-md-6 col-sm-12 wow fadeInUp">
                    <div className="inner-box">
                      <figure className="image">
                        <img src="/images/resource/team-3.jpg" alt="" />
                      </figure>
                      <ul className="social-links">
                        <li>
                          <a href="#">
                            <span className="fab fa-facebook"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="fab fa-linkedin-in"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="fab fa-twitter"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="fab fa-pinterest"></span>
                          </a>
                        </li>
                      </ul>
                      <div className="info-box">
                        <h4 className="name">
                          <a href="doctor-detail.html">Dr. Morila Wood</a>
                        </h4>
                        <span className="designation">
                          Senior Dr. at Delmont
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="team-block col-lg-3 col-md-6 col-sm-12 wow fadeInUp">
                    <div className="inner-box">
                      <figure className="image">
                        <img src="/images/resource/team-4.jpg" alt="" />
                      </figure>
                      <ul className="social-links">
                        <li>
                          <a href="#">
                            <span className="fab fa-facebook"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="fab fa-linkedin-in"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="fab fa-twitter"></span>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <span className="fab fa-pinterest"></span>
                          </a>
                        </li>
                      </ul>
                      <div className="info-box">
                        <h4 className="name">
                          <a href="doctor-detail.html">Dr. Morila Wood</a>
                        </h4>
                        <span className="designation">
                          Senior Dr. at Delmont
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sec-bottom-text">
                  Don’t hesitate, contact us for better help and services{" "}
                  <a href="#">Explore all Dr. Team</a>
                </div>
              </div>
            </section>

            <section className="appointment-section">
              <div
                className="image-layer"
                style={{ backgroundImage: `url('/images/background/2.jpg')` }}
              ></div>
              <div className="auto-container">
                <div className="row">
                  <div className="content-column col-lg-6 col-md-12 col-sm-12">
                    <div className="inner-column">
                      <span className="title">Need a Doctor for Check-up?</span>
                      <h2>
                        Just Make an Appointment <br />
                        and You’re Done!
                      </h2>
                      <div className="number">
                        Get Your Quote or Call:{" "}
                        <strong>(0080) 123-453-789</strong>
                      </div>
                      <a href="#" className="theme-btn btn-style-three">
                        <span className="btn-title">Get an Appointment</span>
                        <span></span> <span></span> <span></span> <span></span>{" "}
                        <span></span>
                      </a>
                    </div>
                  </div>
                  <div className="image-column col-lg-6 col-md-12 col-sm-12">
                    <figure className="image">
                      <img src="/images/resource/image-4.png" alt="" />
                    </figure>
                  </div>
                </div>

                <div className="fun-fact-section">
                  <div className="row">
                    <div
                      className="counter-column col-lg-3 col-md-6 col-sm-12 wow fadeInUp"
                      style={{ visibility: "hidden", animationName: "none" }}
                    >
                      <div className="count-box">
                        <div className="icon-box">
                          <span className="icon flaticon-user-experience"></span>
                        </div>
                        <h4 className="counter-title">Years of Experience</h4>
                        <span
                          className="count-text"
                          data-speed="3000"
                          data-stop="25"
                        >
                          0
                        </span>
                      </div>
                    </div>

                    <div
                      className="counter-column col-lg-3 col-md-6 col-sm-12 wow fadeInUp"
                      data-wow-delay="400ms"
                      style={{
                        visibility: "hidden",
                        animationDelay: "400ms",
                        animationName: "none",
                      }}
                    >
                      <div className="count-box">
                        <div className="icon-box">
                          <span className="icon flaticon-team"></span>
                        </div>
                        <h4 className="counter-title">Medical Specialties</h4>
                        <span
                          className="count-text"
                          data-speed="3000"
                          data-stop="470"
                        >
                          0
                        </span>
                      </div>
                    </div>

                    <div
                      className="counter-column col-lg-3 col-md-6 col-sm-12 wow fadeInUp"
                      data-wow-delay="800ms"
                      style={{
                        visibility: "hidden",
                        animationDelay: "800ms",
                        animationName: "none",
                      }}
                    >
                      <div className="count-box">
                        <div className="icon-box">
                          <span className="icon flaticon-hospital"></span>
                        </div>
                        <h4 className="counter-title">Medical Specialties</h4>
                        <span
                          className="count-text"
                          data-speed="3000"
                          data-stop="689"
                        >
                          0
                        </span>
                      </div>
                    </div>

                    <div
                      className="counter-column col-lg-3 col-md-6 col-sm-12 wow fadeInUp"
                      data-wow-delay="1200ms"
                      style={{
                        visibility: "hidden",
                        animationDelay: "1200ms",
                        animationName: "none",
                      }}
                    >
                      <div className="count-box">
                        <div className="icon-box">
                          <span className="icon flaticon-add-friend"></span>
                        </div>
                        <h4 className="counter-title">Happy Patients</h4>
                        <span
                          className="count-text"
                          data-speed="3000"
                          data-stop="9036"
                        >
                          0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
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
            <section className="pricing-section">
              <div className="auto-container">
                <div className="sec-title text-center">
                  <span className="sub-title">Our Pricing</span>
                  <h2>Pricing Plan</h2>
                  <span className="divider">
                    <svg viewBox="0 0 300.08 300.08">
                      <path d="m293.26 184.14h-82.877l-12.692-76.138c-.546-3.287-3.396-5.701-6.718-5.701-.034 0-.061 0-.089 0-3.369.027-6.199 2.523-6.677 5.845l-12.507 87.602-14.874-148.69c-.355-3.43-3.205-6.056-6.643-6.138-.048 0-.096 0-.143 0-3.39 0-6.274 2.489-6.752 5.852l-19.621 137.368h-9.405l-12.221-42.782c-.866-3.028-3.812-5.149-6.8-4.944-3.13.109-5.777 2.332-6.431 5.395l-8.941 42.332h-73.049c-3.771 0-6.82 3.049-6.82 6.82 0 3.778 3.049 6.82 6.82 6.82h78.566c3.219 0 6.002-2.251 6.67-5.408l4.406-20.856 6.09 21.313c.839 2.939 3.526 4.951 6.568 4.951h20.46c3.396 0 6.274-2.489 6.752-5.845l12.508-87.596 14.874 148.683c.355 3.437 3.205 6.056 6.643 6.138h.143c3.39 0 6.274-2.489 6.752-5.845l14.227-99.599 6.397 38.362c.546 3.287 3.396 5.702 6.725 5.702h88.66c3.771 0 6.82-3.049 6.82-6.82-.001-3.772-3.05-6.821-6.821-6.821z"></path>
                    </svg>
                  </span>
                </div>

                <div className="outer-box">
                  <div className="row">
                    <div className="pricing-block col-lg-3 col-md-6 col-sm-12">
                      <div className="inner-box">
                        <div className="price-box">
                          <h4 className="price">$299</h4>
                          <div className="validaty">Per Month</div>
                        </div>
                        <h3 className="title">Cardiology</h3>
                        <ul className="features">
                          <li>Functional Diagnotics</li>
                          <li>Allergens Drugs</li>
                          <li>Pollen Allergens</li>
                          <li>Food Allergens</li>
                        </ul>
                        <div className="btn-box">
                          <a href="#" className="theme-btn">
                            Get Offer
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="pricing-block col-lg-3 col-md-6 col-sm-12">
                      <div className="inner-box">
                        <div className="price-box">
                          <h4 className="price">$120</h4>
                          <div className="validaty">Per Month</div>
                        </div>
                        <h3 className="title">Detal Care</h3>
                        <ul className="features">
                          <li>Tooth implantation</li>
                          <li>Lase Dentistry</li>
                          <li>Tests and Treatment</li>
                          <li>Medical Consultation</li>
                        </ul>
                        <div className="btn-box">
                          <a href="#" className="theme-btn">
                            Get Offer
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="pricing-block col-lg-3 col-md-6 col-sm-12">
                      <div className="inner-box">
                        <div className="price-box">
                          <h4 className="price">$150</h4>
                          <div className="validaty">Per Month</div>
                        </div>
                        <h3 className="title">Body Checkup</h3>
                        <ul className="features">
                          <li>Tests and Treatment</li>
                          <li>Tests and Treatment</li>
                          <li>Laboratory Services</li>
                          <li>Food Allergens</li>
                        </ul>
                        <div className="btn-box">
                          <a href="#" className="theme-btn">
                            Get Offer
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="pricing-block col-lg-3 col-md-6 col-sm-12">
                      <div className="inner-box">
                        <div className="price-box">
                          <h4 className="price">$100</h4>
                          <div className="validaty">Per Month</div>
                        </div>
                        <h3 className="title">Blood Test</h3>
                        <ul className="features">
                          <li>Blood Test Service</li>
                          <li>Safety Training Tips</li>
                          <li>Tests and Treatment</li>
                          <li>Food Allergens</li>
                        </ul>
                        <div className="btn-box">
                          <a href="#" className="theme-btn">
                            Get Offer
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sec-bottom-text">
                  Don’t hesitate, contact us for better help and services{" "}
                  <a href="#">Explore all Dr. Team</a>
                </div>
              </div>
            </section>
            <section className="news-section">
              <div className="auto-container">
                <div className="sec-title text-center">
                  <span className="title">OUR BLOG</span>
                  <h2>Recent Articles and News</h2>
                  <span className="divider">
                    <svg viewBox="0 0 300.08 300.08">
                      <path d="m293.26 184.14h-82.877l-12.692-76.138c-.546-3.287-3.396-5.701-6.718-5.701-.034 0-.061 0-.089 0-3.369.027-6.199 2.523-6.677 5.845l-12.507 87.602-14.874-148.69c-.355-3.43-3.205-6.056-6.643-6.138-.048 0-.096 0-.143 0-3.39 0-6.274 2.489-6.752 5.852l-19.621 137.368h-9.405l-12.221-42.782c-.866-3.028-3.812-5.149-6.8-4.944-3.13.109-5.777 2.332-6.431 5.395l-8.941 42.332h-73.049c-3.771 0-6.82 3.049-6.82 6.82 0 3.778 3.049 6.82 6.82 6.82h78.566c3.219 0 6.002-2.251 6.67-5.408l4.406-20.856 6.09 21.313c.839 2.939 3.526 4.951 6.568 4.951h20.46c3.396 0 6.274-2.489 6.752-5.845l12.508-87.596 14.874 148.683c.355 3.437 3.205 6.056 6.643 6.138h.143c3.39 0 6.274-2.489 6.752-5.845l14.227-99.599 6.397 38.362c.546 3.287 3.396 5.702 6.725 5.702h88.66c3.771 0 6.82-3.049 6.82-6.82-.001-3.772-3.05-6.821-6.821-6.821z"></path>
                    </svg>
                  </span>
                </div>

                <div className="row">
                  <div
                    className="news-block col-lg-4 col-md-6 col-sm-12 wow fadeInUp"
                    style={{ visibility: "hidden", animationName: "none" }}
                  >
                    <div className="inner-box">
                      <div className="image-box">
                        <figure className="image">
                          <a href="blog-post-image.html">
                            <img src="/images/resource/news-1.jpg" alt="" />
                          </a>
                        </figure>
                        <a href="#" className="date">
                          Sep 19, 2020
                        </a>
                      </div>
                      <div className="lower-content">
                        <h4>
                          <a href="blog-post-image.html">
                            What is The Success rate
                            <br /> of a root canel?
                          </a>
                        </h4>
                        <div className="text">
                          Nullam mauris vitae tortor sodales efficitur. Quisque
                          orci ante. Proin amet turpis
                        </div>
                        <div className="post-info">
                          <div className="post-author">By Admin Rose</div>
                          <ul className="post-option">
                            <li>
                              <a href="#">
                                0 <i className="far fa-heart"></i>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                0 <i className="far fa-comments"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="news-block col-lg-4 col-md-6 col-sm-12 wow fadeInUp"
                    style={{ visibility: "hidden", animationName: "none" }}
                  >
                    <div className="inner-box">
                      <div className="image-box">
                        <figure className="image">
                          <a href="blog-post-image.html">
                            <img src="/images/resource/news-2.jpg" alt="" />
                          </a>
                        </figure>
                        <a href="#" className="date">
                          Sep 19, 2020
                        </a>
                      </div>
                      <div className="lower-content">
                        <h4>
                          <a href="blog-post-image.html">
                            How to handle your kids’ <br />
                            mystery ailments?
                          </a>
                        </h4>
                        <div className="text">
                          Nullam mauris vitae tortor sodales efficitur. Quisque
                          orci ante. Proin amet turpis
                        </div>
                        <div className="post-info">
                          <div className="post-author">By Admin Rose</div>
                          <ul className="post-option">
                            <li>
                              <a href="#">
                                0 <i className="far fa-heart"></i>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                0 <i className="far fa-comments"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="news-block col-lg-4 col-md-6 col-sm-12 wow fadeInUp"
                    style={{ visibility: "hidden", animationName: "none" }}
                  >
                    <div className="inner-box">
                      <div className="image-box">
                        <figure className="image">
                          <a href="blog-post-image.html">
                            <img src="/images/resource/news-3.jpg" alt="" />
                          </a>
                        </figure>
                        <a href="#" className="date">
                          Sep 19, 2020
                        </a>
                      </div>
                      <div className="lower-content">
                        <h4>
                          <a href="blog-post-image.html">
                            How to help the cardiology <br />
                            department
                          </a>
                        </h4>
                        <div className="text">
                          Nullam mauris vitae tortor sodales efficitur. Quisque
                          orci ante. Proin amet turpis
                        </div>
                        <div className="post-info">
                          <div className="post-author">By Admin Rose</div>
                          <ul className="post-option">
                            <li>
                              <a href="#">
                                0 <i className="far fa-heart"></i>
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                0 <i className="far fa-comments"></i>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="clients-section">
              <div className="auto-container">
                <div className="sponsors-outer">
                  <ul className="clients-carousel owl-carousel owl-theme owl-loaded owl-drag">
                    <div className="owl-stage-outer">
                      <div
                        className="owl-stage"
                        style={{
                          transform: "translate3d(-1200px, 0px, 0px)",
                          transition: "0.4s",
                          width: "3600px",
                        }}
                      >
                        <div
                          className="owl-item cloned"
                          style={{ width: "210px", marginRight: "30px" }}
                        >
                          <li className="slide-item">
                            {" "}
                            <a href="#">
                              <img src="/images/clients/1.png" alt="" />
                            </a>{" "}
                          </li>
                        </div>
                        <div
                          className="owl-item cloned"
                          style={{ width: "210px", marginRight: "30px" }}
                        >
                          <li className="slide-item">
                            {" "}
                            <a href="#">
                              <img src="/images/clients/2.png" alt="" />
                            </a>{" "}
                          </li>
                        </div>
                        <div
                          className="owl-item cloned"
                          style={{ width: "210px", marginRight: "30px" }}
                        >
                          <li className="slide-item">
                            {" "}
                            <a href="#">
                              <img src="/images/clients/3.png" alt="" />
                            </a>{" "}
                          </li>
                        </div>
                        <div
                          className="owl-item cloned"
                          style={{ width: "210px", marginRight: "30px" }}
                        >
                          <li className="slide-item">
                            {" "}
                            <a href="#">
                              <img src="/images/clients/4.png" alt="" />
                            </a>{" "}
                          </li>
                        </div>
                        <div
                          className="owl-item cloned"
                          style={{ width: "210px", marginRight: "30px" }}
                        >
                          <li className="slide-item">
                            {" "}
                            <a href="#">
                              <img src="/images/clients/5.png" alt="" />
                            </a>{" "}
                          </li>
                        </div>
                        <div
                          className="owl-item active"
                          style={{ width: "210px", marginRight: "30px" }}
                        >
                          <li className="slide-item">
                            {" "}
                            <a href="#">
                              <img src="/images/clients/1.png" alt="" />
                            </a>{" "}
                          </li>
                        </div>
                        <div
                          className="owl-item active"
                          style={{ width: "210px", marginRight: "30px" }}
                        >
                          <li className="slide-item">
                            {" "}
                            <a href="#">
                              <img src="/images/clients/2.png" alt="" />
                            </a>{" "}
                          </li>
                        </div>
                        <div
                          className="owl-item active"
                          style={{ width: "210px", marginRight: "30px" }}
                        >
                          <li className="slide-item">
                            {" "}
                            <a href="#">
                              <img src="/images/clients/3.png" alt="" />
                            </a>{" "}
                          </li>
                        </div>
                        <div
                          className="owl-item active"
                          style={{ width: "210px", marginRight: "30px" }}
                        >
                          <li className="slide-item">
                            {" "}
                            <a href="#">
                              <img src="/images/clients/4.png" alt="" />
                            </a>{" "}
                          </li>
                        </div>
                        <div
                          className="owl-item active"
                          style={{ width: "210px", marginRight: "30px" }}
                        >
                          <li className="slide-item">
                            {" "}
                            <a href="#">
                              <img src="/images/clients/5.png" alt="" />
                            </a>{" "}
                          </li>
                        </div>
                        <div
                          className="owl-item cloned"
                          style={{ width: "210px", marginRight: "30px" }}
                        >
                          <li className="slide-item">
                            {" "}
                            <a href="#">
                              <img src="/images/clients/1.png" alt="" />
                            </a>{" "}
                          </li>
                        </div>
                        <div
                          className="owl-item cloned"
                          style={{ width: "210px", marginRight: "30px" }}
                        >
                          <li className="slide-item">
                            {" "}
                            <a href="#">
                              <img src="/images/clients/2.png" alt="" />
                            </a>{" "}
                          </li>
                        </div>
                        <div
                          className="owl-item cloned"
                          style={{ width: "210px", marginRight: "30px" }}
                        >
                          <li className="slide-item">
                            {" "}
                            <a href="#">
                              <img src="/images/clients/3.png" alt="" />
                            </a>{" "}
                          </li>
                        </div>
                        <div
                          className="owl-item cloned"
                          style={{ width: "210px", marginRight: "30px" }}
                        >
                          <li className="slide-item">
                            {" "}
                            <a href="#">
                              <img src="/images/clients/4.png" alt="" />
                            </a>{" "}
                          </li>
                        </div>
                        <div
                          className="owl-item cloned"
                          style={{ width: "210px", marginRight: "30px" }}
                        >
                          <li className="slide-item">
                            {" "}
                            <a href="#">
                              <img src="/images/clients/5.png" alt="" />
                            </a>{" "}
                          </li>
                        </div>
                      </div>
                    </div>
                    <div className="owl-nav disabled">
                      <div className="owl-prev">
                        <span className="flaticon-left"></span>
                      </div>
                      <div className="owl-next">
                        <span className="flaticon-right"></span>
                      </div>
                    </div>
                    <div className="owl-dots disabled">
                      <div className="owl-dot active">
                        <span></span>
                      </div>
                    </div>
                  </ul>
                </div>
              </div>
            </section>

            <footer className="main-footer">
              <div
                className="widgets-section"
                style={{ backgroundImage: `url('/images/background/7.jpg')` }}
              >
                <div className="auto-container">
                  <div className="row">
                    <div className="big-column col-xl-6 col-lg-12 col-md-12 col-sm-12">
                      <div className="row">
                        <div className="footer-column col-xl-7 col-lg-6 col-md-6 col-sm-12">
                          <div className="footer-widget about-widget">
                            <div className="logo">
                              <a href="index.html">
                                <img src="/images/logo-2.png" alt="" />
                              </a>
                            </div>
                            <div className="text">
                              <p>
                                Our Clinic has grown to provide a world
                                className facility for the clinic advanced
                                restorative.{" "}
                              </p>
                              <p>
                                We are among the most qualified implant
                                providers in the AUS with over 30 years of
                                quality training and experience.
                              </p>
                            </div>
                            <ul className="social-icon-three">
                              <li>
                                <a href="#">
                                  <i className="fab fa-facebook-f"></i>
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="fab fa-pinterest"></i>
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="fab fa-twitter"></i>
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="fab fa-skype"></i>
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="fab fa-linkedin-in"></i>
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="footer-column col-xl-5 col-lg-6 col-md-6 col-sm-12">
                          <div className="footer-widget">
                            <h2 className="widget-title">Departments</h2>
                            <ul className="user-links">
                              <li>
                                <a href="#">Surgery &amp; Radiology</a>
                              </li>
                              <li>
                                <a href="#">Family Medicine</a>
                              </li>
                              <li>
                                <a href="#">Women’s Health</a>
                              </li>
                              <li>
                                <a href="#">Optician</a>
                              </li>
                              <li>
                                <a href="#">Pediatrics</a>
                              </li>
                              <li>
                                <a href="#">Dermatology</a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="big-column col-xl-6 col-lg-12 col-md-12 col-sm-12">
                      <div className="row">
                        <div className="footer-column col-lg-6 col-md-6 col-sm-12">
                          <div className="footer-widget recent-posts">
                            <h2 className="widget-title">Latest News</h2>

                            <div className="widget-content">
                              <div className="post">
                                <div className="thumb">
                                  <a href="blog-post-image.html">
                                    <img
                                      src="images/resource/post-thumb-1.jpg"
                                      alt=""
                                    />
                                  </a>
                                </div>
                                <h4>
                                  <a href="blog-post-image.html">
                                    Integrative Medicine <br />
                                    &amp; Cancer Treatment.
                                  </a>
                                </h4>
                                <span className="date">July 11, 2020</span>
                              </div>

                              <div className="post">
                                <div className="thumb">
                                  <a href="blog-post-image.html">
                                    <img
                                      src="images/resource/post-thumb-2.jpg"
                                      alt=""
                                    />
                                  </a>
                                </div>
                                <h4>
                                  <a href="blog-post-image.html">
                                    Achieving Better <br />
                                    Health Care Time.
                                  </a>
                                </h4>
                                <span className="date">August 1, 2020</span>
                              </div>

                              <div className="post">
                                <div className="thumb">
                                  <a href="blog-post-image.html">
                                    <img
                                      src="images/resource/post-thumb-3.jpg"
                                      alt=""
                                    />
                                  </a>
                                </div>
                                <h4>
                                  <a href="blog-post-image.html">
                                    Great Health Care <br />
                                    For Patients.
                                  </a>
                                </h4>
                                <span className="date">August 1, 2020</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="footer-column col-lg-6 col-md-6 col-sm-12">
                          <div className="footer-widget contact-widget">
                            <h2 className="widget-title">Contact Us</h2>
                            <div className="widget-content">
                              <ul className="contact-list">
                                <li>
                                  <span className="icon flaticon-placeholder"></span>
                                  <div className="text">
                                    2130 Fulton Street San Diego <br />
                                    CA 94117-1080 USA
                                  </div>
                                </li>

                                <li>
                                  <span className="icon flaticon-call-1"></span>
                                  <div className="text">
                                    Mon to Fri : 08:30 - 18:00
                                  </div>
                                  <a href="tel:+89868679575">
                                    <strong>+898 68679 575</strong>
                                  </a>
                                </li>

                                <li>
                                  <span className="icon flaticon-email"></span>
                                  <div className="text">
                                    Do you have a Question?
                                    <br />
                                    <a href="mailto:info@gmail.com">
                                      <strong>info@gmail.com</strong>
                                    </a>
                                  </div>
                                </li>

                                <li>
                                  <span className="icon flaticon-back-in-time"></span>
                                  <div className="text">
                                    Mon - Sat 8.00 - 18.00
                                    <br />
                                    <strong>Sunday CLOSED</strong>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="footer-bottom">
                <div
                  className="scroll-to-top scroll-to-target"
                  data-target="html"
                >
                  <span className="fa fa-angle-up"></span>
                </div>

                <div className="auto-container">
                  <div className="inner-container clearfix">
                    <div className="footer-nav">
                      <ul className="clearfix">
                        <li>
                          <a href="index.html">Privacy Policy</a>
                        </li>
                        <li>
                          <a href="about-us.html">Contact</a>
                        </li>
                        <li>
                          <a href="services.html">Supplier</a>
                        </li>
                      </ul>
                    </div>

                    <div className="copyright-text">
                      <p>
                        Copyright © 2020 <a href="#">Bold Touch</a>All Rights
                        Reserved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
          <div className="color-palate">
            <div className="inner-palate">
              <div className="color-trigger">
                <i className="fa fa-cog"></i>
              </div>
              <div className="color-palate-head">
                <h5>GET AN AWESOME START!</h5>
              </div>
              <div className="demos-box">
                <h6>Choose your demo</h6>
                <ul className="single-item-carousel owl-carousel owl-theme demos-list owl-loaded owl-drag">
                  <div
                    className="owl-stage-outer owl-height"
                    style={{ height: "159px" }}
                  >
                    <div
                      className="owl-stage"
                      style={{
                        transform: "translate3d(-870px, 0px, 0px)",
                        transition: "0.5s",
                        width: "3190px",
                      }}
                    >
                      <div
                        className="owl-item cloned"
                        style={{ width: "260px", marginRight: "30px" }}
                      >
                        <li data-text="Home Dental Care">
                          <a href="index-3.html">
                            <img src="/images/background/demos/3.png" alt="" />
                          </a>
                        </li>
                      </div>
                      <div
                        className="owl-item cloned"
                        style={{ width: "260px", marginRight: "30px" }}
                      >
                        <li data-text="Home Eye Care">
                          <a href="index-4.html">
                            <img src="/images/background/demos/4.png" alt="" />
                          </a>
                        </li>
                      </div>
                      <div
                        className="owl-item cloned"
                        style={{ width: "260px", marginRight: "30px" }}
                      >
                        <li data-text="Home Prenatal care">
                          <a href="index-5.html">
                            <img src="/images/background/demos/5.png" alt="" />
                          </a>
                        </li>
                      </div>
                      <div
                        className="owl-item active"
                        style={{ width: "260px", marginRight: "30px" }}
                      >
                        <li data-text="Home Medical">
                          <a href="index.html">
                            <img src="/images/background/demos/1.png" alt="" />
                          </a>
                        </li>
                      </div>
                      <div
                        className="owl-item"
                        style={{ width: "260px", marginRight: "30px" }}
                      >
                        <li data-text="Home Clanic">
                          <a href="index-2.html">
                            <img src="/images/background/demos/2.png" alt="" />
                          </a>
                        </li>
                      </div>
                      <div
                        className="owl-item"
                        style={{ width: "260px", marginRight: "30px" }}
                      >
                        <li data-text="Home Dental Care">
                          <a href="index-3.html">
                            <img src="/images/background/demos/3.png" alt="" />
                          </a>
                        </li>
                      </div>
                      <div
                        className="owl-item"
                        style={{ width: "260px", marginRight: "30px" }}
                      >
                        <li data-text="Home Eye Care">
                          <a href="index-4.html">
                            <img src="/images/background/demos/4.png" alt="" />
                          </a>
                        </li>
                      </div>
                      <div
                        className="owl-item"
                        style={{ width: "260px", marginRight: "30px" }}
                      >
                        <li data-text="Home Prenatal care">
                          <a href="index-5.html">
                            <img src="/images/background/demos/5.png" alt="" />
                          </a>
                        </li>
                      </div>
                      <div
                        className="owl-item cloned"
                        style={{ width: "260px", marginRight: "30px" }}
                      >
                        <li data-text="Home Medical">
                          <a href="index.html">
                            <img src="/images/background/demos/1.png" alt="" />
                          </a>
                        </li>
                      </div>
                      <div
                        className="owl-item cloned"
                        style={{ width: "260px", marginRight: "30px" }}
                      >
                        <li data-text="Home Clanic">
                          <a href="index-2.html">
                            <img src="/images/background/demos/2.png" alt="" />
                          </a>
                        </li>
                      </div>
                      <div
                        className="owl-item cloned"
                        style={{ width: "260px", marginRight: "30px" }}
                      >
                        <li data-text="Home Dental Care">
                          <a href="index-3.html">
                            <img src="/images/background/demos/3.png" alt="" />
                          </a>
                        </li>
                      </div>
                    </div>
                  </div>
                  <div className="owl-nav">
                    <div className="owl-prev">
                      <span className="flaticon-left"></span>
                    </div>
                    <div className="owl-next">
                      <span className="flaticon-right"></span>
                    </div>
                  </div>
                  <div className="owl-dots">
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
                    <div className="owl-dot">
                      <span></span>
                    </div>
                  </div>
                </ul>
              </div>
              <div className="various-color clearfix">
                <div className="colors-list">
                  <h6>Choose Your Color</h6>
                  <span
                    className="palate default-color active"
                    data-theme-file="css/color-themes/default-theme.css"
                  ></span>
                  <span
                    className="palate tealblue-color"
                    data-theme-file="css/color-themes/tealblue.css"
                  ></span>
                  <span
                    className="palate scarlet-color"
                    data-theme-file="css/color-themes/scarlet.css"
                  ></span>
                  <span
                    className="palate kellygreen-color"
                    data-theme-file="css/color-themes/kellygreen.css"
                  ></span>
                  <span
                    className="palate dodgerblue-color"
                    data-theme-file="css/color-themes/dodgerblue.css"
                  ></span>
                  <span
                    className="palate red-color"
                    data-theme-file="css/color-themes/red.css"
                  ></span>
                  <span
                    className="palate selectiveyellow-color"
                    data-theme-file="css/color-themes/selectiveyellow.css"
                  ></span>
                  <span
                    className="palate maroon-color"
                    data-theme-file="css/color-themes/maroon.css"
                  ></span>
                  <span
                    className="palate brown-color"
                    data-theme-file="css/color-themes/brown.css"
                  ></span>
                  <span
                    className="palate green-color"
                    data-theme-file="css/color-themes/green.css"
                  ></span>
                  <span
                    className="palate duchessblue-color"
                    data-theme-file="css/color-themes/duchessblue.css"
                  ></span>
                  <span
                    className="palate lightblue-color"
                    data-theme-file="css/color-themes/lightblue.css"
                  ></span>
                  <span
                    className="palate frenchgray-color"
                    data-theme-file="css/color-themes/frenchgray.css"
                  ></span>
                  <span
                    className="palate telemagenta-color"
                    data-theme-file="css/color-themes/telemagenta.css"
                  ></span>
                  <span
                    className="palate signalviolet-color"
                    data-theme-file="css/color-themes/signalviolet.css"
                  ></span>
                </div>
              </div>
              <div className="lower-options">
                <h6>RTL Supported</h6>
                <ul className="rtl-version option-box">
                  {" "}
                  <li className="active">LTR</li> <li className="rtl">RTL</li>{" "}
                </ul>
                <h6>Box &amp; Wide layout</h6>
                <ul className="box-version option-box">
                  {" "}
                  <li className="active">Wide</li>{" "}
                  <li className="box">Boxed</li>{" "}
                </ul>
                <div className="box-mode-bg">
                  <h6>Boxed Mode Backgrounds</h6>
                  <ul className="clearfix">
                    <li
                      className="active"
                      style={{
                        backgroundImage: `url('/images/background/boxed-bg/1.png')`,
                      }}
                    ></li>
                    <li
                      style={{
                        backgroundImage: `url('/images/background/boxed-bg/2.png')`,
                      }}
                    ></li>
                    <li
                      style={{
                        backgroundImage: `url('/images/background/boxed-bg/3.png')`,
                      }}
                    ></li>
                    <li
                      style={{
                        backgroundImage: `url('/images/background/boxed-bg/4.png')`,
                      }}
                    ></li>{" "}
                    <li
                      style={{
                        backgroundImage: `url('/images/background/boxed-bg/5.png')`,
                      }}
                    ></li>{" "}
                    <li
                      style={{
                        backgroundImage: `url('/images/background/boxed-bg/6.png')`,
                      }}
                    ></li>{" "}
                    <li
                      style={{
                        backgroundImage: `url('/images/background/boxed-bg/7.png')`,
                      }}
                    ></li>{" "}
                    <li
                      style={{
                        backgroundImage: `url('/images/background/boxed-bg/8.png')`,
                      }}
                    ></li>
                  </ul>
                </div>
                <div className="palate-foo">
                  <span>
                    You will find much more options for colors and styling in
                    admin panel. This color picker is used only for demonstation
                    purposes.
                  </span>
                </div>
                <a
                  href="https://themeforest.net/item/medicoz-clinic-hospital-html-template/28397578?ref=bold_touch"
                  className="purchase-btn"
                >
                  Purchase now $12
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {check2FA && !checkVerify2FA && <Require2FA />}
    </>
  );
}

export default Home;
