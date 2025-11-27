import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 CASE 1 — ADMIN LOGIN (no DB lookup)
    if (decoded.role === "admin") {
      req.user = decoded; // contains { email, role: "admin" }
      return next();
    }

    // 🔥 CASE 2 — NORMAL USER (fetch from DB)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();

  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

export const admin = (req, res, next) => {
  if (req.user.role === "admin") return next();
  return res.status(403).json({ message: "Admin access only" });
};
