import React, { useState } from "react";
import axios from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MailCheck } from "lucide-react";

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

      // Navigate to next step
      navigate("/put-verification-code", { state: { email } });
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
      <div className="w-full max-w-lg bg-[#0f172a] border-2 border-gray-800 rounded-lg p-6 shadow-lg mx-auto">
        {/* Get Verification Code Title */}
        <div className="flex items-center justify-center gap-3">
          <MailCheck size={26} className="text-blue-600" />
          <h1 className="text-3xl font-semibold text-gray-200">
            Get Verification Code
          </h1>
        </div>

        <div
          className={
            "w-full mx-auto my-6 border-t-2 border-gray-700 transition-all"
          }
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="">
            <label className="block mb-2 text-lg font-medium text-gray-400">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200"
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
