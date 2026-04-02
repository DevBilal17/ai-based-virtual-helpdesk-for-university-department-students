import React, { useEffect, useState } from "react";
import axios from "../api/axios.js";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, ChevronRight } from "lucide-react";
import { signOutSuccess } from "../redux/user/userSlice.js";
import { toast } from "react-toastify";

const DashAdminProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log("Current User:", currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false);

  const adminId = currentUser?.data?.user?.id;

  // Fetch Admin Data
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/user/get-admin/${adminId}`);
        setAdminData(res.data.data.admin);
        console.log("Admin Data:", res.data.data.admin);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (adminId) fetchAdmin();
  }, [adminId]);

  // Logout Handler
  const handleLogout = () => {
    dispatch(signOutSuccess());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="p-6 text-white">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-lg text-gray-400 mb-6">
        <span
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer hover:text-white transition"
        >
          Dashboard
        </span>

        <ChevronRight size={16} />

        <span className="text-white font-medium">Admin Profile</span>
      </div>

      {/* Main Container */}
      <div className="flex flex-col items-center">
        {/* Profile Avatar */}
        <div className="mb-6">
          <div className="p-1 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500">
            <div className="p-1 rounded-full bg-[#0B0F19]">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpsKUeoi6uNxRGEZHWNdr02NKSGPypCXi7uw&s"
                alt="profile"
                className="w-32 h-32 rounded-full object-cover border border-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="w-full max-w-xl bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 shadow-lg">
          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Name */}
              <div>
                <label className="text-sm text-gray-400">Name</label>
                <input
                  type="text"
                  value={adminData?.name || ""}
                  readOnly
                  className="w-full mt-1 px-3 py-2 bg-[#111827] border border-gray-700 rounded-lg text-sm focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <input
                  type="text"
                  value={adminData?.email || ""}
                  readOnly
                  className="w-full mt-1 px-3 py-2 bg-[#111827] border border-gray-700 rounded-lg text-sm focus:outline-none"
                />
              </div>

              {/* Department */}
              <div>
                <label className="text-sm text-gray-400">Department</label>
                <input
                  type="text"
                  value={adminData?.department || ""}
                  readOnly
                  className="w-full mt-1 px-3 py-2 bg-[#111827] border border-gray-700 rounded-lg text-sm focus:outline-none"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="text-sm text-gray-400">Designation</label>
                <input
                  type="text"
                  value={adminData?.designation || ""}
                  readOnly
                  className="w-full mt-1 px-3 py-2 bg-[#111827] border border-gray-700 rounded-lg text-sm focus:outline-none"
                />
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="mt-4 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashAdminProfile;
