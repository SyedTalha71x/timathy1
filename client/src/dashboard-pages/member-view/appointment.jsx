/* eslint-disable no-unused-vars */
import { useState } from "react"

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(20)
  const [selectedMonth, setSelectedMonth] = useState("June 2025")
  const [showBooking, setShowBooking] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [showMyAppointments, setShowMyAppointments] = useState(false)

  const services = [
    {
      id: 1,
      name: "Body Composition Analysis",
      duration: "30 min",
      category: "Health Check",
      price: "€25",
      description: "Complete body analysis including muscle mass, body fat percentage, and metabolic rate",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
      trainer: "Dr. Sarah Mueller"
    },
    {
      id: 2,
      name: "EMS Training Session",
      duration: "45 min",
      category: "Personal Training",
      price: "€65",
      description: "High-intensity electrical muscle stimulation training for maximum efficiency",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop&crop=center",
      trainer: "Michael Schmidt"
    },
    {
      id: 3,
      name: "Nutrition Consultation",
      duration: "60 min",
      category: "Wellness",
      price: "€45",
      description: "Personalized nutrition plan based on your goals and lifestyle",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop&crop=center",
      trainer: "Lisa Wagner"
    },
    {
      id: 4,
      name: "Physiotherapy Session",
      duration: "50 min",
      category: "Recovery",
      price: "€55",
      description: "Professional physiotherapy for injury prevention and rehabilitation",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center",
      trainer: "Thomas Becker"
    },
    {
      id: 5,
      name: "Yoga & Meditation",
      duration: "75 min",
      category: "Mindfulness",
      price: "€35",
      description: "Relaxing yoga session combined with guided meditation",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop&crop=center",
      trainer: "Anna Kowalski"
    },
    {
      id: 6,
      name: "HIIT Training",
      duration: "40 min",
      category: "Group Class",
      price: "€20",
      description: "High-intensity interval training for maximum calorie burn",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop&crop=center",
      trainer: "David Martinez"
    }
  ]

  const myAppointments = [
    {
      id: 1,
      service: "EMS Training Session",
      date: "June 22, 2025",
      time: "4:30 PM - 5:15 PM",
      trainer: "Michael Schmidt",
      status: "confirmed"
    },
    {
      id: 2,
      service: "Body Composition Analysis",
      date: "June 25, 2025",
      time: "10:00 AM - 10:30 AM",
      trainer: "Dr. Sarah Mueller",
      status: "pending"
    }
  ]

  const timeSlots = [
    { id: 1, time: "9:00 AM – 9:45 AM", period: "morning", available: true },
    { id: 2, time: "10:30 AM – 11:15 AM", period: "morning", available: true },
    { id: 3, time: "2:00 PM – 2:45 PM", period: "afternoon", available: false },
    { id: 4, time: "4:30 PM – 5:15 PM", period: "afternoon", available: true },
    { id: 5, time: "6:00 PM – 6:45 PM", period: "evening", available: true },
    { id: 6, time: "7:30 PM – 8:15 PM", period: "evening", available: true },
  ]

  const weekDays = ["FR", "SA", "SU", "MO", "TU", "WE", "TH"]
  const dates = [20, 21, 22, 23, 24, 25, 26]

  const groupedTimeSlots = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.period]) acc[slot.period] = []
    acc[slot.period].push(slot)
    return acc
  }, {})

  return (
    <div className=" min-h-screen rounded-3xl bg-[#1C1C1C] p-6">
      <div className=" rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 text-white relative overflow-hidden border border-gray-700">
        {!showBooking && !showMyAppointments ? (
          <>
            {/* Header */}
            <div className="p-4 md:p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-700">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Appointments & Bookings</h1>
              <p className="text-gray-300">Book your sessions or view existing appointments</p>
            </div>

            {/* My Appointments Button */}
            <div className="p-4 md:p-6">
              <button 
                onClick={() => setShowMyAppointments(true)}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl p-4 md:p-6 flex items-center gap-4 shadow-lg cursor-pointer transition-all duration-500 transform hover:scale-105"
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
                  <h3 className="text-xl font-bold text-white">My Appointments</h3>
                  <p className="text-green-100">View and manage your bookings</p>
                </div>
                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {myAppointments.length}
                </div>
              </button>
            </div>

            {/* Services Section */}
            <div className="px-4 md:px-6 pb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Available Services</h2>
                  <p className="text-gray-400">Choose from our professional services</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                    All Services
                  </button>
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                    Filter
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {services.map((service) => (
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
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400x300/4f46e5/ffffff?text=${encodeURIComponent(service.name)}`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                          {service.category}
                        </span>
                      </div>
                      
                      {/* Price Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold">
                          {service.price}
                        </span>
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="p-4">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{service.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-300">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                          </svg>
                          <span className="text-sm font-medium">{service.duration}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          with {service.trainer}
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
            {/* My Appointments View */}
            <div className="p-4 md:p-6">
              {/* Header */}
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
                  <h1 className="text-2xl font-bold text-white">My Appointments</h1>
                  <p className="text-gray-400">Manage your upcoming sessions</p>
                </div>
              </div>

              {/* Appointments List */}
              <div className="space-y-4">
                {myAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{appointment.service}</h3>
                        <div className="flex flex-col md:flex-row gap-2 md:gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2-7h-3V2h-2v2H8V2H6v2H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                            </svg>
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                            </svg>
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6Z"/>
                            </svg>
                            <span>{appointment.trainer}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {appointment.status}
                        </span>
                        <div className="flex gap-2">
                          <button className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Booking Interface */}
            <div className="p-4 md:p-6">
              {/* Header */}
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

              {/* Service Details */}
              <div className="mb-8">
                <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                  <img
                    src={selectedService?.image}
                    alt={selectedService?.name}
                    className="w-full h-32 md:h-48 object-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/400x200/4f46e5/ffffff?text=${encodeURIComponent(selectedService?.name || 'Service')}`
                    }}
                  />
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{selectedService?.name}</h2>
                        <p className="text-gray-400 mb-3">{selectedService?.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-300">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
                            </svg>
                            <span>{selectedService?.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6Z"/>
                            </svg>
                            <span>{selectedService?.trainer}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl md:text-3xl font-bold text-green-400">{selectedService?.price}</div>
                        <div className="text-sm text-gray-400">{selectedService?.category}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Month Selector */}
              <div className="mb-6">
                <button className="flex items-center gap-3 text-lg font-medium text-white bg-gray-800 px-4 py-3 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                  </svg>
                  {selectedMonth}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Calendar */}
              <div className="mb-8">
                <div className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700">
                  <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
                    {weekDays.map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1 md:gap-2">
                    {dates.map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`aspect-square flex items-center justify-center text-lg font-medium rounded-lg transition-all duration-200 ${
                          selectedDate === date 
                            ? "bg-green-500 text-white shadow-lg transform scale-110" 
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-6 mb-8">
                {Object.entries(groupedTimeSlots).map(([period, slots]) => (
                  <div key={period}>
                    <h3 className="text-lg font-semibold text-white mb-3 capitalize flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        period === 'morning' ? 'bg-yellow-400' :
                        period === 'afternoon' ? 'bg-orange-400' : 'bg-purple-400'
                      }`}></div>
                      {period}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => slot.available && setSelectedTimeSlot(slot.id)}
                          disabled={!slot.available}
                          className={`p-4 rounded-lg font-medium transition-all duration-200 text-left ${
                            !slot.available
                              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                              : selectedTimeSlot === slot.id
                              ? "bg-green-500 text-white shadow-lg transform scale-105"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{slot.time}</span>
                            {!slot.available && (
                              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                                Booked
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Book Button */}
              <div className="sticky bottom-4">
                <button 
                  disabled={!selectedTimeSlot}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                    selectedTimeSlot
                      ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg transform hover:scale-105"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {selectedTimeSlot ? `Book Appointment - ${selectedService?.price}` : "Select a time slot"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Appointments