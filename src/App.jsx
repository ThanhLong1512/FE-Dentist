import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import ThemeSync from "./components/ThemeSync";
const LazyToasters = lazy(() => import("./components/LazyToasters"));
import GlobalStyles from "../styles/GlobalStyles";

const Home = lazy(() => import("./pages/Home"));
import AppLayout from "./components/AppLayout";
import ScrollToTop from "./components/ScrollToTop";

// Client Lazy Loaded Pages
const Shop = lazy(() => import("./pages/Shop"));
const Booking = lazy(() => import("./pages/Booking"));
const Contact = lazy(() => import("./pages/Contact"));
const Facilities = lazy(() => import("./pages/Facilities"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Blog = lazy(() => import("./pages/Blog"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const DetailService = lazy(() => import("./pages/DetailService"));
const AppointmentCheckout = lazy(() => import("./pages/AppointmentCheckout"));
const AccountLayout = lazy(() => import("./components/AccountLayout"));
const Account = lazy(() => import("./pages/Account"));
const Appointment = lazy(() => import("./pages/Appointment"));
const Order = lazy(() => import("./pages/Order"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

// Admin Lazy Loaded Pages
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
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
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) return <Navigate to="/home" replace={true} />;
    } catch {
      // ignore
    }
    return <Outlet />;
  };

  const ProtectedRoutes = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) return <Navigate to="/login" replace={true} />;
    } catch {
      return <Navigate to="/login" replace={true} />;
    }
    return <Outlet />;
  };

  const AdminRoutes = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo || userInfo.role !== "admin") {
        return <Navigate to="/login" replace={true} />;
      }
    } catch {
      return <Navigate to="/login" replace={true} />;
    }
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
                  {/* Client Layout */}
                  <Route element={<AppLayout />}>
                    {/* Public routes - No login required */}
                    <Route path="home" element={<Home />} />
                    <Route path="booking" element={<Booking />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="facilities" element={<Facilities />} />
                    <Route path="shop" element={<Shop />} />
                    <Route
                      path="/shop/:ServiceID"
                      element={<DetailService />}
                    />
                    <Route path="/cart" element={<Cart />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Guest-only routes */}
                    <Route element={<UnauthorizedRoutes />}>
                      <Route path="login" element={<Login />} />
                      <Route
                        path="register"
                        element={<Login defaultTab="register" />}
                      />
                    </Route>

                    {/* Authenticated user routes */}
                    <Route element={<ProtectedRoutes />}>
                      <Route path="/checkout" element={<Checkout />} />
                      <Route
                        path="/appointment/checkout"
                        element={<AppointmentCheckout />}
                      />
                      <Route path="/account" element={<AccountLayout />}>
                        <Route index element={<Navigate to="profile" replace />} />
                        <Route path="profile" element={<Account />} />
                        <Route path="appointments" element={<Appointment />} />
                        <Route path="orders" element={<Order />} />
                      </Route>
                    </Route>
                  </Route>

                  {/* Admin - Protected for admin role only */}
                  <Route element={<AdminRoutes />}>
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
                  </Route>
                  <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />

                  {/* Global 404 Catch-All */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
          <Suspense fallback={null}>
            <LazyToasters />
          </Suspense>
        </QueryClientProvider>
      </LanguageProvider>
    </>
  );
}

export default App;
