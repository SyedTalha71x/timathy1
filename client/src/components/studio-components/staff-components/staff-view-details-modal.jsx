/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

// Initials Avatar Component - Blue background with initials
const InitialsAvatar = ({ firstName, lastName, size = "md", className = "" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || ""
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "?"
  }

  const sizeClasses = {
    sm: "w-9 h-9 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-24 h-24 text-3xl",
  }

  return (
    <div 
      className={`bg-secondary rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
    >
      {getInitials()}
    </div>
  )
}

const StaffViewDetailsModal = ({
  isOpen,
  onClose,
  selectedStaff,
  onEditStaff,
}) => {
  // Copy states
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedMobile, setCopiedMobile] = useState(false);
  const [copiedTelephone, setCopiedTelephone] = useState(false);
  const [copiedStreet, setCopiedStreet] = useState(false);
  const [copiedZipCity, setCopiedZipCity] = useState(false);
  const [copiedFirstName, setCopiedFirstName] = useState(false);
  const [copiedLastName, setCopiedLastName] = useState(false);
  const [copiedCountry, setCopiedCountry] = useState(false);
  const [copiedUsername, setCopiedUsername] = useState(false);
  const [copiedStaffId, setCopiedStaffId] = useState(false);

  // Reset copy states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCopiedEmail(false);
      setCopiedMobile(false);
      setCopiedTelephone(false);
      setCopiedStreet(false);
      setCopiedZipCity(false);
      setCopiedFirstName(false);
      setCopiedLastName(false);
      setCopiedCountry(false);
      setCopiedUsername(false);
      setCopiedStaffId(false);
    }
  }, [isOpen]);

  if (!isOpen || !selectedStaff) return null;

  // Copy handlers
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(selectedStaff.email || "");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const handleCopyMobile = async () => {
    try {
      await navigator.clipboard.writeText(selectedStaff.mobileNumber || selectedStaff.phone || "");
      setCopiedMobile(true);
      setTimeout(() => setCopiedMobile(false), 2000);
    } catch (err) {
      console.error('Failed to copy mobile:', err);
    }
  };

  const handleCopyTelephone = async () => {
    try {
      await navigator.clipboard.writeText(selectedStaff.telephoneNumber || "");
      setCopiedTelephone(true);
      setTimeout(() => setCopiedTelephone(false), 2000);
    } catch (err) {
      console.error('Failed to copy telephone:', err);
    }
  };

  const handleCopyStreet = async () => {
    try {
      await navigator.clipboard.writeText(selectedStaff.street || "");
      setCopiedStreet(true);
      setTimeout(() => setCopiedStreet(false), 2000);
    } catch (err) {
      console.error('Failed to copy street:', err);
    }
  };

  const handleCopyZipCity = async () => {
    try {
      const zipCity = `${selectedStaff.zipCode || ""} ${selectedStaff.city || ""}`.trim();
      await navigator.clipboard.writeText(zipCity);
      setCopiedZipCity(true);
      setTimeout(() => setCopiedZipCity(false), 2000);
    } catch (err) {
      console.error('Failed to copy zip/city:', err);
    }
  };

  const handleCopyFirstName = async () => {
    try {
      await navigator.clipboard.writeText(selectedStaff.firstName || "");
      setCopiedFirstName(true);
      setTimeout(() => setCopiedFirstName(false), 2000);
    } catch (err) {
      console.error('Failed to copy first name:', err);
    }
  };

  const handleCopyLastName = async () => {
    try {
      await navigator.clipboard.writeText(selectedStaff.lastName || "");
      setCopiedLastName(true);
      setTimeout(() => setCopiedLastName(false), 2000);
    } catch (err) {
      console.error('Failed to copy last name:', err);
    }
  };

  const handleCopyCountry = async () => {
    try {
      await navigator.clipboard.writeText(selectedStaff.country || "");
      setCopiedCountry(true);
      setTimeout(() => setCopiedCountry(false), 2000);
    } catch (err) {
      console.error('Failed to copy country:', err);
    }
  };

  const handleCopyUsername = async () => {
    try {
      await navigator.clipboard.writeText(selectedStaff.username || "");
      setCopiedUsername(true);
      setTimeout(() => setCopiedUsername(false), 2000);
    } catch (err) {
      console.error('Failed to copy username:', err);
    }
  };

  const handleCopyStaffId = async () => {
    try {
      await navigator.clipboard.writeText(String(selectedStaff.id) || "");
      setCopiedStaffId(true);
      setTimeout(() => setCopiedStaffId(false), 2000);
    } catch (err) {
      console.error('Failed to copy staff ID:', err);
    }
  };

  // Calculate age from birthday
  const calculateAge = (birthday) => {
    if (!birthday) return null;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatBirthday = (birthday) => {
    if (!birthday) return "-";
    const date = new Date(birthday);
    const age = calculateAge(birthday);
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (Age: ${age})`;
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000]">
      <div className="bg-surface-card rounded-xl w-full max-w-2xl max-h-[90vh] md:max-h-[85vh] my-2 md:my-8 relative flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6 pb-4 flex-shrink-0">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-content-primary text-lg font-semibold">Staff Details</h2>
            <button onClick={onClose} className="text-content-muted hover:text-content-primary">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          {/* Staff Avatar and Name */}
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            {selectedStaff.img ? (
              <img
                src={selectedStaff.img}
                alt={`${selectedStaff.firstName} ${selectedStaff.lastName}`}
                className="w-16 h-16 rounded-xl object-cover"
              />
            ) : (
              <InitialsAvatar 
                firstName={selectedStaff.firstName} 
                lastName={selectedStaff.lastName} 
                size="lg"
                className="w-16 h-16 text-xl"
              />
            )}
            <div>
              <h3 className="text-content-primary text-xl font-semibold">
                {selectedStaff.firstName} {selectedStaff.lastName}
              </h3>
              <p className="text-content-muted capitalize">{selectedStaff.role}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 md:p-6 pt-0 overflow-y-auto flex-1 custom-scrollbar">
          <div className="space-y-4 text-content-primary">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Personal Information</div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-content-muted">First Name</p>
                  <div className="flex items-center gap-3">
                    <p>{selectedStaff.firstName || "-"}</p>
                    {selectedStaff.firstName && (
                      <button
                        onClick={handleCopyFirstName}
                        className="p-1 hover:bg-surface-hover rounded transition-colors"
                        title="Copy first name"
                      >
                        {copiedFirstName ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} className="text-content-muted hover:text-content-primary" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-content-muted">Last Name</p>
                  <div className="flex items-center gap-3">
                    <p>{selectedStaff.lastName || "-"}</p>
                    {selectedStaff.lastName && (
                      <button
                        onClick={handleCopyLastName}
                        className="p-1 hover:bg-surface-hover rounded transition-colors"
                        title="Copy last name"
                      >
                        {copiedLastName ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} className="text-content-muted hover:text-content-primary" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-content-muted">Gender</p>
                  <p className="capitalize">{selectedStaff.gender || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-content-muted">Birthday</p>
                  <p>{formatBirthday(selectedStaff.birthday)}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Contact Information</div>
              
              <div>
                <p className="text-sm text-content-muted">Email</p>
                <div className="flex items-center gap-3">
                  <p>{selectedStaff.email || "-"}</p>
                  {selectedStaff.email && (
                    <button
                      onClick={handleCopyEmail}
                      className="p-1 hover:bg-surface-hover rounded transition-colors"
                      title="Copy email"
                    >
                      {copiedEmail ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} className="text-content-muted hover:text-content-primary" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-content-muted">Mobile Number</p>
                  <div className="flex items-center gap-3">
                    <p>{selectedStaff.mobileNumber || selectedStaff.phone || "-"}</p>
                    {(selectedStaff.mobileNumber || selectedStaff.phone) && (
                      <button
                        onClick={handleCopyMobile}
                        className="p-1 hover:bg-surface-hover rounded transition-colors"
                        title="Copy mobile number"
                      >
                        {copiedMobile ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} className="text-content-muted hover:text-content-primary" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-content-muted">Telephone Number</p>
                  <div className="flex items-center gap-3">
                    <p>{selectedStaff.telephoneNumber || "-"}</p>
                    {selectedStaff.telephoneNumber && (
                      <button
                        onClick={handleCopyTelephone}
                        className="p-1 hover:bg-surface-hover rounded transition-colors"
                        title="Copy telephone number"
                      >
                        {copiedTelephone ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} className="text-content-muted hover:text-content-primary" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Address</div>
              
              <div>
                <p className="text-sm text-content-muted">Street & Number</p>
                <div className="flex items-center gap-3">
                  <p>{selectedStaff.street || "-"}</p>
                  {selectedStaff.street && (
                    <button
                      onClick={handleCopyStreet}
                      className="p-1 hover:bg-surface-hover rounded transition-colors"
                      title="Copy street"
                    >
                      {copiedStreet ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} className="text-content-muted hover:text-content-primary" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-content-muted">ZIP Code & City</p>
                  <div className="flex items-center gap-3">
                    <p>{`${selectedStaff.zipCode || ""} ${selectedStaff.city || ""}`.trim() || "-"}</p>
                    {(selectedStaff.zipCode || selectedStaff.city) && (
                      <button
                        onClick={handleCopyZipCity}
                        className="p-1 hover:bg-surface-hover rounded transition-colors"
                        title="Copy ZIP & city"
                      >
                        {copiedZipCity ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} className="text-content-muted hover:text-content-primary" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-content-muted">Country</p>
                  <div className="flex items-center gap-3">
                    <p>{selectedStaff.country || "-"}</p>
                    {selectedStaff.country && (
                      <button
                        onClick={handleCopyCountry}
                        className="p-1 hover:bg-surface-hover rounded transition-colors"
                        title="Copy country"
                      >
                        {copiedCountry ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} className="text-content-muted hover:text-content-primary" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Employment */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Employment</div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-content-muted">Role</p>
                  <p className="capitalize">{selectedStaff.role || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-content-muted">Staff Identification Color</p>
                  <div className="flex items-center gap-2">
                    {selectedStaff.color ? (
                      <>
                        <div 
                          className="w-6 h-6 rounded-lg border border-border"
                          style={{ backgroundColor: selectedStaff.color?.startsWith("var(") ? "var(--color-secondary)" : selectedStaff.color }}
                        />
                        <span className="text-content-secondary text-sm">{selectedStaff.color?.startsWith("var(") ? "Default" : selectedStaff.color}</span>
                      </>
                    ) : (
                      <span className="text-content-faint">-</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-content-muted">Vacation Entitlement (per Year)</p>
                  <p>{selectedStaff.vacationEntitlement || 30} days</p>
                </div>
                <div>
                  <p className="text-sm text-content-muted">Vacation Days Remaining</p>
                  <p>{selectedStaff.vacationDays ?? selectedStaff.vacationDaysCurrentYear ?? "-"} days</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-content-muted">Username</p>
                <div className="flex items-center gap-3">
                  <p>{selectedStaff.username || "-"}</p>
                  {selectedStaff.username && (
                    <button
                      onClick={handleCopyUsername}
                      className="p-1 hover:bg-surface-hover rounded transition-colors"
                      title="Copy username"
                    >
                      {copiedUsername ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} className="text-content-muted hover:text-content-primary" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-content-muted">Staff ID</p>
                <div className="flex items-center gap-3">
                  <p>{selectedStaff.id || "-"}</p>
                  {selectedStaff.id && (
                    <button
                      onClick={handleCopyStaffId}
                      className="p-1 hover:bg-surface-hover rounded transition-colors"
                      title="Copy staff ID"
                    >
                      {copiedStaffId ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} className="text-content-muted hover:text-content-primary" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {(selectedStaff.about || selectedStaff.description) && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Additional Information</div>
                
                <div>
                  <p className="text-sm text-content-muted">About</p>
                  <p className="whitespace-pre-wrap">{selectedStaff.about || selectedStaff.description || "-"}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-surface-card px-4 md:px-6 py-4 border-t border-border">
          <div className="flex justify-end">
            <button
              onClick={() => {
                onClose();
                if (onEditStaff) {
                  onEditStaff(selectedStaff);
                }
              }}
              className="bg-primary text-sm text-white px-4 py-2 rounded-xl hover:bg-primary-hover transition-colors"
            >
              Edit Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffViewDetailsModal;
