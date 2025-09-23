import express from "express";
const router = express.Router();
import {
  getUserNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

router.get("/", protect, getUserNotifications);

//test remaining
router.get("/:id/read", protect, markAsRead);
router.get("/mark-all-read", protect, markAllAsRead);

export default router;
