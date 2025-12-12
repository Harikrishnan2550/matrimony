// import mongoose from "mongoose";

// const profileSchema = new mongoose.Schema(
//   {
//     // Link to User
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       unique: true, // one profile per user
//     },
//     approvalStatus: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },

//     // STEP 1: PERSONAL PROFILE
//     name: {
//       type: String,
//       required: true, // copied from User
//     },
//     phone: {
//       type: String,
//       required: true, // copied from User
//     },
//     address: {
//       type: String,
//       required: true,
//     },
//     gender: {
//       type: String,
//       enum: ["male", "female", "non-binary"],
//       required: true,
//     },

//     birthday: {
//       type: String, // storing as string (e.g. "1999-04-21")
//       required: true,
//     },
//     age: {
//       type: Number, // user can input or you can calculate later
//       required: true,
//     },
//     height: {
//       type: String,
//       required: true, // e.g. "5.6", "170cm"
//     },
//     weight: {
//       type: String, // optional
//     },
//     motherTongue: {
//       type: String,
//       enum: ["Malayalam", "Tamil", "Hindi", "Other"],
//       required: true,
//     },
//     career: {
//       type: String,
//       enum: [
//         "Military",
//         "Public sector",
//         "IT industry",
//         "Healthcare",
//         "Education",
//         "Manufacturing",
//         "Communications",
//         "Construction",
//         "Service industry",
//         "Transportation",
//         "Finance",
//         "Agriculture",
//         "Architecture",
//         "Arts & Design",
//         "Energy industry",
//         "Engineering",
//         "Government",
//         "Hospitality",
//         "Security industry",
//         "Social services",
//         "Sports",
//         "Tourism",
//         "Other",
//       ],
//       required: true,
//     },
//     religion: {
//       type: String,
//       default: "Hinduism",
//       immutable: true, // cannot be changed
//     },
//     bio: {
//       type: String,
//     },

//     // ⭐ NEW FIELDS ADDED
//     father: {
//       type: String,
//       required: true,
//     },
//     mother: {
//       type: String,
//       required: true,
//     },

//     profileImages: {
//       type: [String], // array of image paths
//       validate: (val) => val.length <= 4, // max 4 photos
//       default: [],
//     },

//     // STEP 2: LIFESTYLE & BACKGROUND
//     relationshipStatus: {
//       type: String,
//       enum: ["single", "divorced", "widowed", "prefer not to say"],
//       required: true,
//     },
//     country: {
//       type: String, // frontend will give options
//       required: true,
//     },
//     city: {
//       type: String,
//     },
//     education: {
//       type: String,
//       enum: [
//         "High School",
//         "Vocational",
//         "College",
//         "Bachelor's degree",
//         "Master's degree",
//         "Doctoral",
//         "Multiple Degrees",
//       ],
//       required: true,
//     },

//     professionalStatus: {
//       type: String,
//       enum: [
//         "Currently unemployed",
//         "Entrepreneur",
//         "Freelancer/Self-employed",
//         "Junior manager",
//         "Specialist",
//         "Student",
//         "Workman",
//       ],
//     },
//     otherProfession: {
//       type: String, // if not in list
//     },
//     children: {
//       type: String,
//       enum: ["no children", "have children"],
//     },
//     smoking: {
//       type: String,
//       enum: [
//         "dont smoke",
//         "smoke regularly",
//         "smoke occasionally",
//         "prefer not to say",
//       ],
//     },
//     alcohol: {
//       type: String,
//       enum: [
//         "dont drink",
//         "drink frequently",
//         "drink socially",
//         "prefer not to say",
//       ],
//     },

//     // STEP 3: PARTNER PREFERENCES
//     partnerPreferences: {
//       interestedIn: {
//         type: String,
//         enum: ["male", "female", "non-binary"],
//         required: true,
//       },
//       heightRange: {
//         type: String,
//       },
//       weightRange: {
//         type: String,
//       },
//       relationshipStatus: {
//         type: String,
//         enum: ["single", "divorced", "widowed", "prefer not to say"],
//       },
//       alcohol: {
//         type: String,
//         enum: [
//           "dont drink",
//           "drink frequently",
//           "drink socially",
//           "prefer not to say",
//         ],
//       },
//       smoking: {
//         type: String,
//         enum: [
//           "dont smoke",
//           "smoke regularly",
//           "smoke occasionally",
//           "prefer not to say",
//         ],
//       },
//       children: {
//         type: String,
//         enum: ["no children", "have children"],
//       },
//       country: {
//         type: String,
//       },
//       religion: {
//         type: String,
//         default: "Hinduism",
//         immutable: true,
//       },
//    language: { type: String, enum: ["Malayalam", "Tamil", "Hindi", "Other", ""], default: "" },

//       education: {
//         type: String,
//         enum: [
//           "High School",
//           "Vocational",
//           "College",
//           "Bachelor's degree",
//           "Master's degree",
//           "Doctoral",
//           "Multiple Degrees",
//         ],
//         required: true,
//       },

//       ageMin: {
//         type: Number,
//       },
//       ageMax: {
//         type: Number,
//       },
//       locationPreference: {
//         type: String,
//         enum: [
//           "in my city",
//           "in my country",
//           "in other country",
//           "doesn't matter",
//         ],
//       },
//     },
//     interestedUsers: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],

//     isCompleted: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// const Profile = mongoose.model("Profile", profileSchema);
// export default Profile;







import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // Link to User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // STEP 1: PERSONAL PROFILE
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },

    gender: {
      type: String,
      enum: ["male", "female", "non-binary"],
      required: true,
    },

    birthday: { type: String, required: true },
    age: { type: Number, required: true },

    height: { type: String, required: true },
    weight: { type: String },

    motherTongue: {
      type: String,
      enum: ["Malayalam", "Tamil", "Hindi", "Other"],
      required: true,
    },

    career: { type: String, required: true },

    religion: {
      type: String,
      default: "Hinduism",
      immutable: true,
    },

    bio: { type: String },

    // ⭐ FAMILY INFO
    father: { type: String, required: true },
    mother: { type: String, required: true },

    // ⭐ NEW FIELDS ADDED
    fatherOccupation: { type: String }, // NEW
    motherOccupation: { type: String }, // NEW
    siblings: { type: Number, min: 0 }, // NEW

    profileImages: {
      type: [String],
      validate: (val) => val.length <= 4,
      default: [],
    },

    // STEP 2: LIFESTYLE & BACKGROUND
    relationshipStatus: {
      type: String,
      enum: ["single", "divorced", "widowed", "prefer not to say"],
      required: true,
    },
    country: { type: String, required: true },
    city: { type: String },

    education: {
      type: String,
      enum: [
        "High School",
        "Vocational",
        "College",
        "Bachelor's degree",
        "Master's degree",
        "Doctoral",
        "Multiple Degrees",
      ],
      required: true,
    },

    professionalStatus: {
      type: String,
      enum: [
        "Currently unemployed",
        "Entrepreneur",
        "Freelancer/Self-employed",
        "Junior manager",
        "Specialist",
        "Student",
        "Workman",
      ],
    },

    otherProfession: { type: String },
    children: { type: String, enum: ["no children", "have children"] },

    smoking: {
      type: String,
      enum: ["dont smoke", "smoke regularly", "smoke occasionally", "prefer not to say"],
    },

    alcohol: {
      type: String,
      enum: ["dont drink", "drink frequently", "drink socially", "prefer not to say"],
    },

    // STEP 3: PARTNER PREFERENCES
    partnerPreferences: {
      interestedIn: {
        type: String,
        enum: ["male", "female", "non-binary"],
        required: true,
      },

      heightRange: String,
      weightRange: String,

      relationshipStatus: {
        type: String,
        enum: ["single", "divorced", "widowed", "prefer not to say"],
      },

      alcohol: {
        type: String,
        enum: ["dont drink", "drink frequently", "drink socially", "prefer not to say"],
      },

      smoking: {
        type: String,
        enum: ["dont smoke", "smoke regularly", "smoke occasionally", "prefer not to say"],
      },

      children: { type: String, enum: ["no children", "have children"] },

      country: String,

      religion: {
        type: String,
        default: "Hinduism",
        immutable: true,
      },

      language: {
        type: String,
        enum: ["Malayalam", "Tamil", "Hindi", "Other", ""],
        default: "",
      },

      education: {
        type: String,
        enum: [
          "High School",
          "Vocational",
          "College",
          "Bachelor's degree",
          "Master's degree",
          "Doctoral",
          "Multiple Degrees",
        ],
        required: true,
      },

      ageMin: Number,
      ageMax: Number,

      locationPreference: {
        type: String,
        enum: ["in my city", "in my country", "in other country", "doesn't matter"],
      },
    },

    interestedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
