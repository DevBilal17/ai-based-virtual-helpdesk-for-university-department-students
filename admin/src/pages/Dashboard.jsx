import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar.jsx";
import DashAdminProfile from "../components/DashAdminProfile.jsx";
import DashAnalytics from "../components/DashAnalytics.jsx";
import DashStudents from "../components/user_management/DashStudents.jsx";
import DashAddStudent from "../components/user_management/DashAddStudent.jsx";
import DashUpdateStudent from "../components/user_management/DashUpdateStudent.jsx";
import DashAddAdmin from "../components/user_management/DashAddAdmin.jsx";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("analytics");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div>
        {/* sidebar */}
        <DashSidebar />
      </div>

      {/* tab === analytics */}
      {tab === "analytics" && <DashAnalytics />}

      {/* tab === profile */}
      {tab === "profile" && <DashAdminProfile />}

      {/* tab === students */}
      {tab === "students" && <DashStudents />}

      {/* tab === addStudent */}
      {tab === "addStudent" && <DashAddStudent />}

      {/* tab === updateStudent */}
      {tab === "updateStudent" && <DashUpdateStudent />}

      {/* tab === addAdmin */}
      {tab === "addAdmin" && <DashAddAdmin />}
    </div>
  );
};

export default Dashboard;
