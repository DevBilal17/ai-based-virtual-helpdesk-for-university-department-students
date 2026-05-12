import React, { useEffect, useState, useRef } from "react";
import {
  CalendarDays,
  Bell,
  Search,
  Users,
  TimerReset,
  Star,
  Cpu,
  Files,
  HelpCircle,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../api/axios.js";
import {
  getDashboardDataStart,
  getDashboardDataSuccess,
  getDashboardDataFailure,
} from "../redux/slices/dashboardSlice.js";
import { toast } from "react-toastify";
import FullScreenLoader from "../components/common/FullScreenLoader.jsx";
import ConfirmModal from "../components/common/ConfirmModal.jsx";

// ================= COUNT UP COMPONENT =================
const CountUp = ({ end, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  const frameRef = useRef();

  useEffect(() => {
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);

      const currentValue = Math.floor(progress * end);

      setCount(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration]);

  return count;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { stats, dashboardDataLoading, dashboardDataError } = useSelector(
    (state) => state.dashboardData,
  );

  // ================= STATE =================
  const [routeLoading, setRouteLoading] = useState(false);

  // ================= FETCH DASHBOARD DATA =================
  const fetchDashboardData = async () => {
    try {
      dispatch(getDashboardDataStart());

      const res = await axios.get("/dashboard/dashboard-data");

      console.log("Fetched Dashboard Data:", res.data.data); // Debug log

      dispatch(getDashboardDataSuccess(res.data.data));
    } catch (error) {
      dispatch(
        getDashboardDataFailure(
          error.response?.data?.message || "Something went wrong",
        ),
      );
      toast.error(
        error.response?.data?.message || "Failed to fetch dashboard data",
      );
    }
  };

  // ================= ROUTE LOAD =================
  useEffect(() => {
    const run = async () => {
      if (location.pathname === "/dashboard") {
        setRouteLoading(true);
        await fetchDashboardData();
        setRouteLoading(false);
      }
    };
    run();
  }, [location.pathname]);

  // ================= SAFE STATS =================
  const totalUsers = stats?.totalUsers || 0;

  const totalStudents = stats?.totalStudents || 0;

  const totalFiles = stats?.totalFiles || 0;

  const totalFaqs = stats?.totalFaqs || 0;

  const totalActiveFaqs = stats?.totalActiveFaqs || 0;

  // ================= DUMMY STATS =================
  const analyticsCards = [
    {
      id: 1,
      title: "Total Interactions",
      value: "42,584",
      growth: "+15%",
      icon: <Users size={18} />,
      active: false,
    },
    {
      id: 2,
      title: "Total Students",
      value: totalStudents,
      subValue: totalUsers,
      growth: "+12%",
      icon: <Users size={18} />,
      active: false,
    },
    {
      id: 3,
      title: "Total Files Uploaded",
      value: totalFiles,
      growth: "+2%",
      icon: <Files size={18} />,
      active: false,
    },
    {
      id: 4,
      title: "Total Active FAQs",
      value: totalActiveFaqs,
      subValue: totalFaqs,
      growth: "ACTIVE",
      icon: <HelpCircle size={18} />,
      active: true,
    },
  ];

  // ================= CHART DATA =================
  const chartData = [
    { name: "OCT 01", value: 12 },
    { name: "OCT 05", value: 14 },
    { name: "OCT 10", value: 55 },
    { name: "OCT 15", value: 52 },
    { name: "OCT 20", value: 30 },
    { name: "OCT 25", value: 60 },
    { name: "OCT 31", value: 72 },
  ];

  // ================= POPULAR QUERIES =================
  const popularQueries = [
    {
      title: "Account Security",
      value: "8.2k",
      width: "82%",
    },
    {
      title: "Billing Inquiries",
      value: "6.4k",
      width: "64%",
    },
    {
      title: "Service Outages",
      value: "4.1k",
      width: "41%",
    },
    {
      title: "Policy Updates",
      value: "2.9k",
      width: "29%",
    },
    {
      title: "API Documentation",
      value: "1.2k",
      width: "12%",
    },
  ];

  // ================= LOADER =================
  if (routeLoading) return <FullScreenLoader />;

  // ================= ERROR =================
  if (dashboardDataError) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        {dashboardDataError}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white px-4 pt-3 pb-40">
      {/* ================= TOP BAR ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        {/* Left */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-wide">
            Analytics Dashboard
          </h1>

          <p className="text-sm text-gray-500">
            Real-time system health and interaction metrics
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Date */}
          <div className="flex items-center gap-2 bg-[#0f172a] border border-[#1F2937] px-4 py-2 rounded-lg text-sm text-gray-300">
            <CalendarDays size={16} />
            <span>Apr 01, 2026 - Apr 30, 2026</span>
          </div>

          {/* Notification */}
          <button className="w-10 h-10 rounded-lg bg-[#0f172a] border border-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white transition duration-200">
            <Bell size={17} />
          </button>

          {/* Search */}
          <button className="w-10 h-10 rounded-lg bg-[#0f172a] border border-[#1F2937] flex items-center justify-center text-gray-400 hover:text-white transition duration-200">
            <Search size={17} />
          </button>
        </div>
      </div>

      {/* ================= ANALYTICS CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {analyticsCards.map((card) => (
          <div
            key={card.id}
            className="relative overflow-hidden bg-[#0f172a] border border-[#1E293B] rounded-lg px-5 py-5 shadow-[0_0_30px_rgba(59,130,246,0.08)]"
          >
            {/* Top */}
            <div className="flex items-start justify-between mb-8">
              <div className="w-10 h-10 rounded-lg bg-[#1E1B4B] flex items-center justify-center text-cyan-400">
                {card.icon}
              </div>

              {card.active ? (
                <span className="text-[10px] uppercase tracking-widest bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-lg border border-cyan-500/20">
                  {card.growth}
                </span>
              ) : (
                <span className="text-xs text-cyan-400 font-medium">
                  ↗ {card.growth}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-400">{card.title}</p>

              <div className="flex items-end gap-1">
                <h2 className="text-4xl font-bold tracking-wide">
                  {typeof card.value === "number" ? (
                    <CountUp end={card.value} />
                  ) : (
                    card.value
                  )}
                </h2>

                {card.subValue !== undefined && (
                  <span className="text-gray-500 text-base mb-1">
                    /{" "}
                    {typeof card.subValue === "number" ? (
                      <CountUp end={card.subValue} />
                    ) : (
                      card.subValue
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Glow Line */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 via-cyan-400 to-cyan-500" />
          </div>
        ))}
      </div>

      {/* ================= MIDDLE SECTION ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-[2.1fr_1fr] gap-6">
        {/* ================= USER ACTIVITY ================= */}
        <div className="bg-[#0f172a] border border-[#1E293B] rounded-lg p-5 shadow-[0_0_30px_rgba(59,130,246,0.06)]">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-semibold">User Activity</h2>
              <p className="text-sm text-gray-500 mt-1">
                Daily query volume trends
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex items-center bg-[#111827] border border-[#1F2937] rounded-lg overflow-hidden w-fit">
              <button className="px-4 py-2 text-sm bg-indigo-600 text-white">
                Volume
              </button>

              <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition duration-200">
                Latency
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="activityGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6B7280", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #1F2937",
                    borderRadius: "12px",
                    color: "white",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#7C3AED"
                  strokeWidth={4}
                  fill="url(#activityGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= POPULAR QUERIES ================= */}
        <div className="bg-[#0f172a] border border-[#1E293B] rounded-lg p-5 shadow-[0_0_30px_rgba(59,130,246,0.06)] flex flex-col">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Popular Queries</h2>
            <p className="text-sm text-gray-500 mt-1">
              Most frequent intent categories
            </p>
          </div>

          {/* Query List */}
          <div className="flex flex-col gap-7 flex-1">
            {popularQueries.map((query, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">{query.title}</span>
                  <span className="text-indigo-400">{query.value}</span>
                </div>

                {/* Progress */}
                <div className="w-full h-[6px] rounded-full bg-[#111827] overflow-hidden">
                  <div
                    style={{ width: query.width }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Button */}
          <button className="mt-10 border border-[#243041] hover:border-indigo-500 hover:text-white transition duration-200 text-gray-400 rounded-lg py-3 text-sm tracking-wide uppercase">
            View All Query Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
