/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { X, Edit, User, Ban, Trash2, AlertTriangle } from "lucide-react";
import { MemberSpecialNoteIcon } from '../shared-special-note-icon';

// Initials Avatar Component
const InitialsAvatar = ({ firstName, lastName, size = 48, className = "" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || "";
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "?";
  };

  return (
    <div
      className={`bg-orange-500 rounded-xl flex items-center justify-center text-white font-semibold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {getInitials()}
    </div>
  );
};

export default function AppointmentActionModal({
  isOpen,
  onClose,
  appointment,      // calendar.jsx uses this
  appointmentMain,  // appointments.jsx uses this
  onEdit,
  onCancel,
  onDelete,         // Optional: separate delete handler for cancelled appointments
  onViewMember,
  onEditMemberNote, // Callback to open EditMemberModal with specific tab
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Support both prop names
  const appointmentData = appointment || appointmentMain;
  
  if (!isOpen || !appointmentData) return null;

  const isCancelled = appointmentData.isCancelled || appointmentData.status === "cancelled";
  const isBlocked = appointmentData.isBlocked || appointmentData.type === "Blocked Time";
  
  // Get member info
  const firstName = appointmentData.firstName || appointmentData.name?.split(" ")[0] || "";
  const lastName = appointmentData.lastName || appointmentData.name?.split(" ")[1] || "";
  const fullName = appointmentData.name ? 
    (appointmentData.lastName ? `${appointmentData.name} ${appointmentData.lastName}` : appointmentData.name) 
    : `${firstName} ${lastName}`.trim();

  // Handle clicking on special note icon
  const handleEditNote = (memberData, tab) => {
    if (onEditMemberNote) {
      onEditMemberNote(memberData, tab || "note");
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    if (onDelete) {
      onDelete();
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

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

        <div className="p-6 space-y-4">
          {/* Member Info Section */}
          <div className="flex items-center gap-4 mb-2">
            {/* Special Note Icon */}
            {!isBlocked && (
              <MemberSpecialNoteIcon
                member={{
                  ...appointmentData,
                  firstName,
                  lastName,
                }}
                onEditMember={handleEditNote}
                size="md"
                position="relative"
              />
            )}
            
            {/* Avatar */}
            {!isBlocked && (
              appointmentData.image || appointmentData.avatar || appointmentData.logo ? (
                <img 
                  src={appointmentData.image || appointmentData.avatar || appointmentData.logo} 
                  alt={fullName}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                />
              ) : (
                <InitialsAvatar 
                  firstName={firstName} 
                  lastName={lastName} 
                  size={48} 
                />
              )
            )}
            
            {/* Name and Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">{fullName}</h3>
              <p className="text-gray-400 text-sm">{appointmentData.type}</p>
              <p className="text-gray-400 text-sm">
                {appointmentData.date && appointmentData.date.split("|")[1]?.trim()} • {appointmentData.startTime} - {appointmentData.endTime}
              </p>
            </div>
          </div>

          {/* Status Messages */}
          {isCancelled && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <Ban size={16} className="text-red-400" />
              <p className="text-red-400 text-sm font-medium">This appointment has been cancelled</p>
            </div>
          )}
          
          {appointmentData.isPast && !isCancelled && (
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3">
              <p className="text-yellow-400 text-sm">This is a past appointment</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {/* Edit Appointment - Orange (only show if not cancelled) */}
            {!isCancelled && (
              <button
                onClick={onEdit}
                className="w-full px-5 py-3 text-sm font-medium text-white rounded-xl transition-colors flex items-center justify-center bg-orange-500 hover:bg-orange-600 cursor-pointer"
              >
                <Edit className="mr-2" size={16} /> Edit Appointment
              </button>
            )}

            {/* Cancel Appointment (only show if not cancelled) */}
            {!isCancelled && (
              <button
                onClick={onCancel}
                className="w-full px-5 py-3 text-sm font-medium rounded-xl transition-colors flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white cursor-pointer"
              >
                <X className="mr-2" size={16} /> Cancel Appointment
              </button>
            )}

            {/* Delete Appointment (only show if cancelled) */}
            {isCancelled && (
              <button
                onClick={handleDeleteClick}
                className="w-full px-5 py-3 text-sm font-medium rounded-xl transition-colors flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white cursor-pointer"
              >
                <Trash2 className="mr-2" size={16} /> Delete Appointment
              </button>
            )}

            {/* View Full Profile - Blue (only show if not blocked) */}
            {!isBlocked && (
              <button
                onClick={onViewMember}
                className="w-full px-5 py-3 bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white rounded-xl cursor-pointer transition-colors flex items-center justify-center"
              >
                <User className="mr-2" size={16} /> View Full Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-4"
          onClick={handleCancelDelete}
        >
          <div 
            className="bg-[#181818] w-full max-w-sm rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white text-center mb-2">
                Delete Appointment?
              </h3>
              <p className="text-sm text-gray-400 text-center mb-6">
                This will permanently delete the cancelled appointment with{" "}
                <span className="text-white">{fullName}</span>. This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
