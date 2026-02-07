import User from "../models/User.js";

// Get all users (for discovery)
export const getUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    
    // Get all users except current user, only active users with complete profiles
    const users = await User.find({
      _id: { $ne: currentUserId },
      status: "active",
      isProfileComplete: true
    }).select("-password");

    res.status(200).json({
      message: "Users fetched successfully",
      users
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      message: "Server error while fetching users"
    });
  }
};

// Get current user profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      message: "Server error while fetching profile"
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { bio, skills, availability, projects, contact } = req.body;
    const userId = req.user.id;

    // Find and update user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Update fields
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;
    if (availability !== undefined) user.availability = availability;
    if (projects !== undefined) user.projects = projects;
    if (contact !== undefined) user.contact = contact;

    // Mark profile as complete if essential fields are filled
    if (user.bio && user.skills && user.skills.length > 0 && user.availability) {
      user.isProfileComplete = true;
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(userId).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: "Server error while updating profile"
    });
  }
};
