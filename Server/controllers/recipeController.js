import recipeModel from "../models/recipe.models.js";
import categoryModel from "../models/category.models.js";
import nutritionFactModel from "../models/nutrient.models.js";
import userModel from "../models/user.models.js";
import createNotification from "../uitls/createNotification.js";

const addRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      steps,
      notes,
      category,
      cuisines,
      seasons,
      prepTime,
      cookingTime,
      totalTime,
      servings,
      tagName,
    } = req.body;

    const parsedIngredients =
      typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;

    const parsedSteps = typeof steps === "string" ? JSON.parse(steps) : steps;

    const parsedCuisines =
      typeof cuisines === "string" ? JSON.parse(cuisines) : cuisines;

    const parsedSeasons =
      typeof seasons === "string" ? JSON.parse(seasons) : seasons;

    if (!title) {
      return res.status(400).json({ message: "Recipe title is required." });
    }

    if (!parsedIngredients || !Array.isArray(parsedIngredients)) {
      return res
        .status(400)
        .json({ message: "Valid ingredients are required." });
    }

    if (!parsedSteps || !Array.isArray(parsedSteps)) {
      return res.status(400).json({ message: "Valid steps are required." });
    }

    if (!category) {
      return res.status(400).json({ message: "Recipe category is required." });
    }

    if (!prepTime) {
      return res.status(400).json({ message: "Preparation time is required." });
    }

    if (!cookingTime) {
      return res.status(400).json({ message: "Cooking time is required." });
    }

    if (!totalTime) {
      return res.status(400).json({ message: "Total time is required." });
    }

    if (!servings) {
      return res.status(400).json({ message: "Servings are required." });
    }

    if (!tagName) {
      return res.status(400).json({ message: "Tag name is required." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required." });
    }

    const image = {
      url: req.file.path,
      public_id: req.file.filename,
    };

    const recipe = await recipeModel.create({
      title,
      description,
      ingredients: parsedIngredients,
      steps: parsedSteps,
      notes,
      image,
      category,
      cuisines: parsedCuisines,
      seasons: parsedSeasons,
      prepTime,
      cookingTime,
      totalTime,
      servings,
      tagName,
      author: req.user.userId,
      status: "pending",
    });

    const user = await userModel.findById(req.user.userId);

    user.recipes.push(recipe._id);
    await user.save();

    const admins = await userModel.find({ role: "admin" });
    for (const admin of admins) {
      await createNotification({
        recipient: admin._id,
        sender: req.user.userId,
        type: "recipeSubmitted",
        recipe: recipe._id,
        message: `New recipe "${recipe.title}" submitted for approval.`,
      });
    }

    res.status(201).json({
      message: "Recipe submitted for review. Awaiting admin approval.",
      recipe,
    });
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ message: "Server error while adding recipe." });
  }
};

const addNutritionInfo = async (req, res) => {
  try {
    const { servingsPerContainer, calories, nutrients, recipeId } = req.body;

    const recipe = await recipeModel.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const existing = await nutritionFactModel.findOne({ recipe: recipeId });
    if (existing) {
      existing.servingsPerContainer = servingsPerContainer;
      existing.calories = calories;
      existing.nutrients = nutrients;

      const updated = await existing.save();

      return res.status(200).json({
        message: "Nutrition fact updated successfully",
        nutrition: updated,
      });
    }

    const newFact = await nutritionFactModel.create({
      servingsPerContainer,
      calories,
      nutrients,
      recipe: recipeId,
    });

    return res.status(201).json({
      message: "Nutrition fact added successfully",
      nutrition: newFact,
    });
  } catch (error) {
    console.error("Error processing nutrition fact:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getNutritionInfo = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const nutrition = await nutritionFactModel.findOne({ recipe: recipeId });
    if (!nutrition) {
      return res.status(404).json({ message: "Nutrition not found" });
    }

    res.status(200).json(nutrition);
  } catch (error) {
    console.error("Error fetching nutrition:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const {
      page = 1,
      limit,
      category,
      cuisine,
      season,
      isTrending,
      search,
    } = req.query;

    const query = { status: "approved" };

    if (category) {
      const categoryDoc = await categoryModel.findById(category);

      if (categoryDoc && !categoryDoc.parentCategory) {
        const subcategories = await categoryModel.find({
          parentCategory: category,
        });
        const subcategoryIds = subcategories.map((sub) => sub._id);

        query.category = { $in: [category, ...subcategoryIds] };
      } else {
        query.category = category;
      }
    }

    if (cuisine) query.cuisines = cuisine;
    if (season) query.seasons = season;
    if (isTrending) query.isTrending = isTrending === "true";

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const recipes = await recipeModel
      .find(query)
      .select("image title createdAt averageRating totalReviews")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await recipeModel.countDocuments(query);

    res.status(200).json({
      recipes,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getQuickRecipes = async (req, res) => {
  try {
    const recipes = await recipeModel
      .find({ status: "approved", totalTime: { $lte: 35 } })
      .select("image title description createdAt")
      .sort({ createdAt: -1 })
      .limit(4);

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching quick recipes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const mainCategories = await categoryModel
      .find({ parentCategory: null })
      .populate({
        path: "children",
        populate: { path: "children" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(mainCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllSubCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find({
      parentCategory: { $ne: null },
    });

    if (!categories) {
      return res.status(404).json({ message: "Categories not exists!..." });
    }

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const toggleLikeRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.user.userId;

    const recipe = await recipeModel
      .findById(recipeId)
      .populate("author", "_id");
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const user = await userModel.findById(userId);

    const alreadyLiked = recipe.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      recipe.likes.pull(userId);
      user.likedRecipes.pull(recipeId);
    } else {
      // Like
      recipe.likes.push(userId);
      user.likedRecipes.push(recipeId);
      if (recipe.author._id !== userId) {
        await createNotification({
          recipient: recipe.author,
          sender: req.user.userId,
          type: "like",
          recipe: recipeId,
          message: "liked your recipe.",
        });
      }
    }

    await recipe.save();
    await user.save();

    res.status(200).json({
      message: alreadyLiked ? "Recipe unliked" : "Recipe liked",
      likes: recipe.likes,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error("Toggle like error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTrendingRecipes = async (req, res) => {
  try {
    const trendingRecipes = await recipeModel
      .find({ isTrending: true, status: "approved" })
      .populate("author", "name avatar")
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .limit(4);

    res.status(200).json(trendingRecipes);
  } catch (error) {
    console.error("Trending fetch failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPopularRecipes = async (req, res) => {
  try {
    const recipes = await recipeModel.aggregate([
      {
        $match: {
          status: "approved",
        },
      },
      {
        $addFields: {
          popularityScore: {
            $add: [
              { $multiply: [{ $size: "$likes" }, 1] },
              { $multiply: ["$totalReviews", 2] },
              { $multiply: ["$averageRating", 3] },
              { $cond: [{ $eq: ["$isPopular", true] }, 10, 0] },
            ],
          },
        },
      },
      {
        $sort: { popularityScore: -1 },
      },
      {
        $limit: 8,
      },
    ]);

    res.status(200).json({ message: "Popular recipes fetched", recipes });
  } catch (error) {
    console.error("Popular recipe fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getRecipesByCuisine = async (req, res) => {
  try {
    const { type } = req.params;

    const recipes = await recipeModel
      .find({
        cuisines: type,
        status: "approved",
      })
      .populate("author", "name avatar")
      .populate("category", "name slug");

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes by cuisine:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getRecipesBySeason = async (req, res) => {
  try {
    const { type } = req.params;

    const recipes = await recipeModel
      .find({
        seasons: type,
        status: "approved",
      })
      .populate("author", "name avatar")
      .populate("category", "name slug");

    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes by season:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getRecipesByCurrentSeason = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1; // 0-indexed
    let currentSeason = "";
    let emoji = "";

    if ([11, 12, 1].includes(currentMonth)) {
      currentSeason = "Winter";
      emoji = "❄️";
    } else if ([2, 3, 4].includes(currentMonth)) {
      currentSeason = "Spring";
      emoji = "🌸";
    } else if ([5, 6, 7].includes(currentMonth)) {
      currentSeason = "Summer";
      emoji = "🏖️";
    } else if ([8, 9, 10].includes(currentMonth)) {
      currentSeason = "Fall";
      emoji = "🍂";
    }

    const normalizedSeason = currentSeason.toLowerCase();

    const recipes = await recipeModel
      .find({
        seasons: { $regex: normalizedSeason, $options: "i" },
        status: "approved",
      })
      .populate("author", "name avatar")
      .populate("category", "name slug")
      .limit(6);

    res.status(200).json({
      season: currentSeason,
      recipes,
      emoji,
    });
  } catch (error) {
    console.error("Error fetching seasonal recipes:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getSingleRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await recipeModel
      .findById(id)
      .populate("author", "name avatar")
      .populate("category", "name slug")
      .lean();

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (err) {
    console.error("Error getting recipe:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyRecipes = async (req, res) => {
  try {
    const { userId } = req.query;

    const myRecipes = await recipeModel
      .find({ author: userId })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "User's recipes fetched successfully",
      recipes: myRecipes,
    });
  } catch (err) {
    console.error("Get my recipes error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const toggleSaveRecipe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = req.params.recipeId;

    const user = await userModel.findById(userId);

    const alreadySaved = user.SavedRecipies.includes(recipeId);

    if (alreadySaved) {
      user.SavedRecipies.pull(recipeId);
      await user.save();
      return res.status(200).json({ message: "Recipe unsaved", saved: false });
    } else {
      user.SavedRecipies.push(recipeId);
      await user.save();
      return res.status(200).json({ message: "Recipe saved", saved: true });
    }
  } catch (err) {
    console.error("Toggle save error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const removeSavedRecipeById = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await recipeModel.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.SavedRecipies = user.SavedRecipies.filter(
      (r) => r.toString() !== recipeId
    );

    await user.save();

    return res.status(200).json({ message: "Recipe unsaved" });
  } catch (error) {
    console.error("Remove saved error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getSavedRecipes = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await userModel.findById(userId).populate({
      path: "SavedRecipies",
      populate: { path: "category", select: "name slug" },
    });

    res.status(200).json({
      message: "Saved recipes fetched successfully",
      recipes: user.SavedRecipies,
    });
  } catch (err) {
    console.error("Get saved recipes error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getRecipesByCategorySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const category = await categoryModel.findOne({ slug });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    let categoryIds = [];

    if (!category.parentCategory) {
      const subcategories = await categoryModel.find({
        parentCategory: category._id,
      });
      categoryIds = subcategories.map((cat) => cat._id);
      if (categoryIds.length === 0) {
        categoryIds = [category._id];
      }
    } else {
      categoryIds = [category._id];
    }

    const recipes = await recipeModel
      .find({ category: { $in: categoryIds } })
      .populate("category", "name slug")
      .select("title image.url createdAt averageRating totalReviews")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      recipes,
      name: category.name,
      description: category.description,
      image: category.image,
    });
  } catch (error) {
    console.error("Error fetching recipes:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const getSimilarRecipes = async (req, res) => {
  const { tagName, recipeId } = req.query;

  try {
    const similarRecipes = await recipeModel.find({
      _id: { $ne: recipeId },
      tagName: tagName,
      status: "approved",
    });

    return res
      .status(200)
      .json({ message: "Similar Recipes fetched", similarRecipes });
  } catch (error) {
    console.error("Error fetching similar recipes:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export {
  addRecipe,
  addNutritionInfo,
  getNutritionInfo,
  getAllRecipes,
  getQuickRecipes,
  getAllCategories,
  getAllSubCategories,
  toggleLikeRecipe,
  getTrendingRecipes,
  getPopularRecipes,
  getRecipesByCuisine,
  getRecipesBySeason,
  getRecipesByCurrentSeason,
  getSingleRecipe,
  getMyRecipes,
  toggleSaveRecipe,
  removeSavedRecipeById,
  getSavedRecipes,
  getRecipesByCategorySlug,
  getSimilarRecipes,
};
