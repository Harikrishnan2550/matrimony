import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper: Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ---------------- SIGNUP ---------------- //

export const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check existing email
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    // Auto-generate client ID
    const lastUser = await User.findOne().sort({ createdAt: -1 });
    let nextNumber = 1;

    if (lastUser?.clientId) {
      const lastNum = parseInt(lastUser.clientId.replace("CLIENT-", ""));
      nextNumber = lastNum + 1;
    }

    const newClientId = `CLIENT-${String(nextNumber).padStart(4, "0")}`;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = await User.create({
      clientId: newClientId,
      name,
      email,
      phone,
      password: hashedPassword
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        clientId: user.clientId,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
};

// ---------------- LOGIN ---------------- //

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 1) ADMIN LOGIN CHECK
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Admin login successful",
        token,
        user: {
          name: "Admin",
          email: email,
          role: "admin",
        }
      });
    }

    // 🔹 2) NORMAL USER LOGIN (database)
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        clientId: user.clientId,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ---------------- GET USER ---------------- //

export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch {
    res.status(500).json({ message: "Error fetching user" });
  }
};
