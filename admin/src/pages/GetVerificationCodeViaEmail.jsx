import React, { useState } from "react";
import axios from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GetVerificationCodeViaEmail = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter your email");
    }

    try {
      setLoading(true);

      const res = await axios.post("/auth/send-otp", { email });

      toast.success(res.data.message || "OTP sent successfully");

      // ✅ Navigate to next step
      navigate("/put-verification-code", { state: { email } });
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";

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
          Get Verification Code
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-md bg-[#1f2937] text-white outline-none border border-gray-700 focus:border-blue-500"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-md font-medium disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-gray-400 text-sm mt-4 text-center">
          <span
            className="cursor-pointer hover:text-white"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default GetVerificationCodeViaEmail;
