import React from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  QrCode,
  ArrowRight,
  Map,
  ChevronRight,
  MapPinPlus,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const locations = [
  {
    id: 1,
    title: "Zenith Boardroom",
    subtitle: "Level 03 · Room 304",
    status: "ACTIVE",
    tag: "CONFERENCE",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
    lastScan: "12 mins ago",
    capacity: "12 Persons",
    button: "Generate QR Code",
    glow: false,
  },
  {
    id: 2,
    title: "Main Reception Hub",
    subtitle: "Level 01 · Lobby A",
    status: "ACTIVE",
    tag: "ENTRY POINT",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    lastScan: "Just now",
    capacity: "3 AI Nodes",
    button: "Generate QR Code",
    glow: false,
  },
  {
    id: 3,
    title: "R&D Lab 02",
    subtitle: "Level 02 · Wing B",
    status: "REVIEW NEEDED",
    tag: "LAB",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    lastScan: "QR Link Broken",
    capacity: "LOC-RD-022",
    button: "Regenerate QR Code",
    glow: true,
  },
];

const DashLocations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

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
        <span className="text-white font-medium">Location Management</span>
      </div>

      {/* Main Content */}
      <div className="px-2 pt-2 pb-20 space-y-6 text-gray-200">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold">Location Hub</h1>
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {/* Card */}
          <div className="rounded-3xl border border-[#232542] bg-[#101225]/90 p-7 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs tracking-[2px] uppercase text-[#70739B]">
                  Total Service Points
                </p>

                <div className="flex items-end gap-2 mt-5">
                  <h2 className="text-5xl font-bold">142</h2>

                  <span className="text-[#2EF2A4] font-semibold mb-2">
                    ↗ +8
                  </span>
                </div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-[#171A31] flex items-center justify-center">
                <QrCode className="text-[#7A6CFF]" size={20} />
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-[#232542] bg-[#101225]/90 p-7 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs tracking-[2px] uppercase text-[#70739B]">
                  QR Coverage
                </p>

                <div className="flex items-end gap-2 mt-5">
                  <h2 className="text-5xl font-bold text-[#7B6CFF]">94.8%</h2>

                  <span className="text-[#2EF2A4] font-semibold mb-2">
                    Optimized
                  </span>
                </div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-[#171A31] flex items-center justify-center">
                <QrCode className="text-[#7A6CFF]" size={20} />
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-[#232542] bg-[#101225]/90 p-7 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs tracking-[2px] uppercase text-[#70739B]">
                  Active Scans (24H)
                </p>

                <div className="flex items-end gap-2 mt-5">
                  <h2 className="text-5xl font-bold">1,204</h2>

                  <span className="text-[#70739B] font-medium mb-2">
                    Across all floors
                  </span>
                </div>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-[#171A31] flex items-center justify-center">
                <QrCode className="text-[#7A6CFF]" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters + Search */}
        {/* <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mt-10">
          <div className="flex items-center flex-wrap gap-3">
            {[
              "All Facilities",
              "Level 01",
              "Level 02",
              "Level 03",
              "Exterior",
            ].map((item, index) => (
              <button
                key={index}
                className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all ${
                  index === 0
                    ? "bg-[#6D5EF7] text-white shadow-[0_0_25px_rgba(109,94,247,0.4)]"
                    : "bg-transparent text-[#A1A4C5] hover:bg-[#171A31]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="relative w-full xl:w-[340px]">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#74789D]"
              size={18}
            />

            <input
              type="text"
              placeholder="Search ID, name or floor..."
              className="w-full bg-[#0E1021] border border-[#242744] rounded-2xl pl-14 pr-5 py-4 outline-none text-white placeholder:text-[#666A91] focus:border-[#6D5EF7]"
            />
          </div>
        </div> */}

        {/* Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
          {locations.map((location) => (
            <div
              key={location.id}
              className={`rounded-[32px] overflow-hidden border ${
                location.glow
                  ? "border-[#6D5EF7] shadow-[0_0_40px_rgba(109,94,247,0.25)]"
                  : "border-[#232542]"
              } bg-[#101225]`}
            >
              {/* Image */}
              <div className="relative h-[230px] overflow-hidden">
                <img
                  src={location.image}
                  alt={location.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#101225] via-[#10122590] to-transparent"></div>

                <div className="absolute top-5 left-5 flex items-center gap-3">
                  <span
                    className={`text-[10px] px-3 py-1 rounded-full font-semibold tracking-wide ${
                      location.status === "ACTIVE"
                        ? "bg-[#1CD48F33] text-[#2EF2A4]"
                        : "bg-[#FFB02033] text-[#FFB020]"
                    }`}
                  >
                    {location.status}
                  </span>

                  <span className="text-[10px] px-3 py-1 rounded-full bg-[#7A6CFF33] text-[#A89BFF] font-semibold tracking-wide">
                    {location.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold leading-tight">
                      {location.title}
                    </h3>

                    <p className="text-[#8184A9] mt-2">{location.subtitle}</p>
                  </div>

                  <div className="flex items-center gap-3 mt-1">
                    <button className="text-[#7F83AB] hover:text-white transition-all">
                      <Pencil size={17} />
                    </button>

                    <button className="text-[#7F83AB] hover:text-red-400 transition-all">
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <div className="mt-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#73779D]">Last Scan</span>

                    <span
                      className={`font-medium ${
                        location.glow ? "text-[#FF9E42]" : "text-white"
                      }`}
                    >
                      {location.lastScan}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#73779D]">
                      {location.glow ? "Location ID" : "Capacity"}
                    </span>

                    <span className="font-medium text-white">
                      {location.capacity}
                    </span>
                  </div>
                </div>

                <button
                  className={`w-full mt-8 py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold transition-all ${
                    location.glow
                      ? "bg-[#7A6CFF] hover:bg-[#8B7EFF] text-white shadow-[0_0_25px_rgba(122,108,255,0.45)]"
                      : "bg-[#171A31] hover:bg-[#1B1F3C] text-[#8B80FF]"
                  }`}
                >
                  <QrCode size={18} />
                  {location.button}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-10 rounded-[34px] border border-[#232542] bg-[#101225] px-8 py-7 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#171A31] flex items-center justify-center">
              <Map className="text-[#7A6CFF]" size={28} />
            </div>

            <div>
              <h3 className="text-3xl font-bold">Interactive Floor Map</h3>

              <p className="text-[#8387AC] mt-2 text-lg">
                Visualize your coverage density across 42,000 sq. ft.
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-10">
            <div>
              <p className="text-[#74789E] uppercase tracking-[2px] text-xs">
                Floors
              </p>

              <h4 className="text-4xl font-bold mt-2">12</h4>
            </div>

            <div>
              <p className="text-[#74789E] uppercase tracking-[2px] text-xs">
                Active Qr
              </p>

              <h4 className="text-4xl font-bold mt-2">894</h4>
            </div>

            <div>
              <p className="text-[#74789E] uppercase tracking-[2px] text-xs">
                Uptime
              </p>

              <h4 className="text-4xl font-bold mt-2 text-[#2EF2A4]">99%</h4>
            </div>

            <button className="px-8 py-5 rounded-2xl bg-[#0E1021] border border-[#232542] hover:border-[#6D5EF7] flex items-center gap-4 transition-all">
              <span className="font-semibold">Open Map View</span>

              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashLocations;
