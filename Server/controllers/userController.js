import userModel from "../models/user.models.js";
import { cloudinary } from "../uitls/cloudinary.js";
import createNotification from "../uitls/createNotification.js";

const updateUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let socials = {};
    if (req.body.socials) {
      try {
        socials =
          typeof req.body.socials === "string"
            ? JSON.parse(req.body.socials)
            : req.body.socials;
      } catch (err) {
        console.error("Invalid JSON in socials:", err);
        socials = {};
      }
    }

    if (Object.keys(socials).length > 0) {
      user.socials = {
        ...user.socials, // keep old values
        ...socials, // overwrite with new ones
      };
    }

    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.body.tag) {
      user.tag = req.body.tag;
    }

    if (req.file) {
      if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }

      user.avatar = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const toggleFollowUser = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const targetUserId = req.params.targetUserId;

    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const currentUser = await userModel.findById(currentUserId);
    const targetUser = await userModel.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      //  Unfollow logic
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      // Follow logic
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      //notification
      await createNotification({
        recipient: targetUserId,
        sender: currentUserId,
        type: "follow",
        message: `${currentUser.name} started following you.`,
      });
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
      following: !isFollowing,
    });
  } catch (error) {
    console.error("Follow/Unfollow error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getFollowers = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.userId)
      .populate("followers", "name avatar");

    res.status(200).json({
      message: "Followers fetched",
      followers: user.followers,
    });
  } catch (err) {
    console.error("Get followers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getFollowing = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user.userId)
      .populate("following", "name avatar");

    res.status(200).json({
      message: "Following fetched",
      following: user.following,
    });
  } catch (err) {
    console.error("Get following error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getFollowersFollowingCount = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId);
    res.status(200).json({
      followersCount: user.followers.length,
      followingCount: user.following.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  try {

    const user = await userModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  updateUserProfile,
  toggleFollowUser,
  getFollowers,
  getFollowing,
  getFollowersFollowingCount,
  getUserById,
};
