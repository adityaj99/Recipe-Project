import { v2 as cloudinary } from "cloudinary";
import categoryModel from "../models/category.models.js";
import recipeModel from "../models/recipe.models.js";
import userModel from "../models/user.models.js";
import checkAndAwardBadges from "../uitls/awardBadges.js";

import createNotification from "../uitls/createNotification.js";
import { recipeApprovedTemplate } from "../uitls/emailTemplates.js";
import sendMail from "../uitls/sendMail.js";

const createCategory = async (req, res) => {
  try {
    const { name, parentCategory, description } = req.body;

    if (!name || !description || !req.file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await categoryModel.findOne({ name });
    if (exists) {
      await cloudinary.uploader.destroy(req.file.filename)
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = await categoryModel.create({
      name,
      parentCategory: parentCategory || null,
      description,
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    return res
      .status(201)
      .json({ message: "Category created", category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const mainCategories = await categoryModel
      .find({ parentCategory: null })
      .populate({
        path: "children",
        populate: { path: "children" }, // nested children
      })
      .sort({ createdAt: -1 });

    res.status(200).json(mainCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const approveAndEditRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      category,
      cuisines,
      seasons,
      isTrending,
      tagName,
      rejectionReason,
    } = req.body;

    const recipe = await recipeModel
      .findById(id)
      .populate("author", "name email");
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (status) recipe.status = status;
    if (category) recipe.category = category;
    if (cuisines) recipe.cuisines = cuisines;
    if (seasons) recipe.seasons = seasons;
    if (typeof isTrending === "boolean") recipe.isTrending = isTrending;
    if (tagName) recipe.tagName = tagName;

    await recipe.save();

    if (status === "approved") {
      await createNotification({
        recipient: recipe.author,
        type: "recipeApproved",
        recipe: recipe._id,
        message: "Your recipe has been approved by Admin!",
      });
      await sendMail(
        recipe.author.email,
        `Your Recipe titled ${recipe.title} Approved`,
        recipeApprovedTemplate({
          userName: recipe.author.name,
          recipeTitle: recipe.title,
          recipeLink: process.env.FRONTEND_URL + "/recipe/" + recipe._id,
          appName: process.env.APP_NAME,
        })
      );
    } else if (status === "rejected") {
      await createNotification({
        recipient: recipe.author,
        type: "recipeRejected",
        recipe: recipe._id,
        message: "Your recipe has been rejected by Admin!",
      });
      recipe.rejectionReason = rejectionReason;
      await sendMail(
        recipe.author.email,
        `Your Recipe titled ${recipe.title} Rejected`,
        recipeApprovedTemplate({
          userName: recipe.author.name,
          recipeTitle: recipe.title,
          appName: process.env.APP_NAME,
          feedback: rejectionReason,
        })
      );
    }
    await recipe.save();

    await checkAndAwardBadges(recipe.author._id);

    res
      .status(200)
      .json({ message: status ? "Recipe approved" : "Recipe updated", recipe });
  } catch (error) {
    console.error("Admin approval error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const togglePopularStatus = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const recipe = await recipeModel.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    recipe.isPopular = !recipe.isPopular;
    await recipe.save();

    res.status(200).json({
      message: "Popularity status toggled",
      isPopular: recipe.isPopular,
    });
  } catch (error) {
    console.error("Toggle popular error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPendingRecipes = async (req, res) => {
  try {
    const recipes = await recipeModel
      .find({ status: "pending" })
      .populate("author", "name");
    res.status(200).json({ recipes });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending recipes" });
  }
};

const getApprovedRecipes = async (req, res) => {
  try {
    const recipes = await recipeModel
      .find({ status: "approved" })
      .populate("author", "name");
    res.status(200).json({ recipes });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch approved recipes" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    let filter = {};
    if (role) {
      filter.role = role;
    }

    const users = await userModel.find(filter).select("-password");

    res.status(200).json({
      success: true,
      total: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not exists!" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

const getCounts = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalRecipes = await recipeModel.countDocuments();

    const activeUsersWithApprovedRecipes = await recipeModel.distinct(
      "author",
      {
        status: "approved",
      }
    );

    const totalActiveUsers = activeUsersWithApprovedRecipes.length;

    res.status(200).json({
      totalUsers,
      totalRecipes,
      totalActiveUsers,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({
      message: "Failed to fetch counts",
    });
  }
};


const getUserGrowth = async (req, res) => {
  try {
    const { timeframe = "week" } = req.query;
    let now = new Date();
    let startDate = new Date(now);
    let previousStart = new Date(now);
    let previousEnd = new Date(now);

    if (timeframe === "week") {
      startDate.setDate(now.getDate() - 7);
      previousStart.setDate(now.getDate() - 14);
      previousEnd.setDate(now.getDate() - 7);
    } else if (timeframe === "month") {
      startDate.setMonth(now.getMonth() - 1);
      previousStart.setMonth(now.getMonth() - 2);
      previousEnd.setMonth(now.getMonth() - 1);
    } else if (timeframe === "year") {
      startDate.setFullYear(now.getFullYear() - 1);
      previousStart.setFullYear(now.getFullYear() - 2);
      previousEnd.setFullYear(now.getFullYear() - 1);
    }

    const data = await userModel.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    
    const currentTotal = await userModel.countDocuments({
      createdAt: { $gte: startDate },
    });

    const previousTotal = await userModel.countDocuments({
      createdAt: { $gte: previousStart, $lt: previousEnd },
    });

    let growth = 0;
    if (previousTotal > 0) {
      growth = ((currentTotal - previousTotal) / previousTotal) * 100;
    } else if (currentTotal > 0) {
      growth = 100;
    }

    res.json({
      data,
      growth: growth.toFixed(2),
      currentTotal,
      previousTotal,
    });
  } catch (error) {
    console.error("Error fetching user growth:", error);
    res.status(500).json({ message: "Failed to fetch user growth" });
  }
};

const getRecipeStatusCounts = async (req, res) => {
  const data = await recipeModel.aggregate([
    { $match: { status: { $in: ["pending", "approved", "rejected"] } } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({ success: true, data });
};

const getRecipeById = async (req, res) => {
  try {
    const recipe = await recipeModel
      .findById(req.params.id)
      .populate("category");
    if (!recipe) {
      return res.status(400).json({ message: "Recipe not exists!" });
    }

    res.status(200).json({ recipe });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipe" });
  }
};

const makeUserAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "admin";
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated to admin",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  createCategory,
  getAllCategories,
  approveAndEditRecipe,
  togglePopularStatus,
  getPendingRecipes,
  getApprovedRecipes,
  getAllUsers,
  getUserById,
  getCounts,
  getUserGrowth,
  getRecipeStatusCounts,
  getRecipeById,
  makeUserAdmin,
};
