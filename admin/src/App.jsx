import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import GetVerificationCodeViaEmail from "./pages/GetVerificationCodeViaEmail.jsx";
import PutVerificationCode from "./pages/PutVerificationCode.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ProtectedLayout from "./layouts/ProtectedLayout.jsx";
import DashAdminProfile from "./components/DashAdminProfile.jsx";
import DashStudents from "./components/user_management/DashStudents.jsx";
import DashAddStudent from "./components/user_management/DashAddStudent.jsx";
import DashUpdateStudent from "./components/user_management/DashUpdateStudent.jsx";
import DashAddAdmin from "./components/user_management/DashAddAdmin.jsx";

const RootRedirect = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (currentUser && currentUser.user.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/get-verification-code"
          element={<GetVerificationCodeViaEmail />}
        />

        <Route
          path="/put-verification-code"
          element={<PutVerificationCode />}
        />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<DashAdminProfile />} />
          <Route path="/dashboard/students" element={<DashStudents />} />
          <Route path="/dashboard/add-student" element={<DashAddStudent />} />
          <Route
            path="/dashboard/update-student"
            element={<DashUpdateStudent />}
          />
          <Route path="/dashboard/add-admin" element={<DashAddAdmin />} />
        </Route>
      </Routes>

      {/* Toast container to show notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
        style={{ marginTop: "55px" }}
      />
    </BrowserRouter>
  );
};

export default App;
