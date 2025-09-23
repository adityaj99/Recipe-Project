import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "allRecipies/avatars",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 300, height: 300, crop: "limit" }],
  },
});

const recipeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "allRecipies/recipes",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const categoryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "allRecipies/categories",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 1920, height: 400, crop: "fill" }],
  },
});

const collectionStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "allRecipies/collection",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 400, height: 800, crop: "fill" }],
  },
});

export {
  avatarStorage,
  recipeStorage,
  categoryStorage,
  collectionStorage,
  cloudinary,
};
