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