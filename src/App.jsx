import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";
import Blog from "./pages/Blog";
import ProtectedRoute from "./components/ProtectRoute";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import FormsAdmin from "./pages/admin/Accounts";
import TableAdmin from "./pages/admin/Employees";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
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

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate replace to="home" />} />
        <Route path="home" element={<Home />} />
        <Route element={<AppLayout />}>
          <Route path="blog" element={<Blog />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="contact" element={<Contact />} />
          </Route>
          <Route element={<UnauthorizedRoutes />}>
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="shop" element={<Shop />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route
          path="admin/*"
          element={
            isAdmin ? <ProtectedRoute /> : <Navigate replace to="/home" />
          }
        >
          {isAdmin && (
            <>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<FormsAdmin />} />
              <Route path="employees" element={<TableAdmin />} />
            </>
          )}
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
    </BrowserRouter>
  );
}

export default App;
