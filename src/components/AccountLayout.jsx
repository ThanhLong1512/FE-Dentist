import { NavLink, Outlet } from "react-router-dom";
import { Suspense, useMemo } from "react";
import { User, CalendarCheck, ShoppingBag, ShieldCheck } from "lucide-react";
import { ThemeProvider, createTheme, CircularProgress, Box } from "@mui/material";
import { useDarkMode } from "../hooks/useDarkMode";
import { useMe } from "../features/authentication/useMe";
import "./AccountLayout.css";

const tabs = [
  { to: "/account/profile", label: "Hồ sơ cá nhân", icon: User },
  { to: "/account/appointments", label: "Lịch hẹn của tôi", icon: CalendarCheck },
  { to: "/account/orders", label: "Đơn hàng dịch vụ", icon: ShoppingBag },
];

const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle fill='%23e2e8f0' cx='50' cy='50' r='50'/%3E%3Ccircle fill='%2394a3b8' cx='50' cy='38' r='18'/%3E%3Cellipse fill='%2394a3b8' cx='50' cy='88' rx='28' ry='24'/%3E%3C/svg%3E";

function AccountLayout() {
  const { isDarkMode } = useDarkMode();
  const { me } = useMe();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
          primary: { main: "#0284c7" },
          background: {
            default: isDarkMode ? "#0f172a" : "#f8fafc",
            paper: isDarkMode ? "#1e293b" : "#ffffff",
          },
          text: {
            primary: isDarkMode ? "#f8fafc" : "#0f172a",
            secondary: isDarkMode ? "#cbd5e1" : "#475569",
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
        },
      }),
    [isDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <section className="account-layout">
        <div className="account-layout-inner">
          <aside className="account-sidebar">
            {me && (
              <div className="account-sidebar-user">
                <div className="account-sidebar-avatar-wrap">
                  <img
                    src={me.photo || DEFAULT_AVATAR}
                    alt={me.name}
                    className="account-sidebar-avatar"
                  />
                  <span className="account-sidebar-status-dot" />
                </div>
                <div className="account-sidebar-user-info">
                  <h3 className="account-sidebar-user-name">{me.name}</h3>
                  <span className="account-sidebar-user-role">
                    <ShieldCheck size={13} />
                    {me.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                  </span>
                </div>
              </div>
            )}

            <div className="account-sidebar-divider" />

            <div className="account-sidebar-header">
              <span className="account-sidebar-title">Quản lý tài khoản</span>
            </div>

            <nav>
              {tabs.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    isActive ? "account-tab active" : "account-tab"
                  }
                >
                  <Icon size={18} className="account-tab-icon" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </aside>

          <div className="account-content">
            <Suspense
              fallback={
                <Box className="account-page-loading">
                  <CircularProgress size={36} sx={{ color: "#0284c7" }} />
                </Box>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </div>
      </section>
    </ThemeProvider>
  );
}

export default AccountLayout;
