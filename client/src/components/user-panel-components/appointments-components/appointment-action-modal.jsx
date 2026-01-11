/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { X, Edit, User } from "lucide-react";

export default function AppointmentActionModal({
  isOpen,
  onClose,
  appointmentMain,
  onEdit,
  onCancel,
  onViewMember,
}) {
  if (!isOpen || !appointmentMain) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] md:p-4 p-2"
      onClick={onClose}
    >
      <div
        className="bg-[#181818] w-[90%] sm:w-[500px] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Appointment Options</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-2">
          <div className="mb-4">
            <h3 className="text-white font-medium">{appointmentMain.name}</h3>
            <p className="text-gray-400 text-sm">{appointmentMain.type}</p>
            <p className="text-gray-400 text-sm">
              {appointmentMain.date && appointmentMain.date.split("|")[1]} • {appointmentMain.startTime} - {appointmentMain.endTime}
            </p>

          
               {appointmentMain.isPast === true && <p className="text-yellow-500 text-sm mt-2">This is a past appointment</p>}
              
          </div>

          <button
            onClick={onEdit}
            className="w-full px-5 py-3 bg-[#3F74FF] hover:bg-[#3F74FF]/90 cursor-pointer text-sm font-medium text-white rounded-xl transition-colors flex items-center justify-center"
          >
            <Edit className="mr-2" size={16} /> Edit Appointment
          </button>

          <button
            onClick={onCancel}
            className="w-full px-5 py-3 bg-red-600 hover:bg-red-700 cursor-pointer text-sm font-medium text-white rounded-xl transition-colors flex items-center justify-center"
          >
            <X className="mr-2" size={16} /> Cancel Appointment
          </button>

          <button
            onClick={onViewMember}
            className="w-full px-5 py-3 bg-gray-700 text-sm font-medium text-white rounded-xl hover:bg-gray-600 cursor-pointer transition-colors flex items-center justify-center"
          >
            <User className="mr-2" size={16} /> View Member
          </button>
        </div>
      </div>
    </div>
  );
}
