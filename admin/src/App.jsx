import { Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/Login.jsx";
import GetVerificationCodeViaEmail from "./pages/GetVerificationCodeViaEmail.jsx";
import PutVerificationCode from "./pages/PutVerificationCode.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ProtectedLayout from "./layouts/ProtectedLayout.jsx";
import { dashboardRoutes } from "./config/dashboardRoutes.js";
import DashboardSkeleton from "./components/skeletons/DashboardSkeleton.jsx";

const RootRedirect = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const rehydrated = useSelector((state) => state._persist?.rehydrated);

  // Wait until Redux Persist finishes
  if (!rehydrated) {
    return <DashboardSkeleton />;
  }

  if (currentUser && currentUser.data.user.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Header />

      <Suspense fallback={<DashboardSkeleton />}>
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
            {dashboardRoutes.map((route, index) => {
              const Component = route.component;
              return (
                <Route
                  key={index}
                  path={`/dashboard/${route.path}`}
                  element={<Component />}
                />
              );
            })}
          </Route>
        </Routes>
      </Suspense>

      <Footer />

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
