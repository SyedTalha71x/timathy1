/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react"
import ImprintPopup from "../../components/member-panel-components/studio-menu-components/ImprintPopup"
import TermsPopup from "../../components/member-panel-components/studio-menu-components/TermsPopup"
import PrivacyPopup from "../../components/member-panel-components/studio-menu-components/PrivacyPopup"
import PaymentMethodPopup from "../../components/member-panel-components/studio-menu-components/PaymentMethodPopup"
import CancelMembershipPopup from "../../components/member-panel-components/studio-menu-components/CancelMembershipPopup"
import IdlePeriodFormPopup from "../../components/member-panel-components/studio-menu-components/IdlePeriodFormPopup"
import { useDispatch, useSelector } from "react-redux"
// import { fetchMyStudio } from "../../features/studio/studioSlice"
const StudioMenu = () => {
  const { member, loading, error } = useSelector((state) => state.members);
  const { user } = useSelector((state) => state.auth)
  const { studio } = useSelector((state) => state.studios);
  // const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState("info")
  const [showImprintPopup, setShowImprintPopup] = useState(false)
  const [showTermsPopup, setShowTermsPopup] = useState(false)
  const [showPrivacyPopup, setShowPrivacyPopup] = useState(false)
  const [showPaymentMethodPopup, setShowPaymentMethodPopup] = useState(false)
  const [showCancelMembershipPopup, setShowCancelMembershipPopup] = useState(false)
  const [showIdlePeriodForm, setShowIdlePeriodForm] = useState(false)
  const [expandedMemberSection, setExpandedMemberSection] = useState("")

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

  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [isEditingContact, setIsEditingContact] = useState(false)

  const [personalData, setPersonalData] = useState({
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "01/01/1990",
    gender: "Male",
  })

  const [addressData, setAddressData] = useState({
    street: "Musterstraße",
    houseNumber: "123",
    zipCode: "10117",
    city: "Berlin",
    country: "Germany",
  })

  const [contactData, setContactData] = useState({
    email: "john.doe@email.com",
    phone: "+49 30 1234 5678",
  })

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
      image: "https://e7.pngegg.com/pngimages/440/166/png-clipart-public-holiday-samsung-galaxy-s6-edge-android-android-text-calendar.png" // Added image
    },
    {
      id: 2,
      title: "New Equipment Arrived!",
      content: "Check out our new cardio machines in the main workout area. We've added 5 new treadmills, 3 elliptical trainers, and a complete set of free weights.",
      date: "2025-01-18",
      type: "update",
      priority: "high",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3pCKrt2I8JSBOv4piL9p1FEadf2zvwD-eOA&s" // Added image
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
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLkR_cD_bdePwOvW_Ondondo2eM3Wytmf5aw&s" // Added image
    }
  ])

  // studio data fetching
  // useEffect(() => {
  //   dispatch(fetchMyStudio())
  // }, [dispatch]);



  // Function to get border color based on message type
  const getBorderColor = (type) => {
    switch (type) {
      case 'info': return 'border-blue-500'
      case 'update': return 'border-green-500'
      case 'maintenance': return 'border-yellow-500'
      case 'class': return 'border-purple-500'
      default: return 'border-orange-500'
    }
  }

  // Function to get tag color based on message type
  const getTagColor = (type) => {
    switch (type) {
      case 'info': return 'bg-blue-500/20 text-blue-400'
      case 'update': return 'bg-green-500/20 text-green-400'
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400'
      case 'class': return 'bg-purple-500/20 text-purple-400'
      default: return 'bg-orange-500/20 text-orange-400'
    }
  }

  // Full screen image viewer component
  const ImageViewer = () => {
    if (!viewingPost) return null

    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="relative max-w-4xl max-h-[90vh] w-full">
          <button
            onClick={() => setViewingPost(null)}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={viewingPost.image}
              alt="Full size"
              className="w-full h-auto max-h-[70vh] object-contain"
            />
            <div className="p-4 bg-gray-900">
              <h3 className="text-white font-bold text-lg mb-2">{viewingPost.title}</h3>
              <p className="text-gray-300 text-sm">{viewingPost.content}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(viewingPost.type)}`}>
                  {viewingPost.type}
                </span>
                <span className="text-gray-400 text-xs">{viewingPost.date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Rest of your existing functions remain the same...
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

        // Start QR code detection
        scanForQRCode()
      }
    } catch (error) {
      setCameraError("Camera access denied or not available")
      setIsScanning(false)
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

        // Simple QR code detection simulation
        setTimeout(() => {
          if (isScanning) {
            handleSuccessfulScan("FITZONE_CHECKIN_" + Date.now())
          }
        }, 3000)
      }
    }, 100)
  }

  const handleSuccessfulScan = (qrData) => {
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
  }, [])

  const handlePersonalDataChange = (field, value) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddressDataChange = (field, value) => {
    setAddressData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContactDataChange = (field, value) => {
    setContactData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePersonalDataSubmit = () => {
    console.log("Requesting personal data change:", personalData)
    alert("Personal data change request submitted successfully!")
    setIsEditingPersonal(false)
  }

  const handleAddressDataSubmit = () => {
    console.log("Requesting address change:", addressData)
    alert("Address change request submitted successfully!")
    setIsEditingAddress(false)
  }

  const handleContactDataSubmit = () => {
    console.log("Requesting contact data change:", contactData)
    alert("Contact data change request submitted successfully!")
    setIsEditingContact(false)
  }

  const studioAddress = `${studio?.street}, ${studio?.zipCode} ${studio?.city}, ${studio?.country}`;



  return (
    <div className="min-h-screen rounded-3xl bg-[#1C1C1C] p-2 md:p-6">
      {/* Image Viewer Modal */}
      <ImageViewer />

      <div className="text-center border-b md:py-0 py-2 border-gray-700">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white oxanium_font text-lg sm:text-xl mb-3 md:text-2xl">{studio?.studioName || "Default Studio"}</h1>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-700 bg-gray-800/50 rounded-lg mt-4 sm:mt-6 overflow-x-auto">
        <div className="flex min-w-max w-full">
          <button
            onClick={() => setActiveSection("checkin")}
            className={`flex-1 min-w-[90px] py-2.5 sm:py-3 px-3 sm:px-4 text-center font-medium text-xs sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap ${activeSection === "checkin"
              ? "text-orange-400 bg-gray-700 border-b-2 border-orange-400"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
          >
            Check-in
          </button>
          <button
            onClick={() => setActiveSection("bulletin")}
            className={`flex-1 min-w-[90px] py-2.5 sm:py-3 px-3 sm:px-4 text-center font-medium text-xs sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap ${activeSection === "bulletin"
              ? "text-orange-400 bg-gray-700 border-b-2 border-orange-400"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
          >
            Bulletin Board
          </button>
          <button
            onClick={() => setActiveSection("info")}
            className={`flex-1 min-w-[90px] py-2.5 sm:py-3 px-3 sm:px-4 text-center font-medium text-xs sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap ${activeSection === "info"
              ? "text-orange-400 bg-gray-700 border-b-2 border-orange-400"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
          >
            Studio Info
          </button>
          <button
            onClick={() => setActiveSection("data")}
            className={`flex-1 min-w-[90px] py-2.5 sm:py-3 px-3 sm:px-4 text-center font-medium text-xs sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap ${activeSection === "data"
              ? "text-orange-400 bg-gray-700 border-b-2 border-orange-400"
              : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
          >
            Studio Data
          </button>
        </div>
      </div>

      <div className="p-2 md:p-4 mt-3 sm:mt-4">
        {activeSection === "checkin" && (
          // ... (checkin section remains exactly the same)
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                QR Code Check-in
              </h2>

              {!isScanning ? (
                <div className="text-center">
                  <div className="mb-4">
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    <p className="text-gray-300 mb-2 text-sm sm:text-base">Scan the QR code at the studio entrance to check in</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Make sure to allow camera access when prompted</p>
                  </div>

                  {cameraError && (
                    <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-3 mb-4">
                      <p className="text-red-400 text-xs sm:text-sm">{cameraError}</p>
                    </div>
                  )}

                  <button
                    onClick={startScanning}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors flex items-center mx-auto text-sm sm:text-base"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Start QR Scanner
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                    <video ref={videoRef} className="w-full h-48 sm:h-56 md:h-64 object-cover" playsInline muted />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Scanner overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-36 h-36 sm:w-48 sm:h-48 border-2 border-orange-500 rounded-lg relative">
                        <div className="absolute top-0 left-0 w-5 h-5 sm:w-6 sm:h-6 border-t-4 border-l-4 border-orange-500"></div>
                        <div className="absolute top-0 right-0 w-5 h-5 sm:w-6 sm:h-6 border-t-4 border-r-4 border-orange-500"></div>
                        <div className="absolute bottom-0 left-0 w-5 h-5 sm:w-6 sm:h-6 border-b-4 border-l-4 border-orange-500"></div>
                        <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 border-b-4 border-r-4 border-orange-500"></div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 text-sm sm:text-base">Position the QR code within the frame</p>

                  <button
                    onClick={stopScanning}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    Cancel Scan
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === "info" && (
          // ... (info section remains exactly the same)
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="p-3 sm:p-4">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  Our Location
                </h2>
              </div>
              {/* <div className="relative h-40 sm:h-48 md:h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.4089999856944!2d13.404953977047!3d52.520008172099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851c655f20989%3A0x26bbfb4e84674c63!2sBrandenburg%20Gate!5e0!3m2!1sen!2sde!4v1642584825542!5m2!1sen!2sde"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-b-xl"
                ></iframe>
                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg">
                  <div className="text-xs sm:text-sm font-semibold">{studio?.street}</div>
                  <div className="text-[10px] sm:text-xs text-gray-300">{studio?.street} {studio?.zipCode} {studio?.city}</div>
                </div>
              </div> */}

              {/* embedded location  */}
              <div className="relative h-40 sm:h-48 md:h-64">
                {studio && (
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      studioAddress
                    )}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-b-xl"
                  />
                )}

                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg">
                  <div className="text-xs sm:text-sm font-semibold">
                    {studio?.street}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-300">
                    {studio?.street} {studio?.zipCode} {studio?.city}
                  </div>
                </div>
              </div>

            </div>

            <div className="grid gap-4 sm:gap-4 md:grid-cols-2">
              {/* Opening Hours */}
              {/* <div className="bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                  Opening Hours
                </h2>
                <div className="grid gap-2 sm:gap-3">
                  {[
                    { day: "Monday", hours: "06:00 - 22:00", isToday: false },
                    { day: "Tuesday", hours: "06:00 - 22:00", isToday: false },
                    { day: "Wednesday", hours: "06:00 - 22:00", isToday: false },
                    { day: "Thursday", hours: "06:00 - 22:00", isToday: false },
                    { day: "Friday", hours: "06:00 - 22:00", isToday: true },
                    { day: "Saturday", hours: "08:00 - 20:00", isToday: false },
                    { day: "Sunday", hours: "09:00 - 18:00", isToday: false },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm ${item.isToday ? "bg-orange-500/20 border border-orange-500/30" : "bg-gray-700/50"
                        }`}
                    >
                      <span className={`font-medium ${item.isToday ? "text-orange-400" : "text-gray-300"}`}>
                        {item.day}
                        {item.isToday && (
                          <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs bg-orange-500 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-white">Today</span>
                        )}
                      </span>
                      <span className={`${item.isToday ? "text-orange-300" : "text-gray-400"}`}>{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* integrated code with backend */}
              <div className="bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                  Opening Hours
                </h2>
                <div className="grid gap-2 sm:gap-3">
                  {studio?.openingHours?.map((dayObj, index) => {
                    // if (dayObj.isClosed) return null; // skip closed days

                    // Determine if this is today
                    const todayIndex = new Date().getDay(); // Sunday = 0
                    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    const isToday = dayObj.day === days[todayIndex];

                    return (
                      <div
                        key={index}
                        className={`flex justify-between items-center py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm ${isToday ? "bg-orange-500/20 border border-orange-500/30" : "bg-gray-700/50"}`}
                      >
                        <span className={`font-medium ${isToday ? "text-orange-400" : "text-gray-300"}`}>
                          {dayObj.day}
                          {isToday && (
                            <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs bg-orange-500 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-white">
                              Today
                            </span>
                          )}
                        </span>
                        <span className={`${isToday ? "text-orange-300" : "text-gray-400"}`}>
                          {dayObj.open} - {dayObj.close}
                        </span>
                      </div>
                    );
                  })}
                </div>

              </div>




              {/* Contact Info */}
              <div className="bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg">
                <h3 className="text-base sm:text-lg font-bold text-white mb-3">Contact Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-300 text-sm sm:text-base">
                    <svg className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                    <span className="break-all">{studio?.phone || "+49 30 1234 5678"}</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm sm:text-base">
                    <svg className="w-4 h-4 mr-3 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    <span className="break-all">{studio?.email || "info@fitzonestudio.de"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg">
              <div className="space-y-3">
                <button
                  onClick={() => setShowImprintPopup(true)}
                  className="flex justify-between items-center w-full group"
                >
                  <span className="text-base sm:text-lg font-medium text-orange-400 group-hover:text-orange-300 transition-colors">
                    Imprint
                  </span>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 group-hover:text-orange-300 transition-colors flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => setShowTermsPopup(true)}
                  className="flex justify-between items-center w-full group"
                >
                  <span className="text-base sm:text-lg font-medium text-orange-400 group-hover:text-orange-300 transition-colors">
                    Terms & Conditions
                  </span>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 group-hover:text-orange-300 transition-colors flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => setShowPrivacyPopup(true)}
                  className="flex justify-between items-center w-full group"
                >
                  <span className="text-base sm:text-lg font-medium text-orange-400 group-hover:text-orange-300 transition-colors">
                    Privacy Policy
                  </span>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 group-hover:text-orange-300 transition-colors flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === "data" && (
          // ... (data section remains exactly the same)
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                  </svg>
                  Idle Periods
                </h3>
                <button
                  onClick={() => setShowIdlePeriodForm(true)}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Apply for Idle Period
                </button>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex-1">
                      <span className="text-white font-medium text-sm sm:text-base block">Current Idle Period</span>
                      <p className="text-gray-400 text-xs sm:text-sm">Vacation - Jan 20, 2025 to Feb 5, 2025</p>
                    </div>
                    <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">Active</span>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex-1">
                      <span className="text-white font-medium text-sm sm:text-base block">Past Idle Period</span>
                      <p className="text-gray-400 text-xs sm:text-sm">Medical - Dec 1, 2024 to Dec 15, 2024</p>
                    </div>
                    <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs">Completed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-700">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                Contract Information
              </h3>
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2 mb-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-2.5 sm:p-3 gap-1">
                    <span className="text-gray-400 text-xs sm:text-sm">Contract Type:</span>
                    <span className="text-white text-sm sm:text-base">Premium Annual</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-2.5 sm:p-3 gap-1">
                    <span className="text-gray-400 text-xs sm:text-sm">Status:</span>
                    <span className="flex items-center text-green-400 text-sm sm:text-base">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Active
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-2.5 sm:p-3 gap-1">
                    <span className="text-gray-400 text-xs sm:text-sm">Start Date:</span>
                    <span className="text-white text-sm sm:text-base">January 15, 2025</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-2.5 sm:p-3 gap-1">
                    <span className="text-gray-400 text-xs sm:text-sm">Fee:</span>
                    <span className="text-white font-bold text-sm sm:text-base">€79.99/month</span>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-2.5 sm:p-3 gap-1">
                    <span className="text-gray-400 text-xs sm:text-sm">Last Cancellation Date:</span>
                    <span className="text-white text-sm sm:text-base">December 15, 2025</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-2.5 sm:p-3 gap-1">
                    <span className="text-gray-400 text-xs sm:text-sm">Contract Duration:</span>
                    <span className="text-white text-sm sm:text-base">12 months</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between bg-gray-700/50 rounded-lg p-2.5 sm:p-3 gap-1">
                    <span className="text-gray-400 text-xs sm:text-sm">Period of Notice:</span>
                    <span className="text-white text-sm sm:text-base">1 month</span>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-2.5 sm:p-3">
                    <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors text-xs sm:text-sm">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                      View Contract Document
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCancelMembershipPopup(true)}
                className="w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 py-2.5 sm:py-3 px-4 rounded-lg transition-colors border border-red-800/30 text-sm sm:text-base"
              >
                Cancel Membership
              </button>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-700">
              <button
                onClick={() => setShowPaymentMethodPopup(true)}
                className="flex justify-between items-center w-full group"
              >
                <h3 className="text-lg sm:text-xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                  </svg>
                  Payment Method
                </h3>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 group-hover:text-orange-300 transition-colors flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg border border-gray-700">
              <h3 className="text-lg sm:text-xl font-bold text-orange-400 mb-4 flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                </svg>
                Member Data
              </h3>

              <div className="space-y-2 sm:space-y-3 mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-700/50 rounded-lg p-2.5 sm:p-3 gap-1">
                  <span className="text-gray-400 text-xs sm:text-sm">Member Number:</span>
                  <span className="text-white font-mono text-xs sm:text-sm">{member?.memberNumber}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-700/50 rounded-lg p-2.5 sm:p-3 gap-1">
                  <span className="text-gray-400 text-xs sm:text-sm">Member Since:</span>
                  <span className="text-white text-xs sm:text-sm">{new Date(member?.dateOfBirth).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</span>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <button
                  onClick={() => setExpandedMemberSection(expandedMemberSection === "personal" ? "" : "personal")}
                  className="flex justify-between items-center w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  <span className="text-gray-300 group-hover:text-white text-sm sm:text-base">Personal Data</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-all flex-shrink-0 ${expandedMemberSection === "personal" ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {expandedMemberSection === "personal" && (
                  <div className="bg-gray-700/30 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                    {!isEditingPersonal ? (
                      <>
                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                          <span className="text-gray-400 text-xs sm:text-sm">First Name:</span>
                          <span className="text-white text-sm sm:text-base">{member?.firstName}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                          <span className="text-gray-400 text-xs sm:text-sm">Last Name:</span>
                          <span className="text-white text-sm sm:text-base">{member?.lastName}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                          <span className="text-gray-400 text-xs sm:text-sm">Date of Birth:</span>
                          <span className="text-white text-sm sm:text-base">{new Date(member?.dateOfBirth).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                          <span className="text-gray-400 text-xs sm:text-sm">Gender:</span>
                          <span className="text-white text-sm sm:text-base">{member?.gender}</span>
                        </div>
                        <button
                          onClick={() => setIsEditingPersonal(true)}
                          className="w-full mt-2 sm:mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                        >
                          Edit Personal Data
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <label className="block text-gray-400 text-xs sm:text-sm mb-1">First Name</label>
                            <input
                              type="text"
                              value={personalData.firstName}
                              onChange={(e) => handlePersonalDataChange("firstName", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2 text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-xs sm:text-sm mb-1">Last Name</label>
                            <input
                              type="text"
                              value={personalData.lastName}
                              onChange={(e) => handlePersonalDataChange("lastName", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2 text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-xs sm:text-sm mb-1">Date of Birth</label>
                            <input
                              type="text"
                              value={personalData.dateOfBirth}
                              onChange={(e) => handlePersonalDataChange("dateOfBirth", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2 text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-xs sm:text-sm mb-1">Gender</label>
                            <select
                              value={personalData.gender}
                              onChange={(e) => handlePersonalDataChange("gender", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2 text-sm sm:text-base"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={handlePersonalDataSubmit}
                              className="flex-1 bg-orange-500 hover:bg-orange-700 cursor-pointer text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                            >
                              Request Change
                            </button>
                            <button
                              onClick={() => setIsEditingPersonal(false)}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setExpandedMemberSection(expandedMemberSection === "address" ? "" : "address")}
                  className="flex justify-between items-center w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  <span className="text-gray-300 group-hover:text-white text-sm sm:text-base">Address</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-all flex-shrink-0 ${expandedMemberSection === "address" ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {expandedMemberSection === "address" && (
                  <div className="bg-gray-700/30 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                    {!isEditingAddress ? (
                      <>
                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                          <span className="text-gray-400 text-xs sm:text-sm">Street:</span>
                          <span className="text-white text-sm sm:text-base">{member?.street}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                          <span className="text-gray-400 text-xs sm:text-sm">House Number:</span>
                          <span className="text-white text-sm sm:text-base">{member?.houseNumber}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                          <span className="text-gray-400 text-xs sm:text-sm">Zip Code:</span>
                          <span className="text-white text-sm sm:text-base">{member?.zipCode}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                          <span className="text-gray-400 text-xs sm:text-sm">City:</span>
                          <span className="text-white text-sm sm:text-base">{member?.city}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                          <span className="text-gray-400 text-xs sm:text-sm">Country:</span>
                          <span className="text-white text-sm sm:text-base">{member?.country}</span>
                        </div>
                        <button
                          onClick={() => setIsEditingAddress(true)}
                          className="w-full mt-2 sm:mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                        >
                          Edit Address
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <label className="block text-gray-400 text-xs sm:text-sm mb-1">Street</label>
                            <input
                              type="text"
                              value={addressData.street}
                              onChange={(e) => handleAddressDataChange("street", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2 text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-xs sm:text-sm mb-1">House Number</label>
                            <input
                              type="text"
                              value={addressData.houseNumber}
                              onChange={(e) => handleAddressDataChange("houseNumber", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2 text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-xs sm:text-sm mb-1">Zip Code</label>
                            <input
                              type="text"
                              value={addressData.zipCode}
                              onChange={(e) => handleAddressDataChange("zipCode", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2 text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-xs sm:text-sm mb-1">City</label>
                            <input
                              type="text"
                              value={addressData.city}
                              onChange={(e) => handleAddressDataChange("city", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2 text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-xs sm:text-sm mb-1">Country</label>
                            <input
                              type="text"
                              value={addressData.country}
                              onChange={(e) => handleAddressDataChange("country", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2 text-sm sm:text-base"
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={handleAddressDataSubmit}
                              className="flex-1 bg-orange-500 hover:bg-orange-700 cursor-pointer text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                            >
                              Request Change
                            </button>
                            <button
                              onClick={() => setIsEditingAddress(false)}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setExpandedMemberSection(expandedMemberSection === "contact" ? "" : "contact")}
                  className="flex justify-between items-center w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  <span className="text-gray-300 group-hover:text-white text-sm sm:text-base">Contact Details</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-all flex-shrink-0 ${expandedMemberSection === "contact" ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {expandedMemberSection === "contact" && (
                  <div className="bg-gray-700/30 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                    {!isEditingContact ? (
                      <>
                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                          <span className="text-gray-400 text-xs sm:text-sm">Email:</span>
                          <span className="text-white text-sm sm:text-base break-all">{member?.email}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between gap-1">
                          <span className="text-gray-400 text-xs sm:text-sm">Phone:</span>
                          <span className="text-white text-sm sm:text-base">{member?.phone}</span>
                        </div>
                        <button
                          onClick={() => setIsEditingContact(true)}
                          className="w-full mt-2 sm:mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                        >
                          Edit Contact Details
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <label className="block text-gray-400 text-xs sm:text-sm mb-1">Email</label>
                            <input
                              type="email"
                              value={contactData.email}
                              onChange={(e) => handleContactDataChange("email", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2 text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-xs sm:text-sm mb-1">Phone</label>
                            <input
                              type="tel"
                              value={contactData.phone}
                              onChange={(e) => handleContactDataChange("phone", e.target.value)}
                              className="w-full bg-gray-600 text-white rounded-lg p-2 text-sm sm:text-base"
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={handleContactDataSubmit}
                              className="flex-1 bg-orange-500 hover:bg-orange-700 cursor-pointer text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                            >
                              Request Change
                            </button>
                            <button
                              onClick={() => setIsEditingContact(false)}
                              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === "bulletin" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-800 rounded-xl p-4 sm:p-5 md:p-6 shadow-lg">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                  <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" />
                </svg>
                Bulletin Board
              </h2>

              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`bg-gray-700/50 rounded-xl p-3 sm:p-4 border-l-4 ${getBorderColor(message.type)} hover:bg-gray-700 transition-colors cursor-pointer`}
                  >
                    {message.image && (
                      <div className="relative mb-3 rounded-lg overflow-hidden border border-gray-700 h-40">
                        <img
                          src={message.image}
                          alt={message.title}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setViewingPost(message)}
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded transition-colors"
                          title="View full size"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5" />
                          </svg>
                        </button>
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="text-white font-semibold text-base sm:text-lg flex-1">{message.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getTagColor(message.type)}`}>
                        {message.type}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm mb-3">{message.content}</p>

                  </div>
                ))}
              </div>

              {messages.length === 0 && (
                <div className="text-center py-6 sm:py-8">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-400 text-sm sm:text-base">No announcements at the moment.</p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">Check back later for updates!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showImprintPopup && <ImprintPopup onClose={() => setShowImprintPopup(false)} studio={studio} />}
      {showTermsPopup && <TermsPopup onClose={() => setShowTermsPopup(false)} studio={studio} />}
      {showPrivacyPopup && <PrivacyPopup onClose={() => setShowPrivacyPopup(false)} studio={studio} />}

      <PaymentMethodPopup show={showPaymentMethodPopup} onClose={() => setShowPaymentMethodPopup(false)} />
      <CancelMembershipPopup show={showCancelMembershipPopup} onClose={() => setShowCancelMembershipPopup(false)} />
      <IdlePeriodFormPopup show={showIdlePeriodForm} onClose={() => setShowIdlePeriodForm(false)} />
    </div>
  )
}

export default StudioMenu