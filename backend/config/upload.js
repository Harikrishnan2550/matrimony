// import multer from "multer";
// import fs from "fs";
// import path from "path";
// import User from "../models/User.js";

// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     const userId = req.user._id;
//     const user = await User.findById(userId);

//     if (!user) return cb(new Error("User not found"), null);

//     const userFolder = `uploads/${user.clientId}`;

//     if (!fs.existsSync(userFolder)) {
//       fs.mkdirSync(userFolder, { recursive: true });
//     }

//     cb(null, userFolder);
//   },

//   filename: (req, file, cb) => {
//     const ext = file.originalname.split(".").pop();
//     cb(null, `${Date.now()}.${ext}`);
//   }
// });

// function fileFilter(req, file, cb) {
//   if (!file.mimetype.startsWith("image/")) {
//     return cb(new Error("Only images allowed"), false);
//   }
//   cb(null, true);
// }

// export const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // ⬅ increase to 10 MB
//   fileFilter,
// });
