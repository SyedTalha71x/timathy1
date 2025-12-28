/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { FaCalendarAlt, FaDollarSign, FaUserPlus, FaUsers } from "react-icons/fa";

export const appointmentsData = {
  totals: {
    bookings: 9,
    checkIns: 3,
    cancellations: 4,
    lateCancellations: 0,
    noShows: 0,
  },
  monthlyBreakdown: [
    { month: "Feb", bookings: 0, checkIns: 0, cancellations: 0, lateCancellations: 0, noShows: 0 },
    { month: "Apr", bookings: 8, checkIns: 7, cancellations: 1, lateCancellations: 0, noShows: 0 },
    { month: "Jun", bookings: 5, checkIns: 4, cancellations: 1, lateCancellations: 0, noShows: 0 },
    { month: "Aug", bookings: 3, checkIns: 2, cancellations: 1, lateCancellations: 0, noShows: 0 },
    { month: "Oct", bookings: 2, checkIns: 1, cancellations: 1, lateCancellations: 0, noShows: 0 },
    { month: "Dec", bookings: 1, checkIns: 0, cancellations: 0, lateCancellations: 0, noShows: 0 },
  ],
  popularTimes: [
    { time: "8:00 AM", count: 1 },
    { time: "10:00 AM", count: 4 },
    { time: "12:00 PM", count: 4 },
    { time: "2:00 PM", count: 3 },
    { time: "4:00 PM", count: 2 },
    { time: "6:00 PM", count: 1 },
  ],
}
export const tabs = [
  { name: "Appointments", icon: FaCalendarAlt },
  { name: "Members", icon: FaUsers },
  { name: "Leads", icon: FaUserPlus },
  { name: "Finances", icon: FaDollarSign },
];

export const membersData = {
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
};

export const leadsData = {
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
};

export const financesData = {
  totalRevenue: 45680,
  averageRevenuePerMember: 133.57,
  outstandingPayments: 2340,
  topServicesByRevenue: [
    { name: "Personal Training", revenue: 18500 },
    { name: "Group Classes", revenue: 12300 },
    { name: "Nutrition Coaching", revenue: 8900 },
    { name: "Massage Therapy", revenue: 5980 },
  ],
  mostFrequentlySold: [
    { name: "Monthly Membership", count: 245 },
    { name: "Personal Training Session", count: 189 },
    { name: "Group Class Pass", count: 156 },
    { name: "Nutrition Plan", count: 98 },
    { name: "Massage Session", count: 67 },
  ],
};

export const getMonthlyBreakdownChartConfig = () => ({
  options: {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#10B981", "#3B82F6", "#EF4444", "#F59E0B", "#8B5CF6"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: appointmentsData.monthlyBreakdown.map((item) => item.month),
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 10,
      tickAmount: 5,
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
    },
    legend: {
      labels: { colors: "#9CA3AF" },
      position: "top",
      horizontalAlign: "center",
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => value.toString(),
      },
    },
  },
  series: [
    {
      name: "Bookings",
      data: appointmentsData.monthlyBreakdown.map((item) => item.bookings),
    },
    {
      name: "Check-ins",
      data: appointmentsData.monthlyBreakdown.map((item) => item.checkIns),
    },
    {
      name: "All Cancellations",
      data: appointmentsData.monthlyBreakdown.map((item) => item.cancellations),
    },
    {
      name: "Late Cancellations",
      data: appointmentsData.monthlyBreakdown.map((item) => item.lateCancellations),
    },
    {
      name: "No Shows",
      data: appointmentsData.monthlyBreakdown.map((item) => item.noShows),
    },
  ],
});

export const getPopularTimesChartConfig = () => ({
  options: {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#10B981"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "60%",
        distributed: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: appointmentsData.popularTimes.map((item) => item.time),
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
        rotate: -45,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 5,
      tickAmount: 5,
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => `${value} bookings`,
      },
    },
  },
  series: [
    {
      name: "Bookings",
      data: appointmentsData.popularTimes.map((item) => item.count),
    },
  ],
});

export const getMemberActivityChartConfig = () => ({
  options: {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#10B981", "#3B82F6", "#EF4444", "#F59E0B"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
    },
    legend: {
      labels: { colors: "#9CA3AF" },
      position: "top",
      horizontalAlign: "center",
    },
    tooltip: {
      theme: "dark",
    },
  },
  series: [
    {
      name: "New Full Members",
      data: membersData.newFullMembers,
    },
    {
      name: "New Temp Members",
      data: membersData.newTempMembers,
    },
    {
      name: "Set Inactive",
      data: membersData.inactiveMembers,
    },
    {
      name: "Set Paused",
      data: membersData.pausedMembers,
    },
  ],
});

export const getMembersByTypeChartConfig = () => ({
  options: {
    chart: {
      type: "donut",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"],
    labels: membersData.membersByType.map((item) => item.type),
    legend: {
      labels: { colors: "#9CA3AF" },
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Members",
              color: "#9CA3AF",
              formatter: () => membersData.totalMembers.toString(),
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#fff"],
      },
    },
    tooltip: {
      theme: "dark",
    },
  },
  series: membersData.membersByType.map((item) => item.count),
});

export const getLeadsChartConfig = () => ({
  options: {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#3B82F6", "#10B981"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "60%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: leadsData.monthlyData.map((item) => item.month),
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
    },
    legend: {
      labels: { colors: "#9CA3AF" },
      position: "top",
      horizontalAlign: "center",
    },
    tooltip: {
      theme: "dark",
    },
  },
  series: [
    {
      name: "New Leads",
      data: leadsData.monthlyData.map((item) => item.newLeads),
    },
    {
      name: "Converted",
      data: leadsData.monthlyData.map((item) => item.converted),
    },
  ],
});

export const getConversionRateChartConfig = () => ({
  options: {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#10B981"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: leadsData.monthlyData.map((item) => item.month),
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
        formatter: (value) => `${value}%`,
      },
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => `${value}%`,
      },
    },
  },
  series: [
    {
      name: "Conversion Rate",
      data: leadsData.monthlyData.map((item) => item.convertedPercent),
    },
  ],
});

export const getTopServicesByRevenueChartConfig = () => ({
  options: {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#10B981"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: financesData.topServicesByRevenue.map((item) => item.name),
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
        formatter: (value) => `$${value}`,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => `$${value}`,
      },
    },
  },
  series: [
    {
      name: "Revenue",
      data: financesData.topServicesByRevenue.map((item) => item.revenue),
    },
  ],
});

export const getMostFrequentlySoldChartConfig = () => ({
  options: {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#3B82F6"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "60%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: financesData.mostFrequentlySold.map((item) => item.name),
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "10px",
        },
        rotate: -45,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => `${value} sold`,
      },
    },
  },
  series: [
    {
      name: "Units Sold",
      data: financesData.mostFrequentlySold.map((item) => item.count),
    },
  ],
});

export const leadOriginMapData = {
  // Sample data for lead origins by area
  regions: [
    { name: "North", leads: 150, color: "#FF6B35", intensity: 0.9 },
    { name: "South", leads: 85, color: "#FFA726", intensity: 0.6 },
    { name: "East", leads: 120, color: "#FF8A65", intensity: 0.8 },
    { name: "West", leads: 65, color: "#FFB74D", intensity: 0.5 },
    { name: "Central", leads: 200, color: "#FF5722", intensity: 1.0 },
    { name: "Northwest", leads: 45, color: "#FFCC80", intensity: 0.4 },
    { name: "Southeast", leads: 95, color: "#FF9800", intensity: 0.7 },
  ],
  totalLeads: 760
}

export const LeadOriginMap = ({ data, height = 400 }) => {
  return (
    <div className="bg-[#2F2F2F] rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Lead Origin</h3>
        <div className="text-sm text-gray-400">
          Total: <span className="font-bold text-orange-400">{data.totalLeads}</span> leads
        </div>
      </div>
      
      <div className="relative" style={{ height: `${height}px` }}>
        {/* Simplified SVG map visualization */}
        <svg width="100%" height="100%" viewBox="0 0 800 400" className="rounded-lg">
          {/* Map background */}
          <rect width="800" height="400" fill="#1E1E1E" rx="8" />
          
          {/* Region areas with intensity-based colors */}
          {/* North region */}
          <path 
            d="M200,50 Q400,30 600,50 L550,150 Q400,180 250,150 Z"
            fill={`rgba(255, 107, 53, ${data.regions[0].intensity})`}
            stroke="#fff"
            strokeWidth="1"
            className="hover:opacity-90 cursor-pointer transition-opacity"
          />
          
          {/* Central region */}
          <path 
            d="M250,150 L550,150 Q600,250 550,350 Q400,380 250,350 Q200,250 250,150"
            fill={`rgba(255, 87, 34, ${data.regions[4].intensity})`}
            stroke="#fff"
            strokeWidth="1"
            className="hover:opacity-90 cursor-pointer transition-opacity"
          />
          
          {/* South region */}
          <path 
            d="M250,350 Q400,380 550,350 L600,380 Q400,400 200,380 L250,350"
            fill={`rgba(255, 167, 38, ${data.regions[1].intensity})`}
            stroke="#fff"
            strokeWidth="1"
            className="hover:opacity-90 cursor-pointer transition-opacity"
          />
          
          {/* East region */}
          <path 
            d="M550,150 L650,100 Q750,200 650,300 L550,350 L550,150"
            fill={`rgba(255, 138, 101, ${data.regions[2].intensity})`}
            stroke="#fff"
            strokeWidth="1"
            className="hover:opacity-90 cursor-pointer transition-opacity"
          />
          
          {/* West region */}
          <path 
            d="M150,100 Q200,50 250,150 L250,350 L150,300 Q50,200 150,100"
            fill={`rgba(255, 183, 77, ${data.regions[3].intensity})`}
            stroke="#fff"
            strokeWidth="1"
            className="hover:opacity-90 cursor-pointer transition-opacity"
          />
          
          {/* Region labels */}
          <text x="400" y="80" fill="white" textAnchor="middle" fontSize="14" fontWeight="bold">North</text>
          <text x="400" y="250" fill="white" textAnchor="middle" fontSize="14" fontWeight="bold">Central</text>
          <text x="400" y="370" fill="white" textAnchor="middle" fontSize="14" fontWeight="bold">South</text>
          <text x="600" y="220" fill="white" textAnchor="middle" fontSize="14" fontWeight="bold">East</text>
          <text x="200" y="220" fill="white" textAnchor="middle" fontSize="14" fontWeight="bold">West</text>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">Intensity:</div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-700"></div>
            <span className="text-xs text-gray-400">Low</span>
            <div className="w-4 h-4 bg-orange-400"></div>
            <span className="text-xs text-gray-400">High</span>
          </div>
        </div>
        
        {/* Region list with counts */}
        <div className="flex flex-wrap gap-2 mt-2">
          {data.regions.map((region, index) => (
            <div key={index} className="flex items-center space-x-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: region.color }}
              ></div>
              <span className="text-xs text-gray-300">{region.name}:</span>
              <span className="text-xs font-bold text-white">{region.leads}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}