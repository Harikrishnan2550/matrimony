import Profile from "../models/Profile.js";
import User from "../models/User.js";
import fs from "fs";

// ========================= CREATE / UPDATE PROFILE =========================
export const upsertMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch existing user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {
      address,
      gender,
      birthday,
      age,
      height,
      weight,
      motherTongue,
      career,
      bio,
      relationshipStatus,
      country,
      city,
      education,
      professionalStatus,
      otherProfession,
      children,
      smoking,
      alcohol,
      partnerPreferences,
    } = req.body;

    const profileData = {
      user: userId,
      name: user.name,
      phone: user.phone,
      address,
      gender,
      birthday,
      age,
      height,
      weight,
      motherTongue,
      career,
      religion: "Hinduism",
      bio,
      relationshipStatus,
      country,
      city,
      education,
      professionalStatus,
      otherProfession,
      children,
      smoking,
      alcohol,
      partnerPreferences: {
        ...partnerPreferences,
        religion: "Hinduism",
      },
      isCompleted: true,
      approvalStatus: "pending", // Admin must approve before user access
    };

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      profileData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("user", "name email phone clientId");

    return res.status(200).json({
      message: "Profile submitted successfully. Awaiting admin approval.",
      profile,
    });
  } catch (error) {
    console.error("❌ Error saving profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ========================= GET USER'S OWN PROFILE =========================
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate(
      "user",
      "name email phone clientId approved"
    );

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    return res.status(200).json(profile);
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ========================= ADMIN: GET ALL PROFILES =========================
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find()
      .select("-phone -address")   // 🚫 hide phone & address
      .populate("user", "clientId name") // keep only safe fields
      .sort({ createdAt: -1 });

    return res.status(200).json(profiles);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};


// ========================= ADMIN: GET PENDING PROFILES =========================
export const getPendingProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ approvalStatus: "pending" }).populate(
      "user",
      "name email phone clientId"
    );

    return res.status(200).json(profiles);
  } catch (error) {
    console.error("❌ Error fetching pending profiles:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ========================= ADMIN: APPROVE PROFILE =========================
export const approveProfile = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔍 Approve request received for ID:", id); // <-- Debug

    const profile = await Profile.findById(id);

    if (!profile) {
      console.log("❌ No profile found");
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.approvalStatus = "approved";
    await profile.save();

    // Update user record
    const updatedUser = await User.findByIdAndUpdate(
      profile.user,
      { approved: true },
      { new: true }
    );

    console.log("✅ User updated:", updatedUser);

    return res.status(200).json({
      message: "User approved successfully",
      profile,
      user: updatedUser
    });

  } catch (error) {
    console.error("🔥 APPROVAL ERROR:", error); // <-- Prints the actual error
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ========================= ADMIN: REJECT PROFILE =========================
export const rejectProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.approvalStatus = "rejected";
    await profile.save();

    return res.status(200).json({ message: "User rejected" });
  } catch (error) {
    console.error("❌ Error rejecting user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ========================= SEARCH BY CLIENT ID =========================
export const getProfileByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;

    const user = await User.findOne({ clientId });
    if (!user)
      return res.status(404).json({ message: "Invalid Client ID" });

    const profile = await Profile.findOne({ user: user._id }).populate(
      "user",
      "name email phone clientId approved"
    );

    return res.status(200).json(profile);
  } catch (error) {
    console.error("❌ Error searching profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// ========================= ADMIN: DELETE USER & PROFILE =========================
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params; // Profile ID or User ID

    // Find profile first
    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const userId = profile.user;

    // Delete profile
    await Profile.findByIdAndDelete(id);

    // Delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      message: "Client deleted successfully — user & profile removed.",
    });

  } catch (error) {
    console.error("❌ Error deleting client:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const uploadImages = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Get uploaded file paths
    const filePaths = req.files.map(file => file.path);

    // Prevent more than 4 images
    if (profile.profileImages.length + filePaths.length > 4) {
      return res.status(400).json({
        message: "You can upload a maximum of 4 images"
      });
    }

    // Save into profile
    profile.profileImages.push(...filePaths);
    await profile.save();

    res.status(200).json({
      message: "Images uploaded & saved to profile successfully",
      images: profile.profileImages
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading images", error: error.message });
  }
};



export const deleteImage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { imagePath } = req.body;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    profile.profileImages = profile.profileImages.filter(img => img !== imagePath);
    await profile.save();

    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    res.status(200).json({ message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting image" });
  }
};



export const sendInterest = async (req, res) => {
  try {
    const userId = req.user._id;            // logged-in user
    const { profileId } = req.body;        // the profile he likes

    const profile = await Profile.findById(profileId);
    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    // Prevent duplicate interest
    if (profile.interestedUsers.includes(userId)) {
      return res.status(400).json({ message: "Already marked interested" });
    }

    profile.interestedUsers.push(userId);
    await profile.save();

    res.status(200).json({ message: "Interest marked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const getInterestsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const profiles = await Profile.find({
      interestedUsers: userId
    }).populate("user", "name email phone clientId");

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// USER — Get profiles that **I** have shown interest in
export const getMyInterests = async (req, res) => {
  try {
    const userId = req.user._id; // logged-in user

    const profiles = await Profile.find({
      interestedUsers: userId
    })
      .select("-phone -address")   // hide private fields
      .populate("user", "clientId name") // show safe fields only
      .sort({ createdAt: -1 });

    return res.status(200).json(profiles);
  } catch (error) {
    console.error("Error fetching my interests:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// ========================= GET PUBLIC PROFILES (FOR ALL USERS) =========================
export const getPublicProfiles = async (req, res) => {
  try {
    // Only show approved profiles to regular users
    const profiles = await Profile.find({ 
      approvalStatus: "approved",
      isCompleted: true 
    })
    .select("-phone -address -email -interestedUsers")   // 🚫 hide sensitive fields
    .populate("user", "name") // keep only safe fields
    .sort({ createdAt: -1 });

    return res.status(200).json(profiles);
  } catch (error) {
    console.error("❌ Error fetching public profiles:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// ========================= WITHDRAW INTEREST =========================
export const withdrawInterest = async (req, res) => {
  try {
    const userId = req.user._id; // logged-in user
    const { profileId } = req.body; // the profile to withdraw interest from

    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Check if user has actually shown interest
    if (!profile.interestedUsers.includes(userId)) {
      return res.status(400).json({ message: "You haven't shown interest in this profile" });
    }

    // Remove user from interestedUsers array
    profile.interestedUsers = profile.interestedUsers.filter(
      interestedUserId => interestedUserId.toString() !== userId.toString()
    );

    await profile.save();

    res.status(200).json({ 
      message: "Interest withdrawn successfully",
      withdrawnFrom: profileId 
    });

  } catch (error) {
    console.error("❌ Error withdrawing interest:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Alternative version using interest ID if you have separate Interest model
export const withdrawInterestById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { interestId } = req.params;

    // If you have a separate Interest model, use this:
    const interest = await Interest.findById(interestId);
    
    if (!interest) {
      return res.status(404).json({ message: "Interest not found" });
    }

    // Check if the interest belongs to the current user
    if (interest.interestBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to withdraw this interest" });
    }

    await Interest.findByIdAndDelete(interestId);

    res.json({ 
      message: "Interest withdrawn successfully",
      deletedInterest: interestId 
    });

  } catch (error) {
    console.error("❌ Error withdrawing interest:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ========================= EDIT PROFILE (ALL FIELDS + IMAGES + NAME) =========================
export const editMyProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    let profile = await Profile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Parse the data from form-data
    let data = {};
    let removeImages = [];
    
    if (req.body.data) {
      data = JSON.parse(req.body.data);
    }
    
    // Handle removeImages separately if sent as form field
    if (req.body.removeImages) {
      try {
        removeImages = JSON.parse(req.body.removeImages);
      } catch (e) {
        console.log("removeImages parse error:", e);
      }
    }

    const {
      name,
      phone,
      address,
      gender,
      birthday,
      age,
      height,
      weight,
      motherTongue,
      career,
      bio,
      relationshipStatus,
      country,
      city,
      education,
      professionalStatus,
      otherProfession,
      children,
      smoking,
      alcohol,
      partnerPreferences
    } = data;

    console.log("=== DEBUG IMAGE INFO ===");
    console.log("Current profile images:", profile.profileImages);
    console.log("Remove images received:", removeImages);
    console.log("New files count:", req.files?.length || 0);

    // 🔹 Update `User` model (name & phone)
    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();

    // 🔹 Sync updated fields also into Profile
    profile.name = user.name;
    profile.phone = user.phone;

    // 🔹 Remove selected images FIRST - FIXED VERSION
    let updatedProfileImages = [...profile.profileImages];
    
    if (removeImages && Array.isArray(removeImages) && removeImages.length > 0) {
      console.log(`Removing ${removeImages.length} images from current ${updatedProfileImages.length}`);
      
      // Use filter to remove images - FIXED COMPARISON
      updatedProfileImages = updatedProfileImages.filter(img => {
        // Normalize paths for comparison (handle different path separators)
        const normalizedImg = img.replace(/\\/g, '/');
        const normalizedRemove = removeImages.map(r => r.replace(/\\/g, '/'));
        
        const shouldKeep = !normalizedRemove.includes(normalizedImg);
        if (!shouldKeep) {
          console.log(`Removing image: ${img}`);
          // Delete file from server
          if (fs.existsSync(img)) {
            fs.unlinkSync(img);
            console.log(`Deleted file: ${img}`);
          }
        }
        return shouldKeep;
      });
      
      console.log(`Images after removal: ${updatedProfileImages.length}`);
    }

    // 🔹 Add new uploaded images AFTER removal
    if (req.files && req.files.length > 0) {
      const newPaths = req.files.map(file => file.path);
      console.log(`New paths to add: ${newPaths.length}`);

      // Check image count AFTER removal
      const totalAfterUpload = updatedProfileImages.length + newPaths.length;
      console.log(`Total after upload would be: ${totalAfterUpload} (${updatedProfileImages.length} existing + ${newPaths.length} new)`);

      if (totalAfterUpload > 4) {
        // Clean up the newly uploaded files since we're rejecting the request
        newPaths.forEach(path => {
          if (fs.existsSync(path)) fs.unlinkSync(path);
        });
        
        return res.status(400).json({
          message: `You can upload a maximum of 4 images. Current: ${updatedProfileImages.length}, Trying to add: ${newPaths.length}, Total: ${totalAfterUpload}`
        });
      }

      updatedProfileImages.push(...newPaths);
      console.log(`Final image count: ${updatedProfileImages.length}`);
    }

    // Update the profile images array
    profile.profileImages = updatedProfileImages;

    // 🔹 Update profile fields
    Object.assign(profile, {
      address,
      gender,
      birthday,
      age,
      height,
      weight,
      motherTongue,
      career,
      bio,
      relationshipStatus,
      country,
      city,
      education,
      professionalStatus,
      otherProfession,
      children,
      smoking,
      alcohol,
      partnerPreferences: {
        ...partnerPreferences,
        religion: "Hinduism",
      },
    });

    // Re-approval required after editing
    profile.approvalStatus = "pending";

    await profile.save();

    console.log("=== PROFILE UPDATE SUCCESS ===");
    console.log("Final profile images:", profile.profileImages);
    console.log("Total images:", profile.profileImages.length);

    res.status(200).json({
      message: "Profile updated successfully. Awaiting admin re-approval.",
      profile,
    });

  } catch (error) {
    console.error("❌ Error editing profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
