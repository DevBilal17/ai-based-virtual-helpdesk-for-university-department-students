import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  HelpCircle,
  Database,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice.js";
import { toast } from "react-toastify";

const DashSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  // Sidebar Tabs
  const tabs = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "User Management",
      icon: Users,
      path: "/dashboard/students",
    },
    {
      name: "FAQ Management",
      icon: HelpCircle,
      path: "/dashboard/faqs",
    },
    {
      name: "Data Management",
      icon: Database,
      path: "/dashboard/data",
    },
  ];

  // Logout Handler
  const handleLogout = () => {
    dispatch(signOutSuccess());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside className="w-56 min-h-screen bg-[#0B0F19] border-r border-gray-800 flex flex-col">
      {/* Scrollable Section */}
      <div className="flex-1 overflow-y-auto px-3 py-6">
        {/* Title */}
        {/* <h2 className="text-xs text-gray-400 uppercase mb-4 tracking-wide">
          Navigation
        </h2> */}

        {/* Tabs */}
        <div className="flex flex-col gap-4">
          {tabs.map((tab, index) => {
            const isActive = location.pathname === tab.path;

            return (
              <div
                key={index}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-4 px-2 py-2 rounded-lg cursor-pointer transition-all
                  ${
                    isActive
                      ? "bg-[#1F2937] text-white"
                      : "text-gray-400 hover:bg-[#111827] hover:text-white"
                  }
                `}
              >
                <tab.icon size={18} />
                <span className="text-sm font-medium">{tab.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Logout Section */}
      <div className="border-t border-gray-800 p-4">
        <div
          onClick={handleLogout}
          className="flex items-center justify-between cursor-pointer hover:bg-[#111827] px-3 py-2 rounded-lg transition"
        >
          <div className="flex items-center gap-3">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpsKUeoi6uNxRGEZHWNdr02NKSGPypCXi7uw&s"
              alt="avatar"
              className="w-9 h-9 rounded-full border border-gray-600"
            />
            <span className="text-sm text-white font-medium">
              {currentUser?.data?.user?.name || "Admin User"}
            </span>
          </div>

          <LogOut
            size={18}
            className="text-gray-400 hover:text-red-500 transition"
          />
        </div>
      </div>
    </aside>
  );
};

export default DashSidebar;
