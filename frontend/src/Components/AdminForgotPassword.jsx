import React, { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import assets from "../assets/assets";

export default function AdminForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=otp+password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ======================
     SEND OTP
  ====================== */
  const handleSendOtp = async () => {
    if (!email) return toast.error("Email is required");

    setLoading(true);
    try {
      await API.post("/auth/admin/forgot-password", { email });
      toast.success("OTP sent to admin email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     RESET PASSWORD
  ====================== */
  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      await API.post("/auth/admin/reset-password", {
        email,
        otp,
        newPassword,
      });

      toast.success("Password reset successful");

      setTimeout(() => {
        navigate("/admin/login");
      }, 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Password reset failed");
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
          Admin Forgot Password
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {step === 1
            ? "Enter admin email to receive OTP"
            : "Verify OTP and set new password"}
        </p>

        {/* STEP 1 — EMAIL */}
        {step === 1 && (
          <>
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700">
                Admin Email
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

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 — OTP + PASSWORD */}
        {step === 2 && (
          <>
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700">
                OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter OTP"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-700">
                New Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="New password"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Confirm password"
              />
            </div>

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
