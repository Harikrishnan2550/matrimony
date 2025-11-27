import express from "express";
import {
  upsertMyProfile,
  getMyProfile,
  getAllProfiles,
  getPendingProfiles,
  approveProfile,
  rejectProfile,
  getProfileByClientId,
  deleteClient,
  uploadImages,
  deleteImage,
  sendInterest,
  getInterestsByUser,
  getPublicProfiles, // Add this
  getMyInterests,
  withdrawInterest,
  withdrawInterestById,
  editMyProfile
} from "../controllers/profileController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// PROFILE CRUD
router.post("/", protect, upsertMyProfile);
router.get("/me", protect, getMyProfile);
router.put("/edit-profile", protect, upload.array("images", 4), editMyProfile);


// PUBLIC PROFILES (No authentication required)
router.get("/public", getPublicProfiles); // Add this public route

// IMAGE UPLOAD
router.post("/upload-images", protect, upload.array("images", 4), uploadImages);
router.delete("/delete-image", protect, deleteImage);

// ADMIN CONTROLS
router.get("/pending", protect, admin, getPendingProfiles);
router.get("/all", protect, admin, getAllProfiles); // Keep this for admin only
router.patch("/approve/:id", protect, admin, approveProfile);
router.patch("/reject/:id", protect, admin, rejectProfile);
router.get("/client/:clientId", protect, admin, getProfileByClientId);
router.delete("/delete/:id", protect, admin, deleteClient);

// USER — See the profiles he marked as interested
router.get("/my-interests", protect, getMyInterests);

// 💙 INTEREST FEATURE
router.post("/interest", protect, sendInterest);
router.get("/interests/:userId", protect, admin, getInterestsByUser);
router.delete("/interest", protect, withdrawInterest); // New route
router.delete("/interest/:interestId", protect, withdrawInterestById);

export default router;
