import commentModel from "../models/comment.models.js";

const canDeleteComment = async (req, res, next) => {
  try {
    const comment = await commentModel.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (
      comment.user.toString() !== req.user.userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    req.comment = comment;
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export default canDeleteComment;
