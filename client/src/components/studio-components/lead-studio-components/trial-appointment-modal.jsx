/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import { useState, useEffect } from "react"
import { X, Edit3, Trash2, Plus } from "lucide-react"

const TrialAppointmentModal = ({ 
  isOpen, 
  onClose, 
  lead, 
  onEditTrial, 
  onDeleteTrial, 
  onCreateNewTrial,
  refreshKey
}) => {
  const [trialAppointments, setTrialAppointments] = useState([])

  // Load trial appointments from localStorage when modal opens or lead changes
  useEffect(() => {
    if (isOpen && lead) {
      const storedAppointments = localStorage.getItem("trialAppointments")
      if (storedAppointments) {
        const allAppointments = JSON.parse(storedAppointments)
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
    onDeleteTrial(appointmentId)
  }

  const handleCreateNewTrial = () => {
    onCreateNewTrial(lead)
  }

  if (!isOpen || !lead) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-surface-card rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-medium text-content-primary">
            {lead.firstName} {lead.lastName || lead.surname || ""}'s Trial Appointments
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-button-hover text-content-muted hover:text-content-primary rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Appointments List */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          <h3 className="text-sm font-medium text-content-muted mb-3">Upcoming Trial Appointments</h3>
          
          {trialAppointments.length > 0 ? (
            <div className="space-y-3">
              {trialAppointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="bg-trial rounded-xl p-3 hover:opacity-90 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm text-white">{appointment.trialType || "Trial Training"}</p>
                      <p className="text-sm text-white/70 mt-1">
                        {new Date(appointment.date).toLocaleDateString([], {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-white/70">{appointment.timeSlot}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTrial(appointment)}
                        className="p-1.5 bg-black/20 text-white hover:bg-black/30 rounded-full transition-colors"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteTrial(appointment.id)}
                        className="p-1.5 bg-black/20 text-white hover:bg-black/30 rounded-full transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-content-muted bg-surface-dark rounded-xl">
              No trial appointments scheduled
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleCreateNewTrial}
            className="w-full py-3 text-sm font-medium bg-trial hover:bg-trial/80 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Book New Trial Training
          </button>
        </div>
      </div>
    </div>
  )
}

export default TrialAppointmentModal
