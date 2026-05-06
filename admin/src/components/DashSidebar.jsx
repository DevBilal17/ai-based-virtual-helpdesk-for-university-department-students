import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  HelpCircle,
  Database,
  LogOut,
  Settings,
  Bell,
  Logs,
  SidebarClose,
  SidebarOpen,
  MapPinned,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess, signOutFailure } from "../redux/slices/authSlice.js";
import { toast } from "react-toastify";
import profile_pic from "../assets/profile_pic.png";
import ConfirmModal from "./common/ConfirmModal.jsx";
import { toggleSidebar } from "../redux/slices/layoutSlice.js";
import { FaRobot } from "react-icons/fa";

const DashSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { currentUser, logoutLoading, logoutError } = useSelector(
    (state) => state.auth,
  );

  const { isSidebarCollapsed } = useSelector((state) => state.layout);

  // ================= LOGOUT MODAL STATE =================
  const [isModalOpen, setIsModalOpen] = useState(false); // controls modal visibility

  // Sidebar Navigation Tabs
  const navigationTabs = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "User Management",
      icon: Users,
      path: "/dashboard/users",
    },
    {
      name: "Data Management",
      icon: Database,
      path: "/dashboard/data",
    },
    {
      name: "FAQ Management",
      icon: HelpCircle,
      path: "/dashboard/faqs",
    },
    {
      name: "Location Management",
      icon: MapPinned,
      path: "/dashboard/locations",
    },
  ];

  // Sidebar System Tabs
  const systemTabs = [
    {
      name: "User Activity",
      icon: Logs,
      path: "/dashboard/user-logs",
    },
    {
      name: "Notifications",
      icon: Bell,
      path: "/dashboard/notifications",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
    },
  ];

  // ================= HANDLE LOGOUT CLICK =================
  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  // ================= HANDLE CONFIRM LOGOUT =================
  const handleConfirmLogout = async () => {
    try {
      dispatch(signOutSuccess());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      dispatch(
        signOutFailure(error.response?.data?.message || "Failed to logout"),
      );
    }
  };

  // ================= ACTIVE TAB CHECKER =================
  // CHANGE:
  // This will keep parent tab active for nested routes as well.
  // Example:
  // /dashboard/users
  // /dashboard/users/add-user
  // /dashboard/users/update-user/:id
  // /dashboard/users/user-details/:id

  const isTabActive = (tabPath) => {
    if (tabPath === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return location.pathname.startsWith(tabPath);
  };

  return (
    <aside
      className={`
        ${isSidebarCollapsed ? "w-[60px]" : "w-64"}
          min-h-screen bg-[#0f172a] border-r border-gray-800 flex flex-col
          transition-all duration-500 overflow-x-hidden
      `}
    >
      {/* APP LOGO AND APP NAME */}
      {/* ================= STICKY HEADER ================= */}
      {/* CHANGE: Added sticky positioning so logo section does not scroll */}
      <div
        onClick={() => navigate("/dashboard")}
        className={`sticky top-0 z-20 bg-[#0f172a] flex items-center gap-3 cursor-pointer select-none border-b-2 border-gray-800 ${
          isSidebarCollapsed ? "justify-center px-2 py-3" : "justify-start p-3"
        }`}
      >
        {/* APP LOGO */}
        <FaRobot
          size={40}
          className="bg-indigo-600 text-white rounded-lg p-2 hover:bg-indigo-600/50 hover:text-gray-200 transition duration-150"
        />
        {/* APP NAME */}
        {!isSidebarCollapsed ? (
          <div className="flex flex-col items-center">
            <h1 className="text-white text-lg font-semibold">
              Virtual <span className="text-indigo-500">HELPDESK</span>
            </h1>
            <p className="text-gray-300 text-[10px] text-center">
              ADMIN DASHBOARD
            </p>
          </div>
        ) : (
          ""
        )}
      </div>

      {/* Scrollable Section */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {/* Navigation Title */}
        {isSidebarCollapsed ? (
          <div className="flex items-center justify-between">
            <SidebarOpen
              size={22}
              className={`text-gray-400 ${isSidebarCollapsed ? "mb-2" : "mb-4"} ml-1.5 cursor-pointer hover:text-white transition`}
              onClick={() => dispatch(toggleSidebar())}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <h2 className="text-xs text-gray-400 uppercase mb-4 tracking-wide">
              Navigation
            </h2>
            <SidebarClose
              size={22}
              className="text-gray-400 mb-4 cursor-pointer hover:text-white transition"
              onClick={() => dispatch(toggleSidebar())}
            />
          </div>
        )}

        {isSidebarCollapsed ? (
          <div
            className={"mt-2 mb-4 border-t border-gray-700 transition-all mx-2"}
          />
        ) : (
          ""
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-col gap-2">
          {navigationTabs.map((tab, index) => {
            // CHANGE:
            // Use custom function for nested route active state
            const isActive = isTabActive(tab.path);

            return (
              <div
                key={index}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-4 px-2 py-2 rounded-lg cursor-pointer transition-all
                  ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:bg-indigo-600/50 hover:text-white"
                  }
                `}
              >
                <tab.icon size={18} />
                <span
                  className={`${isSidebarCollapsed ? "hidden" : "block"} text-sm font-medium`}
                >
                  {tab.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* System Title */}
        <h2
          className={`${isSidebarCollapsed ? "hidden" : "block"} mt-6 text-xs text-gray-400 uppercase mb-4 tracking-wide`}
        >
          System
        </h2>

        {isSidebarCollapsed ? (
          <div
            className={"my-4 border-t border-gray-700 transition-all mx-2"}
          />
        ) : (
          ""
        )}

        {/* System Tabs */}
        <div className="flex flex-col gap-2">
          {systemTabs.map((tab, index) => {
            // CHANGE:
            // Use custom function for nested route active state
            const isActive = isTabActive(tab.path);

            return (
              <div
                key={index}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-4 px-2 py-2 rounded-lg cursor-pointer transition-all
                  ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:bg-indigo-600/50 hover:text-white"
                  }
                `}
              >
                <tab.icon size={18} />
                <span
                  className={`${isSidebarCollapsed ? "hidden" : "block"} text-sm font-medium`}
                >
                  {tab.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Admin Profile and Logout Section */}
      <div
        className={`border-t-2 border-gray-800 p-2 ${isSidebarCollapsed ? "flex justify-center" : ""}`}
      >
        {!isSidebarCollapsed ? (
          <div className="flex items-center justify-between bg-red-500/20 hover:bg-red-700/40 transition duration-200 rounded-lg px-3 py-2">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/dashboard/profile")}
            >
              <img
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpsKUeoi6uNxRGEZHWNdr02NKSGPypCXi7uw&s" ||
                  profile_pic
                }
                alt="avatar"
                className="w-9 h-9 rounded-full border border-gray-600"
              />
              <div className="flex flex-col">
                <span className="text-sm text-white font-medium">
                  {currentUser?.data?.user?.name || "Admin User"}
                </span>
                <span className="text-xs text-gray-400">Admin</span>
              </div>
            </div>

            <LogOut
              size={18}
              className="text-gray-400 hover:text-red-500 transition cursor-pointer"
              onClick={() => handleLogoutClick()}
            />
          </div>
        ) : (
          <img
            src={
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpsKUeoi6uNxRGEZHWNdr02NKSGPypCXi7uw&s" ||
              profile_pic
            }
            alt="avatar"
            className="w-7 h-7 cursor-pointer rounded-full border border-gray-600"
            onClick={() => navigate("/dashboard/profile")}
          />
        )}
      </div>

      {/* ================= CONFIRM LOGOUT MODAL ================= */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // close modal
        onConfirm={handleConfirmLogout} // confirm logout
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        progressText="Logging out..."
        loading={logoutLoading} // show loading state on confirm logout
      />
    </aside>
  );
};

export default DashSidebar;
