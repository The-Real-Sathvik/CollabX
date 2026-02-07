import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import {
  getAllUsers,
  suspendUser,
  banUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getAllUsers);
router.patch("/suspend/:id", protect, adminOnly, suspendUser);
router.patch("/ban/:id", protect, adminOnly, banUser);

export default router;
