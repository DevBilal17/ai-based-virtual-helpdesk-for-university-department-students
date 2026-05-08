import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  File,
  FileText,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios.js";
import {
  getAllDataStart,
  getAllDataSuccess,
  getAllDataFailure,
  deleteDataByIdStart,
  deleteDataByIdSuccess,
  deleteDataByIdFailure,
} from "../../redux/slices/dataSlice.js";
import { toast } from "react-toastify";
import FullScreenLoader from "../common/FullScreenLoader.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";

const DashData = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    files,
    pagination,
    stats,
    filesLoading,
    filesError,
    deleteFileLoading,
    deleteFileError,
  } = useSelector((state) => state.data);

  // ================= STATE =================
  const [page, setPage] = useState(1);
  const [routeLoading, setRouteLoading] = useState(false);

  // ================= DELETE MODAL STATE =================
  const [isModalOpen, setIsModalOpen] = useState(false); // controls modal visibility
  const [selectedFileId, setSelectedFileId] = useState(null); // stores data/file id to delete

  // ================= FETCH DATA/FILES =================
  const fetchFiles = async () => {
    try {
      dispatch(getAllDataStart());

      const res = await axios.get("/data/get-all-data", {
        params: { page, limit: 10 },
      });

      console.log("Fetched Files:", res.data.data); // Debug log

      dispatch(getAllDataSuccess(res.data.data));
    } catch (error) {
      dispatch(
        getAllDataFailure(
          error.response?.data?.message || "Something went wrong",
        ),
      );
      toast.error(
        error.response?.data?.message || "Failed to fetch data/files",
      );
    }
  };

  // ================= ROUTE LOAD =================
  useEffect(() => {
    const run = async () => {
      if (location.pathname === "/dashboard/data") {
        setRouteLoading(true);
        await fetchFiles();
        setRouteLoading(false);
      }
    };
    run();
  }, [location.pathname]);

  // ================= PAGE CHANGE AUTO FETCH =================
  useEffect(() => {
    if (!routeLoading) {
      fetchFiles();
    }
  }, [page]);

  // ================= HELPER =================
  const truncate = (text, maxLength = 20) => {
    return text?.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // ================= PAGINATION VALUES =================

  const currentPage = pagination?.currentPage || 1;

  const totalPages = pagination?.totalPages || 1;

  const totalEntries = pagination?.totalFilesFetched || 0;

  // Start entry number
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * 10 + 1;

  // End entry number
  const endEntry = Math.min(currentPage * 10, totalEntries);

  // ================= HANDLE DELETE CLICK =================
  const handleDeleteClick = (fileId) => {
    setSelectedFileId(fileId);
    setIsModalOpen(true);
  };

  // ================= HANDLE CONFIRM DELETE =================
  const handleConfirmDelete = async () => {
    try {
      dispatch(deleteDataByIdStart());

      await axios.delete(`/data/delete-data/${selectedFileId}`);

      dispatch(deleteDataByIdSuccess(selectedFileId));

      toast.success("File deleted successfully");

      setIsModalOpen(false);
      navigate("/dashboard/data");
    } catch (error) {
      dispatch(
        deleteDataByIdFailure(
          error.response?.data?.message || "Failed to delete file",
        ),
      );

      toast.error(error.response?.data?.message || "Failed to delete file");
    }
  };

  // ================= LOADER =================
  if (routeLoading) return <FullScreenLoader />;

  // ================= ERROR =================
  if (filesError) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {filesError}
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
        <span className="text-white font-medium">Data Management</span>
      </div>

      {/* Main Content */}
      <div className="px-2 pt-2 pb-20 space-y-6 text-gray-200">
        {/* ================= SECTION 2 ================= */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold">Data Management</h1>
            <p className="text-xs text-gray-400">
              Manage, add, monitor, and delete all uploaded data/files
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/data/add-data")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-800 text-white transition duration-300 px-6 rounded-lg text-lg"
          >
            <FileText size={18} />
            Add File
          </button>
        </div>

        {/* ================= SECTION 3 ================= */}
        <div className="bg-[#111827] rounded-lg border border-gray-700 overflow-hidden">
          {/* Head */}
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr] px-6 py-3 text-sm text-gray-400 border-b border-gray-700 uppercase">
            {/* <span className="text-left">File Name</span> */}
            {/* <span className="text-center">File Description</span> */}
            <span className="text-left">File File Info</span>
            <span className="text-center">Uploaded at</span>
            <span className="text-center">Uploaded by</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Body */}
          {filesLoading ? (
            <div className="flex items-center justify-center py-6 bg-[#0B0F19] text-lg text-gray-400 animate-pulse">
              <span>Loading files...</span>
            </div>
          ) : files?.length === 0 ? (
            <div className="flex items-center justify-center py-6 bg-[#0B0F19] text-lg text-red-500">
              <span>No files found.</span>
            </div>
          ) : (
            files?.map((file) => (
              <div
                key={file._id}
                className="bg-[#0B0F19] grid grid-cols-[3fr_1fr_1fr_1fr] px-6 py-4 items-center border-b border-gray-800 text-sm hover:bg-gray-800 transition duration-200"
              >
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm">
                    {truncate(file.file_name, 60)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {truncate(file.file_description, 75)}
                  </span>
                </div>

                <span className="text-center">
                  {file.createdAt
                    ? new Date(file.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "-"}
                </span>

                <span className="text-center">{file.uploaded_by_name}</span>

                <button
                  onClick={() => handleDeleteClick(file._id)}
                  className="p-2 bg-red-500/20 hover:bg-red-700/20 transition duration-200 rounded-lg self-end justify-self-end"
                  disabled={deleteFileLoading}
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
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
                Total files fetched:{" "}
                {filesLoading ? "-" : stats?.totalFilesFetched}
              </span>
            </div>

            {/* ================= RIGHT SIDE ================= */}
            <div className="flex items-center gap-4">
              {/* Previous Button */}
              <button
                disabled={currentPage === 1 || filesLoading}
                onClick={() => setPage((prev) => prev - 1)}
                className={`transition duration-200 ${
                  currentPage === 1 || filesLoading
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
                disabled={currentPage === totalPages || filesLoading}
                onClick={() => setPage((prev) => prev + 1)}
                className={`transition duration-200 ${
                  currentPage === totalPages || filesLoading
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
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">Total Files in the System</p>
            <h2 className="text-4xl font-bold">
              {filesLoading ? "-" : stats?.totalFiles}
            </h2>
          </div>

          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">Total Files Fetched</p>
            <h2 className="text-4xl font-bold">
              {filesLoading ? "-" : stats?.totalFilesFetched}
            </h2>
          </div>

          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">Files Added Last Month</p>
            <h2 className="text-4xl font-bold">
              {filesLoading ? "-" : stats?.filesLastMonth}
            </h2>
          </div>
        </div>
      </div>

      {/* ================= CONFIRM DELETE MODAL ================= */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // close modal
        onConfirm={handleConfirmDelete} // confirm delete
        title="Delete File"
        message="Are you sure you want to delete this file? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        progressText="Deleting..."
        loading={deleteFileLoading} // show loading state on confirm button
      />
    </div>
  );
};

export default DashData;
