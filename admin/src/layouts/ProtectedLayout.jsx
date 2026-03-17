import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import DashSidebar from "../components/DashSidebar.jsx";

const ProtectedLayout = () => {
  const { currentUser } = useSelector((state) => state.user);

  // If user not logged in OR not admin
  if (!currentUser || currentUser.user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <DashSidebar />

      {/* Main content */}
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
