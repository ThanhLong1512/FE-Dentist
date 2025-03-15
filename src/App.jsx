import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

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
import FormsAdmin from "./pages/admin/FormsAdmin";
import TableAdmin from "./pages/admin/TableAdmin";

function App() {
  const isAdmin = true;

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate replace to="home" />} />
        <Route path="home" element={<Home />} />

        {/* Route cho client (AppLayout) */}

        <Route element={<AppLayout />}>
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="shop" element={<Shop />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Route cho admin (AdminLayout) */}
        {isAdmin && (
          <Route
            path="admin"
            element={
              <ProtectedRoute isAdmin={isAdmin}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<FormsAdmin />} />
            <Route path="table" element={<TableAdmin />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
