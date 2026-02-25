/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo, useRef } from "react";
import {
  MapPin,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Target,
  User,
  CheckCircle2,
  Dumbbell,
  Heart,
  Zap,
  Scale,
  Activity,
  Shield,
  Check,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

// ─── STUDIO DATA (replace with your real data / import) ─────────────────────
const STUDIO_INFO = {
  name: "FitPulse EMS Studio",
  street: "Musterstraße 12",
  zip: "80331",
  city: "München",
  phone: "+49 89 123456",
};

// Available time‑slots per weekday (0=Sun … 6=Sat). Closed on Sun.
const WEEKLY_SLOTS = {
  1: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
  2: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
  3: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
  4: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
  5: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  6: ["10:00", "11:00", "12:00"],
};

// Some slots that are already taken (YYYY‑MM‑DD → ["HH:MM", …])
const BOOKED_SLOTS = {
  "2026-02-25": ["10:00", "15:00"],
  "2026-02-26": ["09:00", "11:00", "17:00"],
  "2026-02-27": ["14:00"],
  "2026-03-02": ["10:00", "16:00"],
  "2026-03-03": ["09:00", "14:00", "15:00"],
};

const TRAINING_GOALS = [
  { id: "strength", label: "Muscle Building", desc: "Build strength & muscle mass", icon: Dumbbell },
  { id: "cardio", label: "Endurance", desc: "Improve cardiovascular fitness", icon: Heart },
  { id: "weight_loss", label: "Weight Loss", desc: "Burn fat & shape your body", icon: Scale },
  { id: "back_pain", label: "Back & Posture", desc: "Relieve pain & prevent injuries", icon: Shield },
  { id: "fitness", label: "General Fitness", desc: "Get fitter all around", icon: Activity },
  { id: "energy", label: "More Energy", desc: "Boost vitality & well-being", icon: Zap },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, "0");

const formatDate = (d) =>
  `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;

const formatWeekday = (d) =>
  d.toLocaleDateString("en-US", { weekday: "long" });

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const toKey = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// ─── STEP INDICATOR ─────────────────────────────────────────────────────────
const STEPS = [
  { key: "date", label: "Date", icon: CalendarIcon },
  { key: "goals", label: "Goal", icon: Target },
  { key: "info", label: "Details", icon: User },
  { key: "confirm", label: "Confirm", icon: CheckCircle2 },
];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-lg mx-auto mb-8">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            {/* Step Circle */}
            <div className="flex flex-col items-center gap-1.5 relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  done
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : active
                    ? "bg-primary text-white shadow-lg shadow-primary/30 ring-4 ring-primary/20"
                    : "bg-surface-button text-content-faint"
                }`}
              >
                {done ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
              </div>
              <span
                className={`text-xs font-medium transition-colors duration-300 ${
                  done || active ? "text-content-primary" : "text-content-faint"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full overflow-hidden bg-surface-button">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: done ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MINI‑CALENDAR ──────────────────────────────────────────────────────────
function MiniCalendarPicker({ selectedDate, onSelect, viewMonth, onMonthChange, onToday }) {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Prevent navigating to past months
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const canGoPrev = !isCurrentMonth;

  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthLabel = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="select-none">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => canGoPrev && onMonthChange(-1)}
          disabled={!canGoPrev}
          className={`p-1.5 rounded-lg transition-colors ${
            canGoPrev
              ? "hover:bg-surface-button text-content-muted hover:text-content-primary cursor-pointer"
              : "text-content-faint/30 cursor-not-allowed"
          }`}
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-content-primary capitalize">{monthLabel}</span>
          {!isCurrentMonth && (
            <button
              onClick={onToday}
              className="text-[11px] font-medium text-primary bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded-md transition-colors"
            >
              Today
            </button>
          )}
        </div>
        <button
          onClick={() => onMonthChange(1)}
          className="p-1.5 rounded-lg hover:bg-surface-button text-content-muted hover:text-content-primary transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="text-center text-[11px] text-content-faint font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day Cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const date = new Date(year, month, day);
          date.setHours(0, 0, 0, 0);
          const isPast = date < today;
          const isSunday = date.getDay() === 0;
          const disabled = isPast || isSunday;
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const dayKey = toKey(date);
          const weekday = date.getDay();
          const totalSlots = WEEKLY_SLOTS[weekday]?.length || 0;
          const bookedCount = BOOKED_SLOTS[dayKey]?.length || 0;
          const freeSlots = totalSlots - bookedCount;
          const hasSlots = freeSlots > 0 && !disabled;

          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() => !disabled && onSelect(date)}
              className={`relative flex flex-col items-center justify-center py-1.5 rounded-lg text-sm transition-all duration-200 ${
                disabled
                  ? "text-content-faint/40 cursor-not-allowed"
                  : isSelected
                  ? "bg-primary text-white font-semibold shadow-md shadow-primary/25"
                  : isToday
                  ? "bg-primary/15 text-primary font-semibold hover:bg-primary/25"
                  : hasSlots
                  ? "text-content-primary hover:bg-surface-button cursor-pointer"
                  : "text-content-faint cursor-not-allowed"
              }`}
            >
              {day}
              {!disabled && hasSlots && !isSelected && (
                <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── TIME‑SLOT PICKER ───────────────────────────────────────────────────────
function TimeSlotPicker({ date, selectedTime, onSelect }) {
  if (!date) return null;
  const weekday = date.getDay();
  const dayKey = toKey(date);
  const allSlots = WEEKLY_SLOTS[weekday] || [];
  const booked = BOOKED_SLOTS[dayKey] || [];
  const available = allSlots.filter((s) => !booked.includes(s));

  if (available.length === 0) {
    return (
      <div className="text-center py-8 text-content-muted text-sm">
        No available slots on this day.
      </div>
    );
  }

  // Group into morning / afternoon
  const morning = available.filter((s) => parseInt(s) < 12);
  const afternoon = available.filter((s) => parseInt(s) >= 12);

  const SlotGroup = ({ label, slots }) =>
    slots.length > 0 && (
      <div>
        <p className="text-xs text-content-faint font-medium mb-2 uppercase tracking-wider">{label}</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map((time) => {
            const active = selectedTime === time;
            return (
              <button
                key={time}
                onClick={() => onSelect(time)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-surface-button text-content-secondary hover:bg-surface-hover hover:text-content-primary"
                }`}
              >
                <Clock size={13} className={active ? "text-white/80" : "text-content-faint"} />
                {time}
              </button>
            );
          })}
        </div>
      </div>
    );

  return (
    <div className="space-y-4">
      <SlotGroup label="Morning" slots={morning} />
      <SlotGroup label="Afternoon" slots={afternoon} />
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function TrialTraining() {
  const [step, setStep] = useState(0);

  // Step 1 – Date & Time
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (today.getDay() === 0) today.setDate(today.getDate() + 1);
    return today;
  });
  const [viewMonth, setViewMonth] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);

  // Step 2 – Goal (single selection)
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Step 3 – Personal data
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "" });
  const [formErrors, setFormErrors] = useState({});

  // Submitted state
  const [submitted, setSubmitted] = useState(false);

  // Scroll to top on step change
  const containerRef = useRef(null);
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // ── Navigation helpers ──
  const canNext = useMemo(() => {
    if (step === 0) return selectedDate && selectedTime;
    if (step === 1) return selectedGoal !== null;
    if (step === 2) {
      const { firstName, lastName, phone, email } = form;
      return (
        firstName.trim() &&
        lastName.trim() &&
        phone.trim() &&
        email.trim() &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      );
    }
    return true;
  }, [step, selectedDate, selectedTime, selectedGoal, form]);

  const next = () => {
    if (step === 2) {
      const errors = {};
      if (!form.firstName.trim()) errors.firstName = "Required";
      if (!form.lastName.trim()) errors.lastName = "Required";
      if (!form.phone.trim()) errors.phone = "Required";
      if (!form.email.trim()) errors.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email";
      if (Object.keys(errors).length) {
        setFormErrors(errors);
        return;
      }
      setFormErrors({});
    }
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleMonthChange = (dir) => {
    setViewMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + dir);
      // Prevent navigating before current month
      const now = new Date();
      if (d.getFullYear() < now.getFullYear() || 
          (d.getFullYear() === now.getFullYear() && d.getMonth() < now.getMonth())) {
        return prev;
      }
      return d;
    });
  };

  const handleInput = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Here you would POST to your API
  };

  // ── Success screen ──
  if (submitted) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center p-4">
        <style>{`
          .trial-training-root, .trial-training-root * {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-user-drag: none;
            user-drag: none;
          }
        `}</style>
        <div className="trial-training-root bg-surface-card rounded-3xl p-8 sm:p-12 max-w-md w-full text-center shadow-2xl" onDragStart={(e) => e.preventDefault()}>
          <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-content-primary oxanium_font mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-content-muted text-sm mb-6">
            Your trial training has been booked successfully. You will receive a
            confirmation email at <span className="text-content-primary font-medium">{form.email}</span> shortly.
          </p>
          <div className="bg-surface-base rounded-2xl p-4 text-left space-y-2 text-sm mb-6">
            <div className="flex justify-between">
              <span className="text-content-muted">Date</span>
              <span className="text-content-primary font-medium">
                {formatWeekday(selectedDate)}, {formatDate(selectedDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-content-muted">Time</span>
              <span className="text-content-primary font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-content-muted">Studio</span>
              <span className="text-content-primary font-medium">{STUDIO_INFO.name}</span>
            </div>
          </div>
          <p className="text-xs text-content-faint">
            Questions? Reach us at {STUDIO_INFO.phone}
          </p>
        </div>
      </div>
    );
  }

  // ── Get the selected goal object for confirmation ──
  const goalObj = TRAINING_GOALS.find((g) => g.id === selectedGoal);

  // ── RENDER ──
  return (
    <div className="min-h-screen bg-surface-base">
      {/* Global styles: disable text selection & drag/drop */}
      <style>{`
        .trial-training-root, .trial-training-root * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-user-drag: none;
          user-drag: none;
        }
        .trial-training-root input,
        .trial-training-root textarea {
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }
        .trial-training-root img,
        .trial-training-root a,
        .trial-training-root button,
        .trial-training-root div {
          -webkit-user-drag: none;
          user-drag: none;
          draggable: false;
        }
      `}</style>

      <div className="trial-training-root" onDragStart={(e) => e.preventDefault()}>
      {/* Top Bar */}
      <header className="bg-surface-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Dumbbell size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-content-primary oxanium_font leading-tight">
              {STUDIO_INFO.name}
            </h1>
            <p className="text-xs text-content-muted flex items-center gap-1">
              <MapPin size={11} />
              {STUDIO_INFO.street}, {STUDIO_INFO.zip} {STUDIO_INFO.city}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div ref={containerRef} className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-content-primary oxanium_font">
            Book a Trial Training
          </h2>
          <p className="text-sm text-content-muted mt-1">
            Try our studio for free with no commitment
          </p>
        </div>

        {/* Progress */}
        <StepIndicator current={step} />

        {/* Card */}
        <div className="bg-surface-card rounded-3xl shadow-xl overflow-hidden">
          {/* ═══════════════ STEP 0 – DATE & TIME ═══════════════ */}
          {step === 0 && (
            <div className="p-5 sm:p-6">
              <h3 className="text-base font-semibold text-content-primary mb-1">
                Choose a Date & Time
              </h3>
              <p className="text-xs text-content-muted mb-5">
                Select a date first, then pick an available time slot.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Calendar */}
                <div className="bg-surface-base rounded-2xl p-4">
                  <MiniCalendarPicker
                    selectedDate={selectedDate}
                    onSelect={(d) => {
                      setSelectedDate(d);
                      setSelectedTime(null);
                    }}
                    viewMonth={viewMonth}
                    onMonthChange={handleMonthChange}
                    onToday={() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      if (today.getDay() === 0) today.setDate(today.getDate() + 1);
                      setSelectedDate(today);
                      setSelectedTime(null);
                      setViewMonth(new Date());
                    }}
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarIcon size={14} className="text-primary" />
                    <span className="text-sm font-medium text-content-primary">
                      {selectedDate
                        ? `${formatWeekday(selectedDate)}, ${formatDate(selectedDate)}`
                        : "Please select a date"}
                    </span>
                  </div>
                  <TimeSlotPicker
                    date={selectedDate}
                    selectedTime={selectedTime}
                    onSelect={setSelectedTime}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ STEP 1 – TRAINING GOAL (single select) ═══════════════ */}
          {step === 1 && (
            <div className="p-5 sm:p-6">
              <h3 className="text-base font-semibold text-content-primary mb-1">
                What is your training goal?
              </h3>
              <p className="text-xs text-content-muted mb-5">
                Select the goal that best describes what you want to achieve.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TRAINING_GOALS.map((goal) => {
                  const active = selectedGoal === goal.id;
                  const Icon = goal.icon;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`relative flex items-start gap-3 p-4 rounded-2xl text-left transition-all duration-200 border ${
                        active
                          ? "bg-primary/10 border-primary/40 shadow-md shadow-primary/10"
                          : "bg-surface-base border-transparent hover:bg-surface-button hover:border-border"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                          active ? "bg-primary text-white" : "bg-surface-button text-content-muted"
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-semibold transition-colors ${
                            active ? "text-primary" : "text-content-primary"
                          }`}
                        >
                          {goal.label}
                        </p>
                        <p className="text-xs text-content-muted mt-0.5">{goal.desc}</p>
                      </div>
                      {active && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check size={12} strokeWidth={3} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════════ STEP 2 – PERSONAL DATA ═══════════════ */}
          {step === 2 && (
            <div className="p-5 sm:p-6">
              <h3 className="text-base font-semibold text-content-primary mb-1">
                Your Contact Details
              </h3>
              <p className="text-xs text-content-muted mb-5">
                All fields are required.
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="text-sm text-content-muted mb-1.5 block">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => handleInput("firstName", e.target.value)}
                      className={`w-full bg-surface-base text-content-primary text-sm rounded-xl px-4 py-3 border ${
                        formErrors.firstName ? "border-red-500" : "border-border"
                      } focus:border-primary focus:outline-none transition-colors`}
                    />
                    {formErrors.firstName && (
                      <p className="text-xs text-red-400 mt-1">{formErrors.firstName}</p>
                    )}
                  </div>
                  {/* Last Name */}
                  <div>
                    <label className="text-sm text-content-muted mb-1.5 block">
                      Last Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => handleInput("lastName", e.target.value)}
                      className={`w-full bg-surface-base text-content-primary text-sm rounded-xl px-4 py-3 border ${
                        formErrors.lastName ? "border-red-500" : "border-border"
                      } focus:border-primary focus:outline-none transition-colors`}
                    />
                    {formErrors.lastName && (
                      <p className="text-xs text-red-400 mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="text-sm text-content-muted mb-1.5 block">
                    Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleInput("phone", e.target.value)}
                    className={`w-full bg-surface-base text-content-primary text-sm rounded-xl px-4 py-3 border ${
                      formErrors.phone ? "border-red-500" : "border-border"
                    } focus:border-primary focus:outline-none transition-colors`}
                  />
                  {formErrors.phone && (
                    <p className="text-xs text-red-400 mt-1">{formErrors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm text-content-muted mb-1.5 block">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInput("email", e.target.value)}
                    className={`w-full bg-surface-base text-content-primary text-sm rounded-xl px-4 py-3 border ${
                      formErrors.email ? "border-red-500" : "border-border"
                    } focus:border-primary focus:outline-none transition-colors`}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-red-400 mt-1">{formErrors.email}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ STEP 3 – CONFIRMATION ═══════════════ */}
          {step === 3 && (
            <div className="p-5 sm:p-6">
              <h3 className="text-base font-semibold text-content-primary mb-1">
                Summary
              </h3>
              <p className="text-xs text-content-muted mb-5">
                Please review your details before booking.
              </p>

              <div className="space-y-4">
                {/* Studio */}
                <div className="bg-surface-base rounded-2xl p-4">
                  <p className="text-xs text-content-faint uppercase tracking-wider font-medium mb-2">
                    Studio
                  </p>
                  <p className="text-sm font-semibold text-content-primary">{STUDIO_INFO.name}</p>
                  <p className="text-xs text-content-muted mt-0.5 flex items-center gap-1">
                    <MapPin size={11} />
                    {STUDIO_INFO.street}, {STUDIO_INFO.zip} {STUDIO_INFO.city}
                  </p>
                </div>

                {/* Appointment */}
                <div className="bg-surface-base rounded-2xl p-4">
                  <p className="text-xs text-content-faint uppercase tracking-wider font-medium mb-2">
                    Appointment
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                      <CalendarIcon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-content-primary">
                        {formatWeekday(selectedDate)}, {formatDate(selectedDate)}
                      </p>
                      <p className="text-xs text-content-muted">{selectedTime}</p>
                    </div>
                  </div>
                </div>

                {/* Training Goal */}
                <div className="bg-surface-base rounded-2xl p-4">
                  <p className="text-xs text-content-faint uppercase tracking-wider font-medium mb-2">
                    Training Goal
                  </p>
                  {goalObj && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-lg">
                        <goalObj.icon size={12} />
                        {goalObj.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Personal Details */}
                <div className="bg-surface-base rounded-2xl p-4">
                  <p className="text-xs text-content-faint uppercase tracking-wider font-medium mb-2">
                    Contact Details
                  </p>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                    <div>
                      <p className="text-content-muted text-xs">First Name</p>
                      <p className="text-content-primary font-medium">{form.firstName}</p>
                    </div>
                    <div>
                      <p className="text-content-muted text-xs">Last Name</p>
                      <p className="text-content-primary font-medium">{form.lastName}</p>
                    </div>
                    <div>
                      <p className="text-content-muted text-xs">Mobile Number</p>
                      <p className="text-content-primary font-medium">{form.phone}</p>
                    </div>
                    <div>
                      <p className="text-content-muted text-xs">Email</p>
                      <p className="text-content-primary font-medium">{form.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════ NAVIGATION FOOTER ═══════════════ */}
          <div className="px-5 sm:px-6 py-4 border-t border-border flex items-center justify-between">
            {step > 0 ? (
              <button
                onClick={prev}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-surface-button text-sm font-medium text-content-secondary rounded-xl hover:bg-surface-hover transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <button
                onClick={next}
                disabled={!canNext}
                className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                  canNext
                    ? "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20"
                    : "bg-surface-button text-content-faint cursor-not-allowed"
                }`}
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 shadow-md shadow-primary/20 transition-all duration-200"
              >
                <CheckCircle2 size={16} />
                Book Trial Training
              </button>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-content-faint mt-6">
          Free & no commitment · Questions? {STUDIO_INFO.phone}
        </p>
      </div>
      </div>
    </div>
  );
}
