/* eslint-disable no-unused-vars */

import { useState, useRef, useEffect } from "react"
import { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import Chart from "react-apexcharts"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { 
  Calendar, 
  Users, 
  UserPlus, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  CreditCard
} from "lucide-react"

import { trainingVideosData } from "../../utils/studio-states/training-states"
import { appointmentsData, leadOriginMapData } from "../../utils/studio-states/analytics-states"
import {
  tabs,
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
  getMostFrequentlySoldChartConfig
} from "../../utils/studio-states/analytics-states"

// ==============================
// STAT CARD COMPONENT - Compact Version
// ==============================
const StatCard = ({ title, value, change, icon: Icon, prefix = "", suffix = "", iconBg = "bg-blue-500/20", iconColor = "text-blue-400" }) => {
  const isPositive = change > 0
  const isNeutral = change === 0

  return (
    <div className="bg-surface-card rounded-xl p-3 sm:p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 ${iconBg} rounded-lg flex-shrink-0`}>
          <Icon size={18} className={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-bold text-content-primary">
              {prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}
            </h3>
            {change !== undefined && (
              <span className={`flex items-center text-xs px-1.5 py-0.5 rounded ${
                isNeutral 
                  ? "text-content-muted bg-gray-500/20" 
                  : isPositive 
                    ? "text-green-400 bg-green-500/20" 
                    : "text-red-400 bg-red-500/20"
              }`}>
                {isNeutral ? "—" : isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {!isNeutral && <span>{Math.abs(change)}%</span>}
              </span>
            )}
          </div>
          <p className="text-content-muted text-xs sm:text-sm truncate">{title}</p>
        </div>
      </div>
    </div>
  )
}

// ==============================
// CHART CARD COMPONENT
// ==============================
const ChartCard = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-surface-card rounded-xl p-4 sm:p-6 ${className}`}>
      <h3 className="text-base sm:text-lg font-semibold text-content-primary mb-4">{title}</h3>
      {children}
    </div>
  )
}

// ==============================
// LEAD ORIGIN MAP HELPERS
// ==============================
const getHeatColor = (count, maxCount) => {
  const intensity = count / maxCount;
  if (intensity > 0.7) return { fill: '#f97316', border: '#ea580c', opacity: 0.7 };
  if (intensity > 0.4) return { fill: '#fb923c', border: '#f97316', opacity: 0.6 };
  if (intensity > 0.2) return { fill: '#fdba74', border: '#fb923c', opacity: 0.5 };
  return { fill: '#fed7aa', border: '#fdba74', opacity: 0.4 };
};

const getRadius = (count, maxCount) => {
  const minRadius = 400;
  const maxRadius = 1500;
  const intensity = count / maxCount;
  return minRadius + (maxRadius - minRadius) * intensity;
};

// ==============================
// LEAD ORIGIN MAP COMPONENT
// ==============================
const LeadOriginMap = ({ data, height = 450 }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;
    if (!mapRef.current) return;

    const maxLeads = Math.max(...data.regions.map(r => r.leads));

    const map = L.map(mapRef.current, {
      center: [data.studioLocation.lat, data.studioLocation.lng],
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    // Detect light/dark mode from CSS theme token
    const surfaceBase = getComputedStyle(document.documentElement).getPropertyValue('--color-surface-base').trim();
    const isLightMode = surfaceBase ? (() => {
      const hex = surfaceBase.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return (r + g + b) / 3 > 128;
    })() : false;

    const tileUrl = isLightMode
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Studio marker
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

    // Distance circles (5km, 10km, 15km)
    [5000, 10000, 15000].forEach((radius) => {
      L.circle([data.studioLocation.lat, data.studioLocation.lng], {
        radius,
        color: '#4b5563',
        weight: 1,
        fillColor: 'transparent',
        fillOpacity: 0,
        dashArray: '5, 5',
      }).addTo(map);
    });

    // Region circles (heatmap)
    data.regions.forEach((region) => {
      const color = getHeatColor(region.leads, maxLeads);
      const radius = getRadius(region.leads, maxLeads);

      L.circle([region.lat, region.lng], {
        radius,
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

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <div className="bg-surface-card rounded-xl p-4 sm:p-6 overflow-hidden relative z-0">
      <style>{`
        .leaflet-pane, .leaflet-top, .leaflet-bottom, .leaflet-control { z-index: 1 !important; }
        .leaflet-tile-pane { z-index: 1 !important; }
        .leaflet-overlay-pane { z-index: 2 !important; }
        .leaflet-marker-pane { z-index: 3 !important; }
        .leaflet-popup-pane { z-index: 4 !important; }
      `}</style>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h3 className="text-lg font-semibold text-content-primary">Lead Origin</h3>
        <div className="text-sm text-content-muted">
          Total: <span className="font-bold text-primary">{data.totalLeads}</span> leads
        </div>
      </div>
      
      <div className="w-full overflow-hidden rounded-xl relative" style={{ zIndex: 1 }}>
        <div 
          ref={mapRef} 
          style={{ height: `${height}px`, width: '100%', minWidth: '280px', position: 'relative', zIndex: 1 }}
          className="rounded-xl"
        />
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
            <span className="text-xs text-content-muted">Studio</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-content-muted">
            <span>Density:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-200 opacity-60"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-400 opacity-70"></div>
              <span>Med</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500 opacity-80"></div>
              <span>High</span>
            </div>
          </div>
        </div>
        <div className="text-xs text-content-faint">
          Click on areas to see details
        </div>
      </div>
    </div>
  );
};

// ==============================
// TIME PERIOD OPTIONS
// ==============================
const timePeriodOptions = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "90days", label: "Last 90 Days" },
  { value: "thisMonth", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
  { value: "thisYear", label: "This Year" },
  { value: "lastYear", label: "Last Year" },
  { value: "allTime", label: "All Time" },
]

export default function AnalyticsDashboard() {
  // ==============================
  // NAVIGATION HOOK
  // ==============================
  const navigate = useNavigate()

  // ==============================
  // COMPONENT STATES
  // ==============================
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const analyticsFilterRef = useRef(null)
  const [activeTab, setActiveTab] = useState("Appointments")
  
  // New states for enhanced features
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("thisMonth")
  const [isTimePeriodDropdownOpen, setIsTimePeriodDropdownOpen] = useState(false)
  const timePeriodRef = useRef(null)

  // Get training videos data
  const trainingVideos = trainingVideosData

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timePeriodRef.current && !timePeriodRef.current.contains(event.target)) {
        setIsTimePeriodDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])


  // ==============================
  // CHART CONFIGURATIONS WITH RESPONSIVE OPTIONS
  // ==============================
  const getResponsiveChartHeight = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 ? 280 : 350
    }
    return 350
  }

  const monthlyBreakdownChart = getMonthlyBreakdownChartConfig()
  const popularTimesChart = getPopularTimesChartConfig()
  const memberActivityChart = getMemberActivityChartConfig()
  const membersByTypeChart = getMembersByTypeChartConfig()
  const leadsChart = getLeadsChartConfig()
  const conversionRateChart = getConversionRateChartConfig()
  const topServicesByRevenueChart = getTopServicesByRevenueChartConfig()
  const mostFrequentlySoldChart = getMostFrequentlySoldChartConfig()

  // ==============================
  // TAB ICONS MAPPING
  // ==============================
  const tabIcons = {
    Appointments: Calendar,
    Members: Users,
    Leads: UserPlus,
    Finances: DollarSign
  }

  // ==============================
  // RENDER FUNCTIONS
  // ==============================
  const renderTabContent = () => {
    switch (activeTab) {
      case "Appointments":
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Stat Cards - Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <StatCard
                title="Bookings"
                value={appointmentsData.totals.bookings}
                change={12}
                icon={CalendarDays}
                iconBg="bg-blue-500/20"
                iconColor="text-blue-400"
              />
              <StatCard
                title="Check-ins"
                value={appointmentsData.totals.checkIns}
                change={8}
                icon={UserCheck}
                iconBg="bg-green-500/20"
                iconColor="text-green-400"
              />
              <StatCard
                title="Cancellations"
                value={appointmentsData.totals.cancellations}
                change={-15}
                icon={UserX}
                iconBg="bg-red-500/20"
                iconColor="text-red-400"
              />
              <StatCard
                title="Late Cancellations"
                value={appointmentsData.totals.lateCancellations}
                change={0}
                icon={Clock}
                iconBg="bg-yellow-500/20"
                iconColor="text-yellow-400"
              />
              <StatCard
                title="No Shows"
                value={appointmentsData.totals.noShows}
                change={0}
                icon={AlertCircle}
                iconBg="bg-primary/20"
                iconColor="text-primary"
              />
            </div>

            {/* Monthly Breakdown Chart */}
            <ChartCard title="Monthly Breakdown">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[500px] sm:min-w-0">
                  <Chart
                    options={{
                      ...monthlyBreakdownChart.options,
                      chart: {
                        ...monthlyBreakdownChart.options.chart,
                        height: getResponsiveChartHeight(),
                      }
                    }}
                    series={monthlyBreakdownChart.series}
                    type="line"
                    height={getResponsiveChartHeight()}
                  />
                </div>
              </div>
            </ChartCard>

            {/* Popular Booking Times Chart */}
            <ChartCard title="Most Popular Booking Times">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[400px] sm:min-w-0">
                  <Chart 
                    options={{
                      ...popularTimesChart.options,
                      chart: {
                        ...popularTimesChart.options.chart,
                        height: getResponsiveChartHeight(),
                      },
                      stroke: { show: false, width: 0 }
                    }}
                    series={popularTimesChart.series} 
                    type="bar" 
                    height={getResponsiveChartHeight()}
                  />
                </div>
              </div>
            </ChartCard>
          </div>
        )

      case "Members":
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Total Members Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <StatCard
                title="Total Members"
                value={membersData.totalMembers}
                change={18}
                icon={Users}
                iconBg="bg-blue-500/20"
                iconColor="text-blue-400"
              />
            </div>

            {/* Member Activity Chart */}
            <ChartCard title="Member Activity">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[500px] sm:min-w-0">
                  <Chart
                    options={{
                      ...memberActivityChart.options,
                      chart: {
                        ...memberActivityChart.options.chart,
                        height: getResponsiveChartHeight(),
                      }
                    }}
                    series={memberActivityChart.series}
                    type="line"
                    height={getResponsiveChartHeight()}
                  />
                </div>
              </div>
            </ChartCard>

            {/* Members by Type Chart */}
            <ChartCard title="Members by Membership Type">
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <Chart
                    options={{
                      ...membersByTypeChart.options,
                      stroke: { show: false, width: 0 }
                    }}
                    series={membersByTypeChart.series}
                    type="donut"
                    height={320}
                  />
                </div>
              </div>
            </ChartCard>
          </div>
        )

      case "Leads":
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Total Leads Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <StatCard
                title="Total Leads"
                value={leadsData.totalLeads}
                change={24}
                icon={UserPlus}
                iconBg="bg-blue-500/20"
                iconColor="text-blue-400"
              />
            </div>

            {/* Lead Origin Map */}
            <LeadOriginMap data={leadOriginMapData} height={350} />

            {/* New Leads & Converted Chart */}
            <ChartCard title="New Leads & Converted">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[500px] sm:min-w-0">
                  <Chart 
                    options={{
                      ...leadsChart.options,
                      chart: {
                        ...leadsChart.options.chart,
                        height: getResponsiveChartHeight(),
                      },
                      stroke: { show: false, width: 0 }
                    }}
                    series={leadsChart.series} 
                    type="bar" 
                    height={getResponsiveChartHeight()}
                  />
                </div>
              </div>
            </ChartCard>

            {/* Conversion Rate Chart */}
            <ChartCard title="Conversion Rate (%)">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[500px] sm:min-w-0">
                  <Chart
                    options={{
                      ...conversionRateChart.options,
                      chart: {
                        ...conversionRateChart.options.chart,
                        height: getResponsiveChartHeight(),
                      }
                    }}
                    series={conversionRateChart.series}
                    type="line"
                    height={getResponsiveChartHeight()}
                  />
                </div>
              </div>
            </ChartCard>
          </div>
        )

      case "Finances":
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* Financial Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <StatCard
                title="Total Revenue"
                value={financesData.totalRevenue}
                change={22}
                icon={DollarSign}
                prefix="$"
                iconBg="bg-green-500/20"
                iconColor="text-green-400"
              />
              <StatCard
                title="Avg Revenue/Member"
                value={financesData.averageRevenuePerMember.toFixed(2)}
                change={5}
                icon={CreditCard}
                prefix="$"
                iconBg="bg-blue-500/20"
                iconColor="text-blue-400"
              />
              <StatCard
                title="Outstanding Payments"
                value={financesData.outstandingPayments}
                change={-8}
                icon={AlertCircle}
                prefix="$"
                iconBg="bg-red-500/20"
                iconColor="text-red-400"
              />
            </div>

            {/* Top Services by Revenue Chart */}
            <ChartCard title="Top Services/Products by Revenue">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[400px] sm:min-w-0">
                  <Chart
                    options={{
                      ...topServicesByRevenueChart.options,
                      chart: {
                        ...topServicesByRevenueChart.options.chart,
                        height: getResponsiveChartHeight(),
                      },
                      stroke: { show: false, width: 0 }
                    }}
                    series={topServicesByRevenueChart.series}
                    type="bar"
                    height={getResponsiveChartHeight()}
                  />
                </div>
              </div>
            </ChartCard>

            {/* Most Frequently Sold Chart */}
            <ChartCard title="Most Frequently Sold">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[400px] sm:min-w-0">
                  <Chart
                    options={{
                      ...mostFrequentlySoldChart.options,
                      chart: {
                        ...mostFrequentlySoldChart.options.chart,
                        height: getResponsiveChartHeight(),
                      },
                      stroke: { show: false, width: 0 }
                    }}
                    series={mostFrequentlySoldChart.series}
                    type="bar"
                    height={getResponsiveChartHeight()}
                  />
                </div>
              </div>
            </ChartCard>
          </div>
        )

      default:
        return null
    }
  }

  // ==============================
  // MAIN COMPONENT RETURN
  // ==============================
  return (
    <>
      <style>
        {`
          @keyframes wobble {
            0%, 100% { transform: rotate(0deg); }
            15% { transform: rotate(-1deg); }
            30% { transform: rotate(1deg); }
            45% { transform: rotate(-1deg); }
            60% { transform: rotate(1deg); }
            75% { transform: rotate(-1deg); }
            90% { transform: rotate(1deg); }
          }
          .animate-wobble {
            animation: wobble 0.5s ease-in-out infinite;
          }
          .dragging {
            opacity: 0.5;
            border: 2px dashed #fff;
          }
          .drag-over {
            border: 2px dashed #888;
          }
          /* Hide scrollbar but keep functionality */
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <div className="min-h-screen rounded-3xl bg-surface-base text-content-primary p-3 md:p-6 transition-all duration-500 ease-in-out flex-1">
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        <div className="space-y-4 sm:space-y-6">
          {/* ============================== */}
          {/* HEADER */}
          {/* ============================== */}
          <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-content-primary oxanium_font text-xl md:text-2xl">Analytics</h1>
              
              {/* Time Period Filter - inline with title */}
              <div className="relative" ref={timePeriodRef}>
                <button
                  onClick={() => setIsTimePeriodDropdownOpen(!isTimePeriodDropdownOpen)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-surface-card hover:bg-surface-hover rounded-xl text-sm text-content-primary transition-colors"
                >
                  <Calendar size={16} className="text-content-muted" />
                  <span>
                    {timePeriodOptions.find(o => o.value === selectedTimePeriod)?.label}
                  </span>
                  <ChevronDown size={16} className={`text-content-muted transition-transform ${isTimePeriodDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isTimePeriodDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-surface-card rounded-xl shadow-lg border border-border-subtle z-50 overflow-hidden">
                    {timePeriodOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedTimePeriod(option.value)
                          setIsTimePeriodDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-surface-hover transition-colors ${
                          selectedTimePeriod === option.value 
                            ? 'bg-primary/20 text-primary' 
                            : 'text-content-primary'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ============================== */}
          {/* TAB NAVIGATION */}
          {/* ============================== */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
            {tabs.map((tab) => {
              const Icon = tabIcons[tab.name] || tab.icon
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.name
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "bg-surface-card text-content-muted hover:bg-surface-hover hover:text-content-primary"
                  }`}
                >
                  <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                  {tab.name}
                </button>
              )
            })}
          </div>

          {/* ============================== */}
          {/* TAB CONTENT */}
          {/* ============================== */}
          <div>{renderTabContent()}</div>
        </div>
      </div>

    </>
  )
}
