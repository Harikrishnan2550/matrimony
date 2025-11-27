import multer from "multer";

// Limit: 1MB per file
const FILE_SIZE_LIMIT = 1 * 1024 * 1024;

// Storage location (inside backend/uploads folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  }
});

// File filter (accept images only)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only images are allowed!"), false);
};

const upload = multer({
  storage,
  limits: { fileSize: FILE_SIZE_LIMIT },
  fileFilter,
});

export default upload;
