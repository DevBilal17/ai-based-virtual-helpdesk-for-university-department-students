import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios.js";
import {
  getAllUsersStart,
  getAllUsersSuccess,
  getAllUsersFailure,
  deleteUserByIdStart,
  deleteUserByIdSuccess,
  deleteUserByIdFailure,
} from "../../redux/slices/userSlice.js";
import { toast } from "react-toastify";
import profile_pic from "../../assets/profile_pic.png";
import FullScreenLoader from "../common/FullScreenLoader.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";

const DashUsers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    users,
    pagination,
    stats,
    usersLoading,
    usersError,
    deleteUserLoading,
    deleteUserError,
  } = useSelector((state) => state.user);

  const roles = ["all", "student", "admin"];

  const departments = ["all", "CS", "SE", "IT", "BBA", "EE"];

  // const statuses = ["all", "active", "inactive"];

  // ================= STATE =================
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [department, setDepartment] = useState("all");
  // const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [roleDropDown, setRoleDropDown] = useState(false);
  const [departmentDropDown, setDepartmentDropDown] = useState(false);
  // const [statusDropDown, setStatusDropDown] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);

  // ================= DELETE MODAL STATE =================
  const [isModalOpen, setIsModalOpen] = useState(false); // controls modal visibility
  const [selectedUserId, setSelectedUserId] = useState(null); // stores user id to delete

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      dispatch(getAllUsersStart());

      const res = await axios.get("/user/get-users", {
        params: { page, limit: 5, search, role, department },
      });

      console.log("Fetched Users:", res.data.data); // Debug log

      dispatch(getAllUsersSuccess(res.data.data));
    } catch (error) {
      dispatch(
        getAllUsersFailure(
          error.response?.data?.message || "Something went wrong",
        ),
      );
      toast.error(error.response?.data?.message || "Failed to fetch users");
    }
  };

  // ================= ROUTE LOAD =================
  useEffect(() => {
    const run = async () => {
      if (location.pathname === "/dashboard/users") {
        setRouteLoading(true);
        await fetchUsers();
        setRouteLoading(false);
      }
    };
    run();
  }, [location.pathname]);

  // ================= FILTER CHANGE AUTO FETCH =================
  useEffect(() => {
    if (!routeLoading) {
      // reset to first page when filters change
      setPage(1);
      fetchUsers();
    }
  }, [role, department]);

  // ================= PAGE CHANGE AUTO FETCH =================
  useEffect(() => {
    if (!routeLoading) {
      fetchUsers();
    }
  }, [page]);

  // ================= CLEAR SEARCH =================
  const clearSearch = () => {
    setSearch("");
    setPage(1);
  };

  // ================= SEARCH (DEBOUNCE) =================
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 1000);

    return () => clearTimeout(delay);
  }, [search]);

  // ================= HELPER =================
  const truncate = (text, maxLength = 20) => {
    return text?.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // ================= DEPARTMENT NAME HELPER =================
  const departmentName = (d) => {
    if (d === "CS" || d === "cs") return "Computer Science";
    if (d === "SE" || d === "se") return "Software Engineering";
    if (d === "IT" || d === "it") return "Information Technology";
    if (d === "BBA" || d === "bba") return "Business Administration";
    if (d === "EE" || d === "ee") return "Electrical Engineering";
    return d; // return original if no match
  };

  // ================= PAGINATION VALUES =================

  const currentPage = pagination?.currentPage || 1;

  const totalPages = pagination?.totalPages || 1;

  const totalEntries = pagination?.totalUsersFetched || 0;

  // Start entry number
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * 5 + 1;

  // End entry number
  const endEntry = Math.min(currentPage * 5, totalEntries);

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

  // ================= LOADER =================
  if (routeLoading) return <FullScreenLoader />;

  // ================= ERROR =================
  if (usersError) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {usersError}
      </div>
    );
  }

  return (
    <div className="p-3">
      {/* ================= SECTION 1: Breadcrumb ================= */}
      <div className="flex items-center gap-2 text-lg text-gray-400 mb-6 bg-[#0B0F19] rounded-lg border-2 border-gray-800 p-3">
        <span
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer hover:text-white"
        >
          Dashboard
        </span>
        <ChevronRight size={16} />
        <span className="text-white font-medium">User Management</span>
      </div>

      {/* Main Content */}
      <div className="px-2 pt-2 pb-20 space-y-6 text-gray-200">
        {/* ================= SECTION 2: Header and Add User Button ================= */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold">User Management</h1>
            <p className="text-xs text-gray-400">
              Manage, filter, and monitor all helpdesk users and their roles
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/users/add-user")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-800 text-white transition duration-300 px-6 rounded-lg text-lg"
          >
            <UserPlus size={18} />
            Add User
          </button>
        </div>

        {/* ================= SECTION 3: Search and Filters ================= */}
        <div className="flex flex-col md:flex-row gap-4 bg-[#111827] rounded-lg border border-gray-700 p-3">
          {/* Search */}
          <div className="flex items-center bg-[#0B0F19] px-3 py-2 rounded-lg flex-1">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name, email, or department..."
              className="bg-transparent outline-none ml-2 w-full text-sm"
            />
            {search && (
              <X size={16} className="cursor-pointer" onClick={clearSearch} />
            )}
          </div>

          {/* Role Dropdown */}
          <div className="relative w-full md:w-40">
            <div
              onClick={() => setRoleDropDown(!roleDropDown)}
              className="flex items-center justify-between bg-[#0B0F19] px-4 py-2 rounded-lg cursor-pointer"
            >
              <span className="text-sm capitalize">Role: {role}</span>
              <ChevronDown size={16} />
            </div>

            {roleDropDown && (
              <div className="absolute w-40 max-h-60 overflow-y-auto mt-2 bg-[#111827] rounded-lg border border-gray-700 z-10">
                {roles.map((r) => (
                  <div
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setRoleDropDown(false);
                      setPage(1);
                    }}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer capitalize"
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          {/* <div className="relative w-full md:w-40">
            <div
              onClick={() => setStatusDropDown(!statusDropDown)}
              className="flex items-center justify-between bg-[#0B0F19] px-4 py-2 rounded-lg cursor-pointer"
            >
              <span className="text-sm capitalize">Status: {status}</span>
              <ChevronDown size={16} />
            </div>

            {statusDropDown && (
              <div className="absolute w-full mt-2 bg-[#111827] rounded-lg border border-gray-700 z-10">
                {statuses.map((s) => (
                  <div
                    key={s}
                    onClick={() => {
                      setStatus(s);
                      setStatusDropDown(false);
                      setPage(1);
                    }}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer capitalize"
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div> */}

          {/* Department Dropdown */}
          <div className="relative w-full md:w-40">
            <div
              onClick={() => setDepartmentDropDown(!departmentDropDown)}
              className="flex items-center justify-between bg-[#0B0F19] px-4 py-2 rounded-lg cursor-pointer"
            >
              <span className="text-sm capitalize">
                Department: {department}
              </span>
              <ChevronDown size={16} />
            </div>

            {departmentDropDown && (
              <div className="absolute w-40 max-h-60 overflow-y-auto mt-2 bg-[#111827] rounded-lg border border-gray-700 z-10">
                {departments.map((d) => (
                  <div
                    key={d}
                    onClick={() => {
                      setDepartment(d);
                      setDepartmentDropDown(false);
                      setPage(1);
                    }}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer capitalize"
                  >
                    {d}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= SECTION 4: Users List ================= */}
        <div className="bg-[#111827] rounded-lg border border-gray-700 overflow-hidden">
          {/* Head */}
          <div className="grid grid-cols-5 px-6 py-3 text-sm text-gray-400 border-b border-gray-700 uppercase">
            <span className="text-left">User's Name</span>
            <span className="text-center">Email Address</span>
            <span className="text-center">Role</span>
            <span className="text-center">Department</span>
            {/* <span className="text-center">Status</span> */}
            <span className="text-right">Actions</span>
          </div>

          {/* Body */}
          {usersLoading ? (
            <div className="flex items-center justify-center py-6 bg-[#0B0F19] text-lg text-gray-400 animate-pulse">
              <span>Loading users...</span>
            </div>
          ) : users?.length === 0 ? (
            <div className="flex items-center justify-center py-6 bg-[#0B0F19] text-lg text-red-500">
              <span>No users found.</span>
            </div>
          ) : (
            users?.map((user) => (
              <div
                key={user._id}
                className="bg-[#0B0F19] grid grid-cols-5 px-6 py-4 items-center border-b border-gray-800 text-sm hover:bg-gray-800 transition duration-200"
              >
                {/* User Name and profile image */}
                <div
                  className="flex items-center justify-start gap-3 cursor-pointer"
                  onClick={() =>
                    navigate(`/dashboard/users/user-details/${user._id}`)
                  }
                >
                  <img
                    src={
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpsKUeoi6uNxRGEZHWNdr02NKSGPypCXi7uw&s" ||
                      profile_pic
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-lg object-cover border border-gray-600 cursor-pointer"
                  />
                  <span>{truncate(user.name, 20)}</span>
                </div>

                {/* Email Address */}
                <span className="text-center">{truncate(user.email, 30)}</span>

                {/* Role */}
                <div className="flex items-center justify-center">
                  <span
                    className={`${user.role === "student" ? "w-20" : "w-16"} text-xs px-3 py-1 text-center uppercase rounded-full ${
                      user.role === "admin"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                {/* Department */}
                <span className="text-center">
                  {departmentName(user.department)}
                </span>

                {/* Status */}
                {/* <span className="text-xs px-3 py-1 w-20 text-center uppercase rounded-full ml-8 bg-green-500/20 text-green-400">
                  {user.status || "active"}
                </span> */}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/users/update-user/${user._id}`)
                    }
                    className="p-2 bg-gray-600 hover:bg-gray-700 transition duration-200 rounded-lg"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(user._id)}
                    className="p-2 bg-red-500/20 hover:bg-red-700/20 transition duration-200 rounded-lg"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* ================= PAGINATION ================= */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 text-sm text-gray-400 border-t border-gray-800 bg-[#111827]">
            {/* ================= LEFT SIDE ================= */}
            <div className="flex items-center gap-2">
              <span>
                Showing {startEntry} to {endEntry} of {totalEntries} entries
              </span>
              <span>|</span>
              <span>
                Total users fetched:{" "}
                {usersLoading ? "-" : stats?.totalUsersFetched}
              </span>
            </div>

            {/* ================= RIGHT SIDE ================= */}
            <div className="flex items-center gap-4">
              {/* Previous Button */}
              <button
                disabled={currentPage === 1 || usersLoading}
                onClick={() => setPage((prev) => prev - 1)}
                className={`transition duration-200 ${
                  currentPage === 1 || usersLoading
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:text-white"
                }`}
              >
                <ChevronLeft size={20} />
              </button>

              {/* Current Page / Total Pages */}
              <span className="text-white font-medium">
                {currentPage} / {totalPages}
              </span>

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages || usersLoading}
                onClick={() => setPage((prev) => prev + 1)}
                className={`transition duration-200 ${
                  currentPage === totalPages || usersLoading
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:text-white"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* ================= SECTION 5: Stats Cards ================= */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">Total Users in the System</p>
            <h2 className="text-4xl font-bold">
              {usersLoading ? "-" : stats?.totalUsers}
            </h2>
          </div>

          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">Total Students</p>
            <h2 className="text-4xl font-bold">
              {usersLoading ? "-" : stats?.totalStudents}
            </h2>
          </div>

          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">Total Admins</p>
            <h2 className="text-4xl font-bold">
              {usersLoading ? "-" : stats?.totalAdmins}
            </h2>
          </div>

          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">Users Added Last Month</p>
            <h2 className="text-4xl font-bold">
              {usersLoading ? "-" : stats?.usersLastMonth}
            </h2>
          </div>
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
        progressText="Deleting..."
        loading={deleteUserLoading} // show loading state on confirm button
      />
    </div>
  );
};

export default DashUsers;
