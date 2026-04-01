import React, { useState, useRef, useEffect } from "react";
import axios from "../api/axios.js";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const PutVerificationCode = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  // Redirect if accessed directly
  useEffect(() => {
    if (!email) {
      navigate("/get-verification-code");
    }
  }, [email, navigate]);

  // OTP State
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // Timer (5 minutes = 300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);

  const inputsRef = useRef([]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Format time (MM:SS)
  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Handle input change
  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 4);

    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp([...newOtp, "", "", "", ""].slice(0, 4));

    const lastIndex = newOtp.length - 1;
    inputsRef.current[lastIndex]?.focus();
  };

  // Submit OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 4) {
      return toast.error("Please enter complete 4-digit code");
    }

    try {
      setLoading(true);

      const res = await axios.post("/auth/verify-otp", {
        email,
        otp: finalOtp,
      });

      toast.success(res.data.message || "OTP verified successfully");

      navigate("/reset-password", { state: { email } });
    } catch (error) {
      const message = error.response?.data?.message || "Invalid OTP";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      const res = await axios.post("/auth/send-otp", { email });

      toast.success(res.data.message || "OTP resent successfully");

      setTimeLeft(300); // reset timer
      setOtp(["", "", "", ""]); // clear inputs
      inputsRef.current[0]?.focus();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to resend OTP";

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="w-full max-w-md bg-[#111827] p-8 rounded-xl shadow-lg">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-white text-center mb-6">
          Enter Verification Code
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* OTP Inputs */}
          <div className="flex justify-between gap-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                maxLength={1}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-14 h-14 text-center text-xl rounded-md bg-[#1f2937] text-white border border-gray-700 focus:border-blue-500 outline-none"
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center text-gray-400 text-sm">
            {timeLeft > 0 ? (
              <p>Code expires in {formatTime(timeLeft)}</p>
            ) : (
              <p className="text-red-400">Code expired</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-md font-medium disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="text-center mt-4 text-sm">
          {timeLeft > 0 ? (
            <span className="text-gray-500">
              Resend available after {formatTime(timeLeft)}
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="text-blue-500 hover:text-blue-400"
            >
              Resend Verification Code
            </button>
          )}
        </div>

        {/* Back */}
        <div className="text-gray-400 text-sm mt-4 text-center">
          <span
            className="cursor-pointer hover:text-white"
            onClick={() => navigate("/get-verification-code")}
          >
            Back
          </span>
        </div>
      </div>
    </div>
  );
};

export default PutVerificationCode;
