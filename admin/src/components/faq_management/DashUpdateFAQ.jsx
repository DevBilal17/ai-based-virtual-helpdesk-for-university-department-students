import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFaqByIdStart,
  getFaqByIdSuccess,
  getFaqByIdFailure,
  updateFaqByIdStart,
  updateFaqByIdSuccess,
  updateFaqByIdFailure,
} from "../../redux/slices/faqSlice.js";
import axiosInstance from "../../api/axios.js";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const DashUpdateFAQ = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { fetchedFaq, faqLoading, faqError, updateFaqLoading, updateFaqError } =
    useSelector((state) => state.faq);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("general");
  const [status, setStatus] = useState("active");
  const [categoryDropDown, setCategoryDropDown] = useState(false);

  // ================= CHARACTER LIMITS =================
  const QUESTION_MAX_LENGTH = 200;
  const ANSWER_MAX_LENGTH = 2000;

  // ================= FETCH FAQ =================
  useEffect(() => {
    const fetchFaq = async () => {
      try {
        dispatch(getFaqByIdStart());

        const res = await axiosInstance.get(`/faq/get-faq/${id}`);

        const faq = res.data.data.faq;

        dispatch(getFaqByIdSuccess(faq));

        // Prefill
        setQuestion(faq.question);
        setAnswer(faq.answer);
        setCategory(faq.category);
        setStatus(faq.status);
      } catch (err) {
        dispatch(
          getFaqByIdFailure(
            err.response?.data?.message || "Failed to fetch FAQ",
          ),
        );
      }
    };

    if (id) fetchFaq();
  }, [id, dispatch]);

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateFaqByIdStart());

      let payload = {
        question,
        answer,
        category,
        status,
      };

      const res = await axiosInstance.put(`/faq/update-faq/${id}`, payload);

      console.log("Update FAQ response:", res.data.data);

      dispatch(updateFaqByIdSuccess(res.data.data));

      toast.success("FAQ updated successfully");

      navigate("/dashboard/faqs");
    } catch (error) {
      dispatch(
        updateFaqByIdFailure(
          error.response?.data?.message || "Failed to update FAQ",
        ),
      );

      toast.error(error.response?.data?.message || "Failed to update FAQ");
    }
  };

  // ================= ERROR =================
  if (faqError) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {faqError}
      </div>
    );
  }

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
          onClick={() => navigate("/dashboard/faqs")}
          className="cursor-pointer hover:text-white"
        >
          FAQ Management
        </span>
        <ChevronRight size={16} />
        <span className="text-white font-medium">Update FAQ</span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center">
        {/* ================= HEADING ================= */}
        <div className="flex flex-col items-center text-center gap-3 mb-8 w-full max-w-2xl">
          <h1 className="text-3xl font-semibold text-gray-200">
            Update an existing FAQ
          </h1>
          <p className="text-xs text-gray-400">
            You can update an existing frequently asked question (FAQ) here.
            Make sure to provide a clear and concise question along with a
            helpful answer to assist students effectively.
          </p>
        </div>

        {/* Form fields */}
        {faqLoading ? (
          <div className="flex items-center justify-center w-full max-w-2xl bg-[#0B0F19] border-2 border-gray-800 rounded-lg p-6 shadow-lg mx-auto">
            <span className="text-gray-400">Loading FAQ...</span>
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-[#0B0F19] border-2 border-gray-800 rounded-lg p-6 shadow-lg mx-auto">
            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ================= CATEGORY ================= */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-400">
                  Select FAQ Category
                </label>

                {/* Dropdown Container */}
                <div className="relative">
                  {/* Selected Value */}
                  <div
                    onClick={() => setCategoryDropDown(!categoryDropDown)}
                    className="w-full flex items-center justify-between p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 cursor-pointer hover:border-gray-600 transition duration-200"
                  >
                    <span className="capitalize">{category}</span>

                    <ChevronRight
                      size={16}
                      className={`transition duration-200 ${
                        categoryDropDown ? "rotate-90" : ""
                      }`}
                    />
                  </div>

                  {/* Dropdown Menu */}
                  {categoryDropDown && (
                    <div
                      className="
          absolute
          left-0
          right-0
          mt-2
          bg-[#111827]
          border-2
          border-gray-700
          rounded-lg
          shadow-lg
          z-50
          max-h-52
          overflow-y-auto

          scrollbar-thin
          scrollbar-track-[#0B0F19]
          scrollbar-thumb-gray-700
          hover:scrollbar-thumb-gray-600
        "
                    >
                      {[
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
                      ].map((item) => (
                        <div
                          key={item}
                          onClick={() => {
                            setCategory(item);
                            setCategoryDropDown(false);
                          }}
                          className={`
              px-4
              py-3
              text-sm
              capitalize
              cursor-pointer
              transition
              duration-150

              ${
                category === item
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }
            `}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-400">
                  Select FAQ Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Question */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-400">
                  Question
                </label>

                <textarea
                  rows="4"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  maxLength={QUESTION_MAX_LENGTH}
                  placeholder="Enter question for FAQ"
                  className="w-full p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* ================= CHARACTER COUNT (QUESTION) ================= */}
                <div className="text-xs text-gray-400 text-right mt-1">
                  {question.length} / {QUESTION_MAX_LENGTH}
                </div>
              </div>

              {/* Answer */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-400">
                  Answer
                </label>

                <textarea
                  rows="4"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  maxLength={ANSWER_MAX_LENGTH}
                  placeholder="Enter answer for FAQ"
                  className="w-full p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* ================= CHARACTER COUNT (ANSWER) ================= */}
                <div className="text-xs text-gray-400 text-right mt-1">
                  {answer.length} / {ANSWER_MAX_LENGTH}
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={updateFaqLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200"
              >
                {updateFaqLoading ? "Updating FAQ..." : "Update FAQ"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashUpdateFAQ;
