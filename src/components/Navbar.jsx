import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";
import {
  Globe,
  ShoppingCart,
  Calendar,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  Phone,
  Clock,
  Sparkles,
  LayoutDashboard,
  Maximize2,
} from "lucide-react";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { useLanguage } from "../context/LanguageContext";
import { useDarkMode } from "../hooks/useDarkMode";
import { handleLogoutApi } from "../apis/index";
import LanguageSwitcher from "./LanguageSwitcher";
import AvatarFullscreenModal from "./AvatarFullscreenModal";
import CheeseLogo from "./CheeseLogo";

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: ${(props) =>
    props.$isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.85)"};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid
    ${(props) =>
      props.$isDark ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.8)"};
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
`;

const TopNoticeBar = styled.div`
  background: linear-gradient(90deg, #0284c7 0%, #2563eb 100%);
  color: #ffffff;
  padding: 0.5rem 1.6rem;
  font-size: 1.25rem;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const TopInfoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  justify-content: space-between;

  .item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  a {
    color: #ffffff;
    text-decoration: none;
    font-weight: 600;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const NavContainer = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 1.2rem 2.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  width: 100%;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  flex-shrink: 0;
  white-space: nowrap;

  .logo-icon {
    width: 4.2rem;
    height: 4.2rem;
    background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
    border-radius: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2.2rem;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
    flex-shrink: 0;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1.1;

    span.brand {
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      white-space: nowrap;
    }

    span.subtitle {
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: ${(props) => (props.$isDark ? "#94a3b8" : "#64748b")};
      white-space: nowrap;
    }
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
  white-space: nowrap;

  @media (max-width: 1150px) {
    display: none;
  }
`;

const NavItem = styled(NavLink)`
  padding: 0.8rem 1.4rem;
  border-radius: 0.8rem;
  font-size: 1.45rem;
  font-weight: 600;
  text-decoration: none;
  color: ${(props) => (props.$isDark ? "#cbd5e1" : "#475569")};
  transition: all 0.2s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    color: #0284c7;
    background: ${(props) =>
      props.$isDark ? "rgba(51, 65, 85, 0.5)" : "rgba(241, 245, 249, 0.8)"};
  }

  &.active {
    color: #0284c7;
    background: ${(props) =>
      props.$isDark ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.08)"};
  }
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
  white-space: nowrap;
`;

const IconBtn = styled.button`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: 1px solid
    ${(props) =>
      props.$isDark ? "rgba(51, 65, 85, 0.8)" : "rgba(226, 232, 240, 0.9)"};
  background: ${(props) => (props.$isDark ? "#1e293b" : "#ffffff")};
  color: ${(props) => (props.$isDark ? "#e2e8f0" : "#475569")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    color: #0284c7;
    border-color: #0284c7;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  }

  span.badge {
    position: absolute;
    top: -0.3rem;
    right: -0.3rem;
    background: #ef4444;
    color: white;
    font-size: 1.1rem;
    font-weight: 700;
    min-width: 1.8rem;
    height: 1.8rem;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.4rem;
    border: 2px solid ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
  }
`;

const BookNowCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.9rem 1.8rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
  transition: all 0.25s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(2, 132, 199, 0.45);
    background: linear-gradient(135deg, #0369a1 0%, #1d4ed8 100%);
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const UserMenuWrapper = styled.div`
  position: relative;
`;

const UserAvatarBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 999px;

  img {
    width: 3.8rem;
    height: 3.8rem;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #0284c7;
    flex-shrink: 0;
  }
`;

const UserInitialsAvatar = styled.div`
  width: 3.8rem;
  height: 3.8rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.4rem;
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3);
  border: 2px solid #0284c7;
  flex-shrink: 0;
`;

const UserDropdown = styled.div`
  position: absolute;
  top: calc(100% + 1rem);
  right: 0;
  width: 26rem;
  background: ${(props) => (props.$isDark ? "#1e293b" : "#ffffff")};
  border: 1px solid
    ${(props) => (props.$isDark ? "#334155" : "#e2e8f0")};
  border-radius: 1.2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  z-index: 1001;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .user-meta {
    padding: 0.8rem;
    border-bottom: 1px solid
      ${(props) => (props.$isDark ? "#334155" : "#f1f5f9")};
    margin-bottom: 0.4rem;

    .name {
      font-size: 1.5rem;
      font-weight: 700;
      color: ${(props) => (props.$isDark ? "#f8fafc" : "#1e293b")};
    }
    .email {
      font-size: 1.25rem;
      color: ${(props) => (props.$isDark ? "#94a3b8" : "#64748b")};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  a,
  button {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.9rem 1.2rem;
    border-radius: 0.8rem;
    font-size: 1.4rem;
    font-weight: 500;
    text-decoration: none;
    color: ${(props) => (props.$isDark ? "#cbd5e1" : "#334155")};
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.15s;

    &:hover {
      background: ${(props) => (props.$isDark ? "#334155" : "#f1f5f9")};
      color: #0284c7;
    }

    &.logout {
      color: #ef4444;
      &:hover {
        background: #fef2f2;
      }
    }
  }
`;

const DropdownFooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 10px;
  margin-top: 4px;
  border-top: 1px solid ${(props) => (props.$isDark ? "#334155" : "#e2e8f0")};
`;

const DarkModeToggleSwitch = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 6px 4px 10px;
  border-radius: 999px;
  background: ${(props) => (props.$isDark ? "#1e293b" : "#f1f5f9")};
  border: 1px solid ${(props) => (props.$isDark ? "#334155" : "#cbd5e1")};
  transition: all 0.2s ease;

  &:hover {
    border-color: #0284c7;
  }

  .switch-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => (props.$isDark ? "#38bdf8" : "#f59e0b")};
  }

  .switch-track {
    position: relative;
    width: 38px;
    height: 22px;
    border-radius: 999px;
    background: ${(props) => (props.$isDark ? "#0284c7" : "#cbd5e1")};
    transition: background-color 0.25s ease;
  }

  .switch-knob {
    position: absolute;
    top: 2px;
    left: ${(props) => (props.$isDark ? "18px" : "2px")};
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    transition: left 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

const DropdownLogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 1.35rem;
  font-weight: 600;
  color: #ef4444;
  background: ${(props) => (props.$isDark ? "rgba(239, 68, 68, 0.12)" : "#fef2f2")};
  border: 1px solid ${(props) => (props.$isDark ? "rgba(239, 68, 68, 0.25)" : "#fecaca")};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #ef4444;
    color: #ffffff;
    border-color: #ef4444;
    transform: translateY(-1px);
  }
`;

const MobileMenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${(props) => (props.$isDark ? "#f8fafc" : "#1e293b")};
  cursor: pointer;

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileDrawer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: ${(props) =>
    props.$isDark ? "rgba(15, 23, 42, 0.98)" : "rgba(255, 255, 255, 0.98)"};
  backdrop-filter: blur(20px);
  z-index: 2000;
  padding: 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: slideIn 0.25s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid
      ${(props) => (props.$isDark ? "#334155" : "#e2e8f0")};
    padding-bottom: 1.6rem;
  }

  .drawer-links {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;

    a {
      font-size: 1.8rem;
      font-weight: 700;
      text-decoration: none;
      color: ${(props) => (props.$isDark ? "#f1f5f9" : "#1e293b")};
      padding: 0.8rem 0;

      &.active {
        color: #0284c7;
      }
    }
  }
`;

export default function Navbar() {
  const [userInfo, setUserInfo] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const countCart = useSelector((state) => state.cartUi?.countCart || 0);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { language, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    if (stored) {
      try {
        setUserInfo(JSON.parse(stored));
        setAvatarError(false);
      } catch {
        setUserInfo(null);
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    const handleUserUpdate = () => {
      const updated = localStorage.getItem("userInfo");
      if (updated) {
        try {
          setUserInfo(JSON.parse(updated));
          setAvatarError(false);
        } catch {
          setUserInfo(null);
        }
      }
    };

    window.addEventListener("userInfoUpdated", handleUserUpdate);
    window.addEventListener("storage", handleUserUpdate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("userInfoUpdated", handleUserUpdate);
      window.removeEventListener("storage", handleUserUpdate);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await handleLogoutApi();
    } catch {
      localStorage.removeItem("userInfo");
    } finally {
      setUserInfo(null);
      navigate("/login");
    }
  };

  const isAdmin = userInfo?.role === "admin";

  return (
    <HeaderWrapper $isDark={isDarkMode} $isScrolled={isScrolled}>
      {/* Thanh thông tin cấp cứu / giờ mở cửa */}
      <TopNoticeBar>
        <TopInfoGroup>
          <div className="item">
            <Clock size={15} />
            <span>{t("nav.workingHours")}</span>
          </div>
          <div className="item">
            <Phone size={15} />
            <span>{t("nav.hotline")} <a href="tel:19008888">1900 8888</a></span>
          </div>
        </TopInfoGroup>
      </TopNoticeBar>

      <NavContainer>
        {/* Logo Cheese Clinic */}
        <LogoLink to="/home" $isDark={isDarkMode}>
          <CheeseLogo size="md" isDark={isDarkMode} />
        </LogoLink>

        {/* Menu chính */}
        <NavLinks>
          <NavItem to="/home" $isDark={isDarkMode}>
            {t("nav.home")}
          </NavItem>
          <NavItem to="/shop" $isDark={isDarkMode}>
            {t("nav.shop")}
          </NavItem>
          <NavItem to="/booking" $isDark={isDarkMode}>
            {t("nav.booking")}
          </NavItem>
          <NavItem to="/blog" $isDark={isDarkMode}>
            {t("nav.blog")}
          </NavItem>
          <NavItem to="/facilities" $isDark={isDarkMode}>
            {t("nav.facilities")}
          </NavItem>
          <NavItem to="/contact" $isDark={isDarkMode}>
            {t("nav.contact")}
          </NavItem>
        </NavLinks>

        {/* Nhóm thao tác người dùng */}
        <ActionGroup>
          {/* Nút đổi ngôn ngữ xịn xò */}
          <LanguageSwitcher />

          {/* Giỏ hàng */}
          <IconBtn
            as={Link}
            to="/cart"
            $isDark={isDarkMode}
            title={t("nav.cart")}
          >
            <ShoppingCart size={18} />
            {countCart > 0 && <span className="badge">{countCart}</span>}
          </IconBtn>

          {/* Nút Đặt lịch khám nhanh */}
          <BookNowCTA to="/booking">
            <Calendar size={18} />
            <span>{t("nav.bookNow")}</span>
          </BookNowCTA>

          {/* Tài khoản người dùng */}
          {userInfo ? (
            <UserMenuWrapper ref={dropdownRef}>
              {(() => {
                const avatarSrc = userInfo.image || userInfo.photo;
                const userInitials = userInfo.name
                  ? userInfo.name
                      .trim()
                      .split(/\s+/)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(-2)
                  : "AD";
                const showUserImage = Boolean(avatarSrc && !avatarError);

                return (
                  <UserAvatarBtn
                    type="button"
                    onClick={() => setShowUserDropdown((prev) => !prev)}
                    title="Tài khoản của bạn"
                  >
                    {showUserImage ? (
                      <img
                        src={avatarSrc}
                        alt={userInfo.name || "User"}
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <UserInitialsAvatar>{userInitials}</UserInitialsAvatar>
                    )}
                  </UserAvatarBtn>
                );
              })()}

              {showUserDropdown && (
                <UserDropdown $isDark={isDarkMode}>
                  <div className="user-meta">
                    <div className="name">{userInfo.name || "Khách hàng"}</div>
                    <div className="email">{userInfo.email}</div>
                  </div>

                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setShowUserDropdown(false)}
                      style={{ color: "#0284c7", fontWeight: 700 }}
                    >
                      <LayoutDashboard size={18} />
                      {t("nav.adminDashboard")}
                    </Link>
                  )}

                  <Link
                    to="/account/profile"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <User size={18} />
                    {t("nav.profile")}
                  </Link>

                  <Link
                    to="/account/appointments"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <Calendar size={18} />
                    {t("nav.myAppointments")}
                  </Link>

                  <Link
                    to="/account/orders"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <ShoppingCart size={18} />
                    {t("nav.myOrders")}
                  </Link>

                  {/* Chân menu: Nút công tắc Toggle Dark Mode đặt cạnh nút Đăng xuất */}
                  <DropdownFooterRow $isDark={isDarkMode}>
                    <DarkModeToggleSwitch
                      type="button"
                      $isDark={isDarkMode}
                      onClick={toggleDarkMode}
                      title={
                        isDarkMode
                          ? "Chuyển sang giao diện Sáng"
                          : "Chuyển sang giao diện Tối"
                      }
                      aria-label="Chuyển chế độ giao diện"
                    >
                      <span className="switch-icon">
                        {isDarkMode ? (
                          <HiOutlineMoon size={16} />
                        ) : (
                          <HiOutlineSun size={16} />
                        )}
                      </span>
                      <div className="switch-track">
                        <div className="switch-knob" />
                      </div>
                    </DarkModeToggleSwitch>

                    <DropdownLogoutBtn
                      type="button"
                      $isDark={isDarkMode}
                      onClick={() => {
                        setShowUserDropdown(false);
                        handleLogout();
                      }}
                      title={t("nav.logout")}
                    >
                      <LogOut size={16} />
                      <span>{t("nav.logout")}</span>
                    </DropdownLogoutBtn>
                  </DropdownFooterRow>
                </UserDropdown>
              )}
            </UserMenuWrapper>
          ) : (
            <BookNowCTA
              to="/login"
              style={{
                background: isDarkMode ? "#334155" : "#f1f5f9",
                color: isDarkMode ? "#f8fafc" : "#1e293b",
                boxShadow: "none",
              }}
            >
              <User size={18} />
              <span>{t("nav.login")}</span>
            </BookNowCTA>
          )}

          {/* Nút mở menu di động */}
          <MobileMenuBtn
            type="button"
            $isDark={isDarkMode}
            onClick={() => setShowMobileMenu(true)}
          >
            <Menu size={26} />
          </MobileMenuBtn>
        </ActionGroup>
      </NavContainer>

      {/* Drawer menu cho màn hình di động */}
      {showMobileMenu && (
        <MobileDrawer $isDark={isDarkMode}>
          <div className="drawer-header">
            <LogoLink
              to="/home"
              $isDark={isDarkMode}
              onClick={() => setShowMobileMenu(false)}
            >
              <CheeseLogo size="sm" isDark={isDarkMode} showSubtitle={false} />
            </LogoLink>
            <button
              type="button"
              onClick={() => setShowMobileMenu(false)}
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              <X size={28} />
            </button>
          </div>

          <div className="drawer-links">
            <NavLink to="/home" onClick={() => setShowMobileMenu(false)}>
              {t("nav.home")}
            </NavLink>
            <NavLink to="/shop" onClick={() => setShowMobileMenu(false)}>
              {t("nav.shop")}
            </NavLink>
            <NavLink to="/booking" onClick={() => setShowMobileMenu(false)}>
              {t("nav.booking")}
            </NavLink>
            <NavLink to="/blog" onClick={() => setShowMobileMenu(false)}>
              {t("nav.blog")}
            </NavLink>
            <NavLink to="/facilities" onClick={() => setShowMobileMenu(false)}>
              {t("nav.facilities")}
            </NavLink>
            <NavLink to="/contact" onClick={() => setShowMobileMenu(false)}>
              {t("nav.contact")}
            </NavLink>
          </div>

          <div
            style={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                padding: "0.8rem 1.2rem",
                borderRadius: "1rem",
                background: isDarkMode ? "#1e293b" : "#f1f5f9",
                border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                <LanguageSwitcher />
                <DarkModeToggleSwitch
                  type="button"
                  $isDark={isDarkMode}
                  onClick={toggleDarkMode}
                  title={
                    isDarkMode
                      ? "Chuyển sang giao diện Sáng"
                      : "Chuyển sang giao diện Tối"
                  }
                >
                  <span className="switch-icon">
                    {isDarkMode ? (
                      <HiOutlineMoon size={16} />
                    ) : (
                      <HiOutlineSun size={16} />
                    )}
                  </span>
                  <div className="switch-track">
                    <div className="switch-knob" />
                  </div>
                </DarkModeToggleSwitch>
              </div>

              {userInfo && (
                <DropdownLogoutBtn
                  type="button"
                  $isDark={isDarkMode}
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleLogout();
                  }}
                >
                  <LogOut size={16} />
                  <span>{t("nav.logout")}</span>
                </DropdownLogoutBtn>
              )}
            </div>

            <BookNowCTA
              to="/booking"
              onClick={() => setShowMobileMenu(false)}
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "1.2rem",
              }}
            >
              <Calendar size={20} />
              <span>{t("nav.bookNow")}</span>
            </BookNowCTA>
          </div>
        </MobileDrawer>
      )}

      {userInfo && (
        <AvatarFullscreenModal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          src={!avatarError ? (userInfo.image || userInfo.photo) : ""}
          name={userInfo.name || "User"}
          role={userInfo.role === "admin" ? "Admin" : "Khách hàng"}
          email={userInfo.email}
        />
      )}
    </HeaderWrapper>
  );
}
