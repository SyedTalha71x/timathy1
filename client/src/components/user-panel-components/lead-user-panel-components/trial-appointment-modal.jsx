/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import { useState, useEffect } from "react"
import { X, Edit, Trash2, Plus } from "lucide-react"

const TrialAppointmentModal = ({ 
  isOpen, 
  onClose, 
  lead, 
  onEditTrial, 
  onDeleteTrial, 
  onCreateNewTrial,
  refreshKey // Add this prop to trigger refresh
}) => {
  const [trialAppointments, setTrialAppointments] = useState([])

  // Load trial appointments from localStorage when modal opens or lead changes
  useEffect(() => {
    if (isOpen && lead) {
      const storedAppointments = localStorage.getItem("trialAppointments")
      if (storedAppointments) {
        const allAppointments = JSON.parse(storedAppointments)
        // Filter appointments for this specific lead
        const leadAppointments = allAppointments.filter(apt => apt.leadId === lead.id)
        setTrialAppointments(leadAppointments)
      } else {
        setTrialAppointments([])
      }
    }
  }, [isOpen, lead, refreshKey])

  const handleEditTrial = (appointment) => {
    onEditTrial(appointment)
  }

  const handleDeleteTrial = (appointmentId) => {
    // Only trigger parent's delete handler which will show confirmation
    // Don't delete locally here - that happens after confirmation
    onDeleteTrial(appointmentId)
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
             {/* Book New Trial Training Button */}
             <div className="mb-4">
            <button
              onClick={handleCreateNewTrial}
              className="w-full bg-blue-600 text-sm hover:bg-blue-700 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Book New Trial Training
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrialAppointmentModal