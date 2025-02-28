/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { X } from 'lucide-react';

const SelectedAppointmentModal = ({
  selectedAppointment,
  setSelectedAppointment,
  appointmentTypes,
  freeAppointments,
  handleAppointmentChange,
  appointments,
  setAppointments,
  setIsNotifyMemberOpen,
  setNotifyAction
}) => {
  if (!selectedAppointment) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
      onClick={() => setSelectedAppointment(null)}
    >
      <div
        className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">
            Edit Appointment
          </h2>
          <button
            onClick={() => setSelectedAppointment(null)}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form className="space-y-4 custom-scrollbar overflow-y-auto max-h-[60vh]">
            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Member</label>
              <input
                type="text"
                value={selectedAppointment.name}
                readOnly
                className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">
                Appointment Type
              </label>
              <select
                value={selectedAppointment.type}
                onChange={(e) =>
                  handleAppointmentChange({ type: e.target.value })
                }
                className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
              >
                {appointmentTypes.map((type) => (
                  <option
                    key={type.name}
                    value={type.name}
                    className={type.color}
                  >
                    {type.name} ({type.duration} minutes)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Date & Time</label>
              <input
                type="datetime-local"
                value={`${selectedAppointment.date}T${selectedAppointment.time}`}
                onChange={(e) =>
                  handleAppointmentChange({
                    date: e.target.value.split("T")[0],
                    time: e.target.value.split("T")[1],
                  })
                }
                className="w-full bg-[#101010] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Special Note</label>
              <textarea
                value={selectedAppointment.specialNote.text}
                onChange={(e) =>
                  handleAppointmentChange({
                    specialNote: {
                      ...selectedAppointment.specialNote,
                      text: e.target.value,
                    },
                  })
                }
                className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF] min-h-[100px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isImportant"
                checked={selectedAppointment.specialNote.isImportant}
                onChange={(e) =>
                  handleAppointmentChange({
                    specialNote: {
                      ...selectedAppointment.specialNote,
                      isImportant: e.target.checked,
                    },
                  })
                }
                className="rounded text-[#3F74FF] focus:ring-[#3F74FF]"
              />
              <label
                htmlFor="isImportant"
                className="text-sm text-gray-200"
              >
                Mark as important
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">Note Duration</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={selectedAppointment.specialNote.startDate || ""}
                  onChange={(e) =>
                    handleAppointmentChange({
                      specialNote: {
                        ...selectedAppointment.specialNote,
                        startDate: e.target.value,
                      },
                    })
                  }
                  className="w-1/2 bg-[#101010] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                />
                <input
                  type="date"
                  value={selectedAppointment.specialNote.endDate || ""}
                  onChange={(e) =>
                    handleAppointmentChange({
                      specialNote: {
                        ...selectedAppointment.specialNote,
                        endDate: e.target.value,
                      },
                    })
                  }
                  className="w-1/2 bg-[#101010] white-calendar-icon text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-200">
                Available Appointments
              </label>
              <select className="w-full bg-[#101010] text-sm rounded-xl px-3 py-2.5 text-white outline-none focus:ring-2 focus:ring-[#3F74FF]">
                <option value="">Select available time</option>
                {freeAppointments.map((app) => (
                  <option key={app.id} value={`${app.date}T${app.time}`}>
                    {app.date} at {app.time}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2">
          <button
            onClick={() => {
              // Save changes to the appointments list
              const updatedAppointments = appointments.map((app) =>
                app.id === selectedAppointment.id
                  ? selectedAppointment
                  : app
              );
              setAppointments(updatedAppointments);

              // Show the notification popup
              setIsNotifyMemberOpen(true);
              setNotifyAction("change");

              // Close the edit modal
              setSelectedAppointment(null);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#3F74FF] text-sm font-medium text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
          >
            Save Changes
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default SelectedAppointmentModal;