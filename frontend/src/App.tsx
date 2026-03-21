import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import AdminLayout from "@/components/AdminLayout";
import HomePage from "@/pages/HomePage";
import FieldsPage from "@/pages/FieldsPage";
import BookingPage from "@/pages/BookingPage";
import LoginPage from "@/pages/LoginPage";
import CheckoutPage from "@/pages/CheckoutPage";
import MyBookingsPage from "@/pages/MyBookingsPage";
import AboutPage from "@/pages/AboutPage";
import LeaguesPage from "@/pages/LeaguesPage";
import PickupPage from "@/pages/PickupPage";
import AcademyPage from "@/pages/AcademyPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import AdminBookingsPage from "@/pages/admin/AdminBookingsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/fields" element={<FieldsPage />} />
              <Route path="/fields/:fieldId/book" element={<BookingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/leagues" element={<LeaguesPage />} />
              <Route path="/pickup" element={<PickupPage />} />
              <Route path="/academy" element={<AcademyPage />} />
            </Route>

            {/* Admin routes */}
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/admin/bookings" element={<AdminBookingsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
