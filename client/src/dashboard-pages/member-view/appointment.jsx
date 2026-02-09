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
  const { appointments } = useSelector((state) => state.appointments || [])
  const [selectedDate, setSelectedDate] = useState(new Date().getDate())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [showBooking, setShowBooking] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [showMyAppointments, setShowMyAppointments] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState(["All courses"]) // Changed to array for multi-select
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState(null)
  const [appointmentView, setAppointmentView] = useState("upcoming")
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [infoModalData, setInfoModalData] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [availabilityFilter, setAvailabilityFilter] = useState("available")
  const [showRequestModal, setShowRequestModal] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const filterRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    dispatch(fetchMyAppointments())
  }, [dispatch])


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

  // Updated filter logic for multi-select
  const filteredServices = selectedCategories.includes("All courses")
    ? services
    : services.filter((service) => selectedCategories.includes(service.category))

  // Handle category selection for multi-select
  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      if (category === "All courses") {
        return ["All courses"]
      }

      const newSelection = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev.filter(c => c !== "All courses"), category]

      // If no categories selected, default to "All courses"
      return newSelection.length === 0 ? ["All courses"] : newSelection
    })
  }

  // Get display text for filter button
  const getFilterButtonText = () => {
    if (selectedCategories.includes("All courses") || selectedCategories.length === 0) {
      return "All courses"
    }
    if (selectedCategories.length === 1) {
      return selectedCategories[0]
    }
    return `${selectedCategories.length} selected`
  }

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
    if (!appointmentToCancel?._id) return

    dispatch(cancelAppointment(appointmentToCancel._id))
      .unwrap()
      .then(() => {
        setShowCancelModal(false)
        setAppointmentToCancel(null)
      })
      .catch((err) => {
        console.error(err)
      })
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
    setSelectedTimeSlot(slot)

    if (slot?.available) {
      setShowBookingModal(true)
    } else {
      setShowRequestModal(true)
    }
  }
  // confirm Appointment
  const confirmBooking = () => {
    if (!selectedService || !selectedTimeSlot) return

    const appointmentData = {
      service: selectedService._id,
      date: `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`,
      timeSlotId: {
        start: selectedTimeSlot.start,
        end: selectedTimeSlot.end,
      }
    }


    dispatch(createMyAppointment(appointmentData))
      .unwrap()
      .then(() => {
        setShowBooking(false)
        setShowBookingModal(false)
        setSelectedTimeSlot(null)
        alert("Appointment Booked Successfully")
        dispatch(fetchMyAppointments())
        navigate('/member-view/studio-menu')
      })
      .catch((err) => {
        alert(err)
      })


  }

  const confirmRequest = () => {
    if (!selectedService || !selectedTimeSlot) return

    const requestData = {
      service: selectedService._id,
      date: new Date(selectedYear, selectedMonth, selectedDate).toISOString(),
      timeSlotId: {
        start: selectedTimeSlot.start,
        end: selectedTimeSlot.end,
      }
    }
    dispatch(createMyAppointment(requestData))
      .unwrap()
      .then(() => {
        setShowRequestModal(false)
        setSelectedTimeSlot(null)
        alert("Appointment request sent successfully!")
      })
      .catch((err) => {
        alert(err)
      })
  }

  const isPastDate = (day) => {
    const currentDate = new Date()
    const selectedDate = new Date(selectedYear, selectedMonth, day)
    return selectedDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
  }

  const appointmentsArray = Array.isArray(appointments) ? appointments : [];
  const filteredAppointments = appointmentsArray.filter((appointment) => {
    if (appointmentView === "upcoming") return appointment.status === "confirmed";
    if (appointmentView === "pending") return appointment.status === "pending";
    if (appointmentView === "past") {
      return ["completed", "canceled"].includes(appointment.status);
    }

    return true;
  });



  const calendarDays = generateCalendarDays()

  return (
    <div className="min-h-screen rounded-3xl bg-[#1C1C1C] p-2 sm:p-6">
      <div className="rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 text-white relative overflow-hidden border border-gray-700">
        {showInfoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white pr-4">{infoModalData?.name}</h3>
                <button onClick={() => setShowInfoModal(false)} className="text-gray-400 hover:text-white flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                <p className="text-gray-300 text-sm">{infoModalData?.description}</p>
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



        {!showBooking && !showMyAppointments ? (
          <>
            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-700">
              <h1 className="text-white text-xl sm:text-2xl font-bold">Appointments</h1>
            </div>

            <div className="p-4 sm:p-6">
              <button
                onClick={() => setShowMyAppointments(true)}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 rounded-xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4 shadow-lg cursor-pointer transition-all duration-500 transform hover:scale-105"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-base sm:text-xl font-bold text-white">Show my appointments</h3>
                </div>
                <div className="bg-blue-500 text-white text-xs sm:text-sm font-bold px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full min-w-[1.75rem] sm:min-w-[2rem] h-7 sm:h-8 flex items-center justify-center flex-shrink-0">
                  {
                    appointments.filter(appt => appt.status === "confirmed" || appt.status === "pending").length
                  }
                </div>

              </button>
            </div>

            <div className="px-4 sm:px-6 pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-white">Available Services</h2>
                </div>
                <div className="flex gap-2 relative w-full sm:w-auto" ref={filterRef}>
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    <span className="truncate">{getFilterButtonText()}</span>
                    {selectedCategories.length > 1 && (
                      <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {selectedCategories.length}
                      </span>
                    )}
                  </button>

                  {showFilter && (
                    <div className="absolute top-full left-0 sm:right-0 sm:left-auto mt-2 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-20 w-full sm:min-w-[200px] max-h-60 custom-scrollbar overflow-y-auto">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategoryToggle(category)}
                          className={`w-full text-left px-4 py-2.5 hover:bg-gray-600 transition-colors first:rounded-t-lg last:rounded-b-lg text-sm flex items-center gap-3 ${selectedCategories.includes(category) ? "bg-gray-600 text-orange-400" : "text-white"
                            }`}
                        >
                          <div className={`w-4 h-4 border rounded flex items-center justify-center ${selectedCategories.includes(category) ? "bg-orange-400 border-orange-400" : "border-gray-400"}`}>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {filteredServices.map((service) => (
                  <div
                    key={service._id}
                    className="relative rounded-xl overflow-hidden cursor-pointer group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gray-800"
                    onClick={() => {
                      setSelectedService(service)
                      setShowBooking(true)
                    }}
                  >
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <img
                        src={service.image?.url || "/placeholder.svg"}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400x300/4f46e5/ffffff?text=${encodeURIComponent(service.name)}`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                        <span className="bg-blue-500/90 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                          {service.category}
                        </span>
                      </div>

                      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                        <button
                          onClick={(e) => handleInfoClick(service, e)}
                          className="flex items-center justify-center bg-orange-500 w-6 h-6 sm:w-7 sm:h-7 rounded-full hover:bg-orange-600 transition-colors"
                        >
                          <IoIosInformation size={24} className="text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {service.name}
                      </h3>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-300">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                          </svg>
                          <span className="text-xs sm:text-sm font-medium">{service.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : showMyAppointments ? (
          // ... rest of the component remains the same
          <>
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <button
                  onClick={() => setShowMyAppointments(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-white">Show my appointments</h1>
                </div>
              </div>

              <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
                <button
                  onClick={() => setAppointmentView("upcoming")}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-xs sm:text-sm ${appointmentView === "upcoming"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setAppointmentView("pending")}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-xs sm:text-sm ${appointmentView === "pending"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setAppointmentView("past")}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-xs sm:text-sm ${appointmentView === "past"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                  Past
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">

                {filteredAppointments.map((appointment) => (
                  <div key={appointment._id} className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-base sm:text-lg font-bold text-white">{appointment.service?.name}</h3>
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${appointment.status === "confirmed"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : appointment.status === "completed"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              }`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2-7h-3V2h-2v2H8V2H6v2H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                            </svg>
                            <span>
                              {new Date(appointment.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric"
                              }).replace(",", "")}
                            </span>

                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                            </svg>
                            <span>{appointment.timeSlot.start}-{appointment.timeSlot.end}</span>
                          </div>
                        </div>
                      </div>
                      {(appointment.status === "confirmed" || appointment.status === "pending") && (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              appointment.status === "pending"
                                ? handleCancelRequest(appointment)
                                : handleCancelBooking(appointment)
                            }
                            className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                          >
                            Cancel {appointment.status === "pending" ? "request" : "booking"}
                          </button>
                        </div>
                      )}


                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <button
                  onClick={() => setShowBooking(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Book Appointment</h1>
                  <p className="text-gray-400 text-xs sm:text-sm">Select date and time</p>
                </div>
              </div>

              <div className="mb-6 sm:mb-8">
                <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                  <div className="relative">
                    <img
                      src={selectedService?.image?.url || "/placeholder.svg"}
                      alt={selectedService?.name}
                      className="w-full h-32 sm:h-40 md:h-48 object-cover"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x200/4f46e5/ffffff?text=${encodeURIComponent(
                          selectedService?.name || "Service",
                        )}`
                      }}
                    />

                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                      <button
                        onClick={(e) => handleInfoClick(selectedService, e)}
                        className="flex items-center justify-center bg-orange-500 w-6 h-6 sm:w-7 sm:h-7 rounded-full hover:bg-orange-600 transition-colors"
                      >
                        <IoIosInformation size={24} className="text-white" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                      <div className="flex-1">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">{selectedService?.name}</h2>
                        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                          <div className="flex items-center gap-2 text-gray-300">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                            </svg>
                            <span>{selectedService?.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-xs sm:text-sm text-gray-400">{selectedService?.category}</div>
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
                        key={`${selectedMonth}-${day}-${index}`}
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
              <div className="mb-4 sm:mb-6">
                <div className="flex  items-center gap-3 sm:gap-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white whitespace-nowrap">Filter</h3>
                  <div className="flex gap-2 overflow-x-auto mt-3 ">
                    <button
                      onClick={() => setAvailabilityFilter("all")}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-xs sm:text-sm ${availabilityFilter === "all"
                        ? "bg-orange-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setAvailabilityFilter("available")}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-xs sm:text-sm ${availabilityFilter === "available"
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                      Available
                    </button>
                    <button
                      onClick={() => setAvailabilityFilter("not-available")}
                      className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-xs sm:text-sm ${availabilityFilter === "not-available"
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                    >
                      Not Available
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                {Object.entries(filteredTimeSlots).map(([period, slots]) => (
                  <div key={period}>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-3 capitalize flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${period === "morning"
                          ? "bg-yellow-400"
                          : period === "afternoon"
                            ? "bg-orange-400"
                            : "bg-purple-400"
                          }`}
                      ></div>
                      {period}
                    </h3>
                    <div className="grid gap-2 sm:gap-3 grid-cols-1">
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => handleTimeSlotClick(slot.id)}
                          className={`p-3 sm:p-4 rounded-lg font-medium transition-all duration-200 text-left ${!slot.available
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-red-500/30"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600"
                            }`}
                        >
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-xs sm:text-sm">{slot.start} - {slot.end}</span>
                            {!slot.available ? (
                              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded whitespace-nowrap">
                                Request Available
                              </span>
                            ) : (
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded whitespace-nowrap">
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
        onClose={() => {
          setShowCancelModal(false)
          setAppointmentToCancel(null)
        }}
        onConfirm={confirmCancelBooking}
      />
    </div>
  )
}

export default Appointments