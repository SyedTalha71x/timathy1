/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { ChevronLeft, ChevronRight, X, Download, Users, Calendar, Plus, PanelLeftClose, PanelLeft, Sun, FileText, Clock } from "lucide-react"
import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import * as XLSX from 'xlsx'
import VacationCalendarModal from "./vacation-calendar-modal"
import ShiftsOverviewModal from "./shifts-overview-modal"

// Export Confirmation Modal Component
const ExportConfirmationModal = ({ isOpen, onClose, onConfirm, staffCount, totalShifts, totalHours, selectedPeriod }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000002] p-4">
      <div className="bg-[#1C1C1C] rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-medium">Confirm Export</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-300 mb-4">Are you sure you want to export the attendance data as Excel?</p>
          
          {/* Export Details */}
          <div className="space-y-2">
            {/* Selected Period Display */}
            <div className="bg-[#141414] p-3 rounded-lg flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-400 text-xs">Export Period</p>
                <p className="text-white text-sm font-medium">{selectedPeriod || "All Data"}</p>
              </div>
            </div>
            
            {/* Staff Count Display */}
            <div className="bg-[#141414] p-3 rounded-lg flex items-center gap-3">
              <Users className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-400 text-xs">Staff Members</p>
                <p className="text-white text-sm font-medium">{staffCount} {staffCount === 1 ? 'member' : 'members'}</p>
              </div>
            </div>

            {/* Total Shifts Display */}
            <div className="bg-[#141414] p-3 rounded-lg flex items-center gap-3">
              <FileText className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-400 text-xs">Total Shifts</p>
                <p className="text-white text-sm font-medium">{totalShifts} {totalShifts === 1 ? 'shift' : 'shifts'}</p>
              </div>
            </div>

            {/* Total Hours Display */}
            <div className="bg-[#141414] p-3 rounded-lg flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-400 text-xs">Total Hours</p>
                <p className="text-white text-sm font-medium">{totalHours}h</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-[#2F2F2F] text-white px-4 py-2.5 rounded-xl hover:bg-[#3F3F3F] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="flex-1 bg-gray-600 text-white px-4 py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  )
}

function StaffPlanningModal({ staffMembers, onClose }) {
  // Core state
  const [activeMenuItem, setActiveMenuItem] = useState("attendance")
  const [showVacationCalendar, setShowVacationCalendar] = useState(false)
  const [showShiftSchedule, setShowShiftSchedule] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Attendance Overview states
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedStaffId, setSelectedStaffId] = useState("all")
  const [currentOverviewMonth, setCurrentOverviewMonth] = useState(new Date())
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [exportModalOpen, setExportModalOpen] = useState(false)

  // Staff members with unique colors
  const staffMembersWithColors = useMemo(() => {
    const colors = ["#3b82f6", "#10b981", "#ef4444", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4"]
    return staffMembers.map((staff, index) => ({
      ...staff,
      color: staff.color || colors[index % colors.length]
    }))
  }, [staffMembers])

  // Updated dummy data with shifts for current month
  const dummyShiftsData = useMemo(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    
    return staffMembersWithColors.map((staff) => {
      const shifts = []
      for (let day = 1; day <= 28; day++) {
        const date = new Date(year, month, day)
        const dayOfWeek = date.getDay()
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          if (Math.random() > 0.3) {
            const startHour = 7 + Math.floor(Math.random() * 3)
            const endHour = startHour + 8
            shifts.push({
              date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
              startTime: `${String(startHour).padStart(2, "0")}:00`,
              endTime: `${String(endHour).padStart(2, "0")}:00`,
              hoursWorked: 8,
              status: day < today.getDate() ? "completed" : "scheduled"
            })
          }
        }
      }
      return { ...staff, shifts }
    })
  }, [staffMembersWithColors])

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period)
    if (period === "month") {
      setCurrentDate(new Date())
    } else if (period === "week") {
      setCurrentDate(new Date())
    } else if (period === "year") {
      setSelectedYear(new Date().getFullYear())
    } else if (period === "custom") {
      // Initialize custom dates if empty
      if (!customStartDate) {
        const today = new Date()
        const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        setCustomStartDate(firstOfMonth.toISOString().split("T")[0])
        setCustomEndDate(today.toISOString().split("T")[0])
      }
    }
  }

  const goToPreviousMonth = () => {
    setCurrentOverviewMonth(new Date(currentOverviewMonth.getFullYear(), currentOverviewMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentOverviewMonth(new Date(currentOverviewMonth.getFullYear(), currentOverviewMonth.getMonth() + 1, 1))
  }

  const goToPreviousWeek = () => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(newWeek.getDate() - 7)
    setCurrentWeek(newWeek)
  }

  const goToNextWeek = () => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(newWeek.getDate() + 7)
    setCurrentWeek(newWeek)
  }

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  }

  const getWeekDateRange = (date) => {
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    return { start: startOfWeek, end: endOfWeek }
  }

  const isCurrentWeek = (date) => {
    const now = new Date()
    const currentWeekRange = getWeekDateRange(now)
    const selectedWeekRange = getWeekDateRange(date)
    return currentWeekRange.start.getTime() === selectedWeekRange.start.getTime()
  }

  const calculateTotalHours = (shifts) => {
    return shifts.reduce((total, shift) => total + shift.hoursWorked, 0)
  }

  const filteredStaff =
    selectedStaffId === "all"
      ? dummyShiftsData
      : dummyShiftsData.filter((staff) => staff.id === Number.parseInt(selectedStaffId))

  // Get period label for export
  const getExportPeriodLabel = () => {
    if (selectedPeriod === "month") {
      return currentOverviewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    } else if (selectedPeriod === "week") {
      const weekRange = getWeekDateRange(currentWeek)
      return `Week ${getWeekNumber(currentWeek)} (${weekRange.start.toLocaleDateString()} - ${weekRange.end.toLocaleDateString()})`
    } else if (selectedPeriod === "year") {
      return `Year ${selectedYear}`
    } else if (selectedPeriod === "custom" && customStartDate && customEndDate) {
      return `${customStartDate} to ${customEndDate}`
    } else if (selectedPeriod === "day") {
      return currentDate.toLocaleDateString()
    }
    return "All Data"
  }

  const handleExportToExcel = () => {
    // Prepare data for Excel with staff groupings
    const excelData = []
    
    filteredStaff.forEach((staff) => {
      // Add staff header row
      excelData.push({
        "Staff Name": `${staff.firstName} ${staff.lastName}`,
        "Date": "",
        "Check In": "",
        "Check Out": "",
        "Hours": "",
        "Status": ""
      })
      
      // Add shift rows
      staff.shifts.forEach((shift) => {
        excelData.push({
          "Staff Name": "",
          "Date": new Date(shift.date).toLocaleDateString(),
          "Check In": shift.startTime,
          "Check Out": shift.endTime,
          "Hours": shift.hoursWorked,
          "Status": shift.status
        })
      })
      
      // Add total row for this staff member
      const totalHours = calculateTotalHours(staff.shifts)
      excelData.push({
        "Staff Name": "",
        "Date": "",
        "Check In": "",
        "Check Out": "Total Hours:",
        "Hours": totalHours,
        "Status": `${staff.shifts.length} shifts`
      })
      
      // Add empty row as separator
      excelData.push({
        "Staff Name": "",
        "Date": "",
        "Check In": "",
        "Check Out": "",
        "Hours": "",
        "Status": ""
      })
    })
    
    // Add grand total at the end
    const grandTotalHours = filteredStaff.reduce((total, staff) => total + calculateTotalHours(staff.shifts), 0)
    const totalShifts = filteredStaff.reduce((total, staff) => total + staff.shifts.length, 0)
    
    excelData.push({
      "Staff Name": "GRAND TOTAL",
      "Date": `${filteredStaff.length} Staff Members`,
      "Check In": `${totalShifts} Shifts`,
      "Check Out": "",
      "Hours": grandTotalHours,
      "Status": ""
    })

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(excelData)

    // Set column widths for better readability
    worksheet['!cols'] = [
      { wch: 25 },  // Staff Name
      { wch: 15 },  // Date
      { wch: 12 },  // Check In
      { wch: 12 },  // Check Out
      { wch: 10 },  // Hours
      { wch: 15 },  // Status
    ]

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Overview")

    // Generate filename and download
    const periodLabel = getExportPeriodLabel().replace(/[:\s\/]/g, "_")
    const fileName = `attendance_${periodLabel}_${new Date().toISOString().split("T")[0]}.xlsx`
    XLSX.writeFile(workbook, fileName)
    
    toast.success("Excel file downloaded successfully")
  }

  const handleVacationRequest = (staffId, startDate, endDate) => {
    console.log(`Vacation request for staff ${staffId} from ${startDate} to ${endDate}`)
    toast.success("Vacation request submitted for approval")
  }

  // ============ Left Menu (Desktop) ============
  const renderLeftMenu = () => (
    <div className={`hidden md:block transition-all duration-300 flex-shrink-0 ${sidebarCollapsed ? "w-12" : "w-48"}`}>
      <div className="bg-[#141414] rounded-xl p-2 h-full">
        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex items-center justify-center mb-2"
          title={sidebarCollapsed ? "Expand menu" : "Collapse menu"}
        >
          {sidebarCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>

        <div className="space-y-1">
          <button
            onClick={() => {
              setActiveMenuItem("attendance")
              setShowVacationCalendar(false)
              setShowShiftSchedule(false)
            }}
            className={`w-full p-3 rounded-lg text-sm flex items-center transition-colors ${
              activeMenuItem === "attendance" && !showVacationCalendar && !showShiftSchedule
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-700 text-gray-300"
            } ${sidebarCollapsed ? "justify-center" : "gap-2"}`}
            title="Attendance Overview"
          >
            <Users size={16} className="flex-shrink-0" />
            {!sidebarCollapsed && <span>Attendance</span>}
          </button>

          <button
            onClick={() => {
              setActiveMenuItem("shifts")
              setShowVacationCalendar(false)
              setShowShiftSchedule(true)
            }}
            className={`w-full p-3 rounded-lg text-sm flex items-center transition-colors ${
              showShiftSchedule ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-300"
            } ${sidebarCollapsed ? "justify-center" : "gap-2"}`}
            title="Shift Schedule"
          >
            <Calendar size={16} className="flex-shrink-0" />
            {!sidebarCollapsed && <span>Shifts</span>}
          </button>

          <button
            onClick={() => {
              setActiveMenuItem("vacation")
              setShowVacationCalendar(true)
              setShowShiftSchedule(false)
            }}
            className={`w-full p-3 rounded-lg text-sm flex items-center transition-colors ${
              showVacationCalendar ? "bg-blue-600 text-white" : "hover:bg-gray-700 text-gray-300"
            } ${sidebarCollapsed ? "justify-center" : "gap-2"}`}
            title="Vacation Calendar"
          >
            <Sun size={16} className="flex-shrink-0" />
            {!sidebarCollapsed && <span>Vacation</span>}
          </button>
        </div>
      </div>
    </div>
  )

  // ============ Mobile Tab Bar ============
  const renderMobileTabBar = () => (
    <div className="md:hidden flex bg-[#141414] rounded-xl p-1 gap-1">
      <button
        onClick={() => {
          setActiveMenuItem("attendance")
          setShowVacationCalendar(false)
          setShowShiftSchedule(false)
        }}
        className={`flex-1 py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors ${
          activeMenuItem === "attendance" && !showVacationCalendar && !showShiftSchedule
            ? "bg-blue-600 text-white"
            : "text-gray-400"
        }`}
      >
        <Users size={14} />
        <span>Attendance</span>
      </button>

      <button
        onClick={() => {
          setActiveMenuItem("shifts")
          setShowVacationCalendar(false)
          setShowShiftSchedule(true)
        }}
        className={`flex-1 py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors ${
          showShiftSchedule ? "bg-blue-600 text-white" : "text-gray-400"
        }`}
      >
        <Calendar size={14} />
        <span>Shifts</span>
      </button>

      <button
        onClick={() => {
          setActiveMenuItem("vacation")
          setShowVacationCalendar(true)
          setShowShiftSchedule(false)
        }}
        className={`flex-1 py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors ${
          showVacationCalendar ? "bg-blue-600 text-white" : "text-gray-400"
        }`}
      >
        <Sun size={14} />
        <span>Vacation</span>
      </button>
    </div>
  )

  const renderPeriodDisplay = () => {
    if (selectedPeriod === "month") {
      return (
        <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
          <button onClick={goToPreviousMonth} className="p-1.5 sm:p-1 bg-[#1C1C1C] rounded hover:bg-gray-700 flex-shrink-0">
            <ChevronLeft size={16} />
          </button>
          <div className="bg-[#1C1C1C] rounded px-2 sm:px-3 py-2 text-xs sm:text-sm flex-1 sm:flex-none sm:min-w-[120px] text-center">
            {currentOverviewMonth.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </div>
          <button onClick={goToNextMonth} className="p-1.5 sm:p-1 bg-[#1C1C1C] rounded hover:bg-gray-700 flex-shrink-0">
            <ChevronRight size={16} />
          </button>
        </div>
      )
    } else if (selectedPeriod === "week") {
      const weekRange = getWeekDateRange(currentWeek)
      const weekNumber = getWeekNumber(currentWeek)
      const showThisWeek = isCurrentWeek(currentWeek)
      return (
        <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
          <button onClick={goToPreviousWeek} className="p-1.5 sm:p-1 bg-[#1C1C1C] rounded hover:bg-gray-700 flex-shrink-0">
            <ChevronLeft size={16} />
          </button>
          <div className="bg-[#1C1C1C] rounded px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm flex-1 sm:flex-none sm:min-w-[180px] text-center">
            <div>{showThisWeek ? "This Week" : `Week ${weekNumber}`}</div>
            <div className="text-[10px] sm:text-xs text-gray-400">
              {weekRange.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {weekRange.end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          </div>
          <button onClick={goToNextWeek} className="p-1.5 sm:p-1 bg-[#1C1C1C] rounded hover:bg-gray-700 flex-shrink-0">
            <ChevronRight size={16} />
          </button>
        </div>
      )
    } else if (selectedPeriod === "year") {
      return (
        <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setSelectedYear(selectedYear - 1)} 
            className="p-1.5 sm:p-1 bg-[#1C1C1C] rounded hover:bg-gray-700 flex-shrink-0"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="bg-[#1C1C1C] rounded px-3 py-2 text-sm flex-1 sm:flex-none sm:min-w-[80px] text-center">
            {selectedYear}
          </div>
          <button 
            onClick={() => setSelectedYear(selectedYear + 1)} 
            className="p-1.5 sm:p-1 bg-[#1C1C1C] rounded hover:bg-gray-700 flex-shrink-0"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )
    } else if (selectedPeriod === "custom") {
      return (
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 flex-1 xs:flex-none">
            <span className="text-xs text-gray-400 w-10 xs:w-auto">From:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="bg-[#1C1C1C] white-calendar-icon rounded px-2 py-1.5 text-xs sm:text-sm flex-1 xs:flex-none"
            />
          </div>
          <div className="flex items-center gap-1 flex-1 xs:flex-none">
            <span className="text-xs text-gray-400 w-10 xs:w-auto">To:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="bg-[#1C1C1C] white-calendar-icon rounded px-2 py-1.5 text-xs sm:text-sm flex-1 xs:flex-none"
            />
          </div>
        </div>
      )
    } else {
      // Day view
      return (
        <input
          type="date"
          value={currentDate.toISOString().split("T")[0]}
          onChange={(e) => setCurrentDate(new Date(e.target.value))}
          className="bg-[#1C1C1C] white-calendar-icon rounded px-3 py-2 text-sm md:text-base w-full sm:w-auto"
        />
      )
    }
  }

  // ============ Attendance Overview ============
  const renderAttendanceOverview = () => (
    <div className="bg-[#141414] rounded-xl p-3 sm:p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Attendance Overview</h3>
        <button
          onClick={() => setExportModalOpen(true)}
          className="bg-gray-700 cursor-pointer hover:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm flex items-center gap-2 w-fit"
        >
          <Download className="h-4 w-4" />
          <span className="hidden xs:inline">Export</span> Excel
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-3 items-start sm:items-center sm:flex-wrap">
        <select
          value={selectedStaffId}
          onChange={(e) => setSelectedStaffId(e.target.value)}
          className="bg-[#1C1C1C] rounded px-3 py-2 text-sm w-full sm:w-auto"
        >
          <option value="all">All Staff</option>
          {staffMembersWithColors.map((staff) => (
            <option key={staff.id} value={staff.id}>
              {staff.firstName} {staff.lastName}
            </option>
          ))}
        </select>
        <select
          value={selectedPeriod}
          onChange={(e) => handlePeriodChange(e.target.value)}
          className="bg-[#1C1C1C] rounded px-3 py-2 text-sm w-full sm:w-auto"
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
          <option value="custom">Custom</option>
        </select>
        <div className="col-span-1 xs:col-span-2 sm:col-span-1">
          {renderPeriodDisplay()}
        </div>
      </div>

      {/* Content - Desktop Table / Mobile Cards */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        {/* Desktop Table View */}
        <div className="hidden sm:block">
          <table className="w-full min-w-[600px]">
            <thead className="sticky top-0 bg-[#141414] z-10">
              <tr className="text-sm border-b border-gray-700">
                <th className="text-left py-3">Staff Name</th>
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">Check in</th>
                <th className="text-left py-3">Check out</th>
                <th className="text-left py-3">Hours</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <>
                  {/* Staff Header Row */}
                  <tr key={`header-${staff.id}`} className="bg-[#1C1C1C]">
                    <td colSpan={6} className="py-3 px-2">
                      <div className="flex items-center gap-2 font-semibold">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: staff.color }}
                        />
                        {staff.firstName} {staff.lastName}
                      </div>
                    </td>
                  </tr>
                  
                  {/* Shift Rows */}
                  {staff.shifts.map((shift, index) => (
                    <tr key={`${staff.id}-${index}`} className="text-sm border-b border-gray-800/50">
                      <td className="py-2.5 pl-6 text-gray-400">—</td>
                      <td className="py-2.5">{new Date(shift.date).toLocaleDateString()}</td>
                      <td className="py-2.5">{shift.startTime}</td>
                      <td className="py-2.5">{shift.endTime}</td>
                      <td className="py-2.5">{shift.hoursWorked}h</td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            shift.status === "completed"
                              ? "bg-orange-500/20 text-orange-400"
                              : shift.status === "scheduled"
                                ? "bg-blue-600/20 text-blue-400"
                                : "bg-gray-600 text-white"
                          }`}
                        >
                          {shift.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Staff Total Row */}
                  <tr key={`total-${staff.id}`} className="border-b-2 border-gray-700">
                    <td className="py-2.5 pl-6"></td>
                    <td className="py-2.5"></td>
                    <td className="py-2.5"></td>
                    <td className="py-2.5 text-right font-medium text-gray-400">Total:</td>
                    <td className="py-2.5 font-bold text-white">{calculateTotalHours(staff.shifts)}h</td>
                    <td className="py-2.5 text-gray-400 text-sm">{staff.shifts.length} shifts</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-4">
          {filteredStaff.map((staff) => (
            <div key={staff.id} className="bg-[#1C1C1C] rounded-xl overflow-hidden">
              {/* Staff Header */}
              <div className="p-3 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: staff.color }}
                  />
                  <span className="font-semibold text-sm">{staff.firstName} {staff.lastName}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold text-sm">{calculateTotalHours(staff.shifts)}h</span>
                  <span className="text-gray-400 text-xs ml-1">({staff.shifts.length})</span>
                </div>
              </div>
              
              {/* Shifts */}
              <div className="divide-y divide-gray-800/50">
                {staff.shifts.slice(0, 5).map((shift, index) => (
                  <div key={index} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">{new Date(shift.date).toLocaleDateString()}</p>
                      <p className="text-sm">{shift.startTime} - {shift.endTime}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{shift.hoursWorked}h</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          shift.status === "completed"
                            ? "bg-orange-500/20 text-orange-400"
                            : shift.status === "scheduled"
                              ? "bg-blue-600/20 text-blue-400"
                              : "bg-gray-600 text-white"
                        }`}
                      >
                        {shift.status}
                      </span>
                    </div>
                  </div>
                ))}
                {staff.shifts.length > 5 && (
                  <div className="p-2 text-center text-xs text-gray-400">
                    +{staff.shifts.length - 5} more shifts
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-3 sm:mt-4 bg-[#1C1C1C] rounded-lg p-3 sm:p-4 flex-shrink-0">
        <h4 className="text-sm sm:text-base font-semibold mb-2">Summary</h4>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div>
            <p className="text-gray-400">Staff</p>
            <p className="font-bold text-white">{filteredStaff.length}</p>
          </div>
          <div>
            <p className="text-gray-400">Shifts</p>
            <p className="font-bold text-white">
              {filteredStaff.reduce((total, staff) => total + staff.shifts.length, 0)}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Hours</p>
            <p className="font-bold text-white">
              {filteredStaff.reduce((total, staff) => total + calculateTotalHours(staff.shifts), 0)}h
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  // ============ Main Modal ============
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-1 sm:p-2 md:p-4">
      <div className="bg-[#181818] text-white rounded-xl w-full max-w-[98vw] h-[98vh] sm:h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-800 flex-shrink-0">
          <h2 className="text-base sm:text-lg md:text-xl font-bold">Staff Planning</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={18} className="sm:hidden" />
            <X size={20} className="hidden sm:block" />
          </button>
        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden px-3 py-2 flex-shrink-0">
          {renderMobileTabBar()}
        </div>

        {/* Content */}
        <div className="flex flex-1 gap-2 sm:gap-4 p-2 sm:p-4 overflow-hidden">
          {renderLeftMenu()}

          <div className="flex-1 min-w-0 overflow-hidden">
            {showVacationCalendar ? (
              <div className="h-full">
                <VacationCalendarModal
                  staffMember={staffMembersWithColors[0]}
                  onClose={() => {}}
                  onSubmit={handleVacationRequest}
                  isEmbedded={true}
                  staffMembers={staffMembersWithColors}
                  isStaffPlanning={true}
                />
              </div>
            ) : showShiftSchedule ? (
              <div className="h-full">
                <ShiftsOverviewModal
                  staffMembers={staffMembersWithColors}
                  onClose={() => {}}
                  isEmbedded={true}
                  isStaffPlanning={true}
                  currentStaffId={staffMembersWithColors[0]?.id}
                />
              </div>
            ) : (
              renderAttendanceOverview()
            )}
          </div>
        </div>
      </div>

      {/* Export Confirmation Modal */}
      <ExportConfirmationModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onConfirm={handleExportToExcel}
        staffCount={filteredStaff.length}
        totalShifts={filteredStaff.reduce((total, staff) => total + staff.shifts.length, 0)}
        totalHours={filteredStaff.reduce((total, staff) => total + calculateTotalHours(staff.shifts), 0)}
        selectedPeriod={getExportPeriodLabel()}
      />
    </div>
  )
}

export default StaffPlanningModal
