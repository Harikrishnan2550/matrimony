// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login_Signup from "./Components/Login_Signup";
// import Form from "./Components/Form";
// import GalleryPage from "./Components/GalleryPage";
// import Matches from "./Components/Matches";
// import AdminDashboard from "./Components/AdminDashboard";
// import AdminViewClient from "./Components/AdminViewClient";
// import SimpleProfile from "./Components/SimpleProfile";
// import ProtectedRoute from "./Components/ProtectedRoute";
// import AdminLogin from "./Components/AdminLogin";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* PUBLIC ROUTES */}
//         <Route path="/" element={<Login_Signup />} />

//         {/* Profile form must be accessible even if user not approved */}
//         <Route path="/profile" element={<Form />} />

//         {/* PROTECTED ROUTES (Only logged-in + approved users) */}
//         <Route
//           path="/gallery"
//           element={
//             <ProtectedRoute>
//               <GalleryPage />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/user-profile"
//           element={
//             <ProtectedRoute>
//               <SimpleProfile />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/matches"
//           element={
//             <ProtectedRoute>
//               <Matches />
//             </ProtectedRoute>
//           }
//         />

//         {/* ADMIN ROUTES */}
//         <Route path="/admin/dashboard" element={<AdminDashboard />} />
//         <Route path="/admin/user/:clientId" element={<AdminViewClient />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login_Signup from "./Components/Login_Signup";
import Form from "./Components/Form";
import GalleryPage from "./Components/GalleryPage";
import Matches from "./Components/Matches";
import AdminDashboard from "./Components/AdminDashboard";
import AdminViewClient from "./Components/AdminViewClient";
import SimpleProfile from "./Components/SimpleProfile";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminLogin from "./Components/AdminLogin";
import AdminForgotPassword from "./Components/AdminForgotPassword";
import AdminSetup from "./Components/AdminSetup";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login_Signup />} />

        {/* Profile form must be accessible even if user not approved */}
        <Route path="/profile" element={<Form />} />

        {/* PROTECTED ROUTES (Only logged-in + approved users) */}
        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <GalleryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-profile"
          element={
            <ProtectedRoute>
              <SimpleProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />   {/* ✅ ADD THIS */}
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/user/:clientId" element={<AdminViewClient />} />
        <Route path="/admin/setup" element={<AdminSetup />} />

      </Routes>
    </BrowserRouter>
  );
}
