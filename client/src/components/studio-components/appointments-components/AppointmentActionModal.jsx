/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { X, Edit, User, Ban, Trash2, AlertTriangle, Users } from "lucide-react";
import { MemberSpecialNoteIcon } from '../../shared/special-note/shared-special-note-icon';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { cancelAppointment, fetchAllAppointments } from '../../../features/appointments/AppointmentSlice'
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
      className={`bg-primary rounded-xl flex items-center justify-center text-white font-semibold ${className}`}
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
  onOpenEditLeadModal, // Callback to open EditLeadModal with specific tab
  // Relations data
  memberRelations = {},
  leadRelations = {},
  // Optional: direct state access for internal handling
  appointmentsMain,
  setAppointmentsMain,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [emailNotification, setEmailNotification] = useState(true);
  const [pushNotification, setPushNotification] = useState(true);

  // Support both prop names
  const appointmentData = appointment || appointmentMain;

  if (!isOpen || !appointmentData) return null;

  const isCancelled = appointmentData.isCancelled || appointmentData.status === "cancelled";
  const isBlocked = appointmentData.isBlocked || appointmentData.type === "Blocked Time";

  // Check if this is a Lead (Trial Training with leadId)
  const isLead = appointmentData.isTrial && appointmentData.leadId;

  // Get member info
  const firstName = appointmentData.firstName || appointmentData.name?.split(" ")[0] || "";
  const lastName = appointmentData.lastName || appointmentData.name?.split(" ")[1] || "";
  const fullName = appointmentData.name ?
    (appointmentData.lastName ? `${appointmentData.name} ${appointmentData.lastName}` : appointmentData.name)
    : `${firstName} ${lastName}`.trim();

  // Handle clicking on special note icon
  const handleEditNote = (memberData, tab) => {
    if (isLead && onOpenEditLeadModal) {
      // For leads, open Edit Lead Modal
      onOpenEditLeadModal(appointmentData.leadId, tab || "note");
    } else if (onEditMemberNote) {
      onEditMemberNote(memberData, tab || "note");
    }
  };

  // Get relations count for member or lead
  const getRelationsCount = () => {
    const relations = isLead
      ? leadRelations[appointmentData.leadId]
      : memberRelations[appointmentData.memberId];
    if (!relations) return 0;
    return Object.values(relations).reduce((total, categoryRelations) => total + categoryRelations.length, 0);
  };

  // Handle clicking on relations button
  const handleRelationsClick = () => {
    if (isLead && onOpenEditLeadModal) {
      // For leads, open Edit Lead Modal with relations tab
      onOpenEditLeadModal(appointmentData.leadId, "relations");
    } else if (onEditMemberNote) {
      // For members, open Edit Member Modal with relations tab
      onEditMemberNote({
        ...appointmentData,
        firstName,
        lastName,
        id: appointmentData.memberId,
      }, "relations");
    }
  };

  // Handle View Profile - navigate to Members or Leads page
  const handleViewProfile = () => {
    onClose();

    if (isLead) {
      // Navigate to Leads page with filter
      navigate('/dashboard/leads', {
        state: {
          filterLeadId: appointmentData.leadId,
          filterLeadName: fullName
        }
      });
    } else if (onViewMember) {
      // Use existing handler for members
      onViewMember();
    }
  };

  // Handle cancel appointment - show notify modal directly
  const handleCancelClick = () => {
    setShowNotifyModal(true);
  };

  // Confirm cancel with notification choice
  const handleConfirmCancel = (shouldNotify) => {
    if (appointmentData && appointmentData._id) {
      dispatch(cancelAppointment(appointmentData._id)); // only the string ID
    } else if (onCancel) {
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
        className="bg-surface-card w-[90%] sm:w-[500px] rounded-xl overflow-hidden border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-content-primary">Appointment Options</h2>
          <button
            onClick={onClose}
            className="text-content-muted hover:text-content-primary p-2 hover:bg-surface-button rounded-lg transition-colors"
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

            {/* Avatar - Hide for Leads, show for Members */}
            {!isBlocked && !isLead && (
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
              <div className="flex items-center gap-2">
                <h3 className="text-content-primary font-medium truncate">{fullName}</h3>
                {/* Relations Button - for both members and leads */}
                {!isBlocked && (
                  <button
                    onClick={handleRelationsClick}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover bg-primary/10 hover:bg-primary/20 px-1.5 py-0.5 rounded transition-colors"
                    title="View Relations"
                  >
                    <Users size={12} />
                    <span>{getRelationsCount()}</span>
                  </button>
                )}
              </div>
              <p className="text-content-muted text-sm">
                {appointmentData.isTrial && appointmentData.trialType
                  ? `Trial Training • ${appointmentData.trialType}`
                  : appointmentData.type}
              </p>
              <p className="text-content-muted text-sm">
                {appointmentData.date && appointmentData.date.split("|")[1]?.trim()} • {appointmentData.startTime} - {appointmentData.endTime}
              </p>
            </div>
          </div>

          {/* Status Messages */}
          {isCancelled && (
            <div className="flex items-center gap-2 bg-accent-red/10 border border-accent-red/30 rounded-xl px-4 py-3">
              <Ban size={16} className="text-accent-red" />
              <p className="text-accent-red text-sm font-medium">This appointment has been cancelled</p>
            </div>
          )}

          {appointmentData.isPast && !isCancelled && (
            <div className="flex items-center gap-2 bg-accent-yellow/10 border border-accent-yellow/30 rounded-xl px-4 py-3">
              <p className="text-accent-yellow text-sm">This is a past appointment</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {/* Edit Appointment - Orange (only show if not cancelled) */}
            {!isCancelled && (
              <button
                onClick={onEdit}
                className="w-full px-5 py-3 text-sm font-medium text-white rounded-xl transition-colors flex items-center justify-center bg-primary hover:bg-primary-hover cursor-pointer"
              >
                <Edit className="mr-2" size={16} /> Edit Appointment
              </button>
            )}

            {/* Cancel Appointment (only show if not cancelled) - directly shows notify modal */}
            {!isCancelled && (
              <button
                onClick={handleCancelClick}
                className="w-full px-5 py-3 text-sm font-medium rounded-xl transition-colors flex items-center justify-center bg-surface-button hover:bg-surface-hover text-content-secondary cursor-pointer"
              >
                <X className="mr-2" size={16} /> Cancel Appointment
              </button>
            )}

            {/* Delete Appointment (only show if cancelled) */}
            {isCancelled && (
              <button
                onClick={handleDeleteClick}
                className="w-full px-5 py-3 text-sm font-medium rounded-xl transition-colors flex items-center justify-center bg-surface-button hover:bg-surface-hover text-content-secondary cursor-pointer"
              >
                <Trash2 className="mr-2" size={16} /> Delete Appointment
              </button>
            )}

            {/* View Full Profile - Secondary color (only show if not blocked) */}
            {!isBlocked && (
              <button
                onClick={handleViewProfile}
                className="w-full px-5 py-3 bg-secondary hover:brightness-110 text-sm font-medium text-white rounded-xl cursor-pointer transition-all flex items-center justify-center"
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
            className="bg-surface-card w-full max-w-sm rounded-xl overflow-hidden border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-accent-red/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={24} className="text-accent-red" />
              </div>
              <h3 className="text-lg font-semibold text-content-primary text-center mb-2">
                Delete Appointment?
              </h3>
              <p className="text-sm text-content-muted text-center mb-6">
                This will permanently delete the cancelled appointment with{" "}
                <span className="text-content-primary">{fullName}</span>. This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 py-2.5 text-sm font-medium text-content-muted hover:text-content-primary bg-surface-button hover:bg-surface-hover rounded-xl transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-accent-red hover:bg-accent-red/90 rounded-xl transition-colors"
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
            className="bg-surface-card w-[90%] sm:w-[480px] rounded-xl overflow-hidden border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-semibold text-content-primary">Notify {isLead ? "Lead" : "Member"}</h2>
              <button onClick={handleCancelNotify} className="text-content-muted hover:text-content-primary p-2 hover:bg-surface-button rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-content-primary text-sm">
                <span className="font-semibold text-primary">{fullName}'s</span>{" "}
                <span className="text-content-muted">
                  ({appointmentData.isTrial && appointmentData.trialType
                    ? `Trial Training • ${appointmentData.trialType}`
                    : appointmentData.type})
                </span> appointment on{" "}
                <span className="font-semibold text-primary">
                  {appointmentData.date && parseDateFromAppointment(appointmentData.date)?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span> at{" "}
                <span className="font-semibold text-primary">{appointmentData.time || `${appointmentData.startTime} - ${appointmentData.endTime}`}</span>{" "}
                will be <span className="font-semibold text-accent-red">cancelled</span>.
                <br /><br />
                Do you want to notify the {isLead ? "lead" : "member"} about this cancellation?
              </p>

              {/* Notification Options */}
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotification}
                    onChange={(e) => setEmailNotification(e.target.checked)}
                    className="w-4 h-4 text-primary bg-surface-button border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-content-primary text-sm">Email Notification</span>
                </label>

                {/* App Push Notification - only for members, not leads */}
                {!isLead && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pushNotification}
                      onChange={(e) => setPushNotification(e.target.checked)}
                      className="w-4 h-4 text-primary bg-surface-button border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-content-primary text-sm">App Push Notification</span>
                  </label>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border flex flex-col-reverse sm:flex-row gap-2 sm:justify-between">
              <button
                onClick={handleCancelNotify}
                className="w-full sm:w-auto px-5 py-2.5 bg-surface-button text-sm font-medium text-content-secondary rounded-xl hover:bg-surface-button-hover transition-colors"
              >
                Back
              </button>

              <div className="flex flex-col-reverse sm:flex-row gap-2">
                <button
                  onClick={() => handleConfirmCancel(false)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-surface-dark text-sm font-medium text-content-secondary rounded-xl hover:bg-surface-button transition-colors border border-border"
                >
                  No, Don't Notify
                </button>

                <button
                  onClick={() => handleConfirmCancel(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-primary text-sm font-medium text-white rounded-xl hover:bg-primary-hover transition-colors"
                >
                  Yes, Notify {isLead ? "Lead" : "Member"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
