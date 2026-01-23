/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import {
  ChevronDown,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Info,
} from "lucide-react";
import Image1 from "../../../public/nutrition-analysis-images/carrot.svg";
import Image2 from "../../../public/nutrition-analysis-images/egg.svg";
import Image3 from "../../../public/nutrition-analysis-images/leafy-green.svg";
import Image4 from "../../../public/nutrition-analysis-images/utensils.svg";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const NutritionDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data for the Daily Caloric Intake chart
  const caloricData = [
    { day: "M", calories: 1800 },
    { day: "T", calories: 2200 },
    { day: "W", calories: 1950 },
    { day: "T", calories: 2400 },
    { day: "F", calories: 1850 },
    { day: "S", calories: 2100 },
    { day: "S", calories: 2300 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            {/* Metric Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Total Calories */}
              <div className="bg-[#212121] rounded-lg p-6 ">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-sm font-medium">
                    Total Calories
                  </h3>
                  <div className="text-orange-500">
                    <img src={Image4} alt="" />
                  </div>
                </div>
                <div className="text-3xl text-white font-bold oxanium_font mb-2">
                  2,150 kcal
                </div>
                <div className="text-sm text-white">Target: 2,500 kcal</div>
              </div>

              {/* Protein Intake */}
              <div className="bg-[#212121] rounded-lg p-6 ">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-sm font-medium">
                    Protein Intake
                  </h3>
                  <div className="text-orange-500">
                    <img src={Image2} alt="" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white oxanium_font mb-2">
                  120 g
                </div>
                <div className="text-sm text-white">Target: 100 g</div>
              </div>

              {/* Carb Intake */}
              <div className="bg-[#212121] rounded-lg p-6 ">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-sm font-medium">
                    Carb Intake
                  </h3>
                  <div className="text-orange-500">
                    <img src={Image1} alt="" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white oxanium_font mb-2">
                  220 g
                </div>
                <div className="text-sm text-white">Target: 70 g</div>
              </div>

              {/* Fat Intake */}
              <div className="bg-[#212121] rounded-lg p-6 ">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-sm font-medium">Fat Intake</h3>
                  <div className="text-orange-500">
                    <img src={Image3} alt="" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white oxanium_font mb-2">
                  75 g
                </div>
                <div className="text-sm text-white">Target: 60 g</div>
              </div>
            </div>

            {/* Overall Status and Daily Goal Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Left: Nutrition Score */}
              <div className="lg:col-span-2 bg-[#212121] rounded-lg p-6 ">
                <div className="flex items-center gap-1">
                  <h3 className="text-gray-200 text-sm font-semibold uppercase ">
                    Overall Status
                  </h3>
                  <Info size={16} className=" text-blue-500" />
                </div>

                <h2 className="text-3xl text-white font-bold mb-2 mt-2">
                  Nutrition Score:
                </h2>

                <div className=" mb-4 text-5xl font-bold text-white">
                  <span className="text-blue-500">88</span>/100
                </div>

                <p className="text-gray-200 md:w-86 w-full text-sm mb-4">
                  Your performance this week is{" "}
                  <span className="text-white font-extrabold">12% higher</span>{" "}
                  than your average. You exceeded dietary intake in{" "}
                  <span className="font-semibold">2 meals</span>.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button className="bg-blue-600 rounded-2xl hover:bg-blue-700 text-white text-sm font-bold py-2 px-6 cursor-pointer ">
                    OPTIMAL RANGE
                  </button>
                  <button className="border border-gray-600 rounded-2xl hover:border-gray-500 text-white text-sm font-bold py-2 px-6 cursor-pointer ">
                    HELP CONSISTENCY
                  </button>
                </div>
              </div>

              {/* Middle: Nutrition Score and charts section */}
              <div className="col-span-1 grid grid-cols-1 gap-6">
                {/* Daily Goal Reached */}
                <div className="bg-[#212121] rounded-2xl p-6 ">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-white text-2xl font-bold uppercase">
                      Daily Goal Reached
                    </h3>
                    <AlertCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex items-center mt-6">
                    <span className="text-7xl font-bold text-blue-500">6</span>
                    <span className="text-7xl font-bold  text-white ">/7</span>
                  </div>
                  <p className="text-gray-200 text-sm mt-7">
                    Days hitting calorie target
                  </p>
                  <div className="w-full bg-gray-800 rounded-full h-1 mt-4">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "85.7%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section - Updated to match screenshot */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Total Calories - Reduced height */}
              <div className="bg-[#212121] rounded-2xl p-6">
                <div className="flex items-center  gap-2 mb-4">
                  <h3 className="text-white text-2xl font-bold">
                    Total Calories
                  </h3>
                </div>

                <div className="flex items-center md:flex-row flex-col mt-8 justify-center  mb-6 gap-4">
                  <div className="relative w-36 h-36">
                    {" "}
                    {/* Reduced from w-36 h-36 */}
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 120 120"
                    >
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#2c2e56ff"
                        strokeWidth="12"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#4740afff"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(84 / 100) * 2 * Math.PI * 54} ${2 * Math.PI * 54}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-2xl font-bold text-white">84%</span>{" "}
                      {/* Reduced from text-3xl */}
                    </div>
                  </div>
                  <div>
                    <div className="text-center mb-4">
                      <div className="text-white">
                        Total Calories
                        <Info size={16} className="inline ml-2 text-blue-500" />
                      </div>
                      <div className="text-3xl font-bold text-white">1,850</div>{" "}
                      {/* Reduced from text-4xl */}
                      <div className="text-gray-300 mt-2 text-sm">
                        of 2,200 kcal target
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-1 text-blue-500 text-sm">
                      <TrendingUp size={16} />
                      <span>2% vs prev. week</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Macro Summary - Reduced height */}
              <div className="bg-[#212121] rounded-2xl p-6">
                <h3 className="text-white text-2xl font-bold mb-4">
                  Quick Macro Summary
                </h3>{" "}
                {/* Reduced margin */}
                <div className="space-y-4 mt-8">
                  {" "}
                  {/* Reduced from space-y-6 */}
                  {/* Protein */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      {" "}
                      {/* Reduced margin */}
                      <span className="text-gray-300 text-sm">Protein</span>
                      <span className="text-white text-sm font-medium">
                        120g <span className="text-gray-400">/ 150g</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(120 / 150) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  {/* Carbs */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      {" "}
                      {/* Reduced margin */}
                      <span className="text-gray-300 text-sm">Carbs</span>
                      <span className="text-white text-sm font-medium">
                        200g <span className="text-gray-400">/ 250g</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(200 / 250) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  {/* Fat */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      {" "}
                      {/* Reduced margin */}
                      <span className="text-gray-300 text-sm">Fats</span>
                      <span className="text-white text-sm font-medium">
                        60g <span className="text-gray-400">/ 70g</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${(60 / 70) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Caloric Intake - Reduced height */}
              <div className="bg-[#212121] rounded-2xl p-6">
                <h3 className="text-white text-2xl font-bold mb-4">
                  Daily Caloric Intake
                </h3>{" "}
                {/* Reduced margin */}
                <div className="h-48">
                  {" "}
                  {/* Reduced from h-64 */}
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={caloricData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#3B82F6"
                        strokeOpacity={0.2}
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        domain={[1500, 2500]}
                        ticks={[1500, 2000, 2500]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "6px",
                          color: "white",
                        }}
                        formatter={(value) => [`${value} kcal`, "Calories"]}
                      />
                      <Bar
                        dataKey="calories"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Weekly Log Summary */}
           <div className="bg-[#212121] rounded-lg p-4 md:p-6">
  <div className="flex justify-between items-center mb-6">
    <h3 className="text-2xl text-white font-bold">
      Weekly Log Summary
    </h3>
    <a
      href="#"
      className="text-green-500 text-xs font-semibold hover:text-blue-400"
    >
      VIEW FULL LOG
    </a>
  </div>

  {/* ===== DESKTOP TABLE ===== */}
  <div className="hidden md:block">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-800">
          <th className="text-left text-gray-500 font-medium py-3">DATE</th>
          <th className="text-left text-gray-500 font-medium py-3">CALORIES</th>
          <th className="text-left text-gray-500 font-medium py-3">
            MACROS (P/C/F)
          </th>
          <th className="text-left text-gray-500 font-medium py-3">FIBER</th>
          <th className="text-left text-gray-500 font-medium py-3">STATUS</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-gray-800">
          <td className="py-3 text-gray-300">Oct 7, 2025</td>
          <td className="py-3 text-gray-300">2,100 kcal</td>
          <td className="py-3 text-gray-300">115g / 200g / 70g</td>
          <td className="py-3 text-gray-300">28g</td>
          <td className="py-3">
            <span className="text-yellow-200 bg-[#0D350D] px-2 py-1 rounded-md text-xs font-semibold">
              HIT TARGET
            </span>
          </td>
        </tr>

        <tr className="border-b border-gray-800">
          <td className="py-3 text-gray-300">Oct 6, 2025</td>
          <td className="py-3 text-gray-300">2,350 kcal</td>
          <td className="py-3 text-gray-300">125g / 220g / 85g</td>
          <td className="py-3 text-gray-300">30g</td>
          <td className="py-3">
            <span className="text-yellow-200 bg-[#0D350D] px-2 py-1 rounded-md text-xs font-semibold">
              HIT TARGET
            </span>
          </td>
        </tr>

        <tr>
          <td className="py-3 text-gray-300">Oct 5, 2025</td>
          <td className="py-3 text-gray-300">2,300 kcal</td>
          <td className="py-3 text-gray-300">140g / 280g / 75g</td>
          <td className="py-3 text-gray-300">25g</td>
          <td className="py-3">
            <span className="text-yellow-200 bg-[#4A1313] px-2 py-1 rounded-md text-xs font-semibold">
              OVER TARGET
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* ===== MOBILE CARDS ===== */}
  <div className="space-y-4 md:hidden">
    {[
      {
        date: "Oct 7, 2025",
        calories: "2,100 kcal",
        macros: "115g / 200g / 70g",
        fiber: "28g",
        status: "HIT TARGET",
        statusBg: "bg-[#0D350D]",
      },
      {
        date: "Oct 6, 2025",
        calories: "2,350 kcal",
        macros: "125g / 220g / 85g",
        fiber: "30g",
        status: "HIT TARGET",
        statusBg: "bg-[#0D350D]",
      },
      {
        date: "Oct 5, 2025",
        calories: "2,300 kcal",
        macros: "140g / 280g / 75g",
        fiber: "25g",
        status: "OVER TARGET",
        statusBg: "bg-[#4A1313]",
      },
    ].map((item, i) => (
      <div
        key={i}
        className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800"
      >
        <div className="flex justify-between mb-2">
          <span className="text-gray-400 text-xs">Date</span>
          <span className="text-gray-300 text-sm">{item.date}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span className="text-gray-400 text-xs">Calories</span>
          <span className="text-gray-300 text-sm">{item.calories}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span className="text-gray-400 text-xs">Macros</span>
          <span className="text-gray-300 text-sm">{item.macros}</span>
        </div>

        <div className="flex justify-between mb-3">
          <span className="text-gray-400 text-xs">Fiber</span>
          <span className="text-gray-300 text-sm">{item.fiber}</span>
        </div>

        <span
          className={`inline-block text-yellow-200 ${item.statusBg} px-3 py-1 rounded-md text-xs font-semibold`}
        >
          {item.status}
        </span>
      </div>
    ))}
  </div>
</div>

          </>
        );
      case "trends":
      case "macro breakdown":
      case "recommendation":
        return (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4 capitalize">
                {activeTab} Page
              </h2>
              <p className="text-gray-400">
                The design for this section is coming soon!
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Currently viewing the {activeTab} tab
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-20">
            <p className="text-gray-400">Select a tab to view content</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1C1C]">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 sm:px-6 py-4 flex justify-between items-center">
        <h1 className="text-white oxanium_font text-xl md:text-2xl">
          Nutrition Analysis Dashboard
        </h1>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center">
          <span className="text-xs font-bold"></span>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800 mt-6 px-4 sm:px-6">
        <div className="flex gap-4 sm:gap-8 overflow-x-auto">
          {["Dashboard", "Trends", "Macro Breakdown", "Recommendation"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-1 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.toLowerCase()
                    ? "border-blue-500 text-white"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">{renderTabContent()}</div>
    </div>
  );
};

export default NutritionDashboard;
