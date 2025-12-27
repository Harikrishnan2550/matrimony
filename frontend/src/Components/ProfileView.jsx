import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import getImageUrl from "../utils/getImageUrl";
import Navbar from "../Components/Navbar";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  Loader2,
  Heart,
  CheckCircle,
  Briefcase,
  Users,
  Search,
  ArrowLeft,
  Info as InfoIcon,
  Home,
  BookOpen,
  Coffee,
  Cigarette,
  Baby,
  GraduationCap,
  Ruler,
  Weight as WeightIcon
} from "lucide-react";
import { toast } from "sonner";

export default function ProfileView() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sendingInterest, setSendingInterest] = useState(false);
  const [interestSent, setInterestSent] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchCurrentUser();
    setTimeout(() => setIsVisible(true), 100);
  }, [profileId]);

  useEffect(() => {
    if (profile?.interestedUsers && currentUserId) {
      setInterestSent(profile.interestedUsers.includes(currentUserId));
    }
  }, [profile, currentUserId]);

  const fetchCurrentUser = async () => {
    try {
      const res = await API.get("/auth/me");
      setCurrentUserId(res.data._id);
    } catch (err) {
      console.error("Failed to fetch current user", err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/profile/public`);
      const found = res.data.find((p) => p._id === profileId);
      setProfile(found);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInterest = async () => {
    if (!profile?._id) return;
    try {
      setSendingInterest(true);
      await API.post("/profile/interest", { profileId: profile._id });
      toast.success("💝 Interest sent successfully");
      setInterestSent(true);
    } catch (error) {
      const msg = error.response?.data?.message;
      if (msg === "Already interested") {
        setInterestSent(true);
        toast.info("💝 Interest already sent");
      } else {
        toast.error("Failed to send interest");
      }
    } finally {
      setSendingInterest(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-700 font-semibold text-lg">Profile not found</p>
        </div>
      </div>
    );
  }

  const images = profile.profileImages?.length > 0
    ? profile.profileImages.map((img) => getImageUrl(img))
    : ["/icon.jpg"];

  const next = () => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prev = () => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all mb-6 font-medium group transform ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
          } duration-500`}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Profiles
        </button>

        {/* Main Content - Single Column Layout */}
        <div className={`space-y-6 transform transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}>
          
          {/* Hero Section - Image Gallery + Name */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Image Gallery */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-700 group">
              <div className="relative w-full flex items-center justify-center py-8" style={{ minHeight: '350px', maxHeight: '450px' }}>
                <img
                  src={images[activeIndex]}
                  alt={profile.name}
                  className="max-w-full max-h-[400px] w-auto h-auto object-contain transition-all duration-500"
                  onError={(e) => (e.target.src = "/icon.jpg")}
                />

                {/* Navigation Controls */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-4 z-20 bg-white/90 hover:bg-white p-3 rounded-full text-gray-800 transition-all shadow-lg hover:scale-110 active:scale-95"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-4 z-20 bg-white/90 hover:bg-white p-3 rounded-full text-gray-800 transition-all shadow-lg hover:scale-110 active:scale-95"
                    >
                      <ChevronRight size={24} />
                    </button>

                    {/* Image Counter & Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
                      <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium">
                        {activeIndex + 1} / {images.length}
                      </div>
                      <div className="flex gap-2">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              i === activeIndex ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Profile Header */}
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                  <div className="flex flex-wrap gap-3 text-gray-600">
                    <span className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                      <User className="w-4 h-4 text-blue-600" />
                      {profile.age} Years
                    </span>
                    <span className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      {profile.city}, {profile.country}
                    </span>
                    <span className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                      <Briefcase className="w-4 h-4 text-green-600" />
                      {profile.career}
                    </span>
                  </div>
                </div>

                {/* Send Interest Button */}
                <button
                  onClick={handleSendInterest}
                  disabled={sendingInterest || interestSent}
                  className={`flex-shrink-0 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-3 text-lg transform hover:scale-105 active:scale-95 ${
                    interestSent
                      ? "bg-green-600 text-white cursor-default"
                      : "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white"
                  }`}
                >
                  {sendingInterest ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : interestSent ? (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      Interest Sent
                    </>
                  ) : (
                    <>
                      <Heart className="w-6 h-6" />
                      Send Interest
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {profile.bio && (
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 shadow-xl text-white transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <InfoIcon className="w-6 h-6" />
                About Me
              </h2>
              <p className="text-blue-50 text-lg leading-relaxed italic">"{profile.bio}"</p>
            </div>
          )}

          {/* Personal Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600" />
                Basic Information
              </h2>
              <div className="space-y-4">
                <InfoRow icon={<Home className="w-5 h-5 text-blue-500" />} label="Marital Status" value={profile.relationshipStatus} />
                <InfoRow icon={<BookOpen className="w-5 h-5 text-purple-500" />} label="Mother Tongue" value={profile.motherTongue} />
                <InfoRow icon={<Search className="w-5 h-5 text-green-500" />} label="Religion" value={profile.religion} />
                <InfoRow icon={<GraduationCap className="w-5 h-5 text-orange-500" />} label="Education" value={profile.education} />
                <InfoRow icon={<Ruler className="w-5 h-5 text-pink-500" />} label="Height" value={profile.height} />
                <InfoRow icon={<WeightIcon className="w-5 h-5 text-indigo-500" />} label="Weight" value={profile.weight} />
              </div>
            </div>

            {/* Lifestyle */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <Coffee className="w-6 h-6 text-orange-600" />
                Lifestyle
              </h2>
              <div className="space-y-4">
                <InfoRow icon={<Cigarette className="w-5 h-5 text-red-500" />} label="Smoking" value={profile.smoking} />
                <InfoRow icon={<Coffee className="w-5 h-5 text-amber-500" />} label="Alcohol" value={profile.alcohol} />
                <InfoRow icon={<Baby className="w-5 h-5 text-blue-500" />} label="Children" value={profile.children} />
              </div>
            </div>
          </div>

          {/* Family Background */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Family Background
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FamilyCard
                role="Father"
                name={profile.father}
                occupation={profile.fatherOccupation}
                gradient="from-blue-500 to-blue-600"
              />
              <FamilyCard
                role="Mother"
                name={profile.mother}
                occupation={profile.motherOccupation}
                gradient="from-purple-500 to-purple-600"
              />
              <FamilyCard
                role="Siblings"
                name={`${profile.siblings ?? 0} Siblings`}
                gradient="from-pink-500 to-pink-600"
              />
            </div>
          </div>

          {/* Partner Preferences */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-xl text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Search className="w-6 h-6 text-yellow-400" />
              Partner Preferences
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <PrefCard label="Gender" value={profile.partnerPreferences?.interestedIn} />
              <PrefCard label="Age Range" value={profile.partnerPreferences?.ageMin ? `${profile.partnerPreferences.ageMin}-${profile.partnerPreferences.ageMax} years` : "Any"} />
              <PrefCard label="Religion" value={profile.partnerPreferences?.religion} />
              <PrefCard label="Education" value={profile.partnerPreferences?.education} />
              <PrefCard label="Location" value={profile.partnerPreferences?.locationPreference} />
              <PrefCard label="Language" value={profile.partnerPreferences?.language} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Info Row Component
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group cursor-default">
    <div className="flex items-center gap-3">
      <div className="group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-gray-600 font-medium">{label}</span>
    </div>
    <span className="font-bold text-gray-900 capitalize">{value || "—"}</span>
  </div>
);

// Family Card Component
const FamilyCard = ({ role, name, occupation, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-default`}>
    <p className="text-xs uppercase tracking-widest opacity-80 mb-2">{role}</p>
    <p className="font-bold text-xl mb-1">{name || "Not specified"}</p>
    {occupation && <p className="text-sm opacity-90">{occupation}</p>}
  </div>
);

// Preference Card Component
const PrefCard = ({ label, value }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 hover:bg-white/20 transition-all duration-300 cursor-default group">
    <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{label}</p>
    <p className="font-bold text-white text-lg capitalize group-hover:text-yellow-300 transition-colors">{value || "Any"}</p>
  </div>
);