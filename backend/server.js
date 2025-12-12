// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url"; // Required to fix __dirname in ES Modules

// // Import Database Connection
// import connectDB from "./config/db.js";

// // Import Routes
// import authRoutes from "./routes/authRoutes.js";
// import profileRoutes from "./routes/profileRoutes.js";

// // 1. Load Environment Variables
// dotenv.config();

// // 2. Fix __dirname for ES Modules (Critical for file uploads on VPS)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // ==================================================================
// // 3. CORS CONFIGURATION (The most important part for your domain)
// // ==================================================================
// const allowedOrigins = [
//   "http://localhost:5173",                  // Local React Development
//   "http://localhost:3000",                  // Alternate Local Port
//   "https://login.akhilendianadar.in",       // 🟢 YOUR LIVE DOMAIN
//   "http://login.akhilendianadar.in",        // Non-SSL Version (Just in case)
//   "http://72.62.1.88"                       // Your VPS IP Address
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or server-to-server curl)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true // Allows cookies/headers to be sent
// }));

// // 4. Middleware
// app.use(express.json()); // Parse JSON bodies
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// // ==================================================================
// // 5. STATIC IMAGE SERVING (Critical for Profile Pictures)
// // ==================================================================
// // This ensures images work even when running via PM2
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // 6. Connect to Database
// connectDB();

// // 7. Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/profile", profileRoutes);

// // 8. Health Check Route (Visit your-ip:4000 to test)
// app.get("/", (req, res) => {
//   res.send("✅ Backend is Running Successfully on login.akhilendianadar.in");
// });

// // 9. Error Handling for unknown routes
// app.use((req, res, next) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // 10. Start Server
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`🔥 Server running on port ${PORT}`);
//   console.log(`📂 Uploads folder serving from: ${path.join(__dirname, "uploads")}`);
// });









import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ GLOBAL CORS FIX
app.use(cors({
  origin: "*",   
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // <-- FIX IS HERE
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// ❗ IMPORTANT: Add CORS headers manually for static images
app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => res.send("Backend Running Successfully"));

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
  console.log(`📁 Serving uploads from: ${path.join(__dirname, "uploads")}`);
});

