/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// components/myarea-components/widgets/AnalyticsChartWidget.jsx
import { useState, useRef } from "react"
import Chart from "react-apexcharts"
import { ChevronDown } from "lucide-react"

const tabs = [
  { name: "Appointments", icon: "📅" },
  { name: "Members", icon: "👥" },
  { name: "Leads", icon: "📊" },
  { name: "Finances", icon: "💰" },
]

// Mock data for the widget (you can replace with real data)
const analyticsData = {
  Appointments: {
    title: "Appointment Analytics",
    series: [
      {
        name: "Bookings",
        data: [12, 15, 18, 22, 19, 25, 28, 30, 27, 32, 35, 40]
      },
      {
        name: "Check-ins",
        data: [10, 12, 14, 18, 16, 20, 22, 25, 23, 28, 30, 35]
      }
    ],
    options: {
      chart: {
        type: "line",
        height: 300,
        toolbar: { show: false },
        background: "transparent",
      },
      colors: ["#FF6B1A", "#2E5BFF"],
      stroke: { curve: "smooth", width: 3 },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        labels: { style: { colors: "#999999", fontSize: "12px" } },
      },
      yaxis: {
        labels: { style: { colors: "#999999", fontSize: "12px" } },
      },
      grid: { borderColor: "#374151" },
      legend: { labels: { colors: "#9CA3AF" } },
    }
  },
  Members: {
    title: "Member Growth",
    series: [{ data: [120, 135, 148, 162, 179, 195, 210, 230, 245, 260, 280, 300] }],
    options: {
      chart: { type: "area", height: 300, toolbar: { show: false } },
      colors: ["#10B981"],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        labels: { style: { colors: "#999999" } },
      },
      yaxis: { labels: { style: { colors: "#999999" } } },
      grid: { borderColor: "#374151" },
    }
  },
  Leads: {
    title: "Leads Conversion",
    series: [
      { name: "New Leads", data: [45, 52, 38, 60, 48, 55, 62, 70, 65, 72, 68, 75] },
      { name: "Converted", data: [15, 18, 12, 22, 16, 20, 25, 28, 24, 30, 27, 32] }
    ],
    options: {
      chart: { type: "bar", height: 300, toolbar: { show: false } },
      colors: ["#3B82F6", "#10B981"],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        labels: { style: { colors: "#999999" } },
      },
      yaxis: { labels: { style: { colors: "#999999" } } },
      grid: { borderColor: "#374151" },
    }
  },
  Finances: {
    title: "Revenue Overview",
    series: [{ data: [12500, 13200, 11800, 14500, 13800, 15200, 16800, 17500, 16200, 18500, 19200, 21000] }],
    options: {
      chart: { type: "line", height: 300, toolbar: { show: false } },
      colors: ["#F59E0B"],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        labels: { style: { colors: "#999999" } },
      },
      yaxis: {
        labels: {
          style: { colors: "#999999" },
          formatter: (value) => `$${(value / 1000).toFixed(0)}k`
        },
      },
      grid: { borderColor: "#374151" },
    }
  }
}

const statisticOptions = {
  Appointments: ["Bookings Overview", "Check-in Rate", "Cancellation Rate"],
  Members: ["Growth Overview", "Retention Rate", "Activity Level"],
  Leads: ["Conversion Overview", "Lead Sources", "Follow-up Rate"],
  Finances: ["Revenue Overview", "Expense Tracking", "Profit Margin"]
}

export default function AnalyticsChartWidget({ isEditing, onRemove }) {
  const [activeTab, setActiveTab] = useState("Appointments")
  const [selectedStatistic, setSelectedStatistic] = useState("Bookings Overview")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentData = analyticsData[activeTab]
  const currentStats = statisticOptions[activeTab]

  return (
    <div className="space-y-4 p-4 rounded-xl bg-[#2F2F2F]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name)
                setSelectedStatistic(statisticOptions[tab.name][0])
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.name
                  ? "bg-blue-600 text-white"
                  : "bg-[#1F1F1F] text-gray-400 hover:bg-[#3F3F3F] hover:text-white"
              }`}
            >
              {/* <span>{tab.icon}</span> */}
              {tab.name}
            </button>
          ))}
        </div>

        <div className="relative md:mb-5 mb-0" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-[#1F1F1F] rounded-lg text-sm text-white hover:bg-[#3F3F3F] transition-colors"
          >
            {selectedStatistic}
            <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 mt-2 w-48 bg-[#2F2F2F] rounded-xl shadow-lg border border-gray-700">
              {currentStats.map((stat) => (
                <button
                  key={stat}
                  onClick={() => {
                    setSelectedStatistic(stat)
                    setIsDropdownOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3F3F3F] first:rounded-t-xl last:rounded-b-xl"
                >
                  {stat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Title */}
      <h3 className="text-lg font-semibold text-white text-center">
        {currentData.title}
      </h3>

      {/* Chart */}
      <div className="w-full">
        <Chart
          options={currentData.options}
          series={currentData.series}   
          type={currentData.options.chart.type}
          height={300}
        />
      </div>
    </div>
  )
}