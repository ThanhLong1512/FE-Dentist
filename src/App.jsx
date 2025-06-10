import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { createContext } from "react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import GlobalStyles from "../styles/GlobalStyles";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";
import Blog from "./pages/Blog";
import ProtectedRoute from "./components/ProtectRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import DetailService from "./pages/DetailService";
import Account from "./pages/Account";
import Appointment from "./pages/Appointment";
import Order from "./pages/Order";
import Patient from "./pages/admin/Patient";
import Service from "./pages/admin/Service";
import Shift from "./pages/admin/Shift";
import Employee from "./pages/admin/Employee";
import Booking from "./pages/admin/Booking";
import User from "./pages/admin/User";
import Setting from "./pages/admin/Setting";
import Facility from "./pages/admin/Facility";
import Orders from "./pages/admin/Orders";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
  const isAdmin =
    JSON.parse(localStorage.getItem("userInfo"))?.role === "admin"
      ? true
      : false;

  const ProtectedRoutes = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) return <Navigate to="/login" replace={true} />;
    return <Outlet />;
  };

  const UnauthorizedRoutes = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) return <Navigate to="/home" replace={true} />;
    return <Outlet />;
  };

  const AdminRoutes = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || userInfo.role !== "admin") {
      const adminStyles = document.querySelectorAll('link[href*="/admin/"]');
      const adminScripts = document.querySelectorAll('script[src*="/admin/"]');

      adminStyles.forEach((style) => style.remove());
      adminScripts.forEach((script) => script.remove());

      return <Navigate to="/home" replace={true} />;
    }
    return <ProtectedRoute />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
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
          <Routes>
            <Route index element={<Navigate replace to="home" />} />
            <Route path="home" element={<Home />} />
            <Route element={<AppLayout />}>
              <Route path="blog" element={<Blog />} />
              <Route path="contact" element={<Contact />} />
              <Route element={<UnauthorizedRoutes />}>
                <Route path="login" element={<Login />} />
              </Route>
              <Route path="shop" element={<Shop />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/shop/:ServiceID" element={<DetailService />} />
              <Route path="/account/profile" element={<Account />} />
              <Route path="/account/appointments" element={<Appointment />} />
              <Route path="/account/orders" element={<Order />} />
            </Route>
            <Route element={<AdminLayout />}>
              <Route
                index
                element={<Navigate replace to="admin/dashboard" />}
              />
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
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
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
  );
}

export default App;
