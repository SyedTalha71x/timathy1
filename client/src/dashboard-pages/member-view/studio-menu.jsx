/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import ImprintPopup from "../../components/member-panel-components/studio-menu-components/ImprintPopup"
import TermsPopup from "../../components/member-panel-components/studio-menu-components/TermsPopup"
import PrivacyPopup from "../../components/member-panel-components/studio-menu-components/PrivacyPopup"
import PaymentMethodPopup from "../../components/member-panel-components/studio-menu-components/PaymentMethodPopup"
import CancelMembershipPopup from "../../components/member-panel-components/studio-menu-components/CancelMembershipPopup"
import IdlePeriodFormPopup from "../../components/member-panel-components/studio-menu-components/IdlePeriodFormPopup"
import { useDispatch, useSelector } from "react-redux"
import { updateUserData } from "../../features/auth/authSlice"
import DatePickerField from "../../components/shared/DatePickerField"
import CustomSelect from "../../components/shared/CustomSelect"
import useCountries from "../../hooks/useCountries"
import { Capacitor } from "@capacitor/core"
import { haptic } from "../../utils/haptic"

// import { fetchMyStudio } from "../../features/studio/studioSlice"
const StudioMenu = () => {
  const { user } = useSelector((state) => state.auth)
  const { studio } = useSelector((state) => state.studios);

  const dispatch = useDispatch();
  const { countries, loading: countriesLoading } = useCountries();
  const [activeSection, setActiveSection] = useState("info")
  const [showImprintPopup, setShowImprintPopup] = useState(false)
  const [showTermsPopup, setShowTermsPopup] = useState(false)
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false)
  const [showPaymentMethodPopup, setShowPaymentMethodPopup] = useState(false)
  const [showCancelMembershipPopup, setShowCancelMembershipPopup] = useState(false)
  const [showIdlePeriodForm, setShowIdlePeriodForm] = useState(false)

  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const [checkInHistory, setCheckInHistory] = useState([
    { date: "2025-01-26", time: "09:15", status: "success" },
    { date: "2025-01-25", time: "18:30", status: "success" },
    { date: "2025-01-24", time: "07:45", status: "success" },
  ])

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const scannerRef = useRef(null)
  const tabBarRef = useRef(null)

  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [isEditingContact, setIsEditingContact] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [expandedSection, setExpandedSection] = useState(null)

  const [personalData, setPersonalData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
  })

  const [addressData, setAddressData] = useState({
    street: "",
    houseNumber: "",
    zipCode: "",
    city: "",
    country: "",
  })

  const [contactData, setContactData] = useState({
    email: "",
    phone: "",
    telephoneNumber: "",
  })
  useEffect(() => {
    if (user) {
      // Personal info
      setPersonalData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "Male",
      });

      // Address info
      setAddressData({
        street: user.street || "",
        houseNumber: user.houseNumber || "",
        zipCode: user.zipCode || "",
        city: user.city || "",
        country: user.country || "",
      });

      // Contact info
      setContactData({
        email: user.email || "",
        phone: user.phone || "",
        telephoneNumber: user.telephoneNumber || "",
      });
    }
  }, [user]);


  // Add state for viewing post image in full resolution
  const [viewingPost, setViewingPost] = useState(null)

  const [messages, setMessages] = useState([
    {
      id: 1,
      title: "Holiday Schedule",
      content: "We will have special opening hours during the holiday season. Please check the updated schedule.",
      date: "2025-01-20",
      type: "info",
      priority: "medium",
      image: "https://e7.pngegg.com/pngimages/440/166/png-clipart-public-holiday-samsung-galaxy-s6-edge-android-android-text-calendar.png"
    },
    {
      id: 2,
      title: "New Equipment Arrived!",
      content: "Check out our new cardio machines in the main workout area. We've added 5 new treadmills, 3 elliptical trainers, and a complete set of free weights.",
      date: "2025-01-18",
      type: "update",
      priority: "high",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3pCKrt2I8JSBOv4piL9p1FEadf2zvwD-eOA&s"
    },
    {
      id: 3,
      title: "Maintenance Notice",
      content: "The swimming pool will be closed for maintenance on January 25th from 8:00 AM to 2:00 PM. We apologize for any inconvenience.",
      date: "2025-01-15",
      type: "maintenance",
      priority: "medium",
      image: "https://www.shutterstock.com/image-vector/under-maintenance-stripes-caution-sign-260nw-2517500739.jpg"
    },
    {
      id: 4,
      title: "Yoga Class Update",
      content: "New yoga classes starting next week. Sign up at the front desk! Morning classes at 7 AM and evening classes at 6 PM.",
      date: "2025-01-12",
      type: "class",
      priority: "low",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLkR_cD_bdePwOvW_Ondondo2eM3Wytmf5aw&s"
    }
  ])

  // studio data fetching
  // useEffect(() => {
  //   dispatch(fetchMyStudio())
  // }, [dispatch]);


  // Map message type to solid tag color (matches studio bulletin tag style)
  const getTypeColor = (type) => {
    switch (type) {
      case 'info': return '#3b82f6'
      case 'update': return '#22c55e'
      case 'maintenance': return '#eab308'
      case 'class': return '#a855f7'
      default: return '#f97316'
    }
  }

  // Preview modal — matches ViewBulletinBoard.jsx layout
  const PostPreviewModal = () => {
    if (!viewingPost) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-surface-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header — close button */}
          <div className="flex items-center justify-end p-4 border-b border-border">
            <button
              onClick={() => setViewingPost(null)}
              className="text-content-muted hover:text-content-primary transition-colors p-1 flex-shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            {/* Cover Image */}
            {viewingPost.image && (
              <div className="relative rounded-xl overflow-hidden border border-border mb-4 bg-surface-dark aspect-video">
                <img
                  src={viewingPost.image}
                  alt="Post cover"
                  className="w-full h-full object-contain pointer-events-none"
                  draggable="false"
                />
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl font-semibold text-content-primary mb-3">{viewingPost.title}</h2>

            {/* Tag */}
            <div className="flex gap-1 flex-wrap mb-4">
              <span
                className="text-[10px] px-1.5 py-0.5 rounded text-white"
                style={{ backgroundColor: getTypeColor(viewingPost.type) }}
              >
                {viewingPost.type}
              </span>
            </div>

            {/* Content */}
            <div className="border border-border rounded-xl p-4">
              <p className="text-content-secondary text-sm leading-normal">{viewingPost.content}</p>
            </div>

            {/* Date */}
            <p className="text-xs text-content-faint mt-3">{viewingPost.date}</p>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-4 border-t border-border">
            <button
              onClick={() => setViewingPost(null)}
              className="px-5 py-2 bg-surface-button hover:bg-surface-button-hover text-content-primary rounded-xl text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============================================
  // Check-in handlers (unchanged)
  // ============================================
  const startScanning = async () => {
    try {
      setCameraError(null)
      setIsScanning(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        scanForQRCode()
      }
    } catch (error) {
      setIsScanning(false)

      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        // Native prompt with Settings button
        if (Capacitor.isNativePlatform()) {
          const goToSettings = window.confirm(
            "Camera access is required for QR check-in.\n\nWould you like to open Settings to enable it?"
          )
          if (goToSettings) {
            window.open("app-settings:", "_self")
          }
        } else {
          setCameraError("denied")
        }
      } else {
        setCameraError("Camera is not available on this device")
      }
    }
  }

  const openAppSettings = () => {
    if (Capacitor.isNativePlatform()) {
      // Opens the iOS/Android app settings page directly
      window.open("app-settings:", "_self")
    }
  }

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
    if (scannerRef.current) {
      clearInterval(scannerRef.current)
    }
  }

  const scanForQRCode = () => {
    scannerRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current
        const video = videoRef.current
        const context = canvas.getContext("2d")

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

        setTimeout(() => {
          if (isScanning) {
            handleSuccessfulScan("FITZONE_CHECKIN_" + Date.now())
          }
        }, 3000)
      }
    }, 100)
  }

  const handleSuccessfulScan = (qrData) => {
    haptic.success()
    setScanResult(qrData)
    stopScanning()

    const now = new Date()
    const newCheckIn = {
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().slice(0, 5),
      status: "success",
    }
    setCheckInHistory((prev) => [newCheckIn, ...prev])

    alert("Check-in successful! Welcome to FitZone Studio!")
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, []);

  // ============================================
  // Member data handlers (unchanged)
  // ============================================
  const handlePersonalDataChange = (field, value) => {
    setPersonalData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressDataChange = (field, value) => {
    setAddressData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactDataChange = (field, value) => {
    setContactData(prev => ({ ...prev, [field]: value }));
  };

  const handlePersonalDataSubmit = () => {
    dispatch(updateUserData(personalData))
      .unwrap()
      .then(() => {
        alert("Personal data updated successfully!");
        setIsEditingPersonal(false);
      })
      .catch((err) => {
        console.error("Update error:", err);
        alert("Failed to update personal data: " + (err?.message || JSON.stringify(err)));
      });
  };

  const handleAddressDataSubmit = () => {
    dispatch(updateUserData(addressData))
      .unwrap()
      .then(() => {
        alert("Address data updated successfully!");
        setIsEditingAddress(false);
      })
      .catch((err) => {
        alert("Failed to update address data: " + (err?.message || JSON.stringify(err)));
      });
  };

  const handleContactDataSubmit = () => {
    dispatch(updateUserData(contactData))
      .unwrap()
      .then(() => {
        alert("Contact data updated successfully!");
        setIsEditingContact(false);
      })
      .catch((err) => {
        alert("Failed to update contact data: " + (err?.message || JSON.stringify(err)));
      });
  };

  const studioAddress = `${studio?.street}, ${studio?.zipCode} ${studio?.city}, ${studio?.country}`;

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(studio?.phone || "")
      setCopiedPhone(true)
      setTimeout(() => setCopiedPhone(false), 2000)
    } catch (err) { console.error('Copy failed:', err) }
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(studio?.email || "")
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } catch (err) { console.error('Copy failed:', err) }
  }

  // ============================================
  // Reusable sub-components
  // ============================================

  /** Form field — matches EditMemberModal input style */
  const FormField = ({ label, type = "text", value, onChange, required, placeholder }) => (
    <div>
      <label className="text-sm text-content-secondary block mb-2">{label}{required && <span className="text-accent-red ml-1">*</span>}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
      />
    </div>
  )

  /** Form action buttons — matches EditMemberModal footer */
  const FormActions = ({ onSave, onCancel }) => (
    <div className="flex justify-end gap-2 pt-4 mt-auto flex-shrink-0">
      <button type="button" onClick={onCancel} className="px-4 py-2 text-sm bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors">
        Cancel
      </button>
      <button type="button" onClick={onSave} className="px-4 py-2 text-sm text-white rounded-xl bg-primary hover:bg-primary-hover transition-colors">
        Request Change
      </button>
    </div>
  )

  /** Section card wrapper */
  const Card = ({ children, className = "" }) => (
    <div className={`bg-surface-card rounded-xl p-4 sm:p-5 md:p-6 shadow-lg border border-border ${className}`}>
      {children}
    </div>
  )

  /** Section heading with icon */
  const SectionHeading = ({ icon, children, className = "" }) => (
    <h3 className={`text-base sm:text-lg font-bold text-content-primary flex items-center ${className}`}>
      <span className="mr-2 text-primary flex-shrink-0">{icon}</span>
      {children}
    </h3>
  )

  // ============================================
  // Tab definitions
  // ============================================
  const tabs = [
    { key: "info", label: "Studio Info" },
    { key: "checkin", label: "Check-in" },
    { key: "bulletin", label: "Bulletin Board" },
    { key: "data", label: "Self-Service" },
  ]

  return (
    <div className="flex flex-col h-full bg-surface-base text-content-primary overflow-hidden rounded-3xl select-none">
      <PostPreviewModal />

      {/* ===== TAB NAVIGATION — sticky ===== */}
      <div className="flex-shrink-0 px-2 md:px-6 pt-2 md:pt-6">
        <div ref={tabBarRef} className="flex border-b border-border overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
          <div className="flex min-w-max w-full">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                data-tab={tab.key}
                onClick={() => {
                  haptic.light()
                  setActiveSection(tab.key)
                  // Auto-scroll tab into view
                  requestAnimationFrame(() => {
                    const btn = tabBarRef.current?.querySelector(`[data-tab="${tab.key}"]`)
                    btn?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
                  })
                }}
                className={`flex-1 min-w-[80px] py-2.5 sm:py-3 px-3 sm:px-4 text-center font-medium text-xs sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap ${activeSection === tab.key
                    ? "text-content-primary border-b-2 border-primary"
                    : "text-content-muted hover:text-content-primary hover:bg-surface-hover"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== TAB CONTENT — scrollable ===== */}
      <div className="flex-1 overflow-y-auto p-2 md:p-6 pt-4 sm:pt-6">

        {/* ============================================================
            TAB: STUDIO INFO
            Desktop: Map full → 2-col (Hours | Contact) → Legal row
            Mobile: Map → Hours → Contact → Legal
        ============================================================ */}
        {activeSection === "info" && (
          <div className="space-y-4 sm:space-y-5">

            {/* Map */}
            <Card className="overflow-hidden !p-0">
              <div className="relative h-48 sm:h-56 md:h-72">
                {studio && (
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(studioAddress)}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
                  <p className="text-sm font-semibold">{studio?.street}</p>
                  <p className="text-xs text-content-secondary">{studio?.zipCode} {studio?.city}</p>
                </div>
              </div>
            </Card>

            {/* Opening Hours + Contact — side by side on desktop */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Opening Hours */}
              <Card>
                <SectionHeading
                  className="mb-3"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  }
                >
                  Opening Hours
                </SectionHeading>
                <div className="space-y-1.5">
                  {studio?.openingHours?.map((dayObj, index) => {
                    const todayIndex = new Date().getDay();
                    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    const isToday = dayObj.day === days[todayIndex];

                    return (
                      <div
                        key={index}
                        className={`flex justify-between items-center py-2 px-3 rounded-lg text-sm ${isToday ? "bg-orange-500/20 border border-orange-500/30" : "bg-surface-hover"
                          }`}
                      >
                        <span className={`font-medium ${isToday ? "text-orange-400" : "text-content-secondary"}`}>
                          {dayObj.day}
                          {isToday && (
                            <span className="ml-2 text-[10px] bg-orange-500 px-1.5 py-0.5 rounded-full text-white">
                              Today
                            </span>
                          )}
                        </span>
                        {/* <span className={isToday ? "text-orange-300" : "text-content-muted"}>
                          {dayObj.open} - {dayObj.close}
                        </span> */}
                        <span className={isToday ? "text-orange-300" : "text-content-muted"}>
                          {dayObj.isClosed ? <span className="text-xs text-red-400">Closed</span> : `${dayObj.open} - ${dayObj.close}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Contact Info */}
              <Card>
                <SectionHeading
                  className="mb-3"
                  icon={
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                  }
                >
                  Contact
                </SectionHeading>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-surface-hover rounded-lg p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                      <span className="text-content-primary text-sm break-all">{studio?.phone || "+49 30 1234 5678"}</span>
                    </div>
                    <button
                      onClick={handleCopyPhone}
                      className="p-1.5 hover:bg-surface-button rounded transition-colors flex-shrink-0 ml-2"
                      title="Copy phone"
                    >
                      {copiedPhone ? (
                        <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 text-content-muted hover:text-content-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-surface-hover rounded-lg p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                      <span className="text-content-primary text-sm break-all">{studio?.email || "info@fitzonestudio.de"}</span>
                    </div>
                    <button
                      onClick={handleCopyEmail}
                      className="p-1.5 hover:bg-surface-button rounded transition-colors flex-shrink-0 ml-2"
                      title="Copy email"
                    >
                      {copiedEmail ? (
                        <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 text-content-muted hover:text-content-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-3 bg-surface-hover rounded-lg p-3">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span className="text-content-primary text-sm">{studio?.street}, {studio?.zipCode} {studio?.city}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Legal links — compact horizontal */}
            <Card className="!py-3 !px-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Imprint", action: () => setShowImprintPopup(true) },
                  { label: "Terms & Conditions", action: () => setShowTermsPopup(true) },
                  { label: "Privacy Policy", action: () => setShowPrivacyPopup(true) },
                ].map((link, i) => (
                  <button
                    key={i}
                    onClick={link.action}
                    className="text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                  >
                    {link.label}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {i < 2 && <span className="text-border ml-2 mr-1">|</span>}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ============================================================
            TAB: CHECK-IN
            QR Scanner + Check-in History
        ============================================================ */}
        {activeSection === "checkin" && (
          <div className="grid gap-4 md:grid-cols-2">
            {/* QR Scanner */}
            <Card>
              <SectionHeading
                className="mb-4"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                }
              >
                QR Code Check-in
              </SectionHeading>

              {!isScanning ? (
                <div className="text-center py-4">
                  <svg className="w-16 h-16 text-content-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p className="text-content-secondary mb-1 text-sm">Scan the QR code at the studio entrance</p>
                  <p className="text-content-muted text-xs mb-5">Make sure to allow camera access when prompted</p>

                  {cameraError && (
                    <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-4 mb-4">
                      {cameraError === "denied" ? (
                        <div className="text-center">
                          <p className="text-red-400 text-sm mb-1">Camera access was denied</p>
                          <p className="text-content-muted text-xs mb-3">Enable camera access in your device settings to use the scanner</p>
                          {Capacitor.isNativePlatform() && (
                            <button
                              onClick={openAppSettings}
                              className="bg-surface-button hover:bg-surface-button-hover text-content-primary px-4 py-2 rounded-xl text-sm transition-colors"
                            >
                              Open Settings
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-red-400 text-xs sm:text-sm text-center">{cameraError}</p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={startScanning}
                    className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg transition-colors inline-flex items-center text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Start Scanner
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                    <video ref={videoRef} className="w-full h-48 sm:h-56 md:h-64 object-cover" playsInline muted />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-36 h-36 sm:w-48 sm:h-48 border-2 border-orange-500 rounded-lg relative">
                        <div className="absolute top-0 left-0 w-5 h-5 sm:w-6 sm:h-6 border-t-4 border-l-4 border-orange-500"></div>
                        <div className="absolute top-0 right-0 w-5 h-5 sm:w-6 sm:h-6 border-t-4 border-r-4 border-orange-500"></div>
                        <div className="absolute bottom-0 left-0 w-5 h-5 sm:w-6 sm:h-6 border-b-4 border-l-4 border-orange-500"></div>
                        <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 border-b-4 border-r-4 border-orange-500"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-content-secondary mb-4 text-sm">Position the QR code within the frame</p>
                  <button
                    onClick={stopScanning}
                    className="bg-surface-button hover:bg-surface-button-hover text-content-primary px-6 py-2 rounded-lg transition-colors text-sm"
                  >
                    Cancel Scan
                  </button>
                </div>
              )}
            </Card>

            {/* Check-in History */}
            <Card>
              <SectionHeading
                className="mb-4"
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
                  </svg>
                }
              >
                Recent Check-ins
              </SectionHeading>

              {checkInHistory.length > 0 ? (
                <div className="space-y-2">
                  {checkInHistory.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between bg-surface-hover rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-content-primary text-sm font-medium">{entry.date}</p>
                          <p className="text-content-muted text-xs">{entry.time}</p>
                        </div>
                      </div>
                      <span className="text-white text-xs bg-primary px-2 py-1 rounded">Success</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-content-muted text-sm text-center py-6">No check-ins yet</p>
              )}
            </Card>
          </div>
        )}

        {/* ============================================================
            TAB: BULLETIN BOARD
            Matches studio bulletin-board.jsx card design exactly
        ============================================================ */}
        {activeSection === "bulletin" && (
          <div>
            {messages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-fr">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="bg-surface-hover rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-border p-4 md:p-6 relative flex flex-col h-full select-none"
                  >
                    {/* Cover Image — full bleed, matches studio card */}
                    {message.image && (
                      <div className="relative mb-4 rounded-lg overflow-hidden border border-border -mx-4 -mt-4 md:-mx-6 md:-mt-6 rounded-t-xl rounded-b-none aspect-video bg-surface-dark">
                        <img
                          src={message.image}
                          alt={message.title}
                          className="w-full h-full object-contain pointer-events-none"
                          draggable="false"
                        />
                      </div>
                    )}

                    {/* Title */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base md:text-lg font-semibold text-content-primary line-clamp-2 leading-snug break-words">{message.title}</h3>
                    </div>

                    {/* Tag — solid color + white text, like studio */}
                    <div className="flex gap-1 flex-wrap mb-2">
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: getTypeColor(message.type) }}
                      >
                        {message.type}
                      </span>
                    </div>

                    {/* Content Preview */}
                    <p className={`text-xs md:text-sm text-content-muted break-words ${message.image ? 'line-clamp-3' : 'line-clamp-[8]'}`}>
                      {message.content}
                    </p>

                    {/* Date + Eye icon — same line */}
                    <div className="flex items-center justify-between mt-auto pt-3">
                      <p className="text-[11px] text-content-faint">
                        {message.date}
                      </p>
                      <button
                        onClick={() => setViewingPost(message)}
                        className="text-content-muted hover:text-primary p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
                        title="Preview Post"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-content-faint mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-content-muted text-sm">No announcements at the moment.</p>
                  <p className="text-content-faint text-xs mt-1">Check back later for updates!</p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ============================================================
            TAB: Self-Service
            Summary → 2-col (Contract | Membership) → Personal Data
        ============================================================ */}
        {activeSection === "data" && (
          <div className="space-y-4 sm:space-y-5">

            {/* Member summary strip */}
            <Card className="!py-3 !px-4 sm:!px-6">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-content-muted text-xs">Member Number</p>
                  <p className="text-content-primary font-mono text-sm font-medium">{user?.memberNumber}</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-content-muted text-xs">Member Since</p>
                  <p className="text-content-primary text-sm font-medium">
                    {new Date(user?.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>
            </Card>

            {/* Contract + Idle Periods — side by side on desktop */}
            <div className="grid gap-4 md:grid-cols-2">

              {/* Contract Information */}
              <Card>
                <SectionHeading
                  className="mb-4"
                  icon={
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                  }
                >
                  Contract
                </SectionHeading>

                <div className="space-y-2">
                  <div className="flex justify-between bg-surface-hover rounded-lg p-2.5">
                    <span className="text-content-muted text-xs">Type</span>
                    <span className="text-content-primary text-sm">Premium Annual</span>
                  </div>
                  <div className="flex justify-between bg-surface-hover rounded-lg p-2.5">
                    <span className="text-content-muted text-xs">Status</span>
                    <span className="flex items-center text-green-400 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between bg-surface-hover rounded-lg p-2.5">
                    <span className="text-content-muted text-xs">Start Date</span>
                    <span className="text-content-primary text-sm">January 15, 2025</span>
                  </div>
                  <div className="flex justify-between bg-surface-hover rounded-lg p-2.5">
                    <span className="text-content-muted text-xs">Fee</span>
                    <span className="text-content-primary text-sm font-bold">€79.99/month</span>
                  </div>
                  <div className="flex justify-between bg-surface-hover rounded-lg p-2.5">
                    <span className="text-content-muted text-xs">Duration</span>
                    <span className="text-content-primary text-sm">12 months</span>
                  </div>
                  <div className="flex justify-between bg-surface-hover rounded-lg p-2.5">
                    <span className="text-content-muted text-xs">Notice Period</span>
                    <span className="text-content-primary text-sm">1 month</span>
                  </div>
                  <div className="flex justify-between bg-surface-hover rounded-lg p-2.5">
                    <span className="text-content-muted text-xs">Last Cancellation</span>
                    <span className="text-content-primary text-sm">December 15, 2025</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <button className="flex items-center text-primary hover:text-primary-hover transition-colors text-xs">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                    View Contract
                  </button>
                  <button
                    onClick={() => setShowPaymentMethodPopup(true)}
                    className="flex items-center text-primary hover:text-primary-hover transition-colors text-xs"
                  >
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                    </svg>
                    Payment Method
                  </button>
                </div>

                <button
                  onClick={() => setShowCancelMembershipPopup(true)}
                  className="text-content-faint hover:text-red-400 text-xs transition-colors mt-3 flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Cancel Membership
                </button>
              </Card>

              {/* Idle Periods */}
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <SectionHeading
                    icon={
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                      </svg>
                    }
                  >
                    Idle Periods
                  </SectionHeading>
                  <button
                    onClick={() => setShowIdlePeriodForm(true)}
                    className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-lg transition-colors text-xs"
                  >
                    Apply
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="bg-surface-hover rounded-lg p-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-content-primary font-medium text-sm">Current Idle Period</p>
                        <p className="text-content-muted text-xs mt-0.5">Vacation — Jan 20 to Feb 5, 2025</p>
                      </div>
                      <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-xs flex-shrink-0">Active</span>
                    </div>
                  </div>

                  <div className="bg-surface-hover rounded-lg p-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-content-primary font-medium text-sm">Past Idle Period</p>
                        <p className="text-content-muted text-xs mt-0.5">Medical — Dec 1 to Dec 15, 2024</p>
                      </div>
                      <span className="bg-surface-button/20 text-content-muted px-2 py-0.5 rounded text-xs flex-shrink-0">Completed</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Personal Information */}
            <Card>
              <SectionHeading
                className="mb-4"
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                  </svg>
                }
              >
                Personal Information
              </SectionHeading>

              <div className="space-y-1">
                {/* Personal Data — collapsible */}
                <button
                  onClick={() => setExpandedSection(expandedSection === "personal" ? null : "personal")}
                  className="flex justify-between items-center w-full py-3 px-4 bg-surface-hover rounded-xl hover:bg-surface-button-hover transition-colors group"
                >
                  <div className="flex items-center">
                    <span className="text-content-primary text-sm font-medium">Personal Data</span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-content-muted transition-transform ${expandedSection === "personal" ? "rotate-90" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {expandedSection === "personal" && (
                  <div className="px-4 pb-3 pt-2 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-surface-hover rounded-lg p-2.5">
                        <p className="text-content-muted text-[11px]">First Name</p>
                        <p className="text-content-primary text-sm">{user?.firstName || "—"}</p>
                      </div>
                      <div className="bg-surface-hover rounded-lg p-2.5">
                        <p className="text-content-muted text-[11px]">Last Name</p>
                        <p className="text-content-primary text-sm">{user?.lastName || "—"}</p>
                      </div>
                      <div className="bg-surface-hover rounded-lg p-2.5">
                        <p className="text-content-muted text-[11px]">Date of Birth</p>
                        <p className="text-content-primary text-sm">
                          {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                        </p>
                      </div>
                      <div className="bg-surface-hover rounded-lg p-2.5">
                        <p className="text-content-muted text-[11px]">Gender</p>
                        <p className="text-content-primary text-sm">{user?.gender || "—"}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditingPersonal(true)}
                      className="text-xs text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit Personal Data
                    </button>
                  </div>
                )}

                {/* Address — collapsible */}
                <button
                  onClick={() => setExpandedSection(expandedSection === "address" ? null : "address")}
                  className="flex justify-between items-center w-full py-3 px-4 bg-surface-hover rounded-xl hover:bg-surface-button-hover transition-colors group"
                >
                  <div className="flex items-center">
                    <span className="text-content-primary text-sm font-medium">Address</span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-content-muted transition-transform ${expandedSection === "address" ? "rotate-90" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {expandedSection === "address" && (
                  <div className="px-4 pb-3 pt-2 space-y-3">
                    <div className="bg-surface-hover rounded-lg p-2.5">
                      <p className="text-content-primary text-sm">
                        {user?.street && user?.houseNumber ? `${user.street} ${user.houseNumber}` : user?.street || "—"}
                      </p>
                      <p className="text-content-muted text-xs mt-0.5">
                        {user?.zipCode || ""} {user?.city || ""}{user?.country ? `, ${user.country}` : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="text-xs text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit Address
                    </button>
                  </div>
                )}

                {/* Contact — collapsible */}
                <button
                  onClick={() => setExpandedSection(expandedSection === "contact" ? null : "contact")}
                  className="flex justify-between items-center w-full py-3 px-4 bg-surface-hover rounded-xl hover:bg-surface-button-hover transition-colors group"
                >
                  <div className="flex items-center">
                    <span className="text-content-primary text-sm font-medium">Contact Details</span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-content-muted transition-transform ${expandedSection === "contact" ? "rotate-90" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {expandedSection === "contact" && (
                  <div className="px-4 pb-3 pt-2 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="bg-surface-hover rounded-lg p-2.5">
                        <p className="text-content-muted text-[11px]">Email</p>
                        <p className="text-content-primary text-sm break-all">{user?.email || "—"}</p>
                      </div>
                      <div className="bg-surface-hover rounded-lg p-2.5">
                        <p className="text-content-muted text-[11px]">Mobile Number</p>
                        <p className="text-content-primary text-sm">{user?.phone || "—"}</p>
                      </div>
                      <div className="bg-surface-hover rounded-lg p-2.5">
                        <p className="text-content-muted text-[11px]">Telephone Number</p>
                        <p className="text-content-primary text-sm">{user?.telephoneNumber || "—"}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditingContact(true)}
                      className="text-xs text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit Contact Details
                    </button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* ===== POPUPS ===== */}
      {showImprintPopup && <ImprintPopup onClose={() => setShowImprintPopup(false)} studio={studio} />}
      {showTermsPopup && <TermsPopup onClose={() => setShowTermsPopup(false)} studio={studio} />}
      {showPrivacyPopup && <PrivacyPopup onClose={() => setShowPrivacyPopup(false)} studio={studio} />}

      <PaymentMethodPopup show={showPaymentMethodPopup} onClose={() => setShowPaymentMethodPopup(false)} />
      <CancelMembershipPopup show={showCancelMembershipPopup} onClose={() => setShowCancelMembershipPopup(false)} />
      <IdlePeriodFormPopup show={showIdlePeriodForm} onClose={() => setShowIdlePeriodForm(false)} />

      {/* Edit Personal Data Popup — matches EditMemberModal */}
      {isEditingPersonal && (
        <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-50 overflow-y-auto">
          <div className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-md my-4 md:my-8 relative max-h-[95vh] md:max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-content-primary font-bold">Edit Personal Data</h2>
              <button onClick={() => setIsEditingPersonal(false)} className="text-content-muted hover:text-content-primary transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
              <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Personal Information</div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="First Name" value={personalData.firstName} onChange={(e) => handlePersonalDataChange("firstName", e.target.value)} required />
                <FormField label="Last Name" value={personalData.lastName} onChange={(e) => handlePersonalDataChange("lastName", e.target.value)} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-content-secondary block mb-2">Gender</label>
                  <CustomSelect
                    name="gender"
                    value={personalData.gender || ""}
                    onChange={(e) => handlePersonalDataChange("gender", e.target.value)}
                    placeholder="Select gender"
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </div>
                <div>
                  <label className="text-sm text-content-secondary block mb-2">Birthday</label>
                  <div className="w-full flex items-center justify-between bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent">
                    <span className={personalData.dateOfBirth ? "text-content-primary" : "text-content-faint"}>
                      {personalData.dateOfBirth
                        ? (() => { const [y, m, d] = (personalData.dateOfBirth || "").split('-'); return `${d}.${m}.${y}` })()
                        : "Select date"}
                    </span>
                    <DatePickerField
                      value={personalData.dateOfBirth || ""}
                      onChange={(val) => handlePersonalDataChange("dateOfBirth", val)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <FormActions onSave={handlePersonalDataSubmit} onCancel={() => setIsEditingPersonal(false)} />
          </div>
        </div>
      )}

      {/* Edit Address Popup — matches EditMemberModal */}
      {isEditingAddress && (
        <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-50 overflow-y-auto">
          <div className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-md my-4 md:my-8 relative max-h-[95vh] md:max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-content-primary font-bold">Edit Address</h2>
              <button onClick={() => setIsEditingAddress(false)} className="text-content-muted hover:text-content-primary transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
              <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Address</div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Street" value={addressData.street} onChange={(e) => handleAddressDataChange("street", e.target.value)} placeholder="Main Street" />
                <FormField label="House Number" value={addressData.houseNumber} onChange={(e) => handleAddressDataChange("houseNumber", e.target.value)} placeholder="123" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="ZIP Code" value={addressData.zipCode} onChange={(e) => handleAddressDataChange("zipCode", e.target.value)} placeholder="12345" />
                <FormField label="City" value={addressData.city} onChange={(e) => handleAddressDataChange("city", e.target.value)} placeholder="Berlin" />
              </div>

              <div>
                <label className="text-sm text-content-secondary block mb-2">Country</label>
                <CustomSelect
                  name="country"
                  value={addressData.country}
                  onChange={(e) => handleAddressDataChange("country", e.target.value)}
                  placeholder={countriesLoading ? "Loading countries..." : "Select a country"}
                  searchable
                  options={countries.map((country) => ({
                    value: country.name,
                    label: country.name,
                  }))}
                  disabled={countriesLoading}
                />
              </div>
            </div>

            <FormActions onSave={handleAddressDataSubmit} onCancel={() => setIsEditingAddress(false)} />
          </div>
        </div>
      )}

      {/* Edit Contact Popup — matches EditMemberModal */}
      {isEditingContact && (
        <div className="fixed inset-0 bg-black/50 flex p-2 justify-center items-center z-50 overflow-y-auto">
          <div className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-md my-4 md:my-8 relative max-h-[95vh] md:max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-content-primary font-bold">Edit Contact Details</h2>
              <button onClick={() => setIsEditingContact(false)} className="text-content-muted hover:text-content-primary transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
              <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Contact Information</div>

              <FormField label="Email" type="email" value={contactData.email} onChange={(e) => handleContactDataChange("email", e.target.value)} required />

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Mobile Number" type="tel" value={contactData.phone} onChange={(e) => handleContactDataChange("phone", e.target.value)} placeholder="+49 123 456789" />
                <FormField label="Telephone Number" type="tel" value={contactData.telephoneNumber} onChange={(e) => handleContactDataChange("telephoneNumber", e.target.value)} placeholder="030 12345678" />
              </div>
            </div>

            <FormActions onSave={handleContactDataSubmit} onCancel={() => setIsEditingContact(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default StudioMenu
