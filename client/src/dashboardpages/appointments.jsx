/* eslint-disable no-unused-vars */
import { MoreHorizontal, X, Clock, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import Avatar from "../../public/avatar.png"
import Calendar from "../components/calender"
import toast, { Toaster } from "react-hot-toast"

export default function Appointments() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeDropdownId, setActiveDropdownId] = useState(null)
  const [view, setView] = useState("month") // 'day', 'week', 'month'
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
  ])
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Get the dates for previous, current and next month
  const currentDate = new Date(2025, 1) // February 2025
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const prevMonthLastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()

  // Calculate previous month dates
  const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1
  const prevDates = Array.from({ length: prevMonthDays }, (_, i) => prevMonthLastDate - prevMonthDays + i + 1)

  // Current month dates
  const currentDates = Array.from({ length: lastDate }, (_, i) => i + 1)

  const totalDaysNeeded = 42 // 6 rows * 7 days
  const nextMonthDays = totalDaysNeeded - (prevDates.length + currentDates.length)
  const nextDates = Array.from({ length: nextMonthDays }, (_, i) => i + 1)

  const calendarDates = [...prevDates, ...currentDates, ...nextDates]

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleCheckIn = (id) => {
    if (checkedInMembers.includes(id)) {
      setCheckedInMembers(checkedInMembers.filter((memberId) => memberId !== id))
    } else {
      setCheckedInMembers([...checkedInMembers, id])
    }
  }

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment)
  }

  const handleAppointmentChange = (changes) => {
    // Implement logic to update the appointment
    const updatedAppointment = { ...selectedAppointment, ...changes }
    const updatedAppointments = appointments.map((app) => (app.id === updatedAppointment.id ? updatedAppointment : app))
    setAppointments(updatedAppointments)
    setSelectedAppointment(null)
  }

  const handleRemoveAppointment = (appointment) => {
    setAppointmentToRemove(appointment)
    setIsRemoveModalOpen(true)
    setActiveDropdownId(null)
  }

  const confirmRemoveAppointment = () => {
    // Logic to remove the appointment
    setAppointments(appointments.filter((app) => app.id !== appointmentToRemove.id))
    setIsRemoveModalOpen(false)
    setAppointmentToRemove(null)
    toast.success('Appointment removed successfully')
  }

  return (
    <>
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
    <div className="flex rounded-3xl bg-[#1C1C1C] p-6">
      <main className="flex-1 min-w-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <h1 className="text-xl oxanium_font sm:text-2xl font-bold text-white">Appointments</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView(view === "month" ? "week" : view === "week" ? "day" : "month")}
                className="bg-[#3F74FF] cursor-pointer open_sans_font text-white px-4 py-2.5 sm:py-2 rounded-xl text-sm font-medium hover:bg-[#3F74FF]/90 transition-colors duration-200"
              >
                {view === "month" ? "Week View" : view === "week" ? "Day View" : "Month View"}
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FF843E] cursor-pointer open_sans_font text-white px-4 py-2.5 sm:py-2 rounded-xl text-sm font-medium hover:bg-[#FF843E]/90 transition-colors duration-200"
              >
                + Add appointment
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 open_sans_font">
            <div className="lg:w-[38%] w-full space-y-6">
              <div className="bg-[#000000] rounded-xl p-4">
                <div className="mb-4">
                  <h2 className="text-white mb-4">February 2025</h2>
                  <div className="grid grid-cols-7 gap-2 text-center text-xs">
                    {days.map((day) => (
                      <div key={day} className="text-gray-400 mb-2">
                        {day}
                      </div>
                    ))}
                    {calendarDates.map((date, i) => {
                      const isPrevMonth = i < prevDates.length
                      const isNextMonth = i >= prevDates.length + currentDates.length
                      return (
                        <div
                          key={i}
                          className={`aspect-square flex items-center justify-center text-sm
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
                <h2 className="text-white mb-4 open_sans_font_700">Upcoming Appointments</h2>
                <div className="space-y-3">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`${appointment.color} open_sans_font rounded-xl p-4 flex items-center justify-between`}
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <img src={Avatar || "/placeholder.svg"} alt="" className="w-full h-full rounded-full" />
                        </div>
                        <div className="text-white">
                          <p className="font-semibold">{appointment.name}</p>
                          <p className="text-sm flex gap-1 items-center opacity-80">
                            <Clock size={15} />
                            {appointment.time} | {appointment.date}
                          </p>
                        </div>
                        {appointment.note && (
                          <div className="relative group">
                            <AlertTriangle size={15} className="text-yellow-400" />
                            <div className="absolute hidden group-hover:block bg-black text-white text-xs p-2 rounded-lg mt-2">
                              {appointment.note}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <button
                          className="text-white/80 cursor-pointer hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveDropdownId(activeDropdownId === appointment.id ? null : appointment.id)
                          }}
                        >
                          <MoreHorizontal size={20} className="cursor-pointer" />
                        </button>

                        {activeDropdownId === appointment.id && (
                          <>
                            <div
                              className="absolute top-0 right-8 cursor-pointer bg-[#2F2F2F]/10 backdrop-blur-xl"
                              onClick={() => setActiveDropdownId(null)}
                            />
                            <div className="absolute right-4 top-2 mt-1 w-32 bg-[#1C1C1C] rounded-lg border border-gray-800 shadow-lg overflow-hidden z-10">
                              <button
                                className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 text-left"
                                onClick={() => setActiveDropdownId(null)}
                              >
                                Cancel
                              </button>
                              <div className="h-[1px] bg-[#BCBBBB] w-[85%] mx-auto"></div>
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
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full open_sans_font bg-[#000000] rounded-xl p-4 overflow-hidden overflow-y-auto">
              <Calendar view={view} />
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div
          className="fixed inset-0 open_sans_font cursor-pointer bg-black/50 flex items-center justify-center z-[1000] p-4 sm:p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl sm:rounded-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-base open_sans_font_700 sm:text-lg font-semibold text-white">Add appointment</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4 max-h-[calc(100vh-180px)] overflow-y-auto">
              <form className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200 block">Member</label>
                  <input
                    type="text"
                    placeholder="Search member..."
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200 block">Appointment Type</label>
                  <select className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200">
                    <option value="">Select type</option>
                    <option value="Strength Training">Strength Training</option>
                    <option value="Cardio">Cardio</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200 block">Date & Time</label>
                  <input
                    type="datetime-local"
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200 block">Duration (minutes)</label>
                  <input
                    type="number"
                    placeholder="60"
                    className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200 block">Available Slots</label>
                  <div className="text-white text-sm">
                    {/* This should be populated with actual available slots data */}
                    Available slots will be shown here.
                  </div>
                </div>
              </form>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors duration-200"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-black text-red-500 border-2 border-slate-500 rounded-xl text-sm font-medium hover:bg-slate-900 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAppointment && (
        <div
          className="fixed inset-0 open_sans_font cursor-pointer bg-black/50 flex items-center justify-center z-[1000] p-4 sm:p-6"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl sm:rounded-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-base open_sans_font_700 sm:text-lg font-semibold text-white">Edit Appointment</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4 max-h-[calc(100vh-180px)] overflow-y-auto">
              <form className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200 block">Member</label>
                  <input
                    type="text"
                    value={selectedAppointment.name}
                    readOnly
                    className="w-full bg-[#101010] text-sm rounded-xl  px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200 block">Appointment Type</label>
                  <select
                    value={selectedAppointment.type}
                    onChange={(e) => handleAppointmentChange({ type: e.target.value })}
                    className="w-full bg-[#101010] text-sm rounded-xl  px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                  >
                    <option value="Strength Training">Strength Training</option>
                    <option value="Cardio">Cardio</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-gray-200 block">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={`${selectedAppointment.date}T${selectedAppointment.time}`}
                    onChange={(e) =>
                      handleAppointmentChange({
                        date: e.target.value.split("T")[0],
                        time: e.target.value.split("T")[1],
                      })
                    }
                    className="w-full bg-[#101010] text-sm rounded-xl  px-3 py-2.5 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#3F74FF] transition-shadow duration-200"
                  />
                </div>
              </form>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors duration-200"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-black text-red-500 border-2 border-slate-500 rounded-xl text-sm font-medium hover:bg-slate-900 transition-colors duration-200"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {isRemoveModalOpen && (
        <div
          className="fixed inset-0 open_sans_font cursor-pointer bg-black/50 flex items-center justify-center z-[1000] p-4 sm:p-6"
          onClick={() => setIsRemoveModalOpen(false)}
        >
          <div
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl sm:rounded-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-base open_sans_font_700 sm:text-lg font-semibold text-white">Confirm Removal</h2>
              <button
                onClick={() => setIsRemoveModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1.5 sm:p-2 hover:bg-gray-800 rounded-lg"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4">
              <p className="text-white text-sm">Are you sure you want to remove this appointment?</p>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={confirmRemoveAppointment}
                className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-sm font-medium text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
              >
                Yes, Remove
              </button>
              <button
                onClick={() => setIsRemoveModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>

  )
}

