/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { FaCalendarAlt, FaDollarSign, FaUserPlus, FaUsers } from "react-icons/fa";



// =========================================
// Function to process appointments from API
// =========================================
export const processAppointmentsData = (appointments) => {
  // Add validation at the beginning
  if (!appointments || !Array.isArray(appointments)) {
    console.warn('Invalid appointments data:', appointments);
    return {
      totals: {
        bookings: 0,
        checkIns: 0,
        cancellations: 0,
        lateCancellations: 0,
        noShows: 0,
      },
      monthlyBreakdown: [],
      popularTimes: [],
    };
  }

  // Initialize counters
  const counts = {
    totals: {
      bookings: 0,
      checkIns: 0,
      cancellations: 0,
      lateCancellations: 0,
      noShows: 0,
    },
    monthlyBreakdown: {},
    popularTimes: {},
  };

  // Filter out blocked slots first
  const realBookings = appointments.filter(app => app.status !== 'blocked' && app.view !== 'blocked');

  // Set total bookings (excluding blocked)
  counts.totals.bookings = realBookings.length;

  // Process each real booking
  realBookings.forEach(app => {
    // Skip if app is invalid
    if (!app || !app.date) return;
    
    const date = new Date(app.date);
    const month = date.toLocaleString('default', { month: 'short' });
    
    // ✅ FIX: Safely extract hour from timeSlot
    let hour = 0;
    if (app.timeSlot && app.timeSlot.start) {
      hour = parseInt(app.timeSlot.start.split(':')[0]);
    } else if (app.timeSlot && typeof app.timeSlot === 'string') {
      // Handle string format like "10:00-12:00"
      const startTime = app.timeSlot.split('-')[0];
      hour = parseInt(startTime.split(':')[0]);
    } else {
      // Default to noon if no time available
      hour = 12;
    }
    
    const timeSlot = formatTimeSlot(hour);

    // Initialize month data if not exists
    if (!counts.monthlyBreakdown[month]) {
      counts.monthlyBreakdown[month] = {
        bookings: 0,
        checkIns: 0,
        cancellations: 0,
        lateCancellations: 0,
        noShows: 0,
      };
    }

    // Count bookings per month
    counts.monthlyBreakdown[month].bookings += 1;

    // Count popular times
    counts.popularTimes[timeSlot] = (counts.popularTimes[timeSlot] || 0) + 1;

    // Count check-ins
    if (app.isCheckedIn) {
      counts.totals.checkIns += 1;
      counts.monthlyBreakdown[month].checkIns += 1;
    }

    // Count cancellations
    if (app.status === 'cancelled' || app.status === 'canceled') {
      counts.totals.cancellations += 1;
      counts.monthlyBreakdown[month].cancellations += 1;

      // Check for late cancellations (within 24 hours)
      const appointmentDate = new Date(app.date);
      const now = new Date();
      const hoursUntilAppointment = (appointmentDate - now) / (1000 * 60 * 60);

      if (hoursUntilAppointment < 24 && hoursUntilAppointment > 0) {
        counts.totals.lateCancellations += 1;
        counts.monthlyBreakdown[month].lateCancellations += 1;
      }
    }

    // Count no-shows (past appointments not checked in)
    if (app.status === 'confirmed' && new Date(app.date) < new Date() && !app.isCheckedIn) {
      counts.totals.noShows += 1;
      counts.monthlyBreakdown[month].noShows += 1;
    }
  });

  // Convert monthly breakdown to array
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyArray = Object.entries(counts.monthlyBreakdown)
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

  // Convert popular times to array
  const popularTimesArray = Object.entries(counts.popularTimes)
    .map(([time, count]) => ({ time, count }))
    .sort((a, b) => {
      const timeToMinutes = (time) => {
        try {
          const [hours, minutes] = time.split(':')[0].split(' ')[0].split(':');
          const isPM = time.includes('PM');
          let hour = parseInt(hours);
          if (isPM && hour !== 12) hour += 12;
          if (!isPM && hour === 12) hour = 0;
          return hour * 60 + (parseInt(minutes) || 0);
        } catch (error) {
          return 0;
        }
      };
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });

  return {
    totals: counts.totals,
    monthlyBreakdown: monthlyArray,
    popularTimes: popularTimesArray,
  };
};

const formatTimeSlot = (hour) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  let displayHour = hour;
  if (hour > 12) displayHour = hour - 12;
  if (hour === 0) displayHour = 12;
  return `${displayHour}:00 ${period}`;
};

export const tabs = [
  { name: "Appointments", icon: FaCalendarAlt },
  { name: "Members", icon: FaUsers },
  { name: "Leads", icon: FaUserPlus },
  { name: "Finances", icon: FaDollarSign },
];

// ==============================
// MEMBERS DATA PROCESSING
// ==============================
export const processMembersData = (members) => {
  // Add validation
  if (!members || !Array.isArray(members)) {
    console.warn('Invalid members data:', members);
    return {
      totalMembers: 0,
      fullMembers: 0,
      temporaryMembers: 0,
      activeMembers: 0,
      inactiveMembers: 0,
      pausedMembers: 0,
      membersByType: [],
      monthlyNewMembers: {},
    };
  }

  // Initialize member stats
  const stats = {
    totalMembers: members.length,
    fullMembers: 0,
    temporaryMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    pausedMembers: 0,
    membersByType: [],
    monthlyNewMembers: {}, // For tracking new members by month
  };

  // Count by member type and status
  members.forEach(member => {
    if (!member) return;
    
    // Count by member type
    if (member.memberType === 'full') {
      stats.fullMembers += 1;
    } else if (member.memberType === 'temporary') {
      stats.temporaryMembers += 1;
    }

    // Count by status
    if (member.status === 'active') {
      stats.activeMembers += 1;
    } else if (member.status === 'inactive') {
      stats.inactiveMembers += 1;
    } else if (member.status === 'paused') {
      stats.pausedMembers += 1;
    }

    // Track new members by month (using createdAt date)
    if (member.createdAt) {
      const date = new Date(member.createdAt);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      if (!stats.monthlyNewMembers[key]) {
        stats.monthlyNewMembers[key] = {
          full: 0,
          temporary: 0,
          total: 0
        };
      }

      stats.monthlyNewMembers[key].total += 1;
      if (member.memberType === 'full') {
        stats.monthlyNewMembers[key].full += 1;
      } else if (member.memberType === 'temporary') {
        stats.monthlyNewMembers[key].temporary += 1;
      }
    }
  });

  // Create members by type array for donut chart
  stats.membersByType = [
    { type: "Full Members", count: stats.fullMembers },
    { type: "Temporary", count: stats.temporaryMembers },
  ];

  return stats;
};

// ==============================
// LEADS DATA PROCESSING
// ==============================
export const processLeadsData = (leads) => {
  // Add validation
  if (!leads || !Array.isArray(leads)) {
    console.warn('Invalid leads data:', leads);
    return {
      totalLeads: 0,
      convertedLeads: 0,
      activeLeads: 0,
      passiveLeads: 0,
      conversionRate: 0,
      bySource: {},
      monthlyData: [],
    };
  }

  // Initialize leads stats
  const stats = {
    totalLeads: leads.length,
    convertedLeads: 0,
    activeLeads: 0,
    passiveLeads: 0,
    bySource: {},
    monthlyData: {},
    conversionRate: 0,
  };

  // Process each lead
  leads.forEach(lead => {
    if (!lead) return;
    
    // Count by column (status)
    if (lead.column === 'active') {
      stats.activeLeads += 1;
    } else if (lead.column === 'passive') {
      stats.passiveLeads += 1;
    }

    // Count by source
    if (lead.source) {
      stats.bySource[lead.source] = (stats.bySource[lead.source] || 0) + 1;
    }

    // Track monthly data (using createdAt)
    if (lead.createdAt) {
      const date = new Date(lead.createdAt);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const monthKey = `${month} ${year}`;

      if (!stats.monthlyData[monthKey]) {
        stats.monthlyData[monthKey] = {
          month: month,
          year: year,
          newLeads: 0,
          converted: 0,
          convertedPercent: 0
        };
      }

      stats.monthlyData[monthKey].newLeads += 1;
    }

    // Check if lead is converted (based on isConverted field)
    if (lead.isConverted) {
      stats.convertedLeads += 1;

      // Also track conversions by month
      if (lead.updatedAt) {
        const date = new Date(lead.updatedAt);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const monthKey = `${month} ${year}`;

        if (stats.monthlyData[monthKey]) {
          stats.monthlyData[monthKey].converted += 1;
        }
      }
    }
  });

  // Calculate conversion rates for each month and overall
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Convert monthlyData object to array and sort by date
  const monthlyArray = Object.values(stats.monthlyData)
    .map(item => ({
      month: item.month,
      newLeads: item.newLeads,
      converted: item.converted,
      convertedPercent: item.newLeads > 0
        ? Math.round((item.converted / item.newLeads) * 100 * 10) / 10
        : 0
    }))
    .sort((a, b) => {
      const monthA = monthOrder.indexOf(a.month);
      const monthB = monthOrder.indexOf(b.month);
      return monthA - monthB;
    });

  // Calculate overall conversion rate
  stats.conversionRate = stats.totalLeads > 0
    ? Math.round((stats.convertedLeads / stats.totalLeads) * 100 * 10) / 10
    : 0;

  return {
    totalLeads: stats.totalLeads,
    convertedLeads: stats.convertedLeads,
    activeLeads: stats.activeLeads,
    passiveLeads: stats.passiveLeads,
    conversionRate: stats.conversionRate,
    bySource: stats.bySource,
    monthlyData: monthlyArray,
  };
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

// =================================================
// APPOINTMENTS CHARTS - These need data parameters
// =================================================
export const getMonthlyBreakdownChartConfig = (appointmentsData) => ({
  options: {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: 'inherit',
    },
    colors: ["#10B981", "#3B82F6", "#EF4444", "#F59E0B", "#8B5CF6"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: appointmentsData?.monthlyBreakdown?.map((item) => item.month) || [],
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
      max: Math.max(
        ...(appointmentsData?.monthlyBreakdown?.flatMap(item => [
          item.bookings,
          item.checkIns,
          item.cancellations,
          item.lateCancellations,
          item.noShows
        ]) || [10])
      ) + 2,
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
      fontSize: '12px',
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => value.toString(),
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 280 },
          legend: { fontSize: '10px', position: 'bottom' },
          stroke: { width: 2 },
        },
      },
    ],
  },
  series: [
    {
      name: "Bookings",
      data: appointmentsData?.monthlyBreakdown?.map((item) => item.bookings) || [],
    },
    {
      name: "Check-ins",
      data: appointmentsData?.monthlyBreakdown?.map((item) => item.checkIns) || [],
    },
    {
      name: "All Cancellations",
      data: appointmentsData?.monthlyBreakdown?.map((item) => item.cancellations) || [],
    },
    {
      name: "Late Cancellations",
      data: appointmentsData?.monthlyBreakdown?.map((item) => item.lateCancellations) || [],
    },
    {
      name: "No Shows",
      data: appointmentsData?.monthlyBreakdown?.map((item) => item.noShows) || [],
    },
  ],
});

export const getPopularTimesChartConfig = (appointmentsData) => ({
  options: {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: 'inherit',
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
      categories: appointmentsData?.popularTimes?.map((item) => item.time) || [],
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
      max: Math.max(...(appointmentsData?.popularTimes?.map(item => item.count) || [5])) + 1,
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
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 280 },
          plotOptions: { bar: { columnWidth: "70%", borderRadius: 4 } },
          xaxis: { labels: { rotate: -60, style: { fontSize: '10px' } } },
        },
      },
    ],
  },
  series: [
    {
      name: "Bookings",
      data: appointmentsData?.popularTimes?.map((item) => item.count) || [],
    },
  ],
});




// ==========================================
// MEMBERS CHARTS - Now using processed data
// ==========================================
export const getMemberActivityChartConfig = (membersData) => ({
  options: {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: 'inherit',
    },
    colors: ["#10B981", "#3B82F6", "#EF4444", "#F59E0B"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
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
      fontSize: '12px',
    },
    tooltip: {
      theme: "dark",
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 280 },
          legend: { fontSize: '10px', position: 'bottom' },
          stroke: { width: 2 },
        },
      },
    ],
  },
  series: [
    {
      name: "Full Members",
      data: [membersData?.fullMembers || 0], // You'll need to aggregate monthly data
    },
    {
      name: "Temporary Members",
      data: [membersData?.temporaryMembers || 0],
    },
    {
      name: "Inactive",
      data: [membersData?.inactiveMembers || 0],
    },
    {
      name: "Paused",
      data: [membersData?.pausedMembers || 0],
    },
  ],
});

export const getMembersByTypeChartConfig = (membersData) => ({
  options: {
    chart: {
      type: "donut",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
    },
    colors: ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"],
    labels: membersData?.membersByType?.map((item) => item.type) || [],
    legend: {
      labels: { colors: "#9CA3AF" },
      position: "bottom",
      horizontalAlign: "center",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
              color: '#9CA3AF',
            },
            value: {
              show: true,
              fontSize: '24px',
              color: '#fff',
              formatter: (val) => val,
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total",
              fontSize: '14px',
              color: "#9CA3AF",
              formatter: () => membersData?.totalMembers?.toString() || "0",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        return opts.w.config.series[opts.seriesIndex];
      },
      style: {
        fontSize: '14px',
        colors: ["#fff"],
      },
      dropShadow: {
        enabled: false,
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#2F2F2F'],
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => `${value} members`,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  },
  series: membersData?.membersByType?.map((item) => item.count) || [],
});






// ========================================
// LEADS CHARTS - Now with data parameters
// =======================================
export const getLeadsChartConfig = (leadsData) => ({
  options: {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: 'inherit',
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
      categories: leadsData?.monthlyData?.map((item) => item.month) || [],
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
      fontSize: '12px',
    },
    tooltip: {
      theme: "dark",
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 280 },
          legend: { fontSize: '10px', position: 'bottom' },
          plotOptions: { bar: { columnWidth: "70%", borderRadius: 4 } },
        },
      },
    ],
  },
  series: [
    {
      name: "New Leads",
      data: leadsData?.monthlyData?.map((item) => item.newLeads) || [],
    },
    {
      name: "Converted",
      data: leadsData?.monthlyData?.map((item) => item.converted) || [],
    },
  ],
});

export const getConversionRateChartConfig = (leadsData) => ({
  options: {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: 'inherit',
    },
    colors: ["#10B981"],
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: leadsData?.monthlyData?.map((item) => item.month) || [],
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
    legend: {
      labels: { colors: "#9CA3AF" },
      position: "top",
      horizontalAlign: "center",
      fontSize: '12px',
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => `${value}%`,
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 280 },
          stroke: { width: 2 },
        },
      },
    ],
  },
  series: [
    {
      name: "Conversion Rate",
      data: leadsData?.monthlyData?.map((item) => item.convertedPercent) || [],
    },
  ],
});

// // Source distribution chart (optional - can be added to Leads tab)
// export const getLeadsBySourceChartConfig = (leadsData) => ({
//   options: {
//     chart: {
//       type: "pie",
//       height: 350,
//       toolbar: { show: false },
//       background: "transparent",
//     },
//     colors: ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EF4444"],
//     labels: Object.keys(leadsData?.bySource || {}),
//     legend: {
//       labels: { colors: "#9CA3AF" },
//       position: "bottom",
//       horizontalAlign: "center",
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: (val, opts) => {
//         return opts.w.config.series[opts.seriesIndex];
//       },
//       style: {
//         fontSize: '12px',
//         colors: ["#fff"],
//       },
//     },
//     tooltip: {
//       theme: "dark",
//       y: {
//         formatter: (value) => `${value} leads`,
//       },
//     },
//     responsive: [
//       {
//         breakpoint: 480,
//         options: {
//           chart: {
//             width: 300,
//           },
//           legend: {
//             position: "bottom",
//           },
//         },
//       },
//     ],
//   },
//   series: Object.values(leadsData?.bySource || []),
// });




// FINANCES CHARTS - These use static financesData
export const getTopServicesByRevenueChartConfig = () => ({
  options: {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: 'inherit',
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
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 280 },
          plotOptions: { bar: { borderRadius: 4 } },
          yaxis: { labels: { style: { fontSize: '10px' } } },
        },
      },
    ],
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
      fontFamily: 'inherit',
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
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { height: 280 },
          plotOptions: { bar: { columnWidth: "70%", borderRadius: 4 } },
          xaxis: { labels: { rotate: -60, style: { fontSize: '8px' } } },
        },
      },
    ],
  },
  series: [
    {
      name: "Units Sold",
      data: financesData.mostFrequentlySold.map((item) => item.count),
    },
  ],
});

// Lead Origin Map Data - Stuttgart and surrounding areas
export const leadOriginMapData = {
  // Studio location (Stuttgart city center)
  studioLocation: {
    lat: 48.7758,
    lng: 9.1829,
    name: "Your Studio",
    address: "Stuttgart Mitte"
  },
  // Regions around Stuttgart with lead counts
  regions: [
    { name: "Stuttgart-Mitte", lat: 48.7758, lng: 9.1829, leads: 85 },
    { name: "Stuttgart-West", lat: 48.7731, lng: 9.1577, leads: 42 },
    { name: "Stuttgart-Ost", lat: 48.7856, lng: 9.2108, leads: 38 },
    { name: "Stuttgart-Süd", lat: 48.7544, lng: 9.1694, leads: 35 },
    { name: "Stuttgart-Nord", lat: 48.7958, lng: 9.1794, leads: 28 },
    { name: "Bad Cannstatt", lat: 48.8044, lng: 9.2194, leads: 45 },
    { name: "Vaihingen", lat: 48.7294, lng: 9.1094, leads: 32 },
    { name: "Feuerbach", lat: 48.8108, lng: 9.1544, leads: 25 },
    { name: "Degerloch", lat: 48.7458, lng: 9.1708, leads: 22 },
    { name: "Zuffenhausen", lat: 48.8294, lng: 9.1708, leads: 18 },
    { name: "Esslingen", lat: 48.7406, lng: 9.3108, leads: 28 },
    { name: "Ludwigsburg", lat: 48.8975, lng: 9.1922, leads: 22 },
    { name: "Böblingen", lat: 48.6856, lng: 9.0144, leads: 15 },
    { name: "Fellbach", lat: 48.8108, lng: 9.2756, leads: 20 },
    { name: "Sindelfingen", lat: 48.7131, lng: 9.0028, leads: 12 },
    { name: "Waiblingen", lat: 48.8306, lng: 9.3169, leads: 18 },
  ],
  totalLeads: 485
};