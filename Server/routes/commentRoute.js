import express from "express";
import {
  addComment,
  deleteComment,
  getRecipeComments,
  markHelpful,
} from "../controllers/commentController.js";
import { protect } from "../middlewares/authMiddleware.js";
import canDeleteComment from "../middlewares/commentDeletionMiddleware.js";

const router = express.Router();

router.post("/:recipeId", protect, addComment);
router.get("/:recipeId", getRecipeComments);
router.patch("/helpful/:commentId", protect, markHelpful);
router.delete("/:commentId", protect, canDeleteComment, deleteComment);

export default router;
