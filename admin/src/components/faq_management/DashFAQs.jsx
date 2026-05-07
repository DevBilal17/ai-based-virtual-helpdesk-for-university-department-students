import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  MessageCirclePlus,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios.js";
import {
  getAllFaqsStart,
  getAllFaqsSuccess,
  getAllFaqsFailure,
  changeFaqStatusStart,
  changeFaqStatusSuccess,
  changeFaqStatusFailure,
  deleteFaqByIdStart,
  deleteFaqByIdSuccess,
  deleteFaqByIdFailure,
} from "../../redux/slices/faqSlice.js";
import { toast } from "react-toastify";
import FullScreenLoader from "../common/FullScreenLoader.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";

const DashFAQs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    faqs,
    pagination,
    stats,
    faqsLoading,
    faqsError,
    deleteFaqLoading,
    deleteFaqError,
    changeStatusLoading,
  } = useSelector((state) => state.faq);

  const categories = [
    "all",
    "general",
    "technical",
    "security",
    "fee",
    "admissions",
    "attendance",
    "result",
    "courses",
    "examination",
    "rules",
    "events",
    "library",
    "scholarship",
  ];

  const statuses = ["all", "active", "inactive"];

  // ================= STATE =================
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [categoryDropDown, setCategoryDropDown] = useState(false);
  const [statusDropDown, setStatusDropDown] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);

  // ================= DELETE MODAL STATE =================
  const [isModalOpen, setIsModalOpen] = useState(false); // controls modal visibility
  const [selectedFaqId, setSelectedFaqId] = useState(null); // stores faq id to delete

  // ================= FETCH FAQS =================
  const fetchFaqs = async () => {
    try {
      dispatch(getAllFaqsStart());

      const res = await axios.get("/faq/get-all-faqs", {
        params: { page, limit: 10, search, category, status },
      });

      console.log("Fetched FAQs:", res.data.data); // Debug log

      dispatch(getAllFaqsSuccess(res.data.data));
    } catch (error) {
      dispatch(
        getAllFaqsFailure(
          error.response?.data?.message || "Something went wrong",
        ),
      );
      toast.error(error.response?.data?.message || "Failed to fetch FAQs");
    }
  };

  // ================= ROUTE LOAD =================
  useEffect(() => {
    const run = async () => {
      if (location.pathname === "/dashboard/faqs") {
        setRouteLoading(true);
        await fetchFaqs();
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
      fetchFaqs();
    }
  }, [category, status]);

  // ================= PAGE CHANGE AUTO FETCH =================
  useEffect(() => {
    if (!routeLoading) {
      fetchFaqs();
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
      fetchFaqs();
    }, 1000);

    return () => clearTimeout(delay);
  }, [search]);

  // ================= HELPER =================
  const truncate = (text, maxLength = 20) => {
    return text?.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // ================= PAGINATION VALUES =================

  const currentPage = pagination?.currentPage || 1;

  const totalPages = pagination?.totalPages || 1;

  const totalEntries = pagination?.totalFAQSFetched || 0;

  // Start entry number
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * 10 + 1;

  // End entry number
  const endEntry = Math.min(currentPage * 10, totalEntries);

  // ================= HANDLE DELETE CLICK =================
  const handleDeleteClick = (faqId) => {
    setSelectedFaqId(faqId);
    setIsModalOpen(true);
  };

  // ================= HANDLE CONFIRM DELETE =================
  const handleConfirmDelete = async () => {
    try {
      dispatch(deleteFaqByIdStart());

      await axios.delete(`/faq/delete-faq/${selectedFaqId}`);

      dispatch(deleteFaqByIdSuccess(selectedFaqId));

      toast.success("FAQ deleted successfully");

      setIsModalOpen(false);

      navigate("/dashboard/faqs");
    } catch (error) {
      dispatch(
        deleteFaqByIdFailure(
          error.response?.data?.message || "Failed to delete FAQ",
        ),
      );

      toast.error(error.response?.data?.message || "Failed to delete FAQ");
    }
  };

  // ================= HANDLE STATUS TOGGLE =================
  const handleToggleStatus = async (faq) => {
    try {
      // prevent multiple clicks while request is in-flight
      if (changeStatusLoading) return;

      dispatch(changeFaqStatusStart());

      const newStatus = faq.status === "active" ? "inactive" : "active";

      const res = await axios.put(`/faq/change-faq-status/${faq._id}`, {
        status: newStatus,
      });

      dispatch(changeFaqStatusSuccess(res.data.data.faq));

      toast.success("FAQ status updated successfully");
    } catch (error) {
      dispatch(
        changeFaqStatusFailure(
          error.response?.data?.message || "Failed to update status",
        ),
      );

      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // ================= LOADER =================
  if (routeLoading) return <FullScreenLoader />;

  // ================= ERROR =================
  if (faqsError) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {faqsError}
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
        <span className="text-white font-medium">FAQ Management</span>
      </div>

      {/* Main Content */}
      <div className="px-2 pt-2 pb-20 space-y-6 text-gray-200">
        {/* ================= SECTION 2: Header and Add FAQ Button ================= */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold">FAQ Management</h1>
            <p className="text-xs text-gray-400">
              Manage, filter, and monitor all FAQs and their categories and
              statuses
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/faqs/add-faq")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-800 text-white transition duration-300 px-6 rounded-lg text-lg"
          >
            <MessageCirclePlus size={18} />
            Add FAQ
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
              placeholder="Search FAQs here..."
              className="bg-transparent outline-none ml-2 w-full text-sm"
            />
            {search && (
              <X size={16} className="cursor-pointer" onClick={clearSearch} />
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full md:w-40">
            <div
              onClick={() => setCategoryDropDown(!categoryDropDown)}
              className="flex items-center justify-between bg-[#0B0F19] px-4 py-2 rounded-lg cursor-pointer"
            >
              <span className="text-sm capitalize">Category: {category}</span>
              <ChevronDown size={16} />
            </div>

            {categoryDropDown && (
              <div className="absolute w-40 max-h-60 overflow-y-auto mt-2 bg-[#111827] rounded-lg border border-gray-700 z-10">
                {categories.map((c) => (
                  <div
                    key={c}
                    onClick={() => {
                      setCategory(c);
                      setCategoryDropDown(false);
                      setPage(1);
                    }}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer capitalize"
                  >
                    {c}
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
          </div>
        </div>

        {/* ================= SECTION 4: FAQS List ================= */}
        <div className="bg-[#111827] rounded-lg border border-gray-700 overflow-hidden">
          {/* Head */}
          <div className="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] px-6 py-3 text-sm text-gray-400 border-b border-gray-700 uppercase">
            <span className="text-left">Question Preview</span>
            <span className="text-center">Category</span>
            <span className="text-center">Last Modified</span>
            <span className="text-center">Status</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Body */}
          {faqsLoading ? (
            <div className="flex items-center justify-center py-6 bg-[#0B0F19] text-lg text-gray-400 animate-pulse">
              <span>Loading FAQs...</span>
            </div>
          ) : faqs?.length === 0 ? (
            <div className="flex items-center justify-center py-6 bg-[#0B0F19] text-lg text-red-500">
              <span>No FAQs found.</span>
            </div>
          ) : (
            faqs?.map((faq) => (
              <div
                key={faq._id}
                className="bg-[#0B0F19] grid grid-cols-[3fr_1fr_1fr_1fr_1fr] px-6 py-4 items-center border-b border-gray-800 text-sm hover:bg-gray-800 transition duration-200"
              >
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm">{truncate(faq.question, 50)}</span>
                  <span className="text-xs text-gray-400">
                    {truncate(faq.answer, 60)}
                  </span>
                </div>

                <span className="text-center">
                  {faq.category?.charAt(0).toUpperCase() +
                    faq.category?.slice(1)}
                </span>

                <span className="text-center">
                  {faq.updatedAt
                    ? new Date(faq.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "-"}
                </span>

                {/* ================= STATUS TOGGLE ================= */}
                <div className="flex items-center justify-center">
                  <div
                    onClick={() => handleToggleStatus(faq)}
                    className={`w-10 h-5 flex items-center rounded-full transition ${
                      faq.status === "active" ? "bg-indigo-600" : "bg-gray-600"
                    } ${
                      changeStatusLoading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <div
                      className={`bg-white w-[19px] h-[19px] rounded-full shadow-md transform transition ${
                        faq.status === "active"
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/faqs/update-faq/${faq._id}`)
                    }
                    className="p-2 bg-gray-600 hover:bg-gray-700 transition duration-200 rounded-lg"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(faq._id)}
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
            <div>
              Showing {startEntry} to {endEntry} of {totalEntries} entries
            </div>

            {/* ================= RIGHT SIDE ================= */}
            <div className="flex items-center gap-4">
              {/* Previous Button */}
              <button
                disabled={currentPage === 1 || faqsLoading}
                onClick={() => setPage((prev) => prev - 1)}
                className={`transition duration-200 ${
                  currentPage === 1 || faqsLoading
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
                disabled={currentPage === totalPages || faqsLoading}
                onClick={() => setPage((prev) => prev + 1)}
                className={`transition duration-200 ${
                  currentPage === totalPages || faqsLoading
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:text-white"
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* ================= SECTION 5 ================= */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">Total FAQs</p>
            <h2 className="text-4xl font-bold">
              {faqsLoading ? "-" : stats?.totalFAQS}
            </h2>
          </div>

          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">Total FAQs fetched</p>
            <h2 className="text-4xl font-bold">
              {faqsLoading ? "-" : stats?.totalFAQSFetched}
            </h2>
          </div>

          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">FAQs Added Last Month</p>
            <h2 className="text-4xl font-bold">
              {faqsLoading ? "-" : stats?.faqsLastMonth}
            </h2>
          </div>
        </div>
      </div>

      {/* ================= CONFIRM DELETE MODAL ================= */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // close modal
        onConfirm={handleConfirmDelete} // confirm delete
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        progressText="Deleting..."
        loading={deleteFaqLoading} // show loading state on confirm button
      />
    </div>
  );
};

export default DashFAQs;
