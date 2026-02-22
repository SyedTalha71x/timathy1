import { useState, useRef, useEffect } from "react"
import { Calendar, Clock, ChevronLeft, X, Filter, Check } from "lucide-react"
import { IoIosInformation } from "react-icons/io"
import DatePickerField from "../../components/shared/DatePickerField"
import BookingModal from "../../components/member-panel-components/appointments-components/BookingModal"
import RequestModal from "../../components/member-panel-components/appointments-components/RequestModal"
import CancelModal from "../../components/member-panel-components/appointments-components/CancelModal"
import { timeSlots } from "../../utils/member-panel-states/appointments-states"
import { useDispatch, useSelector } from "react-redux"
import { cancelAppointment, createMyAppointment, fetchMyAppointments } from "../../features/appointments/AppointmentSlice"
import { useNavigate } from "react-router-dom"

// ============================================
// Reusable Components (matches configuration.jsx)
// ============================================
const SectionHeader = ({ title, description, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-content-primary">{title}</h2>
      {description && <p className="text-xs sm:text-sm text-content-muted mt-1">{description}</p>}
    </div>
    {action}
  </div>
)

const SettingsCard = ({ children, className = "" }) => (
  <div className={`bg-surface-hover rounded-xl p-4 sm:p-6 ${className}`}>{children}</div>
)

const Appointments = () => {
  const { services } = useSelector((state) => state.services)
  const { appointments = [] } = useSelector((state) => state.appointments || {})
  const [selectedDate, setSelectedDate] = useState(new Date().getDate())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [showBooking, setShowBooking] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [showMyAppointments, setShowMyAppointments] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState(["All courses"])
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState(null)
  const [appointmentView, setAppointmentView] = useState("upcoming")
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [infoModalData, setInfoModalData] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [availabilityFilter, setAvailabilityFilter] = useState("available")
  const [showRequestModal, setShowRequestModal] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const filterRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) setShowFilter(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => { dispatch(fetchMyAppointments()) }, [dispatch])

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
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
  }

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

  const filteredServices = selectedCategories.includes("All courses")
    ? services
    : services.filter((service) => selectedCategories.includes(service.category))

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) => {
      if (category === "All courses") return ["All courses"]
      const newSelection = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev.filter((c) => c !== "All courses"), category]
      return newSelection.length === 0 ? ["All courses"] : newSelection
    })
  }

  const getFilterButtonText = () => {
    if (selectedCategories.includes("All courses") || selectedCategories.length === 0) return "All courses"
    if (selectedCategories.length === 1) return selectedCategories[0]
    return `${selectedCategories.length} selected`
  }

  const handleCancelBooking = (appointment) => { setAppointmentToCancel(appointment); setShowCancelModal(true) }

  const confirmCancelBooking = () => {
    if (!appointmentToCancel?._id) return
    dispatch(cancelAppointment(appointmentToCancel._id))
      .unwrap()
      .then(() => { setShowCancelModal(false); setAppointmentToCancel(null) })
      .catch((err) => console.error(err))
  }

  const handleCancelRequest = (appointment) => { setAppointmentToCancel(appointment); setShowCancelModal(true) }
  const handleInfoClick = (service, event) => { event.stopPropagation(); setInfoModalData(service); setShowInfoModal(true) }

  const handleTimeSlotClick = (slotId) => {
    const slot = timeSlots.find((s) => s.id === slotId)
    setSelectedTimeSlot(slot)
    if (slot?.available) setShowBookingModal(true)
    else setShowRequestModal(true)
  }

  const confirmBooking = () => {
    if (!selectedService || !selectedTimeSlot) return
    dispatch(createMyAppointment({
      service: selectedService._id,
      date: `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`,
      timeSlotId: { start: selectedTimeSlot.start, end: selectedTimeSlot.end },
    }))
      .unwrap()
      .then(() => {
        setShowBooking(false); setShowBookingModal(false); setSelectedTimeSlot(null)
        alert("Appointment Booked Successfully")
        dispatch(fetchMyAppointments()); navigate("/member-view/studio-menu")
      })
      .catch((err) => alert(err))
  }

  const confirmRequest = () => {
    if (!selectedService || !selectedTimeSlot) return
    dispatch(createMyAppointment({
      service: selectedService._id,
      date: new Date(selectedYear, selectedMonth, selectedDate).toISOString(),
      timeSlotId: { start: selectedTimeSlot.start, end: selectedTimeSlot.end },
    }))
      .unwrap()
      .then(() => { setShowRequestModal(false); setSelectedTimeSlot(null); alert("Appointment request sent successfully!") })
      .catch((err) => alert(err))
  }

  const appointmentsArray = Array.isArray(appointments) ? appointments : []
  const filteredAppointments = appointmentsArray.filter((appointment) => {
    if (appointmentView === "upcoming") return appointment.status === "confirmed"
    if (appointmentView === "pending") return appointment.status === "pending"
    if (appointmentView === "past") return ["completed", "canceled"].includes(appointment.status)
    return true
  })

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="flex flex-col h-full bg-surface-base text-content-primary overflow-hidden rounded-3xl select-none">

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

      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border flex-shrink-0">
        {(showBooking || showMyAppointments) ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowBooking(false); setShowMyAppointments(false) }}
              className="p-2 -ml-2 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold">
                {showMyAppointments ? "My Appointments" : "Book Appointment"}
              </h1>
              {showBooking && <p className="text-xs text-content-muted">Select date and time</p>}
            </div>
          </div>
        ) : (
          <h1 className="text-lg sm:text-2xl font-bold">Appointments</h1>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">

        {/* ============================================ */}
        {/* MAIN VIEW — CTA + Service Grid              */}
        {/* ============================================ */}
        {!showBooking && !showMyAppointments && (
          <div className="space-y-6">
            {/* My Appointments CTA */}
            <button
              onClick={() => setShowMyAppointments(true)}
              className="w-full bg-primary hover:bg-primary-hover rounded-xl p-4 flex items-center gap-4 transition-colors"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-left flex-1 text-white font-semibold text-sm sm:text-base">My Appointments</span>
              <div className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full min-w-[1.75rem] flex items-center justify-center">
                {appointmentsArray.filter((a) => a.status === "confirmed" || a.status === "pending").length}
              </div>
            </button>

            {/* Services — SectionHeader + Filter */}
            <SectionHeader
              title="Available Services"
              description="Choose a service to book an appointment"
              action={
                <div className="flex gap-2 relative" ref={filterRef}>
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="px-4 py-2 bg-surface-button hover:bg-surface-button-hover rounded-xl text-sm transition-colors flex items-center gap-2 text-content-primary"
                  >
                    <Filter className="w-4 h-4" />
                    <span>{getFilterButtonText()}</span>
                    {selectedCategories.length > 1 && (
                      <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{selectedCategories.length}</span>
                    )}
                  </button>

                  {showFilter && (
                    <div className="absolute top-full right-0 mt-1 bg-surface-hover border border-border rounded-xl shadow-lg z-20 min-w-[200px] max-h-60 overflow-hidden">
                      <div className="overflow-y-auto max-h-48">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => handleCategoryToggle(cat)}
                            className={`w-full text-left px-4 py-2.5 hover:bg-surface-button text-sm transition-colors flex items-center gap-3 ${
                              selectedCategories.includes(cat) ? "bg-surface-button text-primary" : "text-content-primary"
                            }`}
                          >
                            <div className={`w-4 h-4 border rounded flex items-center justify-center flex-shrink-0 ${
                              selectedCategories.includes(cat) ? "bg-primary border-primary" : "border-content-faint"
                            }`}>
                              {selectedCategories.includes(cat) && <Check className="w-3 h-3 text-white" />}
                            </div>
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              }
            />

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
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => handleInfoClick(service, e)}
                        className="flex items-center justify-center bg-primary w-7 h-7 rounded-full hover:bg-primary-hover transition-colors"
                      >
                        <IoIosInformation size={20} className="text-white" />
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
            {/* Tabs */}
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

            {/* Appointment List */}
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
                          <h3 className="text-sm font-medium text-content-primary truncate">{appointment.service?.name}</h3>
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
                            {appointment.timeSlot.start}-{appointment.timeSlot.end}
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
        {/* BOOKING VIEW — 2-col desktop                */}
        {/* ============================================ */}
        {showBooking && (
          <div className="space-y-6">
            {/* Service Info */}
            <SettingsCard className="!p-0 overflow-hidden">
              <div className="relative">
                <img
                  src={selectedService?.image?.url || "/placeholder.svg"}
                  alt={selectedService?.name}
                  className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                  draggable="false"
                  onError={(e) => { e.target.src = `https://via.placeholder.com/400x200/4f46e5/ffffff?text=${encodeURIComponent(selectedService?.name || "Service")}` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {selectedService?.category && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-secondary backdrop-blur-sm text-white text-xs font-medium rounded-full">
                    {selectedService.category}
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <button onClick={(e) => handleInfoClick(selectedService, e)} className="flex items-center justify-center bg-primary w-7 h-7 rounded-full hover:bg-primary-hover transition-colors">
                    <IoIosInformation size={20} className="text-white" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-content-primary font-medium mb-1">{selectedService?.name}</h2>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-content-faint">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {selectedService?.duration}
                  </span>
                </div>
              </div>
            </SettingsCard>

            {/* Calendar + Time Slots — 2-col on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Date Picker — uses shared DatePickerField */}
              <SettingsCard>
                <h3 className="text-sm font-medium text-content-secondary mb-3">Select Date</h3>
                <div className="flex items-center gap-3 bg-surface-card rounded-xl px-4 py-3 border border-border">
                  <Calendar className="w-5 h-5 text-content-muted flex-shrink-0" />
                  <span className={`flex-1 text-sm ${dateValue ? "text-content-primary font-medium" : "text-content-faint"}`}>
                    {dateValue
                      ? `${months[selectedMonth]} ${selectedDate}, ${selectedYear}`
                      : "Select a date"}
                  </span>
                  <DatePickerField
                    value={dateValue}
                    onChange={handleDateChange}
                    minDate={todayStr}
                    iconSize={18}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-content-faint">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Select a date, then choose a time slot</span>
                </div>
              </SettingsCard>

              {/* Time Slots */}
              <div className="space-y-4">
                {/* Filter */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-content-secondary">Filter</span>
                  <div className="flex gap-2 overflow-x-auto">
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
                </div>

                {/* Slots grouped by period */}
                {Object.entries(filteredTimeSlots).map(([period, slots]) => (
                  <SettingsCard key={period}>
                    <h3 className="text-sm font-medium text-content-primary mb-3 capitalize flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        period === "morning" ? "bg-yellow-400" : period === "afternoon" ? "bg-orange-400" : "bg-purple-400"
                      }`} />
                      {period}
                    </h3>
                    <div className="space-y-2">
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => handleTimeSlotClick(slot.id)}
                          className={`w-full p-3 rounded-xl text-left transition-colors flex justify-between items-center gap-2 ${
                            !slot.available
                              ? "bg-surface-card text-content-muted border border-red-500/20 hover:bg-surface-button"
                              : "bg-surface-card text-content-primary border border-border hover:bg-surface-button"
                          }`}
                        >
                          <span className="text-sm">{slot.start} - {slot.end}</span>
                          {!slot.available ? (
                            <span className="text-[11px] bg-red-500/15 text-red-400 px-2 py-0.5 rounded-full font-medium">Request</span>
                          ) : (
                            <span className="text-[11px] bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full font-medium">Available</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </SettingsCard>
                ))}
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
    </div>
  )
}

export default Appointments
