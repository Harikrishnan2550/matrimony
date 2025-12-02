import React, { useState } from "react";
import {
  Shield, Users, Award, Lock, Mail, Phone, User,
  Eye, EyeOff, Menu, X, Loader2
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";

// ✅ IMPORT THE CENTRAL API INSTANCE
import API from "../api/axios"; 

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // 1. Basic Client-side Validation
    if (!formData.email || !formData.password) {
      return toast.error("Please fill in all required fields");
    }

    if (!isLogin) {
      if (!formData.name || !formData.phone) {
        return toast.error("Please fill in all fields");
      }
      if (formData.password !== formData.confirmPassword) {
        return toast.error("Passwords do not match!");
      }
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";

      // ✅ 2. Use the imported API (Clean and Consistent)
      const { data } = await API.post(endpoint, formData);

      // 3. Success Handling
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));

      toast.success(data.message || (isLogin ? "Login successful!" : "Account created successfully!"));

      // 4. Redirect Logic
      setTimeout(() => {
        if (data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/profile");
        }
      }, 500);

    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMsg);
      console.error("Auth Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ... (The rest of your JSX/UI code remains exactly the same)
  // Just make sure the JSX below is unchanged from your original file.
  
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <Toaster position="top-center" richColors />
      {/* ... paste your original JSX here ... */}
       {/* Mobile Header with Menu Toggle */}
      <div className="lg:hidden bg-[#2D3E9F] p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center">
          <img src={assets.logo} alt="ANA Logo" className="h-10 object-contain" />
        </div>

        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="text-white p-2 hover:bg-white/10 rounded-lg transition"
        >
          {showMobileMenu ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 z-40 overflow-y-auto">
          <div className="p-6 pt-20">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                Find Your
                <br />
                Perfect Life Partner
              </h2>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Join India's most trusted matrimony platform for the Nadar
                community
              </p>

              {/* Premium Features */}
              <div className="space-y-5">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-1">
                      100% Verified Profiles
                    </h3>
                    <p className="text-blue-200 text-sm leading-relaxed">
                      Every member is thoroughly authenticated and verified
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-1">
                      Privacy Protected
                    </h3>
                    <p className="text-blue-200 text-sm leading-relaxed">
                      Your data security is our highest priority
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-1">
                      Trusted Community
                    </h3>
                    <p className="text-blue-200 text-sm leading-relaxed">
                      Join thousands of happy families across India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-1">
                      Premium Matchmaking
                    </h3>
                    <p className="text-blue-200 text-sm leading-relaxed">
                      Advanced algorithms for perfect compatibility
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowMobileMenu(false)}
                className="w-full mt-8 bg-white text-blue-900 font-semibold py-3 rounded-xl transition"
              >
                Continue to Sign In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Panel - Premium Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2D3E9F] p-16 flex-col justify-between relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-20">
            <div className="flex items-center mb-20">
              <img src={assets.logo} alt="ANA Logo" className="h-16 object-contain" />
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-lg">
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              Find Your
              <br />
              Perfect Life Partner
            </h2>
            <p className="text-xl text-blue-100 mb-16 leading-relaxed">
              Join India's most trusted matrimony platform for the Nadar
              community
            </p>

            {/* Premium Features */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    100% Verified Profiles
                  </h3>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    Every member is thoroughly authenticated and verified
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    Privacy Protected
                  </h3>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    Your data security is our highest priority
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    Trusted Community
                  </h3>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    Join thousands of happy families across India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">
                    Premium Matchmaking
                  </h3>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    Advanced algorithms for perfect compatibility
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-blue-300 text-sm">
          © 2024 Akhilendia Nadar Association. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-16 bg-white">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <div className="inline-flex items-center space-x-2 bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-blue-900">
                Secure Authentication
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              {isLogin ? "Welcome back" : "Get started"}
            </h2>
            <p className="text-gray-500 text-base sm:text-lg">
              {isLogin
                ? "Sign in to access your account"
                : "Create your account today"}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-xl sm:rounded-2xl p-1 sm:p-1.5 mb-6 sm:mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
                isLogin
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 ${
                !isLogin
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4 sm:space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
                  placeholder="Enter your password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-2 sm:ml-3 text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-900">
                    Remember me
                  </span>
                </label>
                <button className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition text-left sm:text-right">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 mt-6 sm:mt-8 text-sm sm:text-base flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : isLogin ? (
                "Sign in to your account"
              ) : (
                "Create your account"
              )}
            </button>

            {!isLogin && (
              <p className="text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
                By signing up, you agree to our{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Privacy Policy
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}