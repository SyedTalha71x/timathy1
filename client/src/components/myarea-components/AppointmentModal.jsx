/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react"
import { X } from "lucide-react"

const AppointmentModal = ({
  show,
  member,
  onClose,
  getMemberAppointments,
  appointmentTypes,
  handleEditAppointment,
  handleCancelAppointment,
  currentBillingPeriod,
  memberContingentData,
  handleManageContingent,
  handleCreateNewAppointment,
}) => {
  if (!show || !member) return null

  return (
    <div className="fixed inset-0 bg-black/80 text-white flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">{member.firstName}'s Appointments</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-700 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>

          {/* Appointments List */}
          <div className="space-y-3 mb-4">
            <h3 className="text-sm font-medium text-gray-400">Upcoming Appointments</h3>
            {getMemberAppointments(member.id).length > 0 ? (
              getMemberAppointments(member.id).map((appointment) => {
                const appointmentType = appointmentTypes.find((type) => type.name === appointment.type)
                const backgroundColor = appointmentType ? appointmentType.color : "bg-gray-700"

                return (
                  <div
                    key={appointment.id}
                    className={`${backgroundColor} rounded-xl p-3 hover:opacity-90 transition-colors cursor-pointer`}
                    onClick={() => handleEditAppointment(appointment)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm text-white">{appointment.title}</p>
                        <div>
                          <p className="text-sm text-white/70">
                            {new Date(appointment.date).toLocaleString([], {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-white/70">
                            {new Date(appointment.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(
                              new Date(appointment.date).getTime() + (appointmentType?.duration || 30) * 60000
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
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
                          {/* Pencil Icon */}
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
                            className="lucide lucide-pencil"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCancelAppointment(appointment.id)
                          }}
                          className="p-1.5 bg-[#2F2F2F] hover:bg-[#3F3F3F] rounded-full"
                        >
                          {/* Trash Icon */}
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
                            className="lucide lucide-trash-2"
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

          {/* Contingent Info */}
          <div className="flex items-center justify-between py-3 px-2 border-t border-gray-700 mb-4">
            <div className="text-sm text-gray-300">
              Contingent ({currentBillingPeriod}):{" "}
              {memberContingentData[member.id]?.current?.used || 0} /{" "}
              {memberContingentData[member.id]?.current?.total || 0}
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

          {/* Create New */}
          <button
            onClick={handleCreateNewAppointment}
            className="w-full py-3 text-sm bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl flex items-center justify-center gap-2"
          >
            Create New Appointment
          </button>
        </div>
      </div>
    </div>
  )
}

export default AppointmentModal
