import notificationModel from "../models/notification.models.js";

const createNotification = async ({
  recipient,
  sender,
  type,
  recipe = null,
  message = "",
}) => {
  try {
    await notificationModel.create({
      recipient,
      sender,
      type,
      recipe,
      message,
    });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
};

export default createNotification;
