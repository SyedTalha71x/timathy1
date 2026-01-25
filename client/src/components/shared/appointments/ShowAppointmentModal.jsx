/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { X, Edit3, Trash2, Plus } from 'lucide-react';

// Helper function to extract hex color from various formats
const getColorHex = (type) => {
  if (!type) return "#808080";
  // If colorHex exists, use it directly
  if (type.colorHex) return type.colorHex;
  // If color is a hex value, use it
  if (type.color?.startsWith("#")) return type.color;
  // If color is a Tailwind class like bg-[#FF843E], extract the hex
  const match = type.color?.match(/#[A-Fa-f0-9]{6}/);
  if (match) return match[0];
  // Default fallback
  return "#808080";
};

const AppointmentModalMain = ({
  isOpen,
  onClose,
  selectedMemberMain,
  getMemberAppointmentsMain,
  appointmentTypesMain,
  handleEditAppointmentMain,
  handleDeleteAppointmentMain,
  memberCredits,
  memberContingent, // Legacy prop name for backwards compatibility
  currentBillingPeriodMain,
  handleManageCreditsMain,
  handleManageContingentMain, // Legacy prop name for backwards compatibility
  handleCreateNewAppointmentMain
}) => {
  if (!isOpen || !selectedMemberMain) return null;

  // Support both old (memberContingent) and new (memberCredits) prop names
  const creditsData = memberCredits || memberContingent || {};
  const manageCreditsHandler = handleManageCreditsMain || handleManageContingentMain;

  const appointments = getMemberAppointmentsMain(selectedMemberMain.id);
  const credits = creditsData[selectedMemberMain.id]?.current || { used: 0, total: 0 };
  const remaining = credits.total - credits.used;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#181818] rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-lg font-medium text-white">
            {selectedMemberMain.title}'s Appointments
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-700 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Credits Card */}
        <div className="mx-4 mt-4">
          <div className="bg-[#222222] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Credits ({currentBillingPeriodMain})</span>
              <button
                onClick={() => manageCreditsHandler(selectedMemberMain.id)}
                className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Edit3 size={14} />
                Manage
              </button>
            </div>
            
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">{remaining}</span>
              <span className="text-gray-500 text-lg mb-0.5">/ {credits.total}</span>
              <span className="text-gray-500 text-sm mb-1 ml-1">remaining</span>
            </div>

            <div className="mt-3 h-1.5 bg-[#333333] rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all bg-blue-500"
                style={{ width: `${credits.total > 0 ? (remaining / credits.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Upcoming Appointments</h3>
          
          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((appointment) => {
                const appointmentType = appointmentTypesMain.find(
                  (type) => type.name === appointment.type
                );
                // Use getColorHex to extract hex color from various formats
                const bgColor = getColorHex(appointmentType) || "#374151";
                
                return (
                  <div
                    key={appointment.id}
                    className="rounded-xl p-3 hover:opacity-90 transition-colors cursor-pointer"
                    style={{ backgroundColor: bgColor }}
                    onClick={() => handleEditAppointmentMain(appointment)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm text-white">{appointment.title}</p>
                        <p className="text-sm text-white/70 mt-1">
                          {new Date(appointment.date).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-white/70">
                          {new Date(appointment.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" - "}
                          {new Date(
                            new Date(appointment.date).getTime() + 
                            (appointmentType?.duration || 30) * 60000
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAppointmentMain(appointment);
                          }}
                          className="p-1.5 bg-black/20 text-white hover:bg-black/30 rounded-full transition-colors"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAppointmentMain(appointment.id);
                          }}
                          className="p-1.5 bg-black/20 text-white hover:bg-black/30 rounded-full transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 bg-[#222222] rounded-xl">
              No appointments scheduled
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleCreateNewAppointmentMain}
            className="w-full py-3 text-sm font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Create New Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModalMain;
