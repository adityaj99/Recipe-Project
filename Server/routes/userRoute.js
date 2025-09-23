import express from "express";
import multer from "multer";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getFollowers,
  getFollowersFollowingCount,
  getFollowing,
  getUserById,
  toggleFollowUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { avatarStorage } from "../uitls/cloudinary.js";
const router = express.Router();

const upload = multer({ storage: avatarStorage });

router.put(
  "/update-profile",
  protect,
  upload.single("avatar"),
  updateUserProfile
);

router.put("/follow/:targetUserId", protect, toggleFollowUser);
router.get("/followers", protect, getFollowers);
router.get("/following", protect, getFollowing);
router.get("/followCount", protect, getFollowersFollowingCount);
router.get("/:userId", getUserById);

export default router;
