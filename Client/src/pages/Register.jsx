import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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
      await register(formData);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Side - Image */}
      <div className="hidden md:block w-1/2 h-full">
        <img
          src="https://imgs.search.brave.com/FcYBSpwvU8lWVpTNVGnUFPUkHTzgCT0_tEg_kG2tIAw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvaXBo/b25lLWZvb2QtMW90/eDRhNzhxMjEydHV4/YS5qcGc"
          alt="Register visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-start px-6 sm:px-10 md:px-16 py-12 md:py-20 bg-white shadow-inner overflow-y-auto transition-all duration-500">
        <h1
          onClick={() => navigate("/")}
          className="handwritten text-2xl md:text-3xl font-bold mb-6 cursor-pointer"
        >
          Savorly
          <span className="text-yellow-400 inline-block">․</span>
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
          Join Us
        </h2>
        <p className="mb-10 text-gray-600 text-sm md:text-base">
          Create an account and start sharing your recipes
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              placeholder="John Doe"
              name="name"
              onChange={handleChange}
              value={formData.name}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              placeholder="example@email.com"
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
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              placeholder="********"
              name="password"
              onChange={handleChange}
              value={formData.password}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg transition-all"
          >
            Register
          </button>

          <p className={`text-red-400 ${error ? "opacity-100" : "opacity-0"}`}>
            {error}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-yellow-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
