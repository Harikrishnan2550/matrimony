import React, { useState,useEffect } from "react";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import assets from "../assets/assets";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
  const checkAdmin = async () => {
    try {
      const { data } = await API.get("/auth/admin/setup-check");
      if (!data.exists) {
        navigate("/admin/setup"); // FIRST TIME ONLY
      }
    } catch (err) {
      console.error(err);
    }
  };

  checkAdmin();
}, []);


  const handleLogin = async () => {
    if (!email || !password) {
      return toast.error("Email and password are required");
    }

    setLoading(true);

    try {
      const { data } = await API.post("/auth/admin/login", {
        email,
        password,
      });

      // Save token
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));

      toast.success("Admin login successful");

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Toaster position="top-center" richColors />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <img src={assets.logo} alt="Logo" className="h-14" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Admin Login
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Authorized access only
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700">
            Email Address
          </label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin@example.com"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-700">
            Password
          </label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter password"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Login as Admin"}
        </button>

        {/* Forgot Password */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/admin/forgot-password")}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
