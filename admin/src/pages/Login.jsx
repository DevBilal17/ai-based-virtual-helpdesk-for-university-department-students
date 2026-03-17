import React, { useState } from "react";
import axios from "../api/axios.js";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="w-full max-w-md bg-[#111827] p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-semibold text-white text-center mb-6">
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            id="email"
            placeholder="Email"
            onChange={handleChange}
            className="p-3 rounded-md bg-[#1f2937] text-white outline-none border border-gray-700 focus:border-blue-500"
          />

          <input
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
            className="p-3 rounded-md bg-[#1f2937] text-white outline-none border border-gray-700 focus:border-blue-500"
          />

          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-md font-medium disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-gray-400 text-sm mt-4 text-center">
          Forgot password?
        </div>
      </div>
    </div>
  );
};

export default Login;
