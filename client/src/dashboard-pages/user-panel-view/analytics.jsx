"use client"

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useState, useRef, useEffect } from "react"
import Chart from "react-apexcharts"
import { TrendingUp, Users, Calendar, DollarSign, Clock, Target, ChevronDown, ArrowUp, ArrowDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Avatar from "../../../public/avatar.png"
import Rectangle1 from "../../../public/Rectangle 1.png"
import { SidebarArea } from "../../components/custom-sidebar"
import { IoIosMenu } from "react-icons/io"

const analyticsData = {
  overview: {
    totalRevenue: 125420,
    revenueGrowth: 12.5,
    totalMembers: 1247,
    memberGrowth: 8.3,
    totalAppointments: 892,
    appointmentGrowth: -2.1,
    averageSessionDuration: 65,
    sessionGrowth: 5.2,
  },
  revenueByMonth: [
    { month: "Jan", revenue: 8500, appointments: 120 },
    { month: "Feb", revenue: 9200, appointments: 135 },
    { month: "Mar", revenue: 10100, appointments: 142 },
    { month: "Apr", revenue: 11300, appointments: 158 },
    { month: "May", revenue: 10800, appointments: 151 },
    { month: "Jun", revenue: 12400, appointments: 167 },
    { month: "Jul", revenue: 13200, appointments: 178 },
    { month: "Aug", revenue: 12800, appointments: 172 },
    { month: "Sep", revenue: 14100, appointments: 189 },
    { month: "Oct", revenue: 13600, appointments: 183 },
    { month: "Nov", revenue: 15200, appointments: 201 },
    { month: "Dec", revenue: 14200, appointments: 195 },
  ],
  membershipTypes: [
    { name: "Premium", count: 423, percentage: 34, revenue: 52800 },
    { name: "Standard", count: 512, percentage: 41, revenue: 38400 },
    { name: "Basic", count: 312, percentage: 25, revenue: 18720 },
  ],
  topServices: [
    { name: "Personal Training", revenue: 45200, sessions: 312, avgPrice: 145 },
    { name: "Group Classes", revenue: 28900, sessions: 578, avgPrice: 50 },
    { name: "Nutrition Consulting", revenue: 18600, sessions: 124, avgPrice: 150 },
    { name: "Physiotherapy", revenue: 15400, sessions: 88, avgPrice: 175 },
    { name: "Yoga Classes", revenue: 12300, sessions: 246, avgPrice: 50 },
  ],
  peakHours: [
    { hour: "6 AM", appointments: 45 },
    { hour: "7 AM", appointments: 78 },
    { hour: "8 AM", appointments: 92 },
    { hour: "9 AM", appointments: 65 },
    { hour: "10 AM", appointments: 58 },
    { hour: "11 AM", appointments: 42 },
    { hour: "12 PM", appointments: 38 },
    { hour: "1 PM", appointments: 35 },
    { hour: "2 PM", appointments: 48 },
    { hour: "3 PM", appointments: 52 },
    { hour: "4 PM", appointments: 68 },
    { hour: "5 PM", appointments: 85 },
    { hour: "6 PM", appointments: 95 },
    { hour: "7 PM", appointments: 88 },
    { hour: "8 PM", appointments: 72 },
    { hour: "9 PM", appointments: 45 },
  ],
  staffPerformance: [
    { name: "John Smith", appointments: 156, revenue: 23400, rating: 4.8 },
    { name: "Sarah Johnson", appointments: 142, revenue: 21300, rating: 4.9 },
    { name: "Mike Wilson", revenue: 18900, appointments: 126, rating: 4.7 },
    { name: "Emma Davis", appointments: 134, revenue: 20100, rating: 4.8 },
  ],
  memberRetention: [
    { month: "Jan", retained: 92, new: 45, churned: 12 },
    { month: "Feb", retained: 94, new: 52, churned: 8 },
    { month: "Mar", retained: 91, new: 48, churned: 15 },
    { month: "Apr", retained: 95, new: 58, churned: 7 },
    { month: "May", retained: 93, new: 42, churned: 11 },
    { month: "Jun", retained: 96, new: 65, churned: 5 },
  ],
  checkedInMembers: [
    { name: "Alice Cooper", checkInTime: "08:30 AM", service: "Personal Training" },
    { name: "Bob Johnson", checkInTime: "09:15 AM", service: "Group Classes" },
    { name: "Carol Smith", checkInTime: "10:00 AM", service: "Yoga Classes" },
    { name: "David Wilson", checkInTime: "11:30 AM", service: "Physiotherapy" },
  ],
  cancelledAppointments: [
    { name: "Emma Brown", service: "Personal Training", cancelTime: "2 hours ago", reason: "Emergency" },
    { name: "Frank Davis", service: "Nutrition Consulting", cancelTime: "4 hours ago", reason: "Illness" },
    { name: "Grace Miller", service: "Group Classes", cancelTime: "1 day ago", reason: "Schedule conflict" },
  ],
  leads: [
    { name: "Henry Taylor", source: "Website", interest: "Personal Training", score: 85 },
    { name: "Ivy Anderson", source: "Referral", interest: "Group Classes", score: 92 },
    { name: "Jack Thompson", source: "Social Media", interest: "Yoga Classes", score: 78 },
    { name: "Kate Wilson", source: "Walk-in", interest: "Nutrition", score: 88 },
  ],
}

const StatCard = ({ title, value, change, icon: Icon, prefix = "", suffix = "" }) => {
  const isPositive = change > 0

  return (
    <div className="bg-[#2F2F2F] rounded-xl p-3">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-black rounded-lg">
          <Icon size={24} className="text-blue-400" />
        </div>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">
          {prefix}
          {typeof value === "number" ? value.toLocaleString() : value}
          {suffix}
        </h3>
        <p className="text-zinc-400 text-sm">{title}</p>
      </div>
    </div>
  )
}

const ChartCard = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-[#2F2F2F] rounded-xl p-5 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  )
}

export default function AnalyticsDashboard() {
  const navigate = useNavigate()
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const [selectedAnalyticsFilter, setSelectedAnalyticsFilter] = useState("All members")
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const analyticsFilterRef = useRef(null)

  const analyticsFilters = [
    "All members",
    "Checked in",
    "Cancelled appointment",
    "Finances",
    "Selling",
    "Leads",
    "Top-selling by revenue",
    "Most frequently sold",
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (analyticsFilterRef.current && !analyticsFilterRef.current.contains(event.target)) {
        setIsAnalyticsFilterOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const renderFilteredContent = () => {
    switch (selectedAnalyticsFilter) {
      case "All members":
        return (
          <>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${
                isRightSidebarOpen ? "lg:grid-cols-2" : "lg:grid-cols-4"
              }`}
            >
              <StatCard
                title="Total Revenue"
                value={analyticsData.overview.totalRevenue}
                change={analyticsData.overview.revenueGrowth}
                icon={DollarSign}
                prefix="$"
              />
              <StatCard
                title="Total Members"
                value={analyticsData.overview.totalMembers}
                change={analyticsData.overview.memberGrowth}
                icon={Users}
              />
              <StatCard
                title="Total Appointments"
                value={analyticsData.overview.totalAppointments}
                change={analyticsData.overview.appointmentGrowth}
                icon={Calendar}
              />
              <StatCard
                title="Avg Session Duration"
                value={analyticsData.overview.averageSessionDuration}
                change={analyticsData.overview.sessionGrowth}
                icon={Clock}
                suffix=" min"
              />
            </div>

            <ChartCard title="Revenue & Appointments Trend" className="col-span-full">
              <Chart options={revenueChartOptions} series={revenueChartSeries} type="line" height={300} />
            </ChartCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Staff Performance">
                <div className="h-[400px] overflow-y-auto custom-scrollbar space-y-4 pr-2">
                  {analyticsData.staffPerformance.map((staff) => (
                    <div key={staff.name} className="p-4 bg-black rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-white">{staff.name}</h4>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <span className="text-sm">★</span>
                          <span className="text-sm">{staff.rating}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Appointments</p>
                          <p className="text-white font-semibold">{staff.appointments}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Revenue</p>
                          <p className="text-white font-semibold">${staff.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <ChartCard title="Member Retention Metrics">
                <div className="h-[400px] overflow-y-auto custom-scrollbar space-y-4 pr-2">
                  {analyticsData.memberRetention.map((data) => (
                    <div key={data.month} className="p-4 bg-black rounded-xl">
                      <h4 className="font-semibold text-white mb-3">{data.month}</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-green-400">Retained</p>
                          <p className="text-white font-bold">{data.retained}%</p>
                        </div>
                        <div>
                          <p className="text-blue-400">New</p>
                          <p className="text-white font-bold">{data.new}</p>
                        </div>
                        <div>
                          <p className="text-red-400">Churned</p>
                          <p className="text-white font-bold">{data.churned}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            <ChartCard title="Key Performance Indicators">
            <div
  className={`grid grid-cols-1 md:grid-cols-2 ${
    isRightSidebarOpen ? "lg:grid-cols-2" : "lg:grid-cols-4"
  } gap-4`}
>
                <div className="text-center p-4 bg-black rounded-xl">
                  <div className="text-3xl font-bold text-blue-400 mb-2">94.2%</div>
                  <div className="text-sm text-gray-400">Member Satisfaction</div>
                </div>
                <div className="text-center p-4 bg-black rounded-xl">
                  <div className="text-3xl font-bold text-green-400 mb-2">87%</div>
                  <div className="text-sm text-gray-400">Retention Rate</div>
                </div>
                <div className="text-center p-4 bg-black rounded-xl">
                  <div className="text-3xl font-bold text-purple-400 mb-2">$145</div>
                  <div className="text-sm text-gray-400">Avg Revenue/Member</div>
                </div>
                <div className="text-center p-4 bg-black rounded-xl">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">2.3x</div>
                  <div className="text-sm text-gray-400">ROI on Marketing</div>
                </div>
              </div>
            </ChartCard>
          </>
        )

      case "Checked in":
        return (
          <ChartCard title="Currently Checked In Members" className="col-span-full">
            <div
  className={`grid grid-cols-1 md:grid-cols-2 ${
    isRightSidebarOpen ? "lg:grid-cols-2" : "lg:grid-cols-4"
  } gap-4`}
>
              {analyticsData.checkedInMembers.map((member, index) => (
                <div key={index} className="p-4 bg-black rounded-xl">
                  <h4 className="font-semibold text-white mb-2">{member.name}</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-400">
                      Check-in: <span className="text-green-400">{member.checkInTime}</span>
                    </p>
                    <p className="text-gray-400">
                      Service: <span className="text-blue-400">{member.service}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        )

      case "Cancelled appointment":
        return (
          <ChartCard title="Recent Cancelled Appointments" className="col-span-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyticsData.cancelledAppointments.map((appointment, index) => (
                <div key={index} className="p-4 bg-black rounded-xl">
                  <h4 className="font-semibold text-white mb-2">{appointment.name}</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-400">
                      Service: <span className="text-blue-400">{appointment.service}</span>
                    </p>
                    <p className="text-gray-400">
                      Cancelled: <span className="text-red-400">{appointment.cancelTime}</span>
                    </p>
                    <p className="text-gray-400">
                      Reason: <span className="text-yellow-400">{appointment.reason}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        )

      case "Finances":
        return (
          <div className="space-y-6">
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${
                isRightSidebarOpen ? "lg:grid-cols-2" : "lg:grid-cols-4"
              }`}
            >
              <StatCard
                title="Monthly Revenue"
                value={analyticsData.overview.totalRevenue}
                change={analyticsData.overview.revenueGrowth}
                icon={DollarSign}
                prefix="$"
              />
              <StatCard title="Average Revenue/Member" value={145} change={8.2} icon={Target} prefix="$" />
              <StatCard title="Outstanding Payments" value={12500} change={-15.3} icon={Clock} prefix="$" />
              <StatCard title="Profit Margin" value={34.2} change={5.1} icon={TrendingUp} suffix="%" />
            </div>
            <ChartCard title="Revenue Breakdown by Service" className="col-span-full">
            <div
  className={`grid grid-cols-1 md:grid-cols-2 ${
    isRightSidebarOpen ? "lg:grid-cols-2" : "lg:grid-cols-5"
  } gap-4`}
>
  {analyticsData.topServices.map((service, index) => {
    const isLastOdd =
      isRightSidebarOpen &&
      analyticsData.topServices.length % 2 !== 0 &&
      index === analyticsData.topServices.length - 1;

    return (
      <div
        key={index}
        className={`p-4 bg-black rounded-xl text-center ${
          isLastOdd ? "lg:col-span-2" : ""
        }`}
      >
        <h4 className="font-semibold text-white mb-2">{service.name}</h4>
        <div className="text-2xl font-bold text-green-400 mb-1">
          ${service.revenue.toLocaleString()}
        </div>
        <p className="text-sm text-gray-400">{service.sessions} sessions</p>
        <p className="text-sm text-blue-400">Avg: ${service.avgPrice}</p>
      </div>
    );
  })}
</div>

            </ChartCard>
          </div>
        )

      case "Leads":
        return (
          <ChartCard title="Recent Leads" className="col-span-full">
         <div
  className={`grid grid-cols-1 md:grid-cols-2 ${
    isRightSidebarOpen ? "lg:grid-cols-2" : "lg:grid-cols-4"
  } gap-4`}
>
              {analyticsData.leads.map((lead, index) => (
                <div key={index} className="p-4 bg-black rounded-xl">
                  <h4 className="font-semibold text-white mb-2">{lead.name}</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-400">
                      Source: <span className="text-blue-400">{lead.source}</span>
                    </p>
                    <p className="text-gray-400">
                      Interest: <span className="text-purple-400">{lead.interest}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Score:</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{ width: `${lead.score}%` }}></div>
                      </div>
                      <span className="text-green-400 font-semibold">{lead.score}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        )

      case "Top-selling by revenue":
        return (
          <ChartCard title="Top Services by Revenue" className="col-span-full">
            <div className="space-y-4">
              {analyticsData.topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-black rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{service.name}</h4>
                      <p className="text-sm text-gray-400">{service.sessions} sessions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-400">${service.revenue.toLocaleString()}</div>
                    <p className="text-sm text-gray-400">Avg: ${service.avgPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        )

      case "Most frequently sold":
        return (
          <ChartCard title="Most Popular Services" className="col-span-full">
            <div className="space-y-4">
              {analyticsData.topServices
                .sort((a, b) => b.sessions - a.sessions)
                .map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-black rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{service.name}</h4>
                        <p className="text-sm text-gray-400">${service.revenue.toLocaleString()} revenue</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-400">{service.sessions}</div>
                      <p className="text-sm text-gray-400">sessions</p>
                    </div>
                  </div>
                ))}
            </div>
          </ChartCard>
        )

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-400">Select a filter to view analytics data</p>
          </div>
        )
    }
  }

  // Revenue Chart Options
  const revenueChartOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#3B82F6", "#10B981"],
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: analyticsData.revenueByMonth.map((item) => item.month),
      labels: { style: { colors: "#9CA3AF" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        title: { text: "Revenue ($)", style: { color: "#9CA3AF" } },
        labels: {
          style: { colors: "#9CA3AF" },
          formatter: (value) => `$${(value / 1000).toFixed(0)}k`,
        },
      },
      {
        opposite: true,
        title: { text: "Appointments", style: { color: "#9CA3AF" } },
        labels: { style: { colors: "#9CA3AF" } },
      },
    ],
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
    },
    legend: {
      labels: { colors: "#9CA3AF" },
      position: "top",
    },
    tooltip: { theme: "dark" },
  }

  const revenueChartSeries = [
    {
      name: "Revenue",
      type: "area",
      data: analyticsData.revenueByMonth.map((item) => item.revenue),
    },
    {
      name: "Appointments",
      type: "line",
      yAxisIndex: 1,
      data: analyticsData.revenueByMonth.map((item) => item.appointments),
    },
  ]

  const [communications, setCommunications] = useState([
    {
      id: 1,
      name: "John Doe",
      message: "Hey, how's the project going?",
      time: "2 min ago",
      avatar: Rectangle1,
    },
    {
      id: 2,
      name: "Jane Smith",
      message: "Meeting scheduled for tomorrow",
      time: "10 min ago",
      avatar: Rectangle1,
    },
  ])

  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Review project proposal",
      description: "Check the latest updates",
      assignee: "Mike",
    },
    {
      id: 2,
      title: "Update documentation",
      description: "Add new features info",
      assignee: "Sarah",
    },
  ])

  const [birthdays, setBirthdays] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      date: "Dec 15, 2024",
      avatar: Avatar,
    },
    {
      id: 2,
      name: "Bob Wilson",
      date: "Dec 20, 2024",
      avatar: Avatar,
    },
  ])

  const [customLinks, setCustomLinks] = useState([
    {
      id: 1,
      title: "Google Drive",
      url: "https://drive.google.com",
    },
    {
      id: 2,
      title: "GitHub",
      url: "https://github.com",
    },
  ])

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null)
  const [editingLink, setEditingLink] = useState(null)

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  const closeSidebar = () => {
    setIsRightSidebarOpen(false)
  }

  const redirectToCommunication = () => {
    navigate("/dashboard/communication")
  }

  const redirectToTodos = () => {
    console.log("Redirecting to todos page")
    navigate("/dashboard/to-do")
  }

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index)
  }

  return (
    <div
      className={`
      min-h-screen rounded-3xl bg-[#1C1C1C] text-white p-4
      transition-all duration-500 ease-in-out flex-1
      ${
        isRightSidebarOpen
          ? "lg:mr-86 mr-0" // Adjust right margin when sidebar is open on larger screens
          : "mr-0" // No margin when closed
      }
    `}
    >
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div className="bg-[#2F2F2F] border-b border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center  gap-4">
              <div>
                <h1 className="text-white oxanium_font text-xl md:text-2xl">Analytics</h1>
              </div>
            </div>

            <div className="relative" ref={analyticsFilterRef}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAnalyticsFilterOpen(!isAnalyticsFilterOpen)}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-black rounded-xl text-white text-sm hover:bg-gray-800 min-w-[160px] justify-between"
                >
                  {selectedAnalyticsFilter}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isAnalyticsFilterOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div className="block">
                  <IoIosMenu
                    onClick={toggleRightSidebar}
                    size={25}
                    className="cursor-pointer text-white hover:bg-gray-200 hover:text-black duration-300 transition-all rounded-md"
                  />
                </div>
              </div>
              {isAnalyticsFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#2F2F2F] rounded-xl shadow-lg border border-gray-600 z-50 py-2">
                  {analyticsFilters.map((filter) => (
                    <button
                      key={filter}
                      className="block w-full text-left px-4 py-3 text-sm text-white hover:bg-black transition-colors"
                      onClick={() => {
                        setSelectedAnalyticsFilter(filter)
                        setIsAnalyticsFilterOpen(false)
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 py-8 space-y-8">{renderFilteredContent()}</div>

      <SidebarArea
        isOpen={isRightSidebarOpen}
        onClose={closeSidebar}
        communications={communications}
        todos={todos}
        birthdays={birthdays}
        customLinks={customLinks}
        setCustomLinks={setCustomLinks}
        redirectToCommunication={redirectToCommunication}
        redirectToTodos={redirectToTodos}
        toggleDropdown={toggleDropdown}
        openDropdownIndex={openDropdownIndex}
        setEditingLink={setEditingLink}
      />

      {/* Overlay for mobile screens only */}
      {isRightSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeSidebar} />}
    </div>
  )
}
