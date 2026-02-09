/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"
import Chart from "react-apexcharts"
import { 
  ChevronLeft, 
  ChevronRight,
  CalendarDays,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  Users,
  UserPlus,
  DollarSign,
  CreditCard,
  TrendingUp
} from "lucide-react"

// âœ… Import shared data from analytics-states
import {
  tabs,
  appointmentsData,
  membersData,
  leadsData,
  financesData,
  getMonthlyBreakdownChartConfig,
  getPopularTimesChartConfig,
  getMemberActivityChartConfig,
  getMembersByTypeChartConfig,
  getLeadsChartConfig,
  getConversionRateChartConfig,
  getTopServicesByRevenueChartConfig,
  getMostFrequentlySoldChartConfig,
} from "../../../utils/studio-states/analytics-states"

// âœ… Extended dropdown options - Full scope like Analytics menu
const dropdownOptions = {
  Appointments: [
    { value: "overview", label: "Overview", type: "stats" },
    { value: "monthlyBreakdown", label: "Monthly Breakdown", type: "chart" },
    { value: "popularTimes", label: "Popular Times", type: "chart" },
  ],
  Members: [
    { value: "overview", label: "Overview", type: "stats" },
    { value: "memberActivity", label: "Member Activity", type: "chart" },
    { value: "membersByType", label: "Members by Type", type: "chart" },
  ],
  Leads: [
    { value: "overview", label: "Overview", type: "stats" },
    { value: "newVsConverted", label: "New Leads & Converted", type: "chart" },
    { value: "conversionRate", label: "Conversion Rate", type: "chart" },
  ],
  Finances: [
    { value: "overview", label: "Overview", type: "stats" },
    { value: "topServices", label: "Top Services by Revenue", type: "chart" },
    { value: "mostSold", label: "Most Frequently Sold", type: "chart" },
  ],
}

// âœ… Mini Stat Card Component for Overview
const MiniStatCard = ({ title, value, icon: Icon, iconBg, iconColor, change, isMobile }) => {
  const isPositive = change > 0
  const isNeutral = change === 0 || change === undefined

  return (
    <div className="bg-black rounded-lg p-2 sm:p-3">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 sm:p-2 ${iconBg} rounded-lg flex-shrink-0`}>
          <Icon size={isMobile ? 14 : 16} className={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm sm:text-base font-bold text-white truncate">
              {value}
            </span>
            {!isNeutral && (
              <span className={`text-[10px] ${isPositive ? "text-green-400" : "text-red-400"}`}>
                {isPositive ? "â†‘" : "â†“"}{Math.abs(change)}%
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 truncate">{title}</p>
        </div>
      </div>
    </div>
  )
}

// âœ… Hero Stat Card for Members/Leads Overview
const HeroStatCard = ({ title, value, icon: Icon, change, isMobile }) => {
  return (
    <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 bg-blue-500/20 rounded-xl">
            <Icon size={isMobile ? 20 : 24} className="text-blue-400" />
          </div>
          <div>
            <p className="text-blue-300 text-[10px] sm:text-xs">{title}</p>
            <div className="text-2xl sm:text-3xl font-bold text-white">{value}</div>
          </div>
        </div>
        {change && (
          <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-lg">
            <TrendingUp className="text-green-400" size={14} />
            <span className="text-green-400 text-xs font-semibold">+{change}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AnalyticsChartWidget({ isEditing, onRemove }) {
  const [activeTab, setActiveTab] = useState("Members")
  const [selectedOption, setSelectedOption] = useState("memberActivity")
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

  // âœ… Navigate to previous/next option
  const navigateOption = (direction) => {
    const options = dropdownOptions[activeTab]
    const currentIndex = options.findIndex(opt => opt.value === selectedOption)
    let newIndex = currentIndex + direction
    
    if (newIndex < 0) newIndex = options.length - 1
    if (newIndex >= options.length) newIndex = 0
    
    setSelectedOption(options[newIndex].value)
  }

  // âœ… Get chart configuration
  const getChartConfig = () => {
    const widgetHeight = isMobile ? 200 : 260

    const widgetOverrides = {
      chart: {
        height: widgetHeight,
        toolbar: { show: false },
      },
      legend: {
        position: isMobile ? "bottom" : "top",
        fontSize: isMobile ? "9px" : "10px",
        itemMargin: { horizontal: isMobile ? 4 : 8 },
      },
      stroke: {
        width: isMobile ? 2 : 2.5,
      },
    }

    switch (activeTab) {
      case "Appointments":
        switch (selectedOption) {
          case "monthlyBreakdown": {
            const config = getMonthlyBreakdownChartConfig()
            return {
              options: {
                ...config.options,
                chart: { ...config.options.chart, ...widgetOverrides.chart },
                legend: { ...config.options.legend, ...widgetOverrides.legend },
                stroke: { ...config.options.stroke, ...widgetOverrides.stroke },
              },
              series: config.series,
              type: "line",
            }
          }
          case "popularTimes": {
            const config = getPopularTimesChartConfig()
            return {
              options: {
                ...config.options,
                chart: { ...config.options.chart, ...widgetOverrides.chart },
                plotOptions: {
                  bar: { borderRadius: 4, columnWidth: isMobile ? "70%" : "60%" },
                },
              },
              series: config.series,
              type: "bar",
            }
          }
        }
        break

      case "Members":
        switch (selectedOption) {
          case "memberActivity": {
            const config = getMemberActivityChartConfig()
            return {
              options: {
                ...config.options,
                chart: { ...config.options.chart, ...widgetOverrides.chart },
                legend: { ...config.options.legend, ...widgetOverrides.legend },
                stroke: { ...config.options.stroke, ...widgetOverrides.stroke },
              },
              series: config.series,
              type: "line",
            }
          }
          case "membersByType": {
            const config = getMembersByTypeChartConfig()
            return {
              options: {
                ...config.options,
                chart: { ...config.options.chart, ...widgetOverrides.chart },
                legend: { 
                  ...config.options.legend,
                  position: "bottom",
                  fontSize: isMobile ? "9px" : "10px",
                },
                plotOptions: {
                  pie: {
                    donut: {
                      size: "55%",
                      labels: {
                        show: true,
                        total: {
                          show: true,
                          label: "Total",
                          color: "#9CA3AF",
                          fontSize: isMobile ? "11px" : "12px",
                          formatter: () => membersData.totalMembers.toString(),
                        },
                      },
                    },
                  },
                },
                dataLabels: { enabled: false },
              },
              series: config.series,
              type: "donut",
            }
          }
        }
        break

      case "Leads":
        switch (selectedOption) {
          case "newVsConverted": {
            const config = getLeadsChartConfig()
            return {
              options: {
                ...config.options,
                chart: { ...config.options.chart, ...widgetOverrides.chart },
                legend: { ...config.options.legend, ...widgetOverrides.legend },
                plotOptions: {
                  bar: { borderRadius: 4, columnWidth: isMobile ? "70%" : "60%" },
                },
              },
              series: config.series,
              type: "bar",
            }
          }
          case "conversionRate": {
            const config = getConversionRateChartConfig()
            return {
              options: {
                ...config.options,
                chart: { ...config.options.chart, ...widgetOverrides.chart },
                stroke: { ...config.options.stroke, ...widgetOverrides.stroke },
              },
              series: config.series,
              type: "line",
            }
          }
        }
        break

      case "Finances":
        switch (selectedOption) {
          case "topServices": {
            const config = getTopServicesByRevenueChartConfig()
            return {
              options: {
                ...config.options,
                chart: { ...config.options.chart, ...widgetOverrides.chart },
                plotOptions: {
                  bar: { borderRadius: 4, horizontal: true },
                },
              },
              series: config.series,
              type: "bar",
            }
          }
          case "mostSold": {
            const config = getMostFrequentlySoldChartConfig()
            return {
              options: {
                ...config.options,
                chart: { ...config.options.chart, ...widgetOverrides.chart },
                plotOptions: {
                  bar: { borderRadius: 4, columnWidth: isMobile ? "70%" : "60%" },
                },
              },
              series: config.series,
              type: "bar",
            }
          }
        }
        break
    }
    return null
  }

  // âœ… Render Overview Stats based on active tab
  const renderOverviewStats = () => {
    switch (activeTab) {
      case "Appointments":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <MiniStatCard
              title="Bookings"
              value={appointmentsData.totals.bookings}
              icon={CalendarDays}
              iconBg="bg-blue-500/20"
              iconColor="text-blue-400"
              change={12}
              isMobile={isMobile}
            />
            <MiniStatCard
              title="Check-ins"
              value={appointmentsData.totals.checkIns}
              icon={UserCheck}
              iconBg="bg-green-500/20"
              iconColor="text-green-400"
              change={8}
              isMobile={isMobile}
            />
            <MiniStatCard
              title="Cancellations"
              value={appointmentsData.totals.cancellations}
              icon={UserX}
              iconBg="bg-red-500/20"
              iconColor="text-red-400"
              change={-15}
              isMobile={isMobile}
            />
            <MiniStatCard
              title="Late Cancels"
              value={appointmentsData.totals.lateCancellations}
              icon={Clock}
              iconBg="bg-yellow-500/20"
              iconColor="text-yellow-400"
              isMobile={isMobile}
            />
            <MiniStatCard
              title="No Shows"
              value={appointmentsData.totals.noShows}
              icon={AlertCircle}
              iconBg="bg-orange-500/20"
              iconColor="text-orange-400"
              isMobile={isMobile}
            />
          </div>
        )

      case "Members":
        return (
          <div className="space-y-3">
            <HeroStatCard
              title="Total Members"
              value={membersData.totalMembers}
              icon={Users}
              change={18}
              isMobile={isMobile}
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {membersData.membersByType.map((type, index) => (
                <div key={type.type} className="bg-black rounded-lg p-2 text-center">
                  <div className="text-sm sm:text-base font-bold text-white">{type.count}</div>
                  <div className="text-[10px] sm:text-xs text-gray-400">{type.type}</div>
                </div>
              ))}
            </div>
          </div>
        )

      case "Leads":
        const avgConversion = (
          leadsData.monthlyData.reduce((sum, m) => sum + m.convertedPercent, 0) / 
          leadsData.monthlyData.length
        ).toFixed(1)
        const lastMonth = leadsData.monthlyData[leadsData.monthlyData.length - 1]
        const totalConverted = leadsData.monthlyData.reduce((sum, m) => sum + m.converted, 0)

        return (
          <div className="space-y-3">
            <HeroStatCard
              title="Total Leads"
              value={leadsData.totalLeads}
              icon={UserPlus}
              change={24}
              isMobile={isMobile}
            />
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-black rounded-lg p-2 text-center">
                <div className="text-sm sm:text-base font-bold text-green-400">{totalConverted}</div>
                <div className="text-[10px] sm:text-xs text-gray-400">Converted</div>
              </div>
              <div className="bg-black rounded-lg p-2 text-center">
                <div className="text-sm sm:text-base font-bold text-blue-400">{avgConversion}%</div>
                <div className="text-[10px] sm:text-xs text-gray-400">Avg Rate</div>
              </div>
              <div className="bg-black rounded-lg p-2 text-center">
                <div className="text-sm sm:text-base font-bold text-white">{lastMonth.newLeads}</div>
                <div className="text-[10px] sm:text-xs text-gray-400">This Month</div>
              </div>
            </div>
          </div>
        )

      case "Finances":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <MiniStatCard
              title="Total Revenue"
              value={`$${financesData.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              iconBg="bg-green-500/20"
              iconColor="text-green-400"
              change={22}
              isMobile={isMobile}
            />
            <MiniStatCard
              title="Avg/Member"
              value={`$${financesData.averageRevenuePerMember.toFixed(0)}`}
              icon={CreditCard}
              iconBg="bg-blue-500/20"
              iconColor="text-blue-400"
              change={5}
              isMobile={isMobile}
            />
            <MiniStatCard
              title="Outstanding"
              value={`$${financesData.outstandingPayments.toLocaleString()}`}
              icon={AlertCircle}
              iconBg="bg-red-500/20"
              iconColor="text-red-400"
              change={-8}
              isMobile={isMobile}
            />
          </div>
        )

      default:
        return null
    }
  }

  const chartConfig = getChartConfig()
  const currentOptionIndex = dropdownOptions[activeTab].findIndex(opt => opt.value === selectedOption)
  const currentOption = dropdownOptions[activeTab][currentOptionIndex]

  return (
    <div className="p-3 sm:p-4 bg-[#2F2F2F] rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base sm:text-lg font-semibold">Analytics</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 mb-3 overflow-x-auto pb-2 custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => {
              setActiveTab(tab.name)
              setSelectedOption("overview")
            }}
            className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.name
                ? "bg-blue-600 text-white"
                : "bg-[#3f3e3e] text-gray-400 hover:bg-[#3F3F3F] hover:text-white"
            }`}
          >
            <tab.icon className="text-xs sm:text-sm" />
            <span>
              {isMobile && tab.name === "Appointments" ? "Appts" : 
               isMobile && tab.name === "Finances" ? "Finance" : tab.name}
            </span>
          </button>
        ))}
      </div>

      {/* View Selector with Navigation Arrows */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => navigateOption(-1)}
          className="p-1.5 bg-black hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft size={16} className="text-gray-400" />
        </button>
        
        <div className="relative flex-1" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-full px-3 py-2 bg-black rounded-lg text-white text-xs sm:text-sm"
          >
            <span className="truncate">
              {currentOption?.label}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] text-gray-500">
                {currentOptionIndex + 1}/{dropdownOptions[activeTab].length}
              </span>
              <svg
                className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-[#2F2F2F] rounded-lg shadow-lg border border-gray-700">
              {dropdownOptions[activeTab].map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedOption(option.value)
                    setIsDropdownOpen(false)
                  }}
                  className={`flex items-center justify-between w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-black first:rounded-t-lg last:rounded-b-lg ${
                    selectedOption === option.value ? "text-blue-400 bg-black/50" : "text-white"
                  }`}
                >
                  <span>{option.label}</span>
                  <span className="text-[10px] text-gray-500 capitalize">{option.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button
          onClick={() => navigateOption(1)}
          className="p-1.5 bg-black hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Content Area */}
      <div className="w-full">
        {selectedOption === "overview" ? (
          renderOverviewStats()
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[280px]">
              {chartConfig && chartConfig.options && chartConfig.series && (
                <Chart
                  options={chartConfig.options}
                  series={chartConfig.series}
                  type={chartConfig.type}
                  height={chartConfig.options?.chart?.height || (isMobile ? 200 : 260)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
