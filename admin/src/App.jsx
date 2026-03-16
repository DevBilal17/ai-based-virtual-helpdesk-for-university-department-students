import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import GetVerificationCodeViaEmail from "./pages/GetVerificationCodeViaEmail.jsx";
import PutVerificationCode from "./pages/PutVerificationCode.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AuthLoader from "./components/AuthLoader.jsx";

const RootRedirect = () => {
  const { currentUser } = useSelector((state) => state.user);

  if (currentUser && currentUser.user.role === "admin") {
    return <Navigate to="/dashboard?tab=analytics" replace />;
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

        <Route
          path="/dashboard"
          element={
            <AuthLoader>
              <Dashboard />
            </AuthLoader>
          }
        />
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
