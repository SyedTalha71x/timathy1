/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { X, Edit, User, Ban, Trash2, AlertTriangle } from "lucide-react";
import { MemberSpecialNoteIcon } from '../../shared/shared-special-note-icon';

// Helper to parse date from appointment format "Mon | 27-01-2025" to Date object
const parseDateFromAppointment = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.split("|");
  if (parts.length < 2) return null;
  const datePart = parts[1].trim(); // "27-01-2025"
  const [day, month, year] = datePart.split("-");
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
};

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
  onCancel,         // Legacy: will be called after notify modal confirms
  onDelete,         // Optional: separate delete handler for cancelled appointments
  onViewMember,
  onEditMemberNote, // Callback to open EditMemberModal with specific tab
  // Optional: direct state access for internal handling
  appointmentsMain,
  setAppointmentsMain,
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [emailNotification, setEmailNotification] = useState(true);
  const [pushNotification, setPushNotification] = useState(true);
  
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

  // Handle cancel appointment - show notify modal directly
  const handleCancelClick = () => {
    setShowNotifyModal(true);
  };

  // Confirm cancel with notification choice
  const handleConfirmCancel = (shouldNotify) => {
    // If we have direct access to appointments state, update it directly
    // This avoids triggering the external NotifyModal
    if (appointmentsMain && setAppointmentsMain) {
      const updatedAppointments = appointmentsMain.map((app) =>
        app.id === appointmentData.id 
          ? { ...app, status: "cancelled", isCancelled: true } 
          : app
      );
      setAppointmentsMain(updatedAppointments);
    } else if (onCancel) {
      // Fallback to legacy handler - but this will trigger external modal
      // This should only happen if the parent component doesn't pass state props
      onCancel();
    }
    
    setShowNotifyModal(false);
    onClose();
    
    if (shouldNotify) {
      console.log("Notification requested for cancellation:", { email: emailNotification, push: pushNotification });
    }
  };

  // Cancel from notify modal - go back
  const handleCancelNotify = () => {
    setShowNotifyModal(false);
  };

  // Handle delete confirmation
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    if (onDelete) {
      onDelete();
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

            {/* Cancel Appointment (only show if not cancelled) - directly shows notify modal */}
            {!isCancelled && (
              <button
                onClick={handleCancelClick}
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
                  Go Back
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

      {/* Integrated Notify Member Modal (identical to EditAppointmentModal) */}
      {showNotifyModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-4" 
          onClick={handleCancelNotify}
        >
          <div 
            className="bg-[#181818] w-[90%] sm:w-[480px] rounded-xl overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white">Notify Member</h2>
              <button onClick={handleCancelNotify} className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-white text-sm">
                <span className="font-semibold text-orange-400">{fullName}'s</span> appointment on{" "}
                <span className="font-semibold text-orange-400">
                  {appointmentData.date && parseDateFromAppointment(appointmentData.date)?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span> at{" "}
                <span className="font-semibold text-orange-400">{appointmentData.time || `${appointmentData.startTime} - ${appointmentData.endTime}`}</span>{" "}
                will be <span className="font-semibold text-red-400">cancelled</span>.
                <br /><br />
                Do you want to notify the member about this cancellation?
              </p>

              {/* Notification Options */}
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotification}
                    onChange={(e) => setEmailNotification(e.target.checked)}
                    className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <span className="text-white text-sm">Email Notification</span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pushNotification}
                    onChange={(e) => setPushNotification(e.target.checked)}
                    className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <span className="text-white text-sm">App Push Notification</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-800 flex flex-col-reverse sm:flex-row gap-2 sm:justify-between">
              <button
                onClick={handleCancelNotify}
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-700 text-sm font-medium text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                Back
              </button>

              <div className="flex flex-col-reverse sm:flex-row gap-2">
                <button
                  onClick={() => handleConfirmCancel(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-800 text-sm font-medium text-white rounded-xl hover:bg-gray-700 transition-colors border border-gray-600"
                >
                  No, Don't Notify
                </button>

                <button
                  onClick={() => handleConfirmCancel(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-orange-500 text-sm font-medium text-white rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Yes, Notify Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
