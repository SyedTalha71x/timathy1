/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import { useState } from "react"
import { X, Edit, Trash2, Plus } from "lucide-react"

const TrialAppointmentModal = ({ 
  isOpen, 
  onClose, 
  lead, 
  onEditTrial, 
  onDeleteTrial, 
  onCreateNewTrial // Add this prop
}) => {
  const [trialAppointments, setTrialAppointments] = useState([
    {
      id: 1,
      name: "Yolanda",
      time: "09:00 - 09:30",
      date: "2025-02-07",
      color: "bg-[#4169E1]",
      startTime: "09:00",
      endTime: "09:30",
      type: "Strength Training",
      specialNote: { text: "Prefers morning sessions", startDate: null, endDate: null, isImportant: false },
      status: "pending",
      isTrial: false,
      isCancelled: false,
      isPast: true,
      trialType: "Trial Training",
      timeSlot: "09:00 - 09:30",
    },
    {
      id: 2,
      name: "Michael",
      time: "10:00 - 10:45",
      date: "2025-02-08",
      color: "bg-[#32CD32]",
      startTime: "10:00",
      endTime: "10:45",
      type: "Cardio Session",
      specialNote: { text: "Bring own water bottle", startDate: null, endDate: null, isImportant: true },
      status: "confirmed",
      isTrial: true,
      isCancelled: false,
      isPast: false,
      trialType: "Trial Cardio",
      timeSlot: "10:00 - 10:45",
    },
  ])

  const handleEditTrial = (appointment) => {
    onEditTrial(appointment)
  }

  const handleDeleteTrial = (appointmentId) => {
    onDeleteTrial(appointmentId)
    setTrialAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId))
  }

  const handleCreateNewTrial = () => {
    onCreateNewTrial(lead)
  }

  if (!isOpen || !lead) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">
              {lead.firstName} {lead.lastName || lead.surname || ""}'s Trial Appointments
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg text-white">
              <X size={16} />
            </button>
          </div>

       

          <div className="space-y-3 mb-4">
            <h3 className="text-sm font-medium text-gray-400">Trial Appointments</h3>
            {trialAppointments.length > 0 ? (
              trialAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-[#3b82f6] rounded-xl p-3 hover:opacity-90 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm text-white">{appointment.trialType || "Trial Training"}</p>
                      <div>
                        <p className="text-sm text-white/70">
                          {new Date(appointment.date).toLocaleString([], {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-white/70">{appointment.timeSlot}</p>
                      </div>
                      {appointment.specialNote?.text && (
                        <p className="text-xs text-white/60 mt-1">Note: {appointment.specialNote.text}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTrial(appointment)}
                        className="p-1.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-full text-white"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteTrial(appointment.id)}
                        className="p-1.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-full text-white"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400 bg-[#222222] rounded-xl">
                No trial appointments scheduled
              </div>
            )}
          </div>  
             {/* Create New Trial Appointment Button */}
             <div className="mb-4">
            <button
              onClick={handleCreateNewTrial}
              className="w-full bg-blue-600 text-sm hover:bg-blue-700 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Create New Trial Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrialAppointmentModal