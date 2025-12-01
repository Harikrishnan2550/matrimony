import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Briefcase,
  MapPin,
  User,
  CheckCircle,
  Loader2
} from 'lucide-react';
import API from "../api/axios";
import { toast } from 'sonner';
import Navbar from './Navbar';

export default function SimpleGallery() {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingInterest, setSendingInterest] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userInterests, setUserInterests] = useState(new Set());

  // Fetch current user info
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Fetch profiles and interests when user ID is available
  useEffect(() => {
    if (currentUserId) {
      fetchProfilesAndInterests();
    }
  }, [currentUserId]);

  // Fetch current user information
  const fetchCurrentUser = async () => {
    try {
      const response = await API.get("/auth/me");
      if (response.data && response.data._id) {
        const userId = response.data._id;
        setCurrentUserId(userId);
        
        // Clear any cached interests when user changes
        clearStoredInterests();
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      const tokenData = localStorage.getItem('userInfo');
      if (tokenData) {
        try {
          const userData = JSON.parse(tokenData);
          const userId = userData._id || userData.id;
          setCurrentUserId(userId);
          
          // Clear any cached interests when user changes
          clearStoredInterests();
        } catch (e) {
          console.error("Error parsing user info from storage:", e);
        }
      }
    }
  };

  // Fetch user's actual interests from backend
  const fetchUserInterests = async () => {
    try {
      console.log("Fetching user interests from backend...");
      const response = await API.get("/profile/my-interests");
      console.log("Fetched user interests from backend:", response.data);
      
      if (response.data && Array.isArray(response.data)) {
        const interestIds = response.data.map(interest => 
          interest.profileId || interest._id || interest
        );
        const interestsSet = new Set(interestIds);
        setUserInterests(interestsSet);
        
        // Also store in localStorage for quick access
        localStorage.setItem('userInterests', JSON.stringify([...interestsSet]));
        return interestsSet;
      }
      return new Set();
    } catch (error) {
      console.error("Error fetching user interests:", error);
      // If endpoint doesn't exist, use localStorage as fallback
      const storedInterests = getStoredInterests();
      setUserInterests(storedInterests);
      return storedInterests;
    }
  };

  // Combined function to fetch profiles and interests
  const fetchProfilesAndInterests = async () => {
    try {
      setLoading(true);
      
      // Fetch interests first
      const interests = await fetchUserInterests();
      
      // Then fetch profiles
      const response = await API.get("/profile/public");
      console.log("Public profiles fetched:", response.data);
      
      // Transform backend data to match frontend structure
      let transformedProfiles = response.data.map(profile => ({
        id: profile._id,
        category: profile.gender === 'female' ? 'Brides' : 'Grooms',
        name: profile.name,
        age: profile.age,
        profession: profile.career || 'Not specified',
        location: profile.city || profile.country || 'Location not specified',
        image: profile.profileImages && profile.profileImages.length > 0 
          ? `/uploads/${profile.profileImages[0]}` 
          : getDefaultImage(profile.gender),
        bio: profile.bio || 'No bio available',
        height: profile.height || 'Not specified',
        userId: profile.user?._id,
        interestSent: interests.has(profile._id) // Set based on actual interests
      }));
      
      // Filter out current user's profile
      if (currentUserId) {
        transformedProfiles = transformedProfiles.filter(profile => 
          profile.userId !== currentUserId
        );
      }

      setProfiles(transformedProfiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast.error("Failed to load profiles. Please try again later.");
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  // Clear stored interests (useful when user logs out/changes)
  const clearStoredInterests = () => {
    try {
      localStorage.removeItem('userInterests');
      setUserInterests(new Set());
      console.log("Cleared stored interests");
    } catch (error) {
      console.error("Error clearing stored interests:", error);
    }
  };

  // Get default image based on gender
  const getDefaultImage = (gender) => {
    const defaultMale = "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1000&auto=format&fit=crop";
    const defaultFemale = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop";
    return gender === 'female' ? defaultFemale : defaultMale;
  };

  // LocalStorage utilities for interest persistence
  const getStoredInterests = () => {
    try {
      const stored = localStorage.getItem('userInterests');
      if (stored) {
        const interestsArray = JSON.parse(stored);
        console.log("Loaded interests from localStorage:", interestsArray);
        return new Set(interestsArray);
      }
    } catch (error) {
      console.error("Error reading interests from localStorage:", error);
    }
    console.log("No interests found in localStorage");
    return new Set();
  };

  const storeInterest = (profileId) => {
    try {
      const currentInterests = getStoredInterests();
      currentInterests.add(profileId);
      localStorage.setItem('userInterests', JSON.stringify([...currentInterests]));
      setUserInterests(currentInterests);
      console.log("Stored interest for profile:", profileId);
    } catch (error) {
      console.error("Error storing interest:", error);
    }
  };

  // Remove interest from localStorage (for debugging)
  const removeStoredInterest = (profileId) => {
    try {
      const currentInterests = getStoredInterests();
      currentInterests.delete(profileId);
      localStorage.setItem('userInterests', JSON.stringify([...currentInterests]));
      setUserInterests(currentInterests);
      console.log("Removed interest for profile:", profileId);
    } catch (error) {
      console.error("Error removing interest:", error);
    }
  };

  // Send interest to a profile
  const handleSendInterest = async (profileId) => {
    try {
      setSendingInterest(true);
      
      console.log("Sending interest to profile:", profileId);
      console.log("Current user interests:", userInterests);
      
      // Make sure profileId is valid
      if (!profileId || typeof profileId !== 'string') {
        toast.error("Invalid profile ID");
        return;
      }

      // Check if already interested (based on backend data)
      if (userInterests.has(profileId)) {
        toast.info("💝 You've already shown interest in this profile");
        return;
      }

      // Send interest to backend
      const response = await API.post("/profile/interest", {
        profileId: profileId
      });
      
      toast.success("Interest sent successfully!");
      console.log("Interest sent response:", response.data);
      
      // Update local state immediately
      const newInterests = new Set(userInterests);
      newInterests.add(profileId);
      setUserInterests(newInterests);
      
      // Store in localStorage for persistence
      storeInterest(profileId);
      
      // Update profiles list
      setProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.id === profileId 
            ? { ...profile, interestSent: true }
            : profile
        )
      );
      
      // Update selected profile if open
      if (selectedProfile && selectedProfile.id === profileId) {
        setSelectedProfile(prev => ({
          ...prev,
          interestSent: true
        }));
      }

      // Refresh interests from backend to ensure sync
      setTimeout(() => {
        fetchUserInterests();
      }, 1000);
      
    } catch (error) {
      console.error("Error sending interest:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message;
        const status = error.response.status;
        
        console.log("Error details:", { errorMessage, status, data: error.response.data });
        
        if (errorMessage === "Already marked interested" || status === 409) {
          toast.info("💝 You've already shown interest in this profile");
          // Sync with backend - user actually has already shown interest
          storeInterest(profileId);
          fetchUserInterests(); // Refresh from backend
        } else if (status === 404) {
          toast.error("Profile not found or endpoint unavailable");
        } else if (status === 401) {
          toast.error("Please login to send interest");
          // Clear cached interests if unauthorized
          clearStoredInterests();
        } else if (status === 400) {
          toast.error(errorMessage || "Invalid request");
        } else {
          toast.error(errorMessage || "Failed to send interest");
        }
      } else if (error.request) {
        console.error("Network error:", error.request);
        toast.error("Network error. Please check your connection.");
      } else {
        console.error("Request setup error:", error.message);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setSendingInterest(false);
    }
  };

  // Debug function to reset interests (for testing)
  const debugResetInterests = () => {
    clearStoredInterests();
    toast.success("Interests reset for debugging");
    fetchProfilesAndInterests();
  };

  // Check if current user has already shown interest
  const hasShownInterest = (profile) => {
    const hasInterest = profile.interestSent || userInterests.has(profile.id);
    console.log(`Profile ${profile.id} interest status:`, hasInterest);
    return hasInterest;
  };

  // Lightbox Navigation
  const handleNext = (e) => {
    e.stopPropagation();
    const currentIndex = profiles.findIndex(p => p.id === selectedProfile.id);
    const nextIndex = (currentIndex + 1) % profiles.length;
    setSelectedProfile(profiles[nextIndex]);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const currentIndex = profiles.findIndex(p => p.id === selectedProfile.id);
    const prevIndex = (currentIndex - 1 + profiles.length) % profiles.length;
    setSelectedProfile(profiles[prevIndex]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
      `}</style>
      
      <Navbar />
    
      
      {/* Hero Section */}
      <div className="relative bg-[#2D3E9F] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse" style={{animationDuration: '6s'}}></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/10 opacity-0 animate-fade-in-up">
            <Search className="w-4 h-4 text-blue-300" />
            <span className="text-sm font-medium text-blue-100">Browse Profiles</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight opacity-0 animate-fade-in-up animation-delay-100">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">Perfect Match</span>
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up animation-delay-200">
            Explore verified profiles from our community. {profiles.length} profiles available.
          </p>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {profiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {currentUserId ? "No Other Profiles Available" : "No Profiles Available"}
              </h3>
              <p className="text-gray-600">
                {currentUserId 
                  ? "Your profile is hidden from this view. Check back later for new profiles." 
                  : "There are no approved profiles available at the moment."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map((profile, index) => (
              <div 
                key={profile.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 cursor-pointer border border-gray-100 flex flex-col opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedProfile(profile)}
              >
                {/* Image Section */}
                <div className="aspect-[3/4] overflow-hidden relative bg-gray-100">
                  <img 
                    src={profile.image} 
                    alt={profile.name} 
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* Verified Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 shadow-sm transform group-hover:translate-y-1 transition-transform duration-300">
                    <CheckCircle className="w-3 h-3 text-blue-600 fill-blue-100" />
                    <span className="text-xs font-bold text-blue-900">Verified</span>
                  </div>

                  {/* Quick Actions Overlay */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 delay-100">
                    <button 
                      className={`p-2 backdrop-blur-md rounded-full transition shadow-lg transform hover:scale-110 active:scale-95 ${
                        hasShownInterest(profile) 
                          ? 'bg-green-500/80 text-white cursor-default' 
                          : 'bg-white/20 text-white hover:bg-white hover:text-red-500'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!hasShownInterest(profile)) {
                          handleSendInterest(profile.id);
                        }
                      }}
                      disabled={hasShownInterest(profile)}
                    >
                      <Heart className={`w-4 h-4 ${hasShownInterest(profile) ? 'fill-white' : ''}`} />
                    </button>
                  </div>

                  {/* Hover Details */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3 h-3 text-blue-300" />
                      <span className="text-xs text-blue-100 truncate">{profile.location}</span>
                    </div>
                  </div>
                </div>

                {/* Info Card Section */}
                <div className="p-4 flex flex-col flex-grow bg-white relative z-10 transition-colors duration-300 group-hover:bg-blue-50/30">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {profile.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                        <span>{profile.age} Yrs</span>
                        <span>•</span>
                        <span>{profile.height}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto space-y-2 pt-3 border-t border-gray-100 group-hover:border-blue-100 transition-colors duration-300">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      <span className="truncate">{profile.profession}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-indigo-500" />
                      <span className="truncate">{profile.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 animate-fade-in">
          
          <button 
            onClick={() => setSelectedProfile(null)}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition z-50 transform hover:rotate-90 duration-300"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] shadow-2xl animate-scale-in">
            
            {/* Modal Image */}
            <div className="md:w-1/2 relative bg-gray-100 h-64 md:h-auto group">
              <img 
                src={selectedProfile.image} 
                alt={selectedProfile.name}
                className="w-full h-full object-cover"
              />
              {profiles.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={handlePrev}
                    className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition hover:scale-110"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition hover:scale-110"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>

            {/* Modal Details */}
            <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-2 uppercase tracking-wide animate-pulse">
                    {selectedProfile.category}
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900">{selectedProfile.name}</h2>
                  <p className="text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> <span>{selectedProfile.location}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{selectedProfile.age}</p>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Years Old</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors duration-300">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Professional Info</h4>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">{selectedProfile.profession}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors duration-300">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Physical Details</h4>
                  <div className="flex items-center gap-3 text-gray-700">
                    <User className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Height: {selectedProfile.height}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wider">About</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {selectedProfile.bio}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100 flex gap-3">
                  <button 
                    onClick={() => handleSendInterest(selectedProfile.id)}
                    disabled={sendingInterest || hasShownInterest(selectedProfile)}
                    className={`flex-1 font-bold py-3 rounded-xl transition shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                      hasShownInterest(selectedProfile)
                        ? 'bg-green-600 text-white shadow-green-600/20 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 hover:shadow-blue-600/40'
                    }`}
                  >
                    {sendingInterest ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : hasShownInterest(selectedProfile) ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Interest Sent
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4" />
                        Send Interest
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}