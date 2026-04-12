import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
  getUserByIdStart,
  getUserByIdSuccess,
  getUserByIdFailure,
} from "../../redux/slices/userSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import FullScreenLoader from "../common/FullScreenLoader";
import { ChevronRight } from "lucide-react";
import profile_pic from "../../assets/profile_pic.png";
import ConfirmModal from "../common/ConfirmModal.jsx";
import {
  deleteUserByIdStart,
  deleteUserByIdSuccess,
  deleteUserByIdFailure,
} from "../../redux/slices/userSlice.js";

const DashUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { thisUser, loading, error, deleteLoading, deleteError } = useSelector(
    (state) => state.user,
  );

  // ================= DELETE MODAL STATE =================
  const [isModalOpen, setIsModalOpen] = useState(false); // controls modal visibility
  const [selectedUserId, setSelectedUserId] = useState(null); // stores user id to delete

  // ================= FETCH USER =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(getUserByIdStart());

        const res = await axios.get(`/user/get-user/${id}`);

        dispatch(getUserByIdSuccess(res.data.data.user));
      } catch (err) {
        dispatch(
          getUserByIdFailure(
            err.response?.data?.message || "Failed to fetch user",
          ),
        );
      }
    };

    if (id) fetchUser();
  }, [id, dispatch]);

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

  // ================= NO USER =================
  if (!thisUser) return null;

  // ================= ROLE-BASED FIELDS =================
  const isStudent = thisUser.role === "student";

  const studentFields = [
    {
      label: "Role",
      value: thisUser.role?.charAt(0).toUpperCase() + thisUser.role?.slice(1),
    },
    { label: "Name", value: thisUser.name },
    { label: "Email", value: thisUser.email },
    { label: "Department", value: thisUser.department },
    { label: "Registration Number", value: thisUser.registrationNumber },
    { label: "Degree Type", value: thisUser.degreeType },
    { label: "Degree Title", value: thisUser.degreeTitle },
    { label: "Semester", value: thisUser.semester },
    {
      label: "Program",
      value:
        thisUser.program?.charAt(0).toUpperCase() + thisUser.program?.slice(1),
    },
    { label: "Session", value: thisUser.session },
  ];

  const adminFields = [
    {
      label: "Role",
      value: thisUser.role?.charAt(0).toUpperCase() + thisUser.role?.slice(1),
    },
    { label: "Name", value: thisUser.name },
    { label: "Email", value: thisUser.email },
    { label: "Department", value: thisUser.department },
    { label: "Designation", value: thisUser.designation },
  ];

  const fields = isStudent ? studentFields : adminFields;

  // ================= HANDLERS =================
  const handleEdit = () => {
    navigate(`/dashboard/users/update-user/${id}`);
  };

  // ================= HANDLE DELETE CLICK =================
  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  // ================= HANDLE CONFIRM DELETE =================
  const handleConfirmDelete = async () => {
    try {
      dispatch(deleteUserByIdStart());

      await axios.delete(`/user/delete-user/${selectedUserId}`);

      dispatch(deleteUserByIdSuccess(selectedUserId));

      toast.success("User deleted successfully");

      setIsModalOpen(false);
      navigate("/dashboard/users");
    } catch (error) {
      dispatch(
        deleteUserByIdFailure(
          error.response?.data?.message || "Failed to delete user",
        ),
      );

      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="px-3 pt-3 pb-20 w-full">
      {/* ================= BREADCRUMB ================= */}
      <div className="flex items-center gap-2 text-lg text-gray-400 mb-10 bg-[#111827] rounded-lg border border-gray-700 p-3">
        <span
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer hover:text-white"
        >
          Dashboard
        </span>
        <ChevronRight size={16} />
        <span
          onClick={() => navigate("/dashboard/users")}
          className="cursor-pointer hover:text-white"
        >
          User Management
        </span>
        <ChevronRight size={16} />
        <span className="text-white font-medium">User Details</span>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex flex-col items-center justify-center">
        {/* ================= PROFILE IMAGE ================= */}
        {/* Profile Avatar */}
        <div className="mb-4">
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

        {/* User's Name */}
        <span className="mb-10 text-gray-200 text-xl font-bold">
          {thisUser.name}
        </span>

        {/* ================= USER DETAILS ================= */}
        <div className="w-full max-w-2xl bg-[#111827] rounded-lg border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-gray-200">
              User Information
            </h2>
          </div>

          <div className="grid grid-cols-2">
            {fields.map((field, index) => (
              <React.Fragment key={index}>
                {/* LEFT COLUMN (Label) */}
                <div className="px-4 py-3 font-medium text-gray-400 border-r border-b border-gray-700">
                  {field.label}
                </div>

                {/* RIGHT COLUMN (Value) */}
                <div className="px-4 py-3 text-gray-300 border-b border-gray-700">
                  {field.value || "-"}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaEdit />
            Edit User
          </button>

          <button
            onClick={() => handleDeleteClick(id)}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <FaTrash />
            Delete User
          </button>
        </div>
      </div>

      {/* ================= CONFIRM DELETE MODAL ================= */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // close modal
        onConfirm={handleConfirmDelete} // confirm delete
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading} // show loading state on confirm button
      />
    </div>
  );
};

export default DashUserDetails;
