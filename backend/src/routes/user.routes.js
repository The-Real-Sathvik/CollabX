import express from "express";
import { getUsers, getMe } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/me", protect, getMe);

export default router;
