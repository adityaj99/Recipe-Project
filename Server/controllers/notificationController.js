import notificationModel from "../models/notification.models.js";

const getUserNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find({ recipient: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("sender", "name avatar")
      .populate("recipe", "title");

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Notification fetch error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const markAsRead = async (req, res) => {
  try {
    await notificationModel.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update" });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await notificationModel.updateMany(
      { recipient: req.user.userId },
      { isRead: true }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all as read error:", error.message);
    res.status(500).json({ message: "Failed to update" });
  }
};

export { getUserNotifications, markAsRead, markAllAsRead };
