import { createContext, useContext, useEffect, useState } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchCurrentUser,
} from "../api/authApi";
import { toast } from "react-toastify";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchCurrentUser();
        setUser(data?.user);
      } catch (err) {
        setUser(null);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Login
  const login = async (formData) => {
    try {
      const data = await loginUser(formData);
      setUser(data.user);
      toast.success("Logged in successfully!");
      return data;
    } catch (err) {
      console.error("Register Error:", err.message);
      throw err;
    }
  };

  // Register
  const register = async (formData) => {
    try {
      const data = await registerUser(formData);
      setUser(data.user);
      toast.success("Registered successfully!");
      return data;
    } catch (err) {
      console.error("Register Error:", err.message);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      toast.info("Logged out");
    } catch (err) {
      toast.error(err.message || "Logout failed");
    }
  };

  //update Follow/Unfollow
  const updateFollowing = (userId, follow) => {
    if (!user) return;
    const updatedFollowing = follow
      ? [...user.following, userId]
      : user.following.filter((id) => id !== userId);

    setUser((prev) => ({
      ...prev,
      following: updatedFollowing,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
        updateFollowing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
