import express from "express";
import multer from "multer";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { categoryStorage } from "../uitls/cloudinary.js";
import {
  approveAndEditRecipe,
  createCategory,
  getAllCategories,
  getAllUsers,
  getApprovedRecipes,
  getCounts,
  getPendingRecipes,
  getRecipeById,
  getRecipeStatusCounts,
  getUserById,
  getUserGrowth,
  makeUserAdmin,
} from "../controllers/adminController.js";
const router = express.Router();
const upload = multer({ storage: categoryStorage });

router.post(
  "/category/add",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  createCategory
);

router.get("/category/all", getAllCategories);

router.patch(
  "/:id/approve",
  protect,
  authorizeRoles("admin"),
  approveAndEditRecipe
);

router.get(
  "/pending-recipes",
  protect,
  authorizeRoles("admin"),
  getPendingRecipes
);

router.get(
  "/approved-recipes",
  protect,
  authorizeRoles("admin"),
  getApprovedRecipes
);

router.get("/get-users", protect, authorizeRoles("admin"), getAllUsers);
router.get("/get-user/:id", protect, authorizeRoles("admin"), getUserById);
router.get("/get-counts", protect, authorizeRoles("admin"), getCounts);
router.get("/get-user-growth", protect, authorizeRoles("admin"), getUserGrowth);
router.get(
  "/get-recipeStatus-count",
  protect,
  authorizeRoles("admin"),
  getRecipeStatusCounts
);

router.get("/get-recipe/:id", protect, authorizeRoles("admin"), getRecipeById);
router.patch(
  "/make-admin/:userId",
  protect,
  authorizeRoles("admin"),
  makeUserAdmin
);

export default router;
