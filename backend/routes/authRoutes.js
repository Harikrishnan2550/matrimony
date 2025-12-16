// import express from "express";
// import { signup, login, getMe } from "../controllers/authController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/signup", signup);
// router.post("/login", login);
// router.get("/me", protect, getMe);

// export default router;



import express from "express";
import {
  signup,
  login,
  getMe,
  adminLogin,
  adminForgotPassword,
  adminResetPassword,
  checkAdminSetup,
  adminSignup
} from "../controllers/authController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   USER ROUTES
========================= */

// User Signup
router.post("/signup", signup);

// User Login
router.post("/login", login);

// Get logged-in user (user or admin)
router.get("/me", protect, getMe);

/* =========================
   ADMIN ROUTES
========================= */

// Admin Login (NO signup)
router.post("/admin/login", adminLogin);

// Admin Forgot Password (Send OTP)
router.post("/admin/forgot-password", adminForgotPassword);

// Admin Reset Password (Verify OTP + Set new password)
router.post("/admin/reset-password", adminResetPassword);

router.get("/admin/setup-check", checkAdminSetup);

router.post("/admin/signup", adminSignup);

// Example protected admin route (for testing)
router.get("/admin/check", protect, admin, (req, res) => {
  res.json({
    message: "Admin access verified",
    admin: req.user,
  });
});

export default router;
