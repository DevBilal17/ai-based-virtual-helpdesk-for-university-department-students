import React from "react";

const FullScreenLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-gray-300 text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
