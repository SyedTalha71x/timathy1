/* eslint-disable react/prop-types */
import { X, Calendar, Clock, User, MapPin, FileText } from "lucide-react"

const AppointmentModal = ({
  showAppointmentModal,
  setShowAppointmentModal,
  editingAppointment,
  setEditingAppointment,
  appointmentData,
  setAppointmentData,
  handleSaveAppointment,
}) => {
  if (!showAppointmentModal) return null

  const handleClose = () => {
    setShowAppointmentModal(false)
    setEditingAppointment(null)
    setAppointmentData({
      title: "",
      date: "",
      time: "",
      client: "",
      location: "",
      notes: "",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {editingAppointment ? "Edit Appointment" : "New Appointment"}
            </h2>
            <button onClick={handleClose} className="p-2 hover:bg-zinc-700 rounded-lg">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                <FileText className="w-4 h-4 inline mr-1" />
                Title
              </label>
              <input
                type="text"
                value={appointmentData.title}
                onChange={(e) => setAppointmentData({ ...appointmentData, title: e.target.value })}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                placeholder="Appointment title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  value={appointmentData.date}
                  onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                  className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Time
                </label>
                <input
                  type="time"
                  value={appointmentData.time}
                  onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                  className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Client
              </label>
              <input
                type="text"
                value={appointmentData.client}
                onChange={(e) => setAppointmentData({ ...appointmentData, client: e.target.value })}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                placeholder="Client name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location
              </label>
              <input
                type="text"
                value={appointmentData.location}
                onChange={(e) => setAppointmentData({ ...appointmentData, location: e.target.value })}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                placeholder="Meeting location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
              <textarea
                value={appointmentData.notes}
                onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
                className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white h-20 resize-none"
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button onClick={handleClose} className="px-4 py-2 text-gray-400 hover:text-white">
                Cancel
              </button>
              <button onClick={handleSaveAppointment} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                {editingAppointment ? "Update" : "Create"} Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentModal
