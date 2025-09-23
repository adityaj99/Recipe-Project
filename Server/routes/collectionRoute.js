import express from "express";
import {
  createCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { collectionStorage } from "../uitls/cloudinary.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: collectionStorage });

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  createCollection
);
router.get("/", getAllCollections);
router.get("/:id", getCollectionById);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  updateCollection
);
router.delete("/:id", protect, authorizeRoles("admin"), deleteCollection);
// router.post(
//   "/:id/recipes",
//   protect,
//   authorizeRoles("admin"),
//   addRecipeToCollection
// );
// router.delete(
//   "/:id/recipes/:recipeId",
//   protect,
//   authorizeRoles("admin"),
//   removeRecipeFromCollection
// );

export default router;
