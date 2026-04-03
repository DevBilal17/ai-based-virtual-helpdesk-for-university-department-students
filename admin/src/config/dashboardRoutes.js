import { lazy } from "react";

const Dashboard = lazy(() => import("../components/Dashboard.jsx"));
const DashAdminProfile = lazy(
  () => import("../components/DashAdminProfile.jsx"),
);
const DashStudents = lazy(
  () => import("../components/user_management/DashStudents.jsx"),
);
const DashAddStudent = lazy(
  () => import("../components/user_management/DashAddStudent.jsx"),
);
const DashUpdateStudent = lazy(
  () => import("../components/user_management/DashUpdateStudent.jsx"),
);
const DashAddAdmin = lazy(
  () => import("../components/user_management/DashAddAdmin.jsx"),
);
const DashFAQs = lazy(
  () => import("../components/faq_management/DashFAQs.jsx"),
);
const DashAddFAQ = lazy(
  () => import("../components/faq_management/DashAddFAQ.jsx"),
);
const DashUpdateFAQ = lazy(
  () => import("../components/faq_management/DashUpdateFAQ.jsx"),
);
const DashData = lazy(
  () => import("../components/data_management/DashData.jsx"),
);
const DashSettings = lazy(() => import("../components/DashSettings.jsx"));
const DashNotifications = lazy(
  () => import("../components/DashNotifications.jsx"),
);
const DashUserLogs = lazy(() => import("../components/DashUserLogs.jsx"));

export const dashboardRoutes = [
  {
    path: "",
    component: Dashboard,
    label: "Dashboard",
  },
  {
    path: "profile",
    component: DashAdminProfile,
    label: "Profile",
  },
  {
    path: "students",
    component: DashStudents,
    label: "Students",
  },
  {
    path: "add-student",
    component: DashAddStudent,
    label: "Add Student",
  },
  {
    path: "update-student",
    component: DashUpdateStudent,
    label: "Update Student",
  },
  {
    path: "add-admin",
    component: DashAddAdmin,
    label: "Add Admin",
  },
  {
    path: "faqs",
    component: DashFAQs,
    label: "FAQs",
  },
  {
    path: "add-faq",
    component: DashAddFAQ,
    label: "Add FAQ",
  },
  {
    path: "update-faq",
    component: DashUpdateFAQ,
    label: "Update FAQ",
  },
  {
    path: "data",
    component: DashData,
    label: "Data",
  },
  {
    path: "settings",
    component: DashSettings,
    label: "Settings",
  },
  {
    path: "notifications",
    component: DashNotifications,
    label: "Notifications",
  },
  {
    path: "user-logs",
    component: DashUserLogs,
    label: "User Logs",
  },
];
