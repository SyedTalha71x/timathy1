/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { X, Clock, Users, MapPin, ChevronDown, Check, Briefcase } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import DatePickerField from '../../shared/DatePickerField';
import { getRoleColorHex } from '../../../utils/studio-states/staff-states';
import { toast } from 'react-toastify'
const getColorHex = (t) => {
  if (!t) return "#808080";
  if (t.colorHex) return t.colorHex;
  if (t.calenderColor) return t.calenderColor;
  if (t.color?.startsWith("#")) return t.color;
  return "#808080";
};

const fmtDate = (d) => {
  const dt = d instanceof Date ? d : new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

// ─── Custom Dropdown Wrapper ───
const CustomDropdown = ({ value, placeholder, children, renderSelected }) => {
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
        className="w-full bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-left flex items-center justify-between hover:bg-surface-hover">
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

const CreateClassModal = ({
  isOpen, onClose, onSubmit, classTypes = [], trainers = [], rooms = [],
  selectedDate = null, selectedTime = null,
}) => {

  const getDate = (d) => d ? fmtDate(new Date(d)) : "";
  const getTime = (t) => {
    if (!t) return "";
    return t.includes("-") ? t.split("-")[0].trim() : t.trim();
  };

  const initDate = getDate(selectedDate);
  const initTime = getTime(selectedTime);
  const initHour = initTime ? initTime.split(":")[0] : "";
  const initMinute = initTime ? initTime.split(":")[1] : "";

  const [showRecurring, setShowRecurring] = useState(false);

  // Separate state for single and recurring classes
  const [singleForm, setSingleForm] = useState({
    date: initDate,
    startHour: initHour,
    startMinute: initMinute,
    maxParticipants: 12
  });

  const [recurringForm, setRecurringForm] = useState({
    startHour: initHour,
    startMinute: initMinute,
    maxParticipants: 12
  });

  // Common fields for both types
  const [commonForm, setCommonForm] = useState({
    typeId: "",
    trainerId: "",
    room: "",
  });

  // Map JavaScript getDay() (0-6) to day name strings
  const getDayName = (dayNumber) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dayNumber];
  };

  const [rec, setRec] = useState({
    frequency: "weekly",
    dayOfWeek: initDate ? getDayName(new Date(initDate).getDay()) : "monday", // Default to monday
    startDate: initDate,
    occurrences: 8
  });



  // Reset when modal opens/closes
  useEffect(() => {
    if (!isOpen) return;

    const nd = getDate(selectedDate);
    const nt = getTime(selectedTime);
    const nh = nt ? nt.split(":")[0] : "";
    const nm = nt ? nt.split(":")[1] : "";

    setCommonForm({ typeId: "", trainerId: "", room: "" });
    setSingleForm({ date: nd || "", startHour: nh, startMinute: nm, maxParticipants: 12 });
    setRecurringForm({ startHour: nh, startMinute: nm, maxParticipants: 12 });
    setRec({
      frequency: "weekly",
      dayOfWeek: nd ? String(new Date(nd).getDay()) : "1",
      startDate: nd || "",
      occurrences: 8
    });
    setShowRecurring(false);
  }, [isOpen, selectedDate, selectedTime]);

  if (!isOpen) return null;

  // Get current values based on booking type
  const currentForm = showRecurring ? recurringForm : singleForm;
  const currentMax = currentForm.maxParticipants;
  const currentDate = showRecurring ? rec.startDate : singleForm.date;
  const currentHour = currentForm.startHour;
  const currentMinute = currentForm.startMinute;

  const updateCommon = (field, value) => {
    setCommonForm(prev => ({ ...prev, [field]: value }));
  };

  const updateSingle = (field, value) => {
    if (field === "date") {
      const n = new Date();
      const tStr = fmtDate(n);
      if (value === tStr) {
        const slotMin = Math.floor(n.getMinutes() / 30) * 30;
        setSingleForm(prev => {
          const h = Number(prev.startHour);
          const m = Number(prev.startMinute);
          const clearH = prev.startHour && h < n.getHours();
          const clearM = prev.startMinute && h === n.getHours() && m < slotMin;
          return {
            ...prev,
            date: value,
            startHour: clearH ? "" : prev.startHour,
            startMinute: (clearH || clearM) ? "" : prev.startMinute
          };
        });
        return;
      }
    }
    setSingleForm(prev => ({ ...prev, [field]: value }));
  };

  const updateRecurring = (field, value) => {
    setRecurringForm(prev => ({ ...prev, [field]: value }));
  };

  const updateRecurrence = (field, value) => {
    setRec(prev => {
      const next = { ...prev, [field]: value };
      if (field === "frequency" && value === "weekly" && prev.startDate) {
        next.dayOfWeek = String(new Date(prev.startDate).getDay());
      }
      return next;
    });
  };

  // Find selected class type - handles both id and _id
  const selType = (() => {
    if (!commonForm.typeId) return null;

    const searchId = String(commonForm.typeId);

    const found = classTypes.find(t => {
      const typeId = String(t.id || t._id);
      return typeId === searchId;
    });


    return found;
  })();

  // Find selected trainer - handles both id and _id
  const selTrainer = (() => {
    if (!commonForm.trainerId) return null;

    const searchId = String(commonForm.trainerId);

    const found = trainers.find(t => {
      const trainerId = String(t.id || t._id);
      return trainerId === searchId;
    });



    return found;
  })();
  const calcEnd = () => {
    if (!selType || !currentHour || !currentMinute) return "";
    const m = Number(currentHour) * 60 + Number(currentMinute) + (selType.duration || 60);
    return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  };

  // Generate dates for recurring
  const generateRecurringDates = () => {
    const dates = [];
    if (!rec.startDate) return dates;
    const start = new Date(rec.startDate);
    const count = parseInt(rec.occurrences) || 1;

    if (rec.frequency === "daily") {
      const current = new Date(start);
      for (let i = 0; i < count; i++) {
        dates.push(fmtDate(current));
        current.setDate(current.getDate() + 1);
      }
    } else if (rec.frequency === "weekly") {
      const dayOfWeek = parseInt(rec.dayOfWeek);
      let current = new Date(start);
      const currentDay = current.getDay();
      let diff = dayOfWeek - currentDay;
      if (diff < 0) diff += 7;
      if (diff > 0) current.setDate(current.getDate() + diff);
      for (let i = 0; i < count; i++) {
        dates.push(fmtDate(current));
        current.setDate(current.getDate() + 7);
      }
    } else if (rec.frequency === "monthly") {
      const startMonth = start.getMonth();
      const startYear = start.getFullYear();
      const targetDay = start.getDate();
      for (let i = 0; i < count; i++) {
        const month = startMonth + i;
        const year = startYear + Math.floor(month / 12);
        const m = month % 12;
        const lastDay = new Date(year, m + 1, 0).getDate();
        const d = new Date(year, m, Math.min(targetDay, lastDay));
        dates.push(fmtDate(d));
      }
    }
    return dates;
  };

  const handleSubmit = () => {


    if (!selType || !selTrainer) {
      console.log("Missing required data - type or trainer");
      toast.error("Please select both class type and staff");
      return;
    }

    // Format time as "HH:MMam/pm" for backend (e.g., "09:30am")
    const hour = parseInt(currentHour);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    const formattedTime = `${displayHour}:${currentMinute}${ampm}`;

    // Get the room ID properly
    let roomId = commonForm.room;
    if (rooms && rooms.length > 0) {
      // Find the selected room object
      const selectedRoom = rooms.find(r => {
        // Handle both string and object room formats
        const roomIdValue = typeof r === 'object' ? (r._id || r.id || r.name) : r;
        return String(roomIdValue) === String(commonForm.room);
      });

      if (selectedRoom && typeof selectedRoom === 'object') {
        // Use _id if it exists, otherwise use id
        roomId = selectedRoom._id || selectedRoom.id;
      }
    }

    if (showRecurring) {
      const dates = generateRecurringDates();
      if (dates.length === 0) {
        toast.error("No valid dates generated for recurring class");
        return;
      }

      console.log(`Creating ${dates.length} recurring classes`);

      // For recurring, we need to pass the first date and the recurrence details
      // The backend will generate all the dates
      const classData = {
        classTypeId: String(selType.id || selType._id),
        staffId: String(selTrainer.id || selTrainer._id),
        bookingType: "recurring",
        date: dates[0], // First date
        time: formattedTime,
        maxParticipants: Number(currentMax),
        roomId: String(roomId || "Studio 1"),
        frequency: rec.frequency,
        occurrence: rec.occurrences,
        dayOfWeek: rec.dayOfWeek
      };

      console.log("Submitting recurring class data:", classData);
      onSubmit(classData);
    } else {
      const classData = {
        classTypeId: String(selType.id || selType._id),
        staffId: String(selTrainer.id || selTrainer._id),
        bookingType: "single",
        date: singleForm.date,
        time: formattedTime,
        maxParticipants: Number(currentMax),
        roomId: String(roomId || "Studio 1")
      };

      console.log("Submitting single class data:", classData);
      onSubmit(classData);
    }

    onClose();
  };
  const isValid = commonForm.typeId && commonForm.trainerId && currentHour && currentMinute &&
    (showRecurring ? rec.startDate : singleForm.date);

  // Check if date+time is in the past
  const isPastDateTime = (() => {
    if (showRecurring) return false;
    if (!singleForm.date || !currentHour || !currentMinute) return false;
    const classStart = new Date(`${singleForm.date}T${currentHour}:${currentMinute}:00`);
    const now = new Date();
    const slotBoundary = new Date(now);
    slotBoundary.setMinutes(Math.floor(now.getMinutes() / 30) * 30, 0, 0);
    return classStart < slotBoundary;
  })();

  const isPastRecurring = (() => {
    if (!showRecurring) return false;
    if (!rec.startDate) return false;
    const start = new Date(rec.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return start < today;
  })();

  const isPast = isPastDateTime || isPastRecurring;
  const todayStr = fmtDate(new Date());
  const nowHour = new Date().getHours();
  const currentSlotMinute = Math.floor(new Date().getMinutes() / 30) * 30;
  const allHours = Array.from({ length: 17 }, (_, i) => i + 6);
  const allMinutes = ["00", "15", "30", "45"];

  const isDateToday = !showRecurring && singleForm.date === todayStr;
  const isRecDateToday = showRecurring && rec.startDate === todayStr;

  const filteredHours = (dateIsToday) => dateIsToday ? allHours.filter(h => h >= nowHour) : allHours;
  const filteredMinutes = (dateIsToday, selectedHour) => {
    if (!dateIsToday || !selectedHour || Number(selectedHour) !== nowHour) return allMinutes;
    return allMinutes.filter(m => Number(m) >= currentSlotMinute);
  };

  const singleHours = filteredHours(isDateToday);
  const singleMinutes = filteredMinutes(isDateToday, singleForm.startHour);
  const recHours = filteredHours(isRecDateToday);
  const recMinutes = filteredMinutes(isRecDateToday, recurringForm.startHour);

  const getInitials = (t) => {
    if (!t) return "?";
    return `${t.firstName?.charAt(0) || ''}${t.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const previewDates = showRecurring ? generateRecurringDates().slice(0, 4) : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4" onClick={onClose}>
      <div className="bg-surface-card w-full max-w-lg rounded-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-content-primary">New Class</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-button text-content-muted hover:text-content-primary rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5">
          {/* Class Type */}
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2">Class Type</label>
            <CustomDropdown value={commonForm.typeId} placeholder="Select class type..."
              renderSelected={() => (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColorHex(selType) }} />
                  <span className="text-content-primary">{selType?.name}</span>
                  <span className="text-content-faint text-xs">({selType?.duration} min)</span>
                </div>
              )}>
              {(close) => classTypes.map(t => (
                <button key={t.id} onClick={() => { updateCommon("typeId", t.id); close(); }}
                  className={`w-full text-left p-3 flex items-center gap-3 ${commonForm.typeId === t.id ? "bg-surface-hover" : "hover:bg-surface-hover"}`}>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getColorHex(t) }} />
                  <div className="flex-1">
                    <div className="text-sm text-content-primary">{t.name}</div>
                    <div className="text-xs text-content-faint">{t.duration} min</div>
                  </div>
                  {commonForm.typeId === t.id && <Check size={16} className="text-primary" />}
                </button>
              ))}
            </CustomDropdown>
          </div>

          {/* Staff */}
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2">Staff</label>
            <CustomDropdown
              value={commonForm.trainerId}
              placeholder="Select staff..."
              renderSelected={() => {
                // Find staff by either id or _id
                const selected = trainers.find(t => {
                  const trainerId = String(t.id || t._id);
                  return trainerId === String(commonForm.trainerId);
                });

                return (
                  <div className="flex items-center gap-3">
                    {selected?.img?.url ?
                      <img src={selected.img.url} alt="" className="w-6 h-6 rounded-lg object-cover" /> :
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-semibold"
                        style={{ backgroundColor: selected?.color || selected?.staffColor || 'var(--color-primary)' }}>
                        {selected ? getInitials(selected) : "?"}
                      </div>
                    }
                    <span className="text-content-primary">
                      {selected ? `${selected.firstName} ${selected.lastName}` : "Select staff..."}
                    </span>
                    {selected?.staffRole &&
                      <span className="inline-flex items-center gap-1 text-white px-1.5 py-0.5 rounded-md text-[10px] font-medium"
                        style={{ backgroundColor: getRoleColorHex(selected.role) }}>
                        <Briefcase size={9} className="flex-shrink-0" />{selected.staffRole}
                      </span>
                    }
                  </div>
                );
              }}>
              {(close) => {
                return trainers.map(t => {
                  // Get the correct ID - use _id since that's what's available
                  const staffId = String(t._id || t.id);
                  const staffName = `${t.firstName} ${t.lastName}`;

                  return (
                    <button
                      key={staffId}
                      onClick={() => {
                        console.log("Selected staff ID:", staffId);
                        console.log("Selected staff:", staffName);
                        updateCommon("trainerId", staffId);
                        close();
                      }}
                      className={`w-full text-left p-3 flex items-center gap-3 ${String(commonForm.trainerId) === staffId
                        ? "bg-surface-hover"
                        : "hover:bg-surface-hover"
                        }`}>
                      {t.img?.url ?
                        <img src={t.img.url} alt="" className="w-8 h-8 rounded-lg object-cover" /> :
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-semibold"
                          style={{ backgroundColor: t.color || t.staffColor || 'var(--color-primary)' }}>
                          {getInitials(t)}
                        </div>
                      }
                      <div className="flex-1">
                        <div className="text-sm text-content-primary text-left">{staffName}</div>
                        {t.staffRole &&
                          <div className="inline-flex items-center gap-1 text-white px-1.5 py-0.5 rounded-md text-[10px] font-medium mt-0.5"
                            style={{ backgroundColor: getRoleColorHex(t.role) }}>
                            <Briefcase size={9} className="flex-shrink-0" />{t.staffRole}
                          </div>
                        }
                      </div>
                      {String(commonForm.trainerId) === staffId &&
                        <Check size={16} className="text-primary flex-shrink-0" />
                      }
                    </button>
                  );
                });
              }}
            </CustomDropdown>
          </div>

          {/* Booking Type */}
          <div>
            <label className="block text-sm font-medium text-content-secondary mb-2">Booking Type</label>
            <div className="flex bg-surface-dark p-1 rounded-xl">
              <button type="button" onClick={() => setShowRecurring(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${!showRecurring ? "bg-primary text-white" : "text-content-muted hover:text-content-primary"}`}>
                Single
              </button>
              <button type="button" onClick={() => setShowRecurring(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${showRecurring ? "bg-primary text-white" : "text-content-muted hover:text-content-primary"}`}>
                Recurring
              </button>
            </div>
          </div>

          {/* Single */}
          {!showRecurring && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-content-faint mb-2">Date</label>
                <div className="w-full flex items-center justify-between bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5">
                  <span className={singleForm.date ? "text-content-primary" : "text-content-faint"}>
                    {singleForm.date ? (() => { const [y, m, d] = singleForm.date.split("-"); return `${d}.${m}.${y}`; })() : "Select date"}
                  </span>
                  <DatePickerField value={singleForm.date} onChange={v => updateSingle("date", v)} minDate={todayStr} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-content-faint mb-2">Start Time</label>
                <div className="flex gap-1.5 items-center">
                  <select value={singleForm.startHour} onChange={e => updateSingle("startHour", e.target.value)}
                    className={`flex-1 bg-surface-dark border border-border text-sm rounded-xl px-2 py-2.5 appearance-none focus:outline-none focus:border-primary cursor-pointer ${singleForm.startHour ? "text-content-primary" : "text-content-faint"}`}>
                    <option value="" disabled>HH</option>
                    {singleHours.map(h => { const v = String(h).padStart(2, "0"); return <option key={h} value={v}>{v}</option> })}
                  </select>
                  <span className="text-content-muted font-semibold">:</span>
                  <select value={singleForm.startMinute} onChange={e => updateSingle("startMinute", e.target.value)}
                    className={`flex-1 bg-surface-dark border border-border text-sm rounded-xl px-2 py-2.5 appearance-none focus:outline-none focus:border-primary cursor-pointer ${singleForm.startMinute ? "text-content-primary" : "text-content-faint"}`}>
                    <option value="" disabled>MM</option>
                    {singleMinutes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Recurring */}
          {showRecurring && (
            <div className="space-y-4 bg-surface-dark rounded-xl p-4">
              <div>
                <label className="block text-xs text-content-faint mb-2">Frequency</label>
                <div className="grid grid-cols-3 gap-1 bg-surface-card p-1 rounded-xl">
                  {[{ v: "daily", l: "Daily" }, { v: "weekly", l: "Weekly" }, { v: "monthly", l: "Monthly" }].map(f => (
                    <button key={f.v} type="button" onClick={() => updateRecurrence("frequency", f.v)}
                      className={`py-2 text-xs font-medium rounded-lg transition-colors ${rec.frequency === f.v ? "bg-primary text-white" : "text-content-muted hover:text-content-primary"}`}>
                      {f.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`grid gap-4 ${rec.frequency === "weekly" ? "grid-cols-2" : "grid-cols-1"}`}>
                <div>
                  <label className="block text-xs text-content-faint mb-2">Start Date</label>
                  <div className="w-full flex items-center justify-between bg-surface-card border border-border text-sm rounded-xl px-3 py-2.5">
                    <span className={rec.startDate ? "text-content-primary" : "text-content-faint"}>
                      {rec.startDate ? (() => { const [y, m, d] = rec.startDate.split("-"); return `${d}.${m}.${y}`; })() : "Select date"}
                    </span>
                    <DatePickerField value={rec.startDate} onChange={v => {
                      updateRecurrence("startDate", v);
                      if (v && rec.frequency === "weekly") {
                        const d = new Date(v);
                        updateRecurrence("dayOfWeek", String(d.getDay()));
                      }
                    }} minDate={todayStr} />
                  </div>
                </div>
                {rec.frequency === "weekly" && (
                  <div>
                    <label className="block text-xs text-content-faint mb-2">Day of Week</label>
                    <select
                      value={rec.dayOfWeek}
                      onChange={e => updateRecurrence("dayOfWeek", e.target.value)}
                      className="w-full bg-surface-card border border-border text-sm rounded-xl px-3 py-2.5 text-content-primary appearance-none focus:outline-none focus:border-primary"
                    >
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-content-faint mb-2">Start Time</label>
                  <div className="flex gap-1.5 items-center">
                    <select value={recurringForm.startHour} onChange={e => updateRecurring("startHour", e.target.value)}
                      className={`flex-1 bg-surface-card border border-border text-sm rounded-xl px-2 py-2.5 appearance-none focus:outline-none focus:border-primary cursor-pointer ${recurringForm.startHour ? "text-content-primary" : "text-content-faint"}`}>
                      <option value="" disabled>HH</option>
                      {recHours.map(h => { const v = String(h).padStart(2, "0"); return <option key={h} value={v}>{v}</option> })}
                    </select>
                    <span className="text-content-muted font-semibold">:</span>
                    <select value={recurringForm.startMinute} onChange={e => updateRecurring("startMinute", e.target.value)}
                      className={`flex-1 bg-surface-card border border-border text-sm rounded-xl px-2 py-2.5 appearance-none focus:outline-none focus:border-primary cursor-pointer ${recurringForm.startMinute ? "text-content-primary" : "text-content-faint"}`}>
                      <option value="" disabled>MM</option>
                      {recMinutes.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-content-faint mb-2">Occurrences</label>
                  <input type="number" min={1} max={52} value={rec.occurrences} onChange={e => updateRecurrence("occurrences", parseInt(e.target.value) || 1)}
                    className="w-full bg-surface-card border border-border text-sm rounded-xl px-3 py-2.5 text-content-primary focus:outline-none focus:border-primary" />
                </div>
              </div>

              {/* Frequency description */}
              <div className="text-xs text-content-faint">
                {rec.frequency === "daily" && "Creates a class every day starting from the selected date."}
                {rec.frequency === "weekly" && "Creates a class every week on the selected day."}
                {rec.frequency === "monthly" && rec.startDate && (() => {
                  const day = new Date(rec.startDate).getDate();
                  const s = ["th", "st", "nd", "rd"];
                  const v = day % 100;
                  const suffix = s[(v - 20) % 10] || s[v] || s[0];
                  return `Creates a class on the ${day}${suffix} of each month.`;
                })()}
                {rec.frequency === "monthly" && !rec.startDate && "Creates a class on the same day each month. Select a start date."}
              </div>

              {/* Preview */}
              {previewDates.length > 0 && (
                <div className="text-xs text-content-muted bg-surface-card rounded-lg p-2.5 space-y-0.5">
                  <div className="text-content-secondary font-medium mb-1">Preview ({rec.occurrences} classes):</div>
                  {previewDates.map((d, i) => {
                    const dt = new Date(d);
                    return <div key={i}>
                      {dt.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                      {recurringForm.startHour && recurringForm.startMinute ? ` · ${recurringForm.startHour}:${recurringForm.startMinute}` : ""}
                    </div>;
                  })}
                  {parseInt(rec.occurrences) > 4 && <div className="text-content-faint">...and {parseInt(rec.occurrences) - 4} more</div>}
                </div>
              )}
            </div>
          )}

          {/* Duration */}
          {selType && (
            <div className="flex items-center gap-2 text-xs text-content-muted bg-surface-dark rounded-xl px-4 py-2.5 border border-border">
              <Clock size={13} />
              <span>Duration: {selType.duration} min</span>
              {calcEnd() && <><span className="text-content-faint">·</span><span>Ends at {calcEnd()}</span></>}
            </div>
          )}

          {/* Room & Max */}
          {/* Room & Max */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-content-faint mb-2">Room</label>
              <CustomDropdown
                value={commonForm.room}
                placeholder="Select room..."
                renderSelected={() => {
                  // Find the selected room to display its name
                  const selectedRoom = rooms.find(r => {
                    const roomId = typeof r === 'object' ? (r.id || r._id || r.name) : r;
                    return commonForm.room === roomId;
                  });

                  // Get the display name
                  const displayName = selectedRoom
                    ? (selectedRoom.name || selectedRoom.studioName || selectedRoom)
                    : commonForm.room || "Select room...";

                  return (
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-content-faint" />
                      <span className="text-content-primary">{displayName}</span>
                    </div>
                  );
                }}>
                {(close) => rooms.map(r => {
                  // Handle both string and object room formats
                  const roomId = typeof r === 'object' ? (r.id || r._id || r.name) : r;
                  const roomName = typeof r === 'object' ? (r.name || r.studioName || r) : r;

                  return (
                    <button
                      key={roomId}
                      onClick={() => {
                        updateCommon("room", roomId);
                        close();
                      }}
                      className={`w-full text-left p-3 flex items-center gap-3 ${commonForm.room === roomId ? "bg-surface-hover" : "hover:bg-surface-hover"}`}>
                      <MapPin size={14} className="text-content-faint" />
                      <span className="text-sm text-content-primary flex-1 text-left">{roomName}</span>
                      {commonForm.room === roomId && <Check size={16} className="text-primary" />}
                    </button>
                  );
                })}
              </CustomDropdown>
            </div>
            <div>
              <label className="block text-xs text-content-faint mb-2 flex items-center gap-1.5">
                <Users size={12} className="text-content-faint" />Max Participants
              </label>
              <input type="number" min={1} max={100} value={currentMax}
                onChange={e => showRecurring
                  ? updateRecurring("maxParticipants", e.target.value)
                  : updateSingle("maxParticipants", e.target.value)
                }
                className="w-full bg-surface-dark border border-border text-sm rounded-xl px-4 py-2.5 text-content-primary focus:outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        {/* Past date warning */}
        {isPast && (
          <div className="px-6 pb-1">
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 rounded-xl px-3 py-2">
              <Clock size={13} />
              <span>{isPastRecurring ? "Start date is in the past" : "Cannot create a class in the past"}</span>
            </div>
          </div>
        )}

        <div className="px-6 py-4 border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-content-muted bg-surface-button hover:bg-surface-button-hover rounded-xl">Cancel</button>
          <button disabled={!isValid || isPast} onClick={handleSubmit}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:bg-surface-button disabled:text-content-muted rounded-xl">
            {showRecurring ? `Create ${rec.occurrences} Classes` : "Create Class"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateClassModal;