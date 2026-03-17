import { dashboardRoutes } from "../config/dashboardRoutes.js";
import { Link } from "react-router-dom";

const DashSidebar = () => {
  return (
    <div className="w-64 bg-gray-200 min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

      <ul className="space-y-4">
        {dashboardRoutes.map((route, index) => (
          <li key={index}>
            <Link to={`/dashboard/${route.path}`}>{route.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashSidebar;
