import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { createContext, Suspense } from "react";
import { useState } from "react";
import ThemedToastContainer from "./components/ThemedToastContainer";
import { Toaster } from "react-hot-toast";
import GlobalStyles from "../styles/GlobalStyles";
import { lazy } from "react";

const Home = lazy(() => import("./pages/Home"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Shop = lazy(() => import("./pages/Shop"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AppLayout = lazy(() => import("./components/AppLayout"));
const Blog = lazy(() => import("./pages/Blog"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const DetailService = lazy(() => import("./pages/DetailService"));
const Account = lazy(() => import("./pages/Account"));
const Appointment = lazy(() => import("./pages/Appointment"));
const Order = lazy(() => import("./pages/Order"));
const AppointmentCheckout = lazy(() => import("./pages/AppointmentCheckout"));
const Patient = lazy(() => import("./pages/admin/Patient"));
const Service = lazy(() => import("./pages/admin/Service"));
const Shift = lazy(() => import("./pages/admin/Shift"));
const Employee = lazy(() => import("./pages/admin/Employee"));
const Booking = lazy(() => import("./pages/admin/Booking"));
const User = lazy(() => import("./pages/admin/User"));
const Setting = lazy(() => import("./pages/admin/Setting"));
const Facility = lazy(() => import("./pages/admin/Facility"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const Spinner = lazy(() => import("./components/admin/Spinner"));

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DarkModeProvider } from "./context/DarkModeContext";
import { LanguageProvider } from "./context/LanguageContext";

export const RecoveryContext = createContext();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});
function App() {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [countCart, setCountCart] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const UnauthorizedRoutes = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) return <Navigate to="/home" replace={true} />;
    return <Outlet />;
  };

  return (
    <>
      <DarkModeProvider>
        <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
          <GlobalStyles />
          <BrowserRouter>
            <RecoveryContext.Provider
              value={{
                email,
                setEmail,
                otp,
                setOTP,
                showOTPInput,
                setShowOTPInput,
                countCart,
                setCountCart,
                totalPrice,
                setTotalPrice,
              }}
            >
              <Suspense fallback={<Spinner />}>
                <Routes>
                  <Route index element={<Navigate replace to="home" />} />
                  <Route path="home" element={<Home />} />
                  {/* Client */}
                  <Route element={<AppLayout />}>
                    <Route path="blog" element={<Blog />} />
                    <Route path="contact" element={<Contact />} />
                    <Route element={<UnauthorizedRoutes />}>
                      <Route path="login" element={<Login />} />
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
                    <Route path="/account/profile" element={<Account />} />
                    <Route
                      path="/account/appointments"
                      element={<Appointment />}
                    />
                    <Route path="/account/orders" element={<Order />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                  {/* Admin */}
                  <Route element={<AdminLayout />}>
                    <Route path="admin/dashboard" element={<Dashboard />} />
                    <Route path="admin/patients" element={<Patient />} />
                    <Route path="admin/services" element={<Service />} />
                    <Route path="admin/shifts" element={<Shift />} />
                    <Route path="admin/appointments" element={<Booking />} />
                    <Route path="admin/orders" element={<Orders />} />
                    <Route path="admin/users" element={<User />} />
                    <Route path="admin/facilities" element={<Facility />} />
                    <Route path="admin/employees" element={<Employee />} />
                    <Route path="admin/settings" element={<Setting />} />
                  </Route>
                </Routes>
              </Suspense>
              <ThemedToastContainer />
            </RecoveryContext.Provider>
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
      </DarkModeProvider>
    </>
  );
}

export default App;
