import React, { useState } from "react";
import axios from "../api/axios.js";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/slices/authSlice.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Check, ShieldUser, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ================= SHOW / HIDE PASSWORD STATE =================
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return toast.error("Please fill all fields");
    }

    try {
      dispatch(signInStart());

      const res = await axios.post("/auth/login", formData);

      console.log("Login Response:", res.data);

      dispatch(signInSuccess(res.data));

      toast.success("Login successful");

      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Try again.";

      dispatch(signInFailure(message));

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
      <div className="w-full max-w-lg bg-[#0B0F19] border-2 border-gray-800 rounded-lg p-6 shadow-lg mx-auto">
        {/* Admin Login Title */}
        <div className="flex items-center justify-center gap-3">
          <ShieldUser size={26} className="text-blue-600" />
          <h1 className="text-3xl font-semibold text-gray-200">Admin Login</h1>
        </div>

        <div
          className={
            "w-full mx-auto my-6 border-t-2 border-gray-700 transition-all"
          }
        />

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium text-gray-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium text-gray-400">
              Password
            </label>

            {/* ================= PASSWORD FIELD WITH SHOW/HIDE ================= */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
                className="input pr-12"
              />

              {/* Toggle Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember me and forgot password section */}
          <div className="flex items-center justify-between text-gray-400 text-sm mt-4">
            <div className="flex items-center justify-between gap-2">
              <input type="checkbox" />
              <span>Remember me</span>
            </div>
            <span
              className="cursor-pointer hover:text-white"
              onClick={() => navigate("/get-verification-code")}
            >
              Forgot password?
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
