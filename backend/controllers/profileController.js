// import Profile from "../models/Profile.js";
// import User from "../models/User.js";
// import fs from "fs";
// import path from "path";


// const HOST = "https://login.akhilendianadar.in";

// const toFullUrl = (img) => {
//   if (!img) return img;
//   if (img.startsWith("http")) return img;
//   return `${HOST}/${img.replace(/\\/g, "/")}`;
// };

// // ========================= CREATE / UPDATE PROFILE =========================
// export const upsertMyProfile = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // Fetch existing user
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const {
//       address,
//       gender,
//       birthday,
//       age,
//       height,
//       weight,
//       motherTongue,
//       career,
//       bio,
//       father, // <--- ADDED
//       mother, // <--- ADDED
//       relationshipStatus,
//       country,
//       city,
//       education,
//       professionalStatus,
//       otherProfession,
//       children,
//       smoking,
//       alcohol,
//       partnerPreferences,
//     } = req.body;

//     const profileData = {
//       user: userId,
//       name: user.name,
//       phone: user.phone,
//       address,
//       gender,
//       birthday,
//       age,
//       height,
//       weight,
//       motherTongue,
//       career,
//       religion: "Hinduism",
//       bio,
//       father, // <--- ADDED
//       mother, // <--- ADDED
//       relationshipStatus,
//       country,
//       city,
//       education,
//       professionalStatus,
//       otherProfession,
//       children,
//       smoking,
//       alcohol,
//       partnerPreferences: {
//         ...partnerPreferences,
//         religion: "Hinduism",
//       },
//       isCompleted: true,
//       approvalStatus: "pending", // Admin must approve before user access
//     };

//     const profile = await Profile.findOneAndUpdate(
//       { user: userId },
//       profileData,
//       { new: true, upsert: true, setDefaultsOnInsert: true }
//     ).populate("user", "name email phone clientId");

//     return res.status(200).json({
//       message: "Profile submitted successfully. Awaiting admin approval.",
//       profile,
//     });
//   } catch (error) {
//     console.error("❌ Error saving profile:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // ========================= GET USER'S OWN PROFILE =========================
// export const getMyProfile = async (req, res) => {
//   try {
//     const profile = await Profile.findOne({ user: req.user._id }).populate(
//       "user",
//       "name email phone clientId approved"
//     );

//     if (!profile) return res.status(404).json({ message: "Profile not found" });

//     profile.profileImages = profile.profileImages.map(toFullUrl);
//     return res.status(200).json(profile);
//   } catch (error) {
//     console.error("❌ Error fetching profile:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // ========================= ADMIN: GET ALL PROFILES =========================
// export const getAllProfiles = async (req, res) => {
//   try {
//     const profiles = await Profile.find()
//       .select("-phone -address") // 🚫 hide phone & address
//       .populate("user", "clientId name") // keep only safe fields
//       .sort({ createdAt: -1 });

//     return res.status(200).json(profiles);
//   } catch (error) {
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // ========================= ADMIN: GET PENDING PROFILES =========================
// export const getPendingProfiles = async (req, res) => {
//   try {
//     const profiles = await Profile.find({ approvalStatus: "pending" }).populate(
//       "user",
//       "name email phone clientId"
//     );

//     return res.status(200).json(profiles);
//   } catch (error) {
//     console.error("❌ Error fetching pending profiles:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // ========================= ADMIN: APPROVE PROFILE (FIXED) =========================
// export const approveProfile = async (req, res) => {
//   try {
//     const { id } = req.params;

//     console.log("🔍 Approve request received for ID:", id);

//     // 1. Update Profile Status using findByIdAndUpdate
//     // This bypasses the strict validation check so you can unblock pending users
//     const profile = await Profile.findByIdAndUpdate(
//       id,
//       { approvalStatus: "approved" },
//       { new: true }
//     );

//     if (!profile) {
//       console.log("❌ No profile found");
//       return res.status(404).json({ message: "Profile not found" });
//     }

//     // 2. Update User Model to allow login
//     const updatedUser = await User.findByIdAndUpdate(
//       profile.user,
//       { approved: true },
//       { new: true }
//     );

//     console.log("✅ User updated:", updatedUser?._id);

//     return res.status(200).json({
//       message: "User approved successfully",
//       profile,
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error("🔥 APPROVAL ERROR:", error);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

// // ========================= ADMIN: REJECT PROFILE =========================
// export const rejectProfile = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const profile = await Profile.findById(id);
//     if (!profile) {
//       return res.status(404).json({ message: "Profile not found" });
//     }

//     profile.approvalStatus = "rejected";
//     await profile.save();

//     return res.status(200).json({ message: "User rejected" });
//   } catch (error) {
//     console.error("❌ Error rejecting user:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // ========================= SEARCH BY CLIENT ID =========================
// export const getProfileByClientId = async (req, res) => {
//   try {
//     const { clientId } = req.params;

//     const user = await User.findOne({ clientId });
//     if (!user) return res.status(404).json({ message: "Invalid Client ID" });

//     const profile = await Profile.findOne({ user: user._id }).populate(
//       "user",
//       "name email phone clientId approved"
//     );

//     // ⭐ Add this
//     if (profile && profile.profileImages) {
//       profile.profileImages = profile.profileImages.map(toFullUrl);
//     }

//     return res.status(200).json(profile);
//   } catch (error) {
//     console.error("❌ Error searching profile:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


// // ========================= ADMIN: DELETE USER & PROFILE =========================
// export const deleteClient = async (req, res) => {
//   try {
//     const { id } = req.params; // Profile ID or User ID

//     // Find profile first
//     const profile = await Profile.findById(id);
//     if (!profile) {
//       return res.status(404).json({ message: "Profile not found" });
//     }

//     const userId = profile.user;

//     // Delete profile
//     await Profile.findByIdAndDelete(id);

//     // Delete user
//     await User.findByIdAndDelete(userId);

//     return res.status(200).json({
//       message: "Client deleted successfully — user & profile removed.",
//     });
//   } catch (error) {
//     console.error("❌ Error deleting client:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// export const uploadImages = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const profile = await Profile.findOne({ user: userId });

//     if (!profile) {
//       return res.status(404).json({ message: "Profile not found" });
//     }

//     // FIX: Normalize path separators for Windows / Linux compatibility
//     const filePaths = req.files.map((file) =>
//       file.path.split(path.sep).join("/")
//     );

//     // Prevent more than 4 images
//     if (profile.profileImages.length + filePaths.length > 4) {
//       return res.status(400).json({
//         message: "You can upload a maximum of 4 images",
//       });
//     }

//     profile.profileImages.push(...filePaths);
//     await profile.save();

//     res.status(200).json({
//       message: "Images uploaded & saved to profile successfully",
//       images: profile.profileImages.map(toFullUrl),
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Error uploading images",
//       error: error.message,
//     });
//   }
// };
  

// export const deleteImage = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { imagePath } = req.body;

//     const profile = await Profile.findOne({ user: userId });

//     if (!profile) return res.status(404).json({ message: "Profile not found" });

//     profile.profileImages = profile.profileImages.filter(
//       (img) => img !== imagePath
//     );
//     await profile.save();

//    const absolutePath = path.join(process.cwd(), img.replace(/\\/g, "/"));

// if (fs.existsSync(absolutePath)) {
//     fs.unlinkSync(absolutePath);
// }


//     res.status(200).json({ message: "Image deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting image" });
//   }
// };

// export const sendInterest = async (req, res) => {
//   try {
//     const userId = req.user._id; // logged-in user
//     const { profileId } = req.body; // the profile he likes

//     const profile = await Profile.findById(profileId);
//     if (!profile) return res.status(404).json({ message: "Profile not found" });

//     // Prevent duplicate interest
//     if (profile.interestedUsers.includes(userId)) {
//       return res.status(400).json({ message: "Already marked interested" });
//     }

    


// // Mark only the interestedUsers array as modified
// profile.markModified("interestedUsers");

// profile.interestedUsers.push(userId);

// // Completely disable validation for this save
// profile.$ignore('partnerPreferences');
// profile.$ignore('professionalStatus');
// profile.markModified("interestedUsers");

// await profile.save({ validateBeforeSave: false });




//     res.status(200).json({ message: "Interest marked successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const getInterestsByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const profiles = await Profile.find({
//       interestedUsers: userId,
//     }).populate("user", "name email phone clientId");

//     res.status(200).json(profiles);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // USER — Get profiles that **I** have shown interest in
// export const getMyInterests = async (req, res) => {
//   try {
//     const userId = req.user._id; // logged-in user

//     const profiles = await Profile.find({
//       interestedUsers: userId,
//     })
//       .select("-phone -address") // hide private fields
//       .populate("user", "clientId name") // show safe fields only
//       .sort({ createdAt: -1 });

//     return res.status(200).json(profiles);
//   } catch (error) {
//     console.error("Error fetching my interests:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // ========================= GET PUBLIC PROFILES (FOR ALL USERS) =========================
// export const getPublicProfiles = async (req, res) => {
//   try {
//     const profiles = await Profile.find({
//       approvalStatus: "approved",
//       isCompleted: true,
//     })
//       .select("-phone -address -email")
//       .populate("user", "name")
//       .sort({ createdAt: -1 });

//     const finalProfiles = profiles.map((p) => {
//       return {
//         ...p._doc,
//         profileImages: p.profileImages.map((img) => {
//           if (!img) return null;
//           img = img.replace(/\\/g, "/");

//           // Already full URL?
//           if (img.startsWith("http")) return img;

//           return `${HOST}/${img}`;
//         })
//       };
//     });

//     return res.status(200).json(finalProfiles);
//   } catch (error) {
//     console.error("❌ Error fetching public profiles:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


// // ========================= WITHDRAW INTEREST =========================
// export const withdrawInterest = async (req, res) => {
//   try {
//     const userId = req.user._id; // logged-in user
//     const { profileId } = req.body; // the profile to withdraw interest from

//     const profile = await Profile.findById(profileId);
//     if (!profile) {
//       return res.status(404).json({ message: "Profile not found" });
//     }

//     // Check if user has actually shown interest
//     if (!profile.interestedUsers.includes(userId)) {
//       return res
//         .status(400)
//         .json({ message: "You haven't shown interest in this profile" });
//     }

//     // Remove user from interestedUsers array
//     profile.interestedUsers = profile.interestedUsers.filter(
//       (interestedUserId) => interestedUserId.toString() !== userId.toString()
//     );

//     await profile.save();

//     res.status(200).json({
//       message: "Interest withdrawn successfully",
//       withdrawnFrom: profileId,
//     });
//   } catch (error) {
//     console.error("❌ Error withdrawing interest:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Alternative version using interest ID if you have separate Interest model
// export const withdrawInterestById = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { interestId } = req.params;

//     // If you have a separate Interest model, use this:
//     const interest = await Interest.findById(interestId);

//     if (!interest) {
//       return res.status(404).json({ message: "Interest not found" });
//     }

//     // Check if the interest belongs to the current user
//     if (interest.interestBy.toString() !== userId.toString()) {
//       return res
//         .status(403)
//         .json({ message: "Not authorized to withdraw this interest" });
//     }

//     await Interest.findByIdAndDelete(interestId);

//     res.json({
//       message: "Interest withdrawn successfully",
//       deletedInterest: interestId,
//     });
//   } catch (error) {
//     console.error("❌ Error withdrawing interest:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // ========================= EDIT PROFILE (ALL FIELDS + IMAGES + NAME) =========================
// export const editMyProfile = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     let profile = await Profile.findOne({ user: userId });
//     if (!profile) return res.status(404).json({ message: "Profile not found" });

//     let user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Parse the data from form-data
//     let data = {};
//     let removeImages = [];

//     if (req.body.data) {
//       data = JSON.parse(req.body.data);
//     }

//     // Handle removeImages separately if sent as form field
//     if (req.body.removeImages) {
//       try {
//         removeImages = JSON.parse(req.body.removeImages);
//       } catch (e) {
//         console.log("removeImages parse error:", e);
//       }
//     }

//     const {
//       name,
//       phone,
//       address,
//       gender,
//       birthday,
//       age,
//       height,
//       weight,
//       motherTongue,
//       career,
//       bio,
//       father, // <--- ADDED
//       mother, // <--- ADDED
//       relationshipStatus,
//       country,
//       city,
//       education,
//       professionalStatus,
//       otherProfession,
//       children,
//       smoking,
//       alcohol,
//       partnerPreferences,
//     } = data;

//     console.log("=== DEBUG IMAGE INFO ===");
//     console.log("Current profile images:", profile.profileImages);
//     console.log("Remove images received:", removeImages);
//     console.log("New files count:", req.files?.length || 0);

//     // 🔹 Update `User` model (name & phone)
//     if (name) user.name = name;
//     if (phone) user.phone = phone;
//     await user.save();

//     // 🔹 Sync updated fields also into Profile
//     profile.name = user.name;
//     profile.phone = user.phone;

//     // 🔹 Remove selected images FIRST - FIXED VERSION
//     let updatedProfileImages = [...profile.profileImages];

//     if (
//       removeImages &&
//       Array.isArray(removeImages) &&
//       removeImages.length > 0
//     ) {
//       console.log(
//         `Removing ${removeImages.length} images from current ${updatedProfileImages.length}`
//       );

//       // Use filter to remove images - FIXED COMPARISON
//       updatedProfileImages = updatedProfileImages.filter((img) => {
//         // Normalize paths for comparison (handle different path separators)
//         const normalizedImg = img.replace(/\\/g, "/");
//         const normalizedRemove = removeImages.map((r) => r.replace(/\\/g, "/"));

//         const shouldKeep = !normalizedRemove.includes(normalizedImg);
//         if (!shouldKeep) {
//           console.log(`Removing image: ${img}`);
//           // Delete file from server
//           if (fs.existsSync(img)) {
//             fs.unlinkSync(img);
//             console.log(`Deleted file: ${img}`);
//           }
//         }
//         return shouldKeep;
//       });

//       console.log(`Images after removal: ${updatedProfileImages.length}`);
//     }

//     // 🔹 Add new uploaded images AFTER removal
//     if (req.files && req.files.length > 0) {
//       const newPaths = req.files.map((file) => file.path);
//       console.log(`New paths to add: ${newPaths.length}`);

//       // Check image count AFTER removal
//       const totalAfterUpload = updatedProfileImages.length + newPaths.length;
//       console.log(
//         `Total after upload would be: ${totalAfterUpload} (${updatedProfileImages.length} existing + ${newPaths.length} new)`
//       );

//       if (totalAfterUpload > 4) {
//         // Clean up the newly uploaded files since we're rejecting the request
//         newPaths.forEach((path) => {
//           if (fs.existsSync(path)) fs.unlinkSync(path);
//         });

//         return res.status(400).json({
//           message: `You can upload a maximum of 4 images. Current: ${updatedProfileImages.length}, Trying to add: ${newPaths.length}, Total: ${totalAfterUpload}`,
//         });
//       }

//      updatedProfileImages.push(...newPaths.map(p => p.replace(/\\/g, "/")));
//       console.log(`Final image count: ${updatedProfileImages.length}`);
//     }

//     // Update the profile images array
//     profile.profileImages = updatedProfileImages;

//     // 🔹 Update profile fields
//     Object.assign(profile, {
//       address,
//       gender,
//       birthday,
//       age,
//       height,
//       weight,
//       motherTongue,
//       career,
//       bio,
//       father, // <--- ADDED
//       mother, // <--- ADDED
//       relationshipStatus,
//       country,
//       city,
//       education,
//       professionalStatus,
//       otherProfession,
//       children,
//       smoking,
//       alcohol,
//       partnerPreferences: {
//         ...partnerPreferences,
//         religion: "Hinduism",
//       },
//     });

//     // Re-approval required after editing
//     profile.approvalStatus = "pending";

//     await profile.save();

//     console.log("=== PROFILE UPDATE SUCCESS ===");
//     console.log("Final profile images:", profile.profileImages);
//     console.log("Total images:", profile.profileImages.length);

//  profile.profileImages = profile.profileImages.map(toFullUrl);

// res.status(200).json({
//   message: "Profile updated successfully. Awaiting admin re-approval.",
//   profile,
// });

//   } catch (error) {
//     console.error("❌ Error editing profile:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };














import Profile from "../models/Profile.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";

const HOST = process.env.SERVER_HOST || "https://login.akhilendianadar.in";

// NOTE: This helper function is now only used in legacy or specific admin routes
// that the frontend does not directly consume/re-process.
const toFullUrl = (img) => {
  if (!img) return img;
  img = img.replace(/\\/g, "/").replace(/^\/+/, "");
  if (img.startsWith("http")) return img;
  return `${HOST}/${img}`;
};

/*------------------------------------------------------------
  CREATE or UPDATE PROFILE (FIRST TIME SUBMISSION)
-------------------------------------------------------------*/
export const upsertMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Accept all fields from client
    const body = req.body || {};

    const payload = {
      ...body,
      user: userId,
      name: user.name,
      phone: user.phone,

      // Add new fields
      fatherOccupation: body.fatherOccupation || "",
      motherOccupation: body.motherOccupation || "",
      siblings: body.siblings || 0,

      religion: "Hinduism",
      isCompleted: true,
      approvalStatus: "pending",
    };

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      payload,
      { new: true, upsert: true }
    ).populate("user", "name email phone clientId");

    return res.status(200).json({
      message: "Profile submitted successfully. Awaiting admin approval.",
      profile,
    });
  } catch (error) {
    console.error("upsertMyProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*------------------------------------------------------------
  GET LOGGED-IN USER PROFILE (FIXED)
-------------------------------------------------------------*/
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate(
      "user",
      "name email phone clientId approved"
    );

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // ✅ FIX: DO NOT use toFullUrl here. Return raw data.
    // The front-end helper getImageUrl will construct the URL.

    res.status(200).json(profile); 
  } catch (error) {
    console.error("getMyProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*------------------------------------------------------------
  ADMIN: GET ALL PROFILES
-------------------------------------------------------------*/
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find()
      .select("-address -phone")
      .populate("user", "clientId name")
      .sort({ createdAt: -1 });

    // Note: This is fine as the front-end (AdminDashboard) handles path construction.
    res.status(200).json(profiles);
  } catch (error) {
    console.error("getAllProfiles:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*------------------------------------------------------------
  ADMIN: PENDING PROFILES
-------------------------------------------------------------*/
export const getPendingProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ approvalStatus: "pending" }).populate(
      "user",
      "name email phone clientId"
    );

    // Note: This is fine as the front-end (AdminDashboard) handles path construction.
    res.status(200).json(profiles);
  } catch (error) {
    console.error("getPendingProfiles:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*------------------------------------------------------------
  ADMIN: APPROVE PROFILE
-------------------------------------------------------------*/
export const approveProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findByIdAndUpdate(
      id,
      { approvalStatus: "approved" },
      { new: true }
    );

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const updatedUser = await User.findByIdAndUpdate(
      profile.user,
      { approved: true },
      { new: true }
    );

    res.status(200).json({
      message: "User approved successfully",
      profile,
      user: updatedUser,
    });
  } catch (error) {
    console.error("approveProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*------------------------------------------------------------
  ADMIN: REJECT PROFILE
-------------------------------------------------------------*/
export const rejectProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findById(id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.approvalStatus = "rejected";
    await profile.save();

    res.status(200).json({ message: "User rejected" });
  } catch (error) {
    console.error("rejectProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*------------------------------------------------------------
  SEARCH BY CLIENT ID (FIXED)
-------------------------------------------------------------*/
export const getProfileByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;

    const user = await User.findOne({ clientId });
    if (!user) return res.status(404).json({ message: "Invalid Client ID" });

    const profile = await Profile.findOne({ user: user._id }).populate(
      "user",
      "name email phone clientId approved"
    );

    // ✅ FIX: Removed the toFullUrl mapping here.
    // if (profile)
    //   profile.profileImages = profile.profileImages.map(toFullUrl); 

    res.status(200).json(profile);
  } catch (error) {
    console.error("getProfileByClientId:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*------------------------------------------------------------
  DELETE CLIENT
-------------------------------------------------------------*/
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findById(id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const userId = profile.user;

    await Profile.findByIdAndDelete(id);
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "Client deleted successfully — user & profile removed.",
    });
  } catch (error) {
    console.error("deleteClient:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*------------------------------------------------------------
  UPLOAD IMAGES (FIXED)
-------------------------------------------------------------*/
export const uploadImages = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await Profile.findOne({ user: userId });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const filePaths = req.files.map((f) =>
      f.path.replace(/\\/g, "/")
    );

    if (profile.profileImages.length + filePaths.length > 4) {
      filePaths.forEach((p) => fs.existsSync(p) && fs.unlinkSync(p));
      return res.status(400).json({ message: "Maximum 4 images allowed" });
    }

    profile.profileImages.push(...filePaths);
    await profile.save();

    res.status(200).json({
      message: "Images uploaded successfully",
      // ✅ FIX: Return raw paths, not full URLs
      images: profile.profileImages, 
    });
  } catch (error) {
    console.error("uploadImages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*------------------------------------------------------------
  DELETE IMAGE
-------------------------------------------------------------*/
export const deleteImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { imagePath } = req.body;

    const profile = await Profile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const normalized = imagePath.replace(/\\/g, "/");

    profile.profileImages = profile.profileImages.filter(
      (i) => i.replace(/\\/g, "/") !== normalized
    );

    await profile.save();

    const abs = path.join(process.cwd(), normalized);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);

    res.status(200).json({ message: "Image deleted" });
  } catch (error) {
    console.error("deleteImage:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*------------------------------------------------------------
  SEND INTEREST
-------------------------------------------------------------*/
export const sendInterest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { profileId } = req.body;

    const profile = await Profile.findById(profileId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    if (profile.interestedUsers.includes(userId))
      return res.status(400).json({ message: "Already interested" });

    profile.interestedUsers.push(userId);
    await profile.save();

    res.status(200).json({ message: "Interest marked" });
  } catch (error) {
    console.error("sendInterest:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*------------------------------------------------------------
  MY INTERESTS
-------------------------------------------------------------*/
export const getMyInterests = async (req, res) => {
  try {
    const userId = req.user._id;

    const profiles = await Profile.find({
      interestedUsers: userId,
    })
      .select("-address -phone")
      .populate("user", "clientId name")
      .sort({ createdAt: -1 });

    // Note: This is fine as the front-end (Matches.js) handles path construction.
    res.status(200).json(profiles);
  } catch (error) {
    console.error("getMyInterests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*------------------------------------------------------------
  WITHDRAW INTEREST
-------------------------------------------------------------*/
export const withdrawInterest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { profileId } = req.body;

    const profile = await Profile.findById(profileId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.interestedUsers = profile.interestedUsers.filter(
      (u) => u.toString() !== userId.toString()
    );

    await profile.save();

    res.status(200).json({ message: "Interest withdrawn" });
  } catch (error) {
    console.error("withdrawInterest:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*------------------------------------------------------------
  PUBLIC PROFILES (FIXED)
-------------------------------------------------------------*/
export const getPublicProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({
      approvalStatus: "approved",
      isCompleted: true,
    })
      .select("-address -phone")
      .populate("user", "name")
      .sort({ createdAt: -1 });

    // ✅ FIX: We return the raw profile object (relative paths).
    const mapped = profiles.map((p) => p.toObject()); 
    
    res.status(200).json(mapped);
    
  } catch (error) {
    console.error("getPublicProfiles:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/*------------------------------------------------------------
  EDIT PROFILE (WITH IMAGE ADD/REMOVE) (FIXED)
-------------------------------------------------------------*/
export const editMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    let profile = await Profile.findOne({ user: userId });
    let user = await User.findById(userId);

    if (!profile) return res.status(404).json({ message: "Profile not found" });
    if (!user) return res.status(404).json({ message: "User not found" });

    let data = {};
    let removeImages = [];

    if (req.body.data) data = JSON.parse(req.body.data);
    if (req.body.removeImages) removeImages = JSON.parse(req.body.removeImages);

    // Remove selected images
    let updatedImages = [...profile.profileImages];

    removeImages = removeImages.map((i) => i.replace(/\\/g, "/"));

    updatedImages = updatedImages.filter((img) => {
      const normalized = img.replace(/\\/g, "/");
      if (removeImages.includes(normalized)) {
        const abs = path.join(process.cwd(), normalized);
        if (fs.existsSync(abs)) fs.unlinkSync(abs);
        return false;
      }
      return true;
    });

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map((f) => f.path.replace(/\\/g, "/"));

      if (updatedImages.length + newFiles.length > 4) {
        newFiles.forEach((p) => fs.existsSync(p) && fs.unlinkSync(p));
        return res
          .status(400)
          .json({ message: "Maximum 4 images allowed" });
      }

      updatedImages.push(...newFiles);
    }

    profile.profileImages = updatedImages;

    // Profile fields update
    Object.assign(profile, {
      ...data,

      fatherOccupation: data.fatherOccupation,
      motherOccupation: data.motherOccupation,
      siblings: data.siblings,

      partnerPreferences: {
        ...data.partnerPreferences,
        religion: "Hinduism",
      },
    });

    profile.approvalStatus = "pending";

    await profile.save();

    // ✅ FIX: DO NOT map to toFullUrl before responding.
    // profile.profileImages = profile.profileImages.map(toFullUrl); 

    res.status(200).json({
      message: "Profile updated successfully. Awaiting admin re-approval.",
      profile,
    });
  } catch (error) {
    console.error("editMyProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getInterestsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const profiles = await Profile.find({
      interestedUsers: userId,
    }).populate("user", "name email phone clientId");

    return res.status(200).json(profiles);
  } catch (error) {
    console.error("❌ getInterestsByUser:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};