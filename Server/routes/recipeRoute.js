import express from "express";
import multer from "multer";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addRecipe,
  addNutritionInfo,
  getAllRecipes,
  getAllCategories,
  toggleLikeRecipe,
  getTrendingRecipes,
  getRecipesByCuisine,
  getRecipesBySeason,
  getRecipesByCurrentSeason,
  getSingleRecipe,
  getMyRecipes,
  toggleSaveRecipe,
  getSavedRecipes,
  getPopularRecipes,
  // getWeeklyPopularRecipes,
  getQuickRecipes,
  getRecipesByCategorySlug,
  removeSavedRecipeById,
  getAllSubCategories,
  getSimilarRecipes,
  getNutritionInfo,
} from "../controllers/recipeController.js";
import { recipeStorage } from "../uitls/cloudinary.js";
const router = express.Router();

const upload = multer({ storage: recipeStorage });

router.get("/my-recipes", protect, getMyRecipes);
router.post("/", protect, upload.single("image"), addRecipe);
router.post("/add-nutrtion", protect, addNutritionInfo);
router.get("/:recipeId/nutrition", getNutritionInfo);
router.get("/", getAllRecipes);
router.get("/quick", getQuickRecipes);
router.get("/popular", getPopularRecipes);
// router.get("/weekly-popular", getWeeklyPopularRecipes);
router.get("/get-categories", getAllCategories);
router.get("/get-subcategories", getAllSubCategories);
router.post("/:id/like", protect, toggleLikeRecipe);
router.post("/:recipeId/save", protect, toggleSaveRecipe);
router.post("/:recipeId/remove", protect, removeSavedRecipeById);
router.get("/saved", protect, getSavedRecipes);

// testing remaining of these routes
router.get("/c/:slug", getRecipesByCategorySlug);
router.get("/trending", getTrendingRecipes);
router.get("/cuisine/:type", getRecipesByCuisine);
router.get("/season/current", getRecipesByCurrentSeason);
router.get("/season/:type", getRecipesBySeason);
router.get("/similar/recipes", getSimilarRecipes);
router.get("/:id", getSingleRecipe);

export default router;
