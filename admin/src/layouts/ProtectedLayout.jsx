import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import DashSidebar from "../components/DashSidebar.jsx";
// import FullScreenLoader from "../components/common/FullScreenLoader.jsx";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton.jsx";
import Header from "../components/Header.jsx";

const ProtectedLayout = () => {
  const { currentUser } = useSelector((state) => state.user);
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
    <div className="min-h-screen flex flex-col md:flex-row">
      <DashSidebar />

      <div className="flex-1 flex flex-col">
        {/* <Header /> */}
        {/* MAIN CONTENT SCROLL ONLY */}
        <main className="flex-1 overflow-y-auto bg-[#0B0F19]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;
