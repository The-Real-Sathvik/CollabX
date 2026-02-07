import express from "express";
import { getUsers, getMe, updateProfile } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getUsers);
router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);

export default router;
