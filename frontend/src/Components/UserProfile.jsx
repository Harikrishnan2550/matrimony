import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  Edit,
  MapPin,
  Mail,
  Camera,
  ChevronRight,
  Briefcase,
  Loader2,
  User,
  Heart,
  Shield,
  Calendar,
  Languages,
  Star,
  Phone,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

// API Configuration
const API = axios.create({
  baseURL:
    window.location.hostname === "localhost"
      ? "http://localhost:4000/api"
      : "https://login.akhilendianadar.in/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const SimpleProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const SERVER_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://login.akhilendianadar.in";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get("/profile/me"); // ✅ Let API instance handle the domain      console.log("Profile API Response:", response.data);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile", {
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditRedirect = () => {
    toast.success("Redirecting to edit profile...");
    navigate("/profile");
  };

  const handlePhotoUpdate = () => {
    toast.info("Photo update feature coming soon", {
      description: "You'll be able to update photos in the next update",
    });
  };

  // Get profile image URL
  // Get profile image URL
  const getProfileImage = () => {
    // 1. Default image if no profile
    if (!profile) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300";
    
    // 2. Check if user has uploaded images
    if (profile.profileImages && profile.profileImages.length > 0) {
      const imagePath = profile.profileImages[0];
      
      // If it's an external link (like Google Auth photo), use it directly
      if (imagePath.startsWith('http')) {
        return imagePath;
      } 
      
      // 3. Nginx Logic: Clean up path to ensure it matches /uploads/filename.jpg
      let cleanPath = imagePath.replace(/\\/g, "/"); // Fix Windows paths
      if (cleanPath.startsWith("uploads/")) {
        cleanPath = cleanPath.replace("uploads/", "");
      } else if (cleanPath.startsWith("/")) {
        cleanPath = cleanPath.substring(1);
      }
      
      return `/uploads/${cleanPath}`;
    }
    
    // 3. Fallback based on Gender
    return profile.gender === 'female' 
      ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
      : "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1000&auto=format&fit=crop";
  };

  // Get user location
  const getUserLocation = () => {
    if (!profile) return "Location not set";
    return (
      [profile.city, profile.country].filter(Boolean).join(", ") ||
      "Location not set"
    );
  };

  // Get user email from user object
  const getUserEmail = () => {
    if (!profile || !profile.user) return "Email not available";
    return profile.user.email || "Email not available";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-8">
        <Toaster position="top-right" />
        <Navbar />
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 animate-spin mx-auto mb-4 sm:mb-6" />
            <div className="absolute inset-0 bg-blue-600/10 rounded-full animate-pulse"></div>
          </div>
          <p className="text-gray-600 font-medium text-base sm:text-lg">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-8">
        <Toaster position="top-right" />
        <Navbar />
        <div className="text-center bg-white rounded-3xl p-6 sm:p-12 shadow-2xl border border-gray-100 max-w-md w-full mx-4">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <User className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            Profile Not Found
          </h3>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-lg">
            Unable to load your profile information
          </p>
          <button
            onClick={fetchProfile}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-2xl font-semibold text-sm sm:text-lg shadow-lg shadow-blue-500/25 transition-all duration-300 w-full sm:w-auto"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navbar Component */}
      <Navbar />

      <Toaster position="top-right" />

      {/* Main Profile Content - Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pt-20 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8"
        >
          {/* Left Column - Profile Card & Basic Info */}
          <div className="lg:col-span-4">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl shadow-blue-500/10 border border-gray-100 overflow-hidden">
              {/* Profile Header */}
              <div className="relative h-32 sm:h-40 lg:h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
                <div className="absolute inset-0 bg-black/10"></div>

                {/* Edit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditRedirect}
                  className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6 bg-white/20 backdrop-blur-md text-white p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/20"
                >
                  <Edit size={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </motion.button>

                {/* Profile Image */}
                <div className="absolute -bottom-6 sm:-bottom-8 lg:-bottom-12 left-4 sm:left-6">
                  <div className="relative group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl border-4 border-white shadow-xl sm:shadow-2xl overflow-hidden bg-white">
                      <img
                        src={getProfileImage()}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300";
                        }}
                      />
                    </div>

                    {/* Photo Update Button */}
                    <button
                      onClick={handlePhotoUpdate}
                      className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-white p-1.5 sm:p-2 lg:p-2.5 rounded-full shadow-lg text-gray-600 hover:text-blue-600 hover:scale-110 transition-all duration-300"
                    >
                      <Camera
                        size={12}
                        className="sm:w-4 sm:h-4 lg:w-5 lg:h-5"
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="pt-12 sm:pt-14 lg:pt-16 p-4 sm:p-6 lg:p-8">
                {/* Name & Basic Info */}
                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {profile.name}
                  </h2>
                  <div className="flex items-center justify-center space-x-3 sm:space-x-4 text-gray-600 text-sm sm:text-base">
                    <div className="flex items-center space-x-1">
                      <Heart size={14} className="sm:w-4 sm:h-4 text-red-500" />
                      <span className="font-medium">
                        {profile.age || "N/A"} years
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User size={14} className="sm:w-4 sm:h-4 text-blue-500" />
                      <span className="font-medium capitalize">
                        {profile.gender || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profession */}
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 rounded-full text-xs sm:text-sm font-semibold">
                    <Briefcase
                      size={14}
                      className="sm:w-4 sm:h-4 lg:w-5 lg:h-5"
                    />
                    {profile.career || "Profession not set"}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-xl sm:rounded-2xl">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-1">
                      0
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Interests
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-xl sm:rounded-2xl">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 mb-1">
                      0
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Views
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="space-y-2 sm:space-y-3">
                  {/* Profile Completion */}
                  {profile.isCompleted !== undefined && (
                    <div
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
                        profile.isCompleted
                          ? "bg-green-50 border border-green-200"
                          : "bg-yellow-50 border border-yellow-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                            profile.isCompleted
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                        <span
                          className={`font-semibold text-xs sm:text-sm ${
                            profile.isCompleted
                              ? "text-green-700"
                              : "text-yellow-700"
                          }`}
                        >
                          Profile{" "}
                          {profile.isCompleted ? "Complete" : "Incomplete"}
                        </span>
                      </div>
                      <Star
                        size={14}
                        className={`sm:w-4 sm:h-4 ${
                          profile.isCompleted
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                      />
                    </div>
                  )}

                  {/* Approval Status */}
                  {profile.approvalStatus && (
                    <div
                      className={`flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
                        profile.approvalStatus === "approved"
                          ? "bg-green-50 border border-green-200"
                          : profile.approvalStatus === "pending"
                          ? "bg-yellow-50 border border-yellow-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Shield
                          size={14}
                          className={`sm:w-4 sm:h-4 ${
                            profile.approvalStatus === "approved"
                              ? "text-green-600"
                              : profile.approvalStatus === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        />
                        <span
                          className={`font-semibold text-xs sm:text-sm ${
                            profile.approvalStatus === "approved"
                              ? "text-green-700"
                              : profile.approvalStatus === "pending"
                              ? "text-yellow-700"
                              : "text-red-700"
                          }`}
                        >
                          {profile.approvalStatus.charAt(0).toUpperCase() +
                            profile.approvalStatus.slice(1)}
                        </span>
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          profile.approvalStatus === "approved"
                            ? "bg-green-500"
                            : profile.approvalStatus === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Edit Profile Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEditRedirect}
                  className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 sm:gap-3 group transition-all duration-300 text-sm sm:text-base"
                >
                  <Edit size={16} className="sm:w-5 sm:h-5" />
                  <span>Edit Profile</span>
                  <ChevronRight
                    size={16}
                    className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
                  />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Contact Information Card */}
              <div className="md:col-span-2 bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl shadow-blue-500/10 border border-gray-100 p-4 sm:p-6 lg:p-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                    <Mail
                      className="text-blue-600"
                      size={18}
                      className="sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                    />
                  </div>
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  {/* Email */}
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl hover:bg-blue-50 transition-all duration-300">
                    <div className="bg-gradient-to-br from-green-500 to-blue-500 p-2 sm:p-3 rounded-lg sm:rounded-xl text-white shadow-lg">
                      <Mail size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">
                        Email Address
                      </p>
                      <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                        {getUserEmail()}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl hover:bg-blue-50 transition-all duration-300">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 sm:p-3 rounded-lg sm:rounded-xl text-white shadow-lg">
                      <MapPin size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">
                        Location
                      </p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {getUserLocation()}
                      </p>
                    </div>
                  </div>

                  {/* Phone (if available) */}
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl hover:bg-blue-50 transition-all duration-300">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 sm:p-3 rounded-lg sm:rounded-xl text-white shadow-lg">
                      <Phone size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">
                        Phone
                      </p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {profile.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Language */}
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl hover:bg-blue-50 transition-all duration-300">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 sm:p-3 rounded-lg sm:rounded-xl text-white shadow-lg">
                      <Languages size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">
                        Mother Tongue
                      </p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {profile.motherTongue || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Details Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl shadow-blue-500/10 border border-gray-100 p-4 sm:p-6 lg:p-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                    <User
                      className="text-green-600"
                      size={18}
                      className="sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                    />
                  </div>
                  Personal Details
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  {/* Height */}
                  {profile.height && (
                    <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">
                        Height
                      </span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        {profile.height}
                      </span>
                    </div>
                  )}

                  {/* Date of Birth */}
                  {profile.dateOfBirth && (
                    <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">
                        Date of Birth
                      </span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        {new Date(profile.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {/* Religion */}
                  {profile.religion && (
                    <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">
                        Religion
                      </span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        {profile.religion}
                      </span>
                    </div>
                  )}

                  {/* Marital Status */}
                  {profile.maritalStatus && (
                    <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">
                        Marital Status
                      </span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base capitalize">
                        {profile.maritalStatus}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional & Additional Info Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl shadow-blue-500/10 border border-gray-100 p-4 sm:p-6 lg:p-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <div className="bg-purple-100 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                    <Briefcase
                      className="text-purple-600"
                      size={18}
                      className="sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                    />
                  </div>
                  Additional Information
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  {/* Education */}
                  {profile.education && (
                    <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">
                        Education
                      </span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        {profile.education}
                      </span>
                    </div>
                  )}

                  {/* Occupation */}
                  {profile.occupation && (
                    <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">
                        Occupation
                      </span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        {profile.occupation}
                      </span>
                    </div>
                  )}

                  {/* Income */}
                  {profile.income && (
                    <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">
                        Annual Income
                      </span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        {profile.income}
                      </span>
                    </div>
                  )}

                  {/* Father's Name */}
                  {profile.father && (
                    <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">
                        Father's Name
                      </span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base capitalize">
                        {profile.father}
                      </span>
                    </div>
                  )}

                  {/* Mother's Name */}
                  {profile.mother && (
                    <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                      <span className="text-gray-600 font-medium text-sm sm:text-base">
                        Mother's Name
                      </span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base capitalize">
                        {profile.mother}
                      </span>
                    </div>
                  )}

                  {/* Family Details */}
                  {profile.familyBackground && (
                    <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                      <span className="text-gray-600 font-medium text-sm sm:text-base block mb-2">
                        Family Background
                      </span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        {profile.familyBackground}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio Section */}
              {profile.bio && (
                <div className="md:col-span-2 bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl shadow-blue-500/10 border border-gray-100 p-4 sm:p-6 lg:p-8">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                      <Globe
                        className="text-indigo-600"
                        size={18}
                        className="sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                      />
                    </div>
                    About Me
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg bg-gray-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SimpleProfile;