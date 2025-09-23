import { toast } from "react-toastify";
import axiosInstance from "../utils/axios";

export const getAllUsers = async (query) => {
  try {
    const res = await axiosInstance.get(`/admin/get-users`, {
      params: query,
    });
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to Login. Try again.";
    throw new Error(message);
  }
};

export const getSingleUser = async (id) => {
  try {
    const res = await axiosInstance.get(`/admin/get-user/${id}`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to Login. Try again.";
    throw new Error(message);
  }
};

export const getApprovedRecipes = async () => {
  try {
    const res = await axiosInstance.get(`/admin/approved-recipes`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to Login. Try again.";
    throw new Error(message);
  }
};

export const getPendingRecipes = async () => {
  try {
    const res = await axiosInstance.get(`/admin/pending-recipes`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to get pending recipes.";
    throw new Error(message);
  }
};

export const getRecipes = async (status) => {
  try {
    const endpoint =
      status === "approved"
        ? "/admin/approved-recipes"
        : "/admin/pending-recipes";

    const res = await axiosInstance.get(endpoint);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to Login. Try again.";
    throw new Error(message);
  }
};

export const getCounts = async () => {
  try {
    const res = await axiosInstance.get("/admin/get-counts");
    return res?.data;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to get counts.";
    throw new Error(message);
  }
};

export const getUserGrowth = async (timeframe = "week") => {
  try {
    const res = await axiosInstance.get(
      `/admin/get-user-growth?timeframe=${timeframe}`
    );
    return res?.data;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to get counts.";
    throw new Error(message);
  }
};

export const getRecipeStatusCounts = async () => {
  try {
    const res = await axiosInstance.get(`/admin/get-recipeStatus-count`);
    return res?.data;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to get counts.";
    throw new Error(message);
  }
};

export const getSingleRecipe = async (id) => {
  try {
    const res = await axiosInstance.get(`/admin/get-recipe/${id}`);
    return res?.data;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to get recipe.";
    throw new Error(message);
  }
};

export const updateRecipeByAdmin = async (recipeId, formData) => {
  try {
    const res = await axiosInstance.patch(
      `/admin/${recipeId}/approve`,
      formData
    );
    return res?.data;
  } catch (err) {
    const message = err.response?.data?.message || "Failed to update recipe.";
    throw new Error(message);
  }
};

export const createCollection = async (data) => {
  try {
    const res = await axiosInstance.post("/collections", data);
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to create collection. Try again.";
    throw new Error(message);
  }
};

export const updateCollection = async (collectionId, updates) => {
  try {
    const res = await axiosInstance.put(
      `/collections/${collectionId}`,
      updates,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to update collection. Try again.";
    throw new Error(message);
  }
};

export const deleteCollection = async (collectionId) => {
  try {
    const res = await axiosInstance.delete(`/collections/${collectionId}`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to delete collection. Try again.";
    throw new Error(message);
  }
};

export const makeUserAdmin = async (userId) => {
  try {
    const res = await axiosInstance.patch(`/admin/make-admin/${userId}/`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to make user admin. Try again.";
    throw new Error(message);
  }
};

export const createCategory = async (formData) => {
  try {
    const res = await axiosInstance.post(`/admin/category/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    localStorage.removeItem("categoriesCache");

    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to create category. Try again.";
    toast.error(message);
    throw new Error(message);
  }
};
