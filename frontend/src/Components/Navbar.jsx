import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Search, User, Sparkles } from "lucide-react";
import assets from "../assets/assets";

function Navbar() {
  const location = useLocation();

  const navigation = [
    { name: "Discover", href: "/gallery", icon: Search, premium: true },
    { name: "Matches", href: "/matches", icon: Heart, premium: true },
    { name: "Profile", href: "/user-profile", icon: User, premium: true },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Top Logo Bar */}
      <div className="md:hidden bg-white shadow-2xl sticky top-0 z-50">
        <div className="px-4 h-16 flex items-center justify-center">
          <Link to="/" className="flex items-center justify-center">
            <img src={assets.logo1} alt="ANA Logo" className="h-12 object-contain" />
          </Link>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white shadow-2xl border-b border-gray-200/50 sticky top-0 z-50 backdrop-blur-lg bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src={assets.logo1}
                alt="ANA Logo"
                className="h-16 object-contain transition-all duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation Items */}
            <div className="flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-500 transform hover:scale-105 group ${
                      isActive
                        ? "bg-[#2D3E9F] text-white shadow-2xl shadow-blue-500/40"
                        : "text-gray-600 hover:text-blue-600 bg-white/80 hover:bg-white shadow-lg hover:shadow-blue-200/50 border border-gray-100/50"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-white"
                          : "text-current group-hover:scale-110 transition-transform"
                      }`}
                    />
                    <span className="font-semibold">{item.name}</span>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="relative">
          <div className="absolute inset-0 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/20 border border-white/50"></div>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-sm -z-10"></div>
          <div className="relative flex justify-around items-center px-3 py-5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative flex flex-col items-center justify-center w-20 h-20 transition-all duration-500 group ${
                    isActive ? "transform -translate-y-3" : ""
                  }`}
                >
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-[#2D3E9F] rounded-2xl shadow-2xl shadow-blue-500/50"></div>
                      <div className="absolute -inset-2 bg-[#2D3E9F] rounded-2xl blur-md opacity-30"></div>
                    </>
                  )}

                  <div
                    className={`relative z-10 p-2 rounded-2xl transition-all duration-500 ${
                      isActive
                        ? "text-white transform scale-110"
                        : "text-gray-600 bg-white/50 group-hover:bg-white group-hover:shadow-lg group-hover:scale-110"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    {item.premium && !isActive && (
                      <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-blue-500 fill-blue-500" />
                    )}
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-ping"></div>
                    )}
                  </div>

                  <span
                    className={`relative z-10 text-xs font-semibold mt-1 transition-all duration-500 ${
                      isActive
                        ? "text-white font-bold scale-110"
                        : "text-gray-600 group-hover:text-blue-600"
                    }`}
                  >
                    {item.name}
                  </span>

                  {isActive && (
                    <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-lg"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className=""></div>
    </>
  );
}

export default Navbar;
