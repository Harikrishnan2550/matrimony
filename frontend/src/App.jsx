import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login_Signup from "./Components/Login_Signup";
import Form from "./Components/Form";
import GalleryPage from "./Components/GalleryPage";
import Matches from "./Components/Matches";
import AdminDashboard from "./Components/AdminDashboard";
import AdminViewClient from "./Components/AdminViewClient";
import UserProfile from "./Components/UserProfile";
import ProtectedRoute from "./Components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login_Signup />} />
        <Route path="/profile" element={<Form />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <GalleryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />

        {/* 🚨 Admin routes (optional to protect later) */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/user/:clientId" element={<AdminViewClient />} />
      </Routes>
    </BrowserRouter>
  );
}
