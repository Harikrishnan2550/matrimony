import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  MapPin, 
  Briefcase, 
  User, 
  Loader2, 
  X,
  CheckCircle,
  XCircle
} from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import Navbar from './Navbar';

// API Configuration
const API = axios.create({
  baseURL: "https://login.akhilendianadar.in/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const SERVER_URL = "/api";

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      
      const toastId = toast.loading('Loading your interests...');
      
      const response = await API.get('/profile/my-interests');
      
      if (!response.data || !Array.isArray(response.data)) {
        setMatches([]);
        toast.info('No interests found. Start exploring profiles!', { id: toastId });
        return;
      }

      const transformedMatches = response.data.map((item, index) => {
        const profile = item.profileId || item;
        
        let profileImage = '';
        if (profile.profileImages && profile.profileImages.length > 0) {
          const imagePath = profile.profileImages[0];
          if (imagePath.startsWith('http')) {
            profileImage = imagePath;
          } else {
            const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
            profileImage = `${SERVER_URL}/${cleanPath}`;
          }
        } else {
          profileImage = getDefaultImage(profile.gender);
        }
        
        return {
          id: item._id || profile._id || `match-${index}`,
          targetProfileId: profile._id,
          name: profile.name || 'Unknown User',
          age: profile.age || 'N/A',
          profession: profile.career || 'Not specified',
          location: profile.city && profile.country 
            ? `${profile.city}, ${profile.country}`
            : profile.city || profile.country || 'Location hidden',
          image: profileImage,
          bio: profile.bio || 'No bio available',
          height: profile.height || 'N/A',
          gender: profile.gender || 'Not specified',
          status: item.status || 'pending',
          sentAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently',
          isMutual: false
        };
      });

      setMatches(transformedMatches);
      
      if (transformedMatches.length === 0) {
        toast.info('No interests found. Start exploring profiles!', { id: toastId });
      } else {
        toast.success(`Found ${transformedMatches.length} interests!`, { id: toastId });
      }
      
    } catch (error) {
      console.error('Error fetching matches:', error);
      
      if (error.response?.status === 404) {
        toast.info('No interests found yet. Start exploring profiles!');
      } else if (error.response?.status === 401) {
        toast.error('Please login again to view your matches');
        setTimeout(() => window.location.href = '/login', 2000);
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Please check your permissions.');
      } else {
        toast.error('Failed to load matches. Please check your connection.');
      }
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultImage = (gender) => {
    return gender === 'female' 
      ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
      : "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1000&auto=format&fit=crop";
  };

  const handleStartChat = (match) => {
    toast.info('Chat feature coming soon!', {
      description: `You'll be able to chat with ${match.name} in the next update.`,
      duration: 3000,
      action: {
        label: 'OK',
        onClick: () => console.log('OK clicked')
      }
    });
  };

  const handleBrowseProfiles = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          window.location.href = '/gallery';
          resolve();
        }, 1000);
      }),
      {
        loading: 'Redirecting to profiles...',
        success: 'Taking you to browse profiles!',
        error: 'Failed to redirect'
      }
    );
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'accepted':
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="w-3 h-3" /> Matched
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" /> Declined
          </span>
        );
      default:
        return null; // Don't show anything for pending status
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center animate-in fade-in duration-500">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Loading your interests...</p>
          </div>
        </div>
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <Toaster position="top-center" richColors />
      
      {/* Simple Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">My Sent Interests</h1>
            <p className="text-gray-500 text-sm mt-1">
              You have expressed interest in <span className="font-semibold text-blue-600">{matches.length}</span> people
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {matches.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No interests sent yet</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
              Start exploring profiles and send interests to see them here.
            </p>
            <button 
              onClick={handleBrowseProfiles}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300"
            >
              Browse Profiles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {matches.map((match, index) => (
              <div
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col"
              >
                {/* Image Area */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                  <img
                    src={match.image}
                    alt={match.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.target.src = getDefaultImage(match.gender);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* Status Badge - Only show for accepted/rejected */}
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(match.status)}
                  </div>

                  {/* Date Sent */}
                  <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-md px-2 py-1 rounded-md text-xs text-white border border-white/10">
                    Sent: {match.sentAt}
                  </div>

                  {/* Overlay Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-bold truncate">{match.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-200">
                      <MapPin className="w-3 h-3" /> {match.location}
                    </div>
                  </div>
                </div>

                {/* Details & Action */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="mb-4 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                       <Briefcase className="w-4 h-4 text-blue-500" />
                       <span className="truncate">{match.profession}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                       <User className="w-4 h-4 text-purple-500" />
                       <span>{match.age} Yrs • {match.height}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-gray-100">
                    {match.status === 'accepted' ? (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleStartChat(match);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-all duration-300"
                      >
                        <MessageCircle className="w-4 h-4" /> Message
                      </button>
                    ) : (
                      <div className="text-center text-gray-400 text-sm ">
                        
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Image */}
            <div className="md:w-2/5 relative h-64 md:h-auto bg-gray-200">
              <img
                src={selectedMatch.image}
                alt={selectedMatch.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = getDefaultImage(selectedMatch.gender);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
              <button
                onClick={() => setSelectedMatch(null)}
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition md:hidden backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="md:w-3/5 p-6 md:p-8 overflow-y-auto bg-white flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                   <div className="mb-2">
                     {getStatusBadge(selectedMatch.status)}
                   </div>
                   <h2 className="text-2xl font-bold text-gray-900">{selectedMatch.name}</h2>
                   <p className="text-gray-500 flex items-center gap-1 text-sm mt-1">
                     <MapPin className="w-4 h-4" /> {selectedMatch.location}
                   </p>
                </div>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="hidden md:block text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Career</p>
                    <p className="font-semibold text-gray-900 text-sm">{selectedMatch.profession}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Age / Height</p>
                    <p className="font-semibold text-gray-900 text-sm">{selectedMatch.age} Yrs, {selectedMatch.height}</p>
                  </div>
                </div>
                
                <div>
                   <h4 className="text-sm font-bold text-gray-900 mb-2">About</h4>
                   <p className="text-gray-600 text-sm leading-relaxed">{selectedMatch.bio}</p>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100">
                
                    <button 
                      onClick={() => {
                        handleStartChat(selectedMatch);
                        setSelectedMatch(null);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" /> Start Conversation
                    </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}