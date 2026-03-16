import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthLoader = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);

  // If admin logged in → allow access
  if (currentUser && currentUser.user.role === "admin") {
    return children;
  }

  // Otherwise redirect to login
  return <Navigate to="/login" replace />;
};

export default AuthLoader;
