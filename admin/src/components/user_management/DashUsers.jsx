import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios.js";
import {
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
} from "../../redux/slices/userSlice.js";
import { toast } from "react-toastify";
import profile_pic from "../../assets/profile_pic.png";
import FullScreenLoader from "../common/FullScreenLoader.jsx";

const DashUsers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { users, pagination, stats, usersLoading, usersError } = useSelector(
    (state) => state.user,
  );

  // ================= STATE =================
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(1);
  const [roleDropDown, setRoleDropDown] = useState(false);
  const [statusDropDown, setStatusDropDown] = useState(false);

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      dispatch(getUsersStart());

      const res = await axios.get("/user/get-users", {
        params: { page, limit: 5, search, role },
      });

      dispatch(getUsersSuccess(res.data.data));
    } catch (error) {
      dispatch(
        getUsersFailure(
          error.response?.data?.message || "Something went wrong",
        ),
      );
      toast.error(error.response?.data?.message || "Failed to fetch users");
    }
  };

  // ================= USE EFFECT =================
  useEffect(() => {
    fetchUsers();
  }, [page, role]);

  // ================= SEARCH (DEBOUNCE) =================
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  // ================= LOADING =================
  if (usersLoading) return <FullScreenLoader />;

  // ================= ERROR =================
  if (usersError) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {usersError}
      </div>
    );
  }

  // ================= HELPER =================
  const truncate = (text, maxLength = 20) => {
    return text?.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="p-3">
      {/* ================= SECTION 1: Breadcrumb ================= */}
      <div className="flex items-center gap-2 text-lg text-gray-400 mb-6 bg-[#111827] rounded-lg border border-gray-700 p-3">
        <span
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer hover:text-white"
        >
          Dashboard
        </span>
        <ChevronRight size={16} />
        <span className="text-white font-medium">User Management</span>
      </div>

      <div className="px-2 pt-2 pb-20 space-y-6 text-gray-200">
        {/* ================= SECTION 2 ================= */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold">User Management</h1>
            <p className="text-xs text-gray-400">
              Manage, filter, and monitor all helpdesk users and their roles
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/users/add-user")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-800 transition duration-300 px-6 rounded-lg text-lg"
          >
            <UserPlus size={18} />
            Add User
          </button>
        </div>

        {/* ================= SECTION 3 ================= */}
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
          </div>

          {/* Role Dropdown */}
          <div className="relative w-full md:w-40">
            <div
              onClick={() => setRoleDropDown(!roleDropDown)}
              className="flex items-center justify-between bg-[#0B0F19] px-4 py-2 rounded-lg cursor-pointer"
            >
              <span className="text-sm capitalize">{role} Roles</span>
              <ChevronDown size={16} />
            </div>

            {roleDropDown && (
              <div className="absolute w-full mt-2 bg-[#111827] rounded-lg border border-gray-700 z-10">
                {["all", "student", "admin"].map((r) => (
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
          <div className="relative w-full md:w-40">
            <div
              onClick={() => setStatusDropDown(!statusDropDown)}
              className="flex items-center justify-between bg-[#0B0F19] px-4 py-2 rounded-lg cursor-pointer"
            >
              <span className="text-sm capitalize">{status} Status</span>
              <ChevronDown size={16} />
            </div>

            {statusDropDown && (
              <div className="absolute w-full mt-2 bg-[#111827] rounded-lg border border-gray-700 z-10">
                {["active", "pending", "inactive"].map((r) => (
                  <div
                    key={r}
                    onClick={() => {
                      setStatus(r);
                      setStatusDropDown(false);
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
        </div>

        {/* ================= SECTION 4 ================= */}
        <div className="bg-[#111827] rounded-lg border border-gray-700 overflow-hidden">
          {/* Head */}
          <div className="grid grid-cols-6 px-6 py-3 text-sm text-gray-400 border-b border-gray-700 uppercase">
            <span>User</span>
            <span>Email Address</span>
            <span className="ml-16">Role</span>
            <span className="ml-8">Department</span>
            <span className="ml-8">Status</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Body */}
          {users?.map((user) => (
            <div
              key={user._id}
              className="grid grid-cols-6 px-6 py-4 items-center border-b border-gray-800 text-sm hover:bg-gray-800 transition duration-200"
            >
              <div
                className="flex items-center gap-3 cursor-pointer"
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
                <span>{truncate(user.name)}</span>
              </div>

              <span>{truncate(user.email, 25)}</span>

              <span
                className={`text-xs px-3 py-1 w-20 text-center uppercase rounded-full ml-16 ${
                  user.role === "admin"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {user.role}
              </span>

              <span className="ml-8">{user.department}</span>

              <span className="text-xs px-3 py-1 w-20 text-center uppercase rounded-full ml-8 bg-green-500/20 text-green-400">
                {user.status || "active"}
              </span>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() =>
                    navigate(`/dashboard/users/update-user/${user._id}`)
                  }
                  className="p-2 bg-gray-600 hover:bg-gray-700 transition duration-200 rounded-lg"
                >
                  <Pencil size={16} />
                </button>

                <button className="p-2 bg-red-500/20 hover:bg-red-700/20 transition duration-200 rounded-lg">
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-between px-6 py-4 text-base text-gray-400">
            <span>
              Showing {pagination?.currentPage} of {pagination?.totalPages}{" "}
              pages
            </span>

            <span className="ml-2">|</span>

            <span className="flex-1 ml-2">
              Total users fetched: {stats?.totalUsersFetched}
            </span>

            <div className="flex gap-4">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft size={18} />
              </button>

              {[...Array(pagination?.totalPages || 1)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={
                    page === i + 1
                      ? "bg-indigo-600 px-3 py-1 rounded-lg text-white"
                      : ""
                  }
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={page === pagination?.totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ================= SECTION 5 ================= */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">Total Users in the Database</p>
            <h2 className="text-4xl font-bold">{stats?.totalUsers}</h2>
          </div>

          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">Total Students</p>
            <h2 className="text-4xl font-bold">{stats?.totalStudents}</h2>
          </div>

          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">Total Admins</p>
            <h2 className="text-4xl font-bold">{stats?.totalAdmins}</h2>
          </div>

          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">Users Added Last Month</p>
            <h2 className="text-4xl font-bold">{stats?.usersLastMonth}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashUsers;
