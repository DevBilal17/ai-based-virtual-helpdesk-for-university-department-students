import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import DashSidebar from "../components/DashSidebar.jsx";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton.jsx";

const ProtectedLayout = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const rehydrated = useSelector((state) => state._persist?.rehydrated);

  // Wait for state
  if (!rehydrated) {
    return <DashboardSkeleton />;
  }

  // Not authorized
  if (!currentUser || currentUser.data.user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex overflow-hidden overflow-x-hidden">
      {/* ================= SIDEBAR ================= */}
      {/* CHANGE: Added h-full + overflow-y-auto to isolate sidebar scrolling */}
      {/* CHANGE: Prevent horizontal scroll in sidebar */}
      <div className="h-full overflow-y-auto overflow-x-hidden">
        <DashSidebar />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col h-full">
        {/* CHANGE: Added overflow-y-auto and h-full to isolate main content scrolling */}
        {/* CHANGE: Prevent horizontal scroll + keep vertical scroll */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#0B0F19] border-l border-gray-800 h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
