import { useState, useRef, useEffect, useMemo } from "react"
import { Calendar, Clock, ChevronLeft, X, Check, Users, MapPin, Search, Timer, BellRing, CalendarPlus, Filter } from "lucide-react"
import DatePickerField from "../../components/shared/DatePickerField"
import ClassEnrollModal from "../../components/member-panel-components/classes-components/ClassEnrollModal"
import ClassCancelModal from "../../components/member-panel-components/classes-components/ClassCancelModal"
import { haptic } from "../../utils/haptic"
import PullToRefresh from "../../components/shared/PullToRefresh"
import { Capacitor } from "@capacitor/core"
import toast from "../../components/shared/SharedToast"

// ============================================
// Local Notification Helpers
// ============================================
const scheduleClassReminder = async (cls) => {
  if (!Capacitor.isNativePlatform()) return
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications")

    // Request permission (iOS shows dialog once, then remembers)
    const perm = await LocalNotifications.requestPermissions()
    if (perm.display !== "granted") return

    // Read reminder timing — default 24 hours before (matches Settings)
    const reminderHours = (() => {
      try {
        const stored = JSON.parse(localStorage.getItem("class_reminder_hours"))
        return stored && stored > 0 ? stored : 24
      } catch { return 24 }
    })()

    const dateObj = new Date(cls.date)
    const [sh, sm] = (cls.startTime || "09:00").split(":")
    dateObj.setHours(parseInt(sh), parseInt(sm), 0, 0)

    // Schedule notification X hours before
    const notifyAt = new Date(dateObj.getTime() - reminderHours * 60 * 60 * 1000)

    // If reminder time already passed but class hasn't started yet → notify in 30s (for testing)
    const now = new Date()
    if (notifyAt <= now && dateObj > now) {
      notifyAt.setTime(now.getTime() + 30 * 1000)
    }

    // Don't schedule if the class has already started
    if (dateObj <= now) return

    await LocalNotifications.schedule({
      notifications: [{
        id: cls.id,
        title: cls.typeName || "Class Reminder",
        body: `Starts in ${reminderHours}h — ${cls.startTime} at ${cls.room || "Studio"}`,
        schedule: { at: notifyAt },
        sound: "default",
        extra: { classId: cls.id },
      }],
    })
    console.log("[Notification] Scheduled for:", notifyAt.toLocaleString())
  } catch (err) {
    console.error("[Notification] Schedule failed:", err)
  }
}

const cancelClassReminder = async (cls) => {
  if (!Capacitor.isNativePlatform()) return
  try {
    const { LocalNotifications } = await import("@capacitor/local-notifications")
    await LocalNotifications.cancel({ notifications: [{ id: cls.id }] })
    console.log("[Notification] Cancelled for class:", cls.id)
  } catch (err) {
    console.error("[Notification] Cancel failed:", err)
  }
}

// ============================================
// Reusable Components (matches appointment.jsx)
// ============================================
const SectionHeader = ({ title, description, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-content-primary">{title}</h2>
      {description && <p className="text-xs sm:text-sm text-content-muted mt-1">{description}</p>}
    </div>
    {action}
  </div>
)

const SettingsCard = ({ children, className = "", onClick }) => (
  <div className={`bg-surface-hover rounded-xl p-4 sm:p-6 ${className}`} onClick={onClick}>{children}</div>
)

// ============================================
// Helpers
// ============================================
const fmtDate = (d) => {
  const dt = d instanceof Date ? d : new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`
}

const fmtDateDisplay = (ds) => {
  if (!ds) return ""
  const d = typeof ds === "string" ? new Date(ds) : ds
  if (isNaN(d.getTime())) return ds
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

const fmtDateLong = (ds) => {
  if (!ds) return ""
  const d = typeof ds === "string" ? new Date(ds) : ds
  if (isNaN(d.getTime())) return ds
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const Classes = () => {
  // TODO: Replace demo data with Redux slice / API calls once backend is ready

  // ─── State ───
  const [selectedDate, setSelectedDate] = useState(() => {
    const t = new Date(); t.setHours(0, 0, 0, 0); return t
  })
  const [showMyClasses, setShowMyClasses] = useState(false)
  const [myClassesView, setMyClassesView] = useState("upcoming")
  const [selectedCategories, setSelectedCategories] = useState(["All"])
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [classToCancel, setClassToCancel] = useState(null)

  // Info modal — simple inline modal matching appointment.jsx
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [infoModalData, setInfoModalData] = useState(null)

  // Watchlist — notify when a spot opens in a full class
  const [watchlist, setWatchlist] = useState(new Set())

  // My Classes action sheet
  const [actionSheetClass, setActionSheetClass] = useState(null)

  // Calendar sheet after enrollment
  const [calendarSheetClass, setCalendarSheetClass] = useState(null)

  const daySliderRef = useRef(null)
  const filterBtnRef = useRef(null)

  // Close filter dropdown on outside click
  useEffect(() => {
    if (!showFilterDropdown) return
    const handleClickOutside = (e) => {
      if (filterBtnRef.current && !filterBtnRef.current.contains(e.target)) setShowFilterDropdown(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showFilterDropdown])

  // Desktop: convert vertical scroll to horizontal on the day slider
  useEffect(() => {
    const el = daySliderRef.current
    if (!el) return
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        el.scrollLeft += e.deltaY
      }
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  })

  // ─── Demo data (replace with API data when backend is ready) ───
  // Test class starting in 5 minutes (for notification testing)
  const testStart = new Date(Date.now() + 5 * 60 * 1000)
  const testEnd = new Date(Date.now() + 65 * 60 * 1000)
  const testStartTime = `${String(testStart.getHours()).padStart(2,"0")}:${String(testStart.getMinutes()).padStart(2,"0")}`
  const testEndTime = `${String(testEnd.getHours()).padStart(2,"0")}:${String(testEnd.getMinutes()).padStart(2,"0")}`

  const [availableClasses, setAvailableClasses] = useState([
    // ── TEST CLASS — starts in 5 min (set reminder to 0.05h / ~3 min in Settings to test) ──
    {
      id: 99, typeId: "ct99", typeName: "Quick Test Class", color: "#e84393",
      date: fmtDate(new Date()), startTime: testStartTime, endTime: testEndTime, duration: 60,
      trainerName: "Test Trainer", trainerImg: null, trainerColor: "#e84393",
      room: "Studio 1", maxParticipants: 20, enrolledMembers: [],
      isCancelled: false, isPast: false, isRecurring: false,
      category: "Group Class",
      description: "Test class for notification testing. Set reminder to a low number (e.g. 0.05 hours = 3 min) in Settings to see the notification quickly.",
      image: null,
    },
    // ── TODAY ──
    {
      id: 1, typeId: "ct1", typeName: "Yoga Flow", color: "#6c5ce7",
      date: fmtDate(new Date()), startTime: "09:00", endTime: "10:00", duration: 60,
      trainerName: "Sarah Miller", trainerImg: null, trainerColor: "#6c5ce7",
      room: "Studio 1", maxParticipants: 15, enrolledMembers: ["m2", "m3"],
      isCancelled: false, isPast: false, isRecurring: true,
      category: "Wellness",
      description: "A flowing yoga session that builds strength and flexibility through connected poses.",
      image: null,
    },
    {
      id: 2, typeId: "ct2", typeName: "HIIT Training", color: "#e17055",
      date: fmtDate(new Date()), startTime: "10:30", endTime: "11:15", duration: 45,
      trainerName: "Mike Johnson", trainerImg: null, trainerColor: "#e17055",
      room: "Studio 2", maxParticipants: 20, enrolledMembers: ["m4", "m5", "m6"],
      isCancelled: false, isPast: false, isRecurring: true,
      category: "Group Class",
      description: "High-intensity interval training to maximize calorie burn and boost endurance.",
      image: null,
    },
    {
      id: 3, typeId: "ct3", typeName: "Pilates", color: "#00b894",
      date: fmtDate(new Date()), startTime: "14:00", endTime: "15:00", duration: 60,
      trainerName: "Lisa Chen", trainerImg: null, trainerColor: "#00b894",
      room: "Studio 1", maxParticipants: 12, enrolledMembers: ["m2", "m3", "m4"],
      isCancelled: false, isPast: false, isRecurring: false,
      category: "Wellness",
      description: "Core-focused Pilates session improving posture, balance and body awareness.",
      image: null,
    },
    {
      id: 7, typeId: "ct5", typeName: "Boxing Basics", color: "#d63031",
      date: fmtDate(new Date()), startTime: "16:00", endTime: "17:00", duration: 60,
      trainerName: "Jake Rivera", trainerImg: null, trainerColor: "#d63031",
      room: "Studio 2", maxParticipants: 16, enrolledMembers: ["m5"],
      isCancelled: false, isPast: false, isRecurring: true,
      category: "Group Class",
      description: "Learn the fundamentals of boxing — footwork, jabs, hooks and defensive moves.",
      image: null,
    },
    {
      id: 8, typeId: "ct6", typeName: "Stretch & Recover", color: "#00cec9",
      date: fmtDate(new Date()), startTime: "18:00", endTime: "18:45", duration: 45,
      trainerName: "Sarah Miller", trainerImg: null, trainerColor: "#6c5ce7",
      room: "Studio 1", maxParticipants: 20, enrolledMembers: [],
      isCancelled: false, isPast: false, isRecurring: true,
      category: "Wellness",
      description: "Guided stretching and foam rolling to help your muscles recover and prevent injury.",
      image: null,
    },
    // ── TOMORROW ──
    {
      id: 4, typeId: "ct1", typeName: "Yoga Flow", color: "#6c5ce7",
      date: fmtDate(new Date(Date.now() + 86400000)), startTime: "09:00", endTime: "10:00", duration: 60,
      trainerName: "Sarah Miller", trainerImg: null, trainerColor: "#6c5ce7",
      room: "Studio 1", maxParticipants: 15, enrolledMembers: [],
      isCancelled: false, isPast: false, isRecurring: true,
      category: "Wellness",
      description: "A flowing yoga session that builds strength and flexibility through connected poses.",
      image: null,
    },
    {
      id: 5, typeId: "ct4", typeName: "Spinning", color: "#fdcb6e",
      date: fmtDate(new Date(Date.now() + 86400000)), startTime: "11:00", endTime: "11:45", duration: 45,
      trainerName: "Tom Becker", trainerImg: null, trainerColor: "#fdcb6e",
      room: "Cycling Room", maxParticipants: 25, enrolledMembers: ["m2", "m3"],
      isCancelled: false, isPast: false, isRecurring: true,
      category: "Group Class",
      description: "Indoor cycling with energizing music and motivating intervals.",
      image: null,
    },
    {
      id: 9, typeId: "ct7", typeName: "Functional Training", color: "#0984e3",
      date: fmtDate(new Date(Date.now() + 86400000)), startTime: "13:00", endTime: "14:00", duration: 60,
      trainerName: "Mike Johnson", trainerImg: null, trainerColor: "#e17055",
      room: "Studio 2", maxParticipants: 18, enrolledMembers: ["m4"],
      isCancelled: false, isPast: false, isRecurring: true,
      category: "Group Class",
      description: "Full-body workout using kettlebells, bands, and bodyweight for real-world strength.",
      image: null,
    },
    {
      id: 10, typeId: "ct5", typeName: "Boxing Basics", color: "#d63031",
      date: fmtDate(new Date(Date.now() + 86400000)), startTime: "17:00", endTime: "18:00", duration: 60,
      trainerName: "Jake Rivera", trainerImg: null, trainerColor: "#d63031",
      room: "Studio 2", maxParticipants: 16, enrolledMembers: [],
      isCancelled: false, isPast: false, isRecurring: true,
      category: "Group Class",
      description: "Learn the fundamentals of boxing — footwork, jabs, hooks and defensive moves.",
      image: null,
    },
    // ── DAY AFTER TOMORROW ──
    {
      id: 6, typeId: "ct2", typeName: "HIIT Training", color: "#e17055",
      date: fmtDate(new Date(Date.now() + 172800000)), startTime: "10:30", endTime: "11:15", duration: 45,
      trainerName: "Mike Johnson", trainerImg: null, trainerColor: "#e17055",
      room: "Studio 2", maxParticipants: 20, enrolledMembers: [],
      isCancelled: false, isPast: false, isRecurring: true,
      category: "Group Class",
      description: "High-intensity interval training to maximize calorie burn and boost endurance.",
      image: null,
    },
    {
      id: 11, typeId: "ct3", typeName: "Pilates", color: "#00b894",
      date: fmtDate(new Date(Date.now() + 172800000)), startTime: "09:00", endTime: "10:00", duration: 60,
      trainerName: "Lisa Chen", trainerImg: null, trainerColor: "#00b894",
      room: "Studio 1", maxParticipants: 12, enrolledMembers: ["m5", "m6"],
      isCancelled: false, isPast: false, isRecurring: true,
      category: "Wellness",
      description: "Core-focused Pilates session improving posture, balance and body awareness.",
      image: null,
    },
    {
      id: 12, typeId: "ct6", typeName: "Stretch & Recover", color: "#00cec9",
      date: fmtDate(new Date(Date.now() + 172800000)), startTime: "18:00", endTime: "18:45", duration: 45,
      trainerName: "Sarah Miller", trainerImg: null, trainerColor: "#6c5ce7",
      room: "Studio 1", maxParticipants: 20, enrolledMembers: [],
      isCancelled: false, isPast: false, isRecurring: true,
      category: "Wellness",
      description: "Guided stretching and foam rolling to help your muscles recover and prevent injury.",
      image: null,
    },
    // ── 3 DAYS FROM NOW ──
    {
      id: 13, typeId: "ct4", typeName: "Spinning", color: "#fdcb6e",
      date: fmtDate(new Date(Date.now() + 259200000)), startTime: "10:00", endTime: "10:45", duration: 45,
      trainerName: "Tom Becker", trainerImg: null, trainerColor: "#fdcb6e",
      room: "Cycling Room", maxParticipants: 25, enrolledMembers: [],
      isCancelled: false, isPast: false, isRecurring: true,
      category: "Group Class",
      description: "Indoor cycling with energizing music and motivating intervals.",
      image: null,
    },
    {
      id: 14, typeId: "ct7", typeName: "Functional Training", color: "#0984e3",
      date: fmtDate(new Date(Date.now() + 259200000)), startTime: "15:00", endTime: "16:00", duration: 60,
      trainerName: "Mike Johnson", trainerImg: null, trainerColor: "#e17055",
      room: "Studio 2", maxParticipants: 18, enrolledMembers: [],
      isCancelled: false, isPast: false, isRecurring: true,
      category: "Group Class",
      description: "Full-body workout using kettlebells, bands, and bodyweight for real-world strength.",
      image: null,
    },
  ])

  // Current member
  const currentMemberId = "m1"

  // ─── Derived ───
  const todayStr = fmtDate(new Date())
  const dateValue = fmtDate(selectedDate)

  // Categories from classes
  const categories = useMemo(() => {
    const types = [...new Set(availableClasses.map(c => c.typeName))]
    return ["All", ...types.sort()]
  }, [availableClasses])

  // My enrolled classes
  const myClasses = useMemo(() => {
    return availableClasses.filter(c => c.enrolledMembers?.includes(currentMemberId))
  }, [availableClasses, currentMemberId])

  const myUpcomingClasses = myClasses.filter(c => !c.isPast && !c.isCancelled)
  const myPastClasses = myClasses.filter(c => c.isPast || c.isCancelled)

  // Classes for selected date
  const classesForDate = useMemo(() => {
    const dateStr = fmtDate(selectedDate)
    return availableClasses.filter(c => {
      if (c.date !== dateStr) return false
      if (c.isCancelled) return false
      if (!selectedCategories.includes("All") && !selectedCategories.includes(c.typeName)) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!c.typeName.toLowerCase().includes(q) && !c.trainerName.toLowerCase().includes(q) && !c.room.toLowerCase().includes(q)) return false
      }
      return true
    }).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }, [availableClasses, selectedDate, selectedCategories, searchQuery])

  // ─── Dynamic day slider: 30 days, starting from today OR shifted so selectedDate is visible ───
  const sliderDays = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const sel = new Date(selectedDate)
    sel.setHours(0, 0, 0, 0)

    // How many days from today to the selected date
    const diffDays = Math.round((sel - today) / 86400000)

    // Calculate start: normally today. If selected date would be outside the 30-day window,
    // shift the window so selectedDate sits ~7 days in (giving context before & after)
    let startDate = new Date(today)
    if (diffDays >= 30) {
      startDate = new Date(sel)
      startDate.setDate(startDate.getDate() - 7)
    }
    // Never start before today
    if (startDate < today) startDate = new Date(today)

    const days = []
    for (let i = 0; i < 30; i++) {
      const d = new Date(startDate)
      d.setDate(startDate.getDate() + i)
      const dateStr = fmtDate(d)
      const classCount = availableClasses.filter(c => c.date === dateStr && !c.isCancelled).length
      days.push({
        date: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        dayName: DAY_NAMES[d.getDay()],
        monthShort: MONTHS_SHORT[d.getMonth()],
        isToday: dateStr === todayStr,
        dateStr,
        classCount,
      })
    }
    return days
  }, [availableClasses, selectedDate, todayStr])

  // Scroll slider to selected date whenever it changes
  useEffect(() => {
    requestAnimationFrame(() => {
      const el = daySliderRef.current
      if (!el) return
      const btn = el.querySelector(`[data-date="${fmtDate(selectedDate)}"]`)
      if (btn) btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    })
  }, [selectedDate])

  // ─── Handlers ───
  const handleDateChange = (dateStr) => {
    if (!dateStr) return
    setSelectedDate(new Date(dateStr))
  }

  const handleSliderDayClick = (day) => {
    haptic.light()
    setSelectedDate(new Date(day.year, day.month, day.date))
  }

  const handleEnrollClick = (cls) => { haptic.light(); setSelectedClass(cls); setShowEnrollModal(true) }

  const confirmEnroll = () => {
    if (!selectedClass) return
    haptic.success()
    // TODO: dispatch(enrollInClass({ classId: selectedClass.id })) when backend is ready
    console.log("Enrolled in class:", selectedClass.id)

    // Update local state — add current member to enrolledMembers
    setAvailableClasses(prev => prev.map(cls =>
      cls.id === selectedClass.id
        ? { ...cls, enrolledMembers: [...(cls.enrolledMembers || []), currentMemberId] }
        : cls
    ))

    scheduleClassReminder(selectedClass)
    toast.success("Enrolled successfully")
    const enrolledClass = selectedClass
    setShowEnrollModal(false)
    setSelectedClass(null)
    setShowMyClasses(true)
    setMyClassesView("upcoming")
    setCalendarSheetClass(enrolledClass)
  }

  const handleCancelEnrollment = (cls) => { haptic.light(); setClassToCancel(cls); setShowCancelModal(true) }

  const confirmCancel = () => {
    if (!classToCancel) return
    haptic.warning()
    // TODO: dispatch(unenrollFromClass({ classId: classToCancel.id })) when backend is ready
    console.log("Cancelled enrollment:", classToCancel.id)

    // Update local state — remove current member from enrolledMembers
    setAvailableClasses(prev => prev.map(cls =>
      cls.id === classToCancel.id
        ? { ...cls, enrolledMembers: (cls.enrolledMembers || []).filter(id => id !== currentMemberId) }
        : cls
    ))

    cancelClassReminder(classToCancel)
    toast.info("Enrollment cancelled")
    setShowCancelModal(false)
    setClassToCancel(null)
  }

  const isEnrolled = (cls) => cls.enrolledMembers?.includes(currentMemberId)
  const isFull = (cls) => (cls.enrolledMembers?.length || 0) >= (cls.maxParticipants || 0)
  const spotsLeft = (cls) => Math.max(0, (cls.maxParticipants || 0) - (cls.enrolledMembers?.length || 0))
  const isWatching = (cls) => watchlist.has(cls.id)

  const toggleWatchlist = (cls) => {
    setWatchlist(prev => {
      const next = new Set(prev)
      if (next.has(cls.id)) {
        next.delete(cls.id)
        haptic.light()
        // TODO: dispatch remove from watchlist when backend is ready
        console.log("Removed from watchlist:", cls.id)
      } else {
        next.add(cls.id)
        haptic.success()
        // TODO: dispatch add to watchlist when backend is ready
        console.log("Added to watchlist:", cls.id)
      }
      return next
    })
  }

  // ─── Add to Calendar ───
  const addToCalendar = async (cls) => {
    const dateObj = new Date(cls.date)
    const [sh, sm] = (cls.startTime || "09:00").split(":")
    const [eh, em] = (cls.endTime || "10:00").split(":")

    const startDate = new Date(dateObj)
    startDate.setHours(parseInt(sh), parseInt(sm), 0, 0)
    const endDate = new Date(dateObj)
    endDate.setHours(parseInt(eh), parseInt(em), 0, 0)

    if (Capacitor.isNativePlatform()) {
      try {
        const { CapacitorCalendar } = await import("@ebarooni/capacitor-calendar")

        // Request write access (needed on iOS < 17)
        try {
          await CapacitorCalendar.requestWriteOnlyCalendarAccess()
        } catch (permErr) {
          // User denied — show hint
          alert("Calendar access is required to add events. Please enable it in Settings > OrgaGym > Calendar.")
          setActionSheetClass(null)
          return
        }

        // Opens native iOS "New Event" dialog with pre-filled data
        const result = await CapacitorCalendar.createEventWithPrompt({
          title: cls.typeName || "Class",
          location: cls.room || "",
          notes: `Trainer: ${cls.trainerName || "TBA"}`,
          startDate: startDate.getTime(),
          endDate: endDate.getTime(),
        })

        if (result?.id) {
          haptic.success()
          toast.success("Added to calendar")
        }
      } catch (err) {
        // User cancelled the dialog — not an error
        if (!err.message?.includes("cancel")) {
          console.error("[Calendar] Error:", err)
        }
      }
      setActionSheetClass(null)
      return
    }

    // Web fallback: .ics blob download
    const pad = (n) => String(n).padStart(2, "0")
    const y = dateObj.getFullYear()
    const m = pad(dateObj.getMonth() + 1)
    const d = pad(dateObj.getDate())
    const dtStart = `${y}${m}${d}T${pad(sh)}${pad(sm)}00`
    const dtEnd = `${y}${m}${d}T${pad(eh)}${pad(em)}00`
    const filename = `${(cls.typeName || "class").replace(/\s+/g, "-").toLowerCase()}.ics`
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Studio App//Classes//EN",
      "BEGIN:VEVENT", `UID:class-${cls.id}-${Date.now()}@app`,
      `DTSTART:${dtStart}`, `DTEND:${dtEnd}`,
      `SUMMARY:${cls.typeName || "Class"}`,
      `DESCRIPTION:Trainer: ${cls.trainerName || "TBA"}`,
      `LOCATION:${cls.room || ""}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n")
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setActionSheetClass(null)
  }

  const openActionSheet = (cls) => {
    haptic.light()
    setActionSheetClass(cls)
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="flex flex-col h-full bg-surface-base text-content-primary overflow-hidden lg:rounded-3xl select-none">

      {/* ═══ Info Modal (matches appointment.jsx info modal) ═══ */}
      {showInfoModal && infoModalData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-content-primary pr-4">{infoModalData.typeName}</h3>
              <button onClick={() => setShowInfoModal(false)} className="text-content-muted hover:text-content-primary transition-colors flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            {infoModalData.description && (
              <p className="text-content-secondary text-sm mb-4">{infoModalData.description}</p>
            )}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm bg-surface-hover rounded-xl p-3">
                <span className="text-content-muted">Duration</span>
                <span className="text-content-primary font-medium">{infoModalData.duration} min</span>
              </div>
              {infoModalData.category && (
                <div className="flex justify-between items-center text-sm bg-surface-hover rounded-xl p-3">
                  <span className="text-content-muted">Category</span>
                  <span className="text-content-primary font-medium">{infoModalData.category}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm bg-surface-hover rounded-xl p-3">
                <span className="text-content-muted">Time</span>
                <span className="text-content-primary font-medium">{infoModalData.startTime} – {infoModalData.endTime}</span>
              </div>
              <div className="flex justify-between items-center text-sm bg-surface-hover rounded-xl p-3">
                <span className="text-content-muted">Room</span>
                <span className="text-content-primary font-medium">{infoModalData.room}</span>
              </div>
              <div className="flex justify-between items-center text-sm bg-surface-hover rounded-xl p-3">
                <span className="text-content-muted">Trainer</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-semibold flex-shrink-0"
                    style={{ backgroundColor: infoModalData.trainerColor || "#6c5ce7" }}
                  >
                    {infoModalData.trainerName?.split(" ").map(p => p.charAt(0)).join("").toUpperCase()}
                  </div>
                  <span className="text-content-primary font-medium">{infoModalData.trainerName}</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm bg-surface-hover rounded-xl p-3">
                <span className="text-content-muted">Participants</span>
                <span className="text-content-primary font-medium">
                  {infoModalData.enrolledMembers?.length || 0}/{infoModalData.maxParticipants}
                </span>
              </div>
            </div>
            {isFull(infoModalData) && !isEnrolled(infoModalData) && (
              <div className="flex items-start gap-2.5 mt-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                <BellRing className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-content-secondary">
                  {isWatching(infoModalData)
                    ? "You'll be notified when a spot opens up. Tap \"Watching\" to stop."
                    : "This class is full. Tap \"Notify Me\" to get alerted when a spot becomes available."}
                </p>
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowInfoModal(false)} className="flex-1 px-4 py-2.5 text-sm bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors">
                Close
              </button>
              {isEnrolled(infoModalData) ? (
                <button
                  onClick={() => { setShowInfoModal(false); handleCancelEnrollment(infoModalData) }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-xl transition-colors"
                >
                  <span className="sm:hidden">Cancel</span><span className="hidden sm:inline">Cancel Enrollment</span>
                </button>
              ) : isFull(infoModalData) ? (
                isWatching(infoModalData) ? (
                  <button
                    onClick={() => toggleWatchlist(infoModalData)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-yellow-400 bg-yellow-500/15 hover:bg-yellow-500/25 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <BellRing className="w-4 h-4" />
                    <span>Watching</span>
                  </button>
                ) : (
                  <button
                    onClick={() => toggleWatchlist(infoModalData)}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-500 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <BellRing className="w-4 h-4" />
                    <span>Notify Me</span>
                  </button>
                )
              ) : (
                <button
                  onClick={() => { setShowInfoModal(false); handleEnrollClick(infoModalData) }}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-xl transition-colors"
                >
                  Enroll
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border flex-shrink-0">
        {showMyClasses ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => { haptic.light(); setShowMyClasses(false) }}
              className="p-2 -ml-2 text-content-muted hover:text-content-primary hover:bg-surface-button rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-2xl font-bold">My Classes</h1>
          </div>
        ) : (
          <h1 className="text-lg sm:text-2xl font-bold">Classes</h1>
        )}
      </div>

      {/* Content */}
      <PullToRefresh
        onRefresh={async () => { /* TODO: dispatch(fetchClasses()) when backend is ready */ await new Promise(r => setTimeout(r, 600)) }}
        className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 lg:pb-16"
        style={{ WebkitOverflowScrolling: "touch" }}
      >

        {/* ============================================ */}
        {/* MAIN VIEW                                    */}
        {/* ============================================ */}
        {!showMyClasses && (
          <div className="space-y-4">
            {/* My Classes CTA */}
            <button
              onClick={() => { haptic.light(); setShowMyClasses(true) }}
              className="w-full bg-primary hover:bg-primary-hover rounded-xl px-4 py-2.5 flex items-center gap-3 transition-colors"
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Timer className="w-4 h-4 text-white" />
              </div>
              <span className="text-left flex-1 text-white font-semibold text-sm">My Classes</span>
              <div className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full min-w-[1.5rem] flex items-center justify-center">
                {myUpcomingClasses.length}
              </div>
            </button>

            {/* Date + Filter + Search */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium text-content-primary truncate">
                  {fmtDateLong(selectedDate)}
                </span>
                <DatePickerField
                  value={dateValue}
                  onChange={handleDateChange}
                  minDate={todayStr}
                  iconSize={16}
                />
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="relative" ref={filterBtnRef}>
                  <button
                    onClick={() => { haptic.light(); setShowFilterDropdown(prev => !prev) }}
                    className={`p-1.5 rounded-lg transition-colors flex-shrink-0 relative ${
                      showFilterDropdown || (!selectedCategories.includes("All") && selectedCategories.length > 0)
                        ? "bg-primary/15 text-primary"
                        : "bg-surface-button text-content-muted hover:bg-surface-button-hover"
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    {!selectedCategories.includes("All") && selectedCategories.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary rounded-full text-[8px] font-bold text-white flex items-center justify-center">
                        {selectedCategories.length}
                      </span>
                    )}
                  </button>
                  {showFilterDropdown && (
                    <div className="absolute top-full right-0 mt-1 bg-surface-card border border-border rounded-xl shadow-xl z-[9999] min-w-[180px] overflow-hidden">
                      <div className="max-h-[200px] overflow-y-auto py-1">
                        {categories.map((cat) => {
                          const isActive = selectedCategories.includes(cat)
                          return (
                            <button
                              key={cat}
                              onClick={() => {
                                haptic.light()
                                setSelectedCategories(prev => {
                                  if (cat === "All") return ["All"]
                                  const current = prev.filter(v => v !== "All")
                                  if (current.includes(cat)) {
                                    const next = current.filter(v => v !== cat)
                                    return next.length === 0 ? ["All"] : next
                                  }
                                  return [...current, cat]
                                })
                              }}
                              className={`w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 transition-colors ${
                                isActive ? "text-primary" : "text-content-secondary hover:bg-surface-hover"
                              }`}
                            >
                              <div className={`w-3.5 h-3.5 border rounded flex items-center justify-center flex-shrink-0 ${
                                isActive ? "bg-primary border-primary" : "border-content-faint"
                              }`}>
                                {isActive && <Check size={8} className="text-white" />}
                              </div>
                              {cat}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => { haptic.light(); setShowSearch(prev => !prev) }}
                  className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${showSearch ? "bg-primary/15 text-primary" : "bg-surface-button text-content-muted hover:bg-surface-button-hover"}`}
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── Day Slider ── */}
            <div>
              <div
                ref={daySliderRef}
                className="flex gap-1.5 overflow-x-auto pt-2 pb-1.5"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
              >
                {sliderDays.map((day) => {
                  const isSelected = day.dateStr === fmtDate(selectedDate)
                  return (
                    <button
                      key={day.dateStr}
                      data-date={day.dateStr}
                      onClick={() => handleSliderDayClick(day)}
                      className={`flex flex-col items-center min-w-[3rem] px-2 py-1.5 rounded-xl transition-colors flex-shrink-0 relative ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-surface-hover text-content-primary hover:bg-surface-button border border-border"
                      }`}
                    >
                      <span className={`text-[9px] uppercase font-medium ${isSelected ? "text-white/70" : "text-content-faint"}`}>
                        {day.dayName}
                      </span>
                      <span className="text-base font-semibold leading-tight">{day.date}</span>
                      <span className={`text-[9px] ${isSelected ? "text-white/70" : "text-content-faint"}`}>
                        {day.monthShort}
                      </span>
                      {day.classCount > 0 && (
                        <span
                          className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full text-[9px] font-bold flex items-center justify-center px-1 leading-none ${
                            isSelected ? "bg-white text-primary" : "bg-primary text-white"
                          }`}
                        >
                          {day.classCount}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Search (collapsible) */}
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-faint" />
                <input
                  type="text"
                  placeholder="Search classes, trainers, rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-surface-hover border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-content-primary placeholder-content-faint focus:outline-none focus:border-primary transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* ── Class Cards ── */}
            {classesForDate.length === 0 ? (
              <SettingsCard>
                <div className="text-center py-12 text-content-muted">
                  <Timer className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-content-primary mb-2">No classes available</h3>
                  <p className="text-sm">No classes scheduled for this date{searchQuery ? " matching your search" : ""}</p>
                </div>
              </SettingsCard>
            ) : (
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                {classesForDate.map((cls) => {
                  const enrolled = isEnrolled(cls)
                  const full = isFull(cls)
                  const spots = spotsLeft(cls)

                  return (
                    <div
                      key={cls.id}
                      className="bg-surface-hover rounded-xl overflow-hidden border border-border transition-colors group cursor-pointer"
                      onClick={() => { haptic.light(); setInfoModalData(cls); setShowInfoModal(true) }}
                    >
                      {/* Image / Timer placeholder */}
                      <div className="relative aspect-video bg-surface-card">
                        {cls.image?.url ? (
                          <img
                            src={cls.image.url}
                            alt={cls.typeName}
                            className="w-full h-full object-cover"
                            draggable="false"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Timer className="w-12 h-12 text-content-faint" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Category badge */}
                        {cls.category && (
                          <div className="absolute top-3 left-3 px-2.5 py-1 bg-secondary backdrop-blur-sm text-white text-xs font-medium rounded-full">
                            {cls.category}
                          </div>
                        )}

                        {/* Enrolled / Full / Watching badge */}
                        {enrolled && (
                          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-primary backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Enrolled
                          </div>
                        )}
                        {full && !enrolled && isWatching(cls) && (
                          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-yellow-500/80 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1">
                            <BellRing className="w-3 h-3" /> Watching
                          </div>
                        )}
                        {full && !enrolled && !isWatching(cls) && (
                          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-red-500/80 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                            Full
                          </div>
                        )}

                        {/* Time overlay */}
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium rounded-lg flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {cls.startTime} – {cls.endTime}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-content-primary font-medium truncate mb-2">{cls.typeName}</h3>

                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-content-faint mb-2.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {cls.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {cls.room}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {cls.enrolledMembers?.length || 0}/{cls.maxParticipants}
                          </span>
                        </div>

                        {/* Trainer */}
                        <div className="flex items-center gap-2">
                          {cls.trainerImg ? (
                            <img src={cls.trainerImg} alt="" className="w-6 h-6 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] font-semibold flex-shrink-0"
                              style={{ backgroundColor: cls.trainerColor || "#6c5ce7" }}
                            >
                              {cls.trainerName?.split(" ").map(p => p.charAt(0)).join("").toUpperCase()}
                            </div>
                          )}
                          <span className="text-xs text-content-secondary">{cls.trainerName}</span>
                        </div>

                        {/* Spots bar */}
                        {!enrolled && !full && spots <= 5 && (
                          <div className="mt-2.5 flex items-center gap-1.5">
                            <div className="flex-1 h-1 bg-surface-card rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${((cls.enrolledMembers?.length || 0) / (cls.maxParticipants || 1)) * 100}%`,
                                  backgroundColor: spots <= 2 ? "#e17055" : "#fdcb6e",
                                }}
                              />
                            </div>
                            <span className={`text-[10px] font-medium ${spots <= 2 ? "text-red-400" : "text-yellow-400"}`}>
                              {spots} spot{spots !== 1 ? "s" : ""} left
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* MY CLASSES                                   */}
        {/* ============================================ */}
        {showMyClasses && (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto">
              {[
                { key: "upcoming", label: "Upcoming", count: myUpcomingClasses.length },
                { key: "past", label: "Past", count: myPastClasses.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { haptic.light(); setMyClassesView(tab.key) }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                    myClassesView === tab.key
                      ? "bg-primary text-white"
                      : "bg-surface-button text-content-muted hover:bg-surface-button-hover hover:text-content-primary"
                  }`}
                >
                  {tab.label}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center ${
                    myClassesView === tab.key ? "bg-white/20 text-white" : "bg-surface-hover text-content-faint"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {(myClassesView === "upcoming" ? myUpcomingClasses : myPastClasses).length === 0 ? (
              <SettingsCard>
                <div className="text-center py-12 text-content-muted">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium text-content-primary mb-2">
                    No {myClassesView} classes
                  </h3>
                  <p className="text-sm">
                    {myClassesView === "upcoming"
                      ? "You haven't enrolled in any upcoming classes yet"
                      : "Your past classes will appear here"}
                  </p>
                </div>
              </SettingsCard>
            ) : (
              <div className="space-y-3">
                {(myClassesView === "upcoming" ? myUpcomingClasses : myPastClasses)
                  .sort((a, b) => {
                    const da = `${a.date}T${a.startTime}`, db = `${b.date}T${b.startTime}`
                    return myClassesView === "upcoming" ? da.localeCompare(db) : db.localeCompare(da)
                  })
                  .map((cls) => (
                    <SettingsCard
                      key={cls.id}
                      className={`!p-4 ${myClassesView === "upcoming" && !cls.isCancelled ? "cursor-pointer active:bg-surface-card/50 transition-colors" : ""}`}
                      onClick={() => { if (myClassesView === "upcoming" && !cls.isCancelled) openActionSheet(cls) }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-1 self-stretch rounded-full flex-shrink-0"
                          style={{ backgroundColor: cls.color || "#6c5ce7" }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <h3 className="text-sm font-medium text-content-primary truncate">{cls.typeName}</h3>
                                {cls.isCancelled && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/15 text-red-400">Cancelled</span>
                                )}
                                {cls.isPast && !cls.isCancelled && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-button text-content-faint">Completed</span>
                                )}
                              </div>
                              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-content-faint">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {fmtDateDisplay(cls.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {cls.startTime} – {cls.endTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {cls.room}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <div
                                  className="w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-semibold flex-shrink-0"
                                  style={{ backgroundColor: cls.trainerColor || "#6c5ce7" }}
                                >
                                  {cls.trainerName?.split(" ").map(p => p.charAt(0)).join("").toUpperCase()}
                                </div>
                                <span className="text-xs text-content-secondary">{cls.trainerName}</span>
                              </div>
                            </div>
                        </div>
                      </div>
                    </SettingsCard>
                  ))}
              </div>
            )}
          </div>
        )}
      </PullToRefresh>

      {/* Modals */}
      <ClassEnrollModal
        show={showEnrollModal}
        onClose={() => { setShowEnrollModal(false); setSelectedClass(null) }}
        onConfirm={confirmEnroll}
        classData={selectedClass}
      />
      <ClassCancelModal
        show={showCancelModal}
        onClose={() => { setShowCancelModal(false); setClassToCancel(null) }}
        onConfirm={confirmCancel}
        classData={classToCancel}
      />

      {/* ============================================ */}
      {/* MY CLASS ACTION SHEET                        */}
      {/* ============================================ */}
      {actionSheetClass && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setActionSheetClass(null)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative bg-surface-card rounded-t-2xl w-full max-w-lg"
            style={{ marginBottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px))" }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              e.currentTarget._startY = e.touches[0].clientY
              e.currentTarget._currentY = e.touches[0].clientY
              e.currentTarget.style.transition = "none"
            }}
            onTouchMove={(e) => {
              const dy = e.touches[0].clientY - e.currentTarget._startY
              e.currentTarget._currentY = e.touches[0].clientY
              if (dy > 0) {
                e.currentTarget.style.transform = `translateY(${dy}px)`
              }
            }}
            onTouchEnd={(e) => {
              const dy = e.currentTarget._currentY - e.currentTarget._startY
              e.currentTarget.style.transition = "transform 0.2s ease-out"
              if (dy > 80) {
                e.currentTarget.style.transform = "translateY(100%)"
                setTimeout(() => setActionSheetClass(null), 200)
              } else {
                e.currentTarget.style.transform = "translateY(0)"
              }
            }}
          >
            {/* Handle bar */}
            <div className="w-10 h-1 bg-surface-hover rounded-full mx-auto mt-3 mb-2" />

            {/* Class info header */}
            <div className="px-4 pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: actionSheetClass.color || "#6c5ce7" }}
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-content-primary truncate">{actionSheetClass.typeName}</h4>
                  <p className="text-xs text-content-faint">
                    {fmtDateDisplay(actionSheetClass.date)} · {actionSheetClass.startTime} – {actionSheetClass.endTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 pb-4 space-y-1">
              <button
                onClick={() => addToCalendar(actionSheetClass)}
                className="w-full text-left px-4 py-3.5 hover:bg-surface-hover active:bg-surface-hover rounded-xl text-content-primary flex items-center gap-3 transition-colors"
              >
                <CalendarPlus className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Add to Calendar</p>
                  <p className="text-xs text-content-faint">Save to your device calendar</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setActionSheetClass(null)
                  handleCancelEnrollment(actionSheetClass)
                }}
                className="w-full text-left px-4 py-3.5 hover:bg-red-500/10 active:bg-red-500/10 rounded-xl text-red-400 flex items-center gap-3 transition-colors"
              >
                <X className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Cancel Enrollment</p>
                  <p className="text-xs text-red-400/60">Free up your spot for others</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* CALENDAR SHEET (after enrollment)            */}
      {/* ============================================ */}
      {calendarSheetClass && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setCalendarSheetClass(null)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative bg-surface-card rounded-t-2xl w-full max-w-lg"
            style={{ marginBottom: "calc(3.5rem + env(safe-area-inset-bottom, 0px))" }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              e.currentTarget._startY = e.touches[0].clientY
              e.currentTarget._currentY = e.touches[0].clientY
              e.currentTarget.style.transition = "none"
            }}
            onTouchMove={(e) => {
              const dy = e.touches[0].clientY - e.currentTarget._startY
              e.currentTarget._currentY = e.touches[0].clientY
              if (dy > 0) {
                e.currentTarget.style.transform = `translateY(${dy}px)`
              }
            }}
            onTouchEnd={(e) => {
              const dy = e.currentTarget._currentY - e.currentTarget._startY
              e.currentTarget.style.transition = "transform 0.2s ease-out"
              if (dy > 80) {
                e.currentTarget.style.transform = "translateY(100%)"
                setTimeout(() => setCalendarSheetClass(null), 200)
              } else {
                e.currentTarget.style.transform = "translateY(0)"
              }
            }}
          >
            <div className="w-10 h-1 bg-surface-hover rounded-full mx-auto mt-3 mb-2" />

            <div className="px-4 pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-10 rounded-full flex-shrink-0"
                  style={{ backgroundColor: calendarSheetClass.color || "#6c5ce7" }}
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-content-primary truncate">{calendarSheetClass.typeName}</h4>
                  <p className="text-xs text-content-faint">
                    {fmtDateDisplay(calendarSheetClass.date)} · {calendarSheetClass.startTime} – {calendarSheetClass.endTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 pb-4">
              <button
                onClick={() => {
                  const cls = calendarSheetClass
                  setCalendarSheetClass(null)
                  addToCalendar(cls)
                }}
                className="w-full text-left px-4 py-3.5 hover:bg-surface-hover active:bg-surface-hover rounded-xl text-content-primary flex items-center gap-3 transition-colors"
              >
                <CalendarPlus className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Add to Calendar</p>
                  <p className="text-xs text-content-faint">Save to your device calendar</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Classes
