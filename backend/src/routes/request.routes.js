import express from "express";
import { sendRequest, getRequests, respondToRequest } from "../controllers/request.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, sendRequest);
router.get("/", protect, getRequests);
router.post("/:id/respond", protect, respondToRequest);

export default router;
