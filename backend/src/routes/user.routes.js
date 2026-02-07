import express from "express";
import { getUsers, getMe } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/me", getMe);

export default router;
