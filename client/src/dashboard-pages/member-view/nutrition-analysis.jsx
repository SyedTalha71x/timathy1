/* eslint-disable react/no-unescaped-entities */

/* eslint-disable no-unused-vars */

import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Info,
  Plus,
  Download,
  ArrowBigDown,
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
  Line,
  Legend,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

import Image5 from "../../../public/nutrition-analysis-images/droplets.svg";
import Image6 from "../../../public/nutrition-analysis-images/lightbulb.svg";
import Image7 from "../../../public/nutrition-analysis-images/triangle-alert.svg";
import { MdNoMeals, MdOutlineKeyboardArrowDown, MdWarning } from "react-icons/md";
import { CiCircleCheck, CiStar } from "react-icons/ci";
import { LuLeaf } from "react-icons/lu";

import { micronutrients } from "../../utils/member-panel-states/nutrition-analysis-states";

import Action1 from "../../../public/nutrition-analysis-images/Image.svg";
import Action2 from "../../../public/nutrition-analysis-images/Image (1).svg";
import Action3 from "../../../public/nutrition-analysis-images/Image (2).svg";

import Veg1 from "../../../public/nutrition-analysis-images/vegetables-pictures/Image.svg";
import Veg2 from "../../../public/nutrition-analysis-images/vegetables-pictures/Image (1).svg";
import Veg3 from "../../../public/nutrition-analysis-images/vegetables-pictures/Image (2).svg";
import Veg4 from "../../../public/nutrition-analysis-images/vegetables-pictures/Image (3).svg";

const NutritionDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'vitamins', 'minerals', 'critical'

  const caloricData = [
    { day: "M", calories: 1800 },
    { day: "T", calories: 2200 },
    { day: "W", calories: 1950 },
    { day: "T", calories: 2400 },
    { day: "F", calories: 1850 },
    { day: "S", calories: 2100 },
    { day: "S", calories: 2300 },
  ];

  const trendData = [
    { date: "OCT 01", actual: 1650, target: 2000 },
    { date: "OCT 07", actual: 2150, target: 2000 },
    { date: "OCT 14", actual: 2100, target: 2000 },
    { date: "OCT 15", actual: 2100, target: 2000 },
    { date: "OCT 16", actual: 2100, target: 2000 },
    { date: "OCT 17", actual: 2100, target: 2000 },
    { date: "OCT 18", actual: 2100, target: 2000 },
    { date: "OCT 19", actual: 2100, target: 2000 },
    { date: "OCT 20", actual: 2100, target: 2000 },
  ];

  const weeklyMacroData = [
    { day: "Mon", protein: 110, carbs: 180, fat: 55 },
    { day: "Tue", protein: 125, carbs: 210, fat: 62 },
    { day: "Wed", protein: 115, carbs: 195, fat: 58 },
    { day: "Thu", protein: 130, carbs: 220, fat: 65 },
    { day: "Fri", protein: 120, carbs: 200, fat: 60 },
    { day: "Sat", protein: 135, carbs: 230, fat: 70 },
    { day: "Sun", protein: 125, carbs: 215, fat: 63 },
  ];

  // Filter nutrients based on active filter
  const filteredNutrients = useMemo(() => {
    if (activeFilter === "all") return micronutrients;
    if (activeFilter === "vitamins")
      return micronutrients.filter((n) => n.type === "vitamin");
    if (activeFilter === "minerals")
      return micronutrients.filter((n) => n.type === "mineral");
    if (activeFilter === "critical")
      return micronutrients.filter((n) => n.critical);
    return micronutrients;
  }, [activeFilter]);

  // Calculate percentage for progress bar (no percentage text shown)
  const calculatePercentage = (nutrient) => {
    const { current, targetMin, targetMax } = nutrient;
    const targetRange = targetMax - targetMin;
    const normalizedValue = Math.max(
      0,
      Math.min(100, ((current - targetMin) / targetRange) * 100),
    );
    return normalizedValue;
  };

  // Filter vitamins and minerals separately for the original sections
  const filteredVitamins = filteredNutrients.filter(
    (n) => n.type === "vitamin",
  );
  const filteredMinerals = filteredNutrients.filter(
    (n) => n.type === "mineral",
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#212121] rounded-lg p-6 ">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-sm font-medium">
                    Total Calories
                  </h3>
                  <div className="text-orange-500">
                    <img src={Image4 || "/placeholder.svg"} alt="" />
                  </div>
                </div>
                <div className="text-3xl text-white font-bold oxanium_font mb-2">
                  2,150 kcal
                </div>
                <div className="text-sm text-white">Target: 2,500 kcal</div>
              </div>

              <div className="bg-[#212121] rounded-lg p-6 ">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-sm font-medium">
                    Protein Intake
                  </h3>
                  <div className="text-orange-500">
                    <img src={Image2 || "/placeholder.svg"} alt="" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white oxanium_font mb-2">
                  120 g
                </div>
                <div className="text-sm text-white">Target: 100 g</div>
              </div>

              <div className="bg-[#212121] rounded-lg p-6 ">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-sm font-medium">
                    Carb Intake
                  </h3>
                  <div className="text-orange-500">
                    <img src={Image1 || "/placeholder.svg"} alt="" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white oxanium_font mb-2">
                  220 g
                </div>
                <div className="text-sm text-white">Target: 70 g</div>
              </div>

              <div className="bg-[#212121] rounded-lg p-6 ">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-sm font-medium">Fat Intake</h3>
                  <div className="text-orange-500">
                    <img src={Image3 || "/placeholder.svg"} alt="" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white oxanium_font mb-2">
                  75 g
                </div>
                <div className="text-sm text-white">Target: 60 g</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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

              <div className="col-span-1 grid grid-cols-1 gap-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#212121] rounded-2xl p-6">
                <div className="flex items-center  gap-2 mb-4">
                  <h3 className="text-white text-2xl font-bold">
                    Total Calories
                  </h3>
                </div>

                <div className="flex items-center md:flex-row flex-col mt-8 justify-center  mb-6 gap-4">
                  <div className="relative w-36 h-36">
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
                      <span className="text-2xl font-bold text-white">84%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-center mb-4">
                      <div className="text-white">
                        Total Calories
                        <Info size={16} className="inline ml-2 text-blue-500" />
                      </div>
                      <div className="text-3xl font-bold text-white">1,850</div>
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

              <div className="bg-[#212121] rounded-2xl p-6">
                <h3 className="text-white text-2xl font-bold mb-4">
                  Quick Macro Summary
                </h3>
                <div className="space-y-4 mt-8">
                  <div>
                    <div className="flex justify-between items-center mb-1">
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
                  <div>
                    <div className="flex justify-between items-center mb-1">
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
                  <div>
                    <div className="flex justify-between items-center mb-1">
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

              <div className="bg-[#212121] rounded-2xl p-6">
                <h3 className="text-white text-2xl font-bold mb-4">
                  Daily Caloric Intake
                </h3>
                <div className="h-48">
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

              <div className="hidden md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-gray-500 font-medium py-3">
                        DATE
                      </th>
                      <th className="text-left text-gray-500 font-medium py-3">
                        CALORIES
                      </th>
                      <th className="text-left text-gray-500 font-medium py-3">
                        MACROS (P/C/F)
                      </th>
                      <th className="text-left text-gray-500 font-medium py-3">
                        FIBER
                      </th>
                      <th className="text-left text-gray-500 font-medium py-3">
                        STATUS
                      </th>
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
                      <span className="text-gray-300 text-sm">
                        {item.calories}
                      </span>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400 text-xs">Macros</span>
                      <span className="text-gray-300 text-sm">
                        {item.macros}
                      </span>
                    </div>

                    <div className="flex justify-between mb-3">
                      <span className="text-gray-400 text-xs">Fiber</span>
                      <span className="text-gray-300 text-sm">
                        {item.fiber}
                      </span>
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
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#212121] rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-sm font-medium">
                    AVG DAILY INTAKE
                  </h3>
                  <Info size={16} className="text-blue-500" />
                </div>
                <div className="text-3xl text-white font-bold oxanium_font mb-2">
                  2,140 kcal
                </div>
                <div className="text-sm text-[#C83C51] flex items-center">
                  <TrendingUp size={16} className="mr-1" />
                  vs 2% vs last month
                </div>
              </div>

              <div className="bg-[#212121] rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-sm font-medium">
                    TARGET VARIANCE
                  </h3>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
                <div className="text-3xl font-bold text-[#6155F5] oxanium_font mb-2">
                  +4.2%
                </div>
                <div className="text-sm text-[#6155F5]">
                  Within optimal range
                </div>
              </div>

              <div className="bg-[#212121] rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-sm font-medium">
                    DAYS WITHIN GOAL
                  </h3>
                  <AlertCircle size={16} className="text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white oxanium_font mb-2">
                  18/30
                </div>
                <div className="text-sm text-[#6155F5] flex items-center">
                  <TrendingUp size={16} className="mr-1" />
                  ≈+2 days vs last period
                </div>
              </div>
            </div>

            <div className="bg-[#212121] rounded-lg p-6">
              <div className="mb-6">
                <p className="text-gray-200 text-sm">OVERALL STATUS:</p>
                <h3 className="text-white text-2xl mt-1 font-bold">
                  Nutrition Score:
                </h3>
              </div>

              {/* Scroll container */}
              <div className="w-full overflow-x-auto">
                {/* Fixed / min width chart wrapper */}
                <div className="min-w-[700px] h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={trendData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#3B82F6"
                        strokeOpacity={0.2}
                        horizontal
                        vertical={false}
                      />

                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                        domain={[0, 2200]}
                        ticks={[0, 550, 1100, 1650, 2200]}
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

                      <ReferenceLine
                        y={2000}
                        stroke="#EF4444"
                        strokeDasharray="3 3"
                        label="Daily Target (2,000)"
                      />

                      <Bar
                        dataKey="actual"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                        name="Actual Intake"
                      />
                      <Bar
                        dataKey="target"
                        fill="#EF4444"
                        fillOpacity={0.3}
                        radius={[4, 4, 0, 0]}
                        name="Daily Target (2,000)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#212121] rounded-lg p-6">
                <h3 className="text-white text-xl font-bold mb-4">
                  Insights & Recommendations
                </h3>

                <div className="space-y-4">
                  <div className="p-3 bg-[#6155F51A] rounded-lg">
                    <div className="flex items-start mb-2">
                      <AlertCircle
                        size={16}
                        className="text-yellow-500 mr-2 mt-0.5"
                      />
                      <h4 className="text-white font-medium">Goal Alert</h4>
                    </div>
                    <p className="text-gray-300 text-sm">
                      You are exceeding your calorie target on most days (12 of
                      the last 14 days). Your average surplus is 140 kcal.
                    </p>
                  </div>

                  <div className="p-3 bg-[#6155F51A] rounded-lg">
                    <div className="flex items-start mb-2">
                      <TrendingUp
                        size={16}
                        className="text-blue-500 mr-2 mt-0.5"
                      />
                      <h4 className="text-white font-medium">Weekend Trend</h4>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Your intake peaks on Fridays and Saturdays. Consider
                      planning a consistent meal prep routine on Thursday
                      evenings to stay on track.
                    </p>
                  </div>

                  <div className="p-3 bg-[#6155F51A] rounded-lg">
                    <div className="flex items-start mb-2">
                      <CheckCircle
                        size={16}
                        className="text-green-500 mr-2 mt-0.5"
                      />
                      <h4 className="text-white font-medium">Activity Match</h4>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Your protein intake is within levels on Tuesday and
                      Wednesday. Keep it up!
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#212121] rounded-lg p-6">
                <h3 className="text-white text-xl font-bold mb-6">
                  Macro Distribution
                </h3>

                <div className="space-y-4 mt-12">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-300 text-sm">Protein</span>
                      <span className="text-white text-sm font-medium">
                        120g <span className="text-gray-400"></span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(120 / 150) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-300 text-sm">
                        Carbohydrates
                      </span>
                      <span className="text-white text-sm font-medium">
                        200g <span className="text-gray-400"></span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(200 / 250) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-300 text-sm">Fats</span>
                      <span className="text-white text-sm font-medium">
                        60g <span className="text-gray-400"></span>
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

                <div className="mt-8 w-full flex justify-center">
                  <button className="bg-blue-500 text-sm w-full text-center hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                    Detailed Macro Breakdown
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case "macro breakdown":
        return (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex md:flex-row flex-col gap-2 justify-between items-start">
                <div>
                  <h2 className="text-3xl text-white font-bold mb-2">
                    Macronutrient Breakdown
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Real-time analysis of your daily energy distribution and
                    goals.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("micronutrient status")}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg"
                >
                  MACRONUTRIENT DETAILS
                </button>
              </div>
            </div>

            {/* Daily Distribution & Target Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Daily Distribution - Pie Chart */}
              <div className="lg:col-span-1 bg-[#212121] rounded-lg p-6">
                <h3 className="text-white text-xl font-bold mb-6">
                  Daily Distribution
                </h3>
                <div className="flex flex-col items-center">
                  <div className="h-56 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Protein", value: 285 },
                            { name: "Carbs", value: 455 },
                            { name: "Fat", value: 200 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          <Cell fill="#6366F1" />
                          <Cell fill="#8B5CF6" />
                          <Cell fill="#EC4899" />
                        </Pie>
                        <Tooltip formatter={(value) => `${value}g`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-4">
                    <div className="text-gray-200 text-xs uppercase tracking-wide mb-1">
                      Total Intake
                    </div>
                    <div className="text-5xl font-bold text-white">2,140</div>
                    <div className="text-gray-200 text-sm">kcal</div>
                  </div>
                  <div className="flex gap-4 mt-30 flex-wrap gap-10 justify-center">
                    <div className="text-center">
                      <div className="w-3 h-3 bg-[#2AA24C] rounded-full mx-auto mb-1"></div>
                      <div className="text-gray-200 text-sm">Protein (285)</div>
                      <div className="text-sm text-gray-400">134g logged</div>
                    </div>
                    <div className="text-center">
                      <div className="w-3 h-3 bg-[#4285F4] rounded-full mx-auto mb-1"></div>
                      <div className="text-gray-200 text-sm">Carbs (455)</div>
                      <div className="text-sm text-gray-400">134g logged</div>
                    </div>
                    <div className="text-center">
                      <div className="w-3 h-3 bg-[#FFB914] rounded-full mx-auto mb-1"></div>
                      <div className="text-gray-200 text-sm">Fat (26%)</div>
                      <div className="text-sm text-gray-400">134g logged</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2   ">
                <div className="rounded-lg p-6 bg-[#212121]">
                  <h3 className="text-white text-xl font-bold mb-6">
                    Target Progress
                  </h3>
                  <div className="space-y-6">
                    {/* Protein Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm font-medium">
                          PROTEIN
                        </span>
                        <span className="text-white text-sm">
                          158g <span className="text-gray-400">/ 180g</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full"
                          style={{ width: "87.8%" }}
                        ></div>
                      </div>
                      <div className="flex justify-end text-sm mt-3 text-[#6B7280]">
                        74% of daily goal
                      </div>
                    </div>

                    {/* Carbs Progress */}
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm font-medium">
                          CARBS
                        </span>
                        <span className="text-white text-sm">
                          241g <span className="text-gray-400">/ 250g</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: "96.4%" }}
                        ></div>
                      </div>
                      <div className="flex justify-end text-sm mt-3 text-[#EF4444]">
                        Limit exceeded (+7%)
                      </div>
                    </div>

                    {/* Fats Progress */}
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm font-medium">
                          FATS
                        </span>
                        <span className="text-white text-sm">
                          71g <span className="text-gray-400">/ 77g</span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-pink-500 h-2 rounded-full"
                          style={{ width: "92.2%" }}
                        ></div>
                      </div>
                      <div className="flex justify-end text-sm mt-3 text-[#FACC15]">
                        Nearly reached (95%)
                      </div>
                    </div>
                  </div>
                </div>
                {/* Smart Insights */}
                <div className=" mt-3">
                  <h3 className="text-white text-xl font-bold mb-4">
                    Smart Insights
                  </h3>
                  <div className="grid grid-cols-1  gap-4">
                    {/* Protein Deficiency */}
                    <div className="bg-[#6155F54D] border border-indigo-900 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#105826] flex items-center justify-center flex-shrink-0 mt-1">
                          <img src={Image6} alt="" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-md mb-1">
                            Protein Deficiency
                          </h4>
                          <p className="text-gray-300 text-sm">
                            You're 46g short of your protein goal. Consider
                            adding a Greek yogurt snack to hit your target.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* High Carb Density */}
                    <div className="bg-[#6155F54D] border border-purple-900 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#5F1E8A80] flex items-center justify-center flex-shrink-0 mt-1">
                          <img src={Image7} alt="" />{" "}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-md mb-1">
                            High Carb Density
                          </h4>
                          <p className="text-gray-300 text-sm">
                            Your lunch was high in simple sugars. Opt for
                            complex carbs like quinoa for stable energy levels
                            tomorrow.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Hydration Sync */}
                    <div className="bg-[#6155F54D] border border-cyan-900 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#6B728080] flex items-center justify-center flex-shrink-0 mt-1">
                          <img src={Image5} alt="" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-md mb-1">
                            Hydration Sync
                          </h4>
                          <p className="text-gray-300 text-sm">
                            Connect your smart water bottle to see how hydration
                            impacts your macro absorption.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

   <div className="bg-[#212121] rounded-lg p-6">
  <div className="flex md:justify-between md:flex-row flex-col justify-start  md:items-center items-start gap-2 mb-6">
    <div>
      <h3 className="text-white text-xl font-bold">
        Weekly Macro Trends
      </h3>
      <p className="text-sm text-gray-400 mt-2">
        Comparison of intake across the last 7 days
      </p>
    </div>
    <span className="text-green-500 text-xs font-semibold">
      ON TRACK
    </span>
  </div>

  {/* 👇 Scroll wrapper */}
  <div className="w-full overflow-x-auto">
    {/* 👇 min-width forces horizontal scroll on small screens */}
    <div className="min-w-[700px] h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={weeklyMacroData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorProtein" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="colorCarbs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>

            <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#3B82F6"
            strokeOpacity={0.2}
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
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "6px",
              color: "white",
            }}
            formatter={(value) => `${value}g`}
          />

          <Area
            type="monotone"
            dataKey="protein"
            stroke="#6366F1"
            fill="url(#colorProtein)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="carbs"
            stroke="#8B5CF6"
            fill="url(#colorCarbs)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="fat"
            stroke="#EC4899"
            fill="url(#colorFat)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

          </>
        );
      case "micronutrient status":
        return (
          <>
            <div className="mb-8">
              <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
                <div>
                  <h2 className="text-3xl text-white font-bold mb-2">
                    Micronutrient Status
                  </h2>
                  <p className="text-gray-300 text-sm">
                    Real-time tracking of essential vitamins and minerals from
                    your latest lab results.
                  </p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg whitespace-nowrap">
                  DOWNLOAD REPORT
                </button>
              </div>
            </div>

            {/* Stats Cards - UNCHANGED */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {/* Adequate Status */}
              <div className="bg-[#212121] rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-gray-400 text-sm">Adequate Status</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  12 Nutrients
                </div>
                <p className="text-gray-200 text-sm">
                  since last month↑ <span className="text-[#6155F5]">+2%</span>
                </p>
              </div>

              {/* Low Status */}
              <div className="bg-[#212121] rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-gray-400 text-sm">Low Status</h3>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  3 Nutrients
                </div>
                <p className="text-gray-200 text-sm">
                  needs attention↓ <span className="text-[#EA1E1A]">-1%</span>
                </p>
              </div>

              {/* Last Lab Update */}
              <div className="bg-[#212121] rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-gray-400 text-sm">Last Lab Update</h3>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  Oct 24, 2023
                </div>
                <p className="text-gray-200 text-sm">
                  Next lab recommended: Jan 2024
                </p>
              </div>
            </div>

            {/* Filter Buttons - NOW FUNCTIONAL */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveFilter("all")}
                className={`text-xs font-bold py-2 px-3 rounded-lg ${
                  activeFilter === "all"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-[#000000] border border-slate-200/40 text-gray-300"
                }`}
              >
                All Nutrients
              </button>
              <button
                onClick={() => setActiveFilter("vitamins")}
                className={`text-xs font-bold py-2 px-3 rounded-lg ${
                  activeFilter === "vitamins"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-[#000000] border border-slate-200/40 text-gray-300"
                }`}
              >
                Vitamins
              </button>
              <button
                onClick={() => setActiveFilter("minerals")}
                className={`text-xs font-bold py-2 px-3 rounded-lg ${
                  activeFilter === "minerals"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-[#000000] border border-slate-200/40 text-gray-300"
                }`}
              >
                Minerals
              </button>
              <button
                onClick={() => setActiveFilter("critical")}
                className={`text-xs font-bold py-2 px-3 rounded-lg flex items-center gap-1 ${
                  activeFilter === "critical"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-[#000000] border border-slate-200/40 text-gray-300"
                }`}
              >
                <MdWarning />
                Critical Only
              </button>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-gray-400 text-xs">Sort by Status</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>

            {/* Vitamins Section - With filters */}
            {filteredVitamins.length > 0 && (
              <div className="mb-8">
                <h3 className="text-white text-xl font-bold mb-4">Vitamins</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVitamins.map((nutrient) => (
                    <div
                      key={nutrient.id}
                      className="bg-[#212121] rounded-lg p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-[#75C2771A] flex items-center justify-center text-white text-sm">
                            <img
                              src={nutrient.icon}
                              alt={nutrient.name}
                              className="w-6 h-6"
                            />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm">
                              {nutrient.name}
                            </h4>
                            <p className="text-gray-200 text-xs">
                              {nutrient.scientificName}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`${
                            nutrient.status === "adequate"
                              ? "bg-[#6155F5] text-black text-xs font-medium py-1 px-2 rounded-xl"
                              : "text-white text-xs py-1 px-2 rounded"
                          }`}
                        >
                          {nutrient.status === "adequate" ? "ADEQUATE" : "LOW"}
                        </span>
                      </div>

                      {/* Current and Target variables ABOVE the bar */}
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="text-gray-400 text-sm">
                            Current:
                          </span>
                          <span className="text-white ml-2 font-medium text-sm">
                            {nutrient.current} {nutrient.unit}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Target:</span>
                          <span className="text-white ml-2 font-medium text-sm">
                            {nutrient.targetMin}-{nutrient.targetMax}
                          </span>
                        </div>
                      </div>

                      {/* Blue Progress Bar BELOW the variables - NO percentage text */}
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${calculatePercentage(nutrient)}%` }}
                        />
                      </div>

                      <p className="text-gray-200 italic text-sm mt-2">
                        "{nutrient.description}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Minerals Section - With filters */}
            {filteredMinerals.length > 0 && (
              <div className="mb-8">
                <h3 className="text-white text-xl font-bold mb-4">Minerals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMinerals.map((nutrient) => (
                    <div
                      key={nutrient.id}
                      className="bg-[#212121] rounded-lg p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-[#75C2771A] flex items-center justify-center text-white text-sm">
                            <img
                              src={nutrient.icon}
                              alt={nutrient.name}
                              className="w-6 h-6"
                            />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm">
                              {nutrient.name}
                            </h4>
                            <p className="text-gray-200 text-xs">
                              {nutrient.scientificName}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`${
                            nutrient.status === "adequate"
                              ? "bg-[#6155F5] text-black text-xs font-medium py-1 px-2 rounded-xl"
                              : "text-white text-xs py-1 px-2 rounded"
                          }`}
                        >
                          {nutrient.status === "adequate" ? "ADEQUATE" : "LOW"}
                        </span>
                      </div>

                      {/* Current and Target variables ABOVE the bar */}
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="text-gray-400 text-sm">
                            Current:
                          </span>
                          <span className="text-white ml-2 font-medium text-sm">
                            {nutrient.current} {nutrient.unit}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Target:</span>
                          <span className="text-white ml-2 font-medium text-sm">
                            {nutrient.targetMin}-{nutrient.targetMax}
                          </span>
                        </div>
                      </div>

                      {/* Blue Progress Bar BELOW the variables - NO percentage text */}
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${calculatePercentage(nutrient)}%` }}
                        />
                      </div>

                      <p className="text-gray-200 italic text-sm mt-2">
                        "{nutrient.description}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show message when no nutrients match filter */}
            {filteredNutrients.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No nutrients match the selected filter.
              </div>
            )}

            {/* Recommendation Bar - UNCHANGED */}
            <div className="bg-[#212121] rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#6155F5] flex items-center justify-center flex-shrink-0 text-white font-bold">
                  <MdNoMeals />
                </div>
                <p className="text-gray-300 text-sm">
                  Based on your low Iron and Vitamin B12, we recommend
                  increasing leafy greens, legumes, and lean proteins this week.
                </p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg whitespace-nowrap">
                UPDATE MEAL PLAN
              </button>
            </div>

            {/* Footer - UNCHANGED */}
            <div className="text-center text-gray-600 text-xs mt-6">
              © 2023 NutriAnalytics. All health data is encrypted and HIPAA
              compliant.
            </div>
          </>
        );
      case "recommendation":
        return (
          <>
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl text-white font-bold mb-2">
                Actionable Recommendations
              </h2>
              <p className="text-gray-300 text-sm">
                You're doing great, Alex!{" "}
                <span className="text-[#388E3C]">5-day streak</span> maintained.
                Here's how to level up today.
              </p>
            </div>

            {/* Top 3 Improvement Suggestions */}
            <div className="mb-8">
              <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                <CiStar className="text-green-500" size={26} />
                Top 3 Improvement Suggestions
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1 */}
                <div className="bg-[#212121] rounded-xl overflow-hidden">
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={Action3}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <span className="bg-[#6155F5] text-white text-xs font-medium py-1 px-3 rounded-full">
                      HIGH PRIORITY
                    </span>

                    <h4 className="text-white mt-3 font-bold text-xl">
                      Increase Hydration
                    </h4>

                    <p className="text-[#DFE2DF] text-sm mt-2 mb-4">
                      Drink 500ml more water before 2 PM.
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="text-[#6155F5] text-xs font-semibold">
                        +11% Health Score
                      </div>
                      <Info size={18} className="text-[#6155F5]" />
                    </div>
                  </div>
                </div>

                {/* Card 2 (Center - unchanged style) */}
                <div className="bg-[#212121] rounded-xl overflow-hidden">
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={Action2}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <span className="bg-[#6155F5] text-white text-xs font-medium py-1 px-3 rounded-full">
                      DAILY TARGET
                    </span>

                    <h4 className="text-white mt-3 font-bold text-xl">
                      Boost Fiber Intake
                    </h4>

                    <p className="text-[#DFE2DF] text-sm mt-2 mb-4">
                      Add fiber-rich food to your next meal.
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="text-[#6155F5] text-xs font-semibold">
                        +8% Digestion
                      </div>
                      <Info size={18} className="text-[#6155F5]" />
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-[#212121] rounded-xl overflow-hidden">
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={Action1}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <span className="bg-[#6155F5] text-white text-xs font-medium py-1 px-3 rounded-full">
                      EVENING ROUTINE
                    </span>

                    <h4 className="text-white mt-3 font-bold text-xl">
                      Optimize Sleep Window
                    </h4>

                    <p className="text-[#DFE2DF] text-sm mt-2 mb-4">
                      Move bedtime 30 minutes earlier tonight.
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="text-[#6155F5] text-xs font-semibold">
                        +15% Energy
                      </div>
                      <Info size={18} className="text-[#6155F5]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Food Suggestions */}
            <div className="mb-8">
              <div className="flex md:flex-row flex-col gap-2 justify-between items-center mb-4">
                <h3 className="text-white text-lg font-bold flex items-center gap-2">
                  <span>
                    <LuLeaf className="text-green-500" size={26} />
                  </span>{" "}
                  Simple Food Suggestions
                </h3>
                <a
                  href="#"
                  className="text-blue-500 text-xs font-semibold hover:text-blue-400"
                >
                  See all foods →
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {/* Lentils */}
                <div className="bg-[#212121] rounded-lg overflow-hidden text-center">
                  <div className="h-24 flex items-center justify-center">
                    <img src={Veg1} alt="" />
                  </div>
                  <div className="p-3">
                    <h4 className="text-white font-bold text-sm mb-1">
                      Lentils
                    </h4>
                    <p className="text-gray-200 text-sm mb-2">
                      High protein target
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 flex justify-center items-center gap-2 text-white text-xs  py-2 px-2 rounded w-full">
                      <Plus size={18} /> LOG THIS
                    </button>
                  </div>
                </div>

                {/* Walnuts */}
                <div className="bg-[#212121] rounded-lg overflow-hidden text-center">
                  <div className="h-24 flex items-center justify-center">
                    <img src={Veg2} alt="" />
                  </div>
                  <div className="p-3">
                    <h4 className="text-white font-bold text-sm mb-1">
                      Walnuts
                    </h4>
                    <p className="text-gray-400 text-sm mb-2">Omega 3 boost</p>
                    <button className="bg-blue-600 hover:bg-blue-700 flex justify-center items-center gap-2 text-white text-xs  py-2 px-2 rounded w-full">
                      <Plus size={18} /> LOG THIS
                    </button>
                  </div>
                </div>

                {/* Spinach */}
                <div className="bg-[#212121] rounded-lg overflow-hidden text-center">
                  <div className="h-24 flex items-center justify-center">
                    <img src={Veg3} alt="" />
                  </div>
                  <div className="p-3">
                    <h4 className="text-white font-bold text-sm mb-1">
                      Spinach
                    </h4>
                    <p className="text-gray-200 text-sm mb-2">
                      Iron & Magnesium
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 flex justify-center items-center gap-2 text-white text-xs  py-2 px-2 rounded w-full">
                      <Plus size={18} /> LOG THIS
                    </button>
                  </div>
                </div>

                {/* Blueberries */}
                <div className="bg-[#212121] rounded-lg overflow-hidden text-center">
                  <div className="h-24 flex items-center justify-center">
                    <img src={Veg4} alt="" />
                  </div>
                  <div className="p-3">
                    <h4 className="text-white font-bold text-sm mb-1">
                      Blueberries
                    </h4>
                    <p className="text-gray-200 text-sm mb-2">
                      Antioxidant-rich
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 flex justify-center items-center gap-2 text-white text-xs  py-2 px-2 rounded w-full">
                      <Plus size={18} /> LOG THIS
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Quick Wins */}
            <div className="mb-8">
              <h3 className="text-white text-lg font-bold mb-2 flex items-center gap-2">
                <span>
                  <CiCircleCheck size={24} className="text-green-500" />
                </span>{" "}
                Daily Quick Wins
              </h3>
              <p className="text-gray-200 text-md mb-4">
                Small actions with a big impact
              </p>
              <div className="space-y-3">
                {/* Sunlight Exposure */}
                <div className="bg-[#212121] rounded-lg p-4 flex items-start gap-3">
                  <input type="checkbox" className="mt-1 cursor-pointer" />
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm">
                      Sunlight Exposure
                    </h4>
                    <p className="text-gray-200 text-xs mt-1">
                      Get 10 minutes of morning sun to regulate circadian
                      rhythm.
                    </p>
                  </div>
                  <span className="text-blue-500 text-xs font-semibold">
                    +8 pts
                  </span>
                </div>

                {/* Posture Reset */}
                <div className="bg-[#212121] rounded-lg p-4 flex items-start gap-3">
                  <input type="checkbox" className="mt-1 cursor-pointer" />
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm">
                      Posture Reset
                    </h4>
                    <p className="text-gray-200 text-xs mt-1">
                      Do 2 stretches every hour while working.
                    </p>
                  </div>
                  <span className="text-blue-500 text-xs font-semibold">
                    +5 pts
                  </span>
                </div>

                {/* Gym Climb - Completed */}
                <div className="bg-[#212121] rounded-lg p-4 flex items-start gap-3 opacity-60">
                  <input
                    type="checkbox"
                    className="mt-1 cursor-pointer"
                    checked
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm line-through">
                      Gym Climb
                    </h4>
                    <p className="text-gray-200 text-xs mt-1">
                      Track the climb instead of the elevation.
                    </p>
                  </div>
                  <span className="text-green-500 text-xs font-semibold">
                    COMPLETED
                  </span>
                </div>
              </div>
            </div>
          </>
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
      <header className="border-b border-gray-800 px-4 sm:px-6 py-4 flex justify-between items-center">
        <h1 className="text-white oxanium_font text-xl md:text-2xl">
          Nutrition Analysis Dashboard
        </h1>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-pink-400 flex items-center justify-center">
          <span className="text-xs font-bold"></span>
        </div>
      </header>

<div className="border-b border-gray-800 mt-6 px-4 sm:px-6">
  {/* Main wrapper */}
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

    {/* Tabs */}
    <div className="flex gap-4 sm:gap-8 overflow-x-auto scrollbar-hide">
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
        )
      )}
    </div>

    {/* Actions */}
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <button className="bg-blue-600 text-white text-sm py-2 px-5 rounded-md flex items-center justify-center gap-2">
        30D
        <MdOutlineKeyboardArrowDown size={18} />
      </button>

      <button className="bg-blue-600 text-white text-sm py-2 px-5 rounded-md flex items-center justify-center gap-2">
        <Download size={18} />
        Export Report
      </button>
    </div>

  </div>
</div>


      <div className="p-4 sm:p-6 max-w-7xl mx-auto">{renderTabContent()}</div>
    </div>
  );
};

export default NutritionDashboard;
