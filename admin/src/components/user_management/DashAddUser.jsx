import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserStart,
  addUserSuccess,
  addUserFailure,
} from "../../redux/slices/userSlice.js";
import axiosInstance from "../../api/axios.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import profile_pic from "../../assets/profile_pic.png";

const DashAddUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addUserLoading, addUserError } = useSelector((state) => state.user);

  const [role, setRole] = useState("student");
  const [department, setDepartment] = useState("IT");
  const [degreeType, setDegreeType] = useState("BS");
  const [semester, setSemester] = useState("1");
  const [program, setProgram] = useState("morning");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registrationNumber: "",
    degreeTitle: "",
    session: "",
    designation: "",
  });

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================= HANDLE ROLE CHANGE =================
  const handleRoleChange = (e) => {
    setRole(e.target.value);

    setFormData({
      name: "",
      email: "",
      registrationNumber: "",
      degreeTitle: "",
      session: "",
      designation: "",
    });
  };

  // ================= HANDLE DEPARTMENT CHANGE =================
  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };

  // ================= HANDLE DEGREE TYPE CHANGE =================
  const handleDegreeTypeChange = (e) => {
    setDegreeType(e.target.value);
  };

  // ================= HANDLE SEMESTER CHANGE =================
  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
  };

  // ================= HANDLE PROGRAM CHANGE =================
  const handleProgramChange = (e) => {
    setProgram(e.target.value);
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(addUserStart());

      let payload = {
        name: formData.name,
        email: formData.email,
        role,
        department,
      };

      if (role === "student") {
        payload = {
          ...payload,
          registrationNumber: formData.registrationNumber,
          degreeType,
          degreeTitle: formData.degreeTitle,
          semester,
          program,
          session: formData.session,
        };
      }

      if (role === "admin") {
        payload = {
          ...payload,
          designation: formData.designation,
        };
      }

      const { data } = await axiosInstance.post("/user/create-user", payload);

      dispatch(addUserSuccess(data));

      toast.success("User added successfully");

      setTimeout(() => {
        navigate("/dashboard/users");
      }, 1000);

      // Reset form
      setFormData({
        name: "",
        email: "",
        registrationNumber: "",
        degreeTitle: "",
        session: "",
        designation: "",
      });
      setRole("student");
      setDepartment("IT");
      setDegreeType("BS");
      setSemester("1");
      setProgram("morning");
    } catch (error) {
      dispatch(
        addUserFailure(error.response?.data?.message || "Failed to add user"),
      );

      toast.error(error.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <div className="px-3 pt-3 pb-20 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-lg text-gray-400 mb-10 bg-[#0B0F19] rounded-lg border-2 border-gray-800 p-3">
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
        <span className="text-white font-medium">Add User</span>
      </div>

      {/* Main Content */}
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

        {/* Form fields */}
        <div className="w-full max-w-2xl bg-[#0B0F19] border-2 border-gray-800 rounded-lg p-6 shadow-lg mx-auto">
          {/* ROLE SELECT */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-400">
              Select Role
            </label>
            <select
              value={role}
              onChange={handleRoleChange}
              className="w-full p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* COMMON FIELDS */}

            {/* Full Name */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-400">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            {/* Email Address */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-400">
                Email Address (e.g. john.doe@example.com)
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            {/* Department */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-400">
                Select Department
              </label>
              <select
                value={department}
                onChange={handleDepartmentChange}
                className="w-full p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="IT">IT</option>
                <option value="CS">CS</option>
                <option value="SE">SE</option>
                <option value="BBA">BBA</option>
                <option value="EE">EE</option>
              </select>
            </div>

            {/* STUDENT FIELDS */}
            {role === "student" && (
              <div className="flex flex-col">
                {/* Registration Number */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-400">
                    Registration Number (e.g. 2022-GCUF-02611)
                  </label>
                  <input
                    type="text"
                    name="registrationNumber"
                    placeholder="Registration Number"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>

                {/* Degree Type */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-400">
                    Select Degree Type
                  </label>
                  <select
                    value={degreeType}
                    onChange={handleDegreeTypeChange}
                    className="w-full p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BS">BS</option>
                    <option value="MS">MS</option>
                    <option value="MPhil">MPhil</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                {/* Degree Title */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-400">
                    Degree Title
                  </label>
                  <input
                    type="text"
                    name="degreeTitle"
                    placeholder="Degree Title"
                    value={formData.degreeTitle}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>

                {/* Semester */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-400">
                    Select Semester
                  </label>
                  <select
                    value={semester}
                    onChange={handleSemesterChange}
                    className="w-full p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </select>
                </div>

                {/* Program */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-400">
                    Select Program
                  </label>
                  <select
                    value={program}
                    onChange={handleProgramChange}
                    className="w-full p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                    <option value="shifted">Shifted</option>
                    <option value="bridging">Bridging</option>
                  </select>
                </div>

                {/* Session */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-400">
                    Session (e.g. 2022-2026)
                  </label>
                  <input
                    type="text"
                    name="session"
                    placeholder="Session"
                    value={formData.session}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
              </div>
            )}

            {/* ADMIN FIELDS */}
            {role === "admin" && (
              // Designation
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-400">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  placeholder="Designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={addUserLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200"
            >
              {addUserLoading ? "Adding User..." : "Add User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DashAddUser;
