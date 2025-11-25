import axiosInstance from "../utils/axios";

export const getAllCategories = async () => {
  try {
    const res = await axiosInstance.get("/recipes/get-categories");
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to get categories. Try again.";
    throw new Error(message);
  }
};

export const getAllSubCategories = async () => {
  try {
    const res = await axiosInstance.get("/recipes/get-subcategories");
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to get subcategories. Try again.";
    throw new Error(message);
  }
};

export const addRecipe = async (recipeData) => {
  try {
    const res = await axiosInstance.post("/recipes", recipeData);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to add recipe. Try again.";
    throw new Error(message);
  }
};

export const getMyRecipes = async (userId) => {
  try {
    const res = await axiosInstance.get(`/recipes/my-recipes?userId=${userId}`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to get my recipes. Try again.";
    throw new Error(message);
  }
};

export const getTrendingRecipes = async () => {
  try {
    const res = await axiosInstance.get("/recipes/trending");
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      "Failed to get trending recipes. Try again.";
    throw new Error(message);
  }
};

export const getPopularRecipes = async () => {
  try {
    const res = await axiosInstance.get("/recipes/popular");
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      "Failed to get popular recipes. Try again.";
    throw new Error(message);
  }
};

export const getSingleRecipe = async (recipeId) => {
  try {
    const res = await axiosInstance.get(`/recipes/${recipeId}`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to get recipe. Try again.";
    throw new Error(message);
  }
};

export const getAllRecipes = async ({ limit, search, page }) => {
  try {
    let url = `/recipes?limit=${limit}&page=${page}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const res = await axiosInstance.get(url);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to get recipes. Try again.";
    throw new Error(message);
  }
};

export const getQuickRecipes = async () => {
  try {
    const res = await axiosInstance.get(`/recipes/quick`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to get quick recipes. Try again.";
    throw new Error(message);
  }
};

export const getRecipesByCurrentSeason = async () => {
  try {
    const res = await axiosInstance.get(`/recipes/season/current`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      "Failed to get recipes by season. Try again.";
    throw new Error(message);
  }
};

export const getRecipesByCategorySlug = async (slug) => {
  try {
    const res = await axiosInstance.get(`/recipes/c/${slug}`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      "Failed to get recipes by category. Try again.";
    throw new Error(message);
  }
};

export const toggleSaveRecipe = async (recipeId) => {
  try {
    const res = await axiosInstance.post(`/recipes/${recipeId}/save`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      "Failed to save/unsaved recipe. Try again.";
    throw new Error(message);
  }
};

export const toggleLikeRecipe = async (recipeId) => {
  try {
    const res = await axiosInstance.post(`/recipes/${recipeId}/like`);
    return res?.data;
  } catch (err) {
    if (err.response?.status === 401) {
      throw new Error("your are not authorized. Please log in.");
    }
    const message =
      err.response?.data?.message || "Failed to like/unlike recipe. Try again.";
    throw new Error(message);
  }
};

export const removeSaveRecipe = async (recipeId) => {
  try {
    const res = await axiosInstance.post(`/recipes/${recipeId}/remove`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      "Failed to remove saved recipe. Try again.";
    throw new Error(message);
  }
};

export const getSavedRecipes = async () => {
  try {
    const res = await axiosInstance.get(`/recipes/saved`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to get saved recipes. Try again.";
    throw new Error(message);
  }
};

export const getCollections = async () => {
  try {
    const res = await axiosInstance.get(`/collections/`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to get collections. Try again.";
    throw new Error(message);
  }
};

export const getCollectionById = async (collectionId) => {
  try {
    const res = await axiosInstance.get(`/collections/${collectionId}`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to get collection. Try again.";
    throw new Error(message);
  }
};

export const getSimilarRecies = async (tagName, recipeId) => {
  try {
    const res = await axiosInstance.get(`/recipes/similar/recipes`, {
      params: { tagName, recipeId },
    });
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      "Failed to get similar recipes. Try again.";
    throw new Error(message);
  }
};

export const addNutrition = async (nutritionData) => {
  try {
    const res = await axiosInstance.post(
      "/recipes/add-nutrtion",
      nutritionData
    );
    return res?.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to add nutrition. Try again.";
    throw new Error(message);
  }
};

export const getNutritionInfo = async (recipeId) => {
  try {
    const res = await axiosInstance.get(`/recipes/${recipeId}/nutrition`);
    return res?.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }

    const message =
      error.response?.data?.message || "Failed to get nutrition. Try again.";
    throw new Error(message);
  }
};
