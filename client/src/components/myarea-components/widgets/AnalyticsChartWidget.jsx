/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import Chart from "react-apexcharts"
import { FaCalendarAlt, FaDollarSign, FaUserPlus, FaUsers } from "react-icons/fa"

const tabs = [
  { name: "Appointments", icon: FaCalendarAlt },
  { name: "Members", icon: FaUsers },
  { name: "Leads", icon: FaUserPlus },
  { name: "Finances", icon: FaDollarSign },
] 

const appointmentsData = {
  totals: {
    bookings: 156,
    checkIns: 142,
    cancellations: 14,
    lateCancellations: 6,
    noShows: 8,
  },
  monthlyBreakdown: [
    { month: "Apr", bookings: 8, checkIns: 7, cancellations: 1, lateCancellations: 0, noShows: 0 },
    { month: "May", bookings: 12, checkIns: 11, cancellations: 1, lateCancellations: 0, noShows: 0 },
    { month: "Jun", bookings: 10, checkIns: 9, cancellations: 1, lateCancellations: 0, noShows: 0 },
    { month: "Jul", bookings: 15, checkIns: 14, cancellations: 1, lateCancellations: 0, noShows: 0 },
    { month: "Aug", bookings: 11, checkIns: 10, cancellations: 1, lateCancellations: 0, noShows: 0 },
    { month: "Sep", bookings: 9, checkIns: 8, cancellations: 1, lateCancellations: 0, noShows: 0 },
    { month: "Oct", bookings: 13, checkIns: 12, cancellations: 1, lateCancellations: 1, noShows: 0 },
    { month: "Nov", bookings: 14, checkIns: 13, cancellations: 1, lateCancellations: 0, noShows: 0 },
    { month: "Dec", bookings: 16, checkIns: 15, cancellations: 1, lateCancellations: 0, noShows: 1 },
  ],
  popularTimes: [
    { time: "6 AM", count: 2 },
    { time: "7 AM", count: 4 },
    { time: "8 AM", count: 5 },
    { time: "9 AM", count: 4 },
    { time: "10 AM", count: 3 },
    { time: "4 PM", count: 5 },
    { time: "5 PM", count: 4 },
    { time: "6 PM", count: 3 },
    { time: "7 PM", count: 2 },
  ],
}

// Sample data for members tab
const membersData = {
  totalMembers: 342,
  newFullMembers: [12, 15, 18, 22, 19, 25, 28, 30, 27],
  newTempMembers: [5, 8, 6, 9, 7, 10, 8, 11, 9],
  inactiveMembers: [3, 2, 4, 3, 5, 2, 4, 3, 2],
  pausedMembers: [1, 2, 1, 3, 2, 1, 2, 1, 3],
  membersByType: [
    { type: "Premium", count: 145 },
    { type: "Standard", count: 98 },
    { type: "Basic", count: 67 },
    { type: "Trial", count: 32 },
  ],
}

// Sample data for leads tab
const leadsData = {
  totalLeads: 89,
  monthlyData: [
    { month: "Apr", newLeads: 8, converted: 3, convertedPercent: 37.5 },
    { month: "May", newLeads: 12, converted: 5, convertedPercent: 41.7 },
    { month: "Jun", newLeads: 10, converted: 4, convertedPercent: 40.0 },
    { month: "Jul", newLeads: 15, converted: 7, convertedPercent: 46.7 },
    { month: "Aug", newLeads: 11, converted: 5, convertedPercent: 45.5 },
    { month: "Sep", newLeads: 9, converted: 3, convertedPercent: 33.3 },
    { month: "Oct", newLeads: 13, converted: 6, convertedPercent: 46.2 },
    { month: "Nov", newLeads: 14, converted: 7, convertedPercent: 50.0 },
    { month: "Dec", newLeads: 16, converted: 8, convertedPercent: 50.0 },
  ],
}

// Sample data for finances tab
const financesData = {
  totalRevenue: 45680,
  averageRevenuePerMember: 133.57,
  outstandingPayments: 2340,
  topServicesByRevenue: [
    { name: "Personal", revenue: 18500 },
    { name: "Group", revenue: 12300 },
    { name: "Nutrition", revenue: 8900 },
    { name: "Massage", revenue: 5980 },
  ],
  mostFrequentlySold: [
    { name: "Monthly", count: 245 },
    { name: "PT Session", count: 189 },
    { name: "Class Pass", count: 156 },
    { name: "Nutrition", count: 98 },
    { name: "Massage", count: 67 },
  ],
}

// Dropdown options for each tab
const dropdownOptions = {
  Appointments: [
    { value: "monthlyBreakdown", label: "Monthly Breakdown" },
    { value: "popularTimes", label: "Popular Times" },
  ],
  Members: [
    { value: "memberActivity", label: "Activity" },
    { value: "membersByType", label: "By Type" },
  ],
  Leads: [
    { value: "newVsConverted", label: "Leads vs Converted" },
    { value: "conversionRate", label: "Conversion Rate" },
  ],
  Finances: [
    { value: "topServices", label: "Top Services" },
    { value: "mostSold", label: "Most Sold" },
  ],
}

export default function AnalyticsChartWidget({ isEditing, onRemove }) {
  const [activeTab, setActiveTab] = useState("Appointments")
  const [selectedOption, setSelectedOption] = useState("monthlyBreakdown")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const dropdownRef = useRef(null)

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Chart configurations for each option
  const getChartConfig = () => {
    const baseOptions = {
      chart: {
        toolbar: { show: false },
        background: "transparent",
        fontFamily: "'Inter', sans-serif",
      },
      xaxis: {
        labels: { 
          style: { 
            colors: "#9CA3AF", 
            fontSize: isMobile ? "10px" : "12px" 
          } 
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: { 
          style: { 
            colors: "#9CA3AF", 
            fontSize: isMobile ? "10px" : "12px" 
          } 
        },
      },
      grid: { 
        borderColor: "#374151", 
        strokeDashArray: 3 
      },
      legend: {
        labels: { colors: "#9CA3AF" },
        position: isMobile ? "bottom" : "top",
        horizontalAlign: "center",
        itemMargin: { horizontal: isMobile ? 8 : 16 },
        fontSize: isMobile ? "11px" : "12px",
      },
      tooltip: { 
        theme: "dark",
        style: {
          fontSize: isMobile ? "11px" : "12px",
        }
      },
    }

    switch (activeTab) {
      case "Appointments":
        switch (selectedOption) {
          case "monthlyBreakdown":
            return {
              options: {
                ...baseOptions,
                chart: { ...baseOptions.chart, type: "line", height: isMobile ? 220 : 300 },
                colors: ["#10B981", "#3B82F6", "#EF4444", "#F59E0B", "#8B5CF6"],
                stroke: { curve: "smooth", width: isMobile ? 2 : 3 },
                xaxis: {
                  ...baseOptions.xaxis,
                  categories: appointmentsData.monthlyBreakdown.map((item) => item.month),
                },
                yaxis: {
                  ...baseOptions.yaxis,
                  min: 0,
                  max: 20,
                  tickAmount: isMobile ? 4 : 5,
                },
              },
              series: [
                { name: "Bookings", data: appointmentsData.monthlyBreakdown.map((item) => item.bookings) },
                { name: "Check-ins", data: appointmentsData.monthlyBreakdown.map((item) => item.checkIns) },
                { name: "Cancels", data: appointmentsData.monthlyBreakdown.map((item) => item.cancellations) },
                { name: "Late", data: appointmentsData.monthlyBreakdown.map((item) => item.lateCancellations) },
                { name: "No Shows", data: appointmentsData.monthlyBreakdown.map((item) => item.noShows) },
              ],
              type: "line",
            }
          case "popularTimes":
            return {
              options: {
                ...baseOptions,
                chart: { ...baseOptions.chart, type: "bar", height: isMobile ? 220 : 300 },
                colors: ["#10B981"],
                plotOptions: {
                  bar: { 
                    borderRadius: 6, 
                    columnWidth: isMobile ? "70%" : "60%",
                    horizontal: isMobile,
                  },
                },
                dataLabels: { enabled: false },
                xaxis: {
                  ...baseOptions.xaxis,
                  categories: isMobile 
                    ? appointmentsData.popularTimes.map((item) => item.time)
                    : appointmentsData.popularTimes.map((item) => item.time),
                  labels: { 
                    ...baseOptions.xaxis.labels,
                    rotate: isMobile ? 0 : -45,
                  },
                },
                yaxis: {
                  ...baseOptions.yaxis,
                  min: 0,
                  max: 6,
                  tickAmount: isMobile ? 4 : 6,
                },
              },
              series: [
                { name: "Bookings", data: appointmentsData.popularTimes.map((item) => item.count) },
              ],
              type: "bar",
            }
        }
        break

      case "Members":
        switch (selectedOption) {
          case "memberActivity":
            return {
              options: {
                ...baseOptions,
                chart: { ...baseOptions.chart, type: "line", height: isMobile ? 220 : 300 },
                colors: ["#10B981", "#3B82F6", "#EF4444", "#F59E0B"],
                stroke: { curve: "smooth", width: isMobile ? 2 : 3 },
                xaxis: {
                  ...baseOptions.xaxis,
                  categories: isMobile 
                    ? ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                    : ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                },
                yaxis: {
                  ...baseOptions.yaxis,
                  min: 0,
                },
              },
              series: [
                { name: "New Full", data: membersData.newFullMembers },
                { name: "New Temp", data: membersData.newTempMembers },
                { name: "Inactive", data: membersData.inactiveMembers },
                { name: "Paused", data: membersData.pausedMembers },
              ],
              type: "line",
            }
          case "membersByType":
            return {
              options: {
                ...baseOptions,
                chart: { ...baseOptions.chart, type: "donut", height: isMobile ? 220 : 300 },
                colors: ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"],
                labels: membersData.membersByType.map((item) => item.type),
                legend: { 
                  ...baseOptions.legend,
                  position: isMobile ? "bottom" : "right",
                },
                plotOptions: {
                  pie: {
                    donut: {
                      size: isMobile ? "55%" : "65%",
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: "Total",
                          color: "#9CA3AF",
                          fontSize: isMobile ? "14px" : "16px",
                          formatter: () => membersData.totalMembers.toString(),
                        },
                      },
                    },
                  },
                },
                dataLabels: { 
                  enabled: !isMobile,
                  style: { colors: ["#fff"], fontSize: isMobile ? "10px" : "12px" } 
                },
              },
              series: membersData.membersByType.map((item) => item.count),
              type: "donut",
            }
        }
        break

      case "Leads":
        switch (selectedOption) {
          case "newVsConverted":
            return {
              options: {
                ...baseOptions,
                chart: { ...baseOptions.chart, type: "bar", height: isMobile ? 220 : 300 },
                colors: ["#3B82F6", "#10B981"],
                plotOptions: {
                  bar: { 
                    borderRadius: 6, 
                    columnWidth: isMobile ? "70%" : "60%",
                  },
                },
                dataLabels: { enabled: false },
                xaxis: {
                  ...baseOptions.xaxis,
                  categories: leadsData.monthlyData.map((item) => item.month),
                },
                yaxis: {
                  ...baseOptions.yaxis,
                  min: 0,
                },
              },
              series: [
                { name: "New Leads", data: leadsData.monthlyData.map((item) => item.newLeads) },
                { name: "Converted", data: leadsData.monthlyData.map((item) => item.converted) },
              ],
              type: "bar",
            }
          case "conversionRate":
            return {
              options: {
                ...baseOptions,
                chart: { ...baseOptions.chart, type: "line", height: isMobile ? 220 : 300 },
                colors: ["#10B981"],
                stroke: { curve: "smooth", width: isMobile ? 2 : 3 },
                xaxis: {
                  ...baseOptions.xaxis,
                  categories: leadsData.monthlyData.map((item) => item.month),
                },
                yaxis: {
                  ...baseOptions.yaxis,
                  min: 0,
                  max: 100,
                  labels: {
                    ...baseOptions.yaxis.labels,
                    formatter: (value) => `${value}%`,
                  },
                },
              },
              series: [
                { name: "Rate", data: leadsData.monthlyData.map((item) => item.convertedPercent) },
              ],
              type: "line",
            }
        }
        break

      case "Finances":
        switch (selectedOption) {
          case "topServices":
            return {
              options: {
                ...baseOptions,
                chart: { ...baseOptions.chart, type: "bar", height: isMobile ? 220 : 300 },
                colors: ["#10B981"],
                plotOptions: {
                  bar: { 
                    borderRadius: 6, 
                    horizontal: isMobile,
                  },
                },
                dataLabels: { enabled: false },
                xaxis: {
                  ...baseOptions.xaxis,
                  categories: financesData.topServicesByRevenue.map((item) => item.name),
                  labels: {
                    ...baseOptions.xaxis.labels,
                    formatter: (value) => isMobile ? `$${(value/1000).toFixed(0)}k` : `$${value}`,
                  },
                },
                yaxis: {
                  ...baseOptions.yaxis,
                },
              },
              series: [
                { name: "Revenue", data: financesData.topServicesByRevenue.map((item) => item.revenue) },
              ],
              type: "bar",
            }
          case "mostSold":
            return {
              options: {
                ...baseOptions,
                chart: { ...baseOptions.chart, type: "bar", height: isMobile ? 220 : 300 },
                colors: ["#3B82F6"],
                plotOptions: {
                  bar: { 
                    borderRadius: 6, 
                    columnWidth: isMobile ? "70%" : "60%",
                    horizontal: isMobile,
                  },
                },
                dataLabels: { enabled: false },
                xaxis: {
                  ...baseOptions.xaxis,
                  categories: financesData.mostFrequentlySold.map((item) => item.name),
                  labels: {
                    ...baseOptions.xaxis.labels,
                    rotate: isMobile ? 0 : -45,
                  },
                },
                yaxis: {
                  ...baseOptions.yaxis,
                  min: 0,
                },
              },
              series: [
                { name: "Sold", data: financesData.mostFrequentlySold.map((item) => item.count) },
              ],
              type: "bar",
            }
        }
        break

      default:
        return {
          options: baseOptions,
          series: [],
          type: "line",
        }
    }
  }

  const chartConfig = getChartConfig()

  // Get stats for the current tab
  const getTabStats = () => {
    switch (activeTab) {
      case "Appointments":
        return [
          { label: isMobile ? "Bookings" : "Bookings", value: appointmentsData.totals.bookings },
          { label: isMobile ? "Check-ins" : "Check-ins", value: appointmentsData.totals.checkIns },
          { label: isMobile ? "Cancels" : "Cancellations", value: appointmentsData.totals.cancellations },
        ]
      case "Members":
        return [
          { label: isMobile ? "Total" : "Total Members", value: membersData.totalMembers },
          { label: isMobile ? "Premium" : "Premium", value: membersData.membersByType[0].count },
          { label: isMobile ? "Standard" : "Standard", value: membersData.membersByType[1].count },
        ]
      case "Leads":
        return [
          { label: isMobile ? "Leads" : "Total Leads", value: leadsData.totalLeads },
          { label: isMobile ? "Rate" : "Conversion", value: "45.5%" },
          { label: isMobile ? "This Month" : "This Month", value: leadsData.monthlyData[8].newLeads },
        ]
      case "Finances":
        return [
          { 
            label: isMobile ? "Revenue" : "Revenue", 
            value: isMobile 
              ? `$${(financesData.totalRevenue/1000).toFixed(0)}k` 
              : `$${financesData.totalRevenue.toLocaleString()}` 
          },
          { 
            label: isMobile ? "Avg/Member" : "Avg/Member", 
            value: `$${financesData.averageRevenuePerMember.toFixed(isMobile ? 0 : 2)}` 
          },
          { 
            label: isMobile ? "Outstanding" : "Outstanding", 
            value: isMobile 
              ? `$${(financesData.outstandingPayments/1000).toFixed(0)}k` 
              : `$${financesData.outstandingPayments.toLocaleString()}` 
          },
        ]
      default:
        return []
    }
  }

  return (
    <div className="p-3 sm:p-4 bg-[#2F2F2F] rounded-xl">
      {/* Header with Remove button in edit mode */}
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold">Analytics</h2>
        {/* {isEditing && (
          <button
            onClick={onRemove}
            className="px-2 py-1 text-xs sm:text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg"
          >
            {isMobile ? "Remove" : "Remove Widget"}
          </button>
        )} */}
      </div>

      {/* Tabs - Scrollable on mobile */}
      <div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto pb-2 custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => {
              setActiveTab(tab.name)
              setSelectedOption(dropdownOptions[tab.name][0].value)
            }}
            className={`flex items-center gap-1 ml-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.name
                ? "bg-blue-600 text-white scale-105"
                : "bg-[#3f3e3e] text-gray-400 hover:bg-[#3F3F3F] hover:text-white"
            }`}
          >
            <span className="text-xs sm:text-sm">{tab.icon}</span>
            <span className={isMobile && tab.name.length > 8 ? "truncate max-w-[60px]" : ""}>
              {isMobile && tab.name === "Appointments" ? "Appts" : 
               isMobile && tab.name === "Finances" ? "Finance" : tab.name}
            </span>
          </button>
        ))}
      </div>

      {/* Stats Summary - Responsive grid */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        {getTabStats().map((stat, index) => (
          <div key={index} className="bg-black rounded-lg p-2 sm:p-3 text-center">
            <div className="text-sm sm:text-lg font-bold text-white truncate" title={stat.value}>
              {stat.value}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-400 truncate" title={stat.label}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Dropdown for chart options */}
      <div className="relative mb-3 sm:mb-4" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between w-full px-3 py-2 bg-black rounded-lg text-white text-xs sm:text-sm"
        >
          <span className="truncate mr-2">
            {dropdownOptions[activeTab].find(opt => opt.value === selectedOption)?.label}
          </span>
          <svg
            className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-[#2F2F2F] rounded-lg shadow-lg border border-gray-700">
            {dropdownOptions[activeTab].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setSelectedOption(option.value)
                  setIsDropdownOpen(false)
                }}
                className={`block w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-black first:rounded-t-lg last:rounded-b-lg ${
                  selectedOption === option.value ? "text-blue-400 bg-black/50" : "text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart Container with responsive height */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[280px]">
          <Chart
            options={chartConfig.options}
            series={chartConfig.series}
            type={chartConfig.type}
            height={chartConfig.options.chart.height}
          />
        </div>
      </div>

    </div>
  )
}