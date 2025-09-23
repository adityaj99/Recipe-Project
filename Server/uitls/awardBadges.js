import recipeModel from "../models/recipe.models.js";
import userModel from "../models/user.models.js";
import createNotification from "./createNotification.js";

const checkAndAwardBadges = async (userId) => {
  const userRecipes = await recipeModel.find({
    author: userId,
    status: "approved",
  });
  const approvedCount = userRecipes.length;

  const avgRating =
    userRecipes.reduce((sum, r) => sum + (r.averageRating || 0), 0) /
    (approvedCount || 1);

  const badgesToAdd = [];

  if (approvedCount >= 10 && avgRating >= 4.5) {
    badgesToAdd.push("Silver Badge");
    await createNotification({
      recipient: userId,
      type: "badge",
      message:
        "Congratulations! You are the rising cook. You have earned the silver badge.🥈",
    });
  }

  if (approvedCount >= 25 && avgRating >= 4.7) {
    badgesToAdd.push("Gold Badge");
    await createNotification({
      recipient: userId,
      type: "badge",
      message:
        "Congratulations! You are the star chef. You have earned the gold badge.🥇",
    });
  }

  const user = await userModel.findById(userId);
  for (let badge of badgesToAdd) {
    if (!user.badges.some((b) => b.name === badge)) {
      user.badges.push({ name: badge });
    }
  }

  if (badgesToAdd.includes("Silver Badge")) {
    user.isVerifiedContributor = true;
  }

  await user.save();
};

export default checkAndAwardBadges;
