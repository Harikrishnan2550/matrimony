import { Navigate } from "react-router-dom";
// ✅ 1. Use the central API instance (auto-handles token & domain)
import API from "../api/axios"; 
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // ✅ 2. Use relative path (API.baseURL handles the domain)
        const res = await API.get("/profile/me");
        
        // Only allow access if explicitly approved
        if (res.data?.approvalStatus === "approved") {
          setAllowed(true);
        } else {
          setAllowed(false);
        }
      } catch (error) {
        console.error("Protected Route Error:", error);
        setAllowed(false);
      }
    };
    
    checkAccess();
  }, []);

  // Show small loader while checking status
  if (allowed === null)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Checking access...
      </div>
    );

  // ❌ Not approved → redirect to profile page (where they see "Pending" screen)
  return allowed ? children : <Navigate to="/profile" replace />;
}