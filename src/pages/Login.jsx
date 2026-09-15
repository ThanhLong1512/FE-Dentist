import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Award,
  CalendarCheck,
} from "lucide-react";

import { API_ROOT, FACEBOOK_APP_ID } from "./../utils/constants";
import { handleLogin, handleRegister } from "../apis";
import { useLanguage } from "../context/LanguageContext";
import { useDarkMode } from "../hooks/useDarkMode";
import { saveAuthSession } from "../utils/authStorage";

function Login({ defaultTab = "login" }) {
  const { t, language } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine active tab: query param (?mode=register) or prop defaultTab
  const initialMode = searchParams.get("mode") || defaultTab;
  const [activeTab, setActiveTab] = useState(
    initialMode === "register" ? "register" : "login"
  );

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register" || mode === "login") {
      setActiveTab(mode);
    }
  }, [searchParams]);

  const handleSwitchTab = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ mode: tabKey });
    setLoginError("");
    setRegisterError("");
  };

  // Password visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  // Loading states
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Error alerts
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  // React Hook Form instances
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
  } = useForm();

  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: errorsSignup },
  } = useForm();

  // Social Login: Google
  const handleSuccessGoogle = async (credentialResponse) => {
    try {
      const credential = credentialResponse?.credential;
      if (!credential) {
        toast.error(t("login.googleFail"));
        return;
      }
      const res = await axios.post(
        `${API_ROOT}/api/v1/users/loginGoogle`,
        { token: credential, credential },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data) {
        saveAuthSession(res.data);
        res.data.role === "user"
          ? navigate("/home")
          : navigate("/admin/dashboard");
      } else {
        toast.error(t("login.googleFail"));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("login.googleFail")
      );
    }
  };

  // Social Login: Facebook
  const handleResponseFacebook = async (response) => {
    try {
      const res = await axios.post(
        `${API_ROOT}/api/v1/users/loginFacebook`,
        {
          accessToken: response.accessToken,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data) {
        saveAuthSession(res.data);
        res.data.role === "user"
          ? navigate("/home")
          : navigate("/admin/dashboard");
      } else {
        toast.error(t("login.facebookFail"));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login with Facebook failed. Please try again."
      );
    }
  };

  // Submit Login
  const submitLogIn = async (payLoad) => {
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const res = await handleLogin(payLoad);
      saveAuthSession(res.data);
      res.data.role === "user"
        ? navigate("/home")
        : navigate("/admin/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        t("login.loginFail");
      setLoginError(message);
      toast.error(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Submit Register
  const submitRegister = async (payLoad) => {
    setRegisterError("");
    setIsRegistering(true);
    const apiPayload = {
      name: payLoad.name,
      email: payLoad.email,
      password: payLoad.password,
      passwordConfirm: payLoad.passwordConfirm,
    };
    try {
      const res = await handleRegister(apiPayload);
      saveAuthSession(res);
      toast.success(t("toast.registerSuccess"));
      (res?.role || "user") === "admin"
        ? navigate("/admin/dashboard")
        : navigate("/home");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        t("toast.registerFail");
      setRegisterError(message);
      toast.error(message);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <section className={`modern-auth-section ${isDarkMode ? "dark-mode is-dark" : "light-mode is-light"}`}>
        <div className="auth-ambient-glow auth-glow-1" />
        <div className="auth-ambient-glow auth-glow-2" />

        <div className="modern-auth-container">
          <div className="modern-auth-grid">
            
            {/* ================= CỘT TRÁI: CLINIC SHOWCASE ================= */}
            <div className="auth-showcase-panel">
              <div>
                <div className="showcase-badge">
                  <Sparkles size={16} />
                  <span>Hệ Thống Nha Khoa Kỹ Thuật Cao</span>
                </div>

                <div className="showcase-brand">
                  <div className="showcase-brand-icon">🦷</div>
                  <div className="showcase-brand-text">
                    <h2>DENTIST PRO</h2>
                    <p>Trung Tâm Nha Khoa Thẩm Mỹ Quốc Tế</p>
                  </div>
                </div>

                <h1 className="showcase-title">
                  Chăm sóc nụ cười toàn diện, kiến tạo tương lai tự tin
                </h1>

                <p className="showcase-desc">
                  Trải nghiệm điều trị nha khoa kỹ thuật cao với quy trình không đau,
                  hệ thống phòng vô trùng chuẩn Châu Âu và dịch vụ tận tâm 24/7.
                </p>

                <div className="showcase-features">
                  <div className="showcase-feature-item">
                    <div className="feature-icon-box">
                      <Award size={20} />
                    </div>
                    <div className="feature-content">
                      <h4>Bác sĩ chuyên khoa đầu ngành</h4>
                      <p>100% bác sĩ tốt nghiệp Đại học Y Dược, tu nghiệp quốc tế.</p>
                    </div>
                  </div>

                  <div className="showcase-feature-item">
                    <div className="feature-icon-box">
                      <CalendarCheck size={20} />
                    </div>
                    <div className="feature-content">
                      <h4>Đặt lịch 24/7 & Giữ chỗ tức thì</h4>
                      <p>Chủ động chọn bác sĩ, khung giờ và nhắc hẹn tự động qua SMS.</p>
                    </div>
                  </div>

                  <div className="showcase-feature-item">
                    <div className="feature-icon-box">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="feature-content">
                      <h4>Hồ sơ số hóa & Bảo mật 100%</h4>
                      <p>Minh bạch chi phí, theo dõi phác đồ và bảo hành điện tử.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="showcase-social-proof">
                <div className="social-proof-avatars">
                  <img src="/images/resource/avatar-1.jpg" alt="Patient 1" />
                  <img src="/images/resource/avatar-2.jpg" alt="Patient 2" />
                  <div className="avatar-more">+15k</div>
                </div>
                <div className="social-proof-text">
                  <div className="stars">★★★★★</div>
                  <span>Hơn 15,000+ bệnh nhân đã tin chọn dịch vụ</span>
                </div>
              </div>
            </div>

            {/* ================= CỘT PHẢI: INTERACTIVE AUTH CARD ================= */}
            <div className="auth-card-panel">
              <div className="modern-auth-card">
                
                {/* TAB SWITCHER */}
                <div className="auth-tab-nav" role="tablist">
                  <button
                    type="button"
                    className={`auth-tab-btn ${activeTab === "login" ? "active" : ""}`}
                    onClick={() => handleSwitchTab("login")}
                    role="tab"
                    aria-selected={activeTab === "login"}
                  >
                    <Lock size={16} />
                    <span>{t("login.title")}</span>
                  </button>
                  <button
                    type="button"
                    className={`auth-tab-btn ${activeTab === "register" ? "active" : ""}`}
                    onClick={() => handleSwitchTab("register")}
                    role="tab"
                    aria-selected={activeTab === "register"}
                  >
                    <User size={16} />
                    <span>{t("register.title")}</span>
                  </button>
                </div>

                {/* TAB CONTENT: LOGIN */}
                {activeTab === "login" && (
                  <div className="auth-form-body animate-fade-in">
                    <div className="auth-header-text">
                      <h3>{t("login.title")}</h3>
                      <p>{t("login.subtitle")}</p>
                    </div>

                    {loginError && (
                      <div className="modern-auth-alert error">
                        <span>{loginError}</span>
                        <button type="button" onClick={() => setLoginError("")}>✕</button>
                      </div>
                    )}

                    <form onSubmit={handleSubmitLogin(submitLogIn)} noValidate>
                      <div className="modern-form-group">
                        <label htmlFor="login-email">{t("login.email")}</label>
                        <div className={`modern-input-group ${errorsLogin.email ? "has-error" : ""}`}>
                          <input
                            id="login-email"
                            type="email"
                            className="modern-input-control with-prefix-icon"
                            placeholder={t("login.emailPlaceholder")}
                            autoComplete="email"
                            {...registerLogin("email", { required: t("login.emailRequired") })}
                          />
                          <span className="input-prefix-icon"><Mail size={18} /></span>
                        </div>
                        {errorsLogin.email && (
                          <span className="modern-field-error">{errorsLogin.email.message}</span>
                        )}
                      </div>

                      <div className="modern-form-group">
                        <label htmlFor="login-password">{t("login.password")}</label>
                        <div className={`modern-input-group ${errorsLogin.password ? "has-error" : ""}`}>
                          <input
                            id="login-password"
                            type={showLoginPassword ? "text" : "password"}
                            className="modern-input-control with-prefix-icon with-suffix-btn"
                            placeholder={t("login.passwordPlaceholder")}
                            autoComplete="current-password"
                            {...registerLogin("password", { required: t("login.passwordRequired") })}
                          />
                          <span className="input-prefix-icon"><Lock size={18} /></span>
                          <button
                            type="button"
                            className="input-suffix-btn"
                            onClick={() => setShowLoginPassword((prev) => !prev)}
                            tabIndex={-1}
                            title={showLoginPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                          >
                            {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errorsLogin.password && (
                          <span className="modern-field-error">{errorsLogin.password.message}</span>
                        )}
                      </div>

                      <div className="modern-form-meta">
                        <label className="remember-checkbox-label">
                          <input type="checkbox" {...registerLogin("remember")} />
                          <span>{t("login.remember")}</span>
                        </label>
                        <Link to="/forgot-password" className="forgot-password-link">
                          {t("login.forgotPassword")}
                        </Link>
                      </div>

                      <button
                        type="submit"
                        className="modern-submit-btn"
                        disabled={isLoggingIn}
                      >
                        {isLoggingIn ? (
                          <span className="btn-loading">
                            <span className="spinner-border" />
                            <span>Đang đăng nhập...</span>
                          </span>
                        ) : (
                          <>
                            <span>{t("login.submit")}</span>
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                    </form>

                    {/* SOCIAL LOGIN */}
                    <div className="modern-auth-divider">
                      <span>{t("login.orContinue")}</span>
                    </div>

                    <div className="modern-social-group">
                      <div className="google-btn-container">
                        <GoogleLogin
                          onSuccess={handleSuccessGoogle}
                          onError={() => toast.error(t("login.googleFail"))}
                          useOneTap={false}
                          theme={isDarkMode ? "filled_black" : "outline"}
                          size="large"
                          text="signin_with"
                          width="100%"
                          locale={language === "vi" ? "vi" : "en"}
                        />
                      </div>

                      <FacebookLogin
                        appId={FACEBOOK_APP_ID}
                        autoLoad={false}
                        fields="name,email,picture"
                        onSuccess={handleResponseFacebook}
                        onFail={(error) =>
                          toast.error(error?.message || t("login.facebookFail"))
                        }
                        render={({ onClick }) => (
                          <button
                            type="button"
                            onClick={onClick}
                            className="modern-facebook-btn"
                          >
                            <svg
                              className="fb-svg-icon"
                              viewBox="0 0 24 24"
                              width="20"
                              height="20"
                              fill="currentColor"
                            >
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span>{t("login.facebook")}</span>
                          </button>
                        )}
                      />
                    </div>

                    <div className="auth-footer-switch">
                      <span>Chưa có tài khoản?</span>
                      <button
                        type="button"
                        onClick={() => handleSwitchTab("register")}
                        className="switch-link-btn"
                      >
                        Đăng ký tài khoản ngay
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: REGISTER */}
                {activeTab === "register" && (
                  <div className="auth-form-body animate-fade-in">
                    <div className="auth-header-text">
                      <h3>{t("register.title")}</h3>
                      <p>{t("register.subtitle")}</p>
                    </div>

                    {registerError && (
                      <div className="modern-auth-alert error">
                        <span>{registerError}</span>
                        <button type="button" onClick={() => setRegisterError("")}>✕</button>
                      </div>
                    )}

                    <form onSubmit={handleSubmitSignup(submitRegister)} noValidate>
                      <div className="modern-form-group">
                        <label htmlFor="register-name">{t("register.name")}</label>
                        <div className={`modern-input-group ${errorsSignup.name ? "has-error" : ""}`}>
                          <input
                            id="register-name"
                            type="text"
                            className="modern-input-control with-prefix-icon"
                            placeholder={t("register.namePlaceholder")}
                            autoComplete="name"
                            {...registerSignup("name", {
                              required: t("register.nameRequired"),
                              minLength: {
                                value: 2,
                                message: t("register.nameMinLength"),
                              },
                            })}
                          />
                          <span className="input-prefix-icon"><User size={18} /></span>
                        </div>
                        {errorsSignup.name && (
                          <span className="modern-field-error">{errorsSignup.name.message}</span>
                        )}
                      </div>

                      <div className="modern-form-group">
                        <label htmlFor="register-email">{t("register.email")}</label>
                        <div className={`modern-input-group ${errorsSignup.email ? "has-error" : ""}`}>
                          <input
                            id="register-email"
                            type="email"
                            className="modern-input-control with-prefix-icon"
                            placeholder={t("register.emailPlaceholder")}
                            autoComplete="email"
                            {...registerSignup("email", {
                              required: t("register.emailRequired"),
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: t("register.emailInvalid"),
                              },
                            })}
                          />
                          <span className="input-prefix-icon"><Mail size={18} /></span>
                        </div>
                        {errorsSignup.email && (
                          <span className="modern-field-error">{errorsSignup.email.message}</span>
                        )}
                      </div>

                      <div className="modern-form-group">
                        <label htmlFor="register-password">{t("register.password")}</label>
                        <div className={`modern-input-group ${errorsSignup.password ? "has-error" : ""}`}>
                          <input
                            id="register-password"
                            type={showRegisterPassword ? "text" : "password"}
                            className="modern-input-control with-prefix-icon with-suffix-btn"
                            placeholder={t("register.passwordPlaceholder")}
                            autoComplete="new-password"
                            {...registerSignup("password", {
                              required: t("register.passwordRequired"),
                              minLength: {
                                value: 6,
                                message: "Mật khẩu phải có ít nhất 6 ký tự",
                              },
                            })}
                          />
                          <span className="input-prefix-icon"><Lock size={18} /></span>
                          <button
                            type="button"
                            className="input-suffix-btn"
                            onClick={() => setShowRegisterPassword((prev) => !prev)}
                            tabIndex={-1}
                            title={showRegisterPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                          >
                            {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errorsSignup.password && (
                          <span className="modern-field-error">{errorsSignup.password.message}</span>
                        )}
                      </div>

                      <div className="modern-form-group">
                        <label htmlFor="register-password-confirm">
                          {t("register.passwordConfirm")}
                        </label>
                        <div
                          className={`modern-input-group ${
                            errorsSignup.passwordConfirm ? "has-error" : ""
                          }`}
                        >
                          <input
                            id="register-password-confirm"
                            type={showRegisterConfirmPassword ? "text" : "password"}
                            className="modern-input-control with-prefix-icon with-suffix-btn"
                            placeholder={t("register.passwordConfirmPlaceholder")}
                            autoComplete="new-password"
                            {...registerSignup("passwordConfirm", {
                              required: t("register.passwordConfirmRequired"),
                              validate: (value, formValues) =>
                                value === formValues.password ||
                                t("register.passwordMismatch"),
                            })}
                          />
                          <span className="input-prefix-icon"><Lock size={18} /></span>
                          <button
                            type="button"
                            className="input-suffix-btn"
                            onClick={() =>
                              setShowRegisterConfirmPassword((prev) => !prev)
                            }
                            tabIndex={-1}
                            title={
                              showRegisterConfirmPassword
                                ? "Ẩn mật khẩu"
                                : "Hiện mật khẩu"
                            }
                          >
                            {showRegisterConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {errorsSignup.passwordConfirm && (
                          <span className="modern-field-error">
                            {errorsSignup.passwordConfirm.message}
                          </span>
                        )}
                      </div>

                      <div className="terms-privacy-text">
                        Bằng việc đăng ký, bạn đồng ý với{" "}
                        <Link to="/contact">Điều khoản dịch vụ</Link> và{" "}
                        <Link to="/contact">Chính sách bảo mật</Link> của Dentist Pro.
                      </div>

                      <button
                        type="submit"
                        className="modern-submit-btn"
                        disabled={isRegistering}
                      >
                        {isRegistering ? (
                          <span className="btn-loading">
                            <span className="spinner-border" />
                            <span>Đang tạo tài khoản...</span>
                          </span>
                        ) : (
                          <>
                            <span>{t("register.submit")}</span>
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="auth-footer-switch">
                      <span>Đã có tài khoản?</span>
                      <button
                        type="button"
                        onClick={() => handleSwitchTab("login")}
                        className="switch-link-btn"
                      >
                        Đăng nhập ngay
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
