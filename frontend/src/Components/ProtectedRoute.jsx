import { Navigate } from "react-router-dom";
import API from "../api/axios";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [allowed, setAllowed] = useState(null);
  const token = localStorage.getItem("token");

  // 1️⃣ If NO TOKEN → redirect to LOGIN
  if (!token) return <Navigate to="/" replace />;

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await API.get("/profile/me");
        const profile = res.data;

        // 2️⃣ Check if profile exists
        if (!profile) {
          setAllowed(false);
          return;
        }

        // 3️⃣ If form not completed → redirect to profile form
        if (!profile.isCompleted) {
          setAllowed(false);
          return;
        }

        // 4️⃣ If admin has not approved → redirect to profile page
        if (profile.approvalStatus !== "approved") {
          setAllowed(false);
          return;
        }

        // 5️⃣ All checks passed → allow access
        setAllowed(true);

      } catch (error) {
        console.log("Protected Route Error:", error);
        setAllowed(false);
      }
    };

    checkAccess();
  }, []);

  // Small loading indicator
  if (allowed === null)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Checking access...
      </div>
    );

  // ❌ Not allowed → send to profile page to view pending status
  return allowed ? children : <Navigate to="/profile" replace />;
}
