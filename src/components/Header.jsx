import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDarkMode } from "../hooks/useDarkMode";
import { useLanguage } from "../context/LanguageContext";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { Globe } from "lucide-react";

function Header() {
  const [userInfo, setUserInfo] = useState(null);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const countCart = useSelector((state) => state.cartUi.countCart);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { language, changeLanguage, t } = useLanguage();
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
                      <Link to="/home">{t("nav.home")}</Link>
                    </li>
                    <li>
                      <Link to="/shop">{t("nav.shop")}</Link>
                    </li>
                    <li>
                      <Link to="/blog">{t("nav.blog")}</Link>
                    </li>
                    <li>
                      <Link to="/contact">{t("nav.contact")}</Link>
                    </li>
                    {userInfo ? (
                      <li>
                        <Link to="/account/profile">My Account</Link>
                      </li>
                    ) : (
                      <li>
                        <Link to="/login">{t("nav.login")}</Link>
                      </li>
                    )}
                  </ul>
                </nav>

                <div className="outer-box">
                  <div
                    className="lang-switcher-wrap"
                    onMouseEnter={() => setShowLangMenu(true)}
                    onMouseLeave={() => setShowLangMenu(false)}
                  >
                    <button
                      type="button"
                      className="lang-toggle"
                      title={language === "vi" ? "Tiếng Việt" : "English"}
                    >
                      <Globe size={22} />
                      <span>{language === "vi" ? "VI" : "EN"}</span>
                    </button>
                    {showLangMenu && (
                      <div className="lang-menu">
                        <button
                          type="button"
                          onClick={() => changeLanguage("vi")}
                          className={language === "vi" ? "active" : ""}
                        >
                          Tiếng Việt
                        </button>
                        <button
                          type="button"
                          onClick={() => changeLanguage("en")}
                          className={language === "en" ? "active" : ""}
                        >
                          English
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="dark-mode-toggle"
                    onClick={toggleDarkMode}
                    title={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
                    aria-label={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
                  >
                    {isDarkMode ? (
                      <HiOutlineSun size={24} />
                    ) : (
                      <HiOutlineMoon size={24} />
                    )}
                  </button>
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
                    <Link to="/home">{t("nav.home")}</Link>
                  </li>
                  <li>
                    <Link to="/blog">{t("nav.blog")}</Link>
                  </li>
                  <li>
                    <Link to="/shop">{t("nav.shop")}</Link>
                  </li>
                  <li>
                    <Link to="/contact">{t("nav.contact")}</Link>
                  </li>
                  {userInfo ? (
                    <li>
                      <Link to="/account/profile">My Account</Link>
                    </li>
                  ) : (
                    <li>
                      <Link to="/login">{t("nav.login")}</Link>
                    </li>
                  )}
                </ul>
              </nav>

              {/* Header Icons */}
              <div className="outer-box">
                <div
                  className="lang-switcher-wrap"
                  onMouseEnter={() => setShowLangMenu(true)}
                  onMouseLeave={() => setShowLangMenu(false)}
                >
                  <button
                    type="button"
                    className="lang-toggle"
                    title={language === "vi" ? "Tiếng Việt" : "English"}
                  >
                    <Globe size={22} />
                    <span>{language === "vi" ? "VI" : "EN"}</span>
                  </button>
                  {showLangMenu && (
                    <div className="lang-menu">
                      <button
                        type="button"
                        onClick={() => changeLanguage("vi")}
                        className={language === "vi" ? "active" : ""}
                      >
                        Tiếng Việt
                      </button>
                      <button
                        type="button"
                        onClick={() => changeLanguage("en")}
                        className={language === "en" ? "active" : ""}
                      >
                        English
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="dark-mode-toggle"
                  onClick={toggleDarkMode}
                  title={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
                >
                  {isDarkMode ? (
                    <HiOutlineSun size={24} />
                  ) : (
                    <HiOutlineMoon size={24} />
                  )}
                </button>
                <button className="cart-btn">
                  <i className="icon flaticon-shopping-cart"></i>
                  <span className="count">{countCart ?? 0}</span>
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
              <button
                type="button"
                className="lang-toggle lang-toggle-mobile"
                onClick={() => changeLanguage(language === "vi" ? "en" : "vi")}
                title={language === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
              >
                <Globe size={20} />
                <span>{language === "vi" ? "EN" : "VI"}</span>
              </button>
              <button
                type="button"
                className="dark-mode-toggle"
                onClick={toggleDarkMode}
                title={isDarkMode ? "Chế độ sáng" : "Chế độ tối"}
              >
                {isDarkMode ? (
                  <HiOutlineSun size={22} />
                ) : (
                  <HiOutlineMoon size={22} />
                )}
              </button>
              <div className="search-box">
                <button className="search-btn mobile-search-btn">
                  <i className="flaticon-magnifying-glass"></i>
                </button>
              </div>
              <button className="cart-btn">
                <i className="icon flaticon-shopping-cart"></i>
                <span className="count">{countCart ?? 0}</span>
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
