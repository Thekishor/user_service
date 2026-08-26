import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About ";
import Contact from "./pages/Contact ";
import { Toaster } from "sonner";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import ChangePassword from "./pages/ChangePassword";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import UserActivity from "./pages/UserActivity";

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
        expand={false}
        visibleToasts={3}
        gap={8}
      />
      <Routes>
        {/* authentication pages - no navbar */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Main application pages — Navbar included */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="profile" element={<Profile />} />
              <Route path="user-activity" element={<UserActivity />} />
            </Route>
          </Route>
        </Route>

        {/* 404 not found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default App;
