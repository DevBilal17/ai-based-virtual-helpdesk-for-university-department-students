import { lazy } from "react";

const Dashboard = lazy(() => import("../components/Dashboard.jsx"));
const DashAdminProfile = lazy(
  () => import("../components/DashAdminProfile.jsx"),
);
const DashUsers = lazy(
  () => import("../components/user_management/DashUsers.jsx"),
);
const DashUserDetails = lazy(
  () => import("../components/user_management/DashUserDetails.jsx"),
);
const DashAddUser = lazy(
  () => import("../components/user_management/DashAddUser.jsx"),
);
const DashUpdateUser = lazy(
  () => import("../components/user_management/DashUpdateUser.jsx"),
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
const DashAddData = lazy(
  () => import("../components/data_management/DashAddData.jsx"),
);
const DashSettings = lazy(() => import("../components/DashSettings.jsx"));
const DashNotifications = lazy(
  () => import("../components/DashNotifications.jsx"),
);
const DashUserLogs = lazy(() => import("../components/DashUserLogs.jsx"));
const DashLocations = lazy(
  () => import("../components/location_management/DashLocations.jsx"),
);
const DashAddLocation = lazy(
  () => import("../components/location_management/DashAddLocation.jsx"),
);
const DashUpdateLocation = lazy(
  () => import("../components/location_management/DashUpdateLocation.jsx"),
);
const DashLocationDetails = lazy(
  () => import("../components/location_management/DashLocationDetails.jsx"),
);

// Define the dashboard routes
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
    path: "users",
    component: DashUsers,
    label: "Users",
  },
  {
    path: "users/user-details/:id",
    component: DashUserDetails,
    label: "User Details",
  },
  {
    path: "users/add-user",
    component: DashAddUser,
    label: "Add User",
  },
  {
    path: "users/update-user/:id",
    component: DashUpdateUser,
    label: "Update User",
  },
  {
    path: "faqs",
    component: DashFAQs,
    label: "FAQs",
  },
  {
    path: "faqs/add-faq",
    component: DashAddFAQ,
    label: "Add FAQ",
  },
  {
    path: "faqs/update-faq/:id",
    component: DashUpdateFAQ,
    label: "Update FAQ",
  },
  {
    path: "data",
    component: DashData,
    label: "Data",
  },
  {
    path: "data/add-data",
    component: DashAddData,
    label: "Add Data",
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
  {
    path: "locations",
    component: DashLocations,
    label: "Locations",
  },
  {
    path: "locations/add-location",
    component: DashAddLocation,
    label: "Add Location",
  },
  {
    path: "locations/update-location/:id",
    component: DashUpdateLocation,
    label: "Update Location",
  },
  {
    path: "locations/location-details/:id",
    component: DashLocationDetails,
    label: "Location Details",
  },
];
