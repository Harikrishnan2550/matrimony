// import multer from "multer";

// // Limit: 1MB per file
// const FILE_SIZE_LIMIT = 1 * 1024 * 1024;

// // Storage location (inside backend/uploads folder)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, unique + "-" + file.originalname);
//   }
// });

// // File filter (accept images only)
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) cb(null, true);
//   else cb(new Error("Only images are allowed!"), false);
// };

// const upload = multer({
//   storage,
//   limits: { fileSize: FILE_SIZE_LIMIT },
//   fileFilter,
// });

// export default upload;





import multer from "multer";
import fs from "fs";
import path from "path";
import User from "../models/User.js";

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const userId = req.user?._id;
      if (!userId) return cb(new Error("User not found"), null);

      const user = await User.findById(userId);
      if (!user) return cb(new Error("User not found"), null);

      const userFolder = path.join("uploads", user.clientId);

      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }

      cb(null, userFolder);
    } catch (err) {
      cb(err, null);
    }
  },

  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}.${ext}`);
  }
});

function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only images allowed"), false);
  } else {
    cb(null, true);
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit (matches frontend)
  fileFilter,
});

export default upload;
