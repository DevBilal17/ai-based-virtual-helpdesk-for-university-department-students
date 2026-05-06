import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  File,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios.js";
import {
  getAllDataStart,
  getAllDataSuccess,
  getAllDataFailure,
} from "../../redux/slices/dataSlice.js";
import { toast } from "react-toastify";
import FullScreenLoader from "../common/FullScreenLoader.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";
import {
  deleteDataByIdStart,
  deleteDataByIdSuccess,
  deleteDataByIdFailure,
} from "../../redux/slices/dataSlice.js";

const DashData = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    files,
    pagination,
    filesLoading,
    filesError,
    deleteLoading,
    deleteError,
  } = useSelector((state) => state.data);

  // ================= STATE =================
  const [page, setPage] = useState(1);

  // ================= DELETE MODAL STATE =================
  const [isModalOpen, setIsModalOpen] = useState(false); // controls modal visibility
  const [selectedFileId, setSelectedFileId] = useState(null); // stores data/file id to delete

  // ================= FETCH DATA/FILES =================
  const fetchFiles = async () => {
    try {
      dispatch(getAllDataStart());

      const res = await axios.get("/data/get-all-data", {
        // params: { page, limit: 5, search, role },
      });

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

  // ================= USE EFFECT =================
  useEffect(() => {
    fetchFiles();
  }, [page]);

  // ================= LOADING =================
  if (filesLoading) return <FullScreenLoader />;

  // ================= ERROR =================
  if (filesError) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {filesError}
      </div>
    );
  }

  // ================= HELPER =================
  const truncate = (text, maxLength = 20) => {
    return text?.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

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
          <div className="grid grid-cols-6 px-6 py-3 text-sm text-gray-400 border-b border-gray-700 uppercase">
            <span>File Name</span>
            <span>File Description</span>
            <span className="text-right">Uploaded at</span>
            <span className="text-right">Uploaded by</span>
            <span className="text-right">Updated At</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Body */}
          {files?.map((file) => (
            <div
              key={file._id}
              className="bg-[#0B0F19] grid grid-cols-6 px-6 py-4 items-center border-b border-gray-800 text-sm hover:bg-gray-800 transition duration-200"
            >
              <span>{truncate(file.file_name, 20)}</span>

              <span>{truncate(file.file_description, 30)}</span>

              <span className="text-right">
                {file.createdAt
                  ? new Date(file.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "-"}
              </span>

              <span className="text-right">{file.uploaded_by_name}</span>

              <span className="text-right">
                {file.updatedAt
                  ? new Date(file.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "-"}
              </span>

              <button
                onClick={() => handleDeleteClick(file._id)}
                className="p-2 bg-red-500/20 hover:bg-red-700/20 transition duration-200 rounded-lg self-end justify-self-end"
              >
                <Trash2 size={16} className="text-red-400" />
              </button>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex justify-between px-6 py-4 text-base text-gray-400">
            <span>
              Showing {pagination?.currentPage} of {pagination?.totalPages}{" "}
              pages
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
        loading={deleteLoading} // show loading state on confirm button
      />
    </div>
  );
};

export default DashData;
