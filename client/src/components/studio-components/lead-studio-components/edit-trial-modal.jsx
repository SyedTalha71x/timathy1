// Edit Trial Training Modal - Based on Book Trial Training Modal
import { X } from "lucide-react"
import { useEffect, useState } from "react"
/* eslint-disable react/prop-types */

const EditTrialModal = ({
  isOpen,
  onClose,
  appointment, // The appointment being edited
  trialTypes = [],
  freeTimeSlots = [],
  handleSaveTrialTraining,
}) => {
  const [trialData, setTrialData] = useState({
    date: "",
    timeSlot: "",
    trialType: "",
  })

  // Load appointment data when modal opens
  useEffect(() => {
    if (isOpen && appointment) {
      setTrialData({
        date: appointment.date || "",
        timeSlot: appointment.timeSlot || "",
        trialType: appointment.trialType || "",
      })
    }
  }, [isOpen, appointment])

  // Update trial data
  const updateTrialData = (field, value) => {
    setTrialData({
      ...trialData,
      [field]: value,
    })
  }

  // Filter available time slots based on selected date
  const getAvailableSlots = (selectedDate) => {
    if (!selectedDate || !Array.isArray(freeTimeSlots)) return []
    return freeTimeSlots.filter((slot) => slot && slot.date === selectedDate)
  }

  // Handle Save
  const handleSave = () => {
    if (!appointment) {
      alert("No appointment to update")
      return
    }
    if (!trialData.date || !trialData.timeSlot || !trialData.trialType) {
      alert("Please fill in all required fields")
      return
    }

    if (handleSaveTrialTraining) {
      const updatedAppointment = {
        ...appointment,
        ...trialData,
      }
      handleSaveTrialTraining(updatedAppointment)
    }

    // Reset form
    setTrialData({
      date: "",
      timeSlot: "",
      trialType: "",
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[#1C1C1C] rounded-xl w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white open_sans_font_700">Edit Trial Training</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="space-y-6 custom-scrollbar overflow-y-auto max-h-[60vh]">
            {/* Lead Display (Read-only) */}
            {appointment?.leadName && (
              <div className="space-y-2">
                <label className="text-sm text-gray-200 font-medium">Lead</label>
                <div className="w-full bg-[#101010] text-sm rounded-xl px-4 py-4 text-white border border-gray-700">
                  <div className="font-medium text-base mb-1">{appointment.leadName}</div>
                  {appointment.leadEmail && (
                    <div className="text-xs text-gray-400">{appointment.leadEmail}</div>
                  )}
                </div>
              </div>
            )}

            {/* Appointment Type */}
            <div className="space-y-2">
              <label className="text-sm text-gray-200 font-medium">Appointment Type</label>
              <select
                value={trialData.trialType}
                onChange={(e) => updateTrialData("trialType", e.target.value)}
                className="w-full bg-[#101010] text-sm rounded-xl px-3 py-3 text-white outline-none border border-gray-700 focus:border-[#3F74FF] focus:ring-2 focus:ring-[#3F74FF]/50 transition-all"
              >
                <option value="">Select type</option>
                {trialTypes.length > 0 ? (
                  trialTypes.map((type) => (
                    <option key={type.name} value={type.name}>
                      {type.name} ({type.duration} minutes)
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Cardio">Cardio (30 minutes)</option>
                    <option value="Strength">Strength (45 minutes)</option>
                    <option value="Flexibility">Flexibility (60 minutes)</option>
                  </>
                )}
              </select>
            </div>

            {/* Trial Date & Time */}
            <div className="space-y-3">
              <label className="text-sm text-gray-200 font-medium">Trial Date & Time</label>

              <div className="p-4 bg-[#101010] rounded-xl space-y-4 border border-gray-700">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 font-medium mb-1.5 block">Date</label>
                    <input
                      type="date"
                      value={trialData.date}
                      onChange={(e) => updateTrialData("date", e.target.value)}
                      className="w-full bg-[#181818] white-calendar-icon text-sm rounded-xl px-3 py-3 text-white outline-none border border-gray-700 focus:border-[#3F74FF] focus:ring-2 focus:ring-[#3F74FF]/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-medium mb-1.5 block">Available Time Slots</label>
                    <select
                      value={trialData.timeSlot}
                      onChange={(e) => updateTrialData("timeSlot", e.target.value)}
                      className="w-full bg-[#181818] text-sm rounded-xl px-3 py-3 text-white outline-none border border-gray-700 focus:border-[#3F74FF] focus:ring-2 focus:ring-[#3F74FF]/50 transition-all"
                      disabled={!trialData.date}
                    >
                      <option value="">Select time slot</option>
                      {getAvailableSlots(trialData.date).map((slot) => (
                        <option key={slot.id || `slot-${slot.time}`} value={slot.time}>
                          {slot.time}
                        </option>
                      ))}
                      {trialData.date && getAvailableSlots(trialData.date).length === 0 && (
                        <option value="" disabled>
                          No available slots for this date
                        </option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#2F2F2F] text-white text-sm font-medium rounded-xl hover:bg-[#3F3F3F] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!trialData.date || !trialData.trialType || !trialData.timeSlot}
            className={`px-5 py-2.5 text-white text-sm font-medium rounded-xl transition-colors ${
              !trialData.date || !trialData.trialType || !trialData.timeSlot
                ? "bg-blue-600/50 cursor-not-allowed opacity-50"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Update Trial Training
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditTrialModal
