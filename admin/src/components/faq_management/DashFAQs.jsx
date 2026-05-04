import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  MessageCirclePlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios.js";
import {
  getAllFaqsStart,
  getAllFaqsSuccess,
  getAllFaqsFailure,
} from "../../redux/slices/faqSlice.js";
import { toast } from "react-toastify";
import FullScreenLoader from "../common/FullScreenLoader.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";
import {
  deleteFaqByIdStart,
  deleteFaqByIdSuccess,
  deleteFaqByIdFailure,
} from "../../redux/slices/faqSlice.js";

const DashFAQs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    faqs,
    pagination,
    stats,
    faqsLoading,
    faqsError,
    deleteFaqLoading,
    deleteFaqError,
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

  // ================= USE EFFECT =================
  useEffect(() => {
    fetchFaqs();
  }, [page, category, status]);

  // ================= SEARCH (DEBOUNCE) =================
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      fetchFaqs();
    }, 1000);

    return () => clearTimeout(delay);
  }, [search]);

  // ================= LOADING =================
  if (faqsLoading) return <FullScreenLoader />;

  // ================= ERROR =================
  if (faqsError) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {faqsError}
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

  return (
    <div className="p-3">
      {/* ================= SECTION 1: Breadcrumb ================= */}
      <div className="flex items-center gap-2 text-lg text-gray-400 mb-6 bg-[#0B0F19] rounded-lg border border-gray-700 p-3">
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
              <div className="absolute w-full mt-2 bg-[#111827] rounded-lg border border-gray-700 z-10">
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
          <div className="grid grid-cols-5 px-6 py-3 text-sm text-gray-400 border-b border-gray-700 uppercase">
            <span>Question Preview</span>
            <span className="ml-32">Category</span>
            <span className="text-right">Last Modified</span>
            <span className="text-right">FAQ Status</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Body */}
          {faqs?.map((faq) => (
            <div
              key={faq._id}
              className="bg-[#0B0F19] grid grid-cols-5 px-6 py-4 items-center border-b border-gray-800 text-sm hover:bg-gray-800 transition duration-200"
            >
              <div className="flex flex-col items-start gap-1">
                <span className="text-sm">{truncate(faq.question, 30)}</span>
                <span className="text-xs text-gray-400">
                  {truncate(faq.answer, 50)}
                </span>
              </div>

              <span className="ml-32">
                {faq.category?.charAt(0).toUpperCase() + faq.category?.slice(1)}
              </span>

              <span className="text-right">
                {faq.updatedAt
                  ? new Date(faq.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "-"}
              </span>

              <div className="text-right">
                <span
                  className={`text-xs px-3 py-1 w-20 text-center uppercase rounded-full ${
                    faq.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {faq.status}
                </span>
              </div>

              <div className="flex justify-end gap-2">
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
          ))}

          {/* Pagination */}
          <div className="flex justify-between px-6 py-4 text-base text-gray-400">
            <span>
              Showing {pagination?.currentPage} of {pagination?.totalPages}{" "}
              pages
            </span>

            <span className="ml-2">|</span>

            <span className="flex-1 ml-2">
              Total FAQs fetched: {stats?.totalFAQSFetched}
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
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">Total FAQs</p>
            <h2 className="text-4xl font-bold">{stats?.totalFAQS}</h2>
          </div>

          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">Total FAQs fetched</p>
            <h2 className="text-4xl font-bold">{stats?.totalFAQSFetched}</h2>
          </div>

          <div className="flex flex-col gap-3 bg-[#111827] p-4 rounded-lg">
            <p className="text-gray-400">FAQs Added Last Month</p>
            <h2 className="text-4xl font-bold">{stats?.faqsLastMonth}</h2>
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
