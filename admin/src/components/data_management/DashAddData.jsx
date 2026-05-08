import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axios.js";
import {
  addDataStart,
  addDataSuccess,
  addDataFailure,
} from "../../redux/slices/dataSlice.js";
import { UploadCloud, FileText, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashAddData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addFileLoading } = useSelector((state) => state.data);

  const [fileName, setFileName] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [previewProgress, setPreviewProgress] = useState(0);

  // ================= CHARACTER LIMITS =================
  const FILE_NAME_MAX_LENGTH = 100;
  const FILE_DESCRIPTION_MAX_LENGTH = 500;

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  // ================= HANDLE FILE PICK =================
  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PDF, DOC, DOCX, XLS, XLSX files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Maximum file size is 10MB");
      return;
    }

    setSelectedFile(file);

    // fake preview animation
    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;
      setPreviewProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 80);
  };

  // ================= ADD FILE =================
  const handleAddFile = async () => {
    if (!fileName.trim()) {
      toast.error("File name is required");
      return;
    }

    if (!fileDescription.trim()) {
      toast.error("File description is required");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    try {
      dispatch(addDataStart());

      const formData = new FormData();

      formData.append("file_name", fileName);
      formData.append("file_description", fileDescription);
      formData.append("file", selectedFile);

      const res = await axiosInstance.post("/data/add-data", formData);

      console.log("File uploaded and added successfully:", res.data.data);

      dispatch(addDataSuccess(res.data.data));

      toast.success("File uploaded and added successfully");

      // reset form
      setFileName("");
      setFileDescription("");
      setSelectedFile(null);
      setPreviewProgress(0);

      navigate("/dashboard/data");
    } catch (error) {
      dispatch(
        addDataFailure(
          error.response?.data?.message || "Failed to upload file",
        ),
      );

      toast.error(error.response?.data?.message || "Failed to upload file");
    }
  };

  return (
    <div className="p-3">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-lg text-gray-400 mb-6 bg-[#0B0F19] rounded-lg border-2 border-gray-800 p-3">
        <span
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer hover:text-white"
        >
          Dashboard
        </span>
        <ChevronRight size={16} />
        <span
          onClick={() => navigate("/dashboard/data")}
          className="cursor-pointer hover:text-white"
        >
          Data Management
        </span>
        <ChevronRight size={16} />
        <span className="text-white font-medium">Add File</span>
      </div>

      {/* ================= HEADING ================= */}
      <div className="flex flex-col gap-1 mb-6 px-3">
        <h1 className="text-3xl font-semibold text-gray-200">
          Upload and Add a new File
        </h1>
        <p className="text-xs text-gray-400">
          You can upload and add PDF, DOC, DOCX, XLS, XLSX files and the file
          size should not exceed 10MB.
        </p>
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="bg-[#0B0F19] rounded-lg border border-gray-700 p-6 flex flex-col gap-5 mx-3 mb-10">
        {/* file name */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-400">
            File Name
          </label>

          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            maxLength={FILE_NAME_MAX_LENGTH}
            placeholder="Enter file name"
            required
            className="w-full p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* ================= CHARACTER COUNT (FILE NAME) ================= */}
          <div className="text-xs text-gray-400 text-right mt-1">
            {fileName.length} / {FILE_NAME_MAX_LENGTH}
          </div>
        </div>

        {/* description */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-400">
            File Description
          </label>

          <textarea
            rows="4"
            value={fileDescription}
            onChange={(e) => setFileDescription(e.target.value)}
            maxLength={FILE_DESCRIPTION_MAX_LENGTH}
            placeholder="Enter file description"
            required
            className="w-full p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* ================= CHARACTER COUNT (FILE DESCRIPTION) ================= */}
          <div className="text-xs text-gray-400 text-right mt-1">
            {fileDescription.length} / {FILE_DESCRIPTION_MAX_LENGTH}
          </div>
        </div>

        {/* ================= FILE UPLOAD SECTION ================= */}
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col gap-5">
          <p className="text-sm text-gray-400">
            Upload PDF, DOC, DOCX, XLS, XLSX files only. Maximum size: 10MB
          </p>

          <div className="flex items-center gap-5">
            {/* preview box */}
            <div className="relative w-28 h-28 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
              {/* progress fill */}
              <div
                className="absolute left-0 top-0 h-full bg-indigo-200 transition-all duration-300"
                style={{
                  width: `${previewProgress}%`,
                }}
              />

              <FileText className="z-10 text-indigo-600" size={36} />
            </div>

            {/* upload button */}
            <label className="cursor-pointer px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
              <UploadCloud size={18} />
              Choose File
              <input type="file" hidden onChange={handleFileSelect} />
            </label>

            {selectedFile && (
              <span className="text-sm text-gray-400">{selectedFile.name}</span>
            )}
          </div>
        </div>

        {/* ================= ADD FILE BUTTON ================= */}
        <div>
          <button
            onClick={handleAddFile}
            disabled={addFileLoading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-60"
          >
            {addFileLoading ? "Adding..." : "Add File"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashAddData;
