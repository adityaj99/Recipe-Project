import axiosInstance from "../utils/axios";

export const getNotifications = async () => {
  try {
    const res = await axiosInstance.get(`/notifications/`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to get notifications.";
    throw new Error(message);
  }
};

export const markAsRead = async (id) => {
  try {
    const res = await axiosInstance.get(`/notifications/${id}/read`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to mark notification as read.";
    throw new Error(message);
  }
};

export const markAllAsRead = async () => {
  try {
    const res = await axiosInstance.get(`/notifications/mark-all-read`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      "Failed to mark all notifications as read.";
    throw new Error(message);
  }
};
