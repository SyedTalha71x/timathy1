/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useState, useRef, useEffect } from "react"
import Chart from "react-apexcharts"
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Activity, Clock, Target, BarChart3, PieChart, ChevronDown, ArrowUp, ArrowDown, Menu, X } from 'lucide-react'

const analyticsData = {
  overview: {
    totalRevenue: 125420,
    revenueGrowth: 12.5,
    totalMembers: 1247,
    memberGrowth: 8.3,
    totalAppointments: 892,
    appointmentGrowth: -2.1,
    averageSessionDuration: 65,
    sessionGrowth: 5.2
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
    { month: "Dec", revenue: 14200, appointments: 195 }
  ],
  membershipTypes: [
    { name: "Premium", count: 423, percentage: 34, revenue: 52800 },
    { name: "Standard", count: 512, percentage: 41, revenue: 38400 },
    { name: "Basic", count: 312, percentage: 25, revenue: 18720 }
  ],
  topServices: [
    { name: "Personal Training", revenue: 45200, sessions: 312, avgPrice: 145 },
    { name: "Group Classes", revenue: 28900, sessions: 578, avgPrice: 50 },
    { name: "Nutrition Consulting", revenue: 18600, sessions: 124, avgPrice: 150 },
    { name: "Physiotherapy", revenue: 15400, sessions: 88, avgPrice: 175 },
    { name: "Yoga Classes", revenue: 12300, sessions: 246, avgPrice: 50 }
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
    { hour: "9 PM", appointments: 45 }
  ],
  staffPerformance: [
    { name: "John Smith", appointments: 156, revenue: 23400, rating: 4.8 },
    { name: "Sarah Johnson", appointments: 142, revenue: 21300, rating: 4.9 },
    { name: "Mike Wilson", revenue: 18900, appointments: 126, rating: 4.7 },
    { name: "Emma Davis", appointments: 134, revenue: 20100, rating: 4.8 }
  ],
  memberRetention: [
    { month: "Jan", retained: 92, new: 45, churned: 12 },
    { month: "Feb", retained: 94, new: 52, churned: 8 },
    { month: "Mar", retained: 91, new: 48, churned: 15 },
    { month: "Apr", retained: 95, new: 58, churned: 7 },
    { month: "May", retained: 93, new: 42, churned: 11 },
    { month: "Jun", retained: 96, new: 65, churned: 5 }
  ]
}

const StatCard = ({ title, value, change, icon: Icon, prefix = "", suffix = "" }) => {
  const isPositive = change > 0
  
  return (
    <div className="bg-[#2F2F2F] rounded-xl p-3">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-black rounded-lg">
          <Icon size={24} className="text-blue-400" />
        </div>
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          {Math.abs(change)}%
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-1">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
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
  const [selectedTimeRange, setSelectedTimeRange] = useState("Last 12 Months")
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const timeRangeRef = useRef(null)

  const timeRanges = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "Last 6 Months", "Last 12 Months"]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeRangeRef.current && !timeRangeRef.current.contains(event.target)) {
        setIsTimeRangeOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Revenue Chart Options
  const revenueChartOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      background: "transparent"
    },
    colors: ["#3B82F6", "#10B981"],
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    xaxis: {
      categories: analyticsData.revenueByMonth.map(item => item.month),
      labels: { style: { colors: "#9CA3AF" } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: [
      {
        title: { text: "Revenue ($)", style: { color: "#9CA3AF" } },
        labels: { 
          style: { colors: "#9CA3AF" },
          formatter: (value) => `$${(value / 1000).toFixed(0)}k`
        }
      },
      {
        opposite: true,
        title: { text: "Appointments", style: { color: "#9CA3AF" } },
        labels: { style: { colors: "#9CA3AF" } }
      }
    ],
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3
    },
    legend: {
      labels: { colors: "#9CA3AF" },
      position: "top"
    },
    tooltip: { theme: "dark" }
  }

  const revenueChartSeries = [
    {
      name: "Revenue",
      type: "area",
      data: analyticsData.revenueByMonth.map(item => item.revenue)
    },
    {
      name: "Appointments",
      type: "line",
      yAxisIndex: 1,
      data: analyticsData.revenueByMonth.map(item => item.appointments)
    }
  ]

  // Membership Distribution Chart
  const membershipChartOptions = {
    chart: {
      type: "donut",
      height: 300
    },
    colors: ["#3B82F6", "#10B981", "#F59E0B"],
    labels: analyticsData.membershipTypes.map(type => type.name),
    legend: {
      position: "bottom",
      labels: { colors: "#9CA3AF" }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Members",
              color: "#9CA3AF",
              formatter: () => analyticsData.overview.totalMembers.toLocaleString()
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`,
      style: { colors: ["#fff"] }
    },
    tooltip: { theme: "dark" }
  }

  const membershipChartSeries = analyticsData.membershipTypes.map(type => type.percentage)

  // Peak Hours Chart
  const peakHoursChartOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false }
    },
    colors: ["#8B5CF6"],
    xaxis: {
      categories: analyticsData.peakHours.map(item => item.hour),
      labels: { style: { colors: "#9CA3AF" } }
    },
    yaxis: {
      labels: { style: { colors: "#9CA3AF" } }
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%"
      }
    },
    tooltip: { theme: "dark" }
  }

  const peakHoursChartSeries = [{
    name: "Appointments",
    data: analyticsData.peakHours.map(item => item.appointments)
  }]

  return (
    <div className="min-h-screen bg-[#1C1C1C] rounded-3xl text-white">
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div className="bg-[#2F2F2F] border-b border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white"
              >
                <Menu size={24} />
              </button> */}
              <div>
                <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
                <p className="text-gray-400 text-sm">Comprehensive business insights and metrics</p>
              </div>
            </div>
            
            {/* <div className="relative" ref={timeRangeRef}>
              <button
                onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-black rounded-xl text-white text-sm hover:bg-gray-800"
              >
                {selectedTimeRange}
                <ChevronDown size={16} />
              </button>
              {isTimeRangeOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#2F2F2F] rounded-xl shadow-lg border border-gray-600 z-50">
                  {timeRanges.map((range) => (
                    <button
                      key={range}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-black first:rounded-t-xl last:rounded-b-xl"
                      onClick={() => {
                        setSelectedTimeRange(range)
                        setIsTimeRangeOpen(false)
                      }}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <Chart
            options={revenueChartOptions}
            series={revenueChartSeries}
            type="line"
            height={300}
          />
        </ChartCard>

        {/* Staff Performance and Member Retention */}
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
              <p className="text-white font-semibold">
                ${staff.revenue.toLocaleString()}
              </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>
    </div>
  )
}
