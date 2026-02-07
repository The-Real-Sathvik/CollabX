import Request from "../models/Request.js";
import User from "../models/User.js";

// Send collaboration request
export const sendRequest = async (req, res) => {
  try {
    const { toUserId } = req.body;
    const fromUserId = req.user.id;

    // Validation
    if (!toUserId) {
      return res.status(400).json({
        message: "Recipient user ID is required"
      });
    }

    // Can't send request to yourself
    if (fromUserId === toUserId) {
      return res.status(400).json({
        message: "You cannot send a request to yourself"
      });
    }

    // Check if recipient exists
    const recipient = await User.findById(toUserId);
    if (!recipient) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Check if request already exists
    const existingRequest = await Request.findOne({
      fromUserId,
      toUserId
    });

    if (existingRequest) {
      return res.status(409).json({
        message: "Request already sent"
      });
    }

    // Create request
    const request = await Request.create({
      fromUserId,
      toUserId
    });

    res.status(201).json({
      message: "Collaboration request sent successfully",
      request
    });
  } catch (error) {
    console.error("Send request error:", error);
    res.status(500).json({
      message: "Server error while sending request"
    });
  }
};

// Get all requests (sent and received)
export const getRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get sent requests
    const sentRequests = await Request.find({ fromUserId: userId })
      .populate("toUserId", "-password")
      .sort({ createdAt: -1 });

    // Get received requests
    const receivedRequests = await Request.find({ toUserId: userId })
      .populate("fromUserId", "-password")
      .sort({ createdAt: -1 });

    // Get matches (accepted requests)
    const matches = await Request.find({
      $or: [
        { fromUserId: userId, status: "accepted" },
        { toUserId: userId, status: "accepted" }
      ]
    })
      .populate("fromUserId", "-password")
      .populate("toUserId", "-password")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      message: "Requests fetched successfully",
      sentRequests,
      receivedRequests,
      matches
    });
  } catch (error) {
    console.error("Get requests error:", error);
    res.status(500).json({
      message: "Server error while fetching requests"
    });
  }
};

// Respond to a request (accept/reject)
export const respondToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // "accept" or "reject"
    const userId = req.user.id;

    // Validation
    if (!action || !["accept", "reject"].includes(action)) {
      return res.status(400).json({
        message: "Valid action (accept/reject) is required"
      });
    }

    // Find request
    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    // Verify the user is the recipient
    if (request.toUserId.toString() !== userId) {
      return res.status(403).json({
        message: "You can only respond to requests sent to you"
      });
    }

    // Update status
    request.status = action === "accept" ? "accepted" : "rejected";
    await request.save();

    await request.populate("fromUserId", "-password");

    res.status(200).json({
      message: `Request ${action}ed successfully`,
      request
    });
  } catch (error) {
    console.error("Respond to request error:", error);
    res.status(500).json({
      message: "Server error while responding to request"
    });
  }
};
