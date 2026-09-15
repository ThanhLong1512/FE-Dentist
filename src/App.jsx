import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { Suspense } from "react";
import ThemedToastContainer from "./components/ThemedToastContainer";
import ThemeSync from "./components/ThemeSync";
import { Toaster } from "react-hot-toast";
import GlobalStyles from "../styles/GlobalStyles";
import { lazy } from "react";
import Shop from "./pages/Shop";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import Facilities from "./pages/Facilities";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import DetailService from "./pages/DetailService";
import AppointmentCheckout from "./pages/AppointmentCheckout";

import AppLayout from "./components/AppLayout";
import AccountLayout from "./components/AccountLayout";
import ScrollToTop from "./components/ScrollToTop";
import Account from "./pages/Account";
import Appointment from "./pages/Appointment";
import Order from "./pages/Order";
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Patient = lazy(() => import("./pages/admin/Patient"));
const Service = lazy(() => import("./pages/admin/Service"));
const Shift = lazy(() => import("./pages/admin/Shift"));
const Employee = lazy(() => import("./pages/admin/Employee"));
const AdminBooking = lazy(() => import("./pages/admin/Booking"));
const User = lazy(() => import("./pages/admin/User"));
const Setting = lazy(() => import("./pages/admin/Setting"));
const Facility = lazy(() => import("./pages/admin/Facility"));
const Orders = lazy(() => import("./pages/admin/Orders"));
import Spinner from "./components/admin/Spinner";
import ErrorBoundary from "./components/ErrorBoundary";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { LanguageProvider } from "./context/LanguageContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  const UnauthorizedRoutes = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) return <Navigate to="/home" replace={true} />;
    return <Outlet />;
  };

  return (
    <>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeSync />
          <GlobalStyles />
          <BrowserRouter>
            <ScrollToTop />
            <ErrorBoundary>
              <Suspense fallback={<Spinner />}>
                <Routes>
                  <Route index element={<Navigate replace to="home" />} />
                  {/* Client */}
                  <Route element={<AppLayout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="booking" element={<Booking />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="facilities" element={<Facilities />} />
                    <Route element={<UnauthorizedRoutes />}>
                      <Route path="login" element={<Login />} />
                      <Route
                        path="register"
                        element={<Login defaultTab="register" />}
                      />
                    </Route>
                    <Route path="shop" element={<Shop />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route
                      path="/appointment/checkout"
                      element={<AppointmentCheckout />}
                    />
                    <Route
                      path="/shop/:ServiceID"
                      element={<DetailService />}
                    />
                    <Route path="/account" element={<AccountLayout />}>
                      <Route index element={<Navigate to="profile" replace />} />
                      <Route path="profile" element={<Account />} />
                      <Route path="appointments" element={<Appointment />} />
                      <Route path="orders" element={<Order />} />
                    </Route>
                  </Route>

                  {/* Admin - support both /admin and /admin/* */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="patients" element={<Patient />} />
                    <Route path="services" element={<Service />} />
                    <Route path="shifts" element={<Shift />} />
                    <Route path="appointments" element={<AdminBooking />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="users" element={<User />} />
                    <Route path="facilities" element={<Facility />} />
                    <Route path="employees" element={<Employee />} />
                    <Route path="settings" element={<Setting />} />
                  </Route>
                  <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />

                  {/* Global 404 Catch-All */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
            <ThemedToastContainer />
          </BrowserRouter>
          <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{ margin: "8px" }}
            toastOptions={{
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
              style: {
                fontSize: "16px",
                maxWidth: "500px",
                padding: "16px 24px",
                backgroundColor: "var(--color-grey-0)",
                color: "var(--color-grey-700)",
              },
            }}
          />
        </QueryClientProvider>
      </LanguageProvider>
    </>
  );
}

export default App;
