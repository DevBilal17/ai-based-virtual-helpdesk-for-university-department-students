import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <>
      {currentUser ? (
        <footer className="w-full bg-[#0c1426] border-t-2 border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 gap-4">
            {/* LEFT: Branding */}
            <div
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer text-center md:text-left"
            >
              <h2 className="text-white text-sm font-semibold">
                Virtual Helpdesk
              </h2>
              <p className="text-xs text-gray-400">Admin Dashboard Panel</p>
            </div>

            {/* CENTER: Quick Links */}
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer hover:text-white transition"
              >
                Dashboard
              </span>

              <span
                onClick={() => navigate("/dashboard/profile")}
                className="cursor-pointer hover:text-white transition"
              >
                Profile
              </span>

              <span
                onClick={() => navigate("/dashboard/users")}
                className="cursor-pointer hover:text-white transition"
              >
                Users
              </span>
            </div>

            {/* RIGHT: Copyright */}
            <div className="text-xs text-gray-500 text-center md:text-right">
              © {new Date().getFullYear()} Virtual Helpdesk. All rights
              reserved.
            </div>
          </div>
        </footer>
      ) : (
        ""
      )}
    </>
  );
};

export default Footer;
