/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { X, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

// Note Status Options - same as leads
const NOTE_STATUSES = [
  { id: "contact_attempt", label: "Contact Attempt" },
  { id: "callback_requested", label: "Callback Requested" },
  { id: "interest", label: "Interest" },
  { id: "objection", label: "Objection" },
  { id: "personal_info", label: "Personal Info" },
  { id: "health", label: "Health" },
  { id: "follow_up", label: "Follow-up" },
  { id: "general", label: "General" },
]

const ViewDetailsModal = ({
  isOpen,
  onClose,
  selectedMemberMain,
  memberRelationsMain,
  calculateAgeMain,
  isContractExpiringSoonMain,
  redirectToContract,
  handleEditMember,
  setEditModalTabMain,
  DefaultAvatar1,
  initialTab = "details",
  onEditMemberNote
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  
  // Copy states - matching leads exactly
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedTelephone, setCopiedTelephone] = useState(false);
  const [copiedStreet, setCopiedStreet] = useState(false);
  const [copiedZipCity, setCopiedZipCity] = useState(false);
  const [copiedFirstName, setCopiedFirstName] = useState(false);
  const [copiedLastName, setCopiedLastName] = useState(false);
  const [copiedGender, setCopiedGender] = useState(false);
  const [copiedBirthday, setCopiedBirthday] = useState(false);
  const [copiedCountry, setCopiedCountry] = useState(false);
  const [copiedAbout, setCopiedAbout] = useState(false);
  const [copiedMemberId, setCopiedMemberId] = useState(false);

  const getStatusInfo = (statusId) => {
    return NOTE_STATUSES.find(s => s.id === statusId) || NOTE_STATUSES.find(s => s.id === "general")
  }

  const formatNoteDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  // Get notes array (support both old and new format)
  const getNotes = () => {
    if (!selectedMemberMain) return []
    if (selectedMemberMain.notes && Array.isArray(selectedMemberMain.notes)) {
      return selectedMemberMain.notes
    }
    // Convert old single note format to array
    if (selectedMemberMain.note && selectedMemberMain.note.trim()) {
      return [{
        id: 1,
        status: "general",
        text: selectedMemberMain.note,
        isImportant: selectedMemberMain.noteImportance === "important",
        startDate: selectedMemberMain.noteStartDate || "",
        endDate: selectedMemberMain.noteEndDate || "",
        createdAt: selectedMemberMain.joinDate || new Date().toISOString(),
      }]
    }
    return []
  }

  // IMPORTANT: Update tab whenever initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("details");
      setExpandedNoteId(null);
    }
  }, [isOpen]);

  if (!isOpen || !selectedMemberMain) return null;

  const handleEditRelations = () => {
    onClose();
    handleEditMember(selectedMemberMain, "relations");
  };

  const handleEditNote = () => {
    onClose();
    handleEditMember(selectedMemberMain, "note");
  };

  // Copy handlers - identical to leads
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(selectedMemberMain.email || "");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(selectedMemberMain.phone || selectedMemberMain.phoneNumber || "");
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch (err) {
      console.error('Failed to copy phone:', err);
    }
  };

  const handleCopyTelephone = async () => {
    try {
      await navigator.clipboard.writeText(selectedMemberMain.telephoneNumber || "");
      setCopiedTelephone(true);
      setTimeout(() => setCopiedTelephone(false), 2000);
    } catch (err) {
      console.error('Failed to copy telephone:', err);
    }
  };

  const handleCopyStreet = async () => {
    try {
      await navigator.clipboard.writeText(selectedMemberMain.street || "");
      setCopiedStreet(true);
      setTimeout(() => setCopiedStreet(false), 2000);
    } catch (err) {
      console.error('Failed to copy street:', err);
    }
  };

  const handleCopyZipCity = async () => {
    try {
      const zipCity = `${selectedMemberMain.zipCode || ""} ${selectedMemberMain.city || ""}`.trim();
      await navigator.clipboard.writeText(zipCity);
      setCopiedZipCity(true);
      setTimeout(() => setCopiedZipCity(false), 2000);
    } catch (err) {
      console.error('Failed to copy zip/city:', err);
    }
  };

  const handleCopyFirstName = async () => {
    try {
      await navigator.clipboard.writeText(selectedMemberMain.firstName || "");
      setCopiedFirstName(true);
      setTimeout(() => setCopiedFirstName(false), 2000);
    } catch (err) {
      console.error('Failed to copy first name:', err);
    }
  };

  const handleCopyLastName = async () => {
    try {
      await navigator.clipboard.writeText(selectedMemberMain.lastName || "");
      setCopiedLastName(true);
      setTimeout(() => setCopiedLastName(false), 2000);
    } catch (err) {
      console.error('Failed to copy last name:', err);
    }
  };

  const handleCopyGender = async () => {
    try {
      await navigator.clipboard.writeText(selectedMemberMain.gender || "");
      setCopiedGender(true);
      setTimeout(() => setCopiedGender(false), 2000);
    } catch (err) {
      console.error('Failed to copy gender:', err);
    }
  };

  const handleCopyBirthday = async () => {
    try {
      await navigator.clipboard.writeText(selectedMemberMain.dateOfBirth || selectedMemberMain.birthday || "");
      setCopiedBirthday(true);
      setTimeout(() => setCopiedBirthday(false), 2000);
    } catch (err) {
      console.error('Failed to copy birthday:', err);
    }
  };

  const handleCopyCountry = async () => {
    try {
      await navigator.clipboard.writeText(selectedMemberMain.country || "");
      setCopiedCountry(true);
      setTimeout(() => setCopiedCountry(false), 2000);
    } catch (err) {
      console.error('Failed to copy country:', err);
    }
  };

  const handleCopyAbout = async () => {
    try {
      await navigator.clipboard.writeText(selectedMemberMain.about || selectedMemberMain.details || "");
      setCopiedAbout(true);
      setTimeout(() => setCopiedAbout(false), 2000);
    } catch (err) {
      console.error('Failed to copy about:', err);
    }
  };

  const handleCopyMemberId = async () => {
    try {
      await navigator.clipboard.writeText(String(selectedMemberMain.id || selectedMemberMain.memberNumber) || "");
      setCopiedMemberId(true);
      setTimeout(() => setCopiedMemberId(false), 2000);
    } catch (err) {
      console.error('Failed to copy member ID:', err);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000]">
      <div className="bg-surface-card rounded-xl w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] my-2 md:my-8 relative flex flex-col">
        {/* Sticky Header */}
        <div className="p-4 md:p-6 pb-0 flex-shrink-0">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-content-primary text-lg font-semibold">Member Details</h2>
            <button onClick={onClose} className="text-content-muted hover:text-content-primary transition-colors">
              <X size={20} className="cursor-pointer" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "details" ? "text-primary border-b-2 border-primary" : "text-content-muted hover:text-content-primary"
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("note")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "note" ? "text-primary border-b-2 border-primary" : "text-content-muted hover:text-content-primary"
              }`}
            >
              Special Notes
            </button>
            <button
              onClick={() => setActiveTab("relations")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "relations"
                  ? "text-primary border-b-2 border-primary"
                  : "text-content-muted hover:text-content-primary"
              }`}
            >
              Relations
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 md:p-6 pt-4 md:pt-6 overflow-y-auto flex-1">
          {/* Tab Content */}
          {activeTab === "details" && (
            <div className="space-y-4 text-content-primary">
              {/* Personal Information */}
              <div className="space-y-4">
                <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Personal Information</div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-content-muted">First Name</p>
                    <div className="flex items-center gap-3">
                      <p>{selectedMemberMain.firstName || "-"}</p>
                      {selectedMemberMain.firstName && (
                        <button
                          onClick={handleCopyFirstName}
                          className="p-1 hover:bg-surface-button rounded transition-colors"
                          title="Copy first name"
                        >
                          {copiedFirstName ? (
                            <Check size={14} className="text-accent-green" />
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
                      <p>{selectedMemberMain.lastName || "-"}</p>
                      {selectedMemberMain.lastName && (
                        <button
                          onClick={handleCopyLastName}
                          className="p-1 hover:bg-surface-button rounded transition-colors"
                          title="Copy last name"
                        >
                          {copiedLastName ? (
                            <Check size={14} className="text-accent-green" />
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
                    <p className="capitalize">{selectedMemberMain.gender || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-content-muted">Birthday</p>
                    <div className="flex items-center gap-3">
                      <p>
                        {(selectedMemberMain.dateOfBirth || selectedMemberMain.birthday)
                          ? (() => {
                              const birthDate = new Date(selectedMemberMain.dateOfBirth || selectedMemberMain.birthday)
                              const today = new Date()
                              let age = today.getFullYear() - birthDate.getFullYear()
                              const monthDiff = today.getMonth() - birthDate.getMonth()
                              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                                age--
                              }
                              return `${birthDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (Age: ${age})`
                            })()
                          : "-"}
                      </p>
                      {(selectedMemberMain.dateOfBirth || selectedMemberMain.birthday) && (
                        <button
                          onClick={handleCopyBirthday}
                          className="p-1 hover:bg-surface-button rounded transition-colors"
                          title="Copy birthday"
                        >
                          {copiedBirthday ? (
                            <Check size={14} className="text-accent-green" />
                          ) : (
                            <Copy size={14} className="text-content-muted hover:text-content-primary" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Contact Information</div>
                
                <div>
                  <p className="text-sm text-content-muted">Email</p>
                  <div className="flex items-center gap-3">
                    <p>{selectedMemberMain.email || "-"}</p>
                    {selectedMemberMain.email && (
                      <button
                        onClick={handleCopyEmail}
                        className="p-1 hover:bg-surface-button rounded transition-colors"
                        title="Copy email"
                      >
                        {copiedEmail ? (
                          <Check size={14} className="text-accent-green" />
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
                      <p>{selectedMemberMain.phone || selectedMemberMain.phoneNumber || "-"}</p>
                      {(selectedMemberMain.phone || selectedMemberMain.phoneNumber) && (
                        <button
                          onClick={handleCopyPhone}
                          className="p-1 hover:bg-surface-button rounded transition-colors"
                          title="Copy mobile number"
                        >
                          {copiedPhone ? (
                            <Check size={14} className="text-accent-green" />
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
                      <p>{selectedMemberMain.telephoneNumber || "-"}</p>
                      {selectedMemberMain.telephoneNumber && (
                        <button
                          onClick={handleCopyTelephone}
                          className="p-1 hover:bg-surface-button rounded transition-colors"
                          title="Copy telephone number"
                        >
                          {copiedTelephone ? (
                            <Check size={14} className="text-accent-green" />
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
                    <p>{selectedMemberMain.street || "-"}</p>
                    {selectedMemberMain.street && (
                      <button
                        onClick={handleCopyStreet}
                        className="p-1 hover:bg-surface-button rounded transition-colors"
                        title="Copy street address"
                      >
                        {copiedStreet ? (
                          <Check size={14} className="text-accent-green" />
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
                      <p>
                        {selectedMemberMain.zipCode && selectedMemberMain.city 
                          ? `${selectedMemberMain.zipCode} ${selectedMemberMain.city}` 
                          : selectedMemberMain.zipCode || selectedMemberMain.city || "-"}
                      </p>
                      {(selectedMemberMain.zipCode || selectedMemberMain.city) && (
                        <button
                          onClick={handleCopyZipCity}
                          className="p-1 hover:bg-surface-button rounded transition-colors"
                          title="Copy ZIP code and city"
                        >
                          {copiedZipCity ? (
                            <Check size={14} className="text-accent-green" />
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
                      <p>{selectedMemberMain.country || "-"}</p>
                      {selectedMemberMain.country && (
                        <button
                          onClick={handleCopyCountry}
                          className="p-1 hover:bg-surface-button rounded transition-colors"
                          title="Copy country"
                        >
                          {copiedCountry ? (
                            <Check size={14} className="text-accent-green" />
                          ) : (
                            <Copy size={14} className="text-content-muted hover:text-content-primary" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-content-muted">Member ID</p>
                  <div className="flex items-center gap-3">
                    <p>{selectedMemberMain.id || selectedMemberMain.memberNumber || "-"}</p>
                    {(selectedMemberMain.id || selectedMemberMain.memberNumber) && (
                      <button
                        onClick={handleCopyMemberId}
                        className="p-1 hover:bg-surface-button rounded transition-colors"
                        title="Copy member ID"
                      >
                        {copiedMemberId ? (
                          <Check size={14} className="text-accent-green" />
                        ) : (
                          <Copy size={14} className="text-content-muted hover:text-content-primary" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* About section */}
              {(selectedMemberMain.about || selectedMemberMain.details) && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-content-muted">About</p>
                    <button
                      onClick={handleCopyAbout}
                      className="p-1 hover:bg-surface-button rounded transition-colors"
                      title="Copy about text"
                    >
                      {copiedAbout ? (
                        <Check size={14} className="text-accent-green" />
                      ) : (
                        <Copy size={14} className="text-content-muted hover:text-content-primary" />
                      )}
                    </button>
                  </div>
                  <div className="bg-surface-dark rounded-xl px-4 py-3 text-sm break-words overflow-wrap-anywhere">
                    <p className="whitespace-pre-wrap">{selectedMemberMain.about || selectedMemberMain.details}</p>
                  </div>
                </div>
              )}
              
              {/* Created Date */}
              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-content-muted">Join Date</p>
                    <p>
                      {selectedMemberMain.joinDate || selectedMemberMain.createdAt
                        ? new Date(selectedMemberMain.joinDate || selectedMemberMain.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "note" && (
            <div className="space-y-4 text-content-primary pb-16">
              {/* Member Name Header */}
              <div className="mb-2 pb-3 border-b border-border-subtle">
                <p className="text-xs text-content-muted uppercase tracking-wider">Special Notes for</p>
                <p className="text-content-primary font-medium">{selectedMemberMain.firstName} {selectedMemberMain.lastName}</p>
              </div>
              
              {/* Notes List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {getNotes().length > 0 ? (
                  [...getNotes()]
                    .sort((a, b) => (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0))
                    .map((note) => {
                    const statusInfo = getStatusInfo(note.status)
                    const isExpanded = expandedNoteId === note.id
                    
                    return (
                      <div
                        key={note.id}
                        className="bg-surface-dark rounded-lg overflow-hidden"
                      >
                        {/* Note Header */}
                        <div 
                          className="flex items-center justify-between p-3 cursor-pointer"
                          onClick={() => setExpandedNoteId(isExpanded ? null : note.id)}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-surface-button text-content-secondary">
                              {statusInfo.label}
                            </span>
                            {note.isImportant && (
                              <span className="text-xs font-medium px-2 py-0.5 rounded bg-surface-button text-accent-red">
                                Important
                              </span>
                            )}
                          </div>
                          <div className="flex items-center">
                            {isExpanded ? (
                              <ChevronUp size={16} className="text-content-muted" />
                            ) : (
                              <ChevronDown size={16} className="text-content-muted" />
                            )}
                          </div>
                        </div>
                        
                        {/* Preview & Valid Date (always visible when collapsed) */}
                        {!isExpanded && (
                          <div className="px-3 pb-2">
                            <p className="text-content-muted text-sm truncate">
                              {note.text}
                            </p>
                            {(note.startDate || note.endDate) && (
                              <p className="text-xs text-content-faint mt-1">
                                {note.startDate && note.endDate ? (
                                  <>Valid: {note.startDate} - {note.endDate}</>
                                ) : note.startDate ? (
                                  <>Valid from: {note.startDate}</>
                                ) : (
                                  <>Valid until: {note.endDate}</>
                                )}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {/* Note Content (expandable) */}
                        {isExpanded && (
                          <div className="px-3 pb-3 border-t border-border-subtle">
                            <p className="text-content-primary text-sm mt-2 whitespace-pre-wrap break-words">
                              {note.text}
                            </p>
                            {(note.startDate || note.endDate) && (
                              <div className="mt-2 text-xs text-content-faint">
                                {note.startDate && note.endDate ? (
                                  <>Valid: {note.startDate} - {note.endDate}</>
                                ) : note.startDate ? (
                                  <>Valid from: {note.startDate}</>
                                ) : (
                                  <>Valid until: {note.endDate}</>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="text-content-muted text-center py-8">No special notes for this member.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === "relations" && (
            <>
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pb-16">
                {/* Relations Tree Visualization */}
                <div className="bg-surface-dark rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-content-primary mb-4 text-center">Relationship Tree</h3>
                  <div className="flex flex-col items-center space-y-8">
                    {/* Central Member */}
                    <div className="bg-primary text-white px-4 py-2 rounded-lg border-2 border-primary-hover font-semibold">
                      {selectedMemberMain.firstName} {selectedMemberMain.lastName}
                    </div>
                    {/* Connection Lines and Categories */}
                    <div className="relative w-full">
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-border-subtle"></div>
                      <div className="grid grid-cols-5 gap-4 pt-8">
                        {Object.entries(memberRelationsMain[selectedMemberMain.id] || {}).map(([category, relations]) => (
                          <div key={category} className="flex flex-col items-center space-y-4">
                            <div className="w-0.5 h-8 bg-border-subtle"></div>
                            <div
                              className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${
                                category === "family"
                                  ? "bg-accent-yellow text-white"
                                  : category === "friendship"
                                    ? "bg-accent-green text-white"
                                    : category === "relationship"
                                      ? "bg-accent-red text-white"
                                      : category === "work"
                                        ? "bg-accent-blue text-white"
                                        : "bg-surface-button text-content-secondary"
                              }`}
                            >
                              {category}
                            </div>
                            <div className="space-y-2">
                              {relations.map((relation) => (
                                <div
                                  key={relation.id}
                                  className={`bg-surface-button rounded-lg p-2 text-center min-w-[120px] cursor-pointer hover:bg-surface-button-hover transition-colors ${
                                    relation.type === "member" || relation.type === "lead"
                                      ? "border border-primary/30"
                                      : ""
                                  }`}
                                >
                                  <div className="text-content-primary text-sm font-medium">{relation.name}</div>
                                  <div className="text-content-muted text-xs">({relation.relation})</div>
                                  <div className="bg-surface-dark text-content-secondary text-xs mt-1 px-1.5 py-0.5 rounded capitalize inline-block">
                                    {relation.type}
                                  </div>
                                </div>
                              ))}
                              {relations.length === 0 && (
                                <div className="text-content-faint text-xs text-center">No relations</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Relations List */}
                <div className="bg-surface-dark rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-content-primary mb-4">All Relations</h3>
                  <div className="space-y-4">
                    {Object.entries(memberRelationsMain[selectedMemberMain.id] || {}).map(([category, relations]) => (
                      <div key={category}>
                        <h4 className="text-md font-medium text-content-secondary capitalize mb-2">{category}</h4>
                        <div className="space-y-2 ml-4">
                          {relations.length > 0 ? (
                            relations.map((relation) => (
                              <div
                                key={relation.id}
                                className={`flex items-center justify-between bg-surface-button rounded-lg p-3 ${
                                  relation.type === "member" || relation.type === "lead"
                                    ? "cursor-pointer hover:bg-surface-button-hover border border-primary/30"
                                    : ""
                                }`}
                              >
                                <div className="flex items-center flex-wrap gap-1.5">
                                  <span className="text-content-primary font-medium">{relation.name}</span>
                                  <span className="text-content-muted">- {relation.relation}</span>
                                  <span className="bg-surface-dark text-content-secondary text-xs px-2 py-0.5 rounded capitalize">
                                    {relation.type}
                                  </span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-content-faint text-sm">No {category} relations</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky Footer with Edit Buttons */}
        <div className="flex-shrink-0 bg-surface-card px-4 md:px-6 py-4 border-t border-border">
          <div className="flex justify-end">
            {activeTab === "details" && (
              <button
                onClick={() => {
                  onClose()
                  handleEditMember(selectedMemberMain)
                }}
                className="bg-primary text-sm text-white px-4 py-2 rounded-xl hover:bg-primary-hover transition-colors"
              >
                Edit Member
              </button>
            )}
            {activeTab === "note" && (
              <button
                onClick={handleEditNote}
                className="bg-primary text-sm text-white px-4 py-2 rounded-xl hover:bg-primary-hover transition-colors"
              >
                Edit Special Notes
              </button>
            )}
            {activeTab === "relations" && (
              <button
                onClick={handleEditRelations}
                className="bg-primary text-sm text-white px-4 py-2 rounded-xl hover:bg-primary-hover transition-colors"
              >
                Edit Relations
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewDetailsModal;
