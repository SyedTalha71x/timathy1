/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { FaCalendarAlt, FaDollarSign, FaUserPlus, FaUsers } from "react-icons/fa";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

// Fixed Members by Type Chart Config
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
              formatter: () => membersData.totalMembers.toString(),
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

// Helper function to get color based on lead count
const getHeatColor = (count, maxCount) => {
  const intensity = count / maxCount;
  if (intensity > 0.7) return { fill: '#f97316', border: '#ea580c', opacity: 0.7 }; // Orange - high
  if (intensity > 0.4) return { fill: '#fb923c', border: '#f97316', opacity: 0.6 }; // Light orange - medium
  if (intensity > 0.2) return { fill: '#fdba74', border: '#fb923c', opacity: 0.5 }; // Lighter orange - low-medium
  return { fill: '#fed7aa', border: '#fdba74', opacity: 0.4 }; // Very light - low
};

// Helper function to get radius based on count
const getRadius = (count, maxCount) => {
  const minRadius = 400;
  const maxRadius = 1500;
  const intensity = count / maxCount;
  return minRadius + (maxRadius - minRadius) * intensity;
};

// Lead Origin Map Component using Leaflet
export const LeadOriginMap = ({ data, height = 450 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Only initialize once
    if (mapInstanceRef.current) return;

    // Check if container exists
    if (!mapRef.current) return;

    // Find max lead count for scaling
    const maxLeads = Math.max(...data.regions.map(r => r.leads));

    // Initialize map centered on Stuttgart
    const map = L.map(mapRef.current, {
      center: [data.studioLocation.lat, data.studioLocation.lng],
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    // Add dark tile layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Add studio marker
    const studioIcon = L.divIcon({
      className: 'custom-studio-marker',
      html: `
        <div style="
          background: #3b82f6;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    L.marker([data.studioLocation.lat, data.studioLocation.lng], { icon: studioIcon })
      .addTo(map)
      .bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <strong style="font-size: 14px;">${data.studioLocation.name}</strong><br/>
          <span style="color: #666; font-size: 12px;">${data.studioLocation.address}</span>
        </div>
      `);

    // Add distance circles (5km, 10km, 15km)
    const distanceCircles = [
      { radius: 5000, label: '5 km' },
      { radius: 10000, label: '10 km' },
      { radius: 15000, label: '15 km' },
    ];

    distanceCircles.forEach(({ radius, label }) => {
      L.circle([data.studioLocation.lat, data.studioLocation.lng], {
        radius: radius,
        color: '#4b5563',
        weight: 1,
        fillColor: 'transparent',
        fillOpacity: 0,
        dashArray: '5, 5',
      }).addTo(map);
    });

    // Add region circles (heatmap style)
    data.regions.forEach((region) => {
      const color = getHeatColor(region.leads, maxLeads);
      const radius = getRadius(region.leads, maxLeads);

      L.circle([region.lat, region.lng], {
        radius: radius,
        color: color.border,
        weight: 2,
        fillColor: color.fill,
        fillOpacity: color.opacity,
      })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 120px; padding: 8px;">
            <strong style="font-size: 14px; color: #333;">${region.name}</strong>
            <hr style="margin: 8px 0; border-color: #eee;"/>
            <div style="display: flex; justify-content: space-between; margin: 4px 0;">
              <span style="color: #666;">Leads:</span>
              <strong style="color: #f97316;">${region.leads}</strong>
            </div>
          </div>
        `);
    });

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <div className="bg-[#2F2F2F] rounded-xl p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h3 className="text-lg font-semibold text-white">Lead Origin</h3>
        <div className="text-sm text-gray-400">
          Total: <span className="font-bold text-orange-400">{data.totalLeads}</span> leads
        </div>
      </div>
      
      {/* Map Container */}
      <div 
        ref={mapRef} 
        style={{ height: `${height}px`, width: '100%' }}
        className="rounded-xl overflow-hidden"
      />
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
            <span className="text-xs text-gray-400">Studio</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Density:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-200 opacity-60"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-400 opacity-70"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500 opacity-80"></div>
              <span>High</span>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          Click on areas to see details
        </div>
      </div>
    </div>
  );
};
