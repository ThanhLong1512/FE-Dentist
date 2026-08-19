import { NavLink, Outlet } from "react-router-dom";
import { Suspense, useMemo } from "react";
import { User, CalendarCheck, ShoppingBag } from "lucide-react";
import { ThemeProvider, createTheme, CircularProgress, Box } from "@mui/material";
import { useDarkMode } from "../context/DarkModeContext";
import "./AccountLayout.css";

const tabs = [
  { to: "/account/profile", label: "My Account", icon: User },
  { to: "/account/appointments", label: "My Appointments", icon: CalendarCheck },
  { to: "/account/orders", label: "My Orders", icon: ShoppingBag },
];

function AccountLayout() {
  const { isDarkMode } = useDarkMode();
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
          primary: { main: "#1370b5" },
          background: {
            default: isDarkMode ? "#0f172a" : "#f8fafc",
            paper: isDarkMode ? "#1e293b" : "#ffffff",
          },
          text: {
            primary: isDarkMode ? "#f8fafc" : "#0f172a",
            secondary: isDarkMode ? "#cbd5e1" : "#475569",
          },
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
              },
              input: {
                color: isDarkMode ? "#f8fafc" : "#0f172a",
                WebkitTextFillColor: isDarkMode ? "#f8fafc" : "#0f172a",
                "&:disabled": {
                  WebkitTextFillColor: isDarkMode ? "#cbd5e1" : "#334155",
                  color: isDarkMode ? "#cbd5e1" : "#334155",
                },
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                color: isDarkMode ? "#cbd5e1" : "#475569",
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
            <h2>Tài khoản</h2>
            <nav>
              {tabs.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    isActive ? "account-tab active" : "account-tab"
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </aside>
          <div className="account-content">
            <Suspense
              fallback={
                <Box className="account-page-loading">
                  <CircularProgress size={32} />
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
