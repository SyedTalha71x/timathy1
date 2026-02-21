/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { X, Clock, Users, MapPin, Calendar, Repeat, Search, UserMinus, Trash2, Plus, AlertTriangle, Ban, ChevronDown, Check } from "lucide-react";
import NotifyModalMain from '../../shared/NotifyModal';
import DatePickerField from '../../shared/DatePickerField';

const fmtDate = (d) => { const dt=d instanceof Date?d:new Date(d); return`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}` };
const getColorHex = (t) => { if(!t)return"#808080";if(t.colorHex)return t.colorHex;if(t.color?.startsWith("#"))return t.color;return"#808080" };

// ─── Custom Dropdown (fixed positioning, matches CreateClassModal) ───
const CustomDropdown = ({ value, placeholder, renderSelected, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const btnRef = useRef(null);
  const [pos, setPos] = useState({ top:0, left:0, width:0 });

  useEffect(() => {
    const h = (e) => { if(ref.current && !ref.current.contains(e.target)) setIsOpen(false) };
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
        <ChevronDown size={14} className={`text-content-faint transition-transform ${isOpen ? "rotate-180" : ""}`}/>
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
  const [activeTab, setActiveTab] = useState("details");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelScope, setCancelScope] = useState("single"); // "single" | "series"
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
  const [showRecurringInfo, setShowRecurringInfo] = useState(false);
  const searchInputRef = useRef(null);
  const recurringRef = useRef(null);

  // ─── Local edit state ───
  const [editDate, setEditDate] = useState("");
  const [editHour, setEditHour] = useState("09");
  const [editMinute, setEditMinute] = useState("00");
  const [editRoom, setEditRoom] = useState("");
  const [editTrainerId, setEditTrainerId] = useState(null);
  const [editMax, setEditMax] = useState(12);

  // ─── Original values (for change detection) ───
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

  useEffect(() => { if(showSearch && searchInputRef.current) searchInputRef.current.focus() }, [showSearch]);

  // Close recurring popover on outside click
  useEffect(() => {
    if (!showRecurringInfo) return;
    const h = (e) => { if(recurringRef.current && !recurringRef.current.contains(e.target)) setShowRecurringInfo(false) };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [showRecurringInfo]);

  // Initialize local state from classData when modal opens or classData changes
  useEffect(() => {
    if (!isOpen || !classData) return;
    const h = classData.startTime?.split(":")[0] || "09";
    const m = classData.startTime?.split(":")[1] || "00";
    setEditDate(classData.date || "");
    setEditHour(h); setEditMinute(m);
    setEditRoom(classData.room || "");
    setEditTrainerId(classData.trainerId);
    setEditMax(classData.maxParticipants || 12);
    // Store originals
    setOrigDate(classData.date || "");
    setOrigHour(h); setOrigMinute(m);
    setOrigRoom(classData.room || "");
    setOrigTrainerId(classData.trainerId);
    setOrigMax(classData.maxParticipants || 12);
  }, [isOpen, classData?.id]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setActiveTab("details"); setShowSearch(false); setSearchQuery("");
      setShowDeleteConfirm(false); setShowCancelConfirm(false); setShowUnsavedConfirm(false);
      setShowRecurringInfo(false); setShowNotify(false); setPendingAction(null);
    }
  }, [isOpen]);

  if (!isOpen || !classData) return null;

  const enrolled = membersData.filter(m => classData.enrolledMembers?.includes(m.id));
  const available = membersData.filter(m => !classData.enrolledMembers?.includes(m.id));
  const filtered = available.filter(m => `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()));
  const spotsLeft = (classData.maxParticipants || 0) - (classData.enrolledMembers?.length || 0);
  const isFull = spotsLeft <= 0;
  const isCancelled = classData.isCancelled || false;
  const isPast = classData.isPast || false;
  const canEdit = !isPast && !isCancelled;
  const color = isCancelled ? "#6B7280" : (classData.color || "#6c5ce7");
  const hasSeries = classData.isRecurring && classData.seriesId;
  const seriesClasses = hasSeries
    ? allClassesData.filter(c => c.seriesId === classData.seriesId && !c.isCancelled)
    : [];
  const seriesUpcoming = seriesClasses.filter(c => !c.isPast);
  const seriesTotalEnrolled = seriesClasses.reduce((sum, c) => sum + (c.enrolledMembers?.length || 0), 0);

  // ─── Change detection ───
  const hasScheduleChanges = editDate !== origDate || editHour !== origHour || editMinute !== origMinute;
  const hasChanges = hasScheduleChanges || editRoom !== origRoom || editTrainerId !== origTrainerId || editMax !== origMax;

  // ─── Close with unsaved changes guard ───
  const handleClose = () => {
    if (hasChanges) { setShowUnsavedConfirm(true); return; }
    onClose();
  };
  const handleDiscardAndClose = () => { setShowUnsavedConfirm(false); onClose(); };

  const formatDate = (ds) => { if(!ds) return "N/A"; const d = typeof ds==="string" ? new Date(ds) : ds; if(isNaN(d.getTime())) return ds; return d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}) };
  const formatDateDisplay = (ds) => { if(!ds) return "Select date"; const [y,m,d] = ds.split("-"); return `${d}.${m}.${y}` };

  const getInitials = (t) => {
    if (t.firstName || t.lastName) return `${t.firstName?.charAt(0)||''}${t.lastName?.charAt(0)||''}`.toUpperCase();
    const parts = (t.trainerName || t.name || "").split(" ");
    return parts.map(p => p.charAt(0)).join("").toUpperCase();
  };

  // ─── Recurring info helpers ───
  const dayNames = { "0":"Sunday","1":"Monday","2":"Tuesday","3":"Wednesday","4":"Thursday","5":"Friday","6":"Saturday" };
  const freqLabels = { daily:"Daily", weekly:"Weekly", biweekly:"Bi-weekly", monthly:"Monthly" };
  const getRecurringLabel = () => {
    const rec = classData.recurring;
    if (!rec) return null;
    const freq = freqLabels[rec.frequency] || rec.frequency;
    const day = dayNames[String(rec.dayOfWeek)] || "";
    return { freq, day, occurrences: rec.occurrences || "–", startDate: rec.startDate };
  };
  const recurringLabel = classData.isRecurring ? getRecurringLabel() : null;

  // ─── Time helpers ───
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
    const total = Number(h) * 60 + Number(m) + (classData.duration || 60);
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  };

  const isTimePast = (date, h, m) => {
    const classStart = new Date(`${date}T${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:00`);
    const slotBoundary = new Date();
    slotBoundary.setMinutes(Math.floor(slotBoundary.getMinutes() / 30) * 30, 0, 0);
    return classStart < slotBoundary;
  };

  // When hour changes, ensure minute is still valid
  const handleHourChange = (newH) => {
    setEditHour(newH);
    const validMinutes = getFilteredMinutes(newH);
    if (!validMinutes.includes(editMinute) && validMinutes.length > 0) {
      setEditMinute(validMinutes[0]);
    }
  };

  // ─── Build changes object ───
  const buildChanges = () => {
    const changes = {};
    const selectedTrainer = trainers.find(t => t.id === editTrainerId);

    if (editDate !== origDate) changes.date = editDate;
    if (editHour !== origHour || editMinute !== origMinute) {
      changes.startTime = `${editHour}:${editMinute}`;
      changes.endTime = calcEndTime(editHour, editMinute);
    }
    // If date changed but time didn't, still include the full schedule
    if (changes.date && !changes.startTime) {
      changes.startTime = `${editHour}:${editMinute}`;
      changes.endTime = calcEndTime(editHour, editMinute);
    }
    if (editRoom !== origRoom) changes.room = editRoom;
    if (editTrainerId !== origTrainerId && selectedTrainer) {
      changes.trainerId = selectedTrainer.id;
      changes.trainerName = `${selectedTrainer.firstName} ${selectedTrainer.lastName}`;
      changes.trainerImg = selectedTrainer.img || null;
      changes.trainerColor = selectedTrainer.color || null;
    }
    if (editMax !== origMax) changes.maxParticipants = editMax;

    return changes;
  };

  // ─── Save Changes ───
  const handleSaveChanges = () => {
    if (!hasChanges) return;

    // Validate: is the selected time in the past?
    if (isTimePast(editDate, editHour, editMinute)) return;

    const changes = buildChanges();

    // If schedule changed and there are enrolled members → notify first
    if (hasScheduleChanges && enrolled.length > 0) {
      const names = enrolled.map(m => `${m.firstName} ${m.lastName}`).join(", ");
      setPendingAction({ type: "reschedule", changes });
      setNotifyAction("reschedule");
      setNotifyEntityName(names);
      setShowNotify(true);
    } else {
      // No schedule change or no enrolled members → save directly
      onEditClass?.(classData.id, changes);
    }
  };

  // ─── Member handlers ───
  const handleEnrollClick = (member) => {
    const name = `${member.firstName} ${member.lastName}`;
    setPendingAction({ type: "enroll", memberId: member.id, memberName: name });
    setNotifyAction("book"); setNotifyEntityName(name); setShowNotify(true); setSearchQuery("");
  };

  const handleRemoveClick = (member) => {
    const name = `${member.firstName} ${member.lastName}`;
    setPendingAction({ type: "remove", memberId: member.id, memberName: name });
    setNotifyAction("cancel"); setNotifyEntityName(name); setShowNotify(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelConfirm(false);
    const isSeries = cancelScope === "series";

    if (isSeries) {
      // Collect all enrolled members across the series for notify
      const allSeriesMembers = new Set();
      seriesClasses.forEach(c => (c.enrolledMembers || []).forEach(id => allSeriesMembers.add(id)));
      const affectedMembers = membersData.filter(m => allSeriesMembers.has(m.id));
      const names = affectedMembers.map(m => `${m.firstName} ${m.lastName}`).join(", ");

      if (affectedMembers.length > 0) {
        setPendingAction({ type: "cancel-series" });
        setNotifyAction("cancel");
        setNotifyEntityName(names);
        setShowNotify(true);
      } else {
        onCancelSeries?.(classData.seriesId);
        onClose();
      }
    } else {
      if (enrolled.length > 0) {
        setPendingAction({ type: "cancel" }); setNotifyAction("cancel");
        setNotifyEntityName(enrolled.map(m => `${m.firstName} ${m.lastName}`).join(", "));
        setShowNotify(true);
      } else { onCancelClass?.(classData.id); onClose(); }
    }
  };

  const handleDeleteConfirm = () => { setShowDeleteConfirm(false); onDeleteClass?.(classData.id); onClose(); };

  const handleNotifyConfirm = (shouldNotify, options) => {
    if (!pendingAction) return;
    if (pendingAction.type === "enroll") onEnrollMember?.(classData.id, pendingAction.memberId);
    else if (pendingAction.type === "remove") onRemoveMember?.(classData.id, pendingAction.memberId);
    else if (pendingAction.type === "cancel") { onCancelClass?.(classData.id); onClose(); }
    else if (pendingAction.type === "cancel-series") { onCancelSeries?.(classData.seriesId); onClose(); }
    else if (pendingAction.type === "reschedule") onEditClass?.(classData.id, pendingAction.changes);
    if (shouldNotify) console.log("Notification:", { action: pendingAction.type, options });
    setShowNotify(false); setPendingAction(null);
  };

  // Cancel from notify → go back to editing
  const handleNotifyCancel = () => {
    setShowNotify(false);
    setPendingAction(null);
  };

  // Current trainer for display
  const editTrainer = trainers.find(t => t.id === editTrainerId);
  const editEndTime = calcEndTime(editHour, editMinute);

  // For notify modal: show the NEW date/time
  const notifyDate = pendingAction?.type === "reschedule" && pendingAction?.changes?.date
    ? formatDate(pendingAction.changes.date) : formatDate(classData.date);
  const notifyTime = pendingAction?.type === "reschedule" && pendingAction?.changes?.startTime
    ? `${pendingAction.changes.startTime} - ${pendingAction.changes.endTime}`
    : `${classData.startTime} - ${classData.endTime}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" onClick={handleClose}>
      <div className="bg-surface-card w-full max-w-lg rounded-xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header with color bar */}
        <div className="relative">
          <div className="h-1.5 flex-shrink-0" style={{ background: color }}>
            {isCancelled && <div className="absolute inset-0 h-1.5" style={{ background: 'repeating-linear-gradient(135deg,transparent,transparent 3px,rgba(255,255,255,.2) 3px,rgba(255,255,255,.2) 6px)' }}/>}
          </div>
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }}/>
              <h2 className="text-lg font-semibold text-content-primary truncate">{classData.typeName}</h2>
              {classData.isRecurring && (
                <div ref={recurringRef} className="relative flex-shrink-0">
                  <button
                    onClick={() => setShowRecurringInfo(!showRecurringInfo)}
                    onMouseEnter={() => { if(window.innerWidth >= 1024) setShowRecurringInfo(true) }}
                    onMouseLeave={() => { if(window.innerWidth >= 1024) setShowRecurringInfo(false) }}
                    className="p-1 rounded-md text-content-muted hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Recurring class">
                    <Repeat size={14}/>
                  </button>
                  {showRecurringInfo && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[1050] w-56">
                      <div className="bg-surface-dark border border-border rounded-xl shadow-xl p-3 text-xs">
                        <div className="flex items-center gap-2 mb-2">
                          <Repeat size={12} className="text-primary"/>
                          <span className="text-content-primary font-semibold">Recurring Class</span>
                        </div>
                        {recurringLabel ? (
                          <div className="space-y-1.5 text-content-secondary">
                            <div className="flex justify-between">
                              <span className="text-content-faint">Frequency</span>
                              <span className="text-content-primary font-medium">{recurringLabel.freq}</span>
                            </div>
                            {recurringLabel.day && (
                              <div className="flex justify-between">
                                <span className="text-content-faint">Day</span>
                                <span className="text-content-primary font-medium">{recurringLabel.day}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-content-faint">Occurrences</span>
                              <span className="text-content-primary font-medium">{recurringLabel.occurrences}</span>
                            </div>
                            {recurringLabel.startDate && (
                              <div className="flex justify-between">
                                <span className="text-content-faint">Since</span>
                                <span className="text-content-primary font-medium">{formatDateDisplay(recurringLabel.startDate)}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-content-faint">This class is part of a recurring series.</p>
                        )}
                      </div>
                      {/* Arrow */}
                      <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-surface-dark border-l border-t border-border"/>
                    </div>
                  )}
                </div>
              )}
              {isCancelled && <span className="text-[10px] font-medium text-red-400 bg-red-500/15 px-2 py-0.5 rounded-lg flex-shrink-0">Cancelled</span>}
              {isPast && !isCancelled && <span className="text-[10px] font-medium text-content-faint bg-surface-button px-2 py-0.5 rounded-lg flex-shrink-0">Past</span>}
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-surface-button text-content-muted hover:text-content-primary rounded-lg transition-colors flex-shrink-0">
              <X size={20}/>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 flex gap-0 border-b border-border flex-shrink-0">
          {[
            { id: "details", label: "Details", badge: null },
            { id: "participants", label: "Participants", badge: `${enrolled.length}/${classData.maxParticipants}` },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                activeTab === tab.id ? "text-content-primary" : "text-content-muted hover:text-content-secondary"
              }`}>
              {tab.label}
              {tab.badge && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                  activeTab === tab.id ? "bg-primary/15 text-primary" : (isFull ? "bg-red-500/15 text-red-400" : "bg-surface-button text-content-muted")
                }`}>{tab.badge}</span>
              )}
              {activeTab === tab.id && <div className="absolute bottom-0 left-1 right-1 h-[2px] bg-primary rounded-full"/>}
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
                  <label className="block text-sm font-medium text-content-secondary mb-2">Date</label>
                  {canEdit ? (
                    <div className="w-full flex items-center justify-between bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5">
                      <span className={editDate ? "text-content-primary" : "text-content-faint"}>{formatDateDisplay(editDate)}</span>
                      <DatePickerField value={editDate} onChange={setEditDate} minDate={todayStr}/>
                    </div>
                  ) : (
                    <div className="bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-content-primary">
                      {formatDateDisplay(classData.date)}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-2">Time</label>
                  {canEdit ? (
                    <div className="flex items-center gap-1.5">
                      <select value={editHour} onChange={e => handleHourChange(e.target.value)}
                        className="flex-1 bg-surface-dark border border-border text-sm rounded-xl px-2 py-2.5 text-content-primary appearance-none focus:outline-none focus:border-primary cursor-pointer">
                        {filteredHours.map(h => { const v = String(h).padStart(2,"0"); return <option key={h} value={v}>{v}</option> })}
                      </select>
                      <span className="text-content-muted font-semibold">:</span>
                      <select value={editMinute} onChange={e => setEditMinute(e.target.value)}
                        className="flex-1 bg-surface-dark border border-border text-sm rounded-xl px-2 py-2.5 text-content-primary appearance-none focus:outline-none focus:border-primary cursor-pointer">
                        {getFilteredMinutes(editHour).map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div className="bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-content-primary">
                      {classData.startTime} – {classData.endTime}
                    </div>
                  )}
                </div>
              </div>

              {/* Duration Info */}
              {canEdit && (
                <div className="flex items-center gap-2 text-xs text-content-muted bg-surface-dark rounded-xl px-4 py-2.5 border border-border">
                  <Clock size={13}/>
                  <span>Duration: {classData.duration} min</span>
                  <span className="text-content-faint">·</span>
                  <span>Ends at {editEndTime}</span>
                </div>
              )}

              {/* Trainer */}
              <div>
                <label className="block text-sm font-medium text-content-secondary mb-2">Trainer</label>
                {canEdit && trainers.length > 0 ? (
                  <CustomDropdown
                    value={editTrainerId}
                    placeholder="Select trainer..."
                    renderSelected={() => (
                      <div className="flex items-center gap-3">
                        {editTrainer?.img ? (
                          <img src={editTrainer.img} alt="" className="w-6 h-6 rounded-lg object-cover"/>
                        ) : (
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-semibold"
                            style={{ backgroundColor: editTrainer?.color || 'var(--color-primary)' }}>
                            {getInitials(editTrainer || {})}
                          </div>
                        )}
                        <span className="text-content-primary">{editTrainer?.firstName} {editTrainer?.lastName}</span>
                        {editTrainer?.role && <span className="text-content-faint text-xs">{editTrainer.role}</span>}
                      </div>
                    )}>
                    {(close) => trainers.map(t => (
                      <button key={t.id} onClick={() => { setEditTrainerId(t.id); close(); }}
                        className={`w-full text-left p-3 flex items-center gap-3 transition-colors ${
                          editTrainerId === t.id ? 'bg-surface-hover' : 'hover:bg-surface-hover'
                        }`}>
                        {t.img ? (
                          <img src={t.img} alt="" className="w-8 h-8 rounded-lg object-cover"/>
                        ) : (
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-semibold"
                            style={{ backgroundColor: t.color || 'var(--color-primary)' }}>
                            {getInitials(t)}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="text-sm text-content-primary">{t.firstName} {t.lastName}</div>
                          {t.role && <div className="text-xs text-content-faint">{t.role}</div>}
                        </div>
                        {editTrainerId === t.id && <Check size={16} className="text-primary"/>}
                      </button>
                    ))}
                  </CustomDropdown>
                ) : (
                  <div className="bg-surface-dark border border-border rounded-xl px-4 py-2.5 flex items-center gap-3">
                    {classData.trainerImg ? (
                      <img src={classData.trainerImg} alt="" className="w-6 h-6 rounded-lg object-cover"/>
                    ) : (
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-semibold"
                        style={{ backgroundColor: classData.trainerColor || 'var(--color-primary)' }}>
                        {getInitials(classData)}
                      </div>
                    )}
                    <span className="text-sm text-content-primary">{classData.trainerName}</span>
                  </div>
                )}
              </div>

              {/* Room & Max Participants */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-2">Room</label>
                  {canEdit && rooms.length > 0 ? (
                    <div className="relative">
                      <select value={editRoom} onChange={e => setEditRoom(e.target.value)}
                        className="w-full bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-content-primary appearance-none focus:outline-none focus:border-primary cursor-pointer">
                        {rooms.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-content-faint pointer-events-none"/>
                    </div>
                  ) : (
                    <div className="bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-content-primary">
                      {classData.room || "N/A"}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-2">Max Participants</label>
                  {canEdit ? (
                    <input type="number" min={(classData.enrolledMembers?.length) || 1} max={100}
                      value={editMax}
                      onChange={e => setEditMax(Math.max((classData.enrolledMembers?.length) || 1, Math.min(100, Number(e.target.value) || 1)))}
                      className="w-full bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-content-primary focus:outline-none focus:border-primary"/>
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
                    {enrolled.length}/{classData.maxParticipants} enrolled
                  </span>
                  {canEdit && (
                    <span className={`text-xs font-medium ${isFull ? "text-red-400" : "text-primary"}`}>
                      {isFull ? "· Full" : `· ${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`}
                    </span>
                  )}
                </div>
                {!isFull && canEdit && (
                  <button onClick={() => setShowSearch(!showSearch)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-medium rounded-xl transition-colors">
                    <Plus size={13}/>Add
                  </button>
                )}
              </div>

              {/* Search */}
              {showSearch && canEdit && (
                <div className="mb-4">
                  <div className="bg-surface-dark rounded-xl px-3 py-2.5 flex items-center gap-2 border border-border focus-within:border-primary transition-colors">
                    <Search size={14} className="text-content-muted flex-shrink-0"/>
                    <input ref={searchInputRef} type="text" placeholder="Search members..." value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-content-primary placeholder-content-faint"/>
                    <button onClick={() => { setShowSearch(false); setSearchQuery("") }} className="text-content-muted hover:text-content-primary">
                      <X size={14}/>
                    </button>
                  </div>
                  {searchQuery && filtered.length > 0 && (
                    <div className="mt-1.5 bg-surface-dark border border-border rounded-xl overflow-hidden">
                      {filtered.slice(0, 5).map(m => (
                        <button key={m.id} onClick={() => handleEnrollClick(m)}
                          className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-surface-hover transition-colors text-left border-b border-border last:border-0">
                          {m.image ? <img src={m.image} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0"/>
                            : <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">{m.firstName?.charAt(0)}{m.lastName?.charAt(0)}</div>}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-content-primary truncate">{m.firstName} {m.lastName}</p>
                            {m.email && <p className="text-xs text-content-faint truncate">{m.email}</p>}
                          </div>
                          <Plus size={14} className="text-primary flex-shrink-0"/>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchQuery && filtered.length === 0 && (
                    <div className="mt-1.5 bg-surface-dark border border-border rounded-xl p-3">
                      <p className="text-xs text-content-faint text-center">No members found</p>
                    </div>
                  )}
                </div>
              )}

              {/* Enrolled List */}
              <div className="space-y-1.5">
                {enrolled.length === 0 ? (
                  <div className="text-center py-10 text-content-muted text-sm">
                    <Users size={28} className="mx-auto mb-2 text-content-faint"/>
                    No members enrolled yet
                  </div>
                ) : enrolled.map(m => (
                  <div key={m.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-dark hover:bg-surface-hover transition-colors">
                    {m.image ? <img src={m.image} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0"/>
                      : <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">{m.firstName?.charAt(0)}{m.lastName?.charAt(0)}</div>}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-content-primary font-medium truncate">{m.firstName} {m.lastName}</p>
                      {m.email && <p className="text-xs text-content-faint truncate">{m.email}</p>}
                    </div>
                    {canEdit && (
                      <button onClick={() => handleRemoveClick(m)}
                        className="p-1.5 text-content-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Remove">
                        <UserMinus size={14}/>
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
              Cancel Class
            </button>
          )}
          {isCancelled && onDeleteClass && (
            <button onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors">
              Delete Permanently
            </button>
          )}
          <div className="flex-1"/>
          <button onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium text-content-muted hover:text-content-primary bg-surface-button hover:bg-surface-button-hover rounded-xl transition-colors">
            Close
          </button>
          {canEdit && activeTab === "details" && (
            <button onClick={handleSaveChanges} disabled={!hasChanges}
              className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                hasChanges
                  ? "text-white bg-primary hover:bg-primary-hover"
                  : "text-content-faint bg-surface-button cursor-not-allowed"
              }`}>
              Save Changes
            </button>
          )}
        </div>
      </div>

      {/* ═══ Cancel Confirmation ═══ */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-4" onClick={() => setShowCancelConfirm(false)}>
          <div className="bg-surface-card w-full max-w-md rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-content-primary">Cancel Class</h2>
              <button onClick={() => setShowCancelConfirm(false)} className="p-2 hover:bg-surface-button text-content-muted hover:text-content-primary rounded-lg"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0"><AlertTriangle size={20} className="text-red-400"/></div>
                <div>
                  <p className="text-sm text-content-primary mb-1">Are you sure you want to cancel <span className="font-semibold text-primary">{classData.typeName}</span>?</p>
                  <p className="text-xs text-content-muted">
                    {formatDateDisplay(classData.date)} · {classData.startTime} – {classData.endTime}
                  </p>
                </div>
              </div>

              {/* Single / Series Toggle — only for recurring classes */}
              {hasSeries && seriesUpcoming.length > 1 && (
                <div className="space-y-2">
                  <label
                    onClick={() => setCancelScope("single")}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      cancelScope === "single" ? "border-primary bg-primary/5" : "border-border bg-surface-dark hover:bg-surface-hover"
                    }`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                      cancelScope === "single" ? "border-primary" : "border-content-faint"
                    }`}>
                      {cancelScope === "single" && <div className="w-2 h-2 rounded-full bg-primary"/>}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-content-primary">Only this class</p>
                      <p className="text-xs text-content-muted">
                        Cancel the class on {formatDateDisplay(classData.date)}
                        {enrolled.length > 0 && <span> · <span className="text-red-400 font-medium">{enrolled.length} member{enrolled.length !== 1 ? "s" : ""} affected</span></span>}
                      </p>
                    </div>
                  </label>
                  <label
                    onClick={() => setCancelScope("series")}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      cancelScope === "series" ? "border-primary bg-primary/5" : "border-border bg-surface-dark hover:bg-surface-hover"
                    }`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                      cancelScope === "series" ? "border-primary" : "border-content-faint"
                    }`}>
                      {cancelScope === "series" && <div className="w-2 h-2 rounded-full bg-primary"/>}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-content-primary flex items-center gap-2">
                        Entire series
                        <span className="text-[10px] font-semibold bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded">{seriesUpcoming.length} classes</span>
                      </p>
                      <p className="text-xs text-content-muted">
                        Cancel all upcoming classes in this series
                        {seriesTotalEnrolled > 0 && <span> · <span className="text-red-400 font-medium">{seriesTotalEnrolled} total enrollment{seriesTotalEnrolled !== 1 ? "s" : ""} affected</span></span>}
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Info for non-recurring or single remaining */}
              {(!hasSeries || seriesUpcoming.length <= 1) && enrolled.length > 0 && (
                <p className="text-xs text-red-400 font-medium">{enrolled.length} enrolled member{enrolled.length !== 1 ? "s" : ""} will be affected</p>
              )}

              <p className="text-xs text-content-faint">{cancelScope === "series" ? "All classes in the series" : "The class"} will be marked as cancelled and can still be deleted permanently later.</p>
            </div>
            <div className="px-6 py-4 border-t border-border flex gap-3">
              <button onClick={() => setShowCancelConfirm(false)} className="flex-1 py-2.5 text-sm font-medium text-content-muted bg-surface-button hover:bg-surface-button-hover rounded-xl">Keep Class</button>
              <button onClick={handleCancelConfirm} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl">
                {cancelScope === "series" ? `Cancel ${seriesUpcoming.length} Classes` : "Cancel Class"}
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
              <h2 className="text-lg font-semibold text-content-primary">Delete Class</h2>
              <button onClick={() => setShowDeleteConfirm(false)} className="p-2 hover:bg-surface-button text-content-muted hover:text-content-primary rounded-lg"><X size={20}/></button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0"><Trash2 size={20} className="text-red-400"/></div>
                <div>
                  <p className="text-sm text-content-primary mb-1">Permanently delete <span className="font-semibold text-primary">{classData.typeName}</span>?</p>
                  <p className="text-xs text-content-faint">This action cannot be undone.</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 text-sm font-medium text-content-muted bg-surface-button hover:bg-surface-button-hover rounded-xl">Cancel</button>
              <button onClick={handleDeleteConfirm} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Unsaved Changes Confirmation ═══ */}
      {showUnsavedConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1001] p-4" onClick={() => setShowUnsavedConfirm(false)}>
          <div className="bg-surface-card w-full max-w-md rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-content-primary">Unsaved Changes</h2>
              <button onClick={() => setShowUnsavedConfirm(false)} className="p-2 hover:bg-surface-button text-content-muted hover:text-content-primary rounded-lg"><X size={20}/></button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0"><AlertTriangle size={20} className="text-amber-400"/></div>
                <div>
                  <p className="text-sm text-content-primary mb-1">You have unsaved changes.</p>
                  <p className="text-xs text-content-faint">Are you sure you want to close? Your changes will be lost.</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex gap-3">
              <button onClick={() => setShowUnsavedConfirm(false)} className="flex-1 py-2.5 text-sm font-medium text-content-muted bg-surface-button hover:bg-surface-button-hover rounded-xl">Keep Editing</button>
              <button onClick={handleDiscardAndClose} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl">Discard Changes</button>
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
        appointmentType={classData.typeName}
        date={notifyDate}
        time={notifyTime}
      />
    </div>
  );
};

export default ClassDetailModal;
