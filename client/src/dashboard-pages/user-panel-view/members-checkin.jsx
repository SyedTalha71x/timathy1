import { useState } from "react"
import { Search, Calendar, Clock, CheckCircle, X } from "lucide-react"

export default function CheckIns() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [checkInHistory, setCheckInHistory] = useState([])

  const DefaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23666' width='100' height='100'/%3E%3Ctext fill='%23fff' font-family='Arial' font-size='40' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EU%3C/text%3E%3C/svg%3E"

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      memberId: 1,
      memberName: "John Doe",
      memberImage: null,
      appointmentType: "Personal Training",
      scheduledTime: "10:00 AM - 10:30 AM",
      
      date: new Date().toISOString().split('T')[0],
      isCheckedIn: false,
      duration: "60 min"
    },
    {
      id: 2,
      memberId: 2,
      memberName: "Jane Smith",
      memberImage: null,
      appointmentType: "Group Class",
      scheduledTime: "11:30 AM - 12:30 PM",
      date: new Date().toISOString().split('T')[0],
      isCheckedIn: false,
      duration: "45 min"
    },
    {
      id: 3,
      memberId: 3,
      memberName: "Mike Johnson",
      memberImage: null,
      appointmentType: "Consultation",
      scheduledTime: "02:00 PM - 3:00 PM",
      date: new Date().toISOString().split('T')[0],
      isCheckedIn: true,
      checkInTime: "01:55 PM",
      duration: "30 min"
    }
  ])

  const handleCheckIn = (appointmentId) => {
    const appointment = upcomingAppointments.find(app => app.id === appointmentId)
    if (!appointment) return

    const now = new Date()
    const checkInTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })

    setUpcomingAppointments(prev =>
      prev.map(app =>
        app.id === appointmentId
          ? { ...app, isCheckedIn: true, checkInTime }
          : app
      )
    )

    const historyEntry = {
      id: Date.now(),
      ...appointment,
      checkInTime,
      checkInDate: now.toISOString().split('T')[0]
    }
    setCheckInHistory(prev => [historyEntry, ...prev])
  }

  const handleUndoCheckIn = (appointmentId) => {
    setUpcomingAppointments(prev =>
      prev.map(app =>
        app.id === appointmentId
          ? { ...app, isCheckedIn: false, checkInTime: undefined }
          : app
      )
    )
  }

  const filteredUpcomingAppointments = upcomingAppointments.filter(app =>
    app.memberName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    app.date === selectedDate
  )

  const filteredPastCheckIns = checkInHistory.filter(checkin =>
    checkin.memberName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getTodayStats = () => {
    const todayAppointments = upcomingAppointments.filter(app => app.date === selectedDate)
    const checkedIn = todayAppointments.filter(app => app.isCheckedIn).length
    const total = todayAppointments.length
    return { checkedIn, total, pending: total - checkedIn }
  }

  const stats = getTodayStats()

  return (
    <div className="flex flex-col bg-[#1C1C1C] rounded-3xl text-white min-h-screen">
      <div className="flex-1 p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Check-Ins</h1>

          <div className="relative w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-black rounded-xl border border-slate-300/30 text-sm">
            <Calendar size={16} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white outline-none text-xs sm:text-sm"
            />
          </div>
        </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-[#161616] rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Total Appointments</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-500/20 p-2 sm:p-3 rounded-lg">
                <Calendar className="text-blue-500" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-[#161616] rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Checked In</p>
                <p className="text-xl sm:text-2xl font-bold text-green-500 mt-1">{stats.checkedIn}</p>
              </div>
              <div className="bg-green-500/20 p-2 sm:p-3 rounded-lg">
                <CheckCircle className="text-green-500" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-[#161616] rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-500 mt-1">{stats.pending}</p>
              </div>
              <div className="bg-orange-500/20 p-2 sm:p-3 rounded-lg">
                <Clock className="text-orange-500" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#101010] pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm outline-none rounded-xl text-white placeholder-gray-500 border border-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 border-b border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "upcoming"
                ? "text-white border-b-2 border-[#FF843E]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Upcoming ({filteredUpcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === "past"
                ? "text-white border-b-2 border-[#FF843E]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            History ({filteredPastCheckIns.length})
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {activeTab === "upcoming" ? (
            filteredUpcomingAppointments.length > 0 ? (
              filteredUpcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-[#161616] rounded-xl p-3 sm:p-4"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <img
                      src={appointment.memberImage || DefaultAvatar}
                      alt={appointment.memberName}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm sm:text-base truncate">{appointment.memberName}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm text-gray-400">
                        <span className="truncate">{appointment.appointmentType}</span>
                        <span>•</span>
                        <span>{appointment.duration}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <p className="text-white font-medium text-sm">{appointment.scheduledTime}</p>
                        {appointment.isCheckedIn && appointment.checkInTime && (
                          <p className="text-xs text-green-500">
                            Checked in at {appointment.checkInTime}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    {appointment.isCheckedIn ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500/20 text-green-500 rounded-xl">
                          <CheckCircle size={14} />
                          <span className="text-xs sm:text-sm">Checked In</span>
                        </div>
                        <button
                          onClick={() => handleUndoCheckIn(appointment.id)}
                          className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-[#2F2F2F] rounded-lg transition-colors"
                          title="Undo check-in"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCheckIn(appointment.id)}
                        className="px-4 sm:px-6 py-2 bg-[#FF843E] hover:bg-[#FF6B1A] text-white rounded-xl text-xs sm:text-sm transition-colors"
                      >
                        Check In
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto text-gray-600 mb-3" size={40} />
                <p className="text-gray-400 text-sm">No appointments found for this date</p>
              </div>
            )
          ) : (
            filteredPastCheckIns.length > 0 ? (
              filteredPastCheckIns.map((checkin) => (
                <div
                  key={checkin.id}
                  className="bg-[#161616] rounded-xl p-3 sm:p-4"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <img
                      src={checkin.memberImage || DefaultAvatar}
                      alt={checkin.memberName}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm sm:text-base truncate">{checkin.memberName}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm text-gray-400">
                        <span className="truncate">{checkin.appointmentType}</span>
                        <span>•</span>
                        <span>{checkin.duration}</span>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-white font-medium text-sm">{formatDate(checkin.checkInDate)}</p>
                        <p className="text-xs sm:text-sm text-gray-400">
                          Scheduled: {checkin.scheduledTime}
                        </p>
                        <p className="text-xs text-green-500">
                          Checked in: {checkin.checkInTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-700 text-gray-300 rounded-xl">
                      <CheckCircle size={14} />
                      <span className="text-xs sm:text-sm">Completed</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Clock className="mx-auto text-gray-600 mb-3" size={40} />
                <p className="text-gray-400 text-sm">No check-in history found</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}