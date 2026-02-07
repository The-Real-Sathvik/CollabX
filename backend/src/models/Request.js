import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// Ensure a user can't send multiple requests to the same person
requestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

export default mongoose.model("Request", requestSchema);
