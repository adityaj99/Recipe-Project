import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { RoundedOneLoader } from "../components/RoundedOneLoader";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await login(formData);

      if (loggedInUser?.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
    console.log(formData);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Side - Image (only visible on md and up) */}
      <div className="hidden md:block w-1/2 h-full">
        <img
          src="https://imgs.search.brave.com/KZiwfKOAuzM0WDoR1AckwCWX-Zh5Fntf7n5qP5JnL4c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/dmVjdG9yLXNlYW1s/ZXNzLWZvb2QtY2hh/bGtib2FyZC13YWxs/cGFwZXJzLW1vc3Rs/eS11c2VkLXJlc3Rh/dXJhbnRzLWRlc2ln/bnNfMTI4NC00MzU4/OS5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQw"
          alt="Login visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-start px-6 sm:px-10 md:px-16 py-12 md:py-20 bg-white shadow-inner overflow-y-auto transition-all duration-500">
        <h1
          onClick={() => navigate("/")}
          className="handwritten text-2xl md:text-3xl font-bold mb-6 cursor-pointer"
        >
          Savorly
          <span className="text-yellow-400 inline-block">․</span>
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Welcome Back</h2>
        <p className="mb-10 text-gray-600 text-sm md:text-base">
          Login to continue your culinary journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              placeholder="Enter your email"
              name="email"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              placeholder="Enter your password"
              name="password"
              onChange={handleChange}
              value={formData.password}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-yellow-400 uppercase hover:bg-yellow-500 text-white font-semibold transition-all"
          >
            {loading ? <RoundedOneLoader /> : "Login"}
          </button>

          <p className={`text-red-400 ${error ? "opacity-100" : "opacity-0"}`}>
            {error}
          </p>

          <p className="text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <a href="/register" className="text-yellow-500 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
