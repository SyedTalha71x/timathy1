/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react"
import { X } from "lucide-react"

const ShowAppointmentModal = ({
  show,
  member,
  appointmentTypes,
  getMemberAppointments,
  handleEditAppointment,
  handleCancelAppointment,
  handleManageContingent,
  handleCreateNewAppointment,
  currentBillingPeriod,
  memberContingentData,
  onClose,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState(null)

  if (!show || !member) return null

  // Function to trigger custom cancellation modal
  const triggerCustomCancel = (appointment, e) => {
    e.stopPropagation()
    setAppointmentToCancel(appointment)
    setShowCancelModal(true)
  }

  // Confirm cancellation
  const confirmCancellation = () => {
    if (appointmentToCancel) {
      handleCancelAppointment(appointmentToCancel.id)
      setShowCancelModal(false)
      setAppointmentToCancel(null)
    }
  }

  // Get member's appointments
  const memberAppointments = getMemberAppointments(member.id)
  const contingentData = memberContingentData[member.id]?.current || { used: 0, total: 0 }

  return (
    <>
      {/* Main Appointment Modal - Aapka original design */}
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">{member.firstName}'s Appointments</h2>
              <button onClick={onClose} className="p-2 hover:bg-zinc-700 rounded-lg">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <h3 className="text-sm font-medium text-gray-400">Upcoming Appointments</h3>
              {memberAppointments.length > 0 ? (
                memberAppointments
                  .filter(app => !app.isPast && !app.isCancelled)
                  .map((appointment) => {
                    const appointmentType = appointmentTypes.find((type) => type.name === appointment.type)
                    const backgroundColor = appointment.color 
                    return (
                      <div
                        key={appointment.id}
                        className={`${backgroundColor} rounded-xl p-3 hover:opacity-90 transition-colors cursor-pointer`}
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm text-white">{appointment.type}</p>
                            <div>
                              <p className="text-sm text-white/70">{appointment.date}</p>
                              <p className="text-xs text-white/70">{appointment.time}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditAppointment(appointment)
                              }}
                              className="p-1.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-full"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => triggerCustomCancel(appointment, e)}
                              className="p-1.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-full"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })
              ) : (
                <div className="text-center py-4 text-gray-400 bg-[#222222] rounded-xl">
                  No appointments scheduled
                </div>
              )}
            </div>

            <div className="flex items-center justify-between py-3 px-2 border-t border-gray-700 mb-4">
              <div className="text-sm text-gray-300">
                Contingent ({currentBillingPeriod}): {contingentData.used} / {contingentData.total}
              </div>
              <button
                onClick={handleManageContingent}
                className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                Manage
              </button>
            </div>

            <button
              onClick={handleCreateNewAppointment}
              className="w-full py-3 text-sm bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl flex items-center justify-center gap-2"
            >
              Create New Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {showCancelModal && appointmentToCancel && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <div className="bg-[#1a1a1a] rounded-xl w-full max-w-md mx-4 border border-gray-700">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-red-400"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Cancel Appointment?</h3>
                <p className="text-gray-300">
                  Are you sure you want to cancel this appointment?
                </p>
              </div>

              <div className="bg-[#222222] rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className={`${appointmentToCancel.color || 'bg-blue-700'} w-3 h-3 rounded-full`} />
                  <div>
                    <h4 className="text-white font-medium">{appointmentToCancel.type}</h4>
                    <p className="text-gray-400 text-sm">{appointmentToCancel.date} • {appointmentToCancel.time}</p>
                    <p className="text-gray-400 text-sm mt-1">Member: {member.firstName} {member.lastName}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
                >
                  No, Keep It
                </button>
                <button
                  onClick={confirmCancellation}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ShowAppointmentModal