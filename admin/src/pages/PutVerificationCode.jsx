import React, { useState, useRef, useEffect } from "react";
import axios from "../api/axios.js";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { KeyRound } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
      <div className="w-full max-w-md bg-[#0f172a] border-2 border-gray-800 rounded-lg p-6 shadow-lg mx-auto">
        {/* Put Verification Code Title */}
        <div className="flex items-center justify-center gap-3">
          <KeyRound size={26} className="text-blue-600" />
          <h1 className="text-3xl font-semibold text-gray-200">
            Put Verification Code
          </h1>
        </div>

        <div
          className={
            "w-full mx-auto my-6 border-t-2 border-gray-700 transition-all"
          }
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* OTP Inputs */}
          <div
            className="flex justify-between gap-10 mb-2"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                maxLength={1}
                ref={(el) => (inputsRef.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-full text-center text-xl p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          {/* Timer */}
          {/* <div className="text-center text-gray-400 text-sm">
            {timeLeft > 0 ? (
              <p>Code expires in {formatTime(timeLeft)}</p>
            ) : (
              <p className="text-red-400">Code expired</p>
            )}
          </div> */}

          {/* Verify Code Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="text-center mt-4 text-sm">
          {timeLeft > 0 ? (
            <span className="text-gray-400">
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
