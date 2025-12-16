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
  adminSignup,
  adminChangePassword,
  adminChangeEmail
} from "../controllers/authController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   USER ROUTES
========================= */
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);

/* =========================
   ADMIN ROUTES
========================= */

// First-time admin check
router.get("/admin/setup-check", checkAdminSetup);

// First-time admin signup (ONLY ONCE)
router.post("/admin/signup", adminSignup);

// Admin login
router.post("/admin/login", adminLogin);

// Admin forgot password (OTP)
router.post("/admin/forgot-password", adminForgotPassword);

// Admin reset password using OTP
router.post("/admin/reset-password", adminResetPassword);

// Admin change password (dashboard)
router.put(
  "/admin/change-password",
  protect,
  admin,
  adminChangePassword
);

// Admin change email (dashboard)
router.put(
  "/admin/change-email",
  protect,
  admin,
  adminChangeEmail
);

// Test admin access
router.get("/admin/check", protect, admin, (req, res) => {
  res.json({ message: "Admin access verified" });
});

export default router;

 