/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { X, Edit3, Trash2 } from 'lucide-react';

const AppointmentModalMain = ({
  isOpen,
  onClose,
  selectedMemberMain,
  getMemberAppointmentsMain,
  appointmentTypesMain,
  handleEditAppointmentMain,
  handleDeleteAppointmentMain,
  memberContingent,
  currentBillingPeriodMain,
  handleManageContingentMain,
  handleCreateNewAppointmentMain
}) => {
  if (!isOpen || !selectedMemberMain) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">
              {selectedMemberMain.title}'s Appointments
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-700 text-white rounded-lg"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3 mb-4">
            <h3 className="text-sm font-medium text-gray-400">Upcoming Appointments</h3>
            {getMemberAppointmentsMain(selectedMemberMain.id).length > 0 ? (
              getMemberAppointmentsMain(selectedMemberMain.id).map((appointment) => {
                const appointmentType = appointmentTypesMain.find((type) => type.name === appointment.type);
                const backgroundColor = appointmentType ? appointmentType.color : "bg-gray-700";
                
                return (
                  <div
                    key={appointment.id}
                    className={`${backgroundColor} rounded-xl p-3 hover:opacity-90 transition-colors cursor-pointer`}
                    onClick={() => handleEditAppointmentMain(appointment)}
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
                              new Date(appointment.date).getTime() + (appointmentType?.duration || 30) * 60000,
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
                            e.stopPropagation();
                            handleEditAppointmentMain(appointment);
                          }}
                          className="p-1.5 bg-[#2F2F2F] text-white hover:bg-[#3F3F3F] rounded-full"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAppointmentMain(appointment.id);
                          }}
                          className="p-1.5 bg-[#2F2F2F] text-white hover:bg-[#3F3F3F] rounded-full"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-400 bg-[#222222] rounded-xl">
                No appointments scheduled
              </div>
            )}
          </div>

          <div className="flex items-center justify-between py-3 px-2 border-t border-gray-700 mb-4">
            <div className="text-sm text-gray-300">
              Contingent ({currentBillingPeriodMain}):{" "}
              {memberContingent[selectedMemberMain.id]?.current?.used || 0} /{" "}
              {memberContingent[selectedMemberMain.id]?.current?.total || 0}
            </div>
            <button
              onClick={() => handleManageContingentMain(selectedMemberMain.id)}
              className="flex items-center gap-1 bg-gray-700 text-white hover:bg-gray-600 px-3 py-1 rounded-md text-sm"
            >
              <Edit3 size={16} />
              Manage
            </button>
          </div>

          <button
            onClick={handleCreateNewAppointmentMain}
            className="w-full py-3 text-sm bg-[#2F2F2F] hover:bg-[#3F3F3F] text-white rounded-xl flex items-center justify-center gap-2"
          >
            Create New Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModalMain;