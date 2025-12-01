import { Navigate } from "react-router-dom";
import API from "../api/axios";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await API.get("/profile/me");
        if (res.data?.approvalStatus === "approved") {
          setAllowed(true);
        } else {
          setAllowed(false);
        }
      } catch {
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

  // ❌ Not approved → redirect to profile page
  return allowed ? children : <Navigate to="/profile" replace />;
}
