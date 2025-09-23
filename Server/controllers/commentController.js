import commentModel from "../models/comment.models.js";
import recipeModel from "../models/recipe.models.js";
import updateRecipeRatingStats from "../uitls/updateRatingStats.js";

const addComment = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { text, rating, userId } = req.body;

    if (!text || !rating) {
      return res.status(400).json({ message: "Text and rating required" });
    }

    const isRecipe = await recipeModel.findById(recipeId);

    const isAuthorCommented = await commentModel.findOne({
       user: req.user.userId, 
      recipe: recipeId,
    });

    const isUserCommented = await commentModel.findOne({
       user: userId
    })

if (
  isRecipe.author.toString() === req.user.userId.toString() &&
  isAuthorCommented
) {
  return res
    .status(400)
    .json({ message: "Author can only add one comment on their own recipe." });
}

if (isUserCommented) {
  return res
    .status(400)
    .json({ message: "You can add only one comment on same." });
}


    const comment = await commentModel.create({
      recipe: recipeId,
      user: req.user.userId,
      text,
      rating,
    });

    await updateRecipeRatingStats(recipeId);

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getRecipeComments = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const skip = (page - 1) * limit;

    const total = await commentModel.countDocuments({ recipe: recipeId });
    const comments = await commentModel
      .find({ recipe: recipeId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      comments,
    });
  } catch (err) {
    console.error("Pagination error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const markHelpful = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await commentModel.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.user.userId;

    if (comment.helpful.includes(userId)) {
      comment.helpful.pull(userId);
    } else {
      comment.helpful.push(userId);
    }

    await comment.save();

    res.status(200).json({
      message: "Helpful status updated",
      helpfulCount: comment.helpful.length,
    });
  } catch (err) {
    console.error("Helpful error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = req.comment;

    const recipeId = comment.recipe;

    await comment.deleteOne();

    await updateRecipeRatingStats(recipeId);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export { addComment, getRecipeComments, markHelpful, deleteComment };
