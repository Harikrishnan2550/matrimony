import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/uploads", express.static("uploads"));

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
