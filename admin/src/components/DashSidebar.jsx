import React from "react";
import { Link } from "react-router-dom";

const DashSidebar = () => {
  return (
    <div className="w-64 bg-gray-200 min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <ul className="space-y-4">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>

        {/* <li>
          <Link to="/dashboard/students">Students</Link>
        </li>

        <li>
          <Link to="/dashboard/add-student">Add Student</Link>
        </li>

        <li>
          <Link to="/dashboard/add-admin">Add Admin</Link>
        </li>

        <li>
          <Link to="/dashboard/profile">Profile</Link>
        </li> */}
      </ul>
    </div>
  );
};

export default DashSidebar;
