import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

export const suspendUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    status: "suspended",
  });
  res.json({ message: "User suspended" });
};

export const banUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    status: "banned",
  });
  res.json({ message: "User banned" });
};
