// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     clientId: { type: String, unique: true },
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     phone: { type: String },
//     password: { type: String, required: true },
    
//     approved: { type: Boolean, default: false },  // NEW
//     profileCompleted: { type: Boolean, default: false },
//     role: { type: String, enum: ["user", "admin"], default: "user" }
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", userSchema);




// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clientId: { type: String, unique: true, sparse: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },

    role: { type: String, enum: ["user", "admin"], default: "user" },
    approved: { type: Boolean, default: false },

    // 🔐 Admin password reset
    resetOTP: String,
    resetOTPExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
