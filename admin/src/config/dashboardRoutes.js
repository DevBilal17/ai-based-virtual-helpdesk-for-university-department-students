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
];
