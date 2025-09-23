import commentModel from "../models/comment.models.js";
import recipeModel from "../models/recipe.models.js";

const updateRecipeRatingStats = async (recipeId) => {
  const comments = await commentModel.find({ recipe: recipeId });

  const totalReviews = comments.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : (
          comments.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
        ).toFixed(1);

  await recipeModel.findByIdAndUpdate(recipeId, {
    averageRating,
    totalReviews,
  });
};

export default updateRecipeRatingStats;
