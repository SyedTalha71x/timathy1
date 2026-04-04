/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react"

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

// ✅ Import shared data from analytics-states
import {
  tabs,
  processAppointmentsData,
  processMembersData,
  processLeadsData,
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
import { useDispatch, useSelector } from "react-redux"
import { fetchAllAppointments } from "../../../features/appointments/AppointmentSlice"
import { fetchAllMember } from "../../../features/member/memberSlice"
import { fetchAllLeadsThunk } from "../../../features/lead/leadSlice"
import ReactApexChart from "react-apexcharts"
import { useTranslation } from "react-i18next"

// ✅ Extended dropdown options - built inside component for i18n access
const getDropdownOptions = (t) => ({
  Appointments: [
    { value: "overview", label: t("myArea.analyticsWidget.options.overview"), type: t("myArea.analyticsWidget.types.stats") },
    { value: "monthlyBreakdown", label: t("myArea.analyticsWidget.options.monthlyBreakdown"), type: t("myArea.analyticsWidget.types.chart") },
    { value: "popularTimes", label: t("myArea.analyticsWidget.options.popularTimes"), type: t("myArea.analyticsWidget.types.chart") },
  ],
  Members: [
    { value: "overview", label: t("myArea.analyticsWidget.options.overview"), type: t("myArea.analyticsWidget.types.stats") },
    { value: "memberActivity", label: t("myArea.analyticsWidget.options.memberActivity"), type: t("myArea.analyticsWidget.types.chart") },
    { value: "membersByType", label: t("myArea.analyticsWidget.options.membersByType"), type: t("myArea.analyticsWidget.types.chart") },
  ],
  Leads: [
    { value: "overview", label: t("myArea.analyticsWidget.options.overview"), type: t("myArea.analyticsWidget.types.stats") },
    { value: "newVsConverted", label: t("myArea.analyticsWidget.options.newVsConverted"), type: t("myArea.analyticsWidget.types.chart") },
    { value: "conversionRate", label: t("myArea.analyticsWidget.options.conversionRate"), type: t("myArea.analyticsWidget.types.chart") },
  ],
  Finances: [
    { value: "overview", label: t("myArea.analyticsWidget.options.overview"), type: t("myArea.analyticsWidget.types.stats") },
    { value: "topServices", label: t("myArea.analyticsWidget.options.topServices"), type: t("myArea.analyticsWidget.types.chart") },
    { value: "mostSold", label: t("myArea.analyticsWidget.options.mostSold"), type: t("myArea.analyticsWidget.types.chart") },
  ],
})

// ✅ Mini Stat Card Component for Overview
const MiniStatCard = ({ title, value, icon: Icon, iconBg, iconColor, change, isMobile }) => {
  const isPositive = change > 0
  const isNeutral = change === 0 || change === undefined

  return (
    <div className="bg-surface-card rounded-xl p-2 sm:p-3">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 sm:p-2 ${iconBg} rounded-lg flex-shrink-0`}>
          <Icon size={isMobile ? 14 : 16} className={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm sm:text-base font-bold text-content-primary truncate">
              {value}
            </span>
            {!isNeutral && (
              <span className={`flex items-center text-[10px] px-1 py-0.5 rounded ${isPositive ? "text-accent-green bg-accent-green/20" : "text-accent-red bg-accent-red/20"
                }`}>
                {isPositive ? "↑" : "↓"}{Math.abs(change)}%
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-content-muted truncate">{title}</p>
        </div>
      </div>
    </div>
  )
}

// ✅ Hero Stat Card for Members/Leads Overview
const HeroStatCard = ({ title, value, icon: Icon, change, isMobile }) => {
  return (
    <div className="bg-gradient-to-br from-primary/20 to-primary/30 border border-primary/30 rounded-xl p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-3 bg-primary/20 rounded-xl">
            <Icon size={isMobile ? 20 : 24} className="text-primary" />
          </div>
          <div>
            <p className="text-primary text-[10px] sm:text-xs">{title}</p>
            <div className="text-2xl sm:text-3xl font-bold text-content-primary">{value}</div>
          </div>
        </div>
        {change && (
          <div className="flex items-center gap-1 bg-accent-green/20 px-2 py-1 rounded-lg">
            <TrendingUp className="text-accent-green" size={14} />
            <span className="text-accent-green text-xs font-semibold">+{change}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AnalyticsChartWidget({ isEditing, onRemove }) {
  const { appointments = [] } = useSelector((state) => state.appointments || {})
  const { members = [] } = useSelector((state) => state.member || {})
  const { leads = [] } = useSelector((state) => state.leads || {})
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const dropdownOptions = getDropdownOptions(t)

  // Helper: translate member type strings from backend
  const translateMemberType = (typeStr) => {
    if (!typeStr) return typeStr
    const key = `myArea.analyticsWidget.memberTypes.${typeStr.toLowerCase()}`
    const translated = t(key, { defaultValue: "" })
    return translated || typeStr
  }

  const [activeTab, setActiveTab] = useState("Members")
  const [selectedOption, setSelectedOption] = useState("memberActivity")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const dropdownRef = useRef(null)
  const [membersData, setMembersData] = useState({
    totalMembers: 0,
    fullMembers: 0,
    temporaryMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    pausedMembers: 0,
    membersByType: []
  });

  const [appointmentData, setAppointmentData] = useState({
    totals: {
      bookings: 0,
      checkIns: 0,
      cancellations: 0,
      lateCancellations: 0,
      noShows: 0,
    },
    monthlyBreakdown: [],
    popularTimes: []
  });

  const [leadsData, setLeadsData] = useState({
    totalLeads: 0,
    convertedLeads: 0,
    activeLeads: 0,
    passiveLeads: 0,
    conversionRate: 0,
    bySource: {},
    monthlyData: []
  });

  // ===============================
  // Fetch All Data From Redux State
  // ===============================

  useEffect(() => {
    dispatch(fetchAllAppointments())
    dispatch(fetchAllMember())
    dispatch(fetchAllLeadsThunk())
  }, [dispatch])

  // ========================
  // Appointment Data
  // ========================
  useEffect(() => {
    if (appointments && appointments.length > 0) {
      const result = processAppointmentsData(appointments);
      setAppointmentData(result);
    }
  }, [appointments]);

  // ========================
  // Member Data
  // ========================

  useEffect(() => {
    if (members && members.length > 0) {
      const processed = processMembersData(members);
      setMembersData(processed);
    }
  }, [members]);

  // ========================
  // Leads Data
  // ========================
  useEffect(() => {
    if (leads && leads.length > 0) {
      const processed = processLeadsData(leads);
      setLeadsData(processed);
    }
  }, [leads]);


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

  // ✅ Navigate to previous/next option
  const navigateOption = (direction) => {
    const options = dropdownOptions[activeTab]
    const currentIndex = options.findIndex(opt => opt.value === selectedOption)
    let newIndex = currentIndex + direction

    if (newIndex < 0) newIndex = options.length - 1
    if (newIndex >= options.length) newIndex = 0

    setSelectedOption(options[newIndex].value)
  }

  // ✅ Get chart configuration
  const getChartConfig = () => {
    const widgetHeight = isMobile ? 200 : 260

    // Helper: translate a single label string (months, days, series names, etc.)
    const tLabel = (label) => {
      if (!label || typeof label !== 'string') return label
      // Try months
      const monthKey = `myArea.analyticsWidget.chartLabels.months.${label}`
      const monthVal = t(monthKey, { defaultValue: "" })
      if (monthVal) return monthVal
      // Try series names
      const seriesKey = `myArea.analyticsWidget.chartLabels.series.${label}`
      const seriesVal = t(seriesKey, { defaultValue: "" })
      if (seriesVal) return seriesVal
      // Try days
      const dayKey = `myArea.analyticsWidget.chartLabels.days.${label}`
      const dayVal = t(dayKey, { defaultValue: "" })
      if (dayVal) return dayVal
      // Try time slots
      const timeKey = `myArea.analyticsWidget.chartLabels.timeSlots.${label}`
      const timeVal = t(timeKey, { defaultValue: "" })
      if (timeVal) return timeVal
      // Try member types
      return translateMemberType(label)
    }

    // Helper: translate xaxis categories array
    const translateCategories = (options) => {
      if (!options?.xaxis?.categories) return options
      return {
        ...options,
        xaxis: {
          ...options.xaxis,
          categories: options.xaxis.categories.map(c => tLabel(c))
        }
      }
    }

    // Helper: translate series names
    const translateSeries = (series) => {
      if (!Array.isArray(series)) return series
      return series.map(s => {
        if (typeof s === 'object' && s.name) {
          return { ...s, name: tLabel(s.name) }
        }
        return s
      })
    }

    // Helper: translate labels array (for donut/pie charts)
    const translateLabels = (options) => {
      if (!options?.labels) return options
      return {
        ...options,
        labels: options.labels.map(l => tLabel(l))
      }
    }

    const widgetOverrides = {
      chart: {
        height: widgetHeight,
        toolbar: { show: false },
        defaultLocale: 'de',
        locales: [{
          name: 'de',
          options: {
            months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            shortMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
            days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
            shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
            toolbar: {
              exportToSVG: 'SVG herunterladen',
              exportToPNG: 'PNG herunterladen',
              exportToCSV: 'CSV herunterladen',
              menu: 'Menü',
              selection: 'Auswahl',
              selectionZoom: 'Auswahl-Zoom',
              zoomIn: 'Vergrößern',
              zoomOut: 'Verkleinern',
              pan: 'Verschieben',
              reset: 'Zoom zurücksetzen'
            }
          }
        }]
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
            const config = getMonthlyBreakdownChartConfig(appointmentData)
            const opts = translateCategories({ ...config.options })
            return {
              options: {
                ...opts,
                chart: { ...opts.chart, ...widgetOverrides.chart },
                legend: { ...opts.legend, ...widgetOverrides.legend },
                stroke: { ...opts.stroke, ...widgetOverrides.stroke },
              },
              series: translateSeries(config.series),
              type: "line",
            }
          }
          case "popularTimes": {
            const config = getPopularTimesChartConfig(appointmentData)
            const opts = translateCategories({ ...config.options })
            return {
              options: {
                ...opts,
                chart: { ...opts.chart, ...widgetOverrides.chart },
                plotOptions: {
                  bar: { borderRadius: 4, columnWidth: isMobile ? "70%" : "60%" },
                },
              },
              series: translateSeries(config.series),
              type: "bar",
            }
          }
        }
        break

      case "Members":
        switch (selectedOption) {
          case "memberActivity": {
            const config = getMemberActivityChartConfig(membersData)
            const opts = translateCategories({ ...config.options })
            return {
              options: {
                ...opts,
                chart: { ...opts.chart, ...widgetOverrides.chart },
                legend: { ...opts.legend, ...widgetOverrides.legend },
                stroke: { ...opts.stroke, ...widgetOverrides.stroke },
              },
              series: translateSeries(config.series),
              type: "line",
            }
          }
          case "membersByType": {
            const config = getMembersByTypeChartConfig(membersData)
            const opts = translateLabels(translateCategories({ ...config.options }))
            return {
              options: {
                ...opts,
                chart: { ...opts.chart, ...widgetOverrides.chart },
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
                          label: t("common.all"),
                          color: getComputedStyle(document.documentElement).getPropertyValue('--color-content-muted').trim() || "#9CA3AF",
                          fontSize: isMobile ? "11px" : "12px",
                          formatter: () => membersData.totalMembers.toString(),
                        },
                      },
                    },
                  },
                },
                dataLabels: { enabled: false },
                stroke: { show: false, width: 0 },
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
            const config = getLeadsChartConfig(leadsData)
            const opts = translateCategories({ ...config.options })
            return {
              options: {
                ...opts,
                chart: { ...opts.chart, ...widgetOverrides.chart },
                legend: { ...opts.legend, ...widgetOverrides.legend },
                plotOptions: {
                  bar: { borderRadius: 4, columnWidth: isMobile ? "70%" : "60%" },
                },
              },
              series: translateSeries(config.series),
              type: "bar",
            }
          }
          case "conversionRate": {
            const config = getConversionRateChartConfig(leadsData)
            const opts = translateCategories({ ...config.options })
            return {
              options: {
                ...opts,
                chart: { ...opts.chart, ...widgetOverrides.chart },
                stroke: { ...opts.stroke, ...widgetOverrides.stroke },
              },
              series: translateSeries(config.series),
              type: "line",
            }
          }
        }
        break

      case "Finances":
        switch (selectedOption) {
          case "topServices": {
            const config = getTopServicesByRevenueChartConfig()
            const opts = translateCategories({ ...config.options })
            return {
              options: {
                ...opts,
                chart: { ...opts.chart, ...widgetOverrides.chart },
                plotOptions: {
                  bar: { borderRadius: 4, horizontal: true },
                },
              },
              series: translateSeries(config.series),
              type: "bar",
            }
          }
          case "mostSold": {
            const config = getMostFrequentlySoldChartConfig()
            const opts = translateCategories({ ...config.options })
            return {
              options: {
                ...opts,
                chart: { ...opts.chart, ...widgetOverrides.chart },
                plotOptions: {
                  bar: { borderRadius: 4, columnWidth: isMobile ? "70%" : "60%" },
                },
              },
              series: translateSeries(config.series),
              type: "bar",
            }
          }
        }
        break
    }
    return null
  }

  // ✅ Render Overview Stats based on active tab
  const renderOverviewStats = () => {
    switch (activeTab) {
      case "Appointments":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <MiniStatCard
              title={t("myArea.analyticsWidget.stats.totalBookings")}
              value={appointmentData.totals.bookings}
              icon={CalendarDays}
              iconBg="bg-primary/20"
              iconColor="text-primary"
              change={12}
              isMobile={isMobile}
            />
            <MiniStatCard
              title={t("myArea.analyticsWidget.stats.checkIns")}
              value={appointmentData.totals.checkIns}
              icon={UserCheck}
              iconBg="bg-accent-green/20"
              iconColor="text-accent-green"
              change={8}
              isMobile={isMobile}
            />
            <MiniStatCard
              title={t("myArea.analyticsWidget.stats.cancellations")}
              value={appointmentData.totals.cancellations}
              icon={UserX}
              iconBg="bg-accent-red/20"
              iconColor="text-accent-red"
              change={-15}
              isMobile={isMobile}
            />
            <MiniStatCard
              title={t("myArea.analyticsWidget.stats.lateCancellations")}
              value={appointmentData.totals.lateCancellations}
              icon={Clock}
              iconBg="bg-accent-yellow/20"
              iconColor="text-accent-yellow"
              isMobile={isMobile}
            />
            <MiniStatCard
              title={t("myArea.analyticsWidget.stats.noShows")}
              value={appointmentData.totals.noShows}
              icon={AlertCircle}
              iconBg="bg-primary/20"
              iconColor="text-primary"
              isMobile={isMobile}
            />
          </div>
        )

      case "Members":
        return (
          <div className="space-y-3">
            <MiniStatCard
              title={t("myArea.analyticsWidget.stats.totalMembers")}
              value={membersData.totalMembers}
              icon={Users}
              iconBg="bg-primary/20"
              iconColor="text-primary"
              change={18}
              isMobile={isMobile}
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {membersData.membersByType.map((type, index) => (
                <div key={type.type} className="bg-surface-card rounded-xl p-2 text-center">
                  <div className="text-sm sm:text-base font-bold text-content-primary">{type.count}</div>
                  <div className="text-[10px] sm:text-xs text-content-muted">{translateMemberType(type.type)}</div>
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
            <MiniStatCard
              title={t("myArea.analyticsWidget.stats.totalLeads")}
              value={leadsData.totalLeads}
              icon={UserPlus}
              iconBg="bg-primary/20"
              iconColor="text-primary"
              change={24}
              isMobile={isMobile}
            />
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-card rounded-xl p-2 text-center">
                <div className="text-sm sm:text-base font-bold text-accent-green">{totalConverted}</div>
                <div className="text-[10px] sm:text-xs text-content-muted">{t("myArea.analyticsWidget.stats.converted")}</div>
              </div>
              <div className="bg-surface-card rounded-xl p-2 text-center">
                <div className="text-sm sm:text-base font-bold text-primary">{avgConversion}%</div>
                <div className="text-[10px] sm:text-xs text-content-muted">{t("myArea.analyticsWidget.stats.avgRate")}</div>
              </div>
              <div className="bg-surface-card rounded-xl p-2 text-center">
                <div className="text-sm sm:text-base font-bold text-content-primary">{lastMonth.newLeads}</div>
                <div className="text-[10px] sm:text-xs text-content-muted">{t("myArea.analyticsWidget.stats.thisMonth")}</div>
              </div>
            </div>
          </div>
        )

      case "Finances":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MiniStatCard
              title={t("myArea.analyticsWidget.stats.totalRevenue")}
              value={`$${financesData.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              iconBg="bg-accent-green/20"
              iconColor="text-accent-green"
              change={22}
              isMobile={isMobile}
            />
            <MiniStatCard
              title={t("myArea.analyticsWidget.stats.avgPerMember")}
              value={`$${financesData.averageRevenuePerMember.toFixed(0)}`}
              icon={CreditCard}
              iconBg="bg-primary/20"
              iconColor="text-primary"
              change={5}
              isMobile={isMobile}
            />
            <MiniStatCard
              title={t("myArea.analyticsWidget.stats.outstanding")}
              value={`$${financesData.outstandingPayments.toLocaleString()}`}
              icon={AlertCircle}
              iconBg="bg-accent-red/20"
              iconColor="text-accent-red"
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
    <div className="p-3 sm:p-4 bg-surface-button rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base sm:text-lg font-semibold text-content-primary">{t("myArea.analyticsWidget.title")}</h2>
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
            className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${activeTab === tab.name
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "bg-surface-card text-content-muted hover:bg-surface-hover hover:text-content-primary"
              }`}
          >
            <tab.icon className="text-xs sm:text-sm" />
            <span>
              {isMobile && tab.name === "Appointments" ? t("myArea.analyticsWidget.tabs.appointmentsShort") :
                isMobile && tab.name === "Finances" ? t("myArea.analyticsWidget.tabs.financesShort") : 
                t(`myArea.analyticsWidget.tabs.${tab.name.toLowerCase()}`)}
            </span>
          </button>
        ))}
      </div>

      {/* View Selector with Navigation Arrows */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => navigateOption(-1)}
          className="p-1.5 bg-surface-card hover:bg-surface-hover rounded-lg transition-colors"
        >
          <ChevronLeft size={16} className="text-content-muted" />
        </button>

        <div className="relative flex-1" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-full px-3 py-2 bg-surface-card hover:bg-surface-hover rounded-xl text-content-primary text-xs sm:text-sm transition-colors border border-border-subtle"
          >
            <span className="truncate">
              {currentOption?.label}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] text-content-faint">
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
            <div className="absolute z-50 mt-1 w-full bg-surface-card rounded-xl shadow-lg border border-border-subtle overflow-hidden">
              {dropdownOptions[activeTab].map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedOption(option.value)
                    setIsDropdownOpen(false)
                  }}
                  className={`flex items-center justify-between w-full text-left px-3 py-2.5 text-xs sm:text-sm hover:bg-surface-hover transition-colors ${selectedOption === option.value ? "text-primary bg-primary/20" : "text-content-primary"
                    }`}
                >
                  <span>{option.label}</span>
                  <span className="text-[10px] text-content-faint capitalize">{option.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => navigateOption(1)}
          className="p-1.5 bg-surface-card hover:bg-surface-hover rounded-lg transition-colors"
        >
          <ChevronRight size={16} className="text-content-muted" />
        </button>
      </div>

      {/* Content Area */}
      <div className="w-full">
        {selectedOption === "overview" ? (
          renderOverviewStats()
        ) : (
          <div className="bg-surface-card rounded-xl p-3 sm:p-4">
            <h3 className="text-sm sm:text-base font-semibold text-content-primary mb-3">
              {currentOption?.label}
            </h3>
            <div className="overflow-x-auto">
              <div className="min-w-[280px]">
                {chartConfig && chartConfig.options && chartConfig.series && (
                  <ReactApexChart
                    options={chartConfig.options}
                    series={chartConfig.series}
                    type={chartConfig.type}
                    height={chartConfig.options?.chart?.height || (isMobile ? 200 : 260)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}