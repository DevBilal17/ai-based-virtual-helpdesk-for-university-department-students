import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "../../api/axios.js";
import {
  addLocationStart,
  addLocationSuccess,
  addLocationFailure,
} from "../../redux/slices/locationSlice.js";
import { UploadCloud, FileText, ChevronRight, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import it_floor_map from "../../assets/maps/it_floor_map.svg";

const DashAddLocation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { addLocationLoading, addLocationError } = useSelector(
    (state) => state.locationData,
  );

  const mapRef = useRef(null);

  // ================= FORM STATES =================
  const [locationName, setLocationName] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [locationCategory, setLocationCategory] = useState("classroom");
  const [locationStatus, setLocationStatus] = useState("active");
  const [building, setBuilding] = useState("Yousuf Block");
  const [floor, setFloor] = useState("2nd Floor");
  const [locationImage, setLocationImage] = useState(null);
  const [locationImagePreview, setLocationImagePreview] = useState("");
  const [previewProgress, setPreviewProgress] = useState(0);
  const [selectionMode, setSelectionMode] = useState("route");

  // ================= CHARACTER LIMITS =================
  const LOCATION_NAME_MAX_LENGTH = 100;
  const LOCATION_DESCRIPTION_MAX_LENGTH = 1000;
  const BUILDING_MAX_LENGTH = 100;
  const FLOOR_MAX_LENGTH = 50;

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  // ================= HANDLE IMAGE =================
  const handleLocationImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only jpeg, jpg, png, webp, gif type images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Maximum file size is 5MB");
      return;
    }

    setLocationImage(file);

    setLocationImagePreview(URL.createObjectURL(file));

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

  useEffect(() => {
    return () => {
      if (locationImagePreview) {
        URL.revokeObjectURL(locationImagePreview);
      }
    };
  }, [locationImagePreview]);

  // ================= POSITION =================
  const [position, setPosition] = useState({
    x: null,
    y: null,
  });

  // ================= ROUTE POINTS =================
  const [routePoints, setRoutePoints] = useState([]);

  // ================= HANDLE MAP CLICK =================
  const handleMapClick = (e) => {
    const rect = mapRef.current.getBoundingClientRect();

    const x = Number(((e.clientX - rect.left) / rect.width).toFixed(4));

    const y = Number(((e.clientY - rect.top) / rect.height).toFixed(4));

    // ================= DESTINATION POSITION AND ROUTE POINTS =================
    if (selectionMode === "route") {
      setRoutePoints((prev) => [...prev, { x, y }]);
    } else {
      setPosition({ x, y });
    }
  };

  // ================= REMOVE LAST ROUTE POINT =================
  const removeLastRoutePoint = () => {
    setRoutePoints((prev) => prev.slice(0, -1));
  };

  // ================= RESET ROUTE =================
  const resetRoutePoints = () => {
    setRoutePoints([]);
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ================= VALIDATION =================
      if (!locationImage) {
        toast.error("Please upload location image");
        return;
      }

      if (position.x === null || position.y === null) {
        toast.error("Please select destination position from floor map");
        return;
      }

      if (routePoints.length < 1) {
        toast.error("Please select at least 1 route point");
        return;
      }

      dispatch(addLocationStart());

      // ================= FORMDATA =================
      const formData = new FormData();

      formData.append("location_name", locationName);

      formData.append("location_description", locationDescription);

      formData.append("location_category", locationCategory);

      formData.append("location_status", locationStatus);

      formData.append("building", building);

      formData.append("floor", floor);

      formData.append("location_image", locationImage);

      // ================= POSITION =================
      // formData.append("position[x]", position.x);
      // formData.append("position[y]", position.y);

      formData.append("position", JSON.stringify(position));
      formData.append("route_points", JSON.stringify(routePoints));

      // ================= ROUTE POINTS =================
      // routePoints.forEach((point, index) => {
      //   formData.append(`route_points[${index}][x]`, point.x);

      //   formData.append(`route_points[${index}][y]`, point.y);
      // });

      // ================= API REQUEST =================
      const res = await axios.post("/location/add-location", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Added Location:", res.data.data);

      dispatch(addLocationSuccess(res.data.data));

      toast.success("Location added successfully.");

      // ================= RESET FORM =================
      setLocationName("");

      setLocationDescription("");

      setLocationCategory("classroom");

      setLocationStatus("active");

      setBuilding("Yousuf Block");

      setFloor("2nd Floor");

      setLocationImage(null);

      setLocationImagePreview("");

      setPreviewProgress(0);

      setPosition({
        x: null,
        y: null,
      });

      setRoutePoints([]);

      // Navigate to Locations page
      navigate("/dashboard/locations");
    } catch (error) {
      console.error(error);

      const message =
        error?.response?.data?.message || "Failed to add location";

      dispatch(addLocationFailure(message));

      toast.error(message);
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
          onClick={() => navigate("/dashboard/locations")}
          className="cursor-pointer hover:text-white"
        >
          Location Management
        </span>
        <ChevronRight size={16} />
        <span className="text-white font-medium">Add Location</span>
      </div>

      {/* ================= HEADING ================= */}
      <div className="flex flex-col gap-1 mb-6 px-3">
        <h1 className="text-3xl font-semibold text-gray-200">
          Add a new Location
        </h1>
        <p className="text-xs text-gray-400">
          You can add a new location by filling these fields, upload location's
          image and select location's position from the floor map directly.
        </p>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="bg-[#0B0F19] rounded-lg border border-gray-700 p-6 flex flex-col gap-5 mx-3 mb-10">
        {/* FORM CONTAINER */}
        <form
          onSubmit={handleSubmit}
          // className="bg-[#1e293b] rounded-2xl p-5 border border-slate-700 shadow-lg"
        >
          {/* location name */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">
              Location Name
            </label>

            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              maxLength={LOCATION_NAME_MAX_LENGTH}
              placeholder="Enter location name"
              required
              className="w-full p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* ================= CHARACTER COUNT (LOCATION NAME) ================= */}
            <div className="text-xs text-gray-400 text-right mt-1">
              {locationName.length} / {LOCATION_NAME_MAX_LENGTH}
            </div>
          </div>

          {/* location description */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">
              Location Description
            </label>

            <textarea
              rows="4"
              value={locationDescription}
              onChange={(e) => setLocationDescription(e.target.value)}
              maxLength={LOCATION_DESCRIPTION_MAX_LENGTH}
              placeholder="Enter location description"
              required
              className="w-full p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* ================= CHARACTER COUNT (LOCATION DESCRIPTION) ================= */}
            <div className="text-xs text-gray-400 text-right mt-1">
              {locationDescription.length} / {LOCATION_DESCRIPTION_MAX_LENGTH}
            </div>
          </div>

          {/* Location Category */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-400">
              Select Location Category
            </label>
            <select
              value={locationCategory}
              onChange={(e) => setLocationCategory(e.target.value)}
              className="w-full p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="classroom">Classroom</option>
              <option value="office">Office</option>
              <option value="lab">Lab</option>
              <option value="washroom">Washroom</option>
              <option value="hall">Hall</option>
              <option value="library">Library</option>
              <option value="meeting_room">Meeting room</option>
              <option value="conference_room">Conference room</option>
              <option value="faculty_room">Faculty room</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Location Status */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-400">
              Select Location Status
            </label>
            <select
              value={locationStatus}
              onChange={(e) => setLocationStatus(e.target.value)}
              className="w-full p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* building */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">
              Building
            </label>

            <input
              type="text"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              maxLength={BUILDING_MAX_LENGTH}
              placeholder="Enter building name"
              required
              className="w-full p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* ================= CHARACTER COUNT (BUILDING) ================= */}
            <div className="text-xs text-gray-400 text-right mt-1">
              {building.length} / {BUILDING_MAX_LENGTH}
            </div>
          </div>

          {/* floor */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">
              Floor
            </label>

            <input
              type="text"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              maxLength={FLOOR_MAX_LENGTH}
              placeholder="Enter floor"
              required
              className="w-full p-3 bg-[#111827] border-2 border-gray-700 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* ================= CHARACTER COUNT (FLOOR) ================= */}
            <div className="text-xs text-gray-400 text-right mt-1">
              {floor.length} / {FLOOR_MAX_LENGTH}
            </div>
          </div>

          {/* ================= IMAGE UPLOAD SECTION ================= */}
          <div className="mb-4">
            <label className="block mb-4 text-sm font-medium text-gray-400">
              Upload Location Image
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col gap-5">
              <p className="text-sm text-gray-400">
                Upload JPEG, JPG, PNG, WEBP, GIF type images only. Maximum size:
                5MB
              </p>

              <div className="flex items-center gap-5">
                {/* preview box */}
                <div className="relative w-28 h-28 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-800">
                  {/* progress fill */}
                  <div
                    className="absolute left-0 top-0 h-full bg-indigo-200 transition-all duration-300"
                    style={{
                      width: `${previewProgress}%`,
                    }}
                  />

                  {!locationImage ? (
                    <Image className="z-10 text-indigo-600" size={36} />
                  ) : (
                    <img
                      src={locationImagePreview}
                      alt="Location Image Preview"
                      className="w-full h-full object-cover z-10"
                    />
                  )}
                </div>

                {/* upload button */}
                <label className="cursor-pointer px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
                  <UploadCloud size={18} />
                  Choose Image
                  <input type="file" hidden onChange={handleLocationImage} />
                </label>

                {locationImage && (
                  <span className="text-sm text-gray-400">
                    {locationImage.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* FLOOR MAP POSITION PICKER */}
          <div className="bg-[#111827] rounded-lg p-5 border-2 border-gray-800 shadow-lg mt-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-bold text-gray-200">
                  Indoor Navigation Map
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Click on the floor map to select route points and destination.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setSelectionMode("route")}
                  className={`text-sm px-3 py-2 rounded-lg font-semibold text-white transition-all duration-300 ${
                    selectionMode === "route"
                      ? "bg-green-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Route Mode
                </button>

                <button
                  type="button"
                  onClick={() => setSelectionMode("destination")}
                  className={`text-sm px-3 py-2 rounded-lg font-semibold text-white transition-all duration-300 ${
                    selectionMode === "destination"
                      ? "bg-indigo-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Destination Mode
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center my-6 text-gray-300 font-semibold">
              {selectionMode === "route" ? (
                <span className="text-green-500">
                  You can select Route Points (Navigation)
                </span>
              ) : (
                <span className="text-indigo-500">
                  You can select Destination Point
                </span>
              )}
            </div>

            {/* ================= MAP ================= */}
            <div className="relative border-2 border-gray-800 rounded-lg overflow-hidden">
              <img
                ref={mapRef}
                src={it_floor_map}
                alt="IT Floor Map"
                onClick={handleMapClick}
                className="w-full h-[500px] cursor-crosshair select-none"
              />

              {/* ================= ROUTE SVG PATH ================= */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {routePoints.map((point, index) => {
                  if (index === routePoints.length - 1) return null;

                  const nextPoint = routePoints[index + 1];

                  return (
                    <line
                      key={index}
                      x1={`${point.x * 100}%`}
                      y1={`${point.y * 100}%`}
                      x2={`${nextPoint.x * 100}%`}
                      y2={`${nextPoint.y * 100}%`}
                      stroke="#facc15"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>

              {/* ================= ROUTE POINTS ================= */}
              {routePoints.map((point, index) => (
                <div
                  key={index}
                  className="absolute z-10 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-black"
                  style={{
                    left: `calc(${point.x * 100}% - 12px)`,
                    top: `calc(${point.y * 100}% - 12px)`,
                  }}
                >
                  {index + 1}
                </div>
              ))}

              {/* ================= DESTINATION POINT ================= */}
              {position.x !== null && (
                <div
                  className="absolute z-20 w-5 h-5 bg-red-500 rounded-full border-2 border-white"
                  style={{
                    left: `calc(${position.x * 100}% - 10px)`,
                    top: `calc(${position.y * 100}% - 10px)`,
                  }}
                />
              )}
            </div>

            {/* ================= POSITION INFO ================= */}
            <div className="mt-5 bg-[#0f172a] rounded-lg p-4 border-2 border-gray-800">
              <h3 className="font-semibold mb-3 text-gray-300">
                Selected Destination Position
              </h3>

              <div className="flex gap-4 text-sm text-gray-400">
                <p>
                  X:
                  <span className="text-blue-400 ml-1">
                    {position.x ?? "--"}
                  </span>
                </p>

                <p>
                  Y:
                  <span className="text-blue-400 ml-1">
                    {position.y ?? "--"}
                  </span>
                </p>
              </div>
            </div>

            {/* ================= ROUTE CONTROLS ================= */}
            <div className="mt-5 flex flex-wrap gap-3 text-gray-200">
              <button
                type="button"
                onClick={removeLastRoutePoint}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition-all text-black"
              >
                Remove Last Point
              </button>

              <button
                type="button"
                onClick={resetRoutePoints}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all"
              >
                Reset Route
              </button>
            </div>

            {/* ================= ROUTE POINTS LIST ================= */}
            <div className="mt-5 bg-[#0f172a] rounded-lg p-4 border-2 border-gray-800 max-h-60 overflow-y-auto">
              <h3 className="font-semibold mb-3 text-gray-300">Route Points</h3>

              <div className="space-y-2">
                {routePoints.length > 0 ? (
                  routePoints.map((point, index) => (
                    <div
                      key={index}
                      className="flex justify-between bg-[#1e293b] px-3 py-2 rounded-lg text-gray-400"
                    >
                      <span>Point {index + 1}</span>

                      <span className="text-blue-400">
                        ({point.x}, {point.y})
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">
                    No route points selected yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ================= SUBMIT BUTTON ================= */}
          <button
            type="submit"
            disabled={addLocationLoading}
            className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 py-3 rounded-lg font-semibold mt-6 text-white"
          >
            {addLocationLoading ? "Adding Location..." : "Add Location"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashAddLocation;
