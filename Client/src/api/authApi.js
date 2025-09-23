import axiosInstance from "../utils/axios";

// Login
export const loginUser = async (userData) => {
  try {
    const res = await axiosInstance.post("/auth/login", userData);
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to Login. Try again.";
    throw new Error(message);
  }
};

// Register
export const registerUser = async (userData) => {
  try {
    const res = await axiosInstance.post("/auth/register", userData);
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to register. Try again.";
    throw new Error(message);
  }
};

// Logout
export const logoutUser = async () => {
  try {
    const res = await axiosInstance.post("/auth/logout");
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to logout. Try again.";
    throw new Error(message);
  }
};

// Get currently logged-in user
export const fetchCurrentUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (err) {
    const message =
      err.response?.data?.message || "Failed to fetch user. Try again.";
    throw new Error(message);
  }
};
