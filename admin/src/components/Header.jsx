import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Settings, Search, LogInIcon } from "lucide-react";
import { useSelector } from "react-redux";
import profile_pic from "../assets/profile_pic.png";

const Header = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Ctrl + K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0f172a] border-b-2 border-gray-800 shadow-md">
      <div className="flex items-center justify-between px-6 py-3">
        {/* LEFT: App Name */}
        <div
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer select-none"
        >
          <h1 className="text-white text-lg font-semibold">
            Virtual <span className="text-blue-500">HELPDESK</span>
          </h1>
          <p className="text-gray-300 text-[10px] text-center">
            ADMIN DASHBOARD
          </p>
        </div>

        {/* CENTER: Search Bar */}
        <div className="flex-1 max-w-xl mx-6">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="global-search"
              type="text"
              placeholder="Global Search..."
              className="w-full pl-10 pr-16 py-2 bg-[#111827] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            {/* Ctrl + K hint */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 border border-gray-600 px-2 py-0.5 rounded">
              Ctrl + K
            </span>
          </div>
        </div>

        {/* RIGHT: Icons + Profile */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          {currentUser ? (
            <button
              onClick={() => navigate("/dashboard/notifications")}
              className="text-gray-300 cursor-pointer hover:text-white hover:bg-indigo-600 p-2.5 rounded-full transition"
            >
              <Bell size={20} />
            </button>
          ) : (
            ""
          )}

          {/* Settings */}
          {currentUser ? (
            <button
              onClick={() => navigate("/dashboard/settings")}
              className="text-gray-300 cursor-pointer hover:text-white hover:bg-indigo-600 p-2.5 rounded-full transition"
            >
              <Settings size={20} />
            </button>
          ) : (
            ""
          )}

          {/* Profile Section */}
          {currentUser ? (
            <div
              onClick={() => navigate("/dashboard/profile")}
              className="ml-4 flex items-center gap-3 cursor-pointer hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition"
            >
              <img
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpsKUeoi6uNxRGEZHWNdr02NKSGPypCXi7uw&s" ||
                  profile_pic
                }
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover border border-gray-600"
              />
              <div className="flex flex-col items-center">
                <span className="text-sm text-white font-medium">
                  {currentUser?.data?.user?.name || "Admin User"}
                </span>
                <span className="text-gray-300 text-[10px] text-center">
                  {currentUser?.data?.user?.email || "admin@example.com"}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 cursor-pointer hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition">
              <button
                onClick={() => navigate("/login")}
                className="text-md text-white font-medium"
              >
                Login
              </button>
              <LogInIcon size={20} className="text-white" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
