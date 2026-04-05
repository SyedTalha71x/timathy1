/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Clock, Users, MapPin, Calendar, Repeat, Search, UserMinus, Trash2, Plus, AlertTriangle, Ban, ChevronDown, Check, Briefcase } from "lucide-react";
import NotifyModalMain from '../../shared/NotifyModal';
import DatePickerField from '../../shared/DatePickerField';
import { getRoleColorHex } from '../../../utils/studio-states/staff-states';
import { toast } from 'react-toastify'

const fmtDate = (d) => {
  const dt = d instanceof Date ? d : new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

const getColorHex = (clr) => {
  if (!clr) return "#808080";
  if (clr.colorHex) return clr.colorHex;
  if (clr.calenderColor) return clr.calenderColor;
  if (clr.color?.startsWith("#")) return clr.color;
  return "#808080";
};

// Helper to parse time from "11:00am" to "HH:MM"
const parseTimeTo24h = (timeStr) => {
  if (!timeStr) return "09:00";
  const match = timeStr.match(/(\d+):(\d+)(am|pm)/i);
  if (match) {
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toLowerCase();
    if (period === 'pm' && hours !== 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  return timeStr;
};

// Helper to format time for display
const formatTimeDisplay = (timeStr) => {
  if (!timeStr) return "";
  const match = timeStr.match(/(\d+):(\d+)(am|pm)/i);
  if (match) {
    return `${match[1]}:${match[2]}${match[3]}`;
  }
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'pm' : 'am';
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  return `${displayHour}:${minutes}${ampm}`;
};

// Helper to get staff name from various possible formats
const getStaffName = (staff) => {
  if (!staff) return "Unknown";
  if (staff.firstName && staff.lastName) return `${staff.firstName} ${staff.lastName}`;
  if (staff.name) return staff.name;
  if (staff.trainerName) return staff.trainerName;
  return "Unknown";
};

// Helper to get staff initials
const getStaffInitials = (staff) => {
  if (!staff) return "?";
  if (staff.firstName && staff.lastName) {
    return `${staff.firstName.charAt(0)}${staff.lastName.charAt(0)}`.toUpperCase();
  }
  if (staff.name) {
    const parts = staff.name.split(" ");
    return parts.map(p => p.charAt(0)).join("").toUpperCase();
  }
  return "?";
};

// Helper to get staff color
const getStaffColor = (staff) => {
  if (!staff) return "var(--color-primary)";
  if (staff.color) return staff.color;
  if (staff.staffColor) return staff.staffColor;
  return "var(--color-primary)";
};

// ─── Custom Dropdown (fixed positioning, matches CreateClassModal) ───
const CustomDropdown = ({ value, placeholder, renderSelected, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const btnRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false) };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleToggle = () => {
    if (!isOpen && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div ref={ref} className="relative">
      <button ref={btnRef} type="button" onClick={handleToggle}
        className="w-full bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-left flex items-center justify-between hover:bg-surface-hover transition-colors">
        {value ? renderSelected() : <span className="text-content-faint">{placeholder}</span>}
        <ChevronDown size={14} className={`text-content-faint transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="fixed bg-surface-base border border-border rounded-xl shadow-xl z-[1100] max-h-64 overflow-y-auto"
          style={{ top: pos.top, left: pos.left, width: pos.width }}>
          {children(() => setIsOpen(false))}
        </div>
      )}
    </div>
  );
};

const ClassDetailModal = ({
  isOpen, onClose, classData, membersData = [], allClassesData = [],
  onEnrollMember, onRemoveMember, onCancelClass, onCancelSeries, onDeleteClass, onEditClass,
  rooms = [], trainers = [], classTypes = [],
}) => {
  const { t, i18n } = useTranslation();
  // ===== ALL HOOKS FIRST (useState, useEffect, useRef, useMemo) =====

  const [activeTab, setActiveTab] = useState("details");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelScope, setCancelScope] = useState("single");
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
  const [showRecurringInfo, setShowRecurringInfo] = useState(false);
  const searchInputRef = useRef(null);
  const recurringRef = useRef(null);

  // Local edit state
  const [editDate, setEditDate] = useState("");
  const [editHour, setEditHour] = useState("09");
  const [editMinute, setEditMinute] = useState("00");
  const [editRoom, setEditRoom] = useState("");
  const [editTrainerId, setEditTrainerId] = useState(null);
  const [editMax, setEditMax] = useState(12);

  // Original values
  const [origDate, setOrigDate] = useState("");
  const [origHour, setOrigHour] = useState("09");
  const [origMinute, setOrigMinute] = useState("00");
  const [origRoom, setOrigRoom] = useState("");
  const [origTrainerId, setOrigTrainerId] = useState(null);
  const [origMax, setOrigMax] = useState(12);

  // Notify
  const [showNotify, setShowNotify] = useState(false);
  const [notifyAction, setNotifyAction] = useState("book");
  const [notifyEntityName, setNotifyEntityName] = useState("");
  const [pendingAction, setPendingAction] = useState(null);

  // ===== NORMALIZE DATA AFTER ALL HOOKS, BEFORE ANY LOGIC THAT USES IT =====
  const normalizedData = React.useMemo(() => {
    if (!classData) return null;
    return {
      ...classData,
      id: classData.id || classData._id,
      _id: classData._id || classData.id,
      seriesId: classData.seriesId,
      enrolledMembers: classData.enrolledMembers || classData.participants || [],
      maxParticipants: classData.maxParticipants || 0,
      typeName: classData.typeName || classData.classType?.name || "Unknown",
      startTime: classData.startTime || classData.time || "09:00am",
      endTime: classData.endTime,
      date: classData.date,
      status: classData.status,
      classStatus: classData.classStatus,
      isCancelled: classData.isCancelled || classData.status === 'canceled' || false,
      isPast: classData.isPast || false,
      bookingType: classData.bookingType,
      isRecurring: classData.isRecurring || classData.bookingType === 'recurring',
      staff: classData.staff,
      trainerId: classData.trainerId || classData.staff?._id || classData.trainer,
      trainerName: classData.trainerName || (classData.staff ? getStaffName(classData.staff) : "Unknown"),
      trainerColor: classData.trainerColor,
      room: classData.room,
      roomId: classData.roomId,
      roomName: classData.roomName,
      duration: classData.duration || 60,
      typeColor: classData.typeColor || classData.classType?.calenderColor || "#6c5ce7",
    };
  }, [classData]);


  useEffect(() => {
    if (showSearch && searchInputRef.current) searchInputRef.current.focus()
  }, [showSearch]);

  // Close recurring popover on outside click
  useEffect(() => {
    if (!showRecurringInfo) return;
    const h = (e) => {
      if (recurringRef.current && !recurringRef.current.contains(e.target))
        setShowRecurringInfo(false)
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [showRecurringInfo]);

  // Initialize local state from classData when modal opens
  useEffect(() => {
    if (!isOpen || !normalizedData) return;

    const dateStr = normalizedData.date ? fmtDate(new Date(normalizedData.date)) : "";
    const startTimeFormatted = parseTimeTo24h(normalizedData.startTime || "09:00");
    const [hour, minute] = startTimeFormatted.split(":");

    setEditDate(dateStr);
    setEditHour(hour);
    setEditMinute(minute);
    setEditRoom(normalizedData.roomId || normalizedData.room?._id || normalizedData.room || "");
    setEditTrainerId(normalizedData.trainerId);
    setEditMax(normalizedData.maxParticipants || 12);

    setOrigDate(dateStr);
    setOrigHour(hour);
    setOrigMinute(minute);
    setOrigRoom(normalizedData.roomId || normalizedData.room?._id || normalizedData.room || "");
    setOrigTrainerId(normalizedData.trainerId);
    setOrigMax(normalizedData.maxParticipants || 12);
  }, [isOpen, normalizedData?.id]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("details");
      setShowSearch(false);
      setSearchQuery("");
      setShowDeleteConfirm(false);
      setShowCancelConfirm(false);
      setShowUnsavedConfirm(false);
      setShowRecurringInfo(false);
      setShowNotify(false);
      setPendingAction(null);
    }
  }, [isOpen]);

  // ===== EARLY RETURN AFTER ALL HOOKS =====
  if (!isOpen || !normalizedData) return null;

  // ===== NOW WE CAN ASSIGN data = normalizedData =====
  const data = normalizedData;

  // ===== REST OF YOUR COMPONENT LOGIC (derived values, helper functions, etc.) =====

  // Normalize trainers data
  const normalizedTrainers = trainers.map(t => ({
    id: t.id || t._id,
    firstName: t.firstName || t.name?.split(' ')[0] || "Staff",
    lastName: t.lastName || t.name?.split(' ')[1] || "",
    role: t.role || t.staffRole,
    color: t.color || t.staffColor,
    img: t.img?.url || t.profile_image || t.img,
    staffColor: t.staffColor,
  }));

  // Get enrolled members
  const enrolledMembers = data.enrolledMembers || [];
  const enrolled = membersData.filter(m => enrolledMembers.some(p => p._id === m._id || p === m._id));
  const available = membersData.filter(m => !enrolledMembers.some(p => p._id === m._id || p === m._id));
  const filtered = available.filter(m => `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()));
  const spotsLeft = (data.maxParticipants || 0) - (enrolledMembers.length || 0);
  const isFull = spotsLeft <= 0;
  const isCancelled = data.isCancelled || false;
  const isPast = data.isPast || false;
  const canEdit = !isPast && !isCancelled;
  const color = isCancelled ? "#6B7280" : data.typeColor;
  const hasSeries = data.isRecurring;
  const seriesClasses = hasSeries && data.seriesId
    ? allClassesData.filter(c => c.seriesId === data.seriesId && !c.isCancelled)
    : [];
  const seriesUpcoming = seriesClasses.filter(c => !c.isPast);
  const seriesTotalEnrolled = seriesClasses.reduce((sum, c) => sum + (c.enrolledMembers?.length || 0), 0);

  // Get current trainer
  const currentTrainer = normalizedTrainers.find(t => t.id === editTrainerId) ||
    (data.staff ? {
      id: data.staff._id,
      firstName: data.staff.firstName,
      lastName: data.staff.lastName,
      role: data.staff.role,
      color: data.staff.color,
      img: data.staff.img?.url,
    } : null);

  // Change detection
  const hasScheduleChanges = editDate !== origDate || editHour !== origHour || editMinute !== origMinute;
  const hasChanges = hasScheduleChanges || editRoom !== origRoom || editTrainerId !== origTrainerId || editMax !== origMax;

  // Handle close with unsaved changes
  const handleClose = () => {
    if (hasChanges) {
      setShowUnsavedConfirm(true);
      return;
    }
    onClose();
  };

  const handleDiscardAndClose = () => {
    setShowUnsavedConfirm(false);
    onClose();
  };

  // Format functions
  const formatDate = (ds) => {
    if (!ds) return t("studioClasses.detailModal.na");
    const d = typeof ds === "string" ? new Date(ds) : ds;
    if (isNaN(d.getTime())) return ds;
    return d.toLocaleDateString(i18n.language, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  };

  const formatDateDisplay = (ds) => {
    if (!ds) return t("studioClasses.detailModal.selectDate", "Select date");
    const [y, m, d] = ds.split("-");
    return `${d}.${m}.${y}`;
  };

  // Recurring info helpers
  const dayNames = { "0": t("studioClasses.detailModal.dayNames.0"), "1": t("studioClasses.detailModal.dayNames.1"), "2": t("studioClasses.detailModal.dayNames.2"), "3": t("studioClasses.detailModal.dayNames.3"), "4": t("studioClasses.detailModal.dayNames.4"), "5": t("studioClasses.detailModal.dayNames.5"), "6": t("studioClasses.detailModal.dayNames.6") };
  const freqLabels = { daily: t("studioClasses.detailModal.freqLabels.daily"), weekly: t("studioClasses.detailModal.freqLabels.weekly"), biweekly: t("studioClasses.detailModal.freqLabels.biweekly"), monthly: t("studioClasses.detailModal.freqLabels.monthly") };
  const getRecurringLabel = () => {
    if (!hasSeries) return null;
    const freq = data.frequency || data.recurrencePattern;
    const day = data.dayOfWeek ? dayNames[data.dayOfWeek] : "";
    const occurrences = data.occurrence || data.occurrences;
    return { freq: freqLabels[freq] || freq, day, occurrences };
  };
  const recurringLabel = hasSeries ? getRecurringLabel() : null;

  // Time helpers
  const todayStr = fmtDate(new Date());
  const nowHour = new Date().getHours();
  const currentSlotMinute = Math.floor(new Date().getMinutes() / 30) * 30;
  const allHours = Array.from({ length: 17 }, (_, i) => i + 6);
  const allMinutes = ["00", "15", "30", "45"];
  const isEditDateToday = editDate === todayStr;
  const filteredHours = isEditDateToday ? allHours.filter(h => h >= nowHour) : allHours;
  const getFilteredMinutes = (h) => {
    if (isEditDateToday && Number(h) === nowHour) return allMinutes.filter(m => Number(m) >= currentSlotMinute);
    return allMinutes;
  };

  const calcEndTime = (h, m) => {
    const duration = data.duration || 60;
    const total = Number(h) * 60 + Number(m) + duration;
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  };

  const isTimePast = (date, h, m) => {
    const classStart = new Date(`${date}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`);
    const slotBoundary = new Date();
    slotBoundary.setMinutes(Math.floor(slotBoundary.getMinutes() / 30) * 30, 0, 0);
    return classStart < slotBoundary;
  };

  const handleHourChange = (newH) => {
    setEditHour(newH);
    const validMinutes = getFilteredMinutes(newH);
    if (!validMinutes.includes(editMinute) && validMinutes.length > 0) {
      setEditMinute(validMinutes[0]);
    }
  };

  // Build changes object
  const buildChanges = () => {
    const changes = {};
    const selectedTrainer = normalizedTrainers.find(t => t.id === editTrainerId);

    if (editDate !== origDate) changes.date = editDate;
    if (editHour !== origHour || editMinute !== origMinute) {
      const hour = parseInt(editHour);
      const ampm = hour >= 12 ? 'pm' : 'am';
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      const startTime = `${displayHour}:${editMinute}${ampm}`;
      changes.time = startTime;
    }
    if (editRoom !== origRoom) changes.room = editRoom;
    if (editTrainerId !== origTrainerId && selectedTrainer) {
      changes.staff = selectedTrainer.id;
    }
    if (editMax !== origMax) changes.maxParticipants = editMax;

    return changes;
  };

  // Save Changes
  const handleSaveChanges = () => {
    if (!hasChanges) return;

    if (isTimePast(editDate, editHour, editMinute)) {
      toast.error(t("studioClasses.detailModal.toast.cannotSchedulePast"));
      return;
    }

    const changes = buildChanges();
    const classId = data.id;

    if (!classId) {
      toast.error(t("studioClasses.detailModal.toast.unableToIdentify"));
      return;
    }

    if (hasScheduleChanges && enrolled.length > 0) {
      const names = enrolled.map(m => `${m.firstName} ${m.lastName}`).join(", ");
      setPendingAction({ type: "reschedule", changes });
      setNotifyAction("reschedule");
      setNotifyEntityName(names);
      setShowNotify(true);
    } else {
      onEditClass?.(classId, changes);
    }
  };

  // Member handlers
  const handleEnrollClick = (member) => {
    const name = `${member.firstName} ${member.lastName}`;
    const memberId = member._id || member.id;
    setPendingAction({ type: "enroll", memberId, memberName: name });
    setNotifyAction("book");
    setNotifyEntityName(name);
    setShowNotify(true);
    setSearchQuery("");
  };

  const handleRemoveClick = (member) => {
    const name = `${member.firstName} ${member.lastName}`;
    const memberId = member._id || member.id;
    setPendingAction({ type: "remove", memberId, memberName: name });
    setNotifyAction("cancel");
    setNotifyEntityName(name);
    setShowNotify(true);
  };

  // Cancel confirmation
  const handleCancelConfirm = () => {
    setShowCancelConfirm(false);
    const isSeries = cancelScope === "series";
    const classId = data.id;
    const seriesId = data.seriesId;

    if (isSeries) {
      const allSeriesMembers = new Set();
      seriesClasses.forEach(c => (c.enrolledMembers || []).forEach(id => allSeriesMembers.add(id)));
      const affectedMembers = membersData.filter(m => allSeriesMembers.has(m._id || m.id));
      const names = affectedMembers.map(m => `${m.firstName} ${m.lastName}`).join(", ");

      if (affectedMembers.length > 0) {
        setPendingAction({ type: "cancel-series" });
        setNotifyAction("cancel");
        setNotifyEntityName(names);
        setShowNotify(true);
      } else {
        if (seriesId) {
          onCancelSeries?.(seriesId);
          onClose();
        } else {
          toast.error(t("studioClasses.detailModal.toast.unableToIdentifySeries"));
        }
      }
    } else {
      if (enrolled.length > 0) {
        setPendingAction({ type: "cancel" });
        setNotifyAction("cancel");
        setNotifyEntityName(enrolled.map(m => `${m.firstName} ${m.lastName}`).join(", "));
        setShowNotify(true);
      } else {
        if (classId) {
          onCancelClass?.(classId);
          onClose();
        } else {
          toast.error(t("studioClasses.detailModal.toast.unableToIdentify"));
        }
      }
    }
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    const classId = data.id;
    if (classId) {
      onDeleteClass?.(classId);
      onClose();
    } else {
      toast.error(t("studioClasses.detailModal.toast.unableToIdentify"));
    }
  };

  // Notify confirm
  const handleNotifyConfirm = (shouldNotify, options) => {
    if (!pendingAction) return;

    const classId = data.id;
    const seriesId = data.seriesId;

    if (pendingAction.type === "enroll") {
      onEnrollMember?.(classId, pendingAction.memberId);
    }
    else if (pendingAction.type === "remove") {
      onRemoveMember?.(classId, pendingAction.memberId);
    }
    else if (pendingAction.type === "cancel") {
      onCancelClass?.(classId);
      onClose();
    }
    else if (pendingAction.type === "cancel-series") {
      onCancelSeries?.(seriesId);
      onClose();
    }
    else if (pendingAction.type === "reschedule") {
      onEditClass?.(classId, pendingAction.changes);
    }

    if (shouldNotify) console.log("Notification:", { action: pendingAction.type, options });
    setShowNotify(false);
    setPendingAction(null);
  };

  const handleNotifyCancel = () => {
    setShowNotify(false);
    setPendingAction(null);
  };

  // Display values
  const editTrainer = currentTrainer;
  const editEndTime = calcEndTime(editHour, editMinute);
  const displayStartTime = formatTimeDisplay(data.startTime || "09:00");
  const displayEndTime = formatTimeDisplay(data.endTime || "10:00");

  const notifyDate = pendingAction?.type === "reschedule" && pendingAction?.changes?.date
    ? formatDate(pendingAction.changes.date) : formatDate(data.date);
  const notifyTime = pendingAction?.type === "reschedule" && pendingAction?.changes?.time
    ? pendingAction.changes.time
    : `${displayStartTime} - ${displayEndTime}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={handleClose}>
      <div className="bg-surface-card w-full max-w-lg rounded-xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header with color bar */}
        <div className="relative">
          <div className="h-1.5 flex-shrink-0" style={{ background: color }}>
            {isCancelled && <div className="absolute inset-0 h-1.5" style={{ background: 'repeating-linear-gradient(135deg,transparent,transparent 3px,rgba(255,255,255,.2) 3px,rgba(255,255,255,.2) 6px)' }} />}
          </div>
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <h2 className="text-lg font-semibold text-content-primary truncate">{classData.typeName || classData.classType?.name}</h2>
              {hasSeries && (
                <div ref={recurringRef} className="relative flex-shrink-0">
                  <button
                    onClick={() => setShowRecurringInfo(!showRecurringInfo)}
                    onMouseEnter={() => { if (window.innerWidth >= 1024) setShowRecurringInfo(true) }}
                    onMouseLeave={() => { if (window.innerWidth >= 1024) setShowRecurringInfo(false) }}
                    className="p-1 rounded-md text-content-muted hover:text-primary hover:bg-primary/10 transition-colors"
                    title={t("studioClasses.detailModal.recurringClass")}>
                    <Repeat size={14} />
                  </button>
                  {showRecurringInfo && recurringLabel && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[1050] w-56">
                      <div className="bg-surface-dark border border-border rounded-xl shadow-xl p-3 text-xs">
                        <div className="flex items-center gap-2 mb-2">
                          <Repeat size={12} className="text-primary" />
                          <span className="text-content-primary font-semibold">{t("studioClasses.detailModal.recurringClass")}</span>
                        </div>
                        <div className="space-y-1.5 text-content-secondary">
                          <div className="flex justify-between">
                            <span className="text-content-faint">{t("studioClasses.detailModal.frequency")}</span>
                            <span className="text-content-primary font-medium">{recurringLabel.freq}</span>
                          </div>
                          {recurringLabel.day && (
                            <div className="flex justify-between">
                              <span className="text-content-faint">{t("studioClasses.detailModal.day")}</span>
                              <span className="text-content-primary font-medium">{recurringLabel.day}</span>
                            </div>
                          )}
                          {recurringLabel.occurrences && (
                            <div className="flex justify-between">
                              <span className="text-content-faint">{t("studioClasses.detailModal.occurrences")}</span>
                              <span className="text-content-primary font-medium">{recurringLabel.occurrences}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-surface-dark border-l border-t border-border" />
                    </div>
                  )}
                </div>
              )}
              {isCancelled && <span className="text-[10px] font-medium text-red-400 bg-red-500/15 px-2 py-0.5 rounded-lg flex-shrink-0">{t("studioClasses.detailModal.cancelled")}</span>}
              {isPast && !isCancelled && <span className="text-[10px] font-medium text-content-faint bg-surface-button px-2 py-0.5 rounded-lg flex-shrink-0">{t("studioClasses.detailModal.past")}</span>}
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-surface-button text-content-muted hover:text-content-primary rounded-lg transition-colors flex-shrink-0">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 flex gap-0 border-b border-border flex-shrink-0">
          {[
            { id: "details", label: t("studioClasses.detailModal.details"), badge: null },
            { id: "participants", label: t("studioClasses.detailModal.participants"), badge: `${enrolled.length}/${classData.maxParticipants}` },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === tab.id ? "text-content-primary" : "text-content-muted hover:text-content-secondary"
                }`}>
              {tab.label}
              {tab.badge && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? "bg-primary/15 text-primary" : (isFull ? "bg-red-500/15 text-red-400" : "bg-surface-button text-content-muted")
                  }`}>{tab.badge}</span>
              )}
              {activeTab === tab.id && <div className="absolute bottom-0 left-1 right-1 h-[2px] bg-primary rounded-full" />}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto min-h-0">

          {/* ═══ DETAILS TAB ═══ */}
          {activeTab === "details" && (
            <div className="p-6 space-y-5">

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-2">{t("studioClasses.detailModal.date")}</label>
                  {canEdit ? (
                    <div className="w-full flex items-center justify-between bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5">
                      <span className={editDate ? "text-content-primary" : "text-content-faint"}>{formatDateDisplay(editDate)}</span>
                      <DatePickerField value={editDate} onChange={setEditDate} minDate={todayStr} />
                    </div>
                  ) : (
                    <div className="bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-content-primary">
                      {formatDateDisplay(classData.date)}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-2">{t("studioClasses.detailModal.time")}</label>
                  {canEdit ? (
                    <div className="flex items-center gap-1.5">
                      <select value={editHour} onChange={e => handleHourChange(e.target.value)}
                        className="flex-1 bg-surface-dark border border-border text-sm rounded-xl px-2 py-2.5 text-content-primary appearance-none focus:outline-none focus:border-primary cursor-pointer">
                        {filteredHours.map(h => { const v = String(h).padStart(2, "0"); return <option key={h} value={v}>{v}</option> })}
                      </select>
                      <span className="text-content-muted font-semibold">:</span>
                      <select value={editMinute} onChange={e => setEditMinute(e.target.value)}
                        className="flex-1 bg-surface-dark border border-border text-sm rounded-xl px-2 py-2.5 text-content-primary appearance-none focus:outline-none focus:border-primary cursor-pointer">
                        {getFilteredMinutes(editHour).map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div className="bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-content-primary">
                      {displayStartTime} – {displayEndTime}
                    </div>
                  )}
                </div>
              </div>

              {/* Duration Info */}
              {canEdit && (
                <div className="flex items-center gap-2 text-xs text-content-muted bg-surface-dark rounded-xl px-4 py-2.5 border border-border">
                  <Clock size={13} />
                  <span>{t("studioClasses.detailModal.duration", { minutes: classData.duration || 60 })}</span>
                  <span className="text-content-faint">·</span>
                  <span>{t("studioClasses.detailModal.endsAt", { time: editEndTime })}</span>
                </div>
              )}

              {/* Staff */}
              <div>
                <label className="block text-sm font-medium text-content-secondary mb-2">{t("studioClasses.detailModal.staff")}</label>
                {canEdit && normalizedTrainers.length > 0 ? (
                  <CustomDropdown
                    value={editTrainerId}
                    placeholder={t("studioClasses.detailModal.selectStaff")}
                    renderSelected={() => (
                      <div className="flex items-center gap-3">
                        {editTrainer?.img ? (
                          <img src={editTrainer.img} alt="" className="w-6 h-6 rounded-lg object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-semibold"
                            style={{ backgroundColor: getStaffColor(editTrainer) }}>
                            {getStaffInitials(editTrainer)}
                          </div>
                        )}
                        <span className="text-content-primary">{getStaffName(editTrainer)}</span>
                        {editTrainer?.role && <span className="inline-flex items-center gap-1 text-white px-1.5 py-0.5 rounded-md text-[10px] font-medium" style={{ backgroundColor: getRoleColorHex(editTrainer.role) }}><Briefcase size={9} className="flex-shrink-0" />{editTrainer.role}</span>}
                      </div>
                    )}>
                    {(close) => normalizedTrainers.map(t => (
                      <button key={t.id} onClick={() => { setEditTrainerId(t.id); close(); }}
                        className={`w-full text-left p-3 flex items-center gap-3 transition-colors ${editTrainerId === t.id ? 'bg-surface-hover' : 'hover:bg-surface-hover'
                          }`}>
                        {t.img ? (
                          <img src={t.img} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-semibold"
                            style={{ backgroundColor: getStaffColor(t) }}>
                            {getStaffInitials(t)}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="text-sm text-content-primary">{getStaffName(t)}</div>
                          {t.role && <span className="inline-flex items-center gap-1 text-white px-1.5 py-0.5 rounded-md text-[10px] font-medium mt-0.5" style={{ backgroundColor: getRoleColorHex(t.role) }}><Briefcase size={9} className="flex-shrink-0" />{t.role}</span>}
                        </div>
                        {editTrainerId === t.id && <Check size={16} className="text-primary" />}
                      </button>
                    ))}
                  </CustomDropdown>
                ) : (
                  <div className="bg-surface-dark border border-border rounded-xl px-4 py-2.5 flex items-center gap-3">
                    {classData.trainerImg || classData.staff?.img?.url ? (
                      <img src={classData.trainerImg || classData.staff?.img?.url} alt="" className="w-6 h-6 rounded-lg object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-semibold"
                        style={{ backgroundColor: classData.trainerColor || classData.staff?.staffColor || 'var(--color-primary)' }}>
                        {classData.trainerName ?
                          classData.trainerName.split(' ').map(n => n[0]).join('').toUpperCase() :
                          getStaffInitials(classData.staff)}
                      </div>
                    )}
                    <span className="text-sm text-content-primary">{getStaffName(classData.staff) || classData.trainerName || "Unknown"}</span>
                  </div>
                )}
              </div>

              {/* Room & Max Participants */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-2">{t("studioClasses.detailModal.room")}</label>
                  {canEdit && rooms.length > 0 ? (
                    <div className="relative">
                      <select value={editRoom} onChange={e => setEditRoom(e.target.value)}
                        className="w-full bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-content-primary appearance-none focus:outline-none focus:border-primary cursor-pointer">
                        <option value="">{t("studioClasses.detailModal.selectRoom")}</option>
                        {rooms.map(r => <option key={r.id || r} value={r.id || r}>{r.name || r}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-content-faint pointer-events-none" />
                    </div>
                  ) : (
                    <div className="bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-content-primary">
                      {classData.roomName || classData.room?.studioName || t("studioClasses.detailModal.na")}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-2">{t("studioClasses.detailModal.maxParticipants")}</label>
                  {canEdit ? (
                    <input type="number" min={(enrolled.length) || 1} max={100}
                      value={editMax}
                      onChange={e => setEditMax(Math.max((enrolled.length) || 1, Math.min(100, Number(e.target.value) || 1)))}
                      className="w-full bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-content-primary focus:outline-none focus:border-primary" />
                  ) : (
                    <div className="bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-content-primary">
                      {classData.maxParticipants}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══ PARTICIPANTS TAB ═══ */}
          {activeTab === "participants" && (
            <div className="p-6">
              {/* Status + Add */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-content-secondary">
                    {t("studioClasses.detailModal.enrolled", { current: enrolled.length, max: classData.maxParticipants })}
                  </span>
                  {canEdit && (
                    <span className={`text-xs font-medium ${isFull ? "text-red-400" : "text-primary"}`}>
                      {isFull ? `· ${t("studioClasses.detailModal.full")}` : `· ${t("studioClasses.detailModal.spotsLeft", { count: spotsLeft })}`}
                    </span>
                  )}
                </div>
                {!isFull && canEdit && (
                  <button onClick={() => setShowSearch(!showSearch)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-medium rounded-xl transition-colors">
                    <Plus size={13} />{t("studioClasses.detailModal.add")}
                  </button>
                )}
              </div>

              {/* Search */}
              {showSearch && canEdit && (
                <div className="mb-4">
                  <div className="bg-surface-dark rounded-xl px-3 py-2.5 flex items-center gap-2 border border-border focus-within:border-primary transition-colors">
                    <Search size={14} className="text-content-muted flex-shrink-0" />
                    <input ref={searchInputRef} type="text" placeholder={t("studioClasses.detailModal.searchMembers")} value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-content-primary placeholder-content-faint" />
                    <button onClick={() => { setShowSearch(false); setSearchQuery("") }} className="text-content-muted hover:text-content-primary">
                      <X size={14} />
                    </button>
                  </div>
                  {searchQuery && filtered.length > 0 && (
                    <div className="mt-1.5 bg-surface-dark border border-border rounded-xl overflow-hidden">
                      {filtered.slice(0, 5).map(m => (
                        <button key={m._id || m.id} onClick={() => handleEnrollClick(m)}
                          className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-surface-hover transition-colors text-left border-b border-border last:border-0">
                          {m.image || m.img?.url ? <img src={m.image || m.img?.url} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                            : <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">{m.firstName?.charAt(0)}{m.lastName?.charAt(0)}</div>}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-content-primary truncate">{m.firstName} {m.lastName}</p>
                            {m.email && <p className="text-xs text-content-faint truncate">{m.email}</p>}
                          </div>
                          <Plus size={14} className="text-primary flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                  {searchQuery && filtered.length === 0 && (
                    <div className="mt-1.5 bg-surface-dark border border-border rounded-xl p-3">
                      <p className="text-xs text-content-faint text-center">{t("studioClasses.detailModal.noMembersFound")}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Enrolled List */}
              <div className="space-y-1.5">
                {enrolled.length === 0 ? (
                  <div className="text-center py-10 text-content-muted text-sm">
                    <Users size={28} className="mx-auto mb-2 text-content-faint" />
                    {t("studioClasses.detailModal.noMembersEnrolled")}
                  </div>
                ) : enrolled.map(m => (
                  <div key={m._id || m.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-dark hover:bg-surface-hover transition-colors">
                    {m.image || m.img?.url ? <img src={m.image || m.img?.url} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      : <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">{m.firstName?.charAt(0)}{m.lastName?.charAt(0)}</div>}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-content-primary font-medium truncate">{m.firstName} {m.lastName}</p>
                      {m.email && <p className="text-xs text-content-faint truncate">{m.email}</p>}
                    </div>
                    {canEdit && (
                      <button onClick={() => handleRemoveClick(m)}
                        className="p-1.5 text-content-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title={t("studioClasses.detailModal.remove")}>
                        <UserMinus size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
          {canEdit && onCancelClass && (
            <button onClick={() => { setCancelScope("single"); setShowCancelConfirm(true); }}
              className="px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors">
              {t("studioClasses.detailModal.cancelClass")}
            </button>
          )}
          {isCancelled && onDeleteClass && (
            <button onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors">
              {t("studioClasses.detailModal.deletePermanently")}
            </button>
          )}
          <div className="flex-1" />
          <button onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium text-content-muted hover:text-content-primary bg-surface-button hover:bg-surface-button-hover rounded-xl transition-colors">
            {t("studioClasses.detailModal.close")}
          </button>
          {canEdit && activeTab === "details" && (
            <button onClick={handleSaveChanges} disabled={!hasChanges}
              className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-colors ${hasChanges
                ? "text-white bg-primary hover:bg-primary-hover"
                : "text-content-faint bg-surface-button cursor-not-allowed"
                }`}>
              {t("studioClasses.detailModal.saveChanges")}
            </button>
          )}
        </div>
      </div>

      {/* ═══ Cancel Confirmation ═══ */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-4" onClick={() => setShowCancelConfirm(false)}>
          <div className="bg-surface-card w-full max-w-md rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-content-primary">{t("studioClasses.detailModal.cancelConfirm.title")}</h2>
              <button onClick={() => setShowCancelConfirm(false)} className="p-2 hover:bg-surface-button text-content-muted hover:text-content-primary rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0"><AlertTriangle size={20} className="text-red-400" /></div>
                <div>
                  <p className="text-sm text-content-primary mb-1">{t("studioClasses.detailModal.cancelConfirm.message")} <span className="font-semibold text-primary">{classData.typeName || classData.classType?.name}</span>?</p>
                  <p className="text-xs text-content-muted">
                    {formatDateDisplay(classData.date)} · {displayStartTime} – {displayEndTime}
                  </p>
                </div>
              </div>

              {/* Single / Series Toggle — only for recurring classes */}
              {hasSeries && seriesUpcoming.length > 1 && (
                <div className="space-y-2">
                  <label
                    onClick={() => setCancelScope("single")}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${cancelScope === "single" ? "border-primary bg-primary/5" : "border-border bg-surface-dark hover:bg-surface-hover"
                      }`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${cancelScope === "single" ? "border-primary" : "border-content-faint"
                      }`}>
                      {cancelScope === "single" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-content-primary">{t("studioClasses.detailModal.cancelConfirm.onlyThis")}</p>
                      <p className="text-xs text-content-muted">
                        {t("studioClasses.detailModal.cancelConfirm.onlyThisDesc", { date: formatDateDisplay(classData.date) })}
                        {enrolled.length > 0 && <span> · <span className="text-red-400 font-medium">{t("studioClasses.detailModal.cancelConfirm.membersAffected", { count: enrolled.length })}</span></span>}
                      </p>
                    </div>
                  </label>
                  <label
                    onClick={() => setCancelScope("series")}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${cancelScope === "series" ? "border-primary bg-primary/5" : "border-border bg-surface-dark hover:bg-surface-hover"
                      }`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${cancelScope === "series" ? "border-primary" : "border-content-faint"
                      }`}>
                      {cancelScope === "series" && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-content-primary flex items-center gap-2">
                        {t("studioClasses.detailModal.cancelConfirm.entireSeries")}
                        <span className="text-[10px] font-semibold bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded">{t("studioClasses.detailModal.classes", { count: seriesUpcoming.length })}</span>
                      </p>
                      <p className="text-xs text-content-muted">
                        {t("studioClasses.detailModal.cancelConfirm.entireSeriesDesc")}
                        {seriesTotalEnrolled > 0 && <span> · <span className="text-red-400 font-medium">{t("studioClasses.detailModal.cancelConfirm.totalEnrollments", { count: seriesTotalEnrolled })}</span></span>}
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Info for non-recurring or single remaining */}
              {(!hasSeries || seriesUpcoming.length <= 1) && enrolled.length > 0 && (
                <p className="text-xs text-red-400 font-medium">{t("studioClasses.detailModal.cancelConfirm.membersAffected", { count: enrolled.length })}</p>
              )}

              <p className="text-xs text-content-faint">{cancelScope === "series" ? t("studioClasses.detailModal.cancelConfirm.willBeMarkedSeries") : t("studioClasses.detailModal.cancelConfirm.willBeMarked")}</p>
            </div>
            <div className="px-6 py-4 border-t border-border flex gap-3">
              <button onClick={() => setShowCancelConfirm(false)} className="flex-1 py-2.5 text-sm font-medium text-content-muted bg-surface-button hover:bg-surface-button-hover rounded-xl">{t("studioClasses.detailModal.cancelConfirm.keepClass")}</button>
              <button onClick={handleCancelConfirm} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl">
                {cancelScope === "series" ? t("studioClasses.detailModal.cancelConfirm.cancelClasses", { count: seriesUpcoming.length }) : t("studioClasses.detailModal.cancelConfirm.title")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Delete Confirmation ═══ */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-surface-card w-full max-w-md rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-content-primary">{t("studioClasses.detailModal.deleteConfirm.title")}</h2>
              <button onClick={() => setShowDeleteConfirm(false)} className="p-2 hover:bg-surface-button text-content-muted hover:text-content-primary rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0"><Trash2 size={20} className="text-red-400" /></div>
                <div>
                  <p className="text-sm text-content-primary mb-1">{t("studioClasses.detailModal.deleteConfirm.message")} <span className="font-semibold text-primary">{classData.typeName || classData.classType?.name}</span>?</p>
                  <p className="text-xs text-content-faint">{t("studioClasses.detailModal.deleteConfirm.cannotUndo")}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 text-sm font-medium text-content-muted bg-surface-button hover:bg-surface-button-hover rounded-xl">{t("studioClasses.detailModal.deleteConfirm.cancel")}</button>
              <button onClick={handleDeleteConfirm} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl">{t("studioClasses.detailModal.deleteConfirm.delete")}</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Unsaved Changes Confirmation ═══ */}
      {showUnsavedConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-4" onClick={() => setShowUnsavedConfirm(false)}>
          <div className="bg-surface-card w-full max-w-md rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-content-primary">{t("studioClasses.detailModal.unsavedChanges.title")}</h2>
              <button onClick={() => setShowUnsavedConfirm(false)} className="p-2 hover:bg-surface-button text-content-muted hover:text-content-primary rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0"><AlertTriangle size={20} className="text-amber-400" /></div>
                <div>
                  <p className="text-sm text-content-primary mb-1">{t("studioClasses.detailModal.unsavedChanges.message")}</p>
                  <p className="text-xs text-content-faint">{t("studioClasses.detailModal.unsavedChanges.description")}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex gap-3">
              <button onClick={() => setShowUnsavedConfirm(false)} className="flex-1 py-2.5 text-sm font-medium text-content-muted bg-surface-button hover:bg-surface-button-hover rounded-xl">{t("studioClasses.detailModal.unsavedChanges.keepEditing")}</button>
              <button onClick={handleDiscardAndClose} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl">{t("studioClasses.detailModal.unsavedChanges.discard")}</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Notify Modal ═══ */}
      <NotifyModalMain
        isOpen={showNotify}
        onClose={handleNotifyCancel}
        onConfirm={handleNotifyConfirm}
        action={notifyAction}
        entityType="member"
        entityName={notifyEntityName}
        memberCount={
          pendingAction?.type === "cancel-series" ? (() => {
            const allIds = new Set();
            seriesClasses.forEach(c => (c.enrolledMembers || []).forEach(id => allIds.add(id)));
            return allIds.size;
          })()
            : (pendingAction?.type === "cancel" || pendingAction?.type === "reschedule") ? enrolled.length
              : 1
        }
        appointmentType={classData.typeName || classData.classType?.name}
        date={notifyDate}
        time={notifyTime}
      />
    </div>
  );
};

export default ClassDetailModal;