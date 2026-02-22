import { useState, useRef, useEffect } from "react"
import { IoIosInformation } from "react-icons/io"
import BookingModal from "../../components/member-panel-components/appointments-components/BookingModal"
import RequestModal from "../../components/member-panel-components/appointments-components/RequestModal"
import CancelModal from "../../components/member-panel-components/appointments-components/CancelModal"
import { timeSlots } from "../../utils/member-panel-states/appointments-states"
import { useDispatch, useSelector } from "react-redux"
import { cancelAppointment, createMyAppointment, fetchMyAppointments } from "../../features/appointments/AppointmentSlice"
import { useNavigate } from 'react-router-dom'

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
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    dispatch(fetchMyAppointments())
  }, [dispatch])

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  const categories = [
    "All courses", "Health Check", "Personal Training", "Wellness",
    "Recovery", "Mindfulness", "Group Class",
  ]

  const weekDays = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"]

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

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay()

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear)
    const days = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(i)
    return days
  }

  const handleCancelBooking = (appointment) => {
    setAppointmentToCancel(appointment)
    setShowCancelModal(true)
  }

  const confirmCancelBooking = () => {
    if (!appointmentToCancel?._id) return
    dispatch(cancelAppointment(appointmentToCancel._id))
      .unwrap()
      .then(() => { setShowCancelModal(false); setAppointmentToCancel(null) })
      .catch((err) => console.error(err))
  }

  const handleCancelRequest = (appointment) => {
    setAppointmentToCancel(appointment)
    setShowCancelModal(true)
  }

  const goToNextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(selectedYear + 1) }
    else setSelectedMonth(selectedMonth + 1)
  }

  const goToPrevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(selectedYear - 1) }
    else setSelectedMonth(selectedMonth - 1)
  }

  const canGoBack = () => {
    if (selectedYear > currentYear) return true
    if (selectedYear === currentYear && selectedMonth > currentMonth) return true
    return false
  }

  const handleInfoClick = (service, event) => {
    event.stopPropagation()
    setInfoModalData(service)
    setShowInfoModal(true)
  }

  const handleTimeSlotClick = (slotId) => {
    const slot = timeSlots.find((s) => s.id === slotId)
    setSelectedTimeSlot(slot)
    if (slot?.available) setShowBookingModal(true)
    else setShowRequestModal(true)
  }

  const confirmBooking = () => {
    if (!selectedService || !selectedTimeSlot) return
    const appointmentData = {
      service: selectedService._id,
      date: `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`,
      timeSlotId: { start: selectedTimeSlot.start, end: selectedTimeSlot.end },
    }
    dispatch(createMyAppointment(appointmentData))
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
    const requestData = {
      service: selectedService._id,
      date: new Date(selectedYear, selectedMonth, selectedDate).toISOString(),
      timeSlotId: { start: selectedTimeSlot.start, end: selectedTimeSlot.end },
    }
    dispatch(createMyAppointment(requestData))
      .unwrap()
      .then(() => { setShowRequestModal(false); setSelectedTimeSlot(null); alert("Appointment request sent successfully!") })
      .catch((err) => alert(err))
  }

  const isPastDate = (day) => {
    const currentDate = new Date()
    const checkDate = new Date(selectedYear, selectedMonth, day)
    return checkDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
  }

  const appointmentsArray = Array.isArray(appointments) ? appointments : []
  const filteredAppointments = appointmentsArray.filter((appointment) => {
    if (appointmentView === "upcoming") return appointment.status === "confirmed"
    if (appointmentView === "pending") return appointment.status === "pending"
    if (appointmentView === "past") return ["completed", "canceled"].includes(appointment.status)
    return true
  })

  const calendarDays = generateCalendarDays()

  // ============================================
  // Shared Components
  // ============================================
  const BackButton = ({ onClick, title, subtitle }) => (
    <div className="flex items-center gap-3 mb-5">
      <button onClick={onClick} className="p-2 hover:bg-surface-button rounded-xl transition-colors flex-shrink-0">
        <svg className="w-5 h-5 text-content-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-content-primary">{title}</h1>
        {subtitle && <p className="text-content-faint text-xs">{subtitle}</p>}
      </div>
    </div>
  )

  const TabButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl font-medium transition-colors whitespace-nowrap text-sm ${
        active ? "bg-primary text-white" : "bg-surface-button text-content-muted hover:bg-surface-button-hover hover:text-content-primary"
      }`}
    >
      {children}
    </button>
  )

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen rounded-3xl bg-surface-base p-2 md:p-6 select-none">
      <div className="rounded-3xl bg-surface-card text-content-primary relative overflow-hidden border border-border">

        {/* Info Modal */}
        {showInfoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-md border border-border">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-content-primary pr-4">{infoModalData?.name}</h3>
                <button onClick={() => setShowInfoModal(false)} className="text-content-muted hover:text-content-primary transition-colors flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                <p className="text-content-secondary text-sm">{infoModalData?.description}</p>
                <div className="flex justify-between items-center text-sm bg-surface-hover rounded-lg p-2.5">
                  <span className="text-content-muted">Duration</span>
                  <span className="text-content-primary font-medium">{infoModalData?.duration}</span>
                </div>
                <div className="flex justify-between items-center text-sm bg-surface-hover rounded-lg p-2.5">
                  <span className="text-content-muted">Category</span>
                  <span className="text-content-primary font-medium">{infoModalData?.category}</span>
                </div>
              </div>
              <button onClick={() => setShowInfoModal(false)} className="w-full mt-4 px-4 py-2 text-sm bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors">
                Close
              </button>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* MAIN VIEW — Services + My Appointments CTA  */}
        {/* ============================================ */}
        {!showBooking && !showMyAppointments ? (
          <>
            <div className="p-4 sm:p-6 border-b border-border">
              <h1 className="text-xl sm:text-2xl font-bold text-content-primary">Appointments</h1>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* My Appointments CTA */}
              <button
                onClick={() => setShowMyAppointments(true)}
                className="w-full bg-primary hover:bg-primary-hover rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-left flex-1 text-white font-semibold text-sm sm:text-base">My Appointments</span>
                <div className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full min-w-[1.75rem] flex items-center justify-center">
                  {appointmentsArray.filter((appt) => appt.status === "confirmed" || appt.status === "pending").length}
                </div>
              </button>

              {/* Available Services Header + Filter */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-lg sm:text-xl font-bold text-content-primary">Available Services</h2>
                <div className="flex gap-2 relative w-full sm:w-auto" ref={filterRef}>
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="w-full sm:w-auto px-4 py-2 bg-surface-button hover:bg-surface-button-hover rounded-xl text-sm transition-colors flex items-center justify-center gap-2 text-content-primary"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="truncate">{getFilterButtonText()}</span>
                    {selectedCategories.length > 1 && (
                      <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {selectedCategories.length}
                      </span>
                    )}
                  </button>

                  {showFilter && (
                    <div className="absolute top-full left-0 sm:right-0 sm:left-auto mt-2 bg-surface-card border border-border rounded-xl shadow-lg z-20 w-full sm:min-w-[200px] max-h-60 overflow-y-auto">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryToggle(category)}
                          className={`w-full text-left px-4 py-2.5 hover:bg-surface-hover transition-colors first:rounded-t-xl last:rounded-b-xl text-sm flex items-center gap-3 ${
                            selectedCategories.includes(category) ? "bg-surface-hover text-primary" : "text-content-primary"
                          }`}
                        >
                          <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                            selectedCategories.includes(category) ? "bg-primary border-primary" : "border-content-faint"
                          }`}>
                            {selectedCategories.includes(category) && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredServices.map((service) => (
                  <div
                    key={service._id}
                    className="relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-200 hover:shadow-lg bg-surface-hover border border-border"
                    onClick={() => { setSelectedService(service); setShowBooking(true) }}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={service.image?.url || "/placeholder.svg"}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        draggable="false"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400x300/4f46e5/ffffff?text=${encodeURIComponent(service.name)}`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-2 left-2">
                        <span className="bg-primary/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                          {service.category}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={(e) => handleInfoClick(service, e)}
                          className="flex items-center justify-center bg-primary w-7 h-7 rounded-lg hover:bg-primary-hover transition-colors"
                        >
                          <IoIosInformation size={20} className="text-white" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="text-sm sm:text-base font-semibold text-content-primary mb-1.5 line-clamp-2">
                        {service.name}
                      </h3>
                      <div className="flex items-center gap-2 text-content-muted">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                        </svg>
                        <span className="text-xs font-medium">{service.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>

        ) : showMyAppointments ? (
          /* ============================================ */
          /* MY APPOINTMENTS VIEW                        */
          /* ============================================ */
          <div className="p-4 sm:p-6">
            <BackButton onClick={() => setShowMyAppointments(false)} title="My Appointments" />

            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              <TabButton active={appointmentView === "upcoming"} onClick={() => setAppointmentView("upcoming")}>Upcoming</TabButton>
              <TabButton active={appointmentView === "pending"} onClick={() => setAppointmentView("pending")}>Pending</TabButton>
              <TabButton active={appointmentView === "past"} onClick={() => setAppointmentView("past")}>Past</TabButton>
            </div>

            <div className="space-y-3 max-w-3xl">
              {filteredAppointments.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-content-faint text-sm">No {appointmentView} appointments</p>
                </div>
              )}

              {filteredAppointments.map((appointment) => (
                <div key={appointment._id} className="bg-surface-hover rounded-xl p-4 border border-border">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-semibold text-content-primary">{appointment.service?.name}</h3>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 capitalize ${
                          appointment.status === "confirmed"
                            ? "bg-green-500/15 text-green-400"
                            : appointment.status === "completed"
                              ? "bg-blue-500/15 text-blue-400"
                              : appointment.status === "canceled"
                                ? "bg-red-500/15 text-red-400"
                                : "bg-yellow-500/15 text-yellow-400"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-content-muted">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2-7h-3V2h-2v2H8V2H6v2H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                        </svg>
                        <span>
                          {new Date(appointment.date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).replace(",", "")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                        </svg>
                        <span>{appointment.timeSlot.start}-{appointment.timeSlot.end}</span>
                      </div>
                    </div>

                    {(appointment.status === "confirmed" || appointment.status === "pending") && (
                      <button
                        onClick={() =>
                          appointment.status === "pending" ? handleCancelRequest(appointment) : handleCancelBooking(appointment)
                        }
                        className="self-start px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        Cancel {appointment.status === "pending" ? "request" : "booking"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        ) : (
          /* ============================================ */
          /* BOOKING VIEW — Desktop: 2-col layout        */
          /* ============================================ */
          <div className="p-4 sm:p-6">
            <BackButton onClick={() => setShowBooking(false)} title="Book Appointment" subtitle="Select date and time" />

            {/* Service Info Card */}
            <div className="bg-surface-hover rounded-xl overflow-hidden border border-border mb-6">
              <div className="relative">
                <img
                  src={selectedService?.image?.url || "/placeholder.svg"}
                  alt={selectedService?.name}
                  className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                  draggable="false"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x200/4f46e5/ffffff?text=${encodeURIComponent(selectedService?.name || "Service")}`
                  }}
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => handleInfoClick(selectedService, e)}
                    className="flex items-center justify-center bg-primary w-7 h-7 rounded-lg hover:bg-primary-hover transition-colors"
                  >
                    <IoIosInformation size={20} className="text-white" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-content-primary mb-1">{selectedService?.name}</h2>
                    <div className="flex items-center gap-2 text-content-muted text-xs">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                      </svg>
                      <span>{selectedService?.duration}</span>
                    </div>
                  </div>
                  <span className="text-xs text-content-faint">{selectedService?.category}</span>
                </div>
              </div>
            </div>

            {/* Desktop: 2-column (Calendar left | Time Slots right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <div className="flex items-center gap-3 text-sm font-medium text-content-primary bg-surface-hover px-4 py-3 rounded-xl border border-border mb-4">
                  {canGoBack() && (
                    <button onClick={goToPrevMonth} className="p-1 hover:bg-surface-button rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  <div className="flex items-center gap-2 flex-1 justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                    </svg>
                    <span>{months[selectedMonth]} {selectedYear}</span>
                  </div>
                  <button onClick={goToNextMonth} className="p-1 hover:bg-surface-button rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="bg-surface-hover rounded-xl p-3 md:p-4 border border-border">
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {weekDays.map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-content-faint py-1">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => (
                      <button
                        key={`${selectedMonth}-${day}-${index}`}
                        onClick={() => day && !isPastDate(day) && setSelectedDate(day)}
                        disabled={!day || isPastDate(day)}
                        className={`aspect-square flex items-center justify-center text-sm font-medium rounded-lg transition-all ${
                          !day || isPastDate(day)
                            ? "text-content-faint/40 cursor-not-allowed"
                            : selectedDate === day
                              ? "bg-primary text-white"
                              : "text-content-primary hover:bg-surface-button"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-sm font-semibold text-content-primary whitespace-nowrap">Filter</h3>
                  <div className="flex gap-2 overflow-x-auto">
                    <TabButton active={availabilityFilter === "all"} onClick={() => setAvailabilityFilter("all")}>All</TabButton>
                    <TabButton active={availabilityFilter === "available"} onClick={() => setAvailabilityFilter("available")}>Available</TabButton>
                    <TabButton active={availabilityFilter === "not-available"} onClick={() => setAvailabilityFilter("not-available")}>Not Available</TabButton>
                  </div>
                </div>

                <div className="space-y-5">
                  {Object.entries(filteredTimeSlots).map(([period, slots]) => (
                    <div key={period}>
                      <h3 className="text-sm font-semibold text-content-primary mb-2 capitalize flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          period === "morning" ? "bg-yellow-400" : period === "afternoon" ? "bg-orange-400" : "bg-purple-400"
                        }`} />
                        {period}
                      </h3>
                      <div className="grid gap-2 grid-cols-1">
                        {slots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => handleTimeSlotClick(slot.id)}
                            className={`p-3 rounded-xl text-left transition-colors ${
                              !slot.available
                                ? "bg-surface-hover text-content-muted border border-red-500/20 hover:bg-surface-button"
                                : "bg-surface-hover text-content-primary border border-border hover:bg-surface-button"
                            }`}
                          >
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-sm">{slot.start} - {slot.end}</span>
                              {!slot.available ? (
                                <span className="text-xs bg-red-500/15 text-red-400 px-2 py-0.5 rounded-lg">Request</span>
                              ) : (
                                <span className="text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded-lg">Available</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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
