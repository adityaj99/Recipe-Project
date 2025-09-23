import axiosInstance from "../utils/axios";

export const getUserById = async (userId) => {
  try {
    const res = await axiosInstance.get(`/users/${userId}`);
    return res?.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to get user. Try again.";
    throw new Error(message);
  }
};

export const toggleFollow = async (targetUserId) => {
  try {
    const res = await axiosInstance.put(`/users/follow/${targetUserId}`);
    return res?.data;
  } catch (err) {
    const message =
      err?.response?.data?.message || "Failed to follow/unfollow. Try again.";
    throw new Error(message);
  }
};

export const updateUserProfile = async (formData) => {
  const res = await axiosInstance.put("/users/update-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
