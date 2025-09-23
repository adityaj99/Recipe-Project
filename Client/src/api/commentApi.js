import axiosInstance from "../utils/axios";

import { toast } from "react-toastify";

export const addComment = async ({ recipeId, text, rating, userId }) => {
  try {
    const res = await axiosInstance.post(`/comments/${recipeId}`, {
      text,
      rating,
      userId,
    });
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to add comment. Try again.";
    toast.error(message);
    throw new Error(message);
  }
};

export const getRecipeComments = async (recipeId, page = 1) => {
  try {
    if (recipeId) {
      const res = await axiosInstance.get(`/comments/${recipeId}?page=${page}`);
      return res?.data;
    }
  } catch (err) {
    const message =
      err.response?.data?.message ||
      "Failed to get recipe comments. Try again.";
    throw new Error(message);
  }
};

export const helpfulComment = async (commentId) => {
  try {
    const res = await axiosInstance.patch(`/comments/helpful/${commentId}`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to add helpful. Try again.";
    throw new Error(message);
  }
};
