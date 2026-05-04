import React, { useState, useEffect } from "react";
import axios from "../api/axios.js";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, LockKeyholeOpen } from "lucide-react";

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

  // ================= SHOW / HIDE PASSWORD STATES =================
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
      <div className="w-full max-w-lg bg-[#0f172a] border-2 border-gray-800 rounded-lg p-6 shadow-lg mx-auto">
        {/* Reset Password Title */}
        <div className="flex items-center justify-center gap-3">
          <LockKeyholeOpen size={26} className="text-blue-600" />
          <h1 className="text-3xl font-semibold text-gray-200">
            Reset Password
          </h1>
        </div>

        <div
          className={
            "w-full mx-auto my-6 border-t-2 border-gray-700 transition-all"
          }
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email (readonly) */}
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium text-gray-400">
              Email
            </label>
            <input
              type="email"
              value={email || ""}
              readOnly
              className="p-3 text-gray-400 cursor-not-allowed w-full bg-[#111827] border-2 border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium text-gray-400">
              New Password
            </label>

            {/* ================= NEW PASSWORD FIELD WITH SHOW/HIDE ================= */}
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                placeholder="Enter new password"
                onChange={handleChange}
                required
                className="input pr-12"
              />

              {/* Toggle Icon */}
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block mb-2 text-lg font-medium text-gray-400">
              Confirm Password
            </label>

            {/* ================= CONFIRM PASSWORD FIELD WITH SHOW/HIDE ================= */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Enter new password again"
                onChange={handleChange}
                required
                className="input pr-12"
              />

              {/* Toggle Icon */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
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
