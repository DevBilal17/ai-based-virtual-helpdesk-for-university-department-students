import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserByIdStart,
  getUserByIdSuccess,
  getUserByIdFailure,
  updateUserByIdStart,
  updateUserByIdSuccess,
  updateUserByIdFailure,
} from "../../redux/slices/userSlice.js";
import axiosInstance from "../../api/axios.js";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import profile_pic from "../../assets/profile_pic.png";
// import FullScreenLoader from "../common/FullScreenLoader.jsx";

const DashUpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { thisUser, loading, error } = useSelector((state) => state.user);

  const [role, setRole] = useState("");
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

  // ================= FETCH USER =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(getUserByIdStart());

        const res = await axiosInstance.get(`/user/get-user/${id}`);

        const user = res.data.data.user;

        dispatch(getUserByIdSuccess(user));

        // Prefill
        setRole(user.role);
        setDepartment(user.department || "IT");
        setDegreeType(user.degreeType || "BS");
        setSemester(user.semester || "1");
        setProgram(user.program || "morning");

        setFormData({
          name: user.name || "",
          email: user.email || "",
          registrationNumber: user.registrationNumber || "",
          degreeTitle: user.degreeTitle || "",
          session: user.session || "",
          designation: user.designation || "",
        });
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

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (e) => setDepartment(e.target.value);
  const handleDegreeTypeChange = (e) => setDegreeType(e.target.value);
  const handleSemesterChange = (e) => setSemester(e.target.value);
  const handleProgramChange = (e) => setProgram(e.target.value);

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserByIdStart());

      let payload = {
        name: formData.name,
        email: formData.email,
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

      const { data } = await axiosInstance.put(
        `/user/update-user/${id}`,
        payload,
      );

      dispatch(updateUserByIdSuccess(data));

      toast.success("User updated successfully");

      setTimeout(() => {
        navigate("/dashboard/users");
      }, 1000);
    } catch (error) {
      dispatch(
        updateUserByIdFailure(
          error.response?.data?.message || "Failed to update user",
        ),
      );

      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  // ================= LOADING =================
  // if (loading && !thisUser) return <FullScreenLoader />;
  // if (loading) return <FullScreenLoader />;

  // ================= ERROR =================
  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="px-3 pt-3 pb-20 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-lg text-gray-400 mb-10 bg-[#0B0F19] rounded-lg border border-gray-700 p-3">
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
        <span className="text-white font-medium">Update User</span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center">
        {/* Avatar */}
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

        {/* Form */}
        {loading ? (
          <span className="text-gray-400">Loading user data...</span>
        ) : (
          <div className="w-full max-w-2xl bg-[#0B0F19] border-2 border-gray-800 rounded-lg p-6 shadow-lg mx-auto">
            {/* ROLE (READ ONLY) */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-400">
                User Role
              </label>
              <input
                type="text"
                value={role}
                readOnly
                className="input opacity-70 cursor-not-allowed"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-400">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              {/* Department */}
              <div className="mb-4">
                <label className="block mb-2 text-sm text-gray-400">
                  Department
                </label>
                <select
                  value={department}
                  onChange={handleDepartmentChange}
                  className="input"
                >
                  <option value="IT">IT</option>
                  <option value="CS">CS</option>
                  <option value="SE">SE</option>
                  <option value="BBA">BBA</option>
                  <option value="EE">EE</option>
                </select>
              </div>

              {/* STUDENT */}
              {role === "student" && (
                <>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-400">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-400">
                      Degree Type
                    </label>
                    <select
                      value={degreeType}
                      onChange={handleDegreeTypeChange}
                      className="input"
                    >
                      <option value="BS">BS</option>
                      <option value="MS">MS</option>
                      <option value="MPhil">MPhil</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-400">
                      Degree Title
                    </label>
                    <input
                      type="text"
                      name="degreeTitle"
                      value={formData.degreeTitle}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-400">
                      Semester
                    </label>
                    <select
                      value={semester}
                      onChange={handleSemesterChange}
                      className="input"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-400">
                      Program
                    </label>
                    <select
                      value={program}
                      onChange={handleProgramChange}
                      className="input"
                    >
                      <option value="morning">Morning</option>
                      <option value="evening">Evening</option>
                      <option value="shifted">Shifted</option>
                      <option value="bridging">Bridging</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm text-gray-400">
                      Session
                    </label>
                    <input
                      type="text"
                      name="session"
                      value={formData.session}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </>
              )}

              {/* ADMIN */}
              {role === "admin" && (
                <div className="mb-4">
                  <label className="block mb-2 text-sm text-gray-400">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
              >
                {loading ? "Updating User..." : "Update User"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashUpdateUser;
