import React, { useEffect, useState } from "react";
import axios from "../api/axios.js";
import {
  getUserByIdStart,
  getUserByIdSuccess,
  getUserByIdFailure,
} from "../redux/slices/userSlice.js";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, ChevronRight } from "lucide-react";
import { signOutSuccess, signOutFailure } from "../redux/slices/authSlice.js";
import { toast } from "react-toastify";
import profile_pic from "../assets/profile_pic.png";
import FullScreenLoader from "./common/FullScreenLoader.jsx";
import ConfirmModal from "./common/ConfirmModal.jsx";

const DashAdminProfile = () => {
  const { currentUser, logoutLoading, logoutError } = useSelector(
    (state) => state.auth,
  );
  console.log("Current User:", currentUser);
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);

  // ================= LOGOUT MODAL STATE =================
  const [isModalOpen, setIsModalOpen] = useState(false); // controls modal visibility

  const userId = currentUser?.data?.user?.id;

  // Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(getUserByIdStart());
        const res = await axios.get(`/user/get-user/${userId}`);
        setUserData(res.data.data.user);
        dispatch(getUserByIdSuccess(res.data.data.user));
        console.log("User Data:", res.data.data.user);
      } catch (error) {
        console.error(error);
        dispatch(
          getUserByIdFailure(
            error.response?.data?.message || "Failed to fetch user",
          ),
        );
      }
    };

    if (userId) fetchUser();
  }, []);

  // ================= LOADING =================
  if (loading) return <FullScreenLoader />;

  // ================= ERROR =================
  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  // ================= HANDLE LOGOUT CLICK =================
  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  // ================= HANDLE CONFIRM LOGOUT =================
  const handleConfirmLogout = async () => {
    try {
      dispatch(signOutSuccess());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      dispatch(
        signOutFailure(error.response?.data?.message || "Failed to logout"),
      );
    }
  };

  return (
    <div className="px-3 pt-3 pb-20 text-white">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-lg text-gray-400 mb-10 bg-[#0B0F19] rounded-lg border border-gray-700 p-3">
        <span
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer hover:text-white"
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
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpsKUeoi6uNxRGEZHWNdr02NKSGPypCXi7uw&s" ||
                  profile_pic
                }
                alt="profile"
                className="w-32 h-32 rounded-full object-cover border border-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="w-full max-w-2xl bg-[#0B0F19] border-2 border-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col gap-5">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-400">Name</label>
              <input
                type="text"
                value={userData?.name || ""}
                readOnly
                className="w-full mt-1 px-3 py-2 bg-[#111827] border border-gray-700 rounded-lg text-sm focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="text"
                value={userData?.email || ""}
                readOnly
                className="w-full mt-1 px-3 py-2 bg-[#111827] border border-gray-700 rounded-lg text-sm focus:outline-none"
              />
            </div>

            {/* Department */}
            <div>
              <label className="text-sm text-gray-400">Department</label>
              <input
                type="text"
                value={userData?.department || ""}
                readOnly
                className="w-full mt-1 px-3 py-2 bg-[#111827] border border-gray-700 rounded-lg text-sm focus:outline-none"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="text-sm text-gray-400">Designation</label>
              <input
                type="text"
                value={userData?.designation || ""}
                readOnly
                className="w-full mt-1 px-3 py-2 bg-[#111827] border border-gray-700 rounded-lg text-sm focus:outline-none"
              />
            </div>

            {/* Logout Button */}
            <button
              onClick={() => handleLogoutClick()}
              className="mt-4 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONFIRM LOGOUT MODAL ================= */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // close modal
        onConfirm={handleConfirmLogout} // confirm logout
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        progressText="Logging out..."
        loading={logoutLoading} // show loading state on confirm logout
      />
    </div>
  );
};

export default DashAdminProfile;
