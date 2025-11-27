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
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

// API Configuration
const API = axios.create({
  baseURL: "http://localhost:4000/api",
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

  const SERVER_URL = "http://localhost:4000";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get("/profile/me");
      console.log("Profile API Response:", response.data);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile", {
        description: "Please try again later"
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
      description: "You'll be able to update photos in the next update"
    });
  };

  // Get profile image URL
  const getProfileImage = () => {
    if (!profile) return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300";
    
    if (profile.profileImages && profile.profileImages.length > 0) {
      const imagePath = profile.profileImages[0];
      if (imagePath.startsWith('http')) {
        return imagePath;
      } else {
        const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
        return `${SERVER_URL}/${cleanPath}`;
      }
    }
    
    // Default image based on gender
    return profile.gender === 'female' 
      ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
      : "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1000&auto=format&fit=crop";
  };

  // Get user location
  const getUserLocation = () => {
    if (!profile) return "Location not set";
    return [profile.city, profile.country].filter(Boolean).join(', ') || "Location not set";
  };

  // Get user email from user object
  const getUserEmail = () => {
    if (!profile || !profile.user) return "Email not available";
    return profile.user.email || "Email not available";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Toaster position="top-center" />
        <Navbar />
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Toaster position="top-center" />
        <Navbar />
        <div className="text-center bg-white rounded-3xl p-8 shadow-xl">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
          <p className="text-gray-500 text-sm mb-4">Unable to load your profile information</p>
          <button 
            onClick={fetchProfile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar Component */}
      <Navbar />
      
      <Toaster position="top-center" />

      {/* Main Profile Content */}
      <div className="flex items-center justify-center p-4 pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white w-full max-w-sm rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* 1. Cover Image Area */}
          <div className="relative h-32 bg-[#2D3E9F]">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* 2. Avatar & Basic Info */}
          <div className="px-6 relative">
            
            {/* Avatar Wrapper */}
            <div className="flex justify-between items-end -mt-12 mb-4">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
                  <img 
                    src={getProfileImage()} 
                    alt={profile.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300";
                    }}
                  />
                </div>
                
                {/* Quick Photo Edit Button */}
                <button 
                  onClick={handlePhotoUpdate}
                  className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <Camera size={16} />
                </button>
              </div>

              {/* Top Right 'Edit' Icon Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleEditRedirect}
                className="mb-1 bg-indigo-50 text-indigo-600 p-2 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                <Edit size={20} />
              </motion.button>
            </div>

            {/* Text Details */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                <Briefcase size={14} />
                {profile.career || "Profession not set"}
              </p>
              {profile.age && (
                <p className="text-gray-500 text-sm mt-1">
                  {profile.age} years old
                </p>
              )}
            </div>

            {/* 3. Quick Stats / Info Rows */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-500">
                  <MapPin size={18} />
                </div>
                <div className="text-sm font-medium flex-1">
                  {getUserLocation()}
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-500">
                  <Mail size={18} />
                </div>
                <div className="text-sm font-medium flex-1 truncate">
                  {getUserEmail()}
                </div>
              </div>

              {/* Additional Profile Info */}
              {profile.height && (
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-500">
                    <User size={18} />
                  </div>
                  <div className="text-sm font-medium">
                    Height: {profile.height}
                  </div>
                </div>
              )}

              {profile.motherTongue && (
                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-500">
                    <Briefcase size={18} />
                  </div>
                  <div className="text-sm font-medium">
                    Language: {profile.motherTongue}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Main Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEditRedirect}
              className="w-full mb-6 bg-slate-900 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 group"
            >
              <span>Edit Profile</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Profile Completion Status */}
            {profile.isCompleted !== undefined && (
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  <div className={`w-2 h-2 rounded-full ${profile.isCompleted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  {profile.isCompleted ? 'Profile Complete' : 'Profile Incomplete'}
                </div>
              </div>
            )}

            {/* Approval Status */}
            {profile.approvalStatus && (
              <div className="text-center mb-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                  profile.approvalStatus === 'approved' 
                    ? 'bg-green-50 text-green-700' 
                    : profile.approvalStatus === 'pending'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    profile.approvalStatus === 'approved' 
                      ? 'bg-green-500' 
                      : profile.approvalStatus === 'pending'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}></div>
                  Status: {profile.approvalStatus.charAt(0).toUpperCase() + profile.approvalStatus.slice(1)}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SimpleProfile;