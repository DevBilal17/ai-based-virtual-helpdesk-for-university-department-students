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
  MapPinPlus,
  QrCode,
  SquarePen,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios.js";
import {
  getAllLocationsStart,
  getAllLocationsSuccess,
  getAllLocationsFailure,
  deleteLocationByIdStart,
  deleteLocationByIdSuccess,
  deleteLocationByIdFailure,
  changeLocationStatusStart,
  changeLocationStatusSuccess,
  changeLocationStatusFailure,
} from "../../redux/slices/locationSlice.js";
import { toast } from "react-toastify";
import FullScreenLoader from "../common/FullScreenLoader.jsx";
import ConfirmModal from "../common/ConfirmModal.jsx";

const DashLocations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    locations,
    pagination,
    stats,
    locationsLoading,
    locationsError,
    deleteLocationLoading,
    deleteLocationError,
    changeStatusLoading,
    changeStatusError,
  } = useSelector((state) => state.locationData);

  const categories = [
    "classroom",
    "office",
    "lab",
    "washroom",
    "hall",
    "library",
    "meeting_room",
    "conference_room",
    "faculty_room",
    "other",
    "all",
  ];

  const statuses = ["active", "inactive", "all"];

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
  const [selectedLocationId, setSelectedLocationId] = useState(null); // stores location id to delete

  // ================= FETCH LOCATIONS =================
  const fetchLocations = async () => {
    try {
      dispatch(getAllLocationsStart());

      const res = await axios.get("/location/get-all-locations", {
        params: { page, limit: 3, search, category, status },
      });

      console.log("Fetched Locations:", res.data.data); // Debug log

      dispatch(getAllLocationsSuccess(res.data.data));
    } catch (error) {
      dispatch(
        getAllLocationsFailure(
          error.response?.data?.message || "Something went wrong",
        ),
      );
      toast.error(error.response?.data?.message || "Failed to fetch Locations");
    }
  };

  // ================= ROUTE LOAD =================
  useEffect(() => {
    const run = async () => {
      if (location.pathname === "/dashboard/locations") {
        setRouteLoading(true);
        await fetchLocations();
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
      fetchLocations();
    }
  }, [category, status]);

  // ================= PAGE CHANGE AUTO FETCH =================
  useEffect(() => {
    if (!routeLoading) {
      fetchLocations();
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
      fetchLocations();
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

  const totalEntries = pagination?.totalItems || 0;

  // Start entry number
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * 3 + 1;

  // End entry number
  const endEntry = Math.min(currentPage * 3, totalEntries);

  // ================= HANDLE DELETE CLICK =================
  const handleDeleteClick = (locationId) => {
    setSelectedLocationId(locationId);
    setIsModalOpen(true);
  };

  // ================= HANDLE CONFIRM DELETE =================
  const handleConfirmDelete = async () => {
    try {
      dispatch(deleteLocationByIdStart());

      await axios.delete(`/location/delete-location/${selectedLocationId}`);

      dispatch(deleteLocationByIdSuccess(selectedLocationId));

      toast.success("Location deleted successfully");

      setIsModalOpen(false);

      navigate("/dashboard/locations");
    } catch (error) {
      dispatch(
        deleteLocationByIdFailure(
          error.response?.data?.message || "Failed to delete Location",
        ),
      );

      toast.error(error.response?.data?.message || "Failed to delete Location");
    }
  };

  // ================= HANDLE STATUS TOGGLE =================
  const handleToggleStatus = async (location) => {
    try {
      // prevent multiple clicks while request is in-flight
      if (changeStatusLoading) return;

      dispatch(changeLocationStatusStart());

      const newStatus = location.status === "active" ? "inactive" : "active";

      const res = await axios.put(
        `/location/change-location-status/${location._id}`,
        {
          location_status: newStatus,
        },
      );

      console.log("Updated Location:", res.data.data.updatedLocation);

      dispatch(changeLocationStatusSuccess(res.data.data.updatedLocation));

      toast.success("Location status updated successfully");
    } catch (error) {
      dispatch(
        changeLocationStatusFailure(
          error.response?.data?.message || "Failed to update location status",
        ),
      );

      toast.error(
        error.response?.data?.message || "Failed to update location status",
      );
    }
  };

  // ================= LOADER =================
  // if (routeLoading) return <FullScreenLoader />;

  // ================= ERROR =================
  // if (locationsError) {
  //   return (
  //     <div className="text-center mt-10 text-red-500 font-semibold">
  //       {locationsError}
  //     </div>
  //   );
  // }

  return (
    <div className="p-3">
      {/* ================= Breadcrumb ================= */}
      <div className="flex items-center gap-2 text-lg text-gray-400 mb-6 bg-[#0B0F19] rounded-lg border-2 border-gray-800 p-3">
        <span
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer hover:text-white"
        >
          Dashboard
        </span>
        <ChevronRight size={16} />
        <span className="text-white font-medium">Location Management</span>
      </div>

      {/* Main Content */}
      <div className="px-2 pt-2 pb-20 space-y-6 text-gray-200">
        {/* ================= Heading and Add Location Button ================= */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold">Location Management</h1>
            <p className="text-xs text-gray-400">
              Manage, add, edit, or delete locations and their QR Codes.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/locations/add-location")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-800 text-white transition duration-300 px-6 rounded-lg text-lg"
          >
            <MapPinPlus size={20} />
            Add New Location
          </button>
        </div>

        {/* ================= Search and Filters ================= */}
        <div className="flex flex-col md:flex-row gap-4 bg-[#111827] rounded-lg border border-gray-700 p-3">
          {/* Search */}
          <div className="flex items-center bg-[#0B0F19] px-3 py-2 rounded-lg flex-1">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search location with name, building, or floor..."
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

        {/* ================= Locations Cards and pagination ================= */}
        <div className="">
          {locationsLoading ? (
            <div className="flex items-center justify-center py-6 bg-[#0B0F19] text-lg text-gray-400 animate-pulse">
              <span>Loading Locations...</span>
            </div>
          ) : locations?.length === 0 ? (
            <div className="flex items-center justify-center py-6 bg-[#0B0F19] text-lg text-red-500">
              <span>No Locations found.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 my-6">
              {locations.map((location) => (
                <div
                  key={location._id}
                  className="rounded-2xl overflow-hidden border-2 border-gray-800 bg-[#111827]"
                >
                  {/* Image */}
                  <div className="relative h-[200px] overflow-hidden">
                    <img
                      src={location.location_image}
                      alt={location.location_name}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#101225] via-[#10122590] to-transparent"></div>

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        className={`text-[10px] px-3 py-1.5 rounded-full font-semibold tracking-wide capitalize ${
                          location.location_status === "active"
                            ? "bg-[#1CD48F33] text-[#2EF2A4]"
                            : "bg-[#FFB02033] text-[#FFB020]"
                        }`}
                      >
                        {location.location_status}
                      </span>

                      <span className="text-[10px] px-3 py-1.5 rounded-full bg-[#7A6CFF33] text-[#A89BFF] font-semibold tracking-wide">
                        {truncate(location.location_name, 15)}
                      </span>
                    </div>

                    <img
                      src={location.location_qr}
                      alt="Location QR Code"
                      className="w-14 h-14 object-contain absolute bottom-3 right-3"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold leading-tight">
                        {truncate(location.location_name, 15)}
                      </h3>

                      <button
                        className="text-red-500 hover:text-red-600 duration-200 transition-all"
                        onClick={handleDeleteClick}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <p className="text-gray-400 mt-1 text-base">
                      {truncate(location.location_description, 30)}
                    </p>

                    <div className="mt-7 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Category</span>
                        <span className="text-sm text-gray-300 capitalize">
                          {location.location_category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Building</span>
                        <span className="text-sm text-gray-300">
                          {location.building}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Floor</span>
                        <span className="text-sm text-gray-300">
                          {location.floor}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          Created by
                        </span>
                        <span className="text-sm text-gray-300">
                          {location.creator_name}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          Updated by
                        </span>
                        <span className="text-sm text-gray-300">
                          {location.updater_name}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Views</span>
                        <span className="text-sm text-gray-300">
                          {location.location_views}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          Change Status
                        </span>
                        {/* ================= STATUS TOGGLE ================= */}
                        <div className="flex items-center justify-center">
                          <div
                            onClick={() => handleToggleStatus(location)}
                            className={`w-10 h-5 flex items-center rounded-full transition ${
                              location.location_status === "active"
                                ? "bg-indigo-600"
                                : "bg-gray-600"
                            } ${
                              changeStatusLoading
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            <div
                              className={`bg-white w-[19px] h-[19px] rounded-full shadow-md transform transition ${
                                location.location_status === "active"
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      className="w-full mt-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold duration-200 transition-all bg-[#171A31] hover:bg-[#1B1F3C] text-[#8B80FF] border-2 border-gray-800"
                      onClick={() =>
                        navigate(
                          `/dashboard/locations/update-location/${location._id}`,
                        )
                      }
                    >
                      <SquarePen size={18} />
                      <span>Edit Location</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= PAGINATION ================= */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 text-sm text-gray-400 rounded-lg border-2 border-gray-800 bg-[#111827]">
            {/* ================= LEFT SIDE ================= */}
            <div>
              Showing {startEntry} to {endEntry} of {totalEntries} entries
            </div>

            {/* ================= RIGHT SIDE ================= */}
            <div className="flex items-center gap-4">
              {/* Previous Button */}
              <button
                disabled={currentPage === 1 || locationsLoading}
                onClick={() => setPage((prev) => prev - 1)}
                className={`transition duration-200 ${
                  currentPage === 1 || locationsLoading
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
                disabled={currentPage === totalPages || locationsLoading}
                onClick={() => setPage((prev) => prev + 1)}
                className={`transition duration-200 ${
                  currentPage === totalPages || locationsLoading
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:text-white"
                }`}
              >
                <ChevronRight size={20} />
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
        title="Delete Location"
        message="Are you sure you want to delete this Location? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        progressText="Deleting..."
        loading={deleteLocationLoading} // show loading state on confirm button
      />
    </div>
  );
};

export default DashLocations;
