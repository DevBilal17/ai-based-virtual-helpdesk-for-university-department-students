import React, { useState, useEffect } from "react";
import axios from "../api/axios.js";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  // Redirect if no email (flow protection)
  useEffect(() => {
    if (!email) {
      navigate("/get-verification-code");
    }
  }, [email, navigate]);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { newPassword, confirmPassword } = formData;

    // Validation
    if (!newPassword || !confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await axios.post("/auth/admin-change-password", {
        email,
        newPassword,
        confirmPassword,
      });

      toast.success(res.data.message || "Password reset successfully");

      // Redirect to login
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to reset password";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="w-full max-w-md bg-[#111827] p-8 rounded-xl shadow-lg">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-white text-center mb-6">
          Reset Password
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email (readonly) */}
          <input
            type="email"
            value={email || ""}
            readOnly
            className="p-3 rounded-md bg-[#1f2937] text-gray-400 border border-gray-700 outline-none cursor-not-allowed"
          />

          {/* New Password */}
          <input
            type="password"
            id="newPassword"
            placeholder="New Password"
            onChange={handleChange}
            className="p-3 rounded-md bg-[#1f2937] text-white outline-none border border-gray-700 focus:border-blue-500"
          />

          {/* Confirm Password */}
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="p-3 rounded-md bg-[#1f2937] text-white outline-none border border-gray-700 focus:border-blue-500"
          />

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-md font-medium disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Back */}
        <div className="text-gray-400 text-sm mt-4 text-center">
          <span
            className="cursor-pointer hover:text-white"
            onClick={() =>
              navigate("/put-verification-code", { state: { email } })
            }
          >
            Back
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
