
import { useState } from "react"
import { IoIosInformation } from "react-icons/io"

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [showBooking, setShowBooking] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [showMyAppointments, setShowMyAppointments] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All courses")
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState(null)
  const [appointmentView, setAppointmentView] = useState("upcoming")
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [infoModalData, setInfoModalData] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [showRequestModal, setShowRequestModal] = useState(false)

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const services = [
    {
      id: 1,
      name: "Body Composition Analysis",
      duration: "30 min",
      category: "Health Check",
      price: "€25",
      description: "Complete body analysis including muscle mass, body fat percentage, and metabolic rate",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
      trainer: "Dr. Sarah Mueller",
    },
    {
      id: 2,
      name: "EMS Training Session",
      duration: "45 min",
      category: "Personal Training",
      price: "€65",
      description: "High-intensity electrical muscle stimulation training for maximum efficiency",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop&crop=center",
      trainer: "Michael Schmidt",
    },
    {
      id: 3,
      name: "Nutrition Consultation",
      duration: "60 min",
      category: "Wellness",
      price: "€45",
      description: "Personalized nutrition plan based on your goals and lifestyle",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop&crop=center",
      trainer: "Lisa Wagner",
    },
    {
      id: 4,
      name: "Physiotherapy Session",
      duration: "50 min",
      category: "Recovery",
      price: "€55",
      description: "Professional physiotherapy for injury prevention and rehabilitation",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center",
      trainer: "Thomas Becker",
    },
    {
      id: 5,
      name: "Yoga & Meditation",
      duration: "75 min",
      category: "Mindfulness",
      price: "€35",
      description: "Relaxing yoga session combined with guided meditation",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center",
      trainer: "Anna Kowalski",
    },
    {
      id: 6,
      name: "HIIT Training",
      duration: "40 min",
      category: "Group Class",
      price: "€20",
      description: "High-intensity interval training for maximum calorie burn",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop&crop=center",
      trainer: "David Martinez",
    },
  ]

  const currentAppointments = [
    {
      id: 1,
      service: "EMS Training Session",
      date: "June 22, 2025",
      time: "4:30 PM - 5:15 PM",
      trainer: "Michael Schmidt",
      status: "confirmed",
    },
    {
      id: 2,
      service: "Body Composition Analysis",
      date: "June 25, 2025",
      time: "10:00 AM - 10:30 AM",
      trainer: "Dr. Sarah Mueller",
      status: "confirmed",
    },
  ]

  const pendingAppointments = [
    {
      id: 3,
      service: "Nutrition Consultation",
      date: "June 28, 2025",
      time: "2:00 PM - 3:00 PM",
      trainer: "Lisa Wagner",
      status: "pending",
    },
  ]

  const pastAppointments = [
    {
      id: 4,
      service: "Nutrition Consultation",
      date: "May 15, 2025",
      time: "2:00 PM - 3:00 PM",
      trainer: "Lisa Wagner",
      status: "completed",
    },
  ]

  const timeSlots = [
    { id: 1, time: "9:00 AM – 9:45 AM", period: "morning", available: true },
    { id: 2, time: "10:30 AM – 11:15 AM", period: "morning", available: true },
    { id: 3, time: "2:00 PM – 2:45 PM", period: "afternoon", available: false },
    { id: 4, time: "4:30 PM – 5:15 PM", period: "afternoon", available: true },
    { id: 5, time: "6:00 PM – 6:45 PM", period: "evening", available: true },
    { id: 6, time: "7:30 PM – 8:15 PM", period: "evening", available: true },
  ]

  const categories = [
    "All courses",
    "Health Check",
    "Personal Training",
    "Wellness",
    "Recovery",
    "Mindfulness",
    "Group Class",
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
    if (filtered.length > 0) {
      acc[period] = filtered
    }
    return acc
  }, {})

  const filteredServices =
    selectedCategory === "All courses" ? services : services.filter((service) => service.category === selectedCategory)

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear)
    const days = []

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  const handleCancelBooking = (appointment) => {
    setAppointmentToCancel(appointment)
    setShowCancelModal(true)
  }

  const confirmCancelBooking = () => {
    setShowCancelModal(false)
    setAppointmentToCancel(null)
  }

  const handleCancelRequest = (appointment) => {
    setAppointmentToCancel(appointment)
    setShowCancelModal(true)
  }

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  const goToPrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
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
    const slot = timeSlots.find((slot) => slot.id === slotId)
    setSelectedTimeSlot(slotId)

    if (slot?.available) {
      setShowBookingModal(true)
    } else {
      setShowRequestModal(true)
    }
  }

  const confirmBooking = () => {
    setShowBookingModal(false)
    setSelectedTimeSlot(null)
    // Here you would typically make an API call to book the appointment
    alert("Appointment booked successfully!")
  }

  const confirmRequest = () => {
    setShowRequestModal(false)
    setSelectedTimeSlot(null)
    // Here you would typically make an API call to request the appointment
    alert("Appointment request sent successfully!")
  }

  const isPastDate = (day) => {
    const currentDate = new Date()
    const selectedDate = new Date(selectedYear, selectedMonth, day)
    return selectedDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="min-h-screen rounded-3xl bg-[#1C1C1C] p-6">
      <div className="rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 text-white relative overflow-hidden border border-gray-700">
        {showInfoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{infoModalData?.name}</h3>
                <button onClick={() => setShowInfoModal(false)} className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                <p className="text-gray-300">{infoModalData?.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{infoModalData?.duration}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white">{infoModalData?.category}</span>
                </div>

              </div>
            </div>
          </div>
        )}

        {showBookingModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Confirm Booking</h3>
              <div className="space-y-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-white font-medium">{selectedService?.name}</p>
                  <p className="text-gray-400 text-sm">
                    {months[selectedMonth]} {selectedDate}, {selectedYear} at{" "}
                    {timeSlots.find((slot) => slot.id === selectedTimeSlot)?.time}
                  </p>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-2">Contingent Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Current Contingent:</span>
                      <span className="text-white">8 sessions</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">After Booking:</span>
                      <span className="text-white">7 sessions</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg text-white transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {showRequestModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Request Appointment</h3>
              <div className="space-y-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-white font-medium">{selectedService?.name}</p>
                  <p className="text-gray-400 text-sm">
                    {months[selectedMonth]} {selectedDate}, {selectedYear} at{" "}
                    {timeSlots.find((slot) => slot.id === selectedTimeSlot)?.time}
                  </p>
                </div>
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-medium mb-2">Request Information</h4>
                  <p className="text-gray-300 text-sm">
                    This time slot is currently unavailable. Your request will be sent to the trainer for approval.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRequest}
                  className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white transition-colors"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}

        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">
                {appointmentToCancel?.status === "pending" ? "Cancel Request" : "Cancel Booking"}
              </h3>
              <p className="text-gray-300 mb-4">
                Are you sure you want to cancel this {appointmentToCancel?.status === "pending" ? "request" : "booking"}
                ?
              </p>
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <p className="text-white font-medium">{appointmentToCancel?.service}</p>
                <p className="text-gray-400 text-sm">
                  {appointmentToCancel?.date} at {appointmentToCancel?.time}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
                >
                  Keep {appointmentToCancel?.status === "pending" ? "Request" : "Booking"}
                </button>
                <button
                  onClick={confirmCancelBooking}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition-colors"
                >
                  Cancel {appointmentToCancel?.status === "pending" ? "Request" : "Booking"}
                </button>
              </div>
            </div>
          </div>
        )}

        {!showBooking && !showMyAppointments ? (
          <>
            <div className="p-4 md:p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-700">
              <h1 className="text-white oxanium_font text-xl md:text-2xl">Appointments</h1>
            </div>

            <div className="p-4 md:p-6">
              <button
                onClick={() => setShowMyAppointments(true)}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 rounded-xl p-4 md:p-6 flex items-center gap-4 shadow-lg cursor-pointer transition-all duration-500 transform hover:scale-105"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-xl font-bold text-white">Show my appointments</h3>
                </div>
                <div className="bg-blue-500 text-white text-sm font-bold px-3 py-2 rounded-full min-w-[2rem] h-8 flex items-center justify-center">
                  {currentAppointments.length + pendingAppointments.length}
                </div>
              </button>
            </div>

            <div className="px-4 md:px-6 pb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Available Services</h2>
                </div>
                <div className="flex gap-2 relative">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    {selectedCategory}
                  </button>

                  {showFilter && (
                    <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 min-w-[200px]">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category)
                            setShowFilter(false)
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${selectedCategory === category ? "bg-gray-700 text-orange-400" : "text-white"
                            }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="relative rounded-xl overflow-hidden cursor-pointer group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gray-800"
                    onClick={() => {
                      setSelectedService(service)
                      setShowBooking(true)
                    }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={service.image || "/placeholder.svg"}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400x300/4f46e5/ffffff?text=${encodeURIComponent(service.name)}`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                      <div className="absolute top-3 left-3">
                        <span className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                          {service.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => handleInfoClick(service, e)}
                          className="flex items-center justify-center bg-orange-500 w-7 cursor-pointer h-7 rounded-full hover:bg-orange-600 transition-colors"
                        >
                          <IoIosInformation size={30} className="text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {service.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-300">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                          </svg>
                          <span className="text-sm font-medium">{service.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : showMyAppointments ? (
          <>
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setShowMyAppointments(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Show my appointments</h1>
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setAppointmentView("upcoming")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${appointmentView === "upcoming"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                  Upcoming Appointments
                </button>
                <button
                  onClick={() => setAppointmentView("pending")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${appointmentView === "pending"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                  Pending Appointments
                </button>
                <button
                  onClick={() => setAppointmentView("past")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${appointmentView === "past"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                  Past Appointments
                </button>
              </div>

              <div className="space-y-4">
                {(appointmentView === "upcoming"
                  ? currentAppointments
                  : appointmentView === "pending"
                    ? pendingAppointments
                    : pastAppointments
                ).map((appointment) => (
                  <div key={appointment.id} className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-white mb-1">{appointment.service}</h3>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2-7h-3V2h-2v2H8V2H6v2H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                            </svg>
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                            </svg>
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${appointment.status === "confirmed"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : appointment.status === "completed"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            }`}
                        >
                          {appointment.status}
                        </span>
                        {(appointmentView === "upcoming" || appointmentView === "pending") && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                appointmentView === "pending"
                                  ? handleCancelRequest(appointment)
                                  : handleCancelBooking(appointment)
                              }
                              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors text-sm font-medium"
                            >
                              Cancel {appointmentView === "pending" ? "request" : "booking"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 md:p-6">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setShowBooking(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white">Book Appointment</h1>
                  <p className="text-gray-400">Select date and time</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                  <div className="relative">
                    <img
                      src={selectedService?.image || "/placeholder.svg"}
                      alt={selectedService?.name}
                      className="w-full h-32 md:h-48 object-cover"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x200/4f46e5/ffffff?text=${encodeURIComponent(
                          selectedService?.name || "Service",
                        )}`
                      }}
                    />

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => handleInfoClick(selectedService, e)}
                        className="flex items-center justify-center bg-orange-500 w-7 h-7 cursor-pointer rounded-full hover:bg-orange-600 transition-colors"
                      >
                        <IoIosInformation size={30} className="text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{selectedService?.name}</h2>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-300">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                            </svg>
                            <span>{selectedService?.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">{selectedService?.category}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3 text-lg font-medium text-white bg-gray-800 px-4 py-3 rounded-lg border border-gray-600">
                  {canGoBack() && (
                    <button onClick={goToPrevMonth} className="p-1 hover:bg-gray-700 rounded transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}

                  <div className="flex items-center gap-2 flex-1 justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      {months[selectedMonth]} {selectedYear}
                    </span>
                  </div>

                  <button onClick={goToNextMonth} className="p-1 hover:bg-gray-700 rounded transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mb-8">
                <div className="bg-gray-800 rounded-xl p-3 md:p-4 border border-gray-700 max-w-md">
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {weekDays.map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => (
                      <button
                        key={index}
                        onClick={() => day && !isPastDate(day) && setSelectedDate(day)}
                        disabled={!day || isPastDate(day)}
                        className={`aspect-square flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 ${!day || isPastDate(day)
                            ? "text-gray-600 cursor-not-allowed"
                            : selectedDate === day
                              ? "bg-orange-500 text-white shadow-lg transform scale-110"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white"
                          }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-white">Filter by Availability:</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAvailabilityFilter("all")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${availabilityFilter === "all"
                          ? "bg-orange-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setAvailabilityFilter("available")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${availabilityFilter === "available"
                          ? "bg-green-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                      Available
                    </button>
                    <button
                      onClick={() => setAvailabilityFilter("not-available")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${availabilityFilter === "not-available"
                          ? "bg-red-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                      Not Available
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                {Object.entries(filteredTimeSlots).map(([period, slots]) => (
                  <div key={period}>
                    <h3 className="text-lg font-semibold text-white mb-3 capitalize flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${period === "morning"
                            ? "bg-yellow-400"
                            : period === "afternoon"
                              ? "bg-orange-400"
                              : "bg-purple-400"
                          }`}
                      ></div>
                      {period}
                    </h3>
                    <div
                      className={`grid gap-3 ${slots.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
                        }`}
                    >
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => handleTimeSlotClick(slot.id)}
                          className={`p-4 rounded-lg font-medium transition-all duration-200 text-left ${!slot.available
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-red-500/30"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600"
                            }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{slot.time}</span>
                            {!slot.available ? (
                              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                                Request Available
                              </span>
                            ) : (
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                Available
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Appointments
