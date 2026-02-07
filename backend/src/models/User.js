import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    // Profile fields
    bio: { type: String, default: "" },
    skills: [{ type: String }],
    availability: { type: String, default: "" },
    projects: [{ type: String }],
    
    contact: {
      mobile: { type: String, default: "" },
      linkedin: { type: String, default: "" }
    },

    // User status
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },

    // Profile completion
    isProfileComplete: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
