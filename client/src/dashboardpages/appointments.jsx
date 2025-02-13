/* eslint-disable no-unused-vars */
import { MoreHorizontal, X, Clock, AlertTriangle, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import Avatar from "../../public/avatar.png"
import Calendar from "../components/calender"
import toast, { Toaster } from "react-hot-toast"

export default function Appointments() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [view, setView] = useState("week")
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false)
  const [checkedInMembers, setCheckedInMembers] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [appointmentToRemove, setAppointmentToRemove] = useState(null)
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      name: "Yolanda",
      time: "10:00",
      date: "Mon | 02-01-2025",
      color: "bg-[#4169E1]",
      startTime: "10:00",
      endTime: "14:00",
      day: 0,
      type: "Strength Training",
      note: "Prefers morning sessions",
    },
    {
      id: 2,
      name: "Alexandra",
      time: "12:00",
      date: "Mon | 02-01-2025",
      color: "bg-[#FF6B6B]",
      startTime: "10:00",
      endTime: "18:00",
      day: 1,
      type: "Cardio",
      note: "",
    },
    {
      id: 3,
      name: "Marcus",
      time: "14:00",
      date: "Mon | 02-01-2025",
      color: "bg-[#50C878]",
      startTime: "14:00",
      endTime: "16:00",
      day: 2,
      type: "Yoga",
      note: "",
    },
    {
      id: 4,
      name: "John",
      time: "14:00",
      date: "Mon | 02-01-2025",
      color: "bg-[#50C878]",
      startTime: "14:00",
      endTime: "16:00",
      day: 2,
      type: "Yoga",
      note: "",
    },
    
  ])

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const currentDate = new Date(2025, 1)
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()
  const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1
  const prevDates = Array.from({ length: prevMonthDays }, (_, i) => prevMonthLastDate - prevMonthDays + i + 1)
  const currentDates = Array.from({ length: lastDate }, (_, i) => i + 1)
  const totalDaysNeeded = 35 // Reduced to 5 rows * 7 days
  const nextMonthDays = totalDaysNeeded - (prevDates.length + currentDates.length)
  const nextDates = Array.from({ length: nextMonthDays }, (_, i) => i + 1)
  const calendarDates = [...prevDates, ...currentDates, ...nextDates]

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdownId(null)
      setIsViewDropdownOpen(false)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleCheckIn = (id) => {
    if (checkedInMembers.includes(id)) {
      setCheckedInMembers(checkedInMembers.filter((memberId) => memberId !== id))
      toast.success('Member checked out successfully')
    } else {
      setCheckedInMembers([...checkedInMembers, id])
      toast.success('Member checked in successfully')
    }
  }

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment)
  }

  const handleAppointmentChange = (changes) => {
    const updatedAppointment = { ...selectedAppointment, ...changes }
    const updatedAppointments = appointments.map((app) => 
      app.id === updatedAppointment.id ? updatedAppointment : app
    )
    setAppointments(updatedAppointments)
    setSelectedAppointment(null)
    toast.success('Appointment updated successfully')
  }

  const handleRemoveAppointment = (appointment) => {
    setAppointmentToRemove(appointment)
    setIsRemoveModalOpen(true)
    setActiveDropdownId(null)
  }

  const confirmRemoveAppointment = () => {
    setAppointments(appointments.filter((app) => app.id !== appointmentToRemove.id))
    setIsRemoveModalOpen(false)
    setAppointmentToRemove(null)
    toast.success('Appointment removed successfully')
  }

  const ViewSelector = () => (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
        className="bg-[#000000] text-white px-4 py-2 rounded-xl cursor-pointer text-sm font-medium transition-colors duration-500 flex items-center gap-2"
      >
        {view.charAt(0).toUpperCase() + view.slice(1)} View
        <ChevronDown size={16} />
      </button>
      
      {isViewDropdownOpen && (
        <div className="absolute top-full mt-1 right-0 w-32 bg-[#1C1C1C]/30 backdrop-blur-3xl rounded-lg border border-gray-800 shadow-lg overflow-hidden z-10">
          {['day', 'week', 'month'].map((v) => (
            <button
              key={v}
              className="w-full px-4 py-2 text-sm cursor-pointer text-white hover:bg-gray-800 text-left capitalize"
              onClick={() => {
                setView(v)
                setIsViewDropdownOpen(false)
              }}
            >
              {v} View
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="flex rounded-3xl bg-[#1C1C1C] p-6">
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
            <h1 className="text-xl oxanium_font sm:text-2xl font-bold text-white">Appointments</h1>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* <ViewSelector /> */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-[#FF843E] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#FF843E]/90 transition-colors duration-200"
              >
                + Add appointment
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-[50%] w-full space-y-6 ">
              <div className="bg-[#000000] rounded-xl p-4">
                <div className="mb-4">
                  <h2 className="text-white text-sm mb-4">February 2025</h2>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {days.map((day) => (
                      <div key={day} className="text-gray-400 mb-1">
                        {day}
                      </div>
                    ))}
                    {calendarDates.map((date, i) => {
                      const isPrevMonth = i < prevDates.length
                      const isNextMonth = i >= prevDates.length + currentDates.length
                      return (
                        <div
                          key={i}
                          className={`aspect-square flex items-center justify-center text-xs
                            ${isPrevMonth || isNextMonth ? "text-gray-600" : "text-white"}
                          `}
                        >
                          {date}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-white font-bold mb-4">Upcoming Appointments</h2>
                <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-[70vh]">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`${appointment.color} rounded-xl cursor-pointer p-4`}
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      {/* Modified appointment card layout */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <img src={Avatar} alt="" className="w-full h-full rounded-full" />
                          </div>
                          <div className="text-white">
                            <p className="font-semibold">{appointment.name}</p>
                            <p className="text-sm flex gap-1 items-center opacity-80">
                              <Clock size={15} />
                              {appointment.time} | {appointment.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCheckIn(appointment.id)
                            }}
                            className="w-full sm:w-auto px-3 py-1 rounded-lg text-sm cursor-pointer bg-black text-white hover:bg-black/80 transition-colors whitespace-nowrap"
                          >
                            {checkedInMembers.includes(appointment.id) ? 'Check Out' : 'Check In'}
                          </button>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveDropdownId(activeDropdownId === appointment.id ? null : appointment.id)
                              }}
                              className="text-white/80 hover:text-white"
                            >
                              <MoreHorizontal size={20} />
                            </button>

                            {activeDropdownId === appointment.id && (
                              <div className="absolute right-0 cursor-pointer mt-1 w-32 bg-[#1C1C1C] backdrop-blur-xl rounded-lg border border-gray-800 shadow-lg overflow-hidden z-10">
                                <button
                                  className="w-full px-4 py-2 text-sm text-white hover:bg-gray-800 text-left"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAppointmentClick(appointment)
                                  }}
                                >
                                  Edit
                                </button>
                                <div className="h-[1px] bg-gray-800 w-full"></div>
                                <button
                                  className="w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-800 text-left"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveAppointment(appointment)
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full bg-[#000000] rounded-xl p-4 overflow-hidden">
            <Calendar view={view} appointments={appointments} />            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Add appointment</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[calc(100vh-180px)] overflow-y-auto">
              <form className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Member</label>
                  <input
                    type="text"
                    placeholder="Search member..."
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Appointment Type</label>
                  <select className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]">
                    <option value="">Select type</option>
                    <option value="Strength Training">Strength Training</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Yoga">Yoga</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Date & Time</label>
                  <input
                    type="datetime-local"
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Duration (minutes)</label>
                  <input
                    type="number"
                    placeholder="60"
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-black text-red-500 border-2 border-slate-500 rounded-xl text-sm font-medium hover:bg-slate-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAppointment && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Edit Appointment</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[calc(100vh-180px)] overflow-y-auto">
              <form className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Member</label>
                  <input
                    type="text"
                    value={selectedAppointment.name}
                    readOnly
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Appointment Type</label>
                  <select
                    value={selectedAppointment.type}
                    onChange={(e) => handleAppointmentChange({ type: e.target.value })}
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  >
                    <option value="Strength Training">Strength Training</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Yoga">Yoga</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={`${selectedAppointment.date}T${selectedAppointment.time}`}
                    onChange={(e) => handleAppointmentChange({
                      date: e.target.value.split("T")[0],
                      time: e.target.value.split("T")[1],
                    })}
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200">Note</label>
                  <textarea
                    value={selectedAppointment.note}
                    onChange={(e) => handleAppointmentChange({ note: e.target.value })}
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF] min-h-[100px]"
                  />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
              <button
                onClick={() => {
                  handleAppointmentChange({})
                  setSelectedAppointment(null)
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-black text-red-500 border-2 border-slate-500 rounded-xl text-sm font-medium hover:bg-slate-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isRemoveModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setIsRemoveModalOpen(false)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Confirm Removal</h2>
              <button
                onClick={() => setIsRemoveModalOpen(false)}
                className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-white text-sm">
                Are you sure you want to remove this appointment with {appointmentToRemove?.name}?
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
              <button
                onClick={confirmRemoveAppointment}
                className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-sm font-medium text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Yes, Remove
              </button>
              <button
                onClick={() => setIsRemoveModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}