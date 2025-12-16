// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// // Helper: Generate JWT token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
// };

// // ---------------- SIGNUP ---------------- //

// export const signup = async (req, res) => {
//   try {
//     const { name, email, phone, password } = req.body;

//     // Check existing email
//     const exists = await User.findOne({ email });
//     if (exists) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Auto-generate client ID
//     const lastUser = await User.findOne().sort({ createdAt: -1 });
//     let nextNumber = 1;

//     if (lastUser?.clientId) {
//       const lastNum = parseInt(lastUser.clientId.replace("CLIENT-", ""));
//       nextNumber = lastNum + 1;
//     }

//     const newClientId = `CLIENT-${String(nextNumber).padStart(4, "0")}`;

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // ✅ ADMIN CHECK (EMAIL ONLY)
//     const role =
//       email === process.env.ADMIN_EMAIL ? "admin" : "user";

//     // Save user
//     const user = await User.create({
//       clientId: newClientId,
//       name,
//       email,
//       phone,
//       password: hashedPassword,
//       role,
//       approved: role === "admin" ? true : false // optional
//     });

//     const token = generateToken(user._id);

//     res.status(201).json({
//       message: "Account created successfully",
//       token,
//       user: {
//         id: user._id,
//         clientId: user.clientId,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Signup failed" });
//   }
// };


// // ---------------- LOGIN ---------------- //

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user (admin or normal)
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     return res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         clientId: user.clientId,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });

//   } catch (err) {
//     console.error("LOGIN ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


// // ---------------- GET USER ---------------- //

// export const getMe = async (req, res) => {
//   try {
//     res.json(req.user);
//   } catch {
//     res.status(500).json({ message: "Error fetching user" });
//   }
// };







import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

/* =====================================================
   HELPER
===================================================== */

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* =====================================================
   USER AUTH (NO CHANGE IN FLOW)
===================================================== */

// ---------------- USER SIGNUP ---------------- //
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    // Generate Client ID
    const lastUser = await User.findOne({ role: "user" }).sort({
      createdAt: -1,
    });

    const nextNumber = lastUser?.clientId
      ? parseInt(lastUser.clientId.replace("CLIENT-", "")) + 1
      : 1;

    const clientId = `CLIENT-${String(nextNumber).padStart(4, "0")}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      clientId,
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      message: "Signup successful",
      token: generateToken(user._id, "user"),
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
};

// ---------------- USER LOGIN ---------------- //
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "user" });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      token: generateToken(user._id, "user"),
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

/* =====================================================
   ADMIN AUTH (SEPARATE FLOW)
===================================================== */

// ---------------- ADMIN LOGIN ---------------- //
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin)
      return res.status(403).json({ message: "Admin not authorized" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Admin login successful",
      token: generateToken(admin._id, "admin"),
      user: admin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Admin login failed" });
  }
};

// ---------------- ADMIN FORGOT PASSWORD (SEND OTP) ---------------- //
export const adminForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin)
      return res.status(404).json({ message: "Admin not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.resetOTP = otp;
    admin.resetOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
    await admin.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: admin.email,
      subject: "Admin Password Reset OTP",
      html: `
        <h2>Password Reset Request</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    res.json({ message: "OTP sent to admin email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ---------------- ADMIN RESET PASSWORD ---------------- //
export const adminResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const admin = await User.findOne({
      email,
      role: "admin",
      resetOTP: otp,
      resetOTPExpiry: { $gt: Date.now() },
    });

    if (!admin)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetOTP = undefined;
    admin.resetOTPExpiry = undefined;

    await admin.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Password reset failed" });
  }
};

/* =====================================================
   COMMON
===================================================== */

// ---------------- GET CURRENT USER ---------------- //
export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch {
    res.status(500).json({ message: "Error fetching user" });
  }
};




export const checkAdminSetup = async (req, res) => {
  const admin = await User.findOne({ role: "admin" });
  res.json({ exists: !!admin });
};




export const adminSignup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔒 Allow only ONE admin
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(403).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: "Administrator", // ✅ REQUIRED FIELD FIX
      email,
      password: hashedPassword,
      role: "admin",
      approved: true,
    });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Admin setup completed",
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (err) {
    console.error("ADMIN SIGNUP ERROR:", err);
    res.status(500).json({ message: "Admin setup failed" });
  }
};
