import { useState, useRef, useEffect } from "react"
import { Calendar, Clock, ChevronLeft, X, Filter, Check, Info, Search, CalendarPlus } from "lucide-react"
import DatePickerField from "../../components/shared/DatePickerField"
import BookingModal from "../../components/member-panel-components/appointments-components/BookingModal"
import RequestModal from "../../components/member-panel-components/appointments-components/RequestModal"
import CancelModal from "../../components/member-panel-components/appointments-components/CancelModal"
import { timeSlots } from "../../utils/member-panel-states/appointments-states"
import { useDispatch, useSelector } from "react-redux"
import { cancelAppointment, createMyAppointment, fetchMyAppointments } from "../../features/appointments/AppointmentSlice"
import { useNavigate } from "react-router-dom"
import { haptic } from "../../utils/haptic"
import { Capacitor } from "@capacitor/core"
import toast from "../../components/shared/SharedToast"

// ============================================
// Reusable Components (matches configuration.jsx)
// ============================================
const SettingsCard = ({ children, className = "" }) => (
  <div className={`bg-surface-hover rounded-xl p-4 sm:p-6 ${className}`}>{children}</div>
)

const Appointments = () => {
  const { services = [] } = useSelector((state) => state.services || {})
  const { appointments = [] } = useSelector((state) => state.appointments || {})
  const [selectedDate, setSelectedDate] = useState(new Date().getDate())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [showBooking, setShowBooking] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [showMyAppointments, setShowMyAppointments] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState(["All courses"])
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState(null)
  const [appointmentView, setAppointmentView] = useState("upcoming")
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [availabilityFilter, setAvailabilityFilter] = useState("available")
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [infoModalData, setInfoModalData] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [calendarSheetData, setCalendarSheetData] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const filterBtnRef = useRef(null)
  const daySliderRef = useRef(null)

  useEffect(() => {
    if (!showFilterDropdown) return
    const handleClickOutside = (event) => {
      if (filterBtnRef.current && !filterBtnRef.current.contains(event.target)) setShowFilterDropdown(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showFilterDropdown])

  useEffect(() => { dispatch(fetchMyAppointments()) }, [dispatch])

  // Desktop: convert vertical scroll to horizontal on the day slider
  useEffect(() => {
    const el = daySliderRef.current
    if (!el) return
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        el.scrollLeft += e.deltaY
      }
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  })

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const categories = ["All courses", "Health Check", "Personal Training", "Wellness", "Recovery", "Mindfulness", "Group Class"]

  // Date value for DatePickerField (YYYY-MM-DD)
  const dateValue = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
  const todayStr = new Date().toISOString().split("T")[0]

  const handleDateChange = (dateStr) => {
    if (!dateStr) return
    const [y, m, d] = dateStr.split("-").map(Number)
    setSelectedYear(y)
    setSelectedMonth(m - 1)
    setSelectedDate(d)
    // Scroll slider to the selected day
    requestAnimationFrame(() => {
      const el = daySliderRef.current
      if (!el) return
      const btn = el.querySelector(`[data-date="${dateStr}"]`)
      if (btn) btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    })
  }

  // Generate 30 days starting from today for the day slider
  const generateSliderDays = () => {
    const days = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    for (let i = 0; i < 30; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      days.push({
        date: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        dayName: dayNames[d.getDay()],
        monthShort: monthsShort[d.getMonth()],
        isToday: i === 0,
        dateStr: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      })
    }
    return days
  }

  const sliderDays = generateSliderDays()

  const groupedTimeSlots = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.period]) acc[slot.period] = []
    acc[slot.period].push(slot)
    return acc
  }, {})

  const filteredTimeSlots = Object.entries(groupedTimeSlots).reduce((acc, [period, slots]) => {
    const filtered = slots.filter((slot) => {
      if (availabilityFilter === "available") return slot.available
      if (availabilityFilter === "not-available") return !slot.available
      return true
    })
    if (filtered.length > 0) acc[period] = filtered
    return acc
  }, {})

  const filteredServices = (() => {
    let list = selectedCategories.includes("All courses")
      ? services
      : services.filter((service) => selectedCategories.includes(service.category))
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(s => s.name?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q))
    }
    return list
  })()

  const handleCancelBooking = (appointment) => { setAppointmentToCancel(appointment); setShowCancelModal(true) }

  const confirmCancelBooking = () => {
    if (!appointmentToCancel?._id) return
    dispatch(cancelAppointment(appointmentToCancel._id))
      .unwrap()
      .then(() => { haptic.warning(); setShowCancelModal(false); setAppointmentToCancel(null) })
      .catch((err) => { haptic.error(); console.error(err) })
  }

  const handleCancelRequest = (appointment) => { setAppointmentToCancel(appointment); setShowCancelModal(true) }

  const handleTimeSlotClick = (slotId) => {
    const slot = timeSlots.find((s) => s.id === slotId)
    setSelectedTimeSlot(slot)
    if (slot?.available) setShowBookingModal(true)
    else setShowRequestModal(true)
  }

  const confirmBooking = () => {
    if (!selectedService || !selectedTimeSlot) return
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`
    dispatch(createMyAppointment({
      service: selectedService._id,
      date: dateStr,
      timeSlotId: { start: selectedTimeSlot.start, end: selectedTimeSlot.end },
    }))
      .unwrap()
      .then(() => {
        haptic.success()
        toast.success("Appointment booked")
        setShowBookingModal(false)
        setCalendarSheetData({
          title: selectedService.name,
          date: dateStr,
          startTime: selectedTimeSlot.start,
          endTime: selectedTimeSlot.end,
          location: selectedService.category || "",
        })
        setShowBooking(false)
        setSelectedTimeSlot(null)
        setShowMyAppointments(true)
        setAppointmentView("upcoming")
        dispatch(fetchMyAppointments())
      })
      .catch((err) => { haptic.error(); alert(err) })
  }

  const confirmRequest = () => {
    if (!selectedService || !selectedTimeSlot) return
    dispatch(createMyAppointment({
      service: selectedService._id,
      date: new Date(selectedYear, selectedMonth, selectedDate).toISOString(),
      timeSlotId: { start: selectedTimeSlot.start, end: selectedTimeSlot.end },
    }))
      .unwrap()
      .then(() => { haptic.success(); setShowRequestModal(false); setSelectedTimeSlot(null); alert("Appointment request sent successfully!") })
      .catch((err) => { haptic.error(); alert(err) })
  }

  const appointmentsArray = Array.isArray(appointments) ? appointments : []
  const filteredAppointments = appointmentsArray.filter((appointment) => {
    if (appointmentView === "upcoming") return appointment.status === "confirmed"
    if (appointmentView === "pending") return appointment.status === "pending"
    if (appointmentView === "past") return ["completed", "canceled"].includes(appointment.status)
    return true
  })

  // ─── Add to Calendar ───
  const addToCalendar = async (data) => {
    haptic.success()
    const dateObj = new Date(data.date)
    const [sh, sm] = (data.startTime || "09:00").split(":")
    const [eh, em] = (data.endTime || "10:00").split(":")
    const startDate = new Date(dateObj); startDate.setHours(parseInt(sh), parseInt(sm), 0, 0)
    const endDate = new Date(dateObj); endDate.setHours(parseInt(eh), parseInt(em), 0, 0)

    if (Capacitor.isNativePlatform()) {
      try {
        const { CapacitorCalendar } = await import("@ebarooni/capacitor-calendar")
        try { await CapacitorCalendar.requestWriteOnlyCalendarAccess() } catch {
          alert("Calendar access is required. Please enable it in Settings > OrgaGym > Calendar.")
          setCalendarSheetData(null); return
        }
        const result = await CapacitorCalendar.createEventWithPrompt({
          title: data.title || "Appointment",
          location: data.location || "",
          startDate: startDate.getTime(),
          endDate: endDate.getTime(),
        })
        if (result?.id) toast.success("Added to calendar")
      } catch (err) {
        if (!err.message?.includes("cancel")) console.error("[Calendar]", err)
      }
      setCalendarSheetData(null); return
    }
    // Web fallback
    const pad = (n) => String(n).padStart(2, "0")
    const y = dateObj.getFullYear(), m = pad(dateObj.getMonth() + 1), d = pad(dateObj.getDate())
    const ics = ["BEGIN:VCALENDAR","VERSION:2.0","BEGIN:VEVENT",
      `UID:apt-${Date.now()}@app`,`DTSTART:${y}${m}${d}T${pad(sh)}${pad(sm)}00`,
      `DTEND:${y}${m}${d}T${pad(eh)}${pad(em)}00`,`SUMMARY:${data.title || "Appointment"}`,
      `LOCATION:${data.location || ""}`,"END:VEVENT","END:VCALENDAR"].join("\r\n")
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "appointment.ics"
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
    setCalendarSheetData(null)
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="flex flex-col h-full bg-surface-base text-content-primary overflow-hidden lg:rounded-3xl select-none">

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-content-primary pr-4">{infoModalData?.name}</h3>
              <button onClick={() => setShowInfoModal(false)} className="text-content-muted hover:text-content-primary transition-colors flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-content-secondary text-sm mb-4">{infoModalData?.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm bg-surface-hover rounded-xl p-3">
                <span className="text-content-muted">Duration</span>
                <span className="text-content-primary font-medium">{infoModalData?.duration}</span>
              </div>
              <div className="flex justify-between items-center text-sm bg-surface-hover rounded-xl p-3">
                <span className="text-content-muted">Category</span>
                <span className="text-content-primary font-medium">{infoModalData?.category}</span>
              </div>
            </div>
            <button onClick={() => setShowInfoModal(false)} className="w-full mt-4 px-4 py-2.5 text-sm bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Header — hidden during booking to save space */}
      {!showBooking && (
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border flex-shrink-0">
          {showMyAppointments ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMyAppointments(false)}
                className="p-2 -ml-2 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg sm:text-2xl font-bold">My Appointments</h1>
            </div>
          ) : (
            <h1 className="text-lg sm:text-2xl font-bold">Appointments</h1>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 lg:pb-16">

        {/* ============================================ */}
        {/* MAIN VIEW — CTA + Service Grid              */}
        {/* ============================================ */}
        {!showBooking && !showMyAppointments && (
          <div className="space-y-4">
            {/* My Appointments CTA */}
            <button
              onClick={() => setShowMyAppointments(true)}
              className="w-full bg-primary hover:bg-primary-hover rounded-xl px-4 py-2.5 flex items-center gap-3 transition-colors"
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-left flex-1 text-white font-semibold text-sm">My Appointments</span>
              <div className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full min-w-[1.5rem] flex items-center justify-center">
                {appointmentsArray.filter((a) => a.status === "confirmed" || a.status === "pending").length}
              </div>
            </button>

            {/* Filter + Search Toggle */}
            <div className="flex items-center justify-end gap-1.5">
              <div className="relative" ref={filterBtnRef}>
                <button
                  onClick={() => { haptic.light(); setShowFilterDropdown(prev => !prev) }}
                  className={`p-1.5 rounded-lg transition-colors flex-shrink-0 relative ${
                    showFilterDropdown || (!selectedCategories.includes("All courses") && selectedCategories.length > 0)
                      ? "bg-primary/15 text-primary"
                      : "bg-surface-button text-content-muted hover:bg-surface-button-hover"
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  {!selectedCategories.includes("All courses") && selectedCategories.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full text-[8px] font-bold text-white flex items-center justify-center">
                      {selectedCategories.length}
                    </span>
                  )}
                </button>
                {showFilterDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-surface-card border border-border rounded-xl shadow-xl z-[9999] min-w-[180px] overflow-hidden">
                    <div className="max-h-[200px] overflow-y-auto py-1">
                      {categories.map((cat) => {
                        const isActive = selectedCategories.includes(cat)
                        return (
                          <button
                            key={cat}
                            onClick={() => {
                              haptic.light()
                              setSelectedCategories(prev => {
                                if (cat === "All courses") return ["All courses"]
                                const current = prev.filter(v => v !== "All courses")
                                if (current.includes(cat)) {
                                  const next = current.filter(v => v !== cat)
                                  return next.length === 0 ? ["All courses"] : next
                                }
                                return [...current, cat]
                              })
                            }}
                            className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 transition-colors ${
                              isActive ? "text-primary" : "text-content-secondary hover:bg-surface-hover"
                            }`}
                          >
                            <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center flex-shrink-0 ${
                              isActive ? "bg-primary border-primary" : "border-content-faint"
                            }`}>
                              {isActive && <Check size={8} className="text-white" />}
                            </div>
                            {cat}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => { haptic.light(); setShowSearch(prev => !prev) }}
                className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${showSearch ? "bg-primary/15 text-primary" : "bg-surface-button text-content-muted hover:bg-surface-button-hover"}`}
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search (collapsible) */}
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-faint" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-surface-hover border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-content-primary placeholder-content-faint focus:outline-none focus:border-primary transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Service Cards — matches configuration appointment-types */}
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {filteredServices.map((service) => (
                <div
                  key={service._id}
                  className="bg-surface-hover rounded-xl overflow-hidden border border-border hover:border-border transition-colors group cursor-pointer"
                  onClick={() => { setSelectedService(service); setShowBooking(true) }}
                >
                  {/* Image */}
                  <div className="relative aspect-video bg-surface-card">
                    <img
                      src={service.image?.url || "/placeholder.svg"}
                      alt={service.name}
                      className="w-full h-full object-cover"
                      draggable="false"
                      onError={(e) => { e.target.src = `https://via.placeholder.com/400x300/4f46e5/ffffff?text=${encodeURIComponent(service.name)}` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {service.category && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-secondary backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        {service.category}
                      </div>
                    )}
                    {/* Info button — opens modal on click, visually matches configuration */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setInfoModalData(service); setShowInfoModal(true) }}
                        className="flex items-center justify-center bg-primary w-7 h-7 rounded-full hover:bg-primary-hover transition-colors"
                      >
                        <Info className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-content-primary font-medium truncate mb-2">{service.name}</h3>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-content-faint">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {service.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* MY APPOINTMENTS                             */}
        {/* ============================================ */}
        {showMyAppointments && (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto">
              {[
                { key: "upcoming", label: "Upcoming" },
                { key: "pending", label: "Pending" },
                { key: "past", label: "Past" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setAppointmentView(tab.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                    appointmentView === tab.key
                      ? "bg-primary text-white"
                      : "bg-surface-button text-content-muted hover:bg-surface-button-hover hover:text-content-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {filteredAppointments.length === 0 ? (
              <SettingsCard>
                <div className="text-center py-12 text-content-muted">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-content-primary mb-2">No {appointmentView} appointments</h3>
                  <p className="text-sm">Your {appointmentView} appointments will appear here</p>
                </div>
              </SettingsCard>
            ) : (
              <div className="space-y-3">
                {filteredAppointments.map((appointment) => (
                  <SettingsCard key={appointment._id} className="!p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-sm font-medium text-content-primary truncate">{appointment.serviceId?.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap capitalize ${
                            appointment.status === "confirmed" ? "bg-green-500/15 text-green-400"
                              : appointment.status === "completed" ? "bg-blue-500/15 text-blue-400"
                              : appointment.status === "canceled" ? "bg-red-500/15 text-red-400"
                              : "bg-yellow-500/15 text-yellow-400"
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-content-faint">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(appointment.date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).replace(",", "")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {appointment.timeSlot?.start}-{appointment.timeSlot?.end}
                          </span>
                        </div>
                      </div>
                      {(appointment.status === "confirmed" || appointment.status === "pending") && (
                        <button
                          onClick={() => appointment.status === "pending" ? handleCancelRequest(appointment) : handleCancelBooking(appointment)}
                          className="self-start sm:self-center px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors whitespace-nowrap"
                        >
                          Cancel {appointment.status === "pending" ? "request" : "booking"}
                        </button>
                      )}
                    </div>
                  </SettingsCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* BOOKING VIEW                                */}
        {/* ============================================ */}
        {showBooking && (
          <div className="space-y-4 max-w-3xl">
            {/* Back */}
            <button
              onClick={() => setShowBooking(false)}
              className="flex items-center gap-1.5 text-sm text-content-muted hover:text-content-primary transition-colors -ml-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Service Info — compact inline */}
            <SettingsCard className="!p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-card">
                  <img
                    src={selectedService?.image?.url || "/placeholder.svg"}
                    alt={selectedService?.name}
                    className="w-full h-full object-cover"
                    draggable="false"
                    onError={(e) => { e.target.src = `https://via.placeholder.com/80x80/4f46e5/ffffff?text=${encodeURIComponent(selectedService?.name?.[0] || "S")}` }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-content-primary font-medium text-sm sm:text-base truncate">{selectedService?.name}</h2>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-content-faint mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedService?.duration}
                    </span>
                    {selectedService?.category && (
                      <span className="flex items-center gap-1">
                        {selectedService.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </SettingsCard>

            {/* Day Slider — horizontal scrollable days + month/calendar picker */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-content-primary">{months[selectedMonth]} {selectedYear}</span>
                  <DatePickerField
                    value={dateValue}
                    onChange={handleDateChange}
                    minDate={todayStr}
                    iconSize={16}
                  />
                </div>
              </div>

              <div
                ref={daySliderRef}
                className="flex gap-2 overflow-x-auto pb-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
              >
                {sliderDays.map((day) => {
                  const isSelected = day.date === selectedDate && day.month === selectedMonth && day.year === selectedYear
                  return (
                    <button
                      key={day.dateStr}
                      data-date={day.dateStr}
                      onClick={() => { setSelectedDate(day.date); setSelectedMonth(day.month); setSelectedYear(day.year) }}
                      className={`flex flex-col items-center min-w-[3.5rem] px-3 py-2.5 rounded-xl transition-colors flex-shrink-0 ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-surface-hover text-content-primary hover:bg-surface-button border border-border"
                      }`}
                    >
                      <span className={`text-[10px] uppercase font-medium ${isSelected ? "text-white/70" : "text-content-faint"}`}>
                        {day.dayName}
                      </span>
                      <span className="text-lg font-semibold leading-tight">{day.date}</span>
                      <span className={`text-[10px] ${isSelected ? "text-white/70" : "text-content-faint"}`}>
                        {day.monthShort}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Filter + Time Slots */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-content-secondary whitespace-nowrap">Filter</span>
                {[
                  { key: "all", label: "All" },
                  { key: "available", label: "Available" },
                  { key: "not-available", label: "Not Available" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setAvailabilityFilter(f.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                      availabilityFilter === f.key
                        ? "bg-primary text-white"
                        : "bg-surface-button text-content-muted hover:bg-surface-button-hover"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Time slots — grouped by period, no color indicators */}
              <div className="space-y-5">
                {Object.keys(filteredTimeSlots).length === 0 ? (
                  <SettingsCard>
                    <div className="text-center py-8 text-content-muted">
                      <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No time slots match your filter</p>
                    </div>
                  </SettingsCard>
                ) : (
                  Object.entries(filteredTimeSlots).map(([period, slots]) => (
                    <div key={period}>
                      <h3 className="text-xs font-semibold text-content-muted uppercase tracking-wider mb-2 px-1">{period}</h3>
                      <div className="space-y-2">
                        {slots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => handleTimeSlotClick(slot.id)}
                            className={`w-full p-3.5 rounded-xl text-left transition-colors flex justify-between items-center gap-2 ${
                              !slot.available
                                ? "bg-surface-hover text-content-muted border border-red-500/20 hover:bg-surface-button"
                                : "bg-surface-hover text-content-primary border border-border hover:bg-surface-button"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Clock className="w-4 h-4 text-content-faint flex-shrink-0" />
                              <span className="text-sm font-medium">{slot.start} - {slot.end}</span>
                            </div>
                            {!slot.available ? (
                              <span className="text-[11px] bg-red-500/15 text-red-400 px-2.5 py-0.5 rounded-full font-medium">Request</span>
                            ) : (
                              <span className="text-[11px] bg-green-500/15 text-green-400 px-2.5 py-0.5 rounded-full font-medium">Available</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <BookingModal
        show={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={confirmBooking}
        selectedService={selectedService}
        selectedMonth={selectedMonth}
        selectedDate={selectedDate}
        selectedYear={selectedYear}
        selectedTimeSlot={selectedTimeSlot}
        months={months}
      />
      <RequestModal
        show={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onConfirm={confirmRequest}
        selectedService={selectedService}
        selectedMonth={selectedMonth}
        selectedDate={selectedDate}
        selectedYear={selectedYear}
        selectedTimeSlot={selectedTimeSlot}
        timeSlots={timeSlots}
        months={months}
      />
      <CancelModal
        show={showCancelModal}
        appointmentToCancel={appointmentToCancel}
        onClose={() => { setShowCancelModal(false); setAppointmentToCancel(null) }}
        onConfirm={confirmCancelBooking}
      />

      {/* ============================================ */}
      {/* CALENDAR SHEET (after booking)               */}
      {/* ============================================ */}
      {calendarSheetData && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setCalendarSheetData(null)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative bg-surface-card rounded-t-2xl w-full max-w-lg"
            style={{ marginBottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px))" }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              e.currentTarget._startY = e.touches[0].clientY
              e.currentTarget._currentY = e.touches[0].clientY
              e.currentTarget.style.transition = "none"
            }}
            onTouchMove={(e) => {
              const dy = e.touches[0].clientY - e.currentTarget._startY
              e.currentTarget._currentY = e.touches[0].clientY
              if (dy > 0) e.currentTarget.style.transform = `translateY(${dy}px)`
            }}
            onTouchEnd={(e) => {
              const dy = e.currentTarget._currentY - e.currentTarget._startY
              e.currentTarget.style.transition = "transform 0.2s ease-out"
              if (dy > 80) {
                e.currentTarget.style.transform = "translateY(100%)"
                setTimeout(() => setCalendarSheetData(null), 200)
              } else {
                e.currentTarget.style.transform = "translateY(0)"
              }
            }}
          >
            <div className="w-10 h-1 bg-surface-hover rounded-full mx-auto mt-3 mb-2" />
            <div className="px-4 pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-1 h-10 rounded-full flex-shrink-0 bg-primary" />
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-content-primary truncate">{calendarSheetData.title}</h4>
                  <p className="text-xs text-content-faint">
                    {new Date(calendarSheetData.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · {calendarSheetData.startTime} – {calendarSheetData.endTime}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 pb-4">
              <button
                onClick={() => addToCalendar(calendarSheetData)}
                className="w-full text-left px-4 py-3.5 hover:bg-surface-hover active:bg-surface-hover rounded-xl text-content-primary flex items-center gap-3 transition-colors"
              >
                <CalendarPlus className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Add to Calendar</p>
                  <p className="text-xs text-content-faint">Save to your device calendar</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointments
